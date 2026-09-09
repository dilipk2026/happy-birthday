# ❓ FAQ & Troubleshooting Guide — Eternal Love Web Application

```
===============================================================================
OPERATIONAL FAQ, DIAGNOSTIC PROCEDURES & TROUBLESHOOTING GUIDE
Project: Eternal Love — Ultra-Luxurious Romantic Birthday Celebration
Celebrant: Queen Nishika 👑 | Dedicated with Infinite Love by: Dilip 💖
Birthday: September 22nd | Relationship Milestone: December 29, 2025
Passcodes: 22092000 (DOB DDMMYYYY) & 2912 (VIP Anniversary DDMM)
Support Classification: Level 1-3 Diagnostic Runbook
===============================================================================
```

> **Welcome to the Troubleshooting Guide & Knowledge Base**. If you experience any audio playback issues, Google Sheet synchronization questions, passcode inquiries, or display quirks on specific devices, refer to the verified diagnostic steps below.

---

## 📑 Table of Contents

1. [🗝️ Passcodes & Authentication](#1-️-passcodes--authentication)
   - [1.1 What are the valid passcodes to unlock the celebration?](#11-what-are-the-valid-passcodes-to-unlock-the-celebration)
   - [1.2 Why did I get a shake animation and error chime when entering my PIN?](#12-why-did-i-get-a-shake-animation-and-error-chime-when-entering-my-pin)
   - [1.3 How does the Welcome Screen and 3D Unboxing work on `main.html`?](#13-how-does-the-welcome-screen-and-3d-unboxing-work-on-mainhtml)
2. [🎵 Audio & Synthesizer Issues](#2--audio--synthesizer-issues)
   - [2.1 Why isn't music playing automatically when the page opens?](#21-why-isnt-music-playing-automatically-when-the-page-opens)
   - [2.2 Audio sounds distorted or stuttering on mobile](#22-audio-sounds-distorted-or-stuttering-on-mobile)
3. [💌 Early Birthday Blessings & Media Uploads](#3--early-birthday-blessings--media-uploads)
   - [3.1 How do photo and video attachments work on the Sticky Wall?](#31-how-do-photo-and-video-attachments-work-on-the-sticky-wall)
   - [3.2 Photos take long to upload or fail on slow mobile connections](#32-photos-take-long-to-upload-or-fail-on-slow-mobile-connections)
   - [3.3 How do I view photos and videos in full-screen?](#33-how-do-i-view-photos-and-videos-in-full-screen)
4. [☁️ Google Sheets & Cloud Sync Issues](#4-️-google-sheets--cloud-sync-issues)
   - [4.1 Submitted wish doesn't show up in my Google Sheet immediately](#41-submitted-wish-doesnt-show-up-in-my-google-sheet-immediately)
   - [4.2 Where are uploaded photos and videos stored in Google Drive?](#42-where-are-uploaded-photos-and-videos-stored-in-google-drive)
5. [📱 Mobile Display & Browser Layout](#5--mobile-display--browser-layout)
   - [5.1 Is the website responsive on all screen sizes?](#51-is-the-website-responsive-on-all-screen-sizes)
6. [💾 Local Storage, State Reset & Privacy](#6--local-storage-state-reset--privacy)
   - [6.1 How do I reset the celebration to fresh state?](#61-how-do-i-reset-the-celebration-to-fresh-state)
   - [6.2 Will my data be lost if I close my browser tab?](#62-will-my-data-be-lost-if-i-close-my-browser-tab)

---

## 1. 🗝️ Passcodes & Authentication

### 1.1 What are the valid passcodes to unlock the celebration?
Across the entire platform, only **two specific passcodes** are authorized:
1. **`22092000`** — Queen Nishika's 8-digit Date of Birth: 22nd September 2000 in `DDMMYYYY` format.
2. **`2912`** — VIP Anniversary PIN: 29th December in `DDMM` format.

---

### 1.2 Why did I get a shake animation and error chime when entering my PIN?
* The system enforces strict authentication. Any PIN other than `22092000` or `2912` (such as `0000`, `1234`, `1111`) is rejected.
* Click the **Hint** button on the keypad modal for a romantic reminder of the anniversary milestone without exposing raw digits.

---

### 1.3 How does the Welcome Screen and 3D Unboxing work on `main.html`?
1. Upon arriving at [main.html](file:///c:/Users/Himanshu/Documents/HTML/New%20folder/new/main.html), you see the **Welcome Screen** with a bouncing 3D gift box and the prompt *"Tap To Open Your Surprise"*.
2. Clicking the gift box or the **"Open My Birthday Surprise"** button smoothly opens the Passcode Lock screen.
3. Entering `22092000` or `2912` triggers victory fanfare, bursts multi-color confetti, animates the 3D gift box lid open, and unveils the full celebration arena (`#mainApp`).
4. If you opened the passcode modal by mistake, click the **`X`** close button to return to the gift box screen.

---

## 2. 🎵 Audio & Synthesizer Issues

### 2.1 Why isn't music playing automatically when the page opens?
* **Root Cause**: All modern web browsers (Chrome, Safari, iOS, Edge, Firefox) enforce strict **Autoplay Policies**. They prohibit web apps from generating audio until the user has performed at least one physical gesture (click, tap, or keypress).
* **Resolution**:
  1. Simply click anywhere on the page or tap the floating **`🎵 Play Music`** button in the navigation bar.
  2. The `AudioContext` will instantly unlock and resume audio synthesis smoothly.

---

### 2.2 Audio sounds distorted or stuttering on mobile
* **Resolution**:
  1. Disable Battery Saver / Low Power Mode on your smartphone.
  2. The synth engine automatically optimizes oscillator count on mobile devices to prevent buffer underruns.

---

## 3. 💌 Early Birthday Blessings & Media Uploads

### 3.1 How do photo and video attachments work on the Sticky Wall?
* On [index.html](file:///c:/Users/Himanshu/Documents/HTML/New%20folder/new/index.html), the Early Birthday Blessing form accepts:
  - Text messages.
  - Photos (automatically compressed client-side via HTML5 Canvas to $<1200\text{px}$ and $<300\text{ KB}$).
  - Video uploads (MP4) or video URLs (YouTube, Shorts, Vimeo, Google Drive, MP4).
* Submitted wishes appear instantly on the live Sticky Wall with in-card playable video controls and photo thumbnails.

---

### 3.2 Photos take long to upload or fail on slow mobile connections
* The platform automatically resizes images before upload to ensure quick transmissions. If using a slow network, allow 3-6 seconds for Google Apps Script to upload the media to Google Drive and return the CDN preview link.

---

### 3.3 How do I view photos and videos in full-screen?
* Click on any photo or video card on the Sticky Wish Wall to open the full-screen **Media Lightbox Modal** (`#mediaLightboxModal`). Press <kbd>Esc</kbd> or click the backdrop to close it.

---

## 4. ☁️ Google Sheets & Cloud Sync Issues

### 4.1 Submitted wish doesn't show up in my Google Sheet immediately
* Google Apps Script webhooks execute asynchronously. Allow 3 to 8 seconds for Google's cloud servers to append the row.
* In the meantime, the wish is saved in the browser's `localStorage` and remains visible on the wall immediately.

---

### 4.2 Where are uploaded photos and videos stored in Google Drive?
Uploaded media is automatically organized into two dedicated folders in the project owner's Google Drive:
1. **`Eternal Love Wishes (Queen Nishika)`** — Contains photos and videos attached to early birthday blessings.
2. **`Eternal Love Memories (Nishika)`** — Contains memory photos uploaded to the Polaroid Scrapbook.

---

## 5. 📱 Mobile Display & Browser Layout

### 5.1 Is the website responsive on all screen sizes?
* **Yes!** Eternal Love has been strictly audited with **0px horizontal overflow** across:
  - Compact Mobile (320px - iPhone SE)
  - Standard Smartphones (375px–430px - iPhone 14/15, Samsung Galaxy)
  - Tablets & iPads (768px–1024px)
  - Laptops & Desktops (1280px–1920px)
  - 4K Ultra-Wide Displays (2560px–3840px)

---

## 6. 💾 Local Storage, State Reset & Privacy

### 6.1 How do I reset the celebration to fresh state?
To clear local state:
1. Open the Developer Console (`F12`).
2. Paste and run:
   ```javascript
   localStorage.clear();
   sessionStorage.clear();
   location.reload();
   ```

---

### 6.2 Will my data be lost if I close my browser tab?
* **No!** All preferences, favorited reasons, claimed coupons, and local wishes are persisted in browser `localStorage`.
* Furthermore, all wishes and media are permanently stored in your personal Google Sheets and Google Drive cloud folders!

---

*Still have questions? The celebration platform is built with love and care — feel free to explore and enjoy every moment!* 👑💖
