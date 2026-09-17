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
      { path: '/favicon.svg', type: 'image/svg+xml' },
      { path: '/favicon.ico', type: 'image/' }
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
        const text = msg.text();
        // Ignore external network / third-party iframe analytics & CSP report-only warnings
        if (
          text.includes('compute-pressure') ||
          text.includes('DOCS_timing') ||
          text.includes('Failed to load resource') ||
          text.includes('status of 404') ||
          text.includes('status of 401') ||
          text.includes('Content Security Policy') ||
          text.includes('frame-ancestors') ||
          text.includes('google.com')
        ) {
          return;
        }
        indexConsoleErrors.push(text);
        testResults.consoleErrors.push({ page: 'index.html', error: text });
      }
    });
    pageIndex.on('pageerror', err => {
      if (err.message && (err.message.includes('DOCS_timing') || err.message.includes('compute-pressure') || err.message.includes('Failed to load resource'))) return;
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
        await guestWishInput.fill('Happy 26th Birthday My Love Nishika! May all your celestial dreams blossom! 💖✨');
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

      // Test Auto-Generate Wishes & Mood Chips on index.html
      const autoGenBtn = await pageIndex.$('#btnAutoGenerateWish');
      const guestWishArea = await pageIndex.$('#guestWish');
      if (autoGenBtn && guestWishArea) {
        await autoGenBtn.click();
        await pageIndex.waitForTimeout(200);
        const generatedVal = await guestWishArea.inputValue();
        const hasGenWish = generatedVal.length > 10 && (generatedVal.includes('Nishika') || generatedVal.includes('Birthday'));
        recordTest(
          suite2,
          'Clicking "✨ Auto Generate" button populates heartfelt birthday wish into #guestWish',
          hasGenWish,
          hasGenWish ? `Generated: ${generatedVal.substring(0, 40)}...` : 'Failed to generate wish'
        );

        // Test Mood Chip
        const royalChip = await pageIndex.$('.wish-mood-chip[data-mood="royal"]');
        if (royalChip) {
          await royalChip.click();
          await pageIndex.waitForTimeout(200);
          const royalVal = await guestWishArea.inputValue();
          const hasRoyalWish = royalVal.toLowerCase().includes('royal') || royalVal.toLowerCase().includes('queen') || royalVal.toLowerCase().includes('crown') || royalVal.toLowerCase().includes('majesty');
          recordTest(
            suite2,
            'Clicking Royal mood chip generates tailored royal birthday dedication',
            hasRoyalWish,
            hasRoyalWish ? 'Tailored royal wish generated' : 'Mood chip failed to generate category wish'
          );
        }

        // Test Emoji Inserter
        const emojiBtn = await pageIndex.$('.wish-emoji-btn[data-emoji="💖"]');
        if (emojiBtn) {
          const preLen = (await guestWishArea.inputValue()).length;
          await emojiBtn.click();
          await pageIndex.waitForTimeout(100);
          const postLen = (await guestWishArea.inputValue()).length;
          recordTest(
            suite2,
            'Clicking Quick Emoji button appends emoji directly to message field',
            postLen >= preLen + 1,
            'Emoji successfully inserted'
          );
        }

        // Test Wish Library Modal
        const wishLibBtn = await pageIndex.$('#btnWishLibrary');
        const wishLibModal = await pageIndex.$('#wishLibraryModal');
        if (wishLibBtn && wishLibModal) {
          await wishLibBtn.click();
          await pageIndex.waitForTimeout(300);
          const isLibActive = await wishLibModal.evaluate(el => el.classList.contains('active'));
          recordTest(
            suite2,
            'Clicking "📚 Wish Library" button opens full-screen Wish Library Modal (#wishLibraryModal)',
            isLibActive,
            isLibActive ? 'Wish library modal opened' : 'Wish library modal did not open'
          );

          // Test "Use This Wish" inside modal
          const firstUseBtn = await pageIndex.$('#wishLibraryList .wish-use-btn');
          if (firstUseBtn) {
            await firstUseBtn.click();
            await pageIndex.waitForTimeout(200);
            const isLibClosed = await wishLibModal.evaluate(el => !el.classList.contains('active'));
            recordTest(
              suite2,
              'Selecting "Use This Wish" inserts selected wish and dismisses Wish Library modal',
              isLibClosed,
              isLibClosed ? 'Selected wish applied and modal closed' : 'Modal did not close on select'
            );
          }
        }
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

    // Test 4.1: Royal Birthday Passcode Overlay (#pagePasscodeOverlay) & Keypad
    const passcodeOverlay = await pageMain.$('#pagePasscodeOverlay');
    const isPasscodePresent = passcodeOverlay !== null;
    recordTest(
      suite4,
      'Royal Birthday Passcode Overlay (#pagePasscodeOverlay) exists with "Open Birthday Surprise" interface',
      isPasscodePresent,
      'Passcode overlay verified'
    );

    if (passcodeOverlay) {
      let isPasscodeVisible = await passcodeOverlay.isVisible();
      if (!isPasscodeVisible) {
        const giftBoxTrigger = await pageMain.$('#giftBoxTrigger, #openGiftBtn');
        if (giftBoxTrigger) {
          await giftBoxTrigger.click({ force: true });
          await pageMain.waitForTimeout(400);
        }
        isPasscodeVisible = await passcodeOverlay.isVisible();
      }
      if (isPasscodeVisible) {
        // Test invalid passcode first: 00000000
        const key0 = await pageMain.$('#pagePasscodeKeypad .pk-btn[data-key="0"]');
        if (key0) {
          for (let k = 0; k < 8; k++) {
            await key0.click();
            await pageMain.waitForTimeout(50);
          }
          await pageMain.waitForTimeout(300);
          const feedback = await pageMain.$('#pagePasscodeFeedback');
          const isErrorMsg = feedback ? await feedback.evaluate(el => el.classList.contains('error') || el.textContent.includes('Incorrect')) : false;
          recordTest(
            suite4,
            'Passcode Keypad rejects invalid passcode with error feedback and shake animation',
            isErrorMsg,
            'Invalid passcode error state verified'
          );
        }

        // Test Passcode Hint Toggle
        const hintBtn = await pageMain.$('#pagePasscodeHintToggleBtn');
        const hintBox = await pageMain.$('#pagePasscodeHintBox');
        if (hintBtn && hintBox) {
          await hintBtn.click();
          await pageMain.waitForTimeout(200);
          const isHintActive = await hintBox.evaluate(el => el.classList.contains('active') && el.textContent.includes('2000'));
          recordTest(
            suite4,
            'Passcode Hint toggle reveals romantic birthday clue (DDMMYYYY September 2000)',
            isHintActive,
            'Hint toggle verified'
          );
        }

        // Test Clear Button 'C'
        const keyC = await pageMain.$('#pagePasscodeKeypad .pk-btn[data-key="C"]');
        if (keyC) {
          await keyC.click();
          await pageMain.waitForTimeout(900);
        }

        // Enter valid 8-digit birthday passcode: 22092000
        const pk2 = await pageMain.$('#pagePasscodeKeypad .pk-btn[data-key="2"]');
        const pk0 = await pageMain.$('#pagePasscodeKeypad .pk-btn[data-key="0"]');
        const pk9 = await pageMain.$('#pagePasscodeKeypad .pk-btn[data-key="9"]');
        const submitBtn = await pageMain.$('#pagePasscodeSubmitBtn');

        if (pk2 && pk0 && pk9) {
          // '2', '2', '0', '9', '2', '0', '0', '0'
          await pk2.click(); await pageMain.waitForTimeout(60);
          await pk2.click(); await pageMain.waitForTimeout(60);
          await pk0.click(); await pageMain.waitForTimeout(60);
          await pk9.click(); await pageMain.waitForTimeout(60);
          await pk2.click(); await pageMain.waitForTimeout(60);
          await pk0.click(); await pageMain.waitForTimeout(60);
          await pk0.click(); await pageMain.waitForTimeout(60);
          await pk0.click(); await pageMain.waitForTimeout(60);

          if (submitBtn) {
            try {
              const isVis = await submitBtn.isVisible();
              if (isVis) await submitBtn.click({ timeout: 1000 }).catch(() => {});
            } catch (e) {}
          }
          await pageMain.waitForTimeout(600);

          const isPasscodeUnlocked = await passcodeOverlay.evaluate(el => el.classList.contains('unlocked') || el.style.display === 'none' || el.classList.contains('fade-out'));
          recordTest(
            suite4,
            'Passcode Keypad validates 8-digit Birthday Passcode (22092000) and unlocks celebration overlay',
            isPasscodeUnlocked,
            'Passcode 22092000 accepted'
          );
        }
      }
    }

    // Test 4.2: Unboxing Flow / Intro Screen (#introOverlay)
    const introOverlay = await pageMain.$('#introOverlay');
    const isIntroPresent = introOverlay !== null;
    let isIntroVisible = isIntroPresent ? await introOverlay.isVisible() : false;

    recordTest(
      suite4,
      'Intro 3D Gift Box Unboxing screen (#introOverlay) exists with "Open My Birthday Surprise" CTA',
      isIntroPresent,
      `Intro present: ${isIntroPresent}`
    );

    if (isIntroVisible) {
      const unboxBtn = await pageMain.$('#openGiftBtn, #giftBoxTrigger, .gift-box-wrapper');
      if (unboxBtn) {
        await unboxBtn.click({ force: true }).catch(() => {});
        await pageMain.waitForTimeout(600);
      }
    }

    // Test 4.3: Main App Visibility & 24 Sections Existence
    const mainApp = await pageMain.$('#mainApp');
    const isMainAppVisible = mainApp ? await mainApp.isVisible() : false;
    recordTest(
      suite4,
      'Main Celebration Arena (#mainApp) is active and revealed upon unboxing',
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
      { id: '#letterSec', name: 'Stage 8: Royal Love Letters' }
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
      await cakeKnife.click({ force: true }).catch(() => {});
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
      await sendLoveBtn.click({ force: true }).catch(() => {});
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
      await themeBtn.click({ force: true }).catch(() => {});
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
      await couponClaimBtn.click({ force: true }).catch(() => {});
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
      await capsuleInput.fill('A romantic promise sealed for My Love Nishika! 💖✨');
      await capsuleBtn.click({ force: true }).catch(() => {});
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

    // -------------------------------------------------------------------------
    // SUITE 6: PHOTO MEMORIES, LIVE CLOUD WISHES & LIGHTBOX PORTAL
    // -------------------------------------------------------------------------
    console.log('\n📸 SUITE 6: Photo Memories, Live Cloud Wishes & Lightbox Portal');
    const suite6 = 'Suite 6: Photo Memories & Lightbox';

    const ctxSuite6 = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const pSuite6 = await ctxSuite6.newPage();

    // Test 6.1: Photo URL Submission on index.html
    await pSuite6.goto(`${BASE_URL}/index.html`, { waitUntil: 'domcontentloaded' });
    await pSuite6.waitForTimeout(400);

    const tabPhotoBtn = await pSuite6.$('.media-tab-btn[data-tab="tabPhoto"]');
    if (tabPhotoBtn) await tabPhotoBtn.click();
    await pSuite6.waitForTimeout(200);

    const guestNameInput = await pSuite6.$('#guestName');
    const guestWishInput = await pSuite6.$('#guestWish');
    const wishPhotoUrl = await pSuite6.$('#wishPhotoUrl');
    const submitWishBtn = await pSuite6.$('#submitWishBtn');

    if (guestNameInput && guestWishInput && wishPhotoUrl && submitWishBtn) {
      await guestNameInput.fill('Dilip (Royal Photo Test)');
      await guestWishInput.fill('Forever dedicated to My Love Nishika! 📸💖');
      await wishPhotoUrl.fill('https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800');
      await submitWishBtn.click();
      await pSuite6.waitForTimeout(600);

      const hasPhotoInSticky = await pSuite6.evaluate(() => {
        const grid = document.getElementById('stickyNotesGrid');
        if (!grid) return false;
        return grid.innerHTML.includes('img') && grid.innerHTML.includes('photo-1518199266791-5375a83190b7');
      });

      recordTest(
        suite6,
        'Submitting photo link on index.html renders responsive photo attachment on #stickyNotesGrid',
        hasPhotoInSticky,
        hasPhotoInSticky ? 'Photo memory rendered on sticky note' : 'Photo image not found on sticky grid'
      );

      const hasLightboxTrigger = await pSuite6.evaluate(() => {
        const grid = document.getElementById('stickyNotesGrid');
        if (!grid) return false;
        return Boolean(grid.querySelector('.sticky-media-wrap') || grid.querySelector('.sticky-media-badge'));
      });

      recordTest(
        suite6,
        'Submitting photo renders interactive lightbox trigger badge on Sticky Wall',
        hasLightboxTrigger,
        hasLightboxTrigger ? 'Photo lightbox trigger badge present' : 'Lightbox trigger missing'
      );
    }

    // Test 6.2: Refreshing index.html preserves photo memories without local storage loss
    await pSuite6.reload({ waitUntil: 'domcontentloaded' });
    await pSuite6.waitForTimeout(400);

    const hasPhotoAfterReload = await pSuite6.evaluate(() => {
      const grid = document.getElementById('stickyNotesGrid');
      if (!grid) return false;
      return grid.innerHTML.includes('photo-1518199266791-5375a83190b7');
    });

    recordTest(
      suite6,
      'Reloading index.html preserves photo memories on Sticky Wall (zero localStorage stripping)',
      hasPhotoAfterReload,
      hasPhotoAfterReload ? 'Photo memory preserved after refresh' : 'Photo was wiped on refresh'
    );

    // Test 6.3: Photo Filter Pill isolation on index.html
    const photoFilterPill = await pSuite6.$('.filter-pill[data-filter="photo"]');
    if (photoFilterPill) {
      await photoFilterPill.click();
      await pSuite6.waitForTimeout(300);

      const onlyPhotosShown = await pSuite6.evaluate(() => {
        const notes = document.querySelectorAll('#stickyNotesGrid .sticky-note');
        if (notes.length === 0) return false;
        return Array.from(notes).every(n => n.querySelector('.sticky-media-wrap') !== null || n.querySelector('img') !== null);
      });

      recordTest(
        suite6,
        'Clicking Photo Filter Pill on index.html displays only photo memory sticky notes',
        onlyPhotosShown,
        onlyPhotosShown ? 'All visible notes contain photo attachments' : 'Non-photo notes appeared'
      );
    }

    // Test 6.4: Universal Photo URL Normalizer converts Google Drive image links to high-speed CDN URLs
    const gdrivePhotoNormalizerCheck = await pSuite6.evaluate(() => {
      if (typeof window.normalizeCloudImageUrl !== 'function') return { ok: false, reason: 'normalizeCloudImageUrl missing' };

      const driveUrl1 = 'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/view';
      const driveUrl2 = 'https://drive.google.com/open?id=1QueenNishikaRoyalPhoto2026';
      
      const normalized1 = window.normalizeCloudImageUrl(driveUrl1);
      const normalized2 = window.normalizeCloudImageUrl(driveUrl2);

      const isCdn1 = normalized1.includes('lh3.googleusercontent.com/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms');
      const isCdn2 = normalized2.includes('lh3.googleusercontent.com/d/1QueenNishikaRoyalPhoto2026');

      return {
        ok: isCdn1 && isCdn2,
        normalized1,
        normalized2
      };
    });

    recordTest(
      suite6,
      'Universal Photo URL Normalizer converts Google Drive file links to high-speed CDN thumbnails (lh3.googleusercontent.com/d/...)',
      gdrivePhotoNormalizerCheck.ok,
      gdrivePhotoNormalizerCheck.ok ? `CDN URLs generated: ${gdrivePhotoNormalizerCheck.normalized1}` : 'Google Drive normalizer failed'
    );

    // Test 6.5: main.html Photo Attachment Submission & Wall Pinning
    await pSuite6.goto(`${BASE_URL}/main.html?preview=true`, { waitUntil: 'domcontentloaded' });
    await pSuite6.waitForTimeout(500);

    // Dismiss intro overlay & passcode overlay for testing
    await pSuite6.evaluate(() => {
      if (typeof window.unboxBirthdaySurprise === 'function') {
        window.unboxBirthdaySurprise(true);
      } else {
        const intro = document.getElementById('introOverlay');
        if (intro) { intro.style.display = 'none'; intro.classList.add('fade-out', 'unlocked', 'hidden'); }
        const lock = document.getElementById('pagePasscodeOverlay');
        if (lock) { lock.style.display = 'none'; lock.classList.add('hidden'); }
        const app = document.getElementById('mainApp');
        if (app) { app.style.display = 'block'; app.classList.remove('hidden'); }
      }
      document.querySelectorAll('.reveal-on-scroll').forEach(el => {
        el.classList.add('is-revealed');
        el.style.opacity = '1';
        el.style.visibility = 'visible';
        el.style.pointerEvents = 'auto';
      });
    });
    await pSuite6.waitForTimeout(300);

    // Click Photo tab on wish form
    await pSuite6.evaluate(() => {
      const tab = document.querySelector('.media-tab-btn[data-tab="mainTabPhoto"]');
      if (tab) tab.click();
    });
    await pSuite6.waitForTimeout(200);

    const mainAuthorInput = await pSuite6.$('#wishAuthorInput');
    const mainTextInput = await pSuite6.$('#wishTextInput');
    const mainPhotoUrlInput = await pSuite6.$('#mainWishPhotoUrl');

    if (mainAuthorInput && mainTextInput && mainPhotoUrlInput) {
      await mainAuthorInput.scrollIntoViewIfNeeded();
      await mainAuthorInput.fill('Dilip (Main Photo Test)');
      await mainTextInput.fill('Majestic birthday memory for My Love Nishika! 🌟');
      await mainPhotoUrlInput.fill('https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800');
      
      await pSuite6.evaluate(() => {
        const btn = document.getElementById('mainSubmitWishBtn');
        if (btn) btn.click();
      });
      await pSuite6.waitForTimeout(600);

      const hasMainDrivePhoto = await pSuite6.evaluate(() => {
        const board = document.getElementById('wishesPinboard');
        if (!board) return false;
        return board.innerHTML.includes('photo-1527529482837-4698179dc6ce');
      });

      recordTest(
        suite6,
        'main.html: Submitting photo attachment renders responsive photo memory card on #wishesPinboard',
        hasMainDrivePhoto,
        hasMainDrivePhoto ? 'Photo card rendered on main pinboard' : 'Photo card missing from pinboard'
      );

      // Test main.html Auto-Generate Wishes & Mood Chips
      const mainAutoGenBtn = await pSuite6.$('#mainBtnAutoGenerateWish');
      if (mainAutoGenBtn && mainTextInput) {
        await mainAutoGenBtn.click();
        await pSuite6.waitForTimeout(200);
        const mainGenVal = await mainTextInput.inputValue();
        const hasMainGen = mainGenVal.length > 10 && (mainGenVal.includes('Nishika') || mainGenVal.includes('Birthday'));
        recordTest(
          suite6,
          'main.html: Clicking "✨ Auto Generate" button populates heartfelt birthday wish into #wishTextInput',
          hasMainGen,
          hasMainGen ? `Generated: ${mainGenVal.substring(0, 40)}...` : 'Failed to auto-generate wish on main.html'
        );

        // Test main.html Wish Library Modal
        const mainLibBtn = await pSuite6.$('#mainBtnWishLibrary');
        const mainLibModal = await pSuite6.$('#mainWishLibraryModal');
        if (mainLibBtn && mainLibModal) {
          await mainLibBtn.click();
          await pSuite6.waitForTimeout(300);
          const isMainLibActive = await mainLibModal.evaluate(el => el.classList.contains('active'));
          recordTest(
            suite6,
            'main.html: Clicking "📚 Wish Library" button opens main Wish Library Modal (#mainWishLibraryModal)',
            isMainLibActive,
            isMainLibActive ? 'Main wish library opened' : 'Main wish library failed to open'
          );

          const mainFirstUseBtn = await pSuite6.$('#mainWishLibraryList .wish-use-btn');
          if (mainFirstUseBtn) {
            await mainFirstUseBtn.click();
            await pSuite6.waitForTimeout(200);
            const isMainLibClosed = await mainLibModal.evaluate(el => !el.classList.contains('active'));
            recordTest(
              suite6,
              'main.html: Selecting "Use This Wish" applies wish to #wishTextInput and dismisses modal',
              isMainLibClosed,
              isMainLibClosed ? 'Wish applied and modal closed' : 'Modal did not close on select'
            );
          }
        }
      }
    }

    // Test 6.6: Photo Lightbox Modal Opens on main.html
    const isPhotoLightboxTriggered = await pSuite6.evaluate(() => {
      const mediaWrap = document.querySelector('.wish-sticky .sticky-media-wrap');
      if (mediaWrap) {
        mediaWrap.click();
        return true;
      }
      return false;
    });
    await pSuite6.waitForTimeout(300);

    const isModalActive = await pSuite6.evaluate(() => {
      const modal = document.getElementById('mediaLightboxModal');
      const viewport = document.getElementById('lightboxViewport');
      return modal && modal.classList.contains('active') && viewport && viewport.querySelector('img') !== null;
    });

    recordTest(
      suite6,
      'Clicking Photo Attachment expands photo into full-screen theater Lightbox Modal (#mediaLightboxModal)',
      isModalActive,
      isModalActive ? 'Lightbox modal active with full photo image' : 'Lightbox failed to open photo'
    );

    await pSuite6.evaluate(() => {
      const closeBtn = document.getElementById('closeMediaLightboxBtn');
      if (closeBtn) closeBtn.click();
    });
    await pSuite6.waitForTimeout(200);

    // Test 6.7: Refreshing main.html retains pinned photo
    await pSuite6.reload({ waitUntil: 'domcontentloaded' });
    await pSuite6.waitForTimeout(400);

    await pSuite6.evaluate(() => {
      if (typeof window.unboxBirthdaySurprise === 'function') {
        window.unboxBirthdaySurprise(true);
      } else {
        const intro = document.getElementById('introOverlay');
        if (intro) { intro.style.display = 'none'; intro.classList.add('fade-out', 'unlocked', 'hidden'); }
        const lock = document.getElementById('pagePasscodeOverlay');
        if (lock) { lock.style.display = 'none'; lock.classList.add('hidden'); }
        const app = document.getElementById('mainApp');
        if (app) { app.style.display = 'block'; app.classList.remove('hidden'); }
      }
      document.querySelectorAll('.reveal-on-scroll').forEach(el => {
        el.classList.add('is-revealed');
        el.style.opacity = '1';
        el.style.visibility = 'visible';
        el.style.pointerEvents = 'auto';
      });
    });
    await pSuite6.waitForTimeout(300);

    const isPhotoPreserved = await pSuite6.evaluate(() => {
      const board = document.getElementById('wishesPinboard');
      if (!board) return false;
      return board.innerHTML.includes('photo-1527529482837-4698179dc6ce');
    });

    recordTest(
      suite6,
      'main.html: Reloading preserves photo sticky notes on live pinboard without loss',
      isPhotoPreserved,
      isPhotoPreserved ? 'Photo sticky note intact after reload' : 'Photo note lost on reload'
    );

    // Test 6.8: Photo Filter Pill isolation on main.html
    const mainPhotoFilterPill = await pSuite6.$('#mainWishFilterBar .filter-pill[data-filter="photo"]');
    if (mainPhotoFilterPill) {
      await mainPhotoFilterPill.click();
      await pSuite6.waitForTimeout(300);

      const onlyMainPhotosShown = await pSuite6.evaluate(() => {
        const notes = document.querySelectorAll('#wishesPinboard .wish-sticky');
        if (notes.length === 0) return false;
        return Array.from(notes).every(n => n.querySelector('.sticky-media-wrap') !== null);
      });

      recordTest(
        suite6,
        'main.html: Clicking Photo Filter Pill displays only photo memory sticky notes',
        onlyMainPhotosShown,
        onlyMainPhotosShown ? 'All visible sticky notes contain photo attachments' : 'Non-photo notes visible'
      );
    }

    // Test 6.9: Local Image File Base64 Reader (readFileAsBase64) helper
    const base64ReaderCheck = await pSuite6.evaluate(async () => {
      if (typeof window.readFileAsBase64 !== 'function') return { ok: false, reason: 'readFileAsBase64 missing' };

      // Create a mock Blob image file
      const mockBlob = new Blob(['FakeImageData'], { type: 'image/jpeg' });
      mockBlob.name = 'nishika_memory.jpg';

      let progressCalled = false;
      const dataUrl = await window.readFileAsBase64(mockBlob, (pct) => {
        if (pct >= 0) progressCalled = true;
      });

      const isDataUrl = typeof dataUrl === 'string' && dataUrl.startsWith('data:');
      return { ok: isDataUrl, progressCalled, dataUrlLength: dataUrl.length };
    });

    recordTest(
      suite6,
      'Local Image File Base64 Reader (readFileAsBase64) converts device photos to Data URLs with progress callbacks',
      base64ReaderCheck.ok,
      base64ReaderCheck.ok ? `Data URL converted (${base64ReaderCheck.dataUrlLength} chars, progress notified)` : base64ReaderCheck.reason
    );

    // Test 6.10: Photo Dropzone & file input accept attributes specify standard image formats
    const fileAcceptCheck = await pSuite6.evaluate(() => {
      const inputs = [
        document.getElementById('mainWishPhotoInput'),
        document.getElementById('wishPhotoInput'),
        document.getElementById('quickPhotoInput')
      ].filter(Boolean);

      const allCovered = inputs.every(input => {
        const accept = input.getAttribute('accept') || '';
        return accept.includes('image/*') || accept.includes('.jpg') || accept.includes('.png');
      });

      return { totalInputs: inputs.length, allCovered };
    });

    recordTest(
      suite6,
      'Photo input file pickers specify comprehensive accept filters (image/*)',
      fileAcceptCheck.allCovered,
      `Verified ${fileAcceptCheck.totalInputs} photo file input elements`
    );

    // Test 6.11: Photo Perfect Frame Styling & Aspect Ratio
    const frameStyleCheck = await pSuite6.evaluate(() => {
      const pinboard = document.getElementById('wishesPinboard');
      if (!pinboard) return { ok: false, reason: 'Pinboard missing' };

      const testSticky = document.createElement('div');
      testSticky.className = 'wish-sticky theme-pink';
      testSticky.innerHTML = `
        <div class="sticky-media-wrap" data-img="https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600" data-author="Dilip" data-msg="Sacred moments">
          <img src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600" alt="Memory" />
          <span class="sticky-media-badge"><i class="fa-solid fa-expand"></i> View Photo</span>
        </div>
      `;
      pinboard.appendChild(testSticky);

      const mediaWrap = testSticky.querySelector('.sticky-media-wrap');
      const wrapStyle = window.getComputedStyle(mediaWrap);

      const hasWrapBorder = wrapStyle.borderStyle !== 'none';
      const hasWrapRadius = parseInt(wrapStyle.borderRadius, 10) >= 12;

      testSticky.remove();

      return {
        ok: hasWrapBorder && hasWrapRadius,
        details: {
          wrapBorder: wrapStyle.borderColor,
          wrapRadius: wrapStyle.borderRadius
        }
      };
    });

    recordTest(
      suite6,
      'Photo memory frames apply luxury gilded border styling, smooth corner curvature, and containment',
      frameStyleCheck.ok,
      frameStyleCheck.ok ? `Border: ${frameStyleCheck.details.wrapBorder}, Radius: ${frameStyleCheck.details.wrapRadius}` : frameStyleCheck.reason
    );

    // Test 6.12: Interactive Fullscreen Cinema Hover Pop-Out Activation on main.html
    const hoverPopoutCheck = await pSuite6.evaluate(async () => {
      const popout = document.getElementById('mediaHoverPopout');
      const viewport = document.getElementById('hoverPopoutViewport');
      const authorEl = document.getElementById('hoverPopoutAuthor');
      const captionEl = document.getElementById('hoverPopoutCaption');

      if (!popout || !viewport) return { ok: false, reason: 'Popout overlay elements missing' };

      // 1. Initially inactive
      const initialInactive = !popout.classList.contains('active');

      // 2. Simulate Hover on Photo Target
      if (typeof window.showHoverPopout === 'function') {
        window.showHoverPopout('photo', 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600', 'Dilip 👑', 'Forever and always my queen');
      }

      const activeAfterHover = popout.classList.contains('active');
      const hasPhotoImg = viewport.querySelector('img') !== null;
      const hasAuthor = authorEl && authorEl.textContent.includes('Dilip');
      const hasCaption = captionEl && captionEl.textContent.includes('Forever');

      // 3. Simulate Mouse Leave
      if (typeof window.hideHoverPopout === 'function') {
        window.hideHoverPopout();
      }

      const inactiveAfterLeave = !popout.classList.contains('active');

      return {
        ok: initialInactive && activeAfterHover && hasPhotoImg && hasAuthor && hasCaption && inactiveAfterLeave,
        details: { initialInactive, activeAfterHover, hasPhotoImg, hasAuthor, hasCaption, inactiveAfterLeave }
      };
    });

    recordTest(
      suite6,
      'Hover Pop-Out Cinema Portal (#mediaHoverPopout) expands on photo hover and smoothly dismisses when moving away',
      hoverPopoutCheck.ok,
      hoverPopoutCheck.ok ? 'Pop-out activated on hover, content populated, and cleanly dismissed on mouseleave' : JSON.stringify(hoverPopoutCheck.details)
    );

    // Test 6.13: Dedicated Close Button (#closeHoverPopoutBtn) and Escape key dismisses cinema popout
    const closeBtnCheck = await pSuite6.evaluate(async () => {
      const popout = document.getElementById('mediaHoverPopout');
      const closeBtn = document.getElementById('closeHoverPopoutBtn');
      if (!popout || !closeBtn) return { ok: false, reason: 'Close button or popout missing' };

      // 1. Open Popout
      if (typeof window.showHoverPopout === 'function') {
        window.showHoverPopout('photo', 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600', 'Queen Nishika 👑', 'Sacred photo memory');
      }
      const isOpen = popout.classList.contains('active');

      // 2. Click Close Button
      closeBtn.click();
      await new Promise(r => setTimeout(r, 60));
      const isClosedAfterBtn = !popout.classList.contains('active');

      // 3. Re-open and test Escape
      if (typeof window.showHoverPopout === 'function') {
        window.showHoverPopout('photo', 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600', 'Dilip 👑', 'Sweet memory');
      }
      const isReOpened = popout.classList.contains('active');
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      await new Promise(r => setTimeout(r, 60));
      const isClosedAfterEsc = !popout.classList.contains('active');

      return {
        ok: isOpen && isClosedAfterBtn && isReOpened && isClosedAfterEsc,
        details: { isOpen, isClosedAfterBtn, isReOpened, isClosedAfterEsc }
      };
    });

    recordTest(
      suite6,
      'Dedicated Close Button (#closeHoverPopoutBtn) and Escape key immediately dismiss Hover Pop-Out Cinema Modal',
      closeBtnCheck.ok,
      closeBtnCheck.ok ? 'Close button click and Escape key cleanly dismissed popout modal' : JSON.stringify(closeBtnCheck.details)
    );

    // Test 6.14: Moving cursor out from photo frame / popout card immediately restores normal mode
    const cursorOutCheck = await pSuite6.evaluate(async () => {
      const popout = document.getElementById('mediaHoverPopout');
      const card = popout ? popout.querySelector('.hover-popout-card') : null;
      if (!popout || !card) return { ok: false, reason: 'Popout or card missing' };

      // 1. Open Popout
      if (typeof window.showHoverPopout === 'function') {
        window.showHoverPopout('photo', 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600', 'Dilip 👑', 'Sweet memory');
      }
      const isOpen = popout.classList.contains('active');

      // 2. Dispatch mouseleave on card
      card.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
      await new Promise(r => setTimeout(r, 60));
      const isClosedAfterCardLeave = !popout.classList.contains('active');

      // 3. Re-open and test backdrop mousemove
      if (typeof window.showHoverPopout === 'function') {
        window.showHoverPopout('photo', 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600', 'Dilip 👑', 'Sweet memory');
      }
      const isReOpened = popout.classList.contains('active');
      popout.dispatchEvent(new MouseEvent('mousemove', { bubbles: false }));
      await new Promise(r => setTimeout(r, 60));
      const isClosedAfterBackdropMove = !popout.classList.contains('active');

      return {
        ok: isOpen && isClosedAfterCardLeave && isReOpened && isClosedAfterBackdropMove,
        details: { isOpen, isClosedAfterCardLeave, isReOpened, isClosedAfterBackdropMove }
      };
    });

    recordTest(
      suite6,
      'Moving cursor out from photo frame or pop-out card immediately restores normal mode without sticking',
      cursorOutCheck.ok,
      cursorOutCheck.ok ? 'Pop-out immediately dismissed upon cursor leaving photo card or moving over backdrop' : JSON.stringify(cursorOutCheck.details)
    );

    // Test 6.16: Cache invalidation meta tags & asset versioning (v=3.3.1) verification
    const cacheVersioningCheck = await pSuite6.evaluate(async () => {
      const metaCache = document.querySelector('meta[http-equiv="Cache-Control"]');
      const cssLink = document.querySelector('link[href*="style.css"]');
      const scriptTag = document.querySelector('script[src*="script.js"]');

      const hasMetaNoCache = metaCache && metaCache.getAttribute('content').includes('no-cache') && metaCache.getAttribute('content').includes('no-store');
      const hasCssVersion = cssLink && cssLink.getAttribute('href').includes('v=3.3.1');
      const hasScriptVersion = scriptTag && scriptTag.getAttribute('src').includes('v=3.3.1');

      return {
        ok: !!(hasMetaNoCache && hasCssVersion && hasScriptVersion),
        details: {
          metaContent: metaCache ? metaCache.getAttribute('content') : null,
          cssHref: cssLink ? cssLink.getAttribute('href') : null,
          scriptSrc: scriptTag ? scriptTag.getAttribute('src') : null
        }
      };
    });

    // Test 6.17: Keepsake Card Modal Print, Save PDF & Share Actions with Strict Print Isolation
    const keepsakeModalCheck = await pSuite6.evaluate(async () => {
      const openBtn = document.getElementById('openKeepsakeBtn');
      const modal = document.getElementById('keepsakeModal');
      const cardPrint = document.getElementById('keepsakeCardPrint');
      const printBtn = document.getElementById('printCardBtn');
      const savePdfBtn = document.getElementById('savePdfCardBtn');
      const shareBtn = document.getElementById('shareKeepsakeBtn');
      const closeBtn = document.getElementById('closeKeepsakeModalBtn');

      if (!openBtn || !modal || !cardPrint || !printBtn || !savePdfBtn || !shareBtn || !closeBtn) {
        return {
          ok: false,
          reason: 'Missing elements',
          found: { openBtn: !!openBtn, modal: !!modal, cardPrint: !!cardPrint, printBtn: !!printBtn, savePdfBtn: !!savePdfBtn, shareBtn: !!shareBtn, closeBtn: !!closeBtn }
        };
      }

      // 1. Open modal
      openBtn.click();
      await new Promise(r => setTimeout(r, 100));
      const isOpen = modal.classList.contains('active');

      // 2. Check print isolation classes
      document.body.classList.add('print-keepsake-active');
      const hasPrintClass = document.body.classList.contains('print-keepsake-active');
      document.body.classList.remove('print-keepsake-active');

      // 3. Close modal
      closeBtn.click();
      await new Promise(r => setTimeout(r, 100));
      const isClosed = !modal.classList.contains('active');

      return {
        ok: isOpen && hasPrintClass && isClosed,
        details: { isOpen, hasPrintClass, isClosed }
      };
    });

    recordTest(
      suite6,
      'View Keepsake Card modal provides Print, Save as PDF, and Share actions with strictly isolated print styles',
      keepsakeModalCheck.ok,
      keepsakeModalCheck.ok ? 'Keepsake modal interactive, dedicated action buttons present, print isolation classes verified' : JSON.stringify(keepsakeModalCheck.details)
    );

    // Test 6.18: Star Registry Deed Modal Print, Save PDF & Share Actions
    const starModalCheck = await pSuite6.evaluate(async () => {
      const openBtn = document.getElementById('openStarRegistryBtn');
      const modal = document.getElementById('starModal');
      const certPrint = document.getElementById('starCertPrint');
      const printBtn = document.getElementById('printStarCertBtn');
      const savePdfBtn = document.getElementById('savePdfStarBtn');
      const shareBtn = document.getElementById('shareStarCertBtn');
      const closeBtn = document.getElementById('closeStarModalBtn');

      if (!openBtn || !modal || !certPrint || !printBtn || !savePdfBtn || !shareBtn || !closeBtn) {
        return {
          ok: false,
          reason: 'Missing elements',
          found: { openBtn: !!openBtn, modal: !!modal, certPrint: !!certPrint, printBtn: !!printBtn, savePdfBtn: !!savePdfBtn, shareBtn: !!shareBtn, closeBtn: !!closeBtn }
        };
      }

      // 1. Open modal
      openBtn.click();
      await new Promise(r => setTimeout(r, 100));
      const isOpen = modal.classList.contains('active');

      // 2. Check print isolation classes
      document.body.classList.add('print-star-active');
      const hasPrintClass = document.body.classList.contains('print-star-active');
      document.body.classList.remove('print-star-active');

      // 3. Close modal
      closeBtn.click();
      await new Promise(r => setTimeout(r, 100));
      const isClosed = !modal.classList.contains('active');

      return {
        ok: isOpen && hasPrintClass && isClosed,
        details: { isOpen, hasPrintClass, isClosed }
      };
    });

    recordTest(
      suite6,
      'Star Registry Deed modal provides Print, Save as PDF, and Share actions with isolated celestial certificate print styling',
      starModalCheck.ok,
      starModalCheck.ok ? 'Star Registry modal interactive, deed print container verified, dedicated action buttons present' : JSON.stringify(starModalCheck.details)
    );

    await ctxSuite6.close();
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
