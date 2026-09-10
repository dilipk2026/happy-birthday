# Fix Video Upload, Google Drive / Sheets Recording & Cloud Preview Recovery

This plan details the end-to-end fix for recording video data to Google Sheets & Drive from both `index.html` and `main.html`, preventing local storage URL stripping, ensuring asynchronous Base64 file encoding before form dispatch, and guaranteeing that uploaded videos preview and stream reliably on page refresh and across different devices.

---

## User Review Required

> [!IMPORTANT]
> 1. **Zero Data Loss on Video Upload**:
>    - When a user uploads a video file (MP4, WebM, etc.) via `index.html` (Quick Media modal or Wish form) or `main.html` (Sticky Wish Wall), the frontend will ensure the video file is converted into Base64 format and submitted to Google Apps Script.
>    - Google Apps Script will save the file directly to Queen Nishika's Google Drive folder (`"Eternal Love Wishes (Queen Nishika)"`), set public view permissions, generate the permanent streaming embed URL (`https://drive.google.com/file/d/<ID>/preview`), and log it into both the `"Videos"` and `"Wishes"` sheet tabs.
> 2. **Permanent Cross-Device & Reload Preview**:
>    - The URL normalizer will no longer convert Google Drive video URLs into image thumbnails.
>    - `parseVideoEmbed` and `parseGasVideoEmbed` will universally recognize all Google Drive URL variants (`/file/d/`, `open?id=`, `uc?id=`, `lh3.../d/`) and render responsive HTML5 streaming `<iframe>` video players.
>    - `saveWishesToLocal()` will preserve external and cloud-synced video URLs without wiping them.
> 3. **Live Sync to Google Cloud**:
>    - Dedicated instructions and updated `Code.gs` will be provided so your active Google Apps Script deployment reflects these improvements immediately.

---

## Proposed Changes

### 1. `index.html`
- **Asynchronous Video Base64 Reader**:
  - Create a helper `readFileAsBase64(file)` returning a Promise.
  - In `quickMediaForm` and `preLaunchWishForm`, await the Base64 conversion before submitting to Google Apps Script, preventing dead local `blob:` URLs from being sent.
- **Fix `saveWishesToLocal`**:
  - Ensure video streaming links (YouTube, Vimeo, Google Drive, direct links) are never wiped or blanked out in `localStorage`.
- **Enhance `normalizeMediaData` & `parseVideoEmbed`**:
  - Universal recognition for all video URL formats and Google Drive IDs.
- **Update Cloud Sync & Fetch**:
  - Seamlessly merge cloud wishes, photos, and videos, updating both `#stickyNotesGrid` and `#memoriesGrid`.

### 2. `script.js`
- **Fix `mainWishVideoInput`**:
  - Add `readFileAsBase64(file)` in `script.js` so device video files are encoded to Base64 and sent to Google Apps Script.
- **Fix `normalizeCloudImageUrl` & `parseGasVideoEmbed`**:
  - Stop converting Drive video links into `lh3.googleusercontent.com` image thumbnails.
  - Enable `parseGasVideoEmbed` to handle all Google Drive video link formats.

### 3. `Code.gs`
- Ensure robust Base64 video file creation in Google Drive (`folder.createFile(blob)`), public sharing, and 10-column recording in `"Wishes"` and `"Videos"` tabs.
- Ensure `doGet` returns permanent `/preview` video links across all columns.

---

## Verification Plan

### Automated Tests
- Run Playwright test script verifying:
  1. Submitting a video URL on `index.html` renders video in `#stickyNotesGrid` and `#memoriesGrid`.
  2. Refreshing the page preserves the video player on both grids.
  3. Uploading a video file correctly converts to Base64 payload and dispatches to Google Apps Script.
  4. Google Drive video URLs render valid iframe embed players across both `index.html` and `main.html`.
  5. Cloud sync fetching populates video items properly without console errors.
