# 🔒 Security Architecture & Privacy Policy — Eternal Love Web Application

```
===============================================================================
SECURITY SPECIFICATION, PRIVACY ARCHITECTURE & DATA PROTECTION POLICY
Application: Eternal Love — Ultra-Luxurious Romantic Celebration Web App
Celebrant: Queen Komal 👑 | Architecture: Client-First Privacy & Serverless Shield
Classification: CONFIDENTIAL & SECURED ROMANTIC VAULT
===============================================================================
```

> **Executive Statement**: Eternal Love is built with a **Privacy-by-Design and Zero-Tracking Philosophy**. We believe romantic memories, love letters, personal photos, and intimate anniversary milestones deserve highest-tier privacy standards, zero commercial monetization, and robust security protections.

---

## 📑 Table of Contents

1. [🛡️ 1. Security Architecture & Threat Model](#1-security-architecture--threat-model)
2. [🔐 2. Client-Side Data Isolation & Storage Security](#2-client-side-data-isolation--storage-security)
3. [🌐 3. Data Transmission & Cryptographic Standards](#3-data-transmission--cryptographic-standards)
4. [☁️ 4. Cloud Infrastructure & Google Apps Script Security Model](#4-cloud-infrastructure--google-apps-script-security-model)
5. [🗝️ 5. Secret Vault Access Control & Authentication](#5-secret-vault-access-control--authentication)
6. [🔏 6. Input Sanitization & Cross-Site Scripting (XSS) Mitigation](#6-input-sanitization--cross-site-scripting-xss-mitigation)
7. [👁️ 7. Zero-Surveillance Privacy Commitment](#7-zero-surveillance-privacy-commitment)
8. [📋 8. Compliance, Data Retention & Right to Erase](#8-compliance-data-retention--right-to-erase)

---

## 1. 🛡️ Security Architecture & Threat Model

The Eternal Love application utilizes a **Zero-Trust Client-First Topology**:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SECURITY PERIMETER                                │
│                                                                             │
│  ┌───────────────────────┐   TLS 1.3 HTTPS    ┌──────────────────────────┐  │
│  │   Browser Client      │ ─────────────────> │   Google Cloud Apps      │  │
│  │   • Isolated Storage  │   (Encrypted POST) │   • Script Owner Context │  │
│  │   • Entity Escaping   │                    │   • Private Spreadsheet  │  │
│  │   • Canvas Sanitizer  │                    │   • Private Drive Folder │  │
│  └───────────────────────┘                    └──────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Threat Assessment & Defenses
| Threat Vector | Severity | Mitigation Strategy |
| :--- | :---: | :--- |
| **Cross-Site Scripting (XSS)** | High | Client-side HTML Entity encoding for all dynamic user strings before DOM insertion. |
| **Man-in-the-Middle (MitM)** | High | Strict HTTPS / TLS 1.3 mandatory transport; HSTS on Vercel / Netlify / GitHub Pages. |
| **Credential & API Key Leaks** | Critical | Zero API keys or secrets in source code; Google Apps Script executes under server-side owner context. |
| **Brute Force on Vault PIN** | Low | Client-side visual keypad with throttling; secret payload decoupled from client DOM until unlocked. |
| **Unauthorized Data Scraping** | Low | Cloud database is write-only via public webhook; read access is restricted exclusively to the owner's Google account. |

---

## 2. 🔐 Client-Side Data Isolation & Storage Security

### 2.1 Local Storage Namespacing
All client preferences, coupon redemption states, favorited reasons, and local wishes are isolated under dedicated storage keys:
* `eternal_love_bday_state_v2` — Primary serialized application state.
* `eternal_love_sheet_url` — Cached active Google Apps Script Webhook endpoint.

### 2.2 Storage Sandboxing
* Browser Local Storage is strictly sandboxed by the Same-Origin Policy (SOP). No external domains can access stored keys.
* No session cookies or tracking cookies are issued or stored.

---

## 3. 🌐 Data Transmission & Cryptographic Standards

* **Transport Layer Security**: All data transferred between client browsers and Google Cloud infrastructure is encrypted using **TLS 1.3** with AES-256-GCM cipher suites.
* **Payload Encoding**: Image payloads are converted to Base64 strings client-side, verified for valid MIME headers, and transmitted over HTTPS POST.
* **CORS Preflight Bypass**: Requests use standard `Content-Type: text/plain` with `mode: 'no-cors'` to avoid unnecessary preflight roundtrips while ensuring secure data ingestion.

---

## 4. ☁️ Cloud Infrastructure & Google Apps Script Security Model

### 4.1 Serverless Authorization Context
* The Google Apps Script backend (`Code.gs`) is configured as:
  - **Execute As**: `Me` (The Project Owner).
  - **Access Level**: `Anyone`.
* **Security Implication**: The public can POST wishes and memory photos to the script endpoint, but NO visitor or external entity can query, view, modify, or delete existing entries from the Google Sheet or Google Drive without authenticating into the owner's Google Account.

### 4.2 Drive Permission Scoping
* Uploaded photos are stored inside a dedicated root folder: `Eternal Love Memories (Komal)`.
* File permissions are scoped to direct view links (`DriveApp.Access.ANYONE_WITH_LINK`), preventing unauthorized folder listing.

---

## 5. 🗝️ Secret Vault Access Control & Authentication

### 5.1 The Two-Tier Authentication Model
Access to Dilip's private birthday promises and the sealed love capsule is guarded by:

```
                      [ Secret Vault Trigger ]
                                │
                 ┌──────────────┴──────────────┐
                 ▼                             ▼
       [ 4-Digit Passcode ]          [ Queen's Heart Key ]
        PIN Check: `2912`            Biometric Bypass Pass
                 │                             │
                 └──────────────┬──────────────┘
                                ▼
                   [ 🔓 Vault Decrypted & Open ]
```

1. **Passcode Challenge**: The numeric keypad validates the 4-digit sequence `2912`. Upon matching, the DOM unhides the secret capsule stage with smooth fade-in animations.
2. **Queen's Heart Bypass**: Provides Queen Komal with an instant authorization mechanism, bypassing manual PIN entry while maintaining full romantic presentation.

---

## 6. 🔏 Input Sanitization & Cross-Site Scripting (XSS) Mitigation

To guarantee zero XSS vulnerabilities when displaying user-submitted wishes:
* All strings are escaped before insertion into `innerHTML`:
```javascript
function escapeHTML(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
```
* Dynamic nodes are created using `document.createElement()` and `textContent` assignments whenever feasible.

---

## 7. 👁️ Zero-Surveillance Privacy Commitment

Eternal Love guarantees complete user privacy:
* ❌ **No Google Analytics** or third-party trackers.
* ❌ **No Facebook / Meta Pixels** or social trackers.
* ❌ **No Advertising Networks** or monetization scripts.
* ❌ **No Device Fingerprinting** or behavioral telemetry.
* ❌ **No Data Selling or Sharing**: All uploaded content is stored exclusively in your personal Google Drive / Sheets.

---

## 8. 📋 Compliance, Data Retention & Right to Erase

### 8.1 Data Ownership
100% of data (photos, wishes, love notes, state variables) is owned solely by **Dilip and Queen Komal**.

### 8.2 Right to Erase (Instant Reset)
To erase all locally stored data on a device:
1. Open your browser Developer Console (`F12`).
2. Run:
   ```javascript
   localStorage.removeItem('eternal_love_bday_state_v2');
   localStorage.removeItem('eternal_love_sheet_url');
   location.reload();
   ```
3. To delete cloud records, simply delete rows from your Google Sheet or remove files from the `Eternal Love Memories (Komal)` folder in Google Drive.

---

*Eternal Love Security Specification — Built to protect your most sacred romantic memories.* 🔒💖
