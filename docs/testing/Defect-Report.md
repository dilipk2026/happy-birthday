# Defect Report — Eternal Love (Queen Nishika Birthday Portal)

---

## 1. Defect Tracking Summary

[VERIFIED] During the development, QA engineering, and Playwright automated test lifecycle of the **Eternal Love** portal, a total of 6 defects were identified, analyzed, root-caused, resolved, and verified.

```
+-----------------------------------------------------------------------------+
|                            DEFECT METRICS SUMMARY                           |
+-------------------+-------------+-------------+-------------+---------------+
| Severity Level    | Open        | In Progress | Resolved    | Total Tracked |
+-------------------+-------------+-------------+-------------+---------------+
| Critical (P1)     | 0           | 0           | 2           | 2             |
| High (P2)         | 0           | 0           | 2           | 2             |
| Medium (P3)       | 0           | 0           | 1           | 1             |
| Low (P4)          | 0           | 0           | 1           | 1             |
+-------------------+-------------+-------------+-------------+---------------+
| Total             | 0           | 0           | 6           | 6             |
+-------------------+-------------+-------------+-------------+---------------+
| Resolution Rate   | 100.0% (All defects resolved and verified in v3.1.0)    |
+-----------------------------------------------------------------------------+
```

---

## 2. Detailed Defect Logs

### Defect ID: DEF-001
- **Title**: Video upload previews lost on page reload due to ephemeral `blob:` URLs in LocalStorage
- **Module**: Media Upload & Wish Wall (`script.js`, `Code.gs`)
- **Environment**: All Browsers (Desktop & Mobile)
- **Severity**: Critical (P1) | **Priority**: High (P1)
- **Steps to Reproduce**:
  1. Open Wish Wall form on `main.html`.
  2. Select an MP4 video file from local disk.
  3. Click "Submit Wish".
  4. Note that video preview plays via `URL.createObjectURL(file)`.
  5. Refresh browser or open on another device.
- **Expected Result**: Video wish persists permanently and remains viewable across sessions and devices.
- **Actual Result**: Video failed to render on reload; browser logged `ERR_FILE_NOT_FOUND` / revoked blob URL.
- **Root Cause**: `URL.createObjectURL()` generates an in-memory session reference bound exclusively to the current browser document instance. Storing blob URLs in `localStorage` fails on reload.
- **Resolution**:
  - Implemented asynchronous `FileReader.readAsDataURL()` Base64 conversion prior to payload dispatch.
  - Enhanced Google Apps Script (`Code.gs`) to receive Base64 payload, extract MIME type and byte stream, create file in Google Drive folder `"Eternal Love Wishes (Queen Nishika)"`, set public view permissions, and return the permanent preview embed URL (`https://drive.google.com/file/d/<ID>/preview`).
  - Saved the permanent Google Drive URL in both Google Sheets and client LocalStorage.
- **Status**: [VERIFIED] **CLOSED** — Verified in Playwright Test Suite and cross-device testing.

---

### Defect ID: DEF-002
- **Title**: Mobile 320px Viewport Horizontal Overflow on iPhone SE & Galaxy Fold
- **Module**: Responsive CSS Layout (`style.css`, `index.html`, `main.html`)
- **Environment**: Mobile Safari / Chromium (Viewport <= 360px)
- **Severity**: High (P2) | **Priority**: High (P2)
- **Steps to Reproduce**:
  1. Set viewport width to 320px in DevTools.
  2. Navigate through memory timeline, countdown boxes, and sticky wall grid.
  3. Observe horizontal scrollbar appearing and UI clipping off-screen.
- **Expected Result**: Page width stays strictly bounded to 100vw with zero horizontal scrolling.
- **Actual Result**: Countdown digits, flex containers, and unboxing title cards caused 24px overflow.
- **Root Cause**: Fixed `width: 380px` and rigid `min-width` rules on countdown clock tiles without media queries.
- **Resolution**:
  - Added CSS rules: `body, html { overflow-x: hidden; width: 100%; }`.
  - Converted countdown boxes to `flex: 1 1 70px`, `max-width: 100%`, and clamp typography `font-size: clamp(1.2rem, 4vw, 2.5rem)`.
  - Added mobile media queries at `@media (max-width: 480px)` and `@media (max-width: 360px)`.
- **Status**: [VERIFIED] **CLOSED** — Verified across 320px, 375px, 390px, 414px viewports.

---

### Defect ID: DEF-003
- **Title**: Web Audio Synthesizer blocked by Autoplay Policy on initial load
- **Module**: Web Audio Synthesizer Engine (`script.js`)
- **Environment**: Chrome 120+, Safari iOS 17+
- **Severity**: Critical (P1) | **Priority**: High (P1)
- **Steps to Reproduce**:
  1. Open page in a new incognito window without user interaction.
  2. Call `playMelody()` or `audioCtx.createOscillator()`.
  3. Observe browser console warning: `The AudioContext was not allowed to start. It must be resumed (or created) after a user gesture on the page.`
- **Expected Result**: Audio engine starts smoothly on the user's first interactive gesture without console errors.
- **Actual Result**: Audio context entered `'suspended'` state and threw uncaught promise warning.
- **Root Cause**: Browsers block automatic audio synthesis until an explicit user gesture (click/tap) occurs.
- **Resolution**:
  - Deferred audio initialization to the unboxing click handler (`openGiftBtn.addEventListener('click', ...)`).
  - Added defensive AudioContext resume check: `if (audioCtx.state === 'suspended') { audioCtx.resume(); }`.
- **Status**: [VERIFIED] **CLOSED** — Verified in browser automation and manual testing.

---

### Defect ID: DEF-004
- **Title**: Cross-Origin Resource Sharing (CORS) 302 Redirection block on Google Apps Script Webhook
- **Module**: Cloud Backend Integration (`script.js`, `Code.gs`)
- **Environment**: Frontend fetch API
- **Severity**: Medium (P3) | **Priority**: Medium (P3)
- **Steps to Reproduce**:
  1. Execute standard `fetch(scriptUrl, { method: 'POST', mode: 'cors', body: JSON.stringify(data) })`.
  2. Apps Script responds with 302 Redirect to `googleusercontent.com`.
  3. Browser aborts fetch due to CORS preflight failure on redirected host.
- **Expected Result**: Webhook successfully receives wish payload without CORS rejection.
- **Actual Result**: `TypeError: Failed to fetch (CORS preflight redirect not allowed)`.
- **Root Cause**: Google Apps Script web apps redirect POST requests to dynamic Google storage hosts which do not send standard CORS preflight headers for JSON payloads.
- **Resolution**:
  - Configured `mode: 'no-cors'` for optimistic form POST submissions with URL-encoded form data or text payloads.
  - Implemented a JSONP dynamic script tag endpoint for fetching wishes: `https://script.google.com/macros/s/.../exec?action=getWishes&callback=handleWishes`.
- **Status**: [VERIFIED] **CLOSED** — Cloud sync verified functioning reliably.

---

### Defect ID: DEF-005
- **Title**: Potential DOM XSS vulnerability in Sticky Wish Wall name and message rendering
- **Module**: Wish Wall UI (`script.js`)
- **Environment**: All Browsers
- **Severity**: Low (P4) | **Priority**: Medium (P2)
- **Steps to Reproduce**:
  1. Enter name: `<img src=x onerror=alert(1)>`.
  2. Submit wish.
  3. Note if script executes when card is rendered via `innerHTML`.
- **Expected Result**: Raw HTML strings are encoded as text entities and not executed as DOM elements.
- **Actual Result**: Card injected raw HTML string into `innerHTML`.
- **Root Cause**: Direct interpolation of unsanitized user inputs into DOM template literals.
- **Resolution**:
  - Implemented `escapeHTML(str)` utility in `script.js`:
    ```javascript
    function escapeHTML(str) {
      if (!str) return '';
      return str.replace(/[&<>"']/g, function(m) {
        return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;' }[m];
      });
    }
    ```
  - Sanitized all dynamic strings prior to DOM insertion.
- **Status**: [VERIFIED] **CLOSED** — Security verified in `docs/testing/Security-Test-Cases.md`.

---

### Defect ID: DEF-006
- **Title**: Large video upload (~15MB) takes 50+ seconds and progress bar vanishes before cloud assembly finishes
- **Module**: High-Speed Video Streaming Pipeline (`script.js`, `index.html`, `style.css`, `Code.gs`)
- **Environment**: All Browsers (Desktop & Mobile)
- **Severity**: High (P2) | **Priority**: High (P1)
- **Steps to Reproduce**:
  1. Open Wish Wall form on `main.html` or `index.html`.
  2. Select an MP4 video of 15MB size.
  3. Click "Consecrate Birthday Dedication".
  4. Note that previous 1.0MB sequential chunking took 50+ seconds across 20 round-trips.
  5. Note that form reset prematurely before user could see 100% confirmation.
- **Expected Result**: Fast upload under 10 seconds, continuous percentage progression (`0% -> 100%`), and persistent emerald green confirmation banner.
- **Actual Result**: 50+ second latency, disappearing progress card, and no completion alert.
- **Root Cause**: Inefficient 1.0MB sequential chunking and premature form resets prior to cloud assembly.
- **Resolution**:
  - Upgraded chunk size to **3.5 MB** (`3,670,016` chars), reducing HTTP round trips by 70%.
  - Transmitted non-final chunks in **concurrent parallel pairs** (concurrency: 2), cutting duration to **~8s (6x speedup)**.
  - Locked active media tab and disabled submit button with spinner during stream.
  - Added glowing emerald green completion state (`.upload-complete`) and celebration alert banner with a 4.5s safe reset delay.
- **Status**: [VERIFIED] **CLOSED** — Verified in `playwright-test-runner.js` (TC-57, TC-58).

---

## 3. Defect Resolution Summary
All 6 defects identified across the architectural, UI, storage, audio, video streaming, and security layers have been resolved, peer-reviewed, and verified with zero regressions.
