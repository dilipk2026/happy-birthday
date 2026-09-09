# 🚀 Eternal Love — GitHub Pages Official Deployment Guide

```
===============================================================================
OFFICIAL GITHUB PAGES DEPLOYMENT & HOSTING GUIDE
Target Web App: Eternal Love (Queen Nishika 👑 | Dilip 💖)
Architecture: Static Pure Vanilla HTML5 / CSS3 / ES6+ (Zero Build Pipeline)
Hosting Cost: 100% Free Forever with Automated Global HTTPS & Fastly Edge CDN
===============================================================================
```

> **Overview**: This project is optimized exclusively for **GitHub Pages**. Deploying takes under **2 minutes** and requires no build commands, node servers, or paid subscriptions.

---

## 📑 Table of Contents

1. [🚀 1. Step-by-Step GitHub Pages Deployment](#1-step-by-step-github-pages-deployment)
2. [⏳ 2. Platform Routing & Access Flow (`index.html` $\rightarrow$ `main.html`)](#2-platform-routing--access-flow-indexhtml--mainhtml)
3. [🏷️ 3. Free Custom Domain Setup (e.g. `happybirthdaynishika.com`)](#3-free-custom-domain-setup-eg-happybirthdaynishikacom)
4. [📱 4. Generating a Free QR Code for Physical Gift Cards](#4-generating-a-free-qr-code-for-physical-gift-cards)
5. [🛡️ 5. GitHub Pages Production Checklist](#5-github-pages-production-checklist)

---

## 1. 🚀 Step-by-Step GitHub Pages Deployment

### Step 1: Create a GitHub Repository
1. Navigate to [github.com/new](https://github.com/new).
2. Set your **Repository Name** (e.g., `happy-birthday` or `eternal-love`).
3. Set visibility to **Public** (required for free GitHub Pages hosting).
4. Do **not** check "Add a README file" (the repository already contains complete documentation).
5. Click **Create repository**.

---

### Step 2: Push Your Project Code to GitHub
Open your terminal inside the project directory and run:

```bash
# 1. Initialize Git repository
git init

# 2. Add all files (including .nojekyll, index.html, main.html, Code.gs, documentation/)
git add .

# 3. Commit the project
git commit -m "feat: Eternal Love celebration release 👑💖"

# 4. Set default branch to main
git branch -M main

# 5. Link your GitHub remote repository
git remote add origin https://github.com/<YOUR-GITHUB-USERNAME>/<YOUR-REPO-NAME>.git

# 6. Push code to GitHub
git push -u origin main
```

---

### Step 3: Activate GitHub Pages
1. On GitHub, go to your repository **Settings** (gear icon in the top tab bar).
2. In the left sidebar, click **Pages** (under the "Code and automation" section).
3. Under **Build and deployment** $\rightarrow$ **Source**, choose **Deploy from a branch**.
4. Set **Branch** to `main` and folder to `/ (root)`.
5. Click **Save**.
6. ⏱️ Wait 30–60 seconds for GitHub to deploy.

🎉 **Your Live Celebration URL**:
```text
https://<YOUR-GITHUB-USERNAME>.github.io/<YOUR-REPO-NAME>/
```

---

## 2. ⏳ Platform Routing & Access Flow (`index.html` $\rightarrow$ `main.html`)

```
                  ┌───────────────────────────────┐
                  │   Visitor opens Website URL   │
                  └──────────────┬────────────────┘
                                 │
                                 ▼
                     [ Serve index.html ]
              (Pre-Launch Countdown & Blessings Hub)
                                 │
                 ┌───────────────┴───────────────┐
                 │                               │
                 ▼                               ▼
      [ Submit Birthday Wish ]        [ Tap 👑 VIP Access Keypad ]
      • Text, Photos & Videos         • Enter PIN: 2912 or 22092000
      • Saves to Drive & Sheets       • Saves Session & Opens main.html
                                                 │
                                                 ▼
                                         [ main.html: Welcome Screen ]
                                         • 3D Bouncing Gift Box
                                         • Tap to open Passcode Modal
                                         • 3D Unboxing -> 25 Stages!
```

1. **Pre-Launch Portal ([index.html](file:///c:/Users/Himanshu/Documents/HTML/New%20folder/new/index.html))**:
   - Visitors view the real-time countdown clock, send early birthday blessings with photos/videos, and explore the interactive sticky wall.
2. **VIP & Direct Access**:
   - Tapping **👑 VIP Access** and entering `2912` or `22092000` unlocks direct entry to `main.html?vip=unlocked`.
   - Direct query parameters (`?preview=true`, `?passcode=22092000`, `?pin=2912`) grant immediate access without redirection.
3. **Celebration Arena ([main.html](file:///c:/Users/Himanshu/Documents/HTML/New%20folder/new/main.html))**:
   - Arriving on `main.html` presents the Welcome Screen with the 3D bouncing gift box first. Tapping the box prompts for the passcode to trigger the 3D unboxing animation and reveal the full celebration.

---

## 3. 🏷️ Free Custom Domain Setup (e.g. `happybirthdaynishika.com`)

If you want a personalized custom domain:

1. In your GitHub repository $\rightarrow$ **Settings** $\rightarrow$ **Pages** $\rightarrow$ **Custom domain**.
2. Enter your custom domain (e.g. `happybirthdaynishika.com`).
3. In your DNS provider (Namecheap, GoDaddy, Cloudflare):
   - Add **A Records** pointing to GitHub Pages IP addresses:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - Add a **CNAME Record**: `www` $\rightarrow$ `<YOUR-GITHUB-USERNAME>.github.io`.
4. In GitHub Pages settings, check **Enforce HTTPS**.

---

## 4. 📱 Generating a Free QR Code for Physical Gift Cards

To make the birthday gift presentation unforgettable, you can print a physical QR code on a luxury card or photo frame:

1. Copy your live GitHub Pages URL (e.g. `https://<your-username>.github.io/<your-repo>/`).
2. Go to any free, high-resolution QR generator (such as [qrserver.com](https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=https://your-url)).
3. Download the high-resolution PNG QR code (or use the included [webqr.png](file:///c:/Users/Himanshu/Documents/HTML/New%20folder/new/webqr.png)).
4. Print it on a card with the title:  
   *“Scan with your phone to unbox your surprise, Queen Nishika 👑”*

---

## 5. 🛡️ GitHub Pages Production Checklist

- [x] **`.nojekyll` File Present**: Ensures GitHub Pages bypasses Jekyll and serves raw static HTML5/CSS3/ES6 files directly.
- [x] **Relative Path Integrity**: All styles, scripts, canvas particles, and sub-pages resolve cleanly on repository subpaths (`/<repo-name>/`).
- [x] **Strict Passcode Security**: Passcodes restricted to `22092000` and `2912`.
- [x] **Free Global SSL**: Enforced by GitHub automatically.

---

## 6. ☁️ Google Apps Script (`Code.gs`) Web App Deployment & Cloud Sync

To connect your website's **Image & Video uploads**, **Live Wish Wall**, and **Starry Time Capsule** directly to your private Google Sheet & Google Drive:

### Step 1: Open Google Sheets & Apps Script Editor
1. Create or open your Google Spreadsheet (e.g. named *"Eternal Love Wishes — Queen Nishika"*).
2. Click **Extensions** $\rightarrow$ **Apps Script** in the top menu bar.

### Step 2: Paste `Code.gs`
1. Delete any default placeholder code in the script editor.
2. Open [`Code.gs`](file:///c:/Users/Himanshu/Documents/HTML/New%20folder/new/Code.gs) from this project, copy all contents, and paste into the editor.
3. Click the 💾 **Save project** button (or `Ctrl + S`).

### Step 3: Deploy as Web App
1. Click the blue **Deploy** button (top right) $\rightarrow$ **New deployment** (or **Manage deployments** $\rightarrow$ **Edit** $\rightarrow$ **New version** if updating).
2. Select type: **Web app** (click the gear icon ⚙️ if not already selected).
3. Set the following required settings:
   - **Description**: `Eternal Love Media & Wishes Hub v2.7`
   - **Execute as**: `Me (your_email@gmail.com)`
   - **Who has access**: `Anyone` *(Crucial: allows visitors from GitHub Pages to send wishes and upload photos/videos without needing a Google login)*
4. Click **Deploy**.
5. When prompted, click **Authorize access**, select your Google account, click *Advanced* $\rightarrow$ *Go to Eternal Love (unsafe)*, and click **Allow**.
6. Copy the generated **Web App URL** (e.g. `https://script.google.com/macros/s/AKfycb.../exec`).

### Step 4: Link Web App URL to `index.html` & `script.js`
- Verify that `GOOGLE_SHEET_URL` in [`index.html`](file:///c:/Users/Himanshu/Documents/HTML/New%20folder/new/index.html) matches your Web App URL.
- All submitted images, videos, and wishes will now automatically:
  1. Save uploaded photo and video files to your Google Drive folder (`"Eternal Love Wishes (Queen Nishika)"`).
  2. Log structured rows to the `"Wishes"`, `"Photos"`, and `"Videos"` sheet tabs.
  3. Stream live playable video players and full-screen HD Lightbox previews back to any visitor on the website!

---

*Handcrafted with infinite love for Queen Nishika 👑 | Dedicated by Dilip 💖*
