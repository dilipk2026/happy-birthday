# 🔒 Security Architecture & Privacy Policy — Eternal Love Web Application

```
===============================================================================
SECURITY SPECIFICATION, PRIVACY ARCHITECTURE & DATA PROTECTION POLICY
Application: Eternal Love — Ultra-Luxurious Romantic Celebration Web App
Celebrant: Queen Nishika 👑 | Dedicated with Infinite Devotion by: Dilip 💖
Classification: CONFIDENTIAL & SECURED ROMANTIC CELEBRATION
Architecture: Strict Dual-Passcode Authorization, Client-Side Sanitization & Serverless Drive Isolation
===============================================================================
```

> **Executive Statement**: Eternal Love is built with a **Privacy-by-Design and Zero-Tracking Philosophy**. We believe romantic memories, love letters, personal photos, video blessings, and intimate anniversary milestones deserve highest-tier privacy standards, zero commercial monetization, and robust security protections.

---

## 📑 Table of Contents

1. [🛡️ 1. Security Architecture & Threat Model](#1-security-architecture--threat-model)
2. [🔐 2. Client-Side Data Isolation & Storage Security](#2-client-side-data-isolation--storage-security)
3. [🌐 3. Data Transmission & Cryptographic Standards](#3-data-transmission--cryptographic-standards)
4. [☁️ 4. Cloud Infrastructure & Google Apps Script Security Model](#4-cloud-infrastructure--google-apps-script-security-model)
5. [🗝️ 5. Passcode Access Control & Authorization Framework](#5-passcode-access-control--authorization-framework)
6. [🔏 6. Input Sanitization & Cross-Site Scripting (XSS) Mitigation](#6-input-sanitization--cross-site-scripting-xss-mitigation)
7. [📸 7. Media Upload Security (Canvas Compression & Drive Sandboxing)](#7-media-upload-security-canvas-compression--drive-sandboxing)
8. [👁️ 8. Zero-Surveillance Privacy Commitment](#8-zero-surveillance-privacy-commitment)
9. [📋 9. Compliance, Data Retention & Right to Erase](#9-compliance-data-retention--right-to-erase)

---

## 1. 🛡️ Security Architecture & Threat Model

The Eternal Love application utilizes a **Zero-Trust Client-First Topology**:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SECURITY PERIMETER                                │
│                                                                             │
│  ┌───────────────────────┐   TLS 1.3 HTTPS    ┌──────────────────────────┐  │
│  │   Browser Client      │ ─────────────────> │   Google Cloud Apps      │  │
│  │   • Strict Passcode   │   (Encrypted POST) │   • Script Owner Context │  │
│  │   • Isolated Storage  │                    │   • Private Spreadsheet  │  │
│  │   • HTML Sanitization │                    │   • Private Drive Folders│  │
│  │   • Canvas Compressor │                    │   • Scoped CDN Links     │  │
│  └───────────────────────┘                    └──────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Threat Assessment & Defenses
| Threat Vector | Severity | Mitigation Strategy |
| :--- | :---: | :--- |
| **Cross-Site Scripting (XSS)** | High | Client-side HTML Entity encoding (`escapeHtml`) on all user strings before DOM insertion. |
| **Man-in-the-Middle (MitM)** | High | Strict HTTPS / TLS 1.3 mandatory transport; automated Fastly Edge SSL on GitHub Pages. |
| **Credential & API Key Leaks** | Critical | Zero API keys or secrets in source code; Google Apps Script executes under server-side owner context. |
| **Passcode Brute Forcing** | Medium | Client-side visual keypad with shake feedback, error chime, and strict matching (`22092000` & `2912`). |
| **Payload Size Flooding / DoS** | Medium | Client-side HTML5 Canvas downscaler compresses images to $<300\text{ KB}$ before upload. |
| **Unauthorized Data Scraping** | Low | Cloud database is append-only via public webhook; modification and deletion require project owner authentication. |

---

## 2. 🔐 Client-Side Data Isolation & Storage Security

### 2.1 Local Storage Namespacing
All client preferences, coupon redemption states, favorited reasons, and local wishes are isolated under dedicated storage keys:
* `eternal_love_bday_state_v2` — Primary serialized application state.
* `pinnedWishes` — Local sticky wishes cache for offline resilience.
* `eternal_love_vip_session` — Authenticated VIP session token.

### 2.2 Storage Sandboxing
* Browser Local Storage is strictly sandboxed by the Same-Origin Policy (SOP). No external domains can access stored keys.
* No tracking cookies or advertising identifiers are ever created or stored.

---

## 3. 🌐 Data Transmission & Cryptographic Standards

* **Transport Layer Security**: All data transferred between client browsers and Google Cloud infrastructure is encrypted using **TLS 1.3** with AES-256-GCM cipher suites.
* **Payload Encoding**: Image and video payloads are converted to Base64 strings client-side, verified for valid MIME headers, and transmitted over HTTPS POST.
* **CORS Preflight Bypass**: Requests use standard `Content-Type: text/plain` with `mode: 'no-cors'` to avoid unnecessary preflight roundtrips while ensuring secure data ingestion.

---

## 4. ☁️ Cloud Infrastructure & Google Apps Script Security Model

### 4.1 Serverless Authorization Context
* The Google Apps Script backend ([Code.gs](file:///c:/Users/Himanshu/Documents/HTML/New%20folder/new/Code.gs)) is configured as:
  - **Execute As**: `Me` (The Project Owner).
  - **Access Level**: `Anyone`.
* **Security Implication**: The public can POST wishes and memory photos to the script endpoint, but NO visitor or external entity can query, view, modify, or delete existing entries from the Google Sheet or Google Drive without authenticating into the owner's Google Account.

### 4.2 Drive Permission Scoping
* Uploaded wish media files are stored in folder: `Eternal Love Wishes (Queen Nishika)`.
* Uploaded polaroid memory photos are stored in folder: `Eternal Love Memories (Nishika)`.
* File permissions are scoped to direct view links (`DriveApp.Access.ANYONE_WITH_LINK`), preventing unauthorized folder directory traversal.

---

## 5. 🗝️ Passcode Access Control & Authorization Framework

Access across the platform is guarded by strict verification logic:

```
                      [ Access Verification Gateway ]
                                    │
                     ┌──────────────┴──────────────┐
                     ▼                             ▼
           [ 8-Digit Birthday PIN ]      [ 4-Digit Anniversary PIN ]
             Code: `22092000`                Code: `2912`
             (DOB: 22 Sept 2000)             (Date: 29 Dec 2025)
                     │                             │
                     └──────────────┬──────────────┘
                                    ▼
                      [ 🔓 Authorized & Unlocked ]
```

### Verification Implementation:
```javascript
function isPasscodeMatch(pin) {
  if (!pin) return false;
  const cleanDigits = String(pin).replace(/[^0-9]/g, '');
  return cleanDigits === '2912' || cleanDigits === '22092000';
}
```

* **Queen's Heart Bypass**: In the Secret Vault, Queen Nishika has a dedicated 1-tap *Queen's Heart Key* for immediate romantic unlock.
* **Hint Privacy**: VIP and passcode hints provide romantic riddles without exposing the plaintext digits.

---

## 6. 🔏 Input Sanitization & Cross-Site Scripting (XSS) Mitigation

To guarantee zero XSS vulnerabilities when displaying user-submitted wishes on the Sticky Wall:
* All user strings are escaped before insertion into dynamic templates:
```javascript
function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
```

---

## 7. 📸 Media Upload Security (Canvas Compression & Drive Sandboxing)

* **Client-Side Compression**: User-selected images are drawn onto an HTML5 Canvas scaled to a maximum dimension of 1200px at 0.85 JPEG quality, limiting payload size to $<300\text{ KB}$.
* **MIME Verification**: The serverless script verifies MIME types before saving files as `.jpg` or `.mp4`.
* **Isolated Folders**: Files are organized into distinct folders with unique filenames: `WishPhoto_Author_YYYY-MM-DD_HH-mm-ss.jpg`.

---

## 8. 👁️ Zero-Surveillance Privacy Commitment

Eternal Love guarantees complete user privacy:
* ❌ **No Google Analytics** or third-party trackers.
* ❌ **No Facebook / Meta Pixels** or social trackers.
* ❌ **No Advertising Networks** or monetization scripts.
* ❌ **No Device Fingerprinting** or behavioral telemetry.
* ❌ **No Data Selling or Sharing**: All content is stored exclusively in your personal Google Drive / Sheets.

---

## 9. 📋 Compliance, Data Retention & Right to Erase

### 9.1 Data Ownership
100% of data (photos, videos, wishes, love notes, state variables) is owned solely by **Dilip and Queen Nishika**.

### 9.2 Right to Erase (Instant Reset)
To erase all locally stored data on a device:
1. Open your browser Developer Console (`F12`).
2. Run:
   ```javascript
   localStorage.clear();
   sessionStorage.clear();
   location.reload();
   ```
3. To delete cloud records, delete the rows from your Google Sheet or remove the files from the Google Drive folders.

---

*Eternal Love Security Specification — Built to protect your most sacred romantic memories.* 🔒💖
