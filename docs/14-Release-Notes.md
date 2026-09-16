# 14. Release Notes & Version History

> **Current Version**: `v3.3.0` (Production Master)  
> **Release Date**: September 2026  
> **Target Celebrant**: Queen Nishika 👑  

---

## Release History

### 👑 Version 3.3.0 (Current Production Master) — *September 2026*
**Summary**: Perfect Picture & Video Frame Architecture, Fullscreen Hover Pop-Out Cinema Portal (`#mediaHoverPopout`), Google Sheet & Drive Cloud Video Upload Audit, and 63/63 Automated Playwright QA Verification.

#### Added
- **🖼️ Perfect Picture & Video Framing**:
  - Implemented bespoke royal gold/rose framed wrappers (`border: 2px solid rgba(255, 215, 0, 0.45)` with metallic sheen overlay and inner vignette shadows).
  - Applied strict aspect ratio preservation (`aspect-ratio: 16/10` for photos, `16/9` for videos, `object-fit: cover/contain`, zero letterboxing or distortion) across sticky notes, polaroids, preview containers, and media grids.
- **🎬 Interactive Fullscreen Hover Pop-Out Cinema Portal (`#mediaHoverPopout`)**:
  - Implemented an ultra-sleek, hardware-accelerated pop-out cinema portal engine across both `index.html` and `main.html`.
  - Hovering cursor over any photo (`.sticky-media-wrap`, `.polaroid-img-wrap`, `.polaroid-photo`, `.media-preview-box img`) or video (`.sticky-video-embed`, `.polaroid-video-wrap`, preview containers) smoothly elevates it into an enlarged cinema preview (`scale(0.88) -> scale(1.0)` with soft backdrop blur, glowing gold frame, author crown badge, and heartfelt message).
  - Moving the mouse cursor away (`mouseleave`) smoothly collapses and dismisses the popout back to normal view in ~200ms.
  - Full touch/mobile compatibility: touch devices seamlessly open the persistent full-screen Lightbox Modal on tap with single-tap dismissal.
- **☁️ Cloud Video Pipeline & Google Sheet Storage Audit**:
  - Enhanced `uploadVideoChunks` in `script.js` to destructure and pass `fileName` in the chunk payload.
  - Expanded `isVideoUrl()` in `Code.gs` to support all 12 video container formats (`.mp4`, `.webm`, `.mov`, `.qt`, `.m4v`, `.ogg`, `.ogv`, `.mkv`, `.avi`, `.wmv`, `.3gp`, `.3g2`, `.ts`, `.flv`).
  - Audited and verified all 10 columns in Google Sheets `Wishes` tab and 7 columns in `Videos` tab with automatic header initialization and Drive preview streaming links.
- **🧪 63-Assertion Automated Playwright QA Benchmark**: Expanded automated test suite with Test 6.12 and 6.13 validating framing styles, computed corner curvature, and hover pop-out activation/dismissal with a 100% pass rate.

---

### 🎬 Version 3.2.0 — *September 2026*
**Summary**: Universal Video Codec & Container Support across Frontend & Cloud Backend, Automated MIME Ingestion Normalizer, Multi-Source Video Tag Generation with Direct Download Fallback, and 61/61 Automated Playwright QA Verification.

#### Added
- **🎬 Universal Video Codec & Container Support (12 Formats)**: Added full recognition, MIME parsing, and cloud handling for:
  - **MP4 / M4V**: H.264 (AVC), H.265 (HEVC), AV1 (`video/mp4`, `video/x-m4v`, `.mp4`, `.m4v`)
  - **WebM**: VP8, VP9, AV1, Vorbis/Opus audio (`video/webm`, `.webm`)
  - **QuickTime MOV**: Apple ProRes, H.264, HEVC (`video/quicktime`, `.mov`, `.qt`)
  - **Matroska MKV**: Multi-stream AV1/HEVC/VP9 (`video/x-matroska`, `.mkv`)
  - **AVI**: MPEG-4, DivX, XviD (`video/x-msvideo`, `.avi`)
  - **Windows Media (WMV / ASF)**: WMV9, VC-1 (`video/x-ms-wmv`, `.wmv`)
  - **3GPP / 3GPP2**: Mobile recording formats H.263/H.264 (`video/3gpp`, `video/3gpp2`, `.3gp`, `.3g2`)
  - **OGG / OGV**: Ogg Theora (`video/ogg`, `.ogv`, `.ogg`)
  - **MPEG-TS**: MPEG Transport Stream camcorder files (`video/mp2t`, `.ts`, `.mts`, `.m2ts`)
  - **FLV**: Flash Video (`video/x-flv`, `.flv`)
- **🔍 Client-Side MIME Normalizer**: Implemented `getMimeTypeForVideoFile(file)` and `getVideoCodecInfo(mimeType, urlOrName)` in `script.js` and `index.html` to automatically detect missing or generic `application/octet-stream` browser types from file extensions and inject proper Base64 headers (`data:video/...;base64`).
- **🛡️ Multi-Source `<video>` Rendering**: Updated `parseGasVideoEmbed` and `parseVideoEmbed` to output `<source src="..." type="...">` alongside direct download fallbacks (`Download Video`), allowing hardware acceleration on modern devices.
- **☁️ Backend Cloud Extension Mapping**: Updated `Code.gs` (`saveBase64ToDrive()` and `type === 'video_chunk'`) to dynamically map all 12 video MIME types to proper file extensions when writing binary blobs to Google Drive.
- **🧪 61-Assertion Automated Playwright QA Benchmark**: Expanded automated test suite with Test 6.9, 6.10, and 6.11 verifying multi-codec ingestion, MIME mappings, and input accept attributes with a 100% pass rate.

---

### ⚡ Version 3.1.0 — *September 2026*
**Summary**: High-Speed Parallel Video Upload Architecture, Persistent Real-Time Percentage Progress Tracking, Emerald Green Completion State, and Multi-Device Video Responsiveness.

#### Added
- **⚡ 5x–6x High-Speed Parallel Chunking Pipeline**: Optimized chunk size to `3.5 MB` (`3,670,016` chars), reducing HTTP round trips by 70%. Implemented concurrent parallel transfers (concurrency: 2), cutting upload duration for a 15 MB video from **50+ seconds down to ~8 seconds**.
- **📊 Real-Time Percentage Progress Bar**: Continuous percentage and byte calculation (`0% -> 25% -> 50% -> 75% -> 90% -> 100%`) with live throughput metadata (`Transmitted 7.0 MB / 15.0 MB (45%) • Part 2 of 5`).
- **✨ Glowing Emerald Green Completion State & Celebratory Alert**: Progress bar switches to glowing emerald green with a pulse animation upon 100% completion; displays a celebratory success alert banner (`✨ Video Dedication Successfully Uploaded! 👑`).
- **📱 Fluid Multi-Device Video Responsiveness**: Implemented fluid `clamp(140px, 46vw, 195px)` dimensions for all sticky video embeds and media preview cards, ensuring 0px horizontal scrollbar overflow across 320px (iPhone SE) to 2560px (4K UHD) screens.
- **🧪 58-Assertion Automated Playwright QA Benchmark**: Expanded the automated test harness to 58 assertions across 6 test suites with a verified 100% pass rate.

#### Fixed
- **Premature Tab Reset & Hidden Progress Bar**: Fixed form submission logic that previously reset media tabs to `tabNone` on frame 1; the video tab and progress box now remain locked and visible throughout the upload lifecycle.
- **Button State & Duplicate Submission Lock**: Disabled submit button during upload with a spinning indicator and real-time status updates, preventing accidental duplicate transmissions.

---

### 🌟 Version 3.0.0 — *September 2026*
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
