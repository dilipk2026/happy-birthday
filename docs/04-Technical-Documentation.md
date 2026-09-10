# 04. Technical Documentation & Module Reference

> **Status**: `[VERIFIED]` • Production Baseline v3.0.0  
> **Source Files**: `index.html` (144KB), `main.html` (198KB), `script.js` (323KB), `style.css` (298KB), `Code.gs` (23.6KB)  

---

## 1. Codebase Directory & File Inventory

```
.
├── index.html                  # Pre-Launch Countdown Portal & VIP Keypad Entry
├── main.html                   # 25-Stage Celebration Arena & 3D Unboxing Stage
├── script.js                   # Client-Side Application, Audio & Animation Engine
├── style.css                   # Global Luxury Design System & 9 Theme Atmospheres
├── Code.gs                     # Google Apps Script Serverless Backend Engine
├── favicon.svg                 # Scalable Royal Crown Vector Favicon
├── webqr.png                   # High-Resolution Celebration Access QR Code
├── implementation_plan.md      # Implementation Architecture & Engineering Roadmap
├── playwright-test-runner.js   # Automated Playwright QA Test Suite (56 Test Cases)
├── playwright_test_results.json# Playwright Automated Execution Results JSON
├── screenshots/                # 20 Verified Desktop & Mobile Application Screenshots
└── docs/                       # Complete Production Documentation Suite
```

---

## 2. In-Depth Technical Module Reference

### Module 1: Launch Router & VIP Authentication Gate
- **Purpose**: Restricts access to `main.html` before the target launch timestamp (`2026-09-21T23:00:00+05:30`) while providing VIP bypass mechanisms.
- **Source**: `index.html` (lines 8-54), `main.html` (lines 7-54).
- **Inputs**: Current system timestamp `Date.now()`, URL parameters (`?vip`, `?preview`, `?passcode`, `?pin`), `sessionStorage` tokens.
- **Outputs**: Window location replacement to `index.html` (if unauthenticated) or execution permission for `mainApp`.
- **Dependencies**: Native `window.location`, `URLSearchParams`, `sessionStorage`.
- **Important Functions**:
  - `(function() { ... })()`: Immediate self-executing router evaluating target launch date.
  - `checkPin()`: Validates 4-digit virtual keypad entry against anniversary PIN `2912`.
  - `isPasscodeMatch(pin)`: Checks entered code against `2912` and `22092000`.
- **Error Handling**: Graceful fallback to `window.location.replace('index.html')` upon unhandled routing exceptions.

---

### Module 2: State Persistence & LocalStorage Manager
- **Purpose**: Manages application state and persists user preferences, redeemed coupons, and cached wishes across page reloads.
- **Source**: `script.js` (lines 20-110).
- **Inputs**: User interaction events (coupon redemption, theme switching, note creation).
- **Outputs**: Serialized JSON objects stored under `eternal_love_bday_state_v2` and `eternal_love_sticky_wishes_v3`.
- **Dependencies**: Browser `localStorage`, `sessionStorage`.
- **Important Functions**:
  - `saveState()`: Writes current `state` object to `localStorage` with JSON serialization.
  - `saveWishesToLocal(wishesList)`: Persists array of wishes, automatically compacting oversized Base64 video payloads if quota is exceeded.
- **Error Handling**: QuotaExceeded error recovery via fallback array stripping and warning logging.

---

### Module 3: Web Audio API Polyphonic Sound Engine
- **Purpose**: Generates procedural music, acoustic guitar strings, romantic piano chords, and ambient multi-track soundscapes without external MP3 audio file dependencies.
- **Source**: `script.js` (lines 1450-1850).
- **Inputs**: User clicks, key presses (keys 1-6, A-H for guitar), soundscape volume sliders.
- **Outputs**: Synthesized audio routed to `AudioContext.destination`.
- **Dependencies**: Native `window.AudioContext` or `window.webkitAudioContext`.
- **Important Functions**:
  - `audioSynth.playTone(freq, type, duration, gain)`: Low-level oscillator node generator.
  - `audioSynth.playChime(freq, duration)`: High-frequency crystalline sine tone.
  - `audioSynth.playGuitarString(stringIndex)`: Karplus-Strong / filtered sawtooth string pluck model.
  - `audioSynth.playGuitarChord(chordName)`: Multi-note concurrent arpeggio strum.
  - `audioSynth.updateSoundscapeVolume(track, volume)`: Real-time GainNode level modulation.
- **Error Handling**: Handles browser autoplay restrictions by lazily resuming `AudioContext` on first user gesture.

---

### Module 4: 3D Interactive Cake Cutting Simulation Engine
- **Purpose**: Delivers a physics-based cake slicing ceremony with real-time Damascus knife movement, 3D slice detachment, and plated serving.
- **Source**: `script.js` (lines 1900-2250).
- **Inputs**: Mouse drag / touch movement / click triggers on `#cakeCanvas`.
- **Outputs**: 60 FPS Canvas rendering loop with particle confetti and fanfare audio cues.
- **Dependencies**: `HTMLCanvasElement`, `requestAnimationFrame`.
- **Important Functions**:
  - `drawRealHDVideoFrame(progress)`: Renders realistic multi-layer strawberry cream sponge cake, golden knife reflections, and plated slice.
  - `playCakeCutVideo()`: Initiates cake cutting timeline loop with synchronization triggers.
  - `pauseCakeCutVideo()`: Halts loop and updates HUD status.
- **Error Handling**: Automatically cancels animation frames when modal is closed or user navigates away.

---

### Module 5: Universal Media Normalizer & Video Embed Engine
- **Purpose**: Converts disparate media URLs and Base64 uploads into standardized, responsive HTML5 video players and high-res photo thumbnails.
- **Source**: `index.html` (lines 2800-2930), `script.js` (lines 4680-4980).
- **Inputs**: URL strings or Base64 file payloads from Google Drive, YouTube, Vimeo, or local disk.
- **Outputs**: Sanitized iframe embed markup, direct video players, or CDN image URLs.
- **Dependencies**: Regex pattern matching, `parseGasVideoEmbed`, `normalizeCloudImageUrl`.
- **Important Functions**:
  - `readFileAsBase64(file)`: Asynchronous Promise converting a `File` or `Blob` into a Base64 data URL.
  - `parseGasVideoEmbed(url, inLightbox)`: Normalizes Google Drive links (`/file/d/`, `open?id=`, `uc?id=`) into `https://drive.google.com/file/d/<ID>/preview` iframes.
  - `normalizeCloudImageUrl(url, isVideo)`: Ensures video URLs preserve `/preview` endpoints while photo URLs convert to `lh3.googleusercontent.com/d/<ID>`.
- **Error Handling**: Filters out dead `blob:` URLs to prevent cross-origin resource load errors.

---

### Module 6: Cloud Synchronization & Google Apps Script Adapter
- **Purpose**: Synchronizes wishes, photos, and videos between client browsers and Google Sheets / Google Drive.
- **Source**: `script.js` (lines 5120-5300), `Code.gs` (lines 1-540).
- **Inputs**: Wish submission form events, cloud fetch refresh triggers.
- **Outputs**: Network POST/JSONP dispatches; DOM updates on `#stickyNotesGrid` and `#memoriesGrid`.
- **Dependencies**: `fetch()` API, Dynamic `<script>` DOM injection for JSONP callbacks.
- **Important Functions**:
  - `fetchCloudWishes()`: Executes JSONP request to `Code.gs?action=getWishes&callback=...` and merges cloud rows with local state.
  - `submitWishForm()`: Awaits Base64 conversion and dispatches `fetch(url, { method: 'POST', mode: 'no-cors' })`.
- **Error Handling**: Graceful fallback to local cache if network request times out after 8,000ms.

---

### Module 7: Full-Screen Media Lightbox Controller
- **Purpose**: Expands sticky note media into an immersive theater modal view.
- **Source**: `main.html` (lines 3677-3690), `script.js` (lines 5500-5545).
- **Inputs**: Click events on `.sticky-media-wrap` or `.sticky-video-expand-btn`.
- **Outputs**: Adds `.active` class to `#mediaLightboxModal` and injects high-res media.
- **Dependencies**: CSS backdrop filters, Web Audio chime triggers.
- **Important Functions**:
  - `openMediaLightbox(type, url, author, msg)`: Populates modal viewport and displays author attribution.
  - `closeMediaLightbox()`: Clears viewport DOM and removes modal active state.
- **Error Handling**: Keyboard listener binds <kbd>Esc</kbd> key and outside backdrop clicks to close modal cleanly.
