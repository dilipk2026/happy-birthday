# ❓ FAQ & Troubleshooting Guide — Eternal Love Web Application

```
===============================================================================
OPERATIONAL FAQ, DIAGNOSTIC PROCEDURES & TROUBLESHOOTING GUIDE
Project: Eternal Love — Ultra-Luxurious Romantic Birthday Celebration
Celebrant: Queen Nishika 👑 | Dedicated with Infinite Love by: Dilip 💖
Support Classification: Level 1-3 Diagnostic Runbook
===============================================================================
```

> **Welcome to the Troubleshooting Guide & Knowledge Base**. If you experience any audio playback issues, Google Sheet synchronization delays, display quirks on older devices, or have questions about how features work, refer to the verified diagnostic steps below.

---

## 📑 Table of Contents

1. [🎵 Audio & Synthesizer Issues](#1--audio--synthesizer-issues)
   - [1.1 Why isn't music playing automatically when the page opens?](#11-why-isnt-music-playing-automatically-when-the-page-opens)
   - [1.2 Audio sounds distorted or stuttering on mobile](#12-audio-sounds-distorted-or-stuttering-on-mobile)
2. [☁️ Google Sheets & Cloud Sync Issues](#2-️-google-sheets--cloud-sync-issues)
   - [2.1 Submitted wish doesn't show up in my Google Sheet immediately](#21-submitted-wish-doesnt-show-up-in-my-google-sheet-immediately)
   - [2.2 Getting an error when deploying the Google Apps Script Web App](#22-getting-an-error-when-deploying-the-google-apps-script-web-app)
3. [📸 Photo Upload & Google Drive Issues](#3--photo-upload--google-drive-issues)
   - [3.1 Memory photo fails to upload or takes too long](#31-memory-photo-fails-to-upload-or-takes-too-long)
   - [3.2 Photos are not appearing in the Google Drive folder](#32-photos-are-not-appearing-in-the-google-drive-folder)
4. [🗝️ Secret Vault & Access Issues](#4-️-secret-vault--access-issues)
   - [4.1 What is the passcode for Queen's Secret Vault?](#41-what-is-the-passcode-for-queens-secret-vault)
   - [4.2 How does the Queen's Heart Key bypass work?](#42-how-does-the-queens-heart-key-bypass-work)
5. [📱 Mobile Display & Browser Layout Issues](#5--mobile-display--browser-layout-issues)
   - [5.1 The navigation bar covers the top of the section when scrolling](#51-the-navigation-bar-covers-the-top-of-the-section-when-scrolling)
   - [5.2 Horizontal scrolling occurs on my screen](#52-horizontal-scrolling-occurs-on-my-screen)
6. [💾 Local Storage, State Reset & Privacy](#6--local-storage-state-reset--privacy)
   - [6.1 How do I reset the celebration to fresh state?](#61-how-do-i-reset-the-celebration-to-fresh-state)
   - [6.2 Will my data be lost if I close my browser tab?](#62-will-my-data-be-lost-if-i-close-my-browser-tab)

---

## 1. 🎵 Audio & Synthesizer Issues

### 1.1 Why isn't music playing automatically when the page opens?
* **Root Cause**: All modern browsers (Chrome, Safari, iOS, Edge, Firefox) enforce strict **Autoplay Policies**. They prohibit web applications from generating audio until the user has performed at least one physical gesture (click, tap, or keypress).
* **Resolution**:
  1. Simply click anywhere on the page or tap the floating **`🎵 Play Music`** button in the top navigation bar.
  2. The `AudioContext` will instantly unlock and resume audio synthesis smoothly.

---

### 1.2 Audio sounds distorted or stuttering on mobile
* **Root Cause**: Low-power mode or high CPU load from background applications.
* **Resolution**:
  1. Disable Battery Saver / Low Power Mode on your smartphone.
  2. The synth engine automatically scales down oscillator count on low-tier mobile processors to prevent audio buffer underruns.

---

## 2. ☁️ Google Sheets & Cloud Sync Issues

### 2.1 Submitted wish doesn't show up in my Google Sheet immediately
* **Diagnostic Check**:
  1. Open your browser console (`F12` $\rightarrow$ `Console`).
  2. Look for the message: `Wish successfully synchronized with Google Cloud.`
  3. Ensure your Google Apps Script URL is correctly set in `script.js` under `DEFAULT_GOOGLE_SHEET_URL`.
* **Resolution**:
  - Google Apps Script webhooks execute asynchronously. Allow 3 to 8 seconds for Google's cloud servers to append the row and update spreadsheet formulas.
  - If offline, the wish is saved in the browser's `localStorage` and will remain visible on your screen.

---

### 2.2 Getting an error when deploying the Google Apps Script Web App
* **Ensure Correct Deployment Settings**:
  - **Execute as**: `Me (<your-email@gmail.com>)`
  - **Who has access**: `Anyone` *(Must NOT be "Only Myself" or "Anyone within organization")*.
  - When updating code in Apps Script, always click **Deploy** $\rightarrow$ **Manage deployments** $\rightarrow$ **Edit (pencil icon)** $\rightarrow$ **New Version** $\rightarrow$ **Deploy**.

---

## 3. 📸 Photo Upload & Google Drive Issues

### 3.1 Memory photo fails to upload or takes too long
* **Root Cause**: High-resolution camera photos (e.g. 48MP/100MP photos) can exceed 25MB before compression.
* **Resolution**:
  - Eternal Love features an automated **HTML5 Canvas Downscaler** that automatically compresses photos to 1280px max bounds before upload.
  - Ensure your device has an active internet connection during upload.
  - If using a slow mobile connection, allow 5-10 seconds for the Base64 image payload to reach Google Cloud.

---

### 3.2 Photos are not appearing in the Google Drive folder
* **Diagnostic Check**:
  1. Open your Google Drive at [drive.google.com](https://drive.google.com).
  2. Search for the folder named **`Eternal Love Memories (Nishika)`**.
  3. Verify that your Google Account has sufficient free cloud storage space (Google provides 15 GB free).

---

## 4. 🗝️ Secret Vault & Access Issues

### 4.1 What is the passcode for Queen's Secret Vault?
* The secret anniversary passcode is:
  ```text
  2912
  ```
  *(Representing December 29, the special anniversary milestone).*

---

### 4.2 How does the Queen's Heart Key bypass work?
* If you do not wish to type the PIN manually, click or tap the glowing **`🔑 Queen's Heart Key`** button located next to the keypad.
* This triggers an instant royal authorization event and slides open the vault chamber.

---

## 5. 📱 Mobile Display & Browser Layout Issues

### 5.1 The navigation bar covers the top of the section when scrolling
* **Resolution**:
  - All section headers feature built-in CSS `scroll-margin-top: 80px`.
  - If custom styling was modified, ensure `:target` and section containers retain appropriate scroll offsets.

---

### 5.2 Horizontal scrolling occurs on my screen
* **Resolution**:
  - Eternal Love has been strictly audited to guarantee **0px horizontal overflow** across all screens (320px to 4K).
  - If you notice overflow, ensure your browser zoom level is set to 100% and no third-party browser extensions (like translation overlays) are injecting fixed-width elements.

---

## 6. 💾 Local Storage, State Reset & Privacy

### 6.1 How do I reset the celebration to fresh state?
To clear all redeemed coupons, favorited reasons, and reset the counters to default:
1. Open the Developer Console (`F12` on Windows/Linux or `Cmd + Option + I` on Mac).
2. Paste and run the following command:
   ```javascript
   localStorage.clear();
   location.reload();
   ```
3. The page will reload in pristine out-of-the-box condition.

---

### 6.2 Will my data be lost if I close my browser tab?
* **No!** All state (favorited reasons, claimed coupons, unlocked milestones, custom bucket list items) is automatically saved to your browser's persistent `localStorage`.
* Furthermore, all wishes and photos are saved permanently in your personal Google Sheets and Google Drive cloud storage!

---

*Still have questions? The celebration platform is built with love and care — feel free to explore and enjoy every moment!* 👑💖
