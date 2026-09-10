# 08. Installation, Local Setup & Developer Guide

> **Status**: `[VERIFIED]` • Production Baseline v3.0.0  
> **Repository**: `https://github.com/dilipk2026/happy-birthday.git`  
> **Runtime Prerequisites**: Zero compilation build tools required; native static browser execution.  

---

## 1. System Requirements & Prerequisites

| Requirement | Minimum Specification | Recommended Specification |
| :--- | :--- | :--- |
| **Operating System** | Windows 10/11, macOS 11+, Linux Ubuntu 20.04+, iOS 14+, Android 10+ | Any modern 64-bit OS |
| **Web Browser** | Chrome 90+, Safari 14+, Firefox 88+, Edge 90+ | Latest Chrome or Safari |
| **Local Web Server** | Python 3.x (`http.server`) OR Node.js 16+ (`npx serve`) | Python 3.10+ / Node.js 18+ |
| **Automated Testing** | Node.js 16+ & `@playwright/test` / `playwright` | Node.js 20+ with Chromium |

---

## 2. Local Repository Setup

### Step 1: Clone the Repository
```bash
git clone https://github.com/dilipk2026/happy-birthday.git
cd happy-birthday
```

### Step 2: Launch Local HTTP Web Server
Because the application uses modern JavaScript modules, Web Audio API, and iframe streaming, it must be served over an HTTP/HTTPS protocol rather than `file://`.

#### Option A: Python 3 Built-In Server (Recommended)
```bash
# Start server on port 8080
python -m http.server 8080
```
Then navigate to: `http://localhost:8080` in your web browser.

#### Option B: Node.js `npx serve`
```bash
npx -y serve . -p 8080
```

#### Option C: Node.js `http-server`
```bash
npx -y http-server . -p 8080 -c-1
```

---

## 3. Automated QA Testing Harness Setup

To execute the 56 automated end-to-end tests locally:

### Step 1: Install Playwright Dependency
```bash
npm install playwright
```

### Step 2: Execute Test Suite
```bash
node playwright-test-runner.js
```

### Expected Test Execution Output:
```text
================================================================
👑 ETERNAL LOVE — AUTOMATED PLAYWRIGHT COMPREHENSIVE QA SUITE
================================================================
[HTTP Server] Serving workspace at http://localhost:8089

📦 SUITE 1: HTTP Delivery & Static Asset Integrity (5/5 PASS)
⏳ SUITE 2: Pre-Launch / Coming Soon Arena (10/10 PASS)
🛡️ SUITE 3: Security, Gatekeeper & Launch Router (6/6 PASS)
👑 SUITE 4: Main Celebration Arena (17/17 PASS)
📱 SUITE 5: Multi-Device Responsive Matrix (10/10 PASS)
🎬 SUITE 6: Video Upload & Cloud Preview (8/8 PASS)

================================================================
📊 PLAYWRIGHT QA TEST EXECUTION SUMMARY
================================================================
Total Tests Run : 56
Passed          : 56 (100%)
Failed          : 0
Bugs/Issues     : 0
Console Errors  : 0
================================================================
```

---

## 4. Configuring Google Apps Script Backend (Optional Custom Setup)

By default, the platform is pre-configured with the production Google Apps Script endpoint. To deploy to your personal Google Sheet:

1. Create a new [Google Sheet](https://sheets.new) named `"Eternal Love Wishes"`.
2. Click **Extensions** $\rightarrow$ **Apps Script**.
3. Paste the contents of [`Code.gs`](../Code.gs) into the script editor.
4. Click **Deploy** $\rightarrow$ **New Deployment**:
   - **Type**: Web App
   - **Description**: `"Eternal Love Backend v3"`
   - **Execute as**: `Me`
   - **Who has access**: `Anyone`
5. Copy the deployed Web App URL (`https://script.google.com/macros/s/.../exec`).
6. Update `DEFAULT_GOOGLE_SHEET_URL` in [`script.js`](../script.js) and `GOOGLE_SHEET_URL` in [`index.html`](../index.html).

---

## 5. Local Verification Checklist

| Verification Step | Command / Action | Expected Result | Status |
| :--- | :--- | :--- | :--- |
| **Pre-Launch Portal** | Open `http://localhost:8080/index.html` | Countdown timer ticks, particle stars float | `[VERIFIED]` |
| **VIP Unlock PIN** | Enter `2912` in VIP Keypad Modal | Chime plays, redirects to `main.html?vip=unlocked` | `[VERIFIED]` |
| **3D Unboxing** | Enter `22092000` on `main.html` | Fanfare plays, confetti bursts, lid opens | `[VERIFIED]` |
| **Automated Tests** | `node playwright-test-runner.js` | 56/56 tests pass with 0 errors | `[VERIFIED]` |
