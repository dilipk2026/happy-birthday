# 📋 Changelog — Eternal Love Celebration Platform

```
===============================================================================
SEMANTIC VERSIONING & RELEASE HISTORY
Project: Eternal Love — Ultra-Luxurious Romantic Birthday Celebration
Celebrant: Queen Nishika 👑 | Dedicated with Infinite Devotion by: Dilip 💖
Standard: Keep a Changelog (https://keepachangelog.com/en/1.0.0/)
===============================================================================
```

All notable changes, architectural milestones, UI enhancements, and cloud integrations for the **Eternal Love** platform are documented in this file.

---

## 🏷️ Version Index

* [v2.6.0 — Master QA Bug Resolution, Two-Stage Unboxing Architecture, Strict Dual-PIN Security & Automated Playwright Suite (2026-09-09)](#v260--master-qa-bug-resolution-two-stage-unboxing-architecture-strict-dual-pin-security--automated-playwright-suite-2026-09-09)
* [v2.5.2 — Laptop Keyboard Passcode Input Engine & Master Cross-Device Responsiveness Suite (2026-09-07)](#v252--laptop-keyboard-passcode-input-engine--master-cross-device-responsiveness-suite-2026-09-07)
* [v2.5.1 — Codebase Audit, Zero-Error Polish & Royal Passcode Lock Screen on Open Surprise (2026-09-07)](#v251--codebase-audit-zero-error-polish--royal-passcode-lock-screen-on-open-surprise-2026-09-07)
* [v2.5.0 — Live Google Sheets & Google Drive Cloud Fetch & Display Sync (2026-09-07)](#v250--live-google-sheets--google-drive-cloud-fetch--display-sync-2026-09-07)
* [v2.4.0 — Unified Single-Page Application (Combined index.html & coming-soon.html) (2026-09-07)](#v240--unified-single-page-application-combined-indexhtml--coming-soonhtml-2026-09-07)
* [v2.3.1 — Primary Coming Soon Landing & VIP Session Routing (2026-09-07)](#v231--primary-coming-soon-landing--vip-session-routing-2026-09-07)
* [v2.3.0 — Royal Birthday Passcode Gateway (22092000) (2026-09-07)](#v230--royal-birthday-passcode-gateway-22092000-2026-09-07)
* [v2.2.5 — Mobile Constellation of Love & Floating Sky Lanterns Engine (2026-09-07)](#v225--mobile-constellation-of-love--floating-sky-lanterns-engine-2026-09-07)
* [v2.2.4 — Universal Sticky Wall Sync, Photo Uploader & Mobile Nav Polish (2026-09-07)](#v224--universal-sticky-wall-sync-photo-uploader--mobile-nav-polish-2026-09-07)
* [v2.2.3 — Multi-Device Responsiveness & Photo Date Removal (2026-09-07)](#v223--multi-device-responsiveness--photo-date-removal-2026-09-07)
* [v2.2.2 — Launch Date Handover & Romantic Hint Security (2026-09-07)](#v222--launch-date-handover--romantic-hint-security-2026-09-07)
* [v2.2.1 — Coming Soon VIP Security & Icon Polish Patch (2026-09-07)](#v221--coming-soon-vip-security--icon-polish-patch-2026-09-07)
* [v2.2.0 — Interactive Adventures & Ambient Soundscape Suite (2026-09-07)](#v220--interactive-adventures--ambient-soundscape-suite-2026-09-07)
* [v2.1.0 — September Launch Gate & GitHub Pages Release (2026-09-07)](#v210--september-launch-gate--github-pages-release-2026-09-07)
* [v2.0.0 — Gold Master Release (2026-09-05)](#v200--gold-master-release-2026-09-05)
* [v1.5.0 — Google Cloud Serverless Synchronization (2026-09-04)](#v150--google-cloud-serverless-synchronization-2026-09-04)
* [v1.2.0 — Multi-Device 2-Row Navigation & Responsive Overhaul (2026-09-03)](#v120--multi-device-2-row-navigation--responsive-overhaul-2026-09-03)
* [v1.1.0 — Polyphonic Audio Synthesizer & Canvas Particle Engine (2026-09-02)](#v110--polyphonic-audio-synthesizer--canvas-particle-engine-2026-09-02)
* [v1.0.0 — Initial Birthday Inception & Core Experience (2026-09-01)](#v100--initial-birthday-inception--core-experience-2026-09-01)

---

## [v2.6.0] — Master QA Bug Resolution, Two-Stage Unboxing Architecture, Strict Dual-PIN Security & Automated Playwright Suite (2026-09-09)

### 🔒 Strict Dual-PIN Passcode Engine & Security Lockdown
* **Restricted Passcode Validation**: Locked down all passcode verifiers across [`index.html`](file:///c:/Users/Himanshu/Documents/HTML/New%20folder/new/index.html) and [`script.js`](file:///c:/Users/Himanshu/Documents/HTML/New%20folder/new/script.js) strictly to **`22092000`** (Queen Nishika's Date of Birth: 22nd September 2000 in `DDMMYYYY`) and **`2912`** (VIP Anniversary PIN: 29th December in `DDMM`).
* **Non-Plaintext Romantic Hints**: Updated VIP hint modal text to mention the special day they first met in `DDMM` format without revealing the raw digits.
* **Consolidated Physical Keyboard Input**: Unified `keydown` listeners between input elements and the global window object, eliminating duplicate digit entry glitches on laptop and desktop keyboards.

### 🎁 Main Celebration Two-Stage Welcome & Gift Box Unboxing Architecture
* **Welcome Screen First on Arrival**: Upon navigating to [`main.html`](file:///c:/Users/Himanshu/Documents/HTML/New%20folder/new/main.html), the page presents the Welcome Screen (`#introOverlay`) with the 3D animated bouncing gift box, glowing sparkles, and the prompt *"Tap To Open Your Surprise"*.
* **On-Demand Passcode Lock Overlay**: Tapping the 3D gift box or clicking `#openGiftBtn` smoothly opens the Passcode Lock screen (`#pagePasscodeOverlay`). Added `#closePagePasscodeBtn` (`X`) so users can return cleanly to the gift box screen anytime.
* **Celebration Fanfare & Unboxing Animation**: Authenticating with `22092000` or `2912` triggers victory fanfare, bursts multi-color confetti across the viewport, animates the 3D gift box lid open, fades out the overlays, and reveals the Main Celebration Arena (`#mainApp`).

### 💌 Early Birthday Blessing Media Engine & Google Cloud Drive Storage
* **Client-Side Canvas Photo Compression**: Added automated HTML5 Canvas downscaling (`max dimension: 1200px`, `JPEG 0.85`, `<300KB`) on `#wishPhotoInput` to prevent Google Apps Script POST payload timeouts.
* **Video Attachment & URL Integration**: Added support for attaching local video files (`#wishVideoInput`) or pasting video URLs (`#wishVideoUrl` for YouTube, Shorts, Vimeo, Google Drive, MP4).
* **Google Apps Script Drive Pipeline**: [`Code.gs`](file:///c:/Users/Himanshu/Documents/HTML/New%20folder/new/Code.gs) auto-decodes Base64 images and videos, creates files in Google Drive folder `"Eternal Love Wishes (Queen Nishika)"` with public view permissions, and logs the direct preview link to the `"Wishes"` sheet tab.
* **Live Sticky Wall & Full-Screen Media Lightbox**: Submitted blessings render immediately with responsive in-card video players and thumbnail previews on `#stickyNotesGrid`. Clicking any card opens the immersive **Media Lightbox Modal** (`#mediaLightboxModal`).
* **Union Deduplication on Sync**: Upgraded `fetchWishesFromCloud()` to merge cloud entries, `localStorage`, and default dedications without overwriting freshly submitted local notes.

### 🧪 Automated Playwright QA Test Suite & Defect Resolution
* **100% Automated Test Pass Rate**: Developed and verified [`playwright-test-runner.js`](file:///c:/Users/Himanshu/Documents/HTML/New%20folder/new/playwright-test-runner.js), passing all **49/49 test assertions (100%)** with **0 console errors**.
* **Defect Log**: Created [`QA_BUG_REPORT.md`](file:///c:/Users/Himanshu/Documents/HTML/New%20folder/new/documentation/QA_BUG_REPORT.md) resolving 8/8 bugs across Critical (2), High (2), Medium (2), and Low (2) severities.
* **Restored Musical Note**: Corrected guitar string note `5th (A2)` and hotkey label `5th String (A2 • 110.0 Hz)`.
* **Universal HTML Sanitization**: Implemented `escapeHtml(str)` across all dynamic template insertions to guarantee zero XSS risks.

---

## [v2.5.2] — Laptop Keyboard Passcode Input Engine & Master Cross-Device Responsiveness Suite (2026-09-07)

### ⌨️ Physical Laptop Keyboard Passcode Engine
* **VIP Early Access Modal Keyboard Support**: Added direct keyboard event capturing for `#vipModal`. Laptop users can directly type PINs (`2912`, `22092000`), use standard top row digits (`0-9`) or numeric keypad (`Numpad0`-`Numpad9`), `Backspace`/`Delete` to erase, `C` to clear, `Enter` to verify, and `Escape` to close.
* **Open Surprise Passcode Overlay Keyboard Support**: Intercepts keyboard input globally whenever `#pagePasscodeOverlay` is active, feeding keystrokes directly into Queen Nishika's birthday passcode verifier.
* **Vault Passcode Enter Key Submission**: Added `Enter` keypress dispatch on `#vaultPasscodeInput` to unlock the Secret Wish Vault instantly.
* **Shortcut Collision Prevention**: Suppressed background hotkeys whenever any passcode overlay is active.

### 📱 Master Cross-Device Responsiveness Suite
* **All Browser & Device Form-Factors**: Added comprehensive responsive rules across Compact Foldables (280px–360px), Smartphones (375px–430px), Tablets/iPads (600px–1024px), Laptops/Desktops (1025px–1600px), and Ultra-Wide 4K Displays (2000px+).
* **Landscape Orientation Safety**: Optimized modal and passcode overlays for mobile landscape mode (`max-height: 520px`).
* **Touch Target & Safe Area Insets**: Incorporated `env(safe-area-inset-*)` and `touch-action: manipulation` across all buttons and inputs.

---

## [v2.5.1] — Codebase Audit, Zero-Error Polish & Royal Passcode Lock Screen on Open Surprise (2026-09-07)

### 🎁 Royal Passcode Lock on Open Birthday Surprise & 3D Unboxing
* **Passcode-Enforced Unboxing Ceremony**: Added royal passcode protection to the 3D Gift Box Unboxing screen (`#introOverlay` / `#pagePasscodeOverlay`). Prompts for Queen Nishika's birthday passcode (`22092000`) or anniversary PIN (`2912`).
* **Seamless Touch Keypad & Keyboard Support**: Integrated 8-digit visual slot indicators, on-screen glass touch keypad (0-9, Clear, Backspace), auto-verification, and show/hide password toggle.

### 🛠️ Codebase Diagnostic & Bug Fixes
* **HTML Tag & Nesting Balance**: Fixed unclosed/mismatched `<button>` tags, eliminated trailing `</a>` tag errors, and brought all `<div>`, `<section>`, and `<button>` tags into 100% balance.
* **Zero Syntax Errors**: Validated all JavaScript, CSS, and Google Apps Script (`Code.gs`) files with zero syntax errors.

---

## [v2.5.0] — Live Google Sheets & Google Drive Cloud Fetch & Display Sync (2026-09-07)

### ☁️ Live Cloud Sync & Real-Time Data Display
* **Bi-directional Google Sheets & Drive API in `Code.gs`**: Enhanced `doGet(e)` in [`Code.gs`](file:///c:/Users/Himanshu/Documents/HTML/New%20folder/new/Code.gs) to read all rows from `"Wishes"` and `"Photos"` sheets, generating high-res direct Google Drive image CDN URLs and JSONP cross-origin compatibility.
* **Live Wishes & Sticky Notes Display**: [`script.js`](file:///c:/Users/Himanshu/Documents/HTML/New%20folder/new/script.js) automatically fetches saved wishes from Google Sheets on page load and dynamically renders them into sticky grids.
* **Live Google Drive Polaroid Photo Gallery**: Fetches uploaded photos from Google Drive and displays them across Polaroid galleries with 3D hover perspective.

---

## [v2.4.0] — Unified Single-Page Application (Combined index.html & coming-soon.html) (2026-09-07)

### 🌟 Unified Single-Page Application (SPA) Architecture
* **Fusion into `index.html`**: Combined pre-launch teaser, countdown clock, Polaroid photo gallery with real uploader & lightbox, universal sticky notes wall, and VIP keypad directly into [`index.html`](file:///c:/Users/Himanshu/Documents/HTML/New%20folder/new/index.html).
* **Zero Redirect Latency**: Initial page load serves the `#comingSoonStage` with zero layout latency.
* **In-Page Fluid VIP Unlocking**: Entering VIP PIN `2912` or birthday code `22092000` unlocks the celebration stage smoothly with victory fanfare and confetti.

---

## [v2.3.1] — Primary Coming Soon Landing & VIP Session Routing (2026-09-07)

* **Primary Landing Router**: Configured `<head>` router to manage access prior to launch day.
* **Multi-Code VIP Keypad**: Keypad accepts both Anniversary PIN `2912` and Birthday Code `22092000`.

---

## [v2.3.0] — Royal Birthday Passcode Gateway (22092000) (2026-09-07)

* **Passcode Gateway on `index.html` (`#pagePasscodeOverlay`)**: Added glassmorphic lock screen overlay requiring birthday passcode `22092000` (Queen Nishika's Date of Birth: 22nd September 2000).
* **On-Screen Interactive Glass Keypad**: Integrated numeric touch keypad with audio chimes.

---

## [v2.2.5] — Mobile Constellation of Love & Floating Sky Lanterns Engine (2026-09-07)

* **Constellation of Love Mobile Enhancements**: Safe Y-coordinate normalization and touch-to-spawn starlight on `#constellationCanvas`.
* **Floating Sky Lanterns Mobile Festival**: Dynamic screen width spawning and touch-to-release mechanics.

---

## [v2.2.4] — Universal Sticky Wall Sync, Photo Uploader & Mobile Nav Polish (2026-09-07)

* **Bidirectional Save & Fetch**: Full synchronization between `localStorage` and Google Apps Script webhook dispatcher.
* **Exact User Name Reflection**: Enforced author name pass-through to Column B of the Google Sheet.

---

## [v2.2.3] — Multi-Device Responsiveness & Photo Date Removal (2026-09-07)

* **Responsive Breakpoints**: Added CSS media queries for 320px, 420px, 576px, 768px, 992px, and 1200px+.
* **Timeless Milestone Badges**: Replaced hardcoded date strings with romantic milestone badges.

---

## [v2.2.2] — Launch Date Handover & Romantic Hint Security (2026-09-07)

* **Launch Target**: Official grand reveal set to **September 21, 2026 at 23:00 IST**.
* **Romantic Riddle Hint**: Clue regarding anniversary milestone without exposing raw digits.

---

## [v2.2.1] — Coming Soon VIP Security & Icon Polish Patch (2026-09-07)

* **Strict VIP Passcode Enforcement**: Fixed unauthenticated bypasses.
* **Interactive PIN Error Feedback**: Added red glowing borders and shake animations on incorrect attempts.

---

## [v2.2.0] — Interactive Adventures & Ambient Soundscape Suite (2026-09-07)

* **Date Night Fortune Roulette**: Interactive 3D spinning wheel with physics deceleration.
* **Cosmic Ambient Soundscape Sanctuary**: Polyphonic 6-track Web Audio synthesizer.
* **Future Love Time Capsule Vault**: Time-locked digital envelopes with countdown padlocks.
* **Our Cosmic Journey Map**: Real-time astronomical orbital distance and heartbeat calculations.

---

## [v2.1.0] — September Launch Gate & GitHub Pages Release (2026-09-07)

* **Automated Launch Gate**: Clean relative URL resolution and `.nojekyll` configuration for GitHub Pages.

---

## [v2.0.0] — Gold Master Release (2026-09-05)

* **Full Production Release**: Delivered complete 20+ stage celebration suite for Queen Nishika's birthday.
* **Master Documentation Hub**: Added comprehensive architectural specifications, IEEE-830 SRS, user guide, and API reference.

---

## [v1.5.0] — Google Cloud Serverless Synchronization (2026-09-04)

* **Google Apps Script Webhook Engine (`Code.gs`)**: Spreadsheet tabs initialization and Base64 image decoding.

---

## [v1.2.0] — Multi-Device 2-Row Navigation & Responsive Overhaul (2026-09-03)

* **2-Row Header Layout**: Separated branding/audio controls from module navigation chips.

---

## [v1.1.0] — Polyphonic Audio Synthesizer & Canvas Particle Engine (2026-09-02)

* **Native Web Audio API Synthesizer**: Polyphonic piano harmonics, brown noise fireplace, and confetti canvas.

---

## [v1.0.0] — Initial Birthday Inception & Core Experience (2026-09-01)

* Relationship chronometer calibrated to **December 29, 2025**.
* Interactive 3D birthday cake, 100+ Reasons Love Jar, and Secret Vault (`2912`).

---

*Eternal Love Platform — Continuously refined with boundless devotion.* 👑💖
