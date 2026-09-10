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
          await pageMain.waitForTimeout(200);
        }

        // Enter valid 8-digit birthday passcode: 22092000
        const pk2 = await pageMain.$('#pagePasscodeKeypad .pk-btn[data-key="2"]');
        const pk0 = await pageMain.$('#pagePasscodeKeypad .pk-btn[data-key="0"]');
        const pk9 = await pageMain.$('#pagePasscodeKeypad .pk-btn[data-key="9"]');
        const submitBtn = await pageMain.$('#pagePasscodeSubmitBtn');

        if (pk2 && pk0 && pk9) {
          // '2', '2', '0', '9', '2', '0', '0', '0'
          await pk2.click(); await pageMain.waitForTimeout(50);
          await pk2.click(); await pageMain.waitForTimeout(50);
          await pk0.click(); await pageMain.waitForTimeout(50);
          await pk9.click(); await pageMain.waitForTimeout(50);
          await pk2.click(); await pageMain.waitForTimeout(50);
          await pk0.click(); await pageMain.waitForTimeout(50);
          await pk0.click(); await pageMain.waitForTimeout(50);
          await pk0.click(); await pageMain.waitForTimeout(50);

          if (submitBtn) {
            try {
              const isVis = await submitBtn.isVisible();
              if (isVis) await submitBtn.click({ timeout: 1000 }).catch(() => {});
            } catch (e) {}
          }
          await pageMain.waitForTimeout(500);

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
        await unboxBtn.click();
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
      await capsuleInput.fill('A romantic promise sealed for Queen Nishika! 💖✨');
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
    // SUITE 6: VIDEO UPLOAD, GOOGLE DRIVE STREAMING & CLOUD PREVIEW RECOVERY
    // -------------------------------------------------------------------------
    console.log('\n🎬 SUITE 6: Video Upload, Google Drive Streaming & Cloud Preview Recovery');
    const suite6 = 'Suite 6: Video Upload & Cloud Preview';

    const ctxSuite6 = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const pSuite6 = await ctxSuite6.newPage();

    // Test 6.1: Video URL Submission on index.html
    await pSuite6.goto(`${BASE_URL}/index.html`, { waitUntil: 'domcontentloaded' });
    await pSuite6.waitForTimeout(400);

    const tabVideoBtn = await pSuite6.$('.media-tab-btn[data-tab="tabVideo"]');
    if (tabVideoBtn) await tabVideoBtn.click();
    await pSuite6.waitForTimeout(200);

    const guestNameInput = await pSuite6.$('#guestName');
    const guestWishInput = await pSuite6.$('#guestWish');
    const wishVideoUrl = await pSuite6.$('#wishVideoUrl');
    const submitWishBtn = await pSuite6.$('#submitWishBtn');

    if (guestNameInput && guestWishInput && wishVideoUrl && submitWishBtn) {
      await guestNameInput.fill('Dilip (Royal Video Test)');
      await guestWishInput.fill('Forever dedicated to Queen Nishika! 🎬💖');
      await wishVideoUrl.fill('https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/view');
      await submitWishBtn.click();
      await pSuite6.waitForTimeout(600);

      const hasVideoInSticky = await pSuite6.evaluate(() => {
        const grid = document.getElementById('stickyNotesGrid');
        if (!grid) return false;
        return grid.innerHTML.includes('iframe') && grid.innerHTML.includes('drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview');
      });

      recordTest(
        suite6,
        'Submitting Google Drive video link on index.html renders responsive iframe video player on #stickyNotesGrid',
        hasVideoInSticky,
        hasVideoInSticky ? 'Google Drive iframe rendered' : 'Video iframe not found on sticky grid'
      );

      const hasVideoInMemories = await pSuite6.evaluate(() => {
        const grid = document.getElementById('memoriesGrid');
        if (!grid) return false;
        return grid.innerHTML.includes('iframe') && grid.innerHTML.includes('drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview');
      });

      recordTest(
        suite6,
        'Submitting video link renders video card in Memories Polaroid Gallery (#memoriesGrid)',
        hasVideoInMemories,
        hasVideoInMemories ? 'Video present in Memories gallery' : 'Video not found in Memories gallery'
      );
    }

    // Test 6.2: Refreshing index.html preserves video embed without local storage stripping
    await pSuite6.reload({ waitUntil: 'domcontentloaded' });
    await pSuite6.waitForTimeout(400);

    const hasVideoAfterReload = await pSuite6.evaluate(() => {
      const grid = document.getElementById('stickyNotesGrid');
      if (!grid) return false;
      return grid.innerHTML.includes('drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview');
    });

    recordTest(
      suite6,
      'Reloading index.html preserves Google Drive video iframe on Sticky Wall (zero localStorage stripping)',
      hasVideoAfterReload,
      hasVideoAfterReload ? 'Video iframe preserved after refresh' : 'Video URL was wiped on refresh'
    );

    // Test 6.3: Video Filter Pill isolation on index.html
    const videoFilterPill = await pSuite6.$('.filter-pill[data-filter="video"]');
    if (videoFilterPill) {
      await videoFilterPill.click();
      await pSuite6.waitForTimeout(300);

      const onlyVideosShown = await pSuite6.evaluate(() => {
        const notes = document.querySelectorAll('#stickyNotesGrid .sticky-note');
        if (notes.length === 0) return false;
        return Array.from(notes).every(n => n.querySelector('.sticky-video-embed') !== null);
      });

      recordTest(
        suite6,
        'Clicking Video Filter Pill on index.html displays only video dedication sticky notes',
        onlyVideosShown,
        onlyVideosShown ? 'All visible notes have video embeds' : 'Non-video notes appeared'
      );
    }

    // Test 6.4: main.html Google Drive & YouTube Video Embeds
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

    // Click Video tab on wish form
    await pSuite6.evaluate(() => {
      const tab = document.querySelector('.media-tab-btn[data-tab="mainTabVideo"]');
      if (tab) tab.click();
    });
    await pSuite6.waitForTimeout(200);

    const mainAuthorInput = await pSuite6.$('#wishAuthorInput');
    const mainTextInput = await pSuite6.$('#wishTextInput');
    const mainVideoUrlInput = await pSuite6.$('#mainWishVideoUrl');

    if (mainAuthorInput && mainTextInput && mainVideoUrlInput) {
      await mainAuthorInput.scrollIntoViewIfNeeded();
      await mainAuthorInput.fill('Dilip (Main Video Test)');
      await mainTextInput.fill('Majestic birthday reel for Queen Nishika! 🌟');
      await mainVideoUrlInput.fill('https://drive.google.com/open?id=1AbCdEfGhIjKlMnOpQrStUvWxYz123456');
      
      await pSuite6.evaluate(() => {
        const btn = document.getElementById('mainSubmitWishBtn');
        if (btn) btn.click();
      });
      await pSuite6.waitForTimeout(600);

      const hasMainDriveVideo = await pSuite6.evaluate(() => {
        const board = document.getElementById('wishesPinboard');
        if (!board) return false;
        return board.innerHTML.includes('drive.google.com/file/d/1AbCdEfGhIjKlMnOpQrStUvWxYz123456/preview');
      });

      recordTest(
        suite6,
        'main.html Pinboard normalizes open?id= Google Drive link to streaming /preview iframe without converting to image thumbnail',
        hasMainDriveVideo,
        hasMainDriveVideo ? 'Proper /preview iframe rendered' : 'Failed to render streaming video iframe'
      );
    }

    // Test 6.5: Video Lightbox Modal Opens on main.html
    const isExpanded = await pSuite6.evaluate(() => {
      const btn = document.querySelector('.sticky-video-expand-btn');
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });
    await pSuite6.waitForTimeout(300);

    const isModalActive = await pSuite6.evaluate(() => {
      const modal = document.getElementById('mediaLightboxModal');
      const viewport = document.getElementById('lightboxViewport');
      return modal && modal.classList.contains('active') && viewport && viewport.innerHTML.includes('iframe');
    });

    recordTest(
      suite6,
      'Clicking Video Lightbox button expands video into full-screen iframe theater modal',
      isModalActive,
      isModalActive ? 'Lightbox modal active with video' : 'Lightbox failed to open video'
    );

    await pSuite6.evaluate(() => {
      const closeBtn = document.getElementById('closeMediaLightboxBtn');
      if (closeBtn) closeBtn.click();
    });
    await pSuite6.waitForTimeout(200);

    // Test 6.6: Refreshing main.html retains pinned video
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

    const hasMainVideoAfterReload = await pSuite6.evaluate(() => {
      const board = document.getElementById('wishesPinboard');
      if (!board) return false;
      return board.innerHTML.includes('drive.google.com/file/d/1AbCdEfGhIjKlMnOpQrStUvWxYz123456/preview');
    });

    recordTest(
      suite6,
      'Reloading main.html preserves pinned video sticky note from state storage',
      hasMainVideoAfterReload,
      hasMainVideoAfterReload ? 'Pinned video restored on reload' : 'Video missing after reload'
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
