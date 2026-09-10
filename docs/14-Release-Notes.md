# 14. Release Notes & Version History

> **Current Version**: `v3.0.0` (Production Baseline)  
> **Release Date**: September 2026  
> **Target Celebrant**: Queen Nishika 👑  

---

## Release History

### 🌟 Version 3.0.0 (Current Production Release) — *September 2026*
**Summary**: Complete end-to-end fix and enhancement for Video Uploads, Google Drive / Sheets Recording, Cloud Preview Recovery, and Full Automated Playwright QA Verification.

#### Added
- **Asynchronous Base64 Video Encoding**: Added `readFileAsBase64(file)` Promise helper in `index.html` and `script.js` to encode video uploads to Base64 data strings before form dispatch.
- **Universal Google Drive Video Parser**: Enhanced `parseVideoEmbed` and `parseGasVideoEmbed` to recognize all Google Drive URL variants (`/file/d/`, `open?id=`, `uc?id=`, `thumbnail?id=`, `googleusercontent.com/d/`) and generate responsive HTML5 streaming `<iframe>` video players (`/preview`).
- **Comprehensive Playwright Test Suite**: Created Suite 6 in `playwright-test-runner.js`, expanding automated test coverage to **56 test cases across 6 suites** with a 100% pass rate.
- **10-Column Google Sheets & Drive Schema**: Updated `Code.gs` to decode Base64 video files, store them directly in Google Drive folder `"Eternal Love Wishes (Queen Nishika)"`, and record 10 columns across `"Wishes"`, `"Photos"`, and `"Videos"` sheet tabs.

#### Changed
- **`normalizeCloudImageUrl` Type Enforcement**: Preserves permanent `/preview` video streaming endpoints without converting Drive video links into `lh3...` image thumbnails.
- **Immediate Local Cache Hydration**: Synchronously loads `allWishes` from `localStorage` on page load before cloud sync, guaranteeing instant zero-flicker rendering on refresh.

#### Fixed
- **Dead `blob:` URLs in Google Sheets**: Eliminated transient `blob:http://...` submissions by enforcing Base64 serialization before `fetch()` dispatch.
- **Mobile 320px Horizontal Overflow**: Resolved 56px horizontal overflow on 320px screens (iPhone SE) by overriding sticky card rotation in `@media (max-width: 480px)`.
- **Filter Pill Collision**: Scoped filter pills click selector to `#wishFilterBar .filter-pill`, preventing event collision with `#memoriesFilterBar`.

---

### 🎁 Version 2.5.0 — *August 2026*
**Summary**: Two-Stage Welcome Screen, Passcode-Enforced Unboxing Ceremony, and Comprehensive IEEE-830 Documentation Suite.

#### Added
- **Two-Stage Welcome & Unboxing**: Configured `#introOverlay` (Welcome Screen with 3D bouncing gift box) to appear first; tapping the gift box opens `#pagePasscodeOverlay`.
- **Passcode-Enforced Unboxing**: Prompts for Queen Nishika's birthday passcode (`22092000`) or VIP anniversary PIN (`2912`) to trigger confetti cannon and victory fanfare.
- **14-Document Architecture Suite**: Created detailed IEEE-830 SRS, system architecture, API documentation, and testing reports.

---

### 🎂 Version 2.0.0 — *July 2026*
**Summary**: 25 Celebration Stages, Procedural Web Audio Engine, and Google Sheets Cloud Integration.

#### Added
- **25 Celebration Stages**: Interactive 3D Cake Cutting, 100 Reasons Love Jar, Date Night Fortune Roulette, Love Coupons, Keepsake Certificate, and Star Registry Deed.
- **Polyphonic Web Audio Synthesizer**: Procedural acoustic guitar strums, romantic piano chords, and multi-track ambient soundscape sanctuary.
- **Google Apps Script Integration**: Initial `doGet` and `doPost` webhook integration with Google Sheets.

---

### 🌱 Version 1.0.0 — *June 2026*
**Summary**: Initial Project Prototype.
- Initial HTML5/CSS3 prototype with basic countdown timer and romantic message presentation.
