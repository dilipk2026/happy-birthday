# 🚀 Eternal Love — GitHub Pages Official Deployment Guide

```
===============================================================================
OFFICIAL GITHUB PAGES DEPLOYMENT & HOSTING GUIDE
Target Web App: Eternal Love (Queen Komal 👑 | Dilip 💖)
Architecture: Static Pure Vanilla HTML5 / CSS3 / ES6+ (Zero Build Pipeline)
Hosting Cost: 100% Free Forever with Automated Global HTTPS & Fastly Edge CDN
===============================================================================
```

> **Overview**: This project is optimized exclusively for **GitHub Pages**. Deploying takes under **2 minutes** and requires no build commands, node servers, or paid subscriptions.

---

## 📑 Table of Contents

1. [🚀 1. Step-by-Step GitHub Pages Deployment](#1-step-by-step-github-pages-deployment)
2. [⏳ 2. Automated Launch Lifecycle (September 20 Launch)](#2-automated-launch-lifecycle-september-20-launch)
3. [🏷️ 3. Free Custom Domain Setup (e.g. `happybirthdaykomal.com`)](#3-free-custom-domain-setup-eg-happybirthdaykomalcom)
4. [📱 4. Generating a Free QR Code for Physical Gift Cards](#4-generating-a-free-qr-code-for-physical-gift-cards)
5. [🛡️ 5. GitHub Pages Production Checklist](#5-github-pages-production-checklist)

---

## 1. 🚀 Step-by-Step GitHub Pages Deployment

### Step 1: Create a GitHub Repository
1. Navigate to [github.com/new](https://github.com/new).
2. Set your **Repository Name** (e.g., `happy-birthday-komal` or `eternal-love`).
3. Set visibility to **Public** (required for free GitHub Pages hosting).
4. Do **not** check "Add a README file" (the repository already has complete documentation).
5. Click **Create repository**.

---

### Step 2: Push Your Project Code to GitHub
Open your terminal inside this project folder and run:

```bash
# 1. Initialize Git repository
git init

# 2. Add all files (including .nojekyll, coming-soon.html, index.html, and docs)
git add .

# 3. Commit the project
git commit -m "feat: Eternal Love celebration release 👑💖"

# 4. Set the default branch to main
git branch -M main

# 5. Link your GitHub remote repository (replace with your actual GitHub username and repo)
git remote add origin https://github.com/<YOUR-GITHUB-USERNAME>/<YOUR-REPO-NAME>.git

# 6. Push the code to GitHub
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

## 2. ⏳ Automated Launch Lifecycle (September 20 Launch)

The website includes an automated client-side launch router built into `<head>`:

```
                  ┌───────────────────────────────┐
                  │   Visitor opens Website URL   │
                  └──────────────┬────────────────┘
                                 │
                 Is Date < September 20, 2026?
                 ┌───────────────┴───────────────┐
             YES │                               │ NO
                 ▼                               ▼
     Has VIP Key / ?preview=true?     [ Serve index.html ]
         ┌───────┴───────┐            (Grand Celebration Arena)
     YES │               │ NO
         ▼               ▼
 [ Serve index.html ] [ Serve coming-soon.html ]
 (VIP Preview Mode)   (Live Countdown & Early Wishes)
```

1. **Before September 20, 2026**:
   - Visitors opening your GitHub Pages link automatically see [`coming-soon.html`](file:///c:/Users/Himanshu/Documents/HTML/New%20folder/new/coming-soon.html) with the live countdown clock, sneak peeks, and early blessing collector.
2. **VIP Early Access Bypass**:
   - Queen Komal or Dilip can unlock the full [`index.html`](file:///c:/Users/Himanshu/Documents/HTML/New%20folder/new/index.html) anytime before September 20 by entering PIN **`2912`** or clicking the **Queen Komal 👑 Instant Access Key** on the Coming Soon page (or visiting `https://<YOUR-USERNAME>.github.io/<REPO>/?preview=true`).
3. **On & After September 20, 2026**:
   - The website automatically transitions [`index.html`](file:///c:/Users/Himanshu/Documents/HTML/New%20folder/new/index.html) to the primary landing page for all visitors worldwide without requiring any manual redeployment or repo changes!

---

## 3. 🏷️ Free Custom Domain Setup (e.g. `happybirthdaykomal.com`)

If you want a personalized custom domain:

1. In your GitHub repository $\rightarrow$ **Settings** $\rightarrow$ **Pages** $\rightarrow$ **Custom domain**.
2. Enter your custom domain (e.g. `happybirthdaykomal.com`).
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
3. Download the high-resolution PNG QR code.
4. Print it on a card with the title:  
   *“Scan with your phone to unbox your surprise, Queen Komal 👑”*

---

## 5. 🛡️ GitHub Pages Production Checklist

- [x] **`.nojekyll` File Present**: Ensures GitHub Pages bypasses Jekyll and serves raw static HTML5/CSS3/ES6 files directly.
- [x] **Relative Path Integrity**: All styles, scripts, canvas particles, and sub-pages resolve cleanly on repository subpaths (`/<repo-name>/`).
- [x] **Automated Date Gate**: Coming Soon mode is active until September 20; full celebration is live afterwards.
- [x] **Free Global SSL**: Enforced by GitHub automatically.

---

*Handcrafted with infinite love for Queen Komal 👑 | Dedicated by Dilip 💖*
