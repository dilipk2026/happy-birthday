# 📡 Eternal Love — Serverless Backend API & Cloud Protocol Specification

```
===============================================================================
GOOGLE APPS SCRIPT WEBHOOK API & CLIENT DISPATCH SPECIFICATION
Protocol: HTTPS JSON Webhook & JSONP | Architecture: Serverless Google Cloud Micro-Engine
Backend Runtime: Google Apps Script V8 Engine (ECMAScript 6+)
Endpoints: GET (Live Wishes & Photos Ingestion / Health Check) & POST (Dispatcher)
Backend Script: Code.gs (v5.0 Enterprise Cloud Collector)
===============================================================================
```

> **Overview**: This technical specification provides complete developer documentation for the serverless cloud backend powering **Eternal Love**. It defines the HTTP interfaces, payload schemas, Google Sheets/Drive persistence models, media decoding pipelines (images & videos), and client-side communication adapters.

---

## 📑 Table of Contents

1. [🌐 Endpoint Architecture & Service URL](#1--endpoint-architecture--service-url)
2. [🩺 Data Fetch & Health Check Endpoint (GET)](#2--data-fetch--health-check-endpoint-get)
3. [📨 Main Data Dispatch Endpoint (POST)](#3--main-data-dispatch-endpoint-post)
4. [📦 Detailed Payload Schemas](#4--detailed-payload-schemas)
   - [4.1 Birthday Wish & Media Payload (`type: "wish"`)](#41-birthday-wish--media-payload-type-wish)
   - [4.2 Polaroid Memory Photo Payload (`type: "photo"`)](#42-polaroid-memory-photo-payload-type-photo)
   - [4.3 Secret Vault Wish Payload (`type: "secret_wish"`)](#43-secret-vault-wish-payload-type-secret_wish)
5. [📊 Google Sheets Data Models & Schema Design](#5--google-sheets-data-models--schema-design)
6. [📁 Google Drive Auto-Organization Pipeline](#6--google-drive-auto-organization-pipeline)
7. [🛡️ CORS, Browser Security & Transport Architecture](#7-️-cors-browser-security--transport-architecture)
8. [💻 Client-Side Integration Reference (`script.js` & `index.html`)](#8--client-side-integration-reference-scriptjs--indexhtml)
9. [🧪 Code Integration Examples (cURL, JS, Python)](#9--code-integration-examples-curl-js-python)
10. [⚙️ Code.gs Function Reference](#10-️-codegs-function-reference)

---

## 1. 🌐 Endpoint Architecture & Service URL

The backend runs on Google Apps Script as an authenticated Web App executed under the owner's security context:

* **Production Endpoint URL**:
  ```text
  https://script.google.com/macros/s/AKfycbwPnRNoIYc1b8E2loZiXZhwlDXn3H2ZjH5b_t-C328paUo8u2mcGewGJKscj1W71zW-/exec
  ```
* **Execution Identity**: Script Owner (`"Execute as me"`)
* **Access Scope**: Anonymous / Public (`"Who has access: Anyone"`)
* **TLS Security**: TLS 1.3 / HTTPS Encrypted

---

## 2. 🩺 Data Fetch & Health Check Endpoint (GET)

Used by the frontend to fetch all persisted wishes and photos from Google Sheets on page load, and by uptime monitors to verify backend availability.

### Request
```http
GET /macros/s/.../exec?action=getAll HTTP/1.1
Host: script.google.com
Accept: application/json
```

Optional JSONP query parameter: `?action=getAll&callback=myCallbackFunction`

### Success Response (`200 OK`)
```json
{
  "status": "success",
  "title": "Eternal Love Cloud Hub 👑💖",
  "countWishes": 12,
  "countPhotos": 6,
  "wishes": [
    {
      "id": "gs_wish_2",
      "timestamp": "2026-09-09T12:00:00.000Z",
      "localTime": "9/9/2026, 5:30:00 PM",
      "celebrant": "Nishika",
      "dedicatedBy": "Dilip",
      "author": "Dilip 💖",
      "name": "Dilip 💖",
      "message": "Happy Birthday to my eternal Queen Nishika!",
      "text": "Happy Birthday to my eternal Queen Nishika!",
      "color": "pink",
      "styleClass": "sticky-pink",
      "mediaType": "photo",
      "mediaUrl": "https://drive.google.com/thumbnail?id=1a2B3c4D5e...&sz=w1000",
      "likes": 12
    }
  ],
  "photos": [
    {
      "id": "gs_photo_2",
      "timestamp": "2026-09-09T12:05:00.000Z",
      "localTime": "9/9/2026, 5:35:00 PM",
      "celebrant": "Nishika",
      "dedicatedBy": "Dilip",
      "caption": "Our first sunset walk ✨",
      "title": "Our first sunset walk ✨",
      "tag": "Real Moment 📸",
      "driveUrl": "https://drive.google.com/file/d/1xYz.../view",
      "imgUrl": "https://drive.google.com/thumbnail?id=1xYz...&sz=w1000"
    }
  ],
  "timestamp": "2026-09-09T12:30:00.000Z"
}
```

---

## 3. 📨 Main Data Dispatch Endpoint (POST)

All client events (wishes, media attachments, memory photos, secret notes) are routed through the single unified `POST` endpoint.

### Request Headers
```http
POST /macros/s/.../exec HTTP/1.1
Host: script.google.com
Content-Type: text/plain;charset=utf-8
```

> **Why `text/plain`?**
> Standard browsers trigger CORS preflight (`OPTIONS`) when sending `application/json`. Google Apps Script cannot handle `OPTIONS` preflight requests. Sending stringified JSON with `Content-Type: text/plain` bypasses the preflight check while remaining 100% valid parseable JSON in `e.postData.contents`.

---

## 4. 📦 Detailed Payload Schemas

### 4.1 Birthday Wish & Media Payload (`type: "wish"`)

Dispatched when a visitor or Dilip submits a birthday blessing on the Sticky Wish Wall (with optional compressed photo or attached video).

#### Request JSON
```json
{
  "type": "wish",
  "author": "Dilip 💖",
  "message": "Happy Birthday to my eternal Queen Nishika! May your year be as radiant as your smile.",
  "color": "pink",
  "mediaType": "photo",
  "mediaUrl": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ...",
  "localTime": "9/9/2026, 5:30:00 PM",
  "celebrant": "Nishika",
  "dedicatedBy": "Dilip"
}
```

#### Field Specifications
| Field | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `type` | `string` | **Yes** | Literal `"wish"` |
| `author` / `name` | `string` | **Yes** | Sender name (sanitized, max 100 chars) |
| `message` / `text` | `string` | **Yes** | Wish content (max 2,000 chars) |
| `color` / `styleClass` | `string` | No | Sticky note color style (`pink`, `yellow`, `blue`, `mint`, `purple`, `gold`) |
| `mediaType` | `string` | No | Attached media type (`photo`, `video`, or `none`) |
| `mediaUrl` | `string` | No | Base64 image/video string, or direct URL (YouTube, Vimeo, Google Drive, MP4) |
| `localTime` | `string` | No | Human-readable client local timestamp |
| `celebrant` | `string` | No | Default: `"Nishika"` |
| `dedicatedBy` | `string` | No | Default: `"Dilip"` |

#### Response JSON
```json
{
  "status": "success",
  "type": "wish",
  "mediaUrl": "https://drive.google.com/thumbnail?id=1a2B3c4D5e...&sz=w1000",
  "mediaType": "photo",
  "message": "Wish note saved to Google Sheet successfully!"
}
```

---

### 4.2 Polaroid Memory Photo Payload (`type: "photo"`)

Dispatched when adding a Polaroid photo to the Memory Wall.

#### Request JSON
```json
{
  "type": "photo",
  "caption": "Our unforgettable evening under the stars ✨",
  "tag": "Real Moment 📸",
  "dataUrl": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ...",
  "localTime": "9/9/2026, 5:35:00 PM",
  "celebrant": "Nishika",
  "dedicatedBy": "Dilip"
}
```

#### Field Specifications
| Field | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `type` | `string` | **Yes** | Literal `"photo"` |
| `caption` / `title` | `string` | No | Photo caption / memory description |
| `tag` | `string` | No | Moment tag / badge label (e.g. `Real Moment 📸`, `Genesis Moment ✨`) |
| `dataUrl` / `base64` | `string` | **Yes** | Canvas-downscaled Base64 image data URL (`data:image/jpeg;base64,...`) |
| `localTime` | `string` | No | Client local timestamp |

#### Response JSON
```json
{
  "status": "success",
  "type": "photo",
  "fileUrl": "https://drive.google.com/file/d/1a2B3c4D5e.../view?usp=drivesdk",
  "imgUrl": "https://drive.google.com/thumbnail?id=1a2B3c4D5e...&sz=w1000",
  "message": "Photo saved to Google Drive and logged in Google Sheet!"
}
```

---

### 4.3 Secret Vault Wish Payload (`type: "secret_wish"`)

Dispatched when Queen Nishika locks her confidential birthday wish inside the Secret Vault.

#### Request JSON
```json
{
  "type": "secret_wish",
  "wish": "My deepest wish for our upcoming year together...",
  "localTime": "9/9/2026, 5:40:00 PM",
  "celebrant": "Nishika",
  "dedicatedBy": "Dilip"
}
```

#### Response JSON
```json
{
  "status": "success",
  "type": "secret_wish",
  "message": "Secret wish sealed safely into Google Sheet!"
}
```

---

## 5. 📊 Google Sheets Data Models & Schema Design

When `Code.gs` executes, it automatically initializes tabs if missing, complete with pastel headers, bold labels, and frozen header rows.

### Sheet 1: `"Wishes"` Tab (10 Columns)
| Column | Header Name | Format | Description |
| :---: | :--- | :--- | :--- |
| **A** | `Timestamp` | `Date / Time` | UTC Server execution timestamp |
| **B** | `Local Time` | Text | Client local time string |
| **C** | `Celebrant` | Text | `"Nishika"` |
| **D** | `Dedicated By`| Text | `"Dilip"` |
| **E** | `Author / Sender` | Text (Bold) | Name of sender |
| **F** | `Heartfelt Message` | Text (Wrap) | Message text content |
| **G** | `Sticky Note Style` | Text | Color style (`pink`, `yellow`, `blue`, etc.) |
| **H** | `Media Type` | Text | Media classification (`photo`, `video`, `none`) |
| **I** | `Media URL` | Hyperlink | Direct Drive/CDN preview URL |
| **J** | `Likes Count` | Integer | Heart counter integer |

### Sheet 2: `"Photos"` Tab (8 Columns)
| Column | Header Name | Format | Description |
| :---: | :--- | :--- | :--- |
| **A** | `Timestamp` | `Date / Time` | Upload timestamp |
| **B** | `Local Time` | Text | Client local time |
| **C** | `Celebrant` | Text | `"Nishika"` |
| **D** | `Dedicated By`| Text | `"Dilip"` |
| **E** | `Photo Caption` | Text (Italic) | Memory caption |
| **F** | `Moment Tag` | Text | Milestone badge tag |
| **G** | `Google Drive Link` | Hyperlink | Direct Drive file view URL |
| **H** | `Image Preview` | Formula | `=IMAGE("https://drive.google.com/thumbnail?id=...&sz=w1000")` |

### Sheet 3: `"Secret Wishes"` Tab (5 Columns)
| Column | Header Name | Format | Description |
| :---: | :--- | :--- | :--- |
| **A** | `Timestamp` | `Date / Time` | Sealed timestamp |
| **B** | `Local Time` | Text | Client local time |
| **C** | `Celebrant` | Text | `"Nishika"` |
| **D** | `Dedicated By`| Text | `"Dilip"` |
| **E** | `Secret Birthday Wish` | Text (Wrap) | Confidential sealed text |

---

## 6. 📁 Google Drive Auto-Organization Pipeline

When a Base64 photo or video is received:
1. **Wish Media Attachments**: Stored in folder **`Eternal Love Wishes (Queen Nishika)`**.
2. **Polaroid Memory Photos**: Stored in folder **`Eternal Love Memories (Nishika)`**.
3. **MIME & Name Processing**:
   - Strips data URL prefix (`data:image/...;base64,` or `data:video/...;base64,`).
   - Decodes bytes into `Utilities.newBlob()`.
   - File named with author and timestamp (e.g. `WishPhoto_Dilip_2026-09-09_18-30-00.jpg` or `Nishika_Memory_2026-09-09_18-30-00.jpg`).
4. **Permissions**: Set to `DriveApp.Access.ANYONE_WITH_LINK` with `Permission.VIEW`.
5. **CDN Thumbnail Conversion**: Generates high-res direct CDN links (`https://drive.google.com/thumbnail?id=FILE_ID&sz=w1000`).

---

## 7. 🛡️ CORS, Browser Security & Transport Architecture

```
┌─────────────────────────┐                            ┌─────────────────────────┐
│     CLIENT BROWSER      │                            │   GOOGLE APPS SCRIPT    │
│                         │                            │                         │
│  fetch(url, {           │       HTTPS POST           │  doPost(e) {            │
│    method: 'POST',      │ ─────────────────────────> │    parse JSON           │
│    mode: 'no-cors',     │   (Bypasses CORS Preflight)│    append to Sheet      │
│    headers: {           │                            │    save to Drive        │
│      'Content-Type':    │                            │    return JSON response │
│      'text/plain'       │                            │  }                      │
│    },                   │                            │                         │
│    body: JSON.stringify │                            │                         │
│  })                     │                            │                         │
└─────────────────────────┘                            └─────────────────────────┘
```

---

## 8. 💻 Client-Side Integration Reference (`script.js` & `index.html`)

### Wish Dispatch Implementation
```javascript
async function sendWishToCloud(payload) {
  try {
    await fetch(GOOGLE_SHEET_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });
    console.log('Wish successfully dispatched to Google Cloud.');
  } catch (err) {
    console.warn('Offline: Saved locally in localStorage.', err);
  }
}
```

---

## 9. 🧪 Code Integration Examples

### Example: Python POST Request
```python
import requests
import json
from datetime import datetime

url = "https://script.google.com/macros/s/AKfycbwPnRNoIYc1b8E2loZiXZhwlDXn3H2ZjH5b_t-C328paUo8u2mcGewGJKscj1W71zW-/exec"

payload = {
    "type": "wish",
    "author": "Dilip 💖",
    "message": "Wishing you eternal joy and love, Queen Nishika! 🎂",
    "color": "pink",
    "mediaType": "none",
    "localTime": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
}

response = requests.post(
    url, 
    data=json.dumps(payload),
    headers={"Content-Type": "text/plain;charset=utf-8"}
)
print(response.status_code)
```

---

## 10. ⚙️ Code.gs Function Reference

| Function Signature | Description | Scope |
| :--- | :--- | :--- |
| `doGet(e)` | Serves live wishes, photos, counts, and JSONP output | Public Webhook |
| `doPost(e)` | Core router for `wish` (with photos/videos), `photo`, and `secret_wish` | Public Webhook |

---

*Eternal Love Cloud Architecture — Engineered for zero-cost, high-reliability, and permanent preservation.* 👑☁️
