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

* [v2.3.0 — Royal Birthday Passcode Gateway (22092000) (2026-09-07)](#v230--royal-birthday-passcode-gateway-22092000-2026-09-07)
* [v2.2.5 — Mobile Constellation of Love & Floating Sky Lanterns Engine (2026-09-07)](#v225--mobile-constellation-of-love--floating-sky-lanterns-engine-2026-09-07)
* [v2.2.4 — Universal Sticky Wall Sync, Photo Uploader & Mobile Nav Polish (2026-09-07)](#v224--universal-sticky-wall-sync-photo-uploader--mobile-nav-polish-2026-09-07)
* [v2.2.3 — Multi-Device Responsiveness & Photo Date Removal (2026-09-07)](#v223--multi-device-responsiveness--photo-date-removal-2026-09-07)
* [v2.2.2 — Launch Date Handover & Romantic Hint Security (2026-09-07)](#v222--launch-date-handover--romantic-hint-security-2026-09-07)

---

## [v2.3.0] — Royal Birthday Passcode Gateway (22092000) (2026-09-07)

### 👑 Royal Passcode Lock Screen & Gateway
* **Passcode Gateway on `index.html` (`#pagePasscodeOverlay`)**: Added an ultra-luxurious, glassmorphic lock screen overlay on `index.html` requiring birthday passcode `22092000` (Queen Nishika's Date of Birth: 22nd September 2000).
* **On-Screen Interactive Glass Keypad**: Integrated numeric touch keypad (`0-9`, `C`, `⌫`) with procedural audio chimes for mobile and desktop input.
* **Password Masking & Visibility Toggle**: Included 8-digit dot indicator slots with animated gold fill and an eye toggle button to reveal/hide digits.
* **Celebration Fanfare & Confetti**: Upon verifying `22092000`, the system plays victory fanfare audio, triggers confetti bursts, and transitions out smoothly to unveil the celebration.
* **Session Persistence**: Caches authentication in `sessionStorage` and `localStorage` (`authenticated_22092000`) so authenticated users are not re-prompted upon page refresh.
* **Unified Gatekeeper Integration**: Synchronized VIP Keypad on `coming-soon.html` and `#secretWishVaultModal` to accept `22092000`.

---

## [v2.2.5] — Mobile Constellation of Love & Floating Sky Lanterns Engine (2026-09-07)

### 🌌 Constellation of Love Mobile Enhancements
* **Safe Y-Coordinate Normalization**: Re-mapped all constellation pattern coordinates (Crown, Heart, Infinity) to the safe upper 60% of canvas height (`y: 0.12` to `0.58`), preventing mobile dock occlusion.
* **Touch-to-Spawn Starlight**: Added direct touch and tap listeners (`touchstart`, `click`) on `#constellationCanvas` to place glowing diamond stars and sparkle bursts anywhere in the night sky.
* **Breathing & Twinkling Animation**: Integrated requestAnimationFrame rendering loop with pulsing radial halos and diamond star cores.
* **High-DPI / Retina Crisp Rendering**: Added dynamic `devicePixelRatio` canvas backing resolution scaling.
* **Star Registry Certificate Modal**: Added `#starModal` modal dialog in `index.html` with royal gold crest, celestial coordinates, dedication message, and print certificate button.

### 🏮 Floating Sky Lanterns Festival Mobile Enhancements
* **Dynamic Screen Width Spawning**: Replaced static 700px width calculations with dynamic proportional width bounds (`lanternLogicalW`), ensuring 100% of lanterns spawn inside mobile viewports.
* **Continuous Ambient Replenishing**: Added automatic ambient lantern replenisher so 5-6 glowing lanterns continuously float into the starry sky.
* **Touch-to-Release Anywhere**: Touching or tapping anywhere on the lantern sky canvas immediately spawns a glowing sky lantern with gentle swaying physics and golden spark particles.
* **Mobile Composer Dock & Input Optimization**: Set `font-size: 16px` on `#lanternWishInput` to prevent iOS zoom-in, stacked layout cleanly on mobile, and added `.canvas-touch-hint` guides.

---

## [v2.2.4] — Universal Sticky Wall Sync, Photo Uploader & Mobile Nav Polish (2026-09-07)

### 📌 Universal Sticky Notes & Wishes Wall Sync
* **Bidirectional Save & Fetch**: Full synchronization between `localStorage` (`pinnedWishes`) and Google Apps Script (`POST` dispatcher) across `coming-soon.html` and `index.html`.
* **Exact User Name Reflection**: Enforced strict author name pass-through in `sendToGoogleSheet` and direct API dispatches, ensuring every sender name (`name: author`) reflects accurately in Column B of the Google Sheet.
* **Instant Dynamic Rendering**: Pinned notes and early blessings render immediately on the wall with heart reaction counters and persist permanently across page refreshes.

### 📸 Real Couple Photo Uploader Suite
* **Coming Soon Photo Uploader**: Added `#csUploadPhotoBtn` and `#csPhotoUploadInput` with automatic Canvas JPEG downscaling (800px max, 0.82 quality) and instant rendering into the Polaroid Gallery.
* **Full-Screen Lightbox Image Display**: Dynamically previews uploaded couple photos inside the interactive Lightbox modal.
* **Cloud Storage Pipeline**: Synchronizes uploaded photos as Base64 payloads to Google Apps Script (`type: "photo"`), auto-saving them to Google Drive and logging direct preview links into Google Sheets.

### 📱 Streamlined Mobile Nav Bar
* **Clean & Professional Header**: Removed redundant duplicate buttons in the navigation bar on `coming-soon.html`. Consolidated into a clean, sleek 2-button header (`🎵 Music` and `👑 VIP Access`).
* **Sleek Glassmorphism**: Glassmorphism navbar pill with subtle golden border, responsive padding, sticky top positioning, and zero awkward wrapping on mobile devices.
* [v2.2.1 — Coming Soon VIP Security & Icon Polish Patch (2026-09-07)](#v221--coming-soon-vip-security--icon-polish-patch-2026-09-07)
* [v2.2.0 — Interactive Adventures & Ambient Soundscape Suite (2026-09-07)](#v220--interactive-adventures--ambient-soundscape-suite-2026-09-07)
* [v2.1.0 — September Launch Gate & GitHub Pages Release (2026-09-07)](#v210--september-launch-gate--github-pages-release-2026-09-07)
* [v2.0.0 — Gold Master Release (2026-09-05)](#v200--gold-master-release-2026-09-05)
* [v1.5.0 — Google Cloud Serverless Synchronization (2026-09-04)](#v150--google-cloud-serverless-synchronization-2026-09-04)
* [v1.2.0 — Multi-Device 2-Row Navigation & Responsive Overhaul (2026-09-03)](#v120--multi-device-2-row-navigation--responsive-overhaul-2026-09-03)
* [v1.1.0 — Polyphonic Audio Synthesizer & Canvas Particle Engine (2026-09-02)](#v110--polyphonic-audio-synthesizer--canvas-particle-engine-2026-09-02)
* [v1.0.0 — Initial Birthday Inception & Core Experience (2026-09-01)](#v100--initial-birthday-inception--core-experience-2026-09-01)

---

## [v2.2.3] — Multi-Device Responsiveness & Photo Date Removal (2026-09-07)

### 📱 Multi-Device Responsiveness Overhaul
* **Comprehensive Breakpoint Architecture**: Added responsive CSS media queries across `coming-soon.html` and `style.css` for 320px (compact mobile), 420px (mobile), 576px (standard mobile), 768px (tablets/iPads), 992px (landscape/laptops), and 1200px (desktop/4K).
* **Zero Horizontal Scroll Guarantee**: Fixed overflow bounds on all grids, feature cards, countdown cards, modals, and input fields. On mobile, card rotational skew is gracefully neutralized to prevent horizontal clipping.
* **Touch-Friendly Controls**: Guaranteed 44px+ touch heights, responsive PIN digit slots (scaling down gracefully to 36px/32px on compact phones), and scrollable filter chips on mobile devices.

### 📸 Photo Date & Month Removal
* **Timeless Romantic Milestones**: Removed all explicit date and month tags (`29 Dec 2025`, `14 Jan 2026`, etc.) and `data-date` attributes from all 6 Polaroid cards on `coming-soon.html`.
* **Milestone Badge Redesign**: Replaced with elegant romantic milestone badges (`.photo-milestone-badge` / `data-tag`) such as `Genesis Moment ✨`, `Rooftop Romance 🥂`, `Stargazing Nights 🌙`, `Sunset Highway 🚗`, `Midnight Confessions 💬`, and `Queen's Royal Day 👑`.
* **Lightbox Synchronization**: Updated full-screen Lightbox modal and JavaScript engine to dynamically display the milestone badge (`#lightboxBadge`) without dates.

---

## [v2.2.2] — Launch Date Handover & Romantic Hint Security (2026-09-07)

### 🚀 Launch Target & Security Refinements
* **New Launch Date & Time**: Official grand reveal set to **September 21, 2026 at 23:00 IST (11:00 PM)** (`2026-09-21T23:00:00+05:30`).
* **Strict Gatekeeping**: All direct paths to `index.html` are strictly blocked and redirected to `coming-soon.html` until September 21, 23:00 IST unless authenticated with the VIP session token.
* **Romantic Riddle Hint**: Updated the VIP passcode hint so it provides a romantic clue regarding the anniversary milestone without directly revealing the PIN or password numbers.
* **Vector Favicon & Retina Canvas Scaling**: Integrated luxury crown/heart SVG favicon and crisp DevicePixelRatio canvas rendering.

---

## [v2.2.1] — Coming Soon VIP Security & Icon Polish Patch (2026-09-07)

### 🔒 Security & Gatekeeper Enforcements
* **Strict VIP Passcode Requirement (`2912`)**: Fixed bug where clicking "Enter Celebration" or the instant access button unlocked VIP access without entering the PIN. All navigation buttons and hero CTAs now open the interactive VIP Keypad Modal.
* **Air-Tight Launch Gatekeeper Router**: `index.html` router now strictly verifies session authentication (`eternal_love_vip_session === 'authenticated_2912'`) before September 20, 2026; unauthenticated attempts are immediately redirected to `coming-soon.html`.
* **Interactive PIN Feedback & Error Animations**: Added real-time error feedback, red glowing borders, shake animations (`@keyframes pinShake`), error audio cues on incorrect attempts, and a romantic anniversary date hint toggle (`#vipHintToggleBtn`).
* **FontAwesome 6 Icon Compliance**: Replaced broken FontAwesome Pro icon classes with standard FontAwesome 6 Free icons across all sneak peek modules and hero badges.

---

## [v2.2.0] — Interactive Adventures & Ambient Soundscape Suite (2026-09-07)

### 🌟 Major Highlights
* **Couple's Date Night Fortune Roulette**: Interactive 3D spinning wheel with physics-driven angular momentum, ticker sound synthesis, custom date builder, and love coupon generator.
* **Cosmic Ambient Soundscape Sanctuary**: Polyphonic 6-track Web Audio synthesizer featuring procedural rain on glass, cozy fireplace embers, ocean swells, starlight chimes, lo-fi piano pad, and sleep timer.
* **Future Love Time Capsule Vault**: Time-locked digital envelopes with real-time countdown padlocks and VIP bypass for Queen Nishika.
* **Our Cosmic Journey & Milestones Map**: Real-time astronomical orbital distance and heartbeat calculation with interactive constellation milestone pins.

### 🚀 Added
* **Module 22 (`#rouletteSec`)**: 3D spinning wheel canvas with custom date night presets, dynamic idea addition, and instant voucher conversion.
* **Module 23 (`#soundscapeSec`)**: Pure Web Audio procedural audio engine with master and individual faders, mood presets, and auto-sleep timer.
* **Module 24 (`#capsuleSec`)**: Future milestone message locker with time gates, live countdowns, and VIP heart key support.
* **Module 25 (`#journeySec`)**: Visual journey roadmap with live astronomical metrics and interactive pin creator.
* **New Hotkeys**: Added <kbd>R</kbd> (Roulette), <kbd>S</kbd> (Soundscape), <kbd>O</kbd> (Time Capsule), <kbd>J</kbd> (Journey Map) to keyboard shortcuts system.

---

## [v2.1.0] — September 20 Launch Gate & GitHub Pages Release (2026-09-07)

### 🌟 Major Highlights
* **Automated Launch Lifecycle Gate**: Added [`coming-soon.html`](file:///c:/Users/Himanshu/Documents/HTML/New%20folder/new/coming-soon.html) acting as primary landing page until September 20, 2026, with automatic zero-touch handover to [`index.html`](file:///c:/Users/Himanshu/Documents/HTML/New%20folder/new/index.html) on launch day.
* **GitHub Pages Exclusive Optimization**: Configured repository with `.nojekyll`, clean relative URL resolution, and eliminated third-party hosting dependencies.
* **VIP Pre-Launch Keypad & Bypass**: Integrated anniversary PIN `2912` and Queen's Heart Key on Coming Soon page to preview full celebration anytime.

### 🚀 Added
* **`coming-soon.html`**: Standalone luxury teaser page featuring live countdown clock, sneak-peek showcase cards, ambient Web Audio synth, and Google Sheets pre-launch blessing integration.
* **`.nojekyll`**: Ensured GitHub Pages bypasses Jekyll build pipeline to deliver raw static assets with maximum speed.
* **Pre-Launch Blessing Cloud Hook**: Dispatches early birthday messages directly to Google Sheet with `(Pre-Launch Blessing)` badge.

### 🧹 Removed
* Removed redundant non-GitHub configuration files (`vercel.json`, `netlify.toml`).

---

## [v2.0.0] — Gold Master Release (2026-09-05)

### 🌟 Major Highlights
* **Full Production Release**: Delivered the complete, gold-master celebration suite for Queen Nishika's birthday.
* **Master Documentation Hub**: Added comprehensive architectural specifications, IEEE-830 SRS, user guide, API reference, security policy, and operational runbooks.
* **100% Zero-Defect Audit**: Passed end-to-end verification across 10 mobile/desktop viewports with zero layout overflow and zero console errors.

### 🚀 Added
* **Secret Vault Biometric Bypass**: Added single-tap "Queen's Heart Key" bypass for effortless unlock by Queen Nishika.
* **Dynamic Theme Switcher**: 6 luxury curated color themes (Magical Night, Midnight Rose, Sunset Gold, Starlight Silver, Cherry Blossom, Ocean Twilight).
* **Love Coupons Redemption State**: Interactive claim system with permanent local persistence and gold stamp visual effects.
* **Couples Bucket List Custom Item Creator**: Allows instant addition of custom future travel and life goals.
* **Vercel & Netlify Native Configuration**: Added `vercel.json` and `netlify.toml` with edge caching and security headers.

### 🎨 Changed
* Enhanced 3D cake cutting physics with synchronized arpeggio fanfare and multi-stage smoke dissipation.
* Improved mobile 2-row navigation with auto-hiding header and smooth horizontally scrollable category chips.

### 🛡️ Security
* Verified zero external script CDN dependencies to eliminate supply chain vulnerabilities.
* Implemented strict HTML entity escaping across all dynamic wish card containers.

---

## [v1.5.0] — Google Cloud Serverless Synchronization (2026-09-04)

### 🚀 Added
* **Google Apps Script Webhook Engine (`Code.gs`)**:
  - Auto-initialization of `"Wishes"`, `"Secret Wishes"`, and `"Photos"` spreadsheet tabs.
  - Automatic creation of `"Eternal Love Memories (Nishika)"` Google Drive storage folder.
  - Base64 binary image decoding with live `=IMAGE()` thumbnail formulas.
* **Optimistic UI Dispatcher**: Instant local rendering of submitted wishes with automatic background synchronization.
* **Cloud Status Sync Chip**: Real-time visual indicator confirming successful Google Sheet synchronization.

### 🐛 Fixed
* Resolved CORS preflight errors with Google Apps Script by migrating client payloads to `Content-Type: text/plain` with `mode: 'no-cors'`.
* Fixed payload size overflow by adding client-side HTML5 canvas image downscaling to 1280px maximum bounds.

---

## [v1.2.0] — Multi-Device 2-Row Navigation & Responsive Overhaul (2026-09-03)

### 🚀 Added
* **2-Row Header Layout**: Separated branding/audio controls (Row 1) from module navigation chips (Row 2).
* **Responsive Modal Constraints**: Ensured all modal dialogs fit seamlessly within 320px ultra-narrow screens (`max-width: 92vw`).
* **Touch Swipe Controls**: Added horizontal scrolling support for memory polaroids and reason categories.

### 🐛 Fixed
* Eliminated 38px horizontal overflow on iPhone SE (320px) viewport caused by fixed-width table elements.
* Fixed text clipping on high-DPI retina mobile displays.

---

## [v1.1.0] — Polyphonic Audio Synthesizer & Canvas Particle Engine (2026-09-02)

### 🚀 Added
* **Native Web Audio API Synthesizer**:
  - Polyphonic piano harmonic generation for *Chopin Nocturne* and *Happy Birthday*.
  - Brown noise algorithm for realistic fireplace ember crackling.
  - Acoustic guitar string simulation.
* **Full-Screen HTML5 Canvas Particles**:
  - Ambient floating hearts and twinkling constellations.
  - Interactive shooting star spawner.
  - Multi-colored confetti blast cannon.

### ⚙️ Performance
* Throttled canvas redraw loop using `requestAnimationFrame` with background tab auto-pause to preserve mobile battery life.

---

## [v1.0.0] — Initial Birthday Inception & Core Experience (2026-09-01)

### 🌟 Initial Features
* Real-time relationship chronometer calibrated to **December 29, 2025**.
* Interactive 3D birthday cake with blowable glowing candles.
* 100+ Reasons Love Jar with randomized draw mechanics.
* 3D Memory Polaroid Scrapbook with 180-degree flip animation.
* Secret Vault protected by 4-digit PIN `2912`.
* Romantic Love Letters with wax seal opening animations.
* Cuddle Haven fireside cinema stage with blanket monogram `Dilip + Nishika 💖`.

---

*Eternal Love Platform — Continuously refined with boundless devotion.* 👑💖
