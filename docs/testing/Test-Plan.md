# Master QA Test Plan

> **Status**: `[VERIFIED]` • Production Baseline v3.0.0  
> **Test Harness**: `playwright-test-runner.js`  
> **Target System**: Eternal Love (`index.html`, `main.html`, `script.js`, `style.css`, `Code.gs`)  

---

## 1. Objectives & Scope

### 1.1 Objectives
1. Verify the structural integrity, visual perfection, and audio performance of all 25 celebration stages.
2. Validate zero-data-loss video encoding and Google Drive cloud streaming embeds.
3. Validate time-locked security routing and dual-passcode authentication.
4. Guarantee 0px horizontal overflow across all mobile, tablet, desktop, and 4K viewports.

### 1.2 Features To Test
- Pre-launch countdown chronometer and VIP virtual keypad.
- Sticky Wish Wall and Polaroid Gallery media rendering.
- Two-stage welcome screen and 3D unboxing animation.
- Interactive 3D Cake Cutting, Love Jar, Fortune Roulette, Web Audio Soundscapes, and Love Coupons.
- Universal Google Drive and YouTube video embed normalization.
- Full-screen Media Lightbox modal expansion.
- LocalStorage state persistence and page reload recovery.

### 1.3 Features Not To Test
- Third-party Google Workspace internal server infrastructure (assumed operational).
- External YouTube/Vimeo backend availability (tested via iframe rendering).

---

## 2. Test Environment & Tools

| Component | Specification / Tool | Purpose |
| :--- | :--- | :--- |
| **Automation Engine** | Playwright (`@playwright/test` / Chromium Headless) | Browser automation, click interactions, form inputs, viewport audits |
| **Local Web Server** | Node.js Built-In HTTP Server (Port 8089) | Static asset serving |
| **Target Viewports** | 320×568 (iPhone SE), 375×812 (iPhone 14), 768×1024 (iPad), 1280×800 (Laptop), 2560×1440 (4K) | Multi-device responsiveness |
| **Test Output Log** | `playwright_test_results.json` | Programmatic results reporting |

---

## 3. Test Data & Fixtures

| Fixture Name | Value | Purpose |
| :--- | :--- | :--- |
| **Valid VIP Anniversary PIN** | `2912` | Pre-launch VIP modal authentication on `index.html` |
| **Invalid VIP PIN** | `0000` | Testing rejection, error tone, and shake animation |
| **Valid Birthday Passcode** | `22092000` | Unboxing 3D gift box on `main.html` |
| **Invalid Passcode** | `12345678` | Testing passcode rejection on `main.html` |
| **Test Video Link 1 (Drive view)** | `https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/view` | Testing `/preview` conversion on `index.html` |
| **Test Video Link 2 (Drive open?id=)**| `https://drive.google.com/open?id=1AbCdEfGhIjKlMnOpQrStUvWxYz123456` | Testing `open?id=` normalization on `main.html` |
| **Test Guest Wish** | `"Dilip (Royal Video Test)"` / `"Forever dedicated to Queen Nishika! 🎬💖"` | Testing form submission and sticky wall rendering |

---

## 4. Test Execution Deliverables

1. **Automated Test Script**: [`playwright-test-runner.js`](../../playwright-test-runner.js).
2. **Execution Results JSON**: [`playwright_test_results.json`](../../playwright_test_results.json).
3. **Execution Report**: [`Test-Execution-Report.md`](Test-Execution-Report.md).
4. **Final Test Summary**: [`Final-Test-Report.md`](Final-Test-Report.md).
