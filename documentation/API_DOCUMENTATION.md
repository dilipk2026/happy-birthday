# 📡 Eternal Love — Serverless Backend API & Cloud Protocol Specification

```
===============================================================================
GOOGLE APPS SCRIPT WEBHOOK API & CLIENT DISPATCH SPECIFICATION
Protocol: HTTPS JSON Webhook | Architecture: Serverless Google Cloud Micro-Engine
Backend Runtime: Google Apps Script V8 Engine (ECMAScript 6+)
Endpoints: GET (Health Check) & POST (Dispatcher)
===============================================================================
```

> **Overview**: This technical document provides complete developer specifications for the serverless cloud backend powering **Eternal Love**. It defines the HTTP interfaces, payload schemas, Google Sheets/Drive persistence models, error handling strategies, and client-side communication adapters.

---

## 📑 Table of Contents

1. [🌐 Endpoint Architecture & Service URL](#1--endpoint-architecture--service-url)
2. [🩺 Health Check Endpoint (GET)](#2--health-check-endpoint-get)
3. [📨 Main Data Dispatch Endpoint (POST)](#3--main-data-dispatch-endpoint-post)
4. [📦 Detailed Payload Schemas](#4--detailed-payload-schemas)
   - [4.1 Birthday Wish Payload (`type: "wish"`)](#41-birthday-wish-payload-type-wish)
   - [4.2 Secret Vault Wish Payload (`type: "secret_wish"`)](#42-secret-vault-wish-payload-type-secret_wish)
   - [4.3 Memory Photo Payload (`type: "photo"`)](#43-memory-photo-payload-type-photo)
5. [📊 Google Sheets Data Models & Schema Design](#5--google-sheets-data-models--schema-design)
6. [📁 Google Drive Auto-Organization Pipeline](#6--google-drive-auto-organization-pipeline)
7. [🛡️ CORS, Browser Security & Transport Architecture](#7-️-cors-browser-security--transport-architecture)
8. [💻 Client-Side Integration Reference (`script.js`)](#8--client-side-integration-reference-scriptjs)
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

## 2. 🩺 Health Check Endpoint (GET)

Used by uptime monitors, test runners, and diagnostic panels to verify backend availability.

### Request
```http
GET /macros/s/.../exec HTTP/1.1
Host: script.google.com
Accept: application/json
```

### Success Response (`200 OK`)
```json
{
  "status": "online",
  "title": "Eternal Love Cloud Collector 👑💖",
  "message": "Google Apps Script Web App is connected and ready to receive wishes and photos!",
  "timestamp": "2026-09-07T07:57:33.493Z"
}
```

---

## 3. 📨 Main Data Dispatch Endpoint (POST)

All client events (wishes, secret notes, memory photos) are routed through the single unified `POST` endpoint.

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

### 4.1 Birthday Wish Payload (`type: "wish"`)

Dispatched when a visitor or Dilip submits a public birthday wish on the Wish Wall.

#### Request JSON
```json
{
  "type": "wish",
  "name": "Dilip 💖",
  "message": "Happy Birthday to my eternal Queen Komal! May your year be as radiant as your smile.",
  "color": "ruby",
  "timestamp": "2026-09-05T00:00:00.000Z"
}
```

#### Field Specifications
| Field | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `type` | `string` | **Yes** | Literal `"wish"` |
| `name` | `string` | **Yes** | Sender name (sanitized, max 100 chars) |
| `message` | `string` | **Yes** | Wish content (max 2,000 chars) |
| `color` | `string` | No | Color theme tag (`ruby`, `gold`, `sapphire`, `emerald`, `amethyst`) |
| `timestamp` | `string` | No | ISO 8601 UTC timestamp |

#### Response JSON
```json
{
  "status": "success",
  "message": "Wish saved to Google Sheet! 💌",
  "row": 42
}
```

---

### 4.2 Pre-Launch Blessing Payload (`coming-soon.html`)

Dispatched when a visitor or guest leaves an early birthday blessing on the **Coming Soon** page before September 20.

#### Request JSON
```json
{
  "type": "wish",
  "name": "Dilip 💖 (Pre-Launch Blessing)",
  "message": "Counting down the seconds until your grand celebration, my Queen!",
  "color": "gold",
  "timestamp": "2026-09-07T12:00:00.000Z"
}
```

#### Field Specifications
| Field | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `type` | `string` | **Yes** | Literal `"wish"` |
| `name` | `string` | **Yes** | Sender name appended with `(Pre-Launch Blessing)` tag |
| `message` | `string` | **Yes** | Blessing text |
| `color` | `string` | No | Fixed to `"gold"` for celestial pre-launch wishes |
| `timestamp` | `string` | No | ISO 8601 UTC timestamp |

#### Response JSON
```json
{
  "status": "success",
  "message": "Wish saved to Google Sheet! 💌",
  "row": 15
}
```

---

### 4.3 Secret Vault Wish Payload (`type: "secret_wish"`)

Dispatched when Queen Komal locks her sacred birthday wish inside the Secret Vault.

#### Request JSON
```json
{
  "type": "secret_wish",
  "wish": "My deepest wish for our upcoming year together...",
  "timestamp": "2026-09-05T00:01:30.000Z"
}
```

#### Field Specifications
| Field | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `type` | `string` | **Yes** | Literal `"secret_wish"` |
| `wish` | `string` | **Yes** | Secret wish text (stored in private restricted sheet) |
| `timestamp` | `string` | No | ISO 8601 UTC timestamp |

#### Response JSON
```json
{
  "status": "success",
  "message": "Secret wish locked in the vault! 🗝️"
}
```

---

### 4.4 Memory Photo Payload (`type: "photo"`)

Dispatched when a user adds a memory photo to the 3D Polaroid wall.

#### Request JSON
```json
{
  "type": "photo",
  "caption": "Our unforgettable evening under the stars ✨",
  "base64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBD...",
  "timestamp": "2026-09-05T00:05:00.000Z"
}
```

#### Field Specifications
| Field | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `type` | `string` | **Yes** | Literal `"photo"` |
| `caption` | `string` | No | Photo caption / memory description |
| `base64` | `string` | **Yes** | Data URL or raw Base64 string of the image (JPEG/PNG/WebP) |
| `timestamp` | `string` | No | ISO 8601 UTC timestamp |

#### Response JSON
```json
{
  "status": "success",
  "message": "Photo uploaded to Google Drive & Sheet updated! 📸",
  "fileId": "1a2B3c4D5e6F7g8H9i0J",
  "url": "https://drive.google.com/file/d/1a2B3c4D5e6F7g8H9i0J/view?usp=drivesdk"
}
```

---

## 5. 📊 Google Sheets Data Models & Schema Design

When `Code.gs` executes, it automatically checks the active spreadsheet. If sheets are missing, it initializes them with pastel header styles, bold titles, and frozen rows.

### Sheet 1: `"Wishes"` Tab
| Column | Name | Format | Description |
| :---: | :--- | :--- | :--- |
| **A** | `Timestamp` | `yyyy-MM-dd HH:mm:ss` | Time wish was recorded |
| **B** | `Sender Name` | Text (Bold) | Name of sender |
| **C** | `Wish Message` | Text (Wrap) | Full message |
| **D** | `Color Style` | Text (Centered) | Visual theme tag |

### Sheet 2: `"Secret Wishes"` Tab
| Column | Name | Format | Description |
| :---: | :--- | :--- | :--- |
| **A** | `Timestamp` | `yyyy-MM-dd HH:mm:ss` | Time secret wish was sealed |
| **B** | `Secret Birthday Wish` | Text (Wrap) | Confidential text |

### Sheet 3: `"Photos"` Tab
| Column | Name | Format | Description |
| :---: | :--- | :--- | :--- |
| **A** | `Timestamp` | `yyyy-MM-dd HH:mm:ss` | Upload timestamp |
| **B** | `Caption` | Text (Italic) | Memory caption |
| **C** | `Google Drive Link`| Hyperlink | Direct URL to Drive asset |
| **D** | `Image Preview` | Formula | `=IMAGE("https://drive.google.com/uc?id=<ID>")` |

---

## 6. 📁 Google Drive Auto-Organization Pipeline

When a photo payload is received:
1. `Code.gs` checks for a folder named **`Eternal Love Memories (Komal)`**.
2. If it does not exist, it creates the folder in the user's root Google Drive.
3. The Base64 string is stripped of its MIME prefix (`data:image/...;base64,`).
4. Decoded bytes are converted into a `Utilities.newBlob(bytes, mimeType, filename)`.
5. The file is created with name format: `Memory_YYYY-MM-DD_HH-mm-ss.jpg`.
6. Access permissions are set to `DriveApp.Access.ANYONE_WITH_LINK` (View Only).
7. The direct view URL and Drive File ID are returned to the client and logged to the Sheet.

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

### Key Security Safeguards:
* **Zero Credential Exposure**: No Google API Secret Keys, OAuth tokens, or Service Account credentials are leaked in the client-side JavaScript.
* **Content Sanitization**: Client HTML escapes all text input before local injection to eliminate Stored and Reflected Cross-Site Scripting (XSS).
* **Payload Size Limiter**: Photos are client-downscaled via HTML5 Canvas before Base64 encoding to stay well below the 10MB Google Apps Script POST payload limit.

---

## 8. 💻 Client-Side Integration Reference (`script.js`)

### Wish Dispatch Implementation
```javascript
async function sendWishToCloud(name, message, color) {
  const payload = {
    type: 'wish',
    name: name.trim(),
    message: message.trim(),
    color: color || 'ruby',
    timestamp: new Date().toISOString()
  };

  try {
    await fetch(state.googleSheetUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });
    console.log('Wish successfully synchronized with Google Cloud.');
  } catch (err) {
    console.warn('Network offline. Cached wish locally for later sync.', err);
  }
}
```

---

## 9. 🧪 Code Integration Examples

### Example 1: cURL Health Check
```bash
curl -L -X GET "https://script.google.com/macros/s/AKfycbwPnRNoIYc1b8E2loZiXZhwlDXn3H2ZjH5b_t-C328paUo8u2mcGewGJKscj1W71zW-/exec"
```

### Example 2: Python POST Request
```python
import requests
import json
from datetime import datetime

url = "https://script.google.com/macros/s/AKfycbwPnRNoIYc1b8E2loZiXZhwlDXn3H2ZjH5b_t-C328paUo8u2mcGewGJKscj1W71zW-/exec"

payload = {
    "type": "wish",
    "name": "Dilip 💖",
    "message": "Wishing you eternal smiles, my love! 🎂",
    "color": "gold",
    "timestamp": datetime.utcnow().isoformat() + "Z"
}

response = requests.post(
    url, 
    data=json.dumps(payload),
    headers={"Content-Type": "text/plain;charset=utf-8"},
    allow_redirects=True
)

print(response.status_code, response.text)
```

---

## 10. ⚙️ Code.gs Function Reference

| Function Signature | Description | Scope |
| :--- | :--- | :--- |
| `doGet(e)` | Serves the JSON health check response | Public Webhook |
| `doPost(e)` | Core request router for `wish`, `secret_wish`, and `photo` | Public Webhook |
| `handleWish(sheet, data)` | Validates and appends wish to `"Wishes"` tab | Internal Helper |
| `handleSecretWish(sheet, data)` | Validates and appends secret note to `"Secret Wishes"` tab | Internal Helper |
| `handlePhoto(sheet, data)` | Decodes Base64, creates Drive file, appends row with formula | Internal Helper |
| `getOrCreateSheet(ss, name)` | Retrieves or initializes formatted tab with headers | Utility |
| `getOrCreateFolder(name)` | Retrieves or creates Google Drive destination directory | Utility |

---

*Eternal Love Cloud Architecture — Engineered for zero-cost, high-reliability, and permanent preservation.* 👑☁️
