# Detailed Test Cases & Execution Matrix

> **Status**: `[VERIFIED]` • 56 Automated Test Cases  
> **Automation Harness**: `playwright-test-runner.js`  
> **Overall Execution**: 🟢 **56 / 56 Passed (100% Pass Rate)**  

---

## 1. Automated Test Cases Summary Table

| Test Case ID | Suite & Module | Test Case Title | Priority | Status |
| :--- | :--- | :--- | :---: | :---: |
| `TC-1.1` | Suite 1: Static Assets | GET `/index.html` returns 200 OK with `text/html` | High | 🟢 **PASS** |
| `TC-1.2` | Suite 1: Static Assets | GET `/main.html` returns 200 OK with `text/html` | High | 🟢 **PASS** |
| `TC-1.3` | Suite 1: Static Assets | GET `/style.css` returns 200 OK with `text/css` | High | 🟢 **PASS** |
| `TC-1.4` | Suite 1: Static Assets | GET `/script.js` returns 200 OK with `application/javascript` | High | 🟢 **PASS** |
| `TC-1.5` | Suite 1: Static Assets | GET `/favicon.svg` returns 200 OK with `image/svg+xml` | Medium | 🟢 **PASS** |
| `TC-2.1` | Suite 2: Pre-Launch | `index.html` has valid luxury title | Medium | 🟢 **PASS** |
| `TC-2.2` | Suite 2: Pre-Launch | Live Countdown timer elements render valid positive integers | High | 🟢 **PASS** |
| `TC-2.3` | Suite 2: Pre-Launch | VIP Access Button (`#vipUnlockTrigger`) is present in DOM | High | 🟢 **PASS** |
| `TC-2.4` | Suite 2: Pre-Launch | VIP Modal (`#vipModal`) opens with `.active` class on click | High | 🟢 **PASS** |
| `TC-2.5` | Suite 2: Pre-Launch | Virtual Keypad rejects invalid PIN `"0000"` with shake animation | High | 🟢 **PASS** |
| `TC-2.6` | Suite 2: Pre-Launch | VIP Hint toggle reveals romantic clue without plaintext code | Medium | 🟢 **PASS** |
| `TC-2.7` | Suite 2: Pre-Launch | Virtual Keypad accepts valid anniversary PIN `2912` and routes to `main.html` | Critical | 🟢 **PASS** |
| `TC-2.8` | Suite 2: Pre-Launch | Pre-launch Wishes Submission Form (`#preLaunchWishForm`) exists | High | 🟢 **PASS** |
| `TC-2.9` | Suite 2: Pre-Launch | Submitting wish instantly renders dynamic sticky note on `#stickyNotesGrid` | High | 🟢 **PASS** |
| `TC-2.10`| Suite 2: Pre-Launch | Audio Synthesizer toggle button (`#soundToggleBtn`) triggers music without errors | High | 🟢 **PASS** |
| `TC-2.11`| Suite 2: Pre-Launch | `index.html` executes with 0 uncaught JavaScript or console errors | Critical | 🟢 **PASS** |
| `TC-3.1` | Suite 3: Security | Direct unauthenticated request to `main.html` strictly redirects to `index.html` | Critical | 🟢 **PASS** |
| `TC-3.2` | Suite 3: Security | VIP URL parameter `?vip=unlocked` grants access and bypasses redirect | High | 🟢 **PASS** |
| `TC-3.3` | Suite 3: Security | VIP URL parameter `?preview=true` grants access and bypasses redirect | High | 🟢 **PASS** |
| `TC-3.4` | Suite 3: Security | VIP URL parameter `?passcode=22092000` grants access and bypasses redirect | High | 🟢 **PASS** |
| `TC-3.5` | Suite 3: Security | VIP URL parameter `?pin=2912` grants access and bypasses redirect | High | 🟢 **PASS** |
| `TC-3.6` | Suite 3: Security | Stored `sessionStorage` VIP token bypasses router redirect on `main.html` | High | 🟢 **PASS** |
| `TC-4.1` | Suite 4: Main Arena | Passcode Overlay (`#pagePasscodeOverlay`) exists with unboxing interface | High | 🟢 **PASS** |
| `TC-4.2` | Suite 4: Main Arena | Passcode Keypad rejects invalid passcode with shake animation | High | 🟢 **PASS** |
| `TC-4.3` | Suite 4: Main Arena | Passcode Hint toggle reveals romantic birthday clue (DDMMYYYY Sept 2000) | Medium | 🟢 **PASS** |
| `TC-4.4` | Suite 4: Main Arena | Passcode Keypad validates 8-digit DOB (`22092000`) and unlocks overlay | Critical | 🟢 **PASS** |
| `TC-4.5` | Suite 4: Main Arena | Intro 3D Gift Box screen (`#introOverlay`) exists with "Open Birthday Surprise" CTA | High | 🟢 **PASS** |
| `TC-4.6` | Suite 4: Main Arena | Main Celebration Arena (`#mainApp`) is active and revealed upon unboxing | Critical | 🟢 **PASS** |
| `TC-4.7` | Suite 4: Main Arena | Arena Stage 1: Royal Hero Banner (`#heroSec`) is structured in DOM | High | 🟢 **PASS** |
| `TC-4.8` | Suite 4: Main Arena | Arena Stage 2: Interactive Cake Cutting (`#cakeSec`) is structured in DOM | High | 🟢 **PASS** |
| `TC-4.9` | Suite 4: Main Arena | Arena Stage 3: 100 Reasons Love Jar (`#jarSec`) is structured in DOM | High | 🟢 **PASS** |
| `TC-4.10`| Suite 4: Main Arena | Arena Stage 4: Date Night Fortune Roulette (`#rouletteSec`) is in DOM | High | 🟢 **PASS** |
| `TC-4.11`| Suite 4: Main Arena | Arena Stage 5: Web Audio Synthesizer (`#soundscapeSec`) is structured in DOM | High | 🟢 **PASS** |
| `TC-4.12`| Suite 4: Main Arena | Arena Stage 6: Time Capsule Vault (`#capsuleSec`) is structured in DOM | High | 🟢 **PASS** |
| `TC-4.13`| Suite 4: Main Arena | Arena Stage 7: Love Coupons Redemption (`#couponsSec`) is structured in DOM | High | 🟢 **PASS** |
| `TC-4.14`| Suite 4: Main Arena | Arena Stage 8: Royal Love Letters (`#letterSec`) is structured in DOM | High | 🟢 **PASS** |
| `TC-4.15`| Suite 4: Main Arena | Interactive Cake cutting action executes animation and sound cues smoothly | High | 🟢 **PASS** |
| `TC-4.16`| Suite 4: Main Arena | Web Audio Soundscape sliders adjust procedural audio gain nodes smoothly | High | 🟢 **PASS** |
| `TC-4.17`| Suite 4: Main Arena | `main.html` executes with 0 uncaught JavaScript or console errors | Critical | 🟢 **PASS** |
| `TC-5.1` | Suite 5: Responsiveness | `index.html` [iPhone SE - 320px]: 0px Horizontal Overflow | Critical | 🟢 **PASS** |
| `TC-5.2` | Suite 5: Responsiveness | `main.html` [iPhone SE - 320px]: 0px Horizontal Overflow | Critical | 🟢 **PASS** |
| `TC-5.3` | Suite 5: Responsiveness | `index.html` [iPhone 14 - 375px]: 0px Horizontal Overflow | High | 🟢 **PASS** |
| `TC-5.4` | Suite 5: Responsiveness | `main.html` [iPhone 14 - 375px]: 0px Horizontal Overflow | High | 🟢 **PASS** |
| `TC-5.5` | Suite 5: Responsiveness | `index.html` [iPad - 768px]: 0px Horizontal Overflow | High | 🟢 **PASS** |
| `TC-5.6` | Suite 5: Responsiveness | `main.html` [iPad - 768px]: 0px Horizontal Overflow | High | 🟢 **PASS** |
| `TC-5.7` | Suite 5: Responsiveness | `index.html` [Desktop - 1280px]: 0px Horizontal Overflow | High | 🟢 **PASS** |
| `TC-5.8` | Suite 5: Responsiveness | `main.html` [Desktop - 1280px]: 0px Horizontal Overflow | High | 🟢 **PASS** |
| `TC-5.9` | Suite 5: Responsiveness | `index.html` [4K Ultra-Wide - 2560px]: 0px Horizontal Overflow | High | 🟢 **PASS** |
| `TC-5.10`| Suite 5: Responsiveness | `main.html` [4K Ultra-Wide - 2560px]: 0px Horizontal Overflow | High | 🟢 **PASS** |
| `TC-6.1` | Suite 6: Video & Cloud | Submitting Google Drive video link renders iframe player on `#stickyNotesGrid` | Critical | 🟢 **PASS** |
| `TC-6.2` | Suite 6: Video & Cloud | Submitting video link renders video card in Memories Gallery (`#memoriesGrid`) | High | 🟢 **PASS** |
| `TC-6.3` | Suite 6: Video & Cloud | Reloading `index.html` preserves Drive video iframe without localStorage stripping | Critical | 🟢 **PASS** |
| `TC-6.4` | Suite 6: Video & Cloud | Clicking Video Filter Pill on `index.html` isolates only video sticky notes | Medium | 🟢 **PASS** |
| `TC-6.5` | Suite 6: Video & Cloud | `main.html` Pinboard normalizes `open?id=` Drive link to streaming `/preview` iframe | Critical | 🟢 **PASS** |
| `TC-6.6` | Suite 6: Video & Cloud | Clicking Video Lightbox button expands video into full-screen theater modal | High | 🟢 **PASS** |
| `TC-6.7` | Suite 6: Video & Cloud | Reloading `main.html` preserves pinned video sticky note from state storage | Critical | 🟢 **PASS** |

---

## 2. Sample Detailed Test Case Specifications

### Test Case: `TC-6.1` — Google Drive Video Embed on Sticky Wall
- **Module**: Pre-Launch Portal / Sticky Wish Wall
- **Feature**: Video Attachment Normalization
- **Title**: Submitting Google Drive video link on `index.html` renders responsive iframe player on `#stickyNotesGrid`
- **Priority**: Critical • **Severity**: High
- **Preconditions**: `index.html` loaded in browser.
- **Test Data**: Name: `"Dilip (Royal Video Test)"`, URL: `https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/view`
- **Steps**:
  1. Click `.media-tab-btn[data-tab="tabVideo"]`.
  2. Fill `#guestName` with Test Name.
  3. Fill `#wishVideoUrl` with Drive link.
  4. Click `#submitWishBtn`.
  5. Inspect `#stickyNotesGrid` HTML content.
- **Expected Result**: An `<iframe>` element is rendered with `src="https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview"`.
- **Actual Result**: `<iframe>` element found with `/preview` endpoint.
- **Status**: 🟢 **PASS** `[VERIFIED]`
