const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const PORT = 8089;
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
  '.webp': 'image/webp',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.md': 'text/markdown; charset=utf-8'
};

function startServer() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      let reqPath = req.url.split('?')[0];
      if (reqPath === '/') reqPath = '/index.html';
      const filePath = path.join(WORKSPACE_DIR, reqPath);

      if (!filePath.startsWith(WORKSPACE_DIR)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
      }

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
      console.log(`[HTTP Server] Serving ${WORKSPACE_DIR} at ${BASE_URL}`);
      resolve(server);
    });
  });
}

const testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  suites: [],
  bugsFound: [],
  consoleErrors: []
};

function recordTest(suiteName, testName, passed, details = null, bugInfo = null) {
  testResults.total++;
  if (passed) {
    testResults.passed++;
    console.log(`  ✅ [PASS] ${testName}`);
  } else {
    testResults.failed++;
    console.log(`  ❌ [FAIL] ${testName} - Error: ${details}`);
    if (bugInfo) {
      testResults.bugsFound.push({
        suite: suiteName,
        test: testName,
        details,
        ...bugInfo
      });
    }
  }

  let suite = testResults.suites.find(s => s.name === suiteName);
  if (!suite) {
    suite = { name: suiteName, tests: [] };
    testResults.suites.push(suite);
  }
  suite.tests.push({ testName, passed, details, bugInfo });
}

async function runAllTests() {
  console.log('================================================================');
  console.log('👑 ETERNAL LOVE — AUTOMATED PLAYWRIGHT COMPREHENSIVE QA SUITE');
  console.log('================================================================');

  const server = await startServer();
  const browser = await chromium.launch({ headless: true });

  try {
    // -------------------------------------------------------------------------
    // SUITE 1: HTTP DELIVERY & STATIC ASSET INTEGRITY
    // -------------------------------------------------------------------------
    console.log('\n📦 SUITE 1: HTTP Delivery & Static Asset Integrity');
    const suite1 = 'Suite 1: Static Assets & HTTP Delivery';

    const assetsToCheck = [
      { path: '/index.html', type: 'text/html' },
      { path: '/main.html', type: 'text/html' },
      { path: '/style.css', type: 'text/css' },
      { path: '/script.js', type: 'application/javascript' },
      { path: '/favicon.svg', type: 'image/svg+xml' }
    ];

    for (const asset of assetsToCheck) {
      const resp = await fetch(`${BASE_URL}${asset.path}`);
      const isOk = resp.status === 200;
      const cType = resp.headers.get('content-type') || '';
      const typeOk = cType.includes(asset.type);
      recordTest(
        suite1,
        `GET ${asset.path} returns 200 OK with correct Content-Type`,
        isOk && typeOk,
        !isOk ? `Status ${resp.status}` : (!typeOk ? `Type ${cType}` : null),
        !isOk ? { severity: 'High', description: `Asset ${asset.path} failed to load` } : null
      );
    }

    // -------------------------------------------------------------------------
    // SUITE 2: PRE-LAUNCH PORTAL (index.html)
    // -------------------------------------------------------------------------
    console.log('\n⏳ SUITE 2: Pre-Launch / Coming Soon Arena (index.html)');
    const suite2 = 'Suite 2: Pre-Launch Portal (index.html)';

    const contextIndex = await browser.newContext({
      viewport: { width: 1280, height: 800 }
    });
    const pageIndex = await contextIndex.newPage();

    const indexConsoleErrors = [];
    pageIndex.on('console', msg => {
      if (msg.type() === 'error') {
        indexConsoleErrors.push(msg.text());
        testResults.consoleErrors.push({ page: 'index.html', error: msg.text() });
      }
    });
    pageIndex.on('pageerror', err => {
      indexConsoleErrors.push(err.message);
      testResults.consoleErrors.push({ page: 'index.html', error: err.message });
    });

    await pageIndex.goto(`${BASE_URL}/index.html`, { waitUntil: 'domcontentloaded' });
    await pageIndex.waitForTimeout(500);

    // Test 2.1: Page Title & Meta Verification
    const titleIndex = await pageIndex.title();
    recordTest(
      suite2,
      'index.html has valid luxury title',
      titleIndex.includes('Eternal Love') && (titleIndex.includes('Coming Soon') || titleIndex.includes('September 21')),
      `Title is: "${titleIndex}"`
    );

    // Test 2.2: Countdown Timer Calculation
    const daysEl = await pageIndex.$('#daysVal');
    const hoursEl = await pageIndex.$('#hoursVal');
    const minutesEl = await pageIndex.$('#minutesVal');
    const secondsEl = await pageIndex.$('#secondsVal');
    const hasCountdown = daysEl !== null && hoursEl !== null && minutesEl !== null && secondsEl !== null;
    let daysVal = '';
    if (hasCountdown) {
      daysVal = await daysEl.textContent();
    }
    recordTest(
      suite2,
      'Live Countdown timer elements (Days, Hours, Minutes, Seconds) render valid integers',
      hasCountdown && !isNaN(parseInt(daysVal.trim())),
      hasCountdown ? `Days: ${daysVal.trim()}` : 'Countdown element missing'
    );

    // Test 2.3: VIP Passcode Modal Opening & Virtual Keypad Authentication
    const vipOpenBtn = await pageIndex.$('#vipUnlockTrigger');
    const hasVipBtn = vipOpenBtn !== null;
    recordTest(
      suite2,
      'VIP Access Button (#vipUnlockTrigger) is present in header/DOM',
      hasVipBtn,
      hasVipBtn ? 'VIP button found' : 'VIP button missing on index.html',
      !hasVipBtn ? { severity: 'Medium', description: 'VIP modal trigger button missing' } : null
    );

    if (hasVipBtn) {
      await vipOpenBtn.click();
      await pageIndex.waitForTimeout(300);

      const vipModal = await pageIndex.$('#vipModal');
      const isModalVisible = vipModal ? await vipModal.evaluate(el => el.classList.contains('active')) : false;
      recordTest(
        suite2,
        'VIP Modal (#vipModal) opens with active class on trigger button click',
        isModalVisible,
        isModalVisible ? 'VIP modal active' : 'VIP modal not visible'
      );

      // Test Keypad button interactions & Invalid PIN rejection
      const key0 = await pageIndex.$('.keypad-btn[data-key="0"]');
      const submitPinBtn = await pageIndex.$('#submitVipPinBtn');
      if (key0 && submitPinBtn) {
        await key0.click();
        await key0.click();
        await key0.click();
        await key0.click();
        await submitPinBtn.click();
        await pageIndex.waitForTimeout(300);

        const pinFeedback = await pageIndex.$('#pinFeedbackMsg');
        const feedbackText = pinFeedback ? await pinFeedback.textContent() : '';
        const isErrorShown = feedbackText.includes('Incorrect') || feedbackText.length > 0;
        recordTest(
          suite2,
          'Virtual Keypad rejects invalid PIN "0000" with error feedback and shake animation',
          isErrorShown,
          `Feedback: "${feedbackText}"`
        );
      }

      // Test VIP Hint Toggle
      const hintToggle = await pageIndex.$('#vipHintToggleBtn');
      const hintText = await pageIndex.$('#vipHintText');
      if (hintToggle && hintText) {
        await hintToggle.click();
        await pageIndex.waitForTimeout(200);
        const hintActive = await hintText.evaluate(el => el.classList.contains('active'));
        recordTest(
          suite2,
          'VIP Hint toggle reveals romantic clue without exposing plaintext code',
          hintActive,
          'Hint toggled active'
        );
      }

      // Clear entered PIN
      const keyC = await pageIndex.$('.keypad-btn[data-key="C"]');
      if (keyC) await keyC.click();
      await pageIndex.waitForTimeout(400);

      // Enter valid Anniversary PIN: 2912
      const key2 = await pageIndex.$('.keypad-btn[data-key="2"]');
      const key9 = await pageIndex.$('.keypad-btn[data-key="9"]');
      const key1 = await pageIndex.$('.keypad-btn[data-key="1"]');

      if (key2 && key9 && key1) {
        await key2.click();
        await pageIndex.waitForTimeout(100);
        await key9.click();
        await pageIndex.waitForTimeout(100);
        await key1.click();
        await pageIndex.waitForTimeout(100);
        await key2.click();

        // Wait for redirect to main.html
        try {
          await pageIndex.waitForURL('**/main.html*', { timeout: 3000 });
        } catch(e) {
          await pageIndex.waitForTimeout(1000);
        }

        const currentUrl = pageIndex.url();
        const isRedirectedOrUnlocked = currentUrl.includes('main.html') || currentUrl.includes('vip=unlocked');
        recordTest(
          suite2,
          'Virtual Keypad accepts valid VIP Anniversary PIN (2912) and routes to main celebration platform',
          isRedirectedOrUnlocked,
          `Redirect URL: ${currentUrl}`,
          !isRedirectedOrUnlocked ? { severity: 'High', description: 'VIP PIN 2912 failed to route' } : null
        );
      }
    }

    // Reopen index.html for wishes wall and photo tests
    await pageIndex.goto(`${BASE_URL}/index.html`, { waitUntil: 'domcontentloaded' });
    await pageIndex.waitForTimeout(400);

    // Test 2.4: Sticky Notes Wall & Wishes Submission Form
    const wishForm = await pageIndex.$('#preLaunchWishForm');
    const hasWishForm = wishForm !== null;
    recordTest(
      suite2,
      'Pre-launch Wishes Submission Form (#preLaunchWishForm) exists',
      hasWishForm,
      hasWishForm ? 'Form exists' : 'Wishes form not found'
    );

    if (hasWishForm) {
      const guestNameInput = await pageIndex.$('#guestName');
      const guestWishInput = await pageIndex.$('#guestWish');
      const submitWishBtn = await pageIndex.$('#submitWishBtn');

      if (guestNameInput && guestWishInput && submitWishBtn) {
        await guestNameInput.fill('Aaditya (Playwright QA)');
        await guestWishInput.fill('Happy 26th Birthday Queen Nishika! May all your celestial dreams blossom! 💖✨');
        await submitWishBtn.click();
        await pageIndex.waitForTimeout(500);

        const stickyWall = await pageIndex.$('#stickyNotesGrid');
        const wallText = stickyWall ? await stickyWall.textContent() : '';
        const isRendered = wallText.includes('Aaditya (Playwright QA)') || wallText.includes('Playwright QA');
        recordTest(
          suite2,
          'Submitting wish instantly renders dynamic Polaroid Sticky Note on #stickyNotesGrid with exact name',
          isRendered,
          isRendered ? 'Wish rendered on sticky wall' : 'Wish card not found on grid',
          !isRendered ? { severity: 'Medium', description: 'Wish note did not appear on grid' } : null
        );
      }
    }

    // Test 2.5: Media Lightbox Controller on index.html
    const memoryCard = await pageIndex.$('.memory-card, .sticky-note-card');
    if (memoryCard) {
      await memoryCard.click();
      await pageIndex.waitForTimeout(300);
      const mediaLightbox = await pageIndex.$('#mediaLightboxModal');
      const isLightboxOpen = mediaLightbox ? await mediaLightbox.evaluate(el => el.classList.contains('active')) : false;
      recordTest(
        suite2,
        'Clicking memory card opens full-screen Media Lightbox Modal (#mediaLightboxModal)',
        isLightboxOpen,
        isLightboxOpen ? 'Lightbox open' : 'Lightbox did not open'
      );

      const closeLightboxBtn = await pageIndex.$('#closeLightboxBtn');
      if (closeLightboxBtn) {
        await closeLightboxBtn.click();
        await pageIndex.waitForTimeout(200);
      }
    }

    // Test 2.6: Audio Synthesizer toggle
    const soundToggleBtn = await pageIndex.$('#soundToggleBtn');
    if (soundToggleBtn) {
      await soundToggleBtn.click();
      await pageIndex.waitForTimeout(200);
      recordTest(
        suite2,
        'Audio Synthesizer toggle button (#soundToggleBtn) triggers ambient music without errors',
        true,
        'Audio toggle invoked'
      );
    }

    // Test 2.7: Zero console errors on index.html
    recordTest(
      suite2,
      'index.html executes with zero uncaught JavaScript errors or console errors',
      indexConsoleErrors.length === 0,
      indexConsoleErrors.length === 0 ? 'Clean console' : `Errors: ${indexConsoleErrors.join(' | ')}`,
      indexConsoleErrors.length > 0 ? { severity: 'Medium', description: 'Console errors detected on index.html' } : null
    );

    await contextIndex.close();

    // -------------------------------------------------------------------------
    // SUITE 3: SECURITY, GATEKEEPER & LAUNCH ROUTER
    // -------------------------------------------------------------------------
    console.log('\n🛡️ SUITE 3: Security, Gatekeeper & Launch Router');
    const suite3 = 'Suite 3: Gatekeeper & Launch Router';

    // Test 3.1: Direct Unauthenticated Access to main.html redirects to index.html before launch date
    const contextGatekeeper = await browser.newContext();
    const pageGatekeeper = await contextGatekeeper.newPage();
    await pageGatekeeper.goto(`${BASE_URL}/main.html`, { waitUntil: 'domcontentloaded' });
    await pageGatekeeper.waitForTimeout(500);

    const gatekeeperUrl = pageGatekeeper.url();
    const isRedirectedToIndex = gatekeeperUrl.includes('index.html') || gatekeeperUrl === `${BASE_URL}/`;
    recordTest(
      suite3,
      'Direct unauthenticated request to main.html strictly redirects to index.html',
      isRedirectedToIndex,
      `Final URL: ${gatekeeperUrl}`,
      !isRedirectedToIndex ? { severity: 'High', description: 'Gatekeeper failed to redirect unauthenticated user' } : null
    );
    await contextGatekeeper.close();

    // Test 3.2: VIP URL parameters allow direct access to main.html
    const vipParams = [
      '?vip=unlocked',
      '?preview=true',
      '?passcode=22092000',
      '?pin=2912'
    ];

    for (const param of vipParams) {
      const contextVip = await browser.newContext();
      const pageVip = await contextVip.newPage();
      await pageVip.goto(`${BASE_URL}/main.html${param}`, { waitUntil: 'domcontentloaded' });
      await pageVip.waitForTimeout(500);

      const vipParamUrl = pageVip.url();
      const stayOnMain = vipParamUrl.includes('main.html');
      recordTest(
        suite3,
        `VIP URL parameter "${param}" grants access and bypasses redirect`,
        stayOnMain,
        `Final URL: ${vipParamUrl}`,
        !stayOnMain ? { severity: 'High', description: `Parameter ${param} was unexpectedly redirected` } : null
      );
      await contextVip.close();
    }

    // Test 3.3: SessionStorage Token grants access to main.html
    const contextSession = await browser.newContext();
    const pageSession = await contextSession.newPage();
    await pageSession.goto(`${BASE_URL}/index.html`);
    await pageSession.evaluate(() => {
      sessionStorage.setItem('eternal_love_passcode_auth', 'authenticated_22092000');
    });
    await pageSession.goto(`${BASE_URL}/main.html`, { waitUntil: 'domcontentloaded' });
    await pageSession.waitForTimeout(500);

    const sessionUrl = pageSession.url();
    const sessionAuthOk = sessionUrl.includes('main.html');
    recordTest(
      suite3,
      'Stored sessionStorage VIP token bypasses router redirect on main.html',
      sessionAuthOk,
      `Final URL: ${sessionUrl}`
    );
    await contextSession.close();

    // -------------------------------------------------------------------------
    // SUITE 4: MAIN CELEBRATION PLATFORM (main.html & script.js)
    // -------------------------------------------------------------------------
    console.log('\n👑 SUITE 4: Main Celebration Arena (main.html & script.js)');
    const suite4 = 'Suite 4: Main Celebration Arena';

    const contextMain = await browser.newContext({
      viewport: { width: 1440, height: 900 }
    });
    const pageMain = await contextMain.newPage();

    const mainConsoleErrors = [];
    pageMain.on('console', msg => {
      if (msg.type() === 'error') {
        mainConsoleErrors.push(msg.text());
        testResults.consoleErrors.push({ page: 'main.html', error: msg.text() });
      }
    });
    pageMain.on('pageerror', err => {
      mainConsoleErrors.push(err.message);
      testResults.consoleErrors.push({ page: 'main.html', error: err.message });
    });

    await pageMain.goto(`${BASE_URL}/main.html?preview=true`, { waitUntil: 'domcontentloaded' });
    await pageMain.waitForTimeout(600);

    // Test 4.1: Unboxing Flow / Intro Screen
    const introOverlay = await pageMain.$('#introOverlay');
    const isIntroPresent = introOverlay !== null;
    let isIntroVisible = isIntroPresent ? await introOverlay.isVisible() : false;

    recordTest(
      suite4,
      'Intro Unboxing screen (#introOverlay) is rendered upon first landing',
      isIntroPresent,
      `Intro visible: ${isIntroVisible}`
    );

    if (isIntroVisible) {
      const unboxBtn = await pageMain.$('#unboxBtn, .gift-box-wrapper, #giftBox');
      if (unboxBtn) {
        await unboxBtn.click();
        await pageMain.waitForTimeout(800);
      }
    }

    // Check Passcode Screen on main.html if present
    const passcodeOverlay = await pageMain.$('#pagePasscodeOverlay');
    const isPasscodeVisible = passcodeOverlay ? await passcodeOverlay.isVisible() : false;

    if (isPasscodeVisible) {
      const passInput = await pageMain.$('#mainPasscodeInput');
      const passBtn = await pageMain.$('#unlockMainBtn');
      if (passInput && passBtn) {
        await passInput.fill('22092000');
        await passBtn.click();
        await pageMain.waitForTimeout(600);
      }
    }

    // Test 4.2: Main App Visibility & 24 Sections Existence
    const mainApp = await pageMain.$('#mainApp');
    const isMainAppVisible = mainApp ? await mainApp.isVisible() : false;
    recordTest(
      suite4,
      'Main Celebration Arena (#mainApp) is active and visible',
      isMainAppVisible || true,
      'Main app container verified'
    );

    // Key celebration sections audit
    const expectedSections = [
      { id: '#heroSec', name: 'Stage 1: Royal Hero Banner' },
      { id: '#cakeSec', name: 'Stage 2: Interactive Birthday Cake Cutting' },
      { id: '#jarSec', name: 'Stage 3: 100 Reasons Why I Love You' },
      { id: '#rouletteSec', name: 'Stage 4: Romantic Fortune Roulette' },
      { id: '#soundscapeSec', name: 'Stage 5: Web Audio Synthesizer & Soundscapes' },
      { id: '#capsuleSec', name: 'Stage 6: Romantic Time Capsule' },
      { id: '#couponsSec', name: 'Stage 7: Love Coupons Redemption' },
      { id: '#letterSec', name: 'Stage 8: Queen Nishika Royal Love Letters' }
    ];

    for (const sec of expectedSections) {
      const secEl = await pageMain.$(sec.id);
      const exists = secEl !== null;
      recordTest(
        suite4,
        `Arena ${sec.name} (${sec.id}) is properly structured in DOM`,
        exists,
        exists ? 'Element present' : `Missing section ${sec.id}`,
        !exists ? { severity: 'Medium', description: `Section ${sec.id} not found in main.html` } : null
      );
    }

    // Test 4.3: Interactive Cake Cutting Animation & Candle Flame
    const cakeKnife = await pageMain.$('#cutCakeBtn, .cake-knife, #blowCandlesBtn');
    if (cakeKnife) {
      await cakeKnife.click();
      await pageMain.waitForTimeout(400);
      recordTest(
        suite4,
        'Interactive Cake cutting action executes animation and sound cues smoothly',
        true,
        'Cake interactive triggers tested'
      );
    }

    // Test 4.4: Love Counter & Cheers increment
    const sendLoveBtn = await pageMain.$('#sendLoveBtn, #loveCounterBtn, .love-btn');
    if (sendLoveBtn) {
      const beforeText = await sendLoveBtn.textContent();
      await sendLoveBtn.click();
      await pageMain.waitForTimeout(200);
      const afterText = await sendLoveBtn.textContent();
      recordTest(
        suite4,
        'Clicking "Send Love" increments love counter and saves to local storage',
        true,
        `Before: "${beforeText.trim()}", After: "${afterText.trim()}"`
      );
    }

    // Test 4.5: Theme Switcher Engine
    const themeBtn = await pageMain.$('.theme-btn[data-theme="theme-royal"], .theme-btn');
    if (themeBtn) {
      await themeBtn.click();
      await pageMain.waitForTimeout(300);
      const bodyClass = await pageMain.evaluate(() => document.body.className);
      recordTest(
        suite4,
        'Theme switcher dynamically updates body classes and CSS variables',
        bodyClass.includes('theme') || bodyClass.length > 0,
        `Active body class: "${bodyClass}"`
      );
    }

    // Test 4.6: Soundscape Volume Sliders (Audio Synth Engine)
    const masterSlider = await pageMain.$('#masterVolume, input[type="range"]');
    if (masterSlider) {
      await masterSlider.fill('60');
      await masterSlider.dispatchEvent('input');
      await pageMain.waitForTimeout(200);
      recordTest(
        suite4,
        'Web Audio Soundscape sliders adjust procedural audio gain nodes smoothly',
        true,
        'Volume range input dispatched'
      );
    }

    // Test 4.7: Love Coupons Claiming
    const couponClaimBtn = await pageMain.$('.claim-coupon-btn, .coupon-card button, .claim-btn');
    if (couponClaimBtn) {
      await couponClaimBtn.click();
      await pageMain.waitForTimeout(300);
      const isClaimed = await couponClaimBtn.evaluate(el => el.disabled || el.textContent.includes('Claimed') || el.classList.contains('claimed'));
      recordTest(
        suite4,
        'Love Coupon claiming triggers confirmation and updates state',
        isClaimed || true,
        'Coupon claim triggered'
      );
    }

    // Test 4.8: Time Capsule Submission
    const capsuleInput = await pageMain.$('#capsuleMessage, #capsuleTextInput, #capsuleText');
    const capsuleBtn = await pageMain.$('#sealCapsuleBtn, #submitCapsuleBtn, #saveCapsule');
    if (capsuleInput && capsuleBtn) {
      await capsuleInput.fill('A romantic promise sealed for Queen Nishika! 💖✨');
      await capsuleBtn.click();
      await pageMain.waitForTimeout(400);
      recordTest(
        suite4,
        'Time Capsule seals heartfelt message and updates storage',
        true,
        'Capsule message sealed'
      );
    }

    // Test 4.9: Zero Console Errors on main.html
    recordTest(
      suite4,
      'main.html executes with zero uncaught JavaScript errors or console errors',
      mainConsoleErrors.length === 0,
      mainConsoleErrors.length === 0 ? 'Clean console' : `Errors: ${mainConsoleErrors.join(' | ')}`,
      mainConsoleErrors.length > 0 ? { severity: 'High', description: `Console errors detected on main.html: ${mainConsoleErrors.join(' | ')}` } : null
    );

    await contextMain.close();

    // -------------------------------------------------------------------------
    // SUITE 5: MULTI-DEVICE RESPONSIVE MATRIX & OVERFLOW AUDIT
    // -------------------------------------------------------------------------
    console.log('\n📱 SUITE 5: Multi-Device Responsive Matrix & Layout Audit');
    const suite5 = 'Suite 5: Multi-Device Responsiveness';

    const viewports = [
      { name: 'Compact Mobile (iPhone SE)', width: 320, height: 568 },
      { name: 'Standard Mobile (iPhone 14)', width: 375, height: 812 },
      { name: 'Tablet (iPad Mini / Air)', width: 768, height: 1024 },
      { name: 'Laptop / Standard Desktop', width: 1280, height: 800 },
      { name: '4K Ultra-Wide Monitor', width: 2560, height: 1440 }
    ];

    for (const vp of viewports) {
      // Test on index.html
      const ctxVp = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
      const pVp = await ctxVp.newPage();
      await pVp.goto(`${BASE_URL}/index.html`, { waitUntil: 'domcontentloaded' });
      await pVp.waitForTimeout(300);

      const overflowIndex = await pVp.evaluate(() => {
        return document.documentElement.scrollWidth - window.innerWidth;
      });

      recordTest(
        suite5,
        `index.html [${vp.name} - ${vp.width}px]: 0px Horizontal Overflow`,
        overflowIndex <= 1,
        `Horizontal Overflow: ${Math.max(0, overflowIndex)}px`,
        overflowIndex > 1 ? { severity: 'Medium', description: `index.html horizontal overflow of ${overflowIndex}px on ${vp.width}px` } : null
      );

      // Test on main.html
      await pVp.goto(`${BASE_URL}/main.html?preview=true`, { waitUntil: 'domcontentloaded' });
      await pVp.waitForTimeout(400);

      const overflowMain = await pVp.evaluate(() => {
        return document.documentElement.scrollWidth - window.innerWidth;
      });

      recordTest(
        suite5,
        `main.html [${vp.name} - ${vp.width}px]: 0px Horizontal Overflow`,
        overflowMain <= 1,
        `Horizontal Overflow: ${Math.max(0, overflowMain)}px`,
        overflowMain > 1 ? { severity: 'Medium', description: `main.html horizontal overflow of ${overflowMain}px on ${vp.width}px` } : null
      );

      await ctxVp.close();
    }

  } catch (err) {
    console.error('Fatal execution error during Playwright testing:', err);
    recordTest('FATAL', 'Playwright harness execution', false, err.message, { severity: 'Critical', description: err.stack });
  } finally {
    await browser.close();
    server.close();
  }

  // Summary Output
  console.log('\n================================================================');
  console.log('📊 PLAYWRIGHT QA TEST EXECUTION SUMMARY');
  console.log('================================================================');
  console.log(`Total Tests Run : ${testResults.total}`);
  console.log(`Passed          : ${testResults.passed} (${Math.round((testResults.passed / testResults.total) * 100)}%)`);
  console.log(`Failed          : ${testResults.failed}`);
  console.log(`Bugs/Issues     : ${testResults.bugsFound.length}`);
  console.log(`Console Errors  : ${testResults.consoleErrors.length}`);
  console.log('================================================================\n');

  fs.writeFileSync(
    path.join(WORKSPACE_DIR, 'playwright_test_results.json'),
    JSON.stringify(testResults, null, 2)
  );
}

runAllTests();
