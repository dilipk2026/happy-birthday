# 🛠️ Maintenance & Operations Runbook — Eternal Love Platform

```
===============================================================================
OPERATIONS MANUAL, ANNUAL RUNBOOK & DISASTER RECOVERY PROTOCOL
Project: Eternal Love — Ultra-Luxurious Romantic Celebration Web Application
Celebrant: Queen Komal 👑 | Dedicated with Infinite Love by: Dilip 💖
Standard: SRE Operations & Long-Term Digital Archival Protocol
===============================================================================
```

> **Overview**: This runbook provides system administrators, maintainers, and Dilip with step-by-step procedures for annual celebration updates, cloud quota monitoring, local backup generation, and digital preservation.

---

## 📑 Table of Contents

1. [📅 1. Annual Birthday Rollover Checklist](#1-annual-birthday-rollover-checklist)
2. [☁️ 2. Google Cloud Infrastructure & Quota Monitoring](#2-google-cloud-infrastructure--quota-monitoring)
3. [💾 3. Data Backup, Export & Archival Procedures](#3-data-backup-export--archival-procedures)
4. [🔒 4. Disaster Recovery & Emergency Failover](#4-disaster-recovery--emergency-failover)
5. [🏛️ 5. Long-Term Permanent Preservation (Offline Kept)](#5-long-term-permanent-preservation-offline-kept)

---

## 1. 📅 1. Annual Birthday Rollover Checklist

Execute this checklist every year prior to **September 5th** to prepare the new year's celebration edition:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   ANNUAL BIRTHDAY PREPARATION CHECKLIST                │
│                                                                        │
│  [ ] 1. Update relationship inception counter if new milestones added  │
│  [ ] 2. Add new photographs to the 3D Polaroid Scrapbook               │
│  [ ] 3. Write and seal new Love Letters & secret promises              │
│  [ ] 4. Reset or refresh Love Coupons for the Queen                    │
│  [ ] 5. Export previous year's Google Sheet wishes as commemorative CSV│
│  [ ] 6. Verify deployment SSL certificates on CDN edge                 │
└────────────────────────────────────────────────────────────────────────┘
```

### Step-by-Step Rollover Instructions:
1. **Adding New Photos**:
   - Save photos into `screenshots/` or upload directly through the **➕ Add Memory Photo** interface.
   - Update `index.html` memory card tags if you wish to set hardcoded permanent defaults.
2. **Updating Love Letters**:
   - Open `index.html` and locate `<div class="letter-content">`.
   - Update the letter text with new memories and promises for the upcoming year.
3. **Triggering Confetti & Fresh Milestones**:
   - Update the milestone thresholds in `script.js` to celebrate 500 days, 2 years, 3 years, etc.

---

## 2. ☁️ 2. Google Cloud Infrastructure & Quota Monitoring

Eternal Love runs 100% within **Google's Free Tier Quotas**. Review the limits below to ensure seamless operation:

| Service Component | Google Free Tier Limit | Eternal Love Usage | Headroom / Status |
| :--- | :--- | :--- | :---: |
| **Google Apps Script Executions** | 20,000 requests / day | ~50 - 200 / day | 🟢 99.0% Free |
| **Apps Script Execution Time** | 6 minutes / execution | $< 1.2\text{ seconds}$ | 🟢 99.6% Free |
| **Google Drive Cloud Storage** | 15.0 GB free / account | $< 250\text{ MB}$ (Compressed) | 🟢 98.3% Free |
| **Google Sheets Row Limit** | 10,000,000 cells | $< 10,000\text{ cells}$ | 🟢 99.9% Free |
| **Vercel / Netlify Edge Bandwidth**| 100 GB / month | $< 2\text{ GB}$ / month | 🟢 98.0% Free |

---

## 3. 💾 3. Data Backup, Export & Archival Procedures

### 3.1 Google Sheets Wishes Backup (CSV / Excel)
1. Open the connected Google Spreadsheet.
2. Go to **File** $\rightarrow$ **Download** $\rightarrow$ **Comma Separated Values (.csv)** or **Microsoft Excel (.xlsx)**.
3. Save the backup as `Eternal_Love_Wishes_Backup_YYYY.csv`.

### 3.2 Google Drive Memory Photos Bulk Export
1. Navigate to Google Drive $\rightarrow$ Folder: **`Eternal Love Memories (Komal)`**.
2. Right-click the folder and select **Download**.
3. Google will package all uploaded photos into a single `.zip` archive for offline safekeeping.

---

## 4. 🔒 4. Disaster Recovery & Emergency Failover

### Scenario A: Google Apps Script Webhook Unavailable
* **Symptom**: Cloud Sync status chip shows amber or network warning.
* **Auto-Recovery**: The client-side dispatch controller automatically catches the exception and stores the wish/photo in local storage cache (`localStorage`).
* **Manual Resolution**:
  1. Open the Google Sheet $\rightarrow$ **Extensions** $\rightarrow$ **Apps Script**.
  2. Click **Deploy** $\rightarrow$ **Manage deployments** $\rightarrow$ **New Version** $\rightarrow$ **Deploy**.
  3. Copy the fresh Web App URL and update `DEFAULT_GOOGLE_SHEET_URL` in `script.js`.

### Scenario B: Primary Web Host Down (e.g. GitHub Pages maintenance)
* **Failover**: Eternal Love has duplicate deployment configs ready for **Vercel** (`vercel.json`) and **Netlify** (`netlify.toml`).
* Deploying to alternative hosts takes less than 30 seconds:
  ```bash
  npx vercel --prod
  # or
  npx netlify deploy --prod
  ```

---

## 5. 🏛️ 5. Long-Term Permanent Preservation (Offline Kept)

To guarantee that Queen Komal can open and experience this celebration 10, 20, or 50 years from now without relying on cloud services:

1. **Local Self-Contained Archive**:
   - Because Eternal Love utilizes **zero external dependencies**, the repository directory itself is a completely self-contained, perpetual digital keepsake.
2. **USB Keepsake Gift Box**:
   - Copy this entire repository folder onto an engraved luxury wooden USB drive or golden digital keepsake capsule.
   - Any computer running any browser in 2040+ can double-click `index.html` and launch the full celebration offline!

---

*Eternal Love Operations Runbook — Engineered to endure for a lifetime of memories.* 👑💖
