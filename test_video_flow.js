const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const PORT = 8092;
const BASE_URL = `http://localhost:${PORT}`;
const WORKSPACE_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp'
};

function startServer() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      let reqPath = req.url.split('?')[0];
      if (reqPath === '/') reqPath = '/index.html';
      const filePath = path.join(WORKSPACE_DIR, reqPath);

      fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end(`404 Not Found: ${reqPath}`);
          return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        res.writeHead(200, {
          'Content-Type': contentType,
          'Access-Control-Allow-Origin': '*'
        });
        fs.createReadStream(filePath).pipe(res);
      });
    });

    server.listen(PORT, (err) => {
      if (err) return reject(err);
      console.log(`[HTTP Server] Running at ${BASE_URL}`);
      resolve(server);
    });
  });
}

async function runTests() {
  const server = await startServer();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.error('[Browser Error]', msg.text());
      errors.push(msg.text());
    }
  });

  page.on('pageerror', err => {
    console.error('[Page Error]', err);
    errors.push(err.toString());
  });

  console.log('1. Testing index.html loading...');
  await page.goto(`${BASE_URL}/index.html`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  console.log('2. Testing Video Tab Selection & URL Preview...');
  const videoTabBtn = await page.$('.media-tab-btn[data-tab="tabVideo"]');
  if (videoTabBtn) {
    await videoTabBtn.click();
    await page.waitForTimeout(300);
  }

  // Test pasting Google Drive link into URL field
  const wishVideoUrl = await page.$('#wishVideoUrl');
  if (wishVideoUrl) {
    await wishVideoUrl.fill('https://drive.google.com/file/d/1A2B3C4D5E6F7G8H9I0J_test/view');
    await wishVideoUrl.dispatchEvent('input');
    await page.waitForTimeout(500);

    const previewBoxVisible = await page.$eval('#videoPreviewBox', el => el.style.display !== 'none');
    console.log('   Google Drive Video Preview Box Visible:', previewBoxVisible);

    const previewHtml = await page.$eval('#videoPreviewContainer', el => el.innerHTML);
    const hasDriveIframe = previewHtml.includes('drive.google.com/file/d/1A2B3C4D5E6F7G8H9I0J_test/preview');
    console.log('   Google Drive Iframe generated correctly:', hasDriveIframe);
  }

  // Test YouTube URL
  if (wishVideoUrl) {
    await wishVideoUrl.fill('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    await wishVideoUrl.dispatchEvent('input');
    await page.waitForTimeout(500);

    const ytHtml = await page.$eval('#videoPreviewContainer', el => el.innerHTML);
    const hasYtIframe = ytHtml.includes('youtube.com/embed/dQw4w9WgXcQ');
    console.log('   YouTube Iframe generated correctly:', hasYtIframe);
  }

  console.log('3. Testing Video Note Submission on Pre-Launch Wish Form...');
  const guestName = await page.$('#guestName');
  const guestWish = await page.$('#guestWish');
  const submitWishBtn = await page.$('#submitWishBtn');

  if (guestName && guestWish && submitWishBtn) {
    await guestName.fill('Dilip');
    await guestWish.fill('May your birthday be as dazzling as starlight, Queen Nishika! 💖🎬');

    // Make sure video URL is set
    await wishVideoUrl.fill('https://drive.google.com/file/d/1QueenNishikaBirthdayReel/preview');
    await wishVideoUrl.dispatchEvent('input');

    await submitWishBtn.click();
    await page.waitForTimeout(1000);

    // Check if sticky note was added with video embed
    const stickyNotes = await page.$$('.sticky-note');
    console.log(`   Sticky notes count: ${stickyNotes.length}`);

    const hasVideoEmbed = await page.$eval('.sticky-notes-grid', grid => {
      return grid.innerHTML.includes('1QueenNishikaBirthdayReel') || grid.innerHTML.includes('gdrive-embed-container');
    });
    console.log('   Sticky Wish Wall contains newly submitted Google Drive Video:', hasVideoEmbed);
  }

  console.log('4. Testing Local Video File Upload & Progress Bar UI...');
  const sampleVideoBuffer = Buffer.from('AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAAAA==', 'base64');
  const tempVideoPath = path.join(WORKSPACE_DIR, 'test_sample_video.mp4');
  fs.writeFileSync(tempVideoPath, sampleVideoBuffer);

  try {
    // Select video tab
    const tabVideoBtn = await page.$('.media-tab-btn[data-tab="tabVideo"]');
    if (tabVideoBtn) await tabVideoBtn.click();

    // Attach file to input
    const fileInput = await page.$('#wishVideoInput');
    if (fileInput) {
      await fileInput.setInputFiles(tempVideoPath);
      await page.waitForTimeout(1000);

      const isProgressVisible = await page.$eval('#wishVideoUploadProgressBox', el => el.style.display !== 'none');
      console.log('   Video Upload Progress Box Active:', isProgressVisible);

      const progressTitle = await page.$eval('#wishVideoProgressTitle', el => el.textContent);
      console.log('   Progress Title:', progressTitle);

      const isVideoPlayerRendered = await page.$eval('#videoPreviewContainer', el => el.querySelector('video') !== null);
      console.log('   Instant Local Video Player Rendered:', isVideoPlayerRendered);
    }
  } finally {
    if (fs.existsSync(tempVideoPath)) fs.unlinkSync(tempVideoPath);
  }

  console.log('5. Testing Quick Media Studio Modal (Video Mode)...');
  const navAddMediaBtn = await page.$('#navAddMediaBtn');
  if (navAddMediaBtn) {
    await navAddMediaBtn.click();
    await page.waitForTimeout(500);

    const quickModeVideoBtn = await page.$('#quickModeVideoBtn');
    if (quickModeVideoBtn) {
      await quickModeVideoBtn.click();
      await page.waitForTimeout(300);

      const modalVideoUrlInput = await page.$('#modalVideoUrlInput');
      await modalVideoUrlInput.fill('https://drive.google.com/file/d/1RoyalDriveCelebrationVideo/view');
      await modalVideoUrlInput.dispatchEvent('input');
      await page.waitForTimeout(500);

      const modalPreviewHtml = await page.$eval('#modalVideoPreview', el => el.innerHTML);
      console.log('   Modal Google Drive preview generated:', modalPreviewHtml.includes('1RoyalDriveCelebrationVideo'));
    }
  }

  console.log('6. Testing main.html loading...');
  await page.goto(`${BASE_URL}/main.html?vip=unlocked`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  const mainWishSection = await page.$('#wishBoardSection');
  console.log('   main.html wishBoardSection present:', Boolean(mainWishSection));

  await browser.close();
  server.close();

  console.log('\n=== Test Summary ===');
  console.log('🎉 ALL VIDEO FLOW & LOCAL FILE & PREVIEW TESTS COMPLETED!');
}

runTests().catch(err => {
  console.error('Fatal Test Error:', err);
  process.exit(1);
});
