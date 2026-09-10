# API, Webhook & Cloud Sync Test Cases

> **Status**: `[VERIFIED]` • Production Baseline v3.0.0  
> **Target Interface**: Google Apps Script (`Code.gs`) Webhook & JSONP API  

---

## 1. API Test Cases Matrix

| Test ID | HTTP Method | Endpoint / Action | Test Condition | Expected Status / Payload | Status |
| :--- | :---: | :--- | :--- | :--- | :---: |
| **`API-01`** | `GET` | `/exec?action=getWishes` | Standard JSON query | Status 200, returns array of wishes with Drive `/preview` links | 🟢 **PASS** |
| **`API-02`** | `GET` | `/exec?action=getWishes&callback=cb123` | Cross-origin JSONP query | Returns `cb123({ status: "success", wishes: [...] })` | 🟢 **PASS** |
| **`API-03`** | `GET` | `/exec?action=ping` | Health check endpoint | Status 200 `{ status: "online", app: "Eternal Love..." }` | 🟢 **PASS** |
| **`API-04`** | `POST` | `/exec` | Valid text wish submission | Appends row in `"Wishes"` tab, returns `{ status: "success" }` | 🟢 **PASS** |
| **`API-05`** | `POST` | `/exec` | Base64 video upload payload | Creates MP4 file in Google Drive folder, returns `/preview` link | 🟢 **PASS** |
| **`API-06`** | `POST` | `/exec` | Base64 photo upload payload | Saves JPEG to Google Drive, returns high-res CDN thumbnail URL | 🟢 **PASS** |
| **`API-07`** | `POST` | `/exec` | Empty / Malformed payload | Catches error gracefully, returns `{ status: "error" }` | 🟢 **PASS** |
| **`API-08`** | `GET` | `/exec?action=getPhotos` | Retrieve photo dedications | Returns array of photo items with author and captions | 🟢 **PASS** |
| **`API-09`** | `GET` | `/exec?action=getVideos` | Retrieve video dedications | Returns array of video items with `/preview` endpoints | 🟢 **PASS** |
| **`API-10`** | `GET` | `/exec` (invalid blob URL in Sheet) | Stale `blob:` reference in row | Filters out dead `blob:` string and returns empty/clean mediaUrl | 🟢 **PASS** |

---

## 2. Sample API Test Case Specification

### `API-05`: Asynchronous Base64 Video Upload & Drive Storage
- **Method**: `POST`
- **Payload**:
  ```json
  {
    "type": "video",
    "name": "Dilip (Automated API Test)",
    "message": "Testing Google Drive Base64 video creation 🎬",
    "dataUrl": "data:video/mp4;base64,AAAAHGZ0eXBtcDQyAAAAAG1wNDJpc29t..."
  }
  ```
- **Expected Result**:
  1. `saveBase64ToDrive()` detects `video/mp4` MIME type.
  2. Creates binary file in Google Drive folder `"Eternal Love Wishes (Queen Nishika)"`.
  3. Sets public view permission (`Access.ANYONE_WITH_LINK`, `Permission.VIEW`).
  4. Returns `driveUrl: "https://drive.google.com/file/d/<ID>/preview"`.
- **Status**: 🟢 **PASS** `[VERIFIED]`
