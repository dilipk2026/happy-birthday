# 12. Troubleshooting & Diagnostic Guide

> **Status**: `[VERIFIED]` • Production Baseline v3.0.0  
> **Diagnostic Standard**: Problem • Cause • Solution • Verification  

---

## 1. Diagnostic Matrix of Known Edge Cases

### Problem 1: Audio Synthesizer & Melody Do Not Play Automatically on Page Load
- **Cause**: Modern web browsers (Chromium, Safari, Firefox) enforce strict **Autoplay Policies** preventing audio playback until the user has performed an explicit gesture (click or tap).
- **Solution**: The Web Audio `AudioContext` is suspended on initial load and automatically resumes upon the first user interaction (e.g. clicking `#soundToggleBtn`, tapping the gift box, or unboxing).
- **Verification**: Clicking anywhere on the page or toggling the audio button starts procedural melody playback immediately. `[VERIFIED]`

---

### Problem 2: Navigating Directly to `main.html` Redirects Immediately to `index.html`
- **Cause**: The pre-launch launch router enforces gatekeeping prior to September 21, 2026, 23:00 IST. Unauthenticated visitors are routed to the countdown portal.
- **Solution**: To preview `main.html` early, use any authorized VIP parameter:
  - `main.html?vip=unlocked`
  - `main.html?preview=true`
  - `main.html?passcode=22092000`
  - `main.html?pin=2912`
  - Or enter `2912` on `index.html` virtual keypad.
- **Verification**: Opening `http://localhost:8080/main.html?vip=unlocked` bypasses redirect and displays the welcome screen. `[VERIFIED]`

---

### Problem 3: Google Drive Video Link Converted to Image Thumbnail Instead of Video Player
- **Cause**: Previous versions of `normalizeCloudImageUrl` indiscriminately converted all Google Drive links to image thumbnails (`lh3.googleusercontent.com` or `thumbnail?id=...`).
- **Solution**: Enforced `normalizeCloudImageUrl(url, isVideo)` type differentiation. Video URLs preserve direct `/preview` endpoints (`https://drive.google.com/file/d/<ID>/preview`), which `parseGasVideoEmbed` and `parseVideoEmbed` render as responsive HTML5 streaming `<iframe>` elements.
- **Verification**: Submitting a Google Drive video link renders a functioning video player with play/pause controls. `[VERIFIED]`

---

### Problem 4: Uploaded Video Fails to Play on Other Devices (`blob:` URL Error)
- **Cause**: Reading video files via `URL.createObjectURL(file)` creates a transient browser-local `blob:http://...` string that exists only in local browser memory and is invalid when fetched from Google Sheets on another device.
- **Solution**: Replaced transient `blob:` dispatch with asynchronous Base64 file encoding via `readFileAsBase64(file)`. Form submissions await Base64 encoding before sending payload to Google Apps Script, which saves the file to Google Drive and returns a permanent `/preview` streaming URL.
- **Verification**: Submitting a video file saves binary data in Google Drive and renders a universal streaming embed. `[VERIFIED]`

---

### Problem 5: Horizontal Scrollbar / Overflow on Small 320px Mobile Screens (iPhone SE)
- **Cause**: Sticky note cards with dynamic CSS rotation angles (`transform: rotate(2.5deg)`) extended beyond the 320px viewport boundaries.
- **Solution**: Added strict scoped mobile CSS in `index.html` and `style.css`:
  ```css
  @media (max-width: 480px) {
    html, body, .page-wrapper {
      overflow-x: hidden;
      width: 100%;
      max-width: 100vw;
    }
    .sticky-notes-grid, .memories-grid {
      grid-template-columns: 100%;
      width: 100%;
    }
    .sticky-note, .polaroid-card {
      transform: none !important;
      width: 100% !important;
      max-width: 100% !important;
    }
  }
  ```
- **Verification**: Playwright responsive audit verifies 0px horizontal overflow at 320px, 375px, 768px, 1280px, and 2560px. `[VERIFIED]`

---

### Problem 6: Passcode Keypad Shakes with Error Tone
- **Cause**: User entered an incorrect passcode.
- **Solution**:
  - For **Pre-Launch VIP Portal (`index.html`)**: Enter 4-digit anniversary PIN **`2912`**.
  - For **Main Unboxing Screen (`main.html`)**: Enter 8-digit birthday passcode **`22092000`** or anniversary PIN **`2912`**.
- **Verification**: Entering correct passcode triggers green feedback and initiates unboxing. `[VERIFIED]`

---

### Problem 7: `fetch()` to Google Apps Script Reports CORS Warning in Console
- **Cause**: Google Apps Script redirects POST requests through a 302 redirect chain to `googleusercontent.com` which does not support standard CORS preflight headers.
- **Solution**: Invocations must specify `mode: 'no-cors'` on `fetch(GOOGLE_SHEET_URL, { method: 'POST', mode: 'no-cors', ... })`. The request executes successfully in the backend.
- **Verification**: Row is appended to Google Sheets and binary file is created in Google Drive. `[VERIFIED]`
