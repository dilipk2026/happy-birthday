# 🛠️ Maintenance & Operations Runbook — Eternal Love Platform

```
===============================================================================
OPERATIONS MANUAL, ANNUAL RUNBOOK & DISASTER RECOVERY PROTOCOL
Project: Eternal Love — Ultra-Luxurious Romantic Celebration Web Application
Celebrant: Queen Nishika 👑 | Dedicated with Infinite Love by: Dilip 💖
Birthday: September 22nd | Milestone: December 29, 2025
Standard: SRE Operations, Test Automation & Long-Term Digital Archival Protocol
===============================================================================
```

> **Overview**: This runbook provides system administrators, maintainers, and Dilip with step-by-step procedures for annual celebration updates, cloud quota monitoring, local backup generation, automated testing, and digital preservation.

---

## 📑 Table of Contents

1. [📅 1. Annual Birthday Rollover Checklist](#1-annual-birthday-rollover-checklist)
2. [🧪 2. Automated Quality Assurance & Regression Testing](#2-automated-quality-assurance--regression-testing)
3. [☁️ 3. Google Cloud Infrastructure & Quota Monitoring](#3-google-cloud-infrastructure--quota-monitoring)
4. [💾 4. Data Backup, Export & Archival Procedures](#4-data-backup-export--archival-procedures)
5. [🔒 5. Disaster Recovery & Emergency Failover](#5-disaster-recovery--emergency-failover)
6. [🏛️ 6. Long-Term Permanent Preservation (Offline Kept)](#6-long-term-permanent-preservation-offline-kept)

---

## 1. 📅 1. Annual Birthday Rollover Checklist

Execute this checklist every year prior to **September 22nd** to prepare the new year's celebration edition:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   ANNUAL BIRTHDAY PREPARATION CHECKLIST                │
│                                                                        │
│  [ ] 1. Update relationship inception counter if new milestones added  │
│  [ ] 2. Add new photographs to the 3D Polaroid Scrapbook               │
│  [ ] 3. Write and seal new Love Letters & secret promises              │
│  [ ] 4. Reset or refresh Love Coupons for the Queen                    │
│  [ ] 5. Export previous year's Google Sheet wishes as commemorative CSV│
│  [ ] 6. Run automated Playwright tests to verify 0 regressions        │
│  [ ] 7. Verify deployment SSL certificates on CDN edge                 │
└────────────────────────────────────────────────────────────────────────┘
```

### Step-by-Step Rollover Instructions:
1. **Adding New Photos**:
   - Save photos into `screenshots/` or upload directly through the **➕ Add Memory Photo** interface.
   - Update `main.html` memory card tags if you wish to set hardcoded permanent defaults.
2. **Updating Love Letters**:
   - Open `main.html` and locate `<div class="letter-content">`.
   - Update the letter text with new memories and promises for the upcoming year.
3. **Triggering Confetti & Fresh Milestones**:
   - Update the milestone thresholds in `script.js` to celebrate 500 days, 2 years, 3 years, etc.

---

## 2. 🧪 2. Automated Quality Assurance & Regression Testing

Before every deployment or annual update, run the automated Playwright test suite to certify system integrity:

```bash
# Execute full Playwright automated test suite (49 assertions across 5 suites)
node playwright-test-runner.js
```

### Success Benchmark:
* **Suites Executed**: 5 (Delivery, Portal, Security Router, Celebration Arena, Responsive Matrix).
* **Passed**: 49/49 (100%).
* **Console Errors**: 0.

---

## 3. ☁️ 3. Google Cloud Infrastructure & Quota Monitoring

Eternal Love runs 100% within **Google's Free Tier Quotas**. Review the limits below:

| Service Component | Google Free Tier Limit | Eternal Love Usage | Headroom / Status |
| :--- | :--- | :--- | :---: |
| **Google Apps Script Executions** | 20,000 requests / day | ~50 - 200 / day | 🟢 99.0% Free |
| **Apps Script Execution Time** | 6 minutes / execution | $< 1.2\text{ seconds}$ | 🟢 99.6% Free |
| **Google Drive Cloud Storage** | 15.0 GB free / account | $< 250\text{ MB}$ (Compressed) | 🟢 98.3% Free |
| **Google Sheets Row Limit** | 10,000,000 cells | $< 10,000\text{ cells}$ | 🟢 99.9% Free |
| **GitHub Pages CDN Bandwidth** | 100 GB / month | $< 2\text{ GB}$ / month | 🟢 98.0% Free |

---

## 4. 💾 4. Data Backup, Export & Archival Procedures

### 4.1 Google Sheets Wishes Backup (CSV / Excel)
1. Open the connected Google Spreadsheet.
2. Go to **File** $\rightarrow$ **Download** $\rightarrow$ **Comma Separated Values (.csv)** or **Microsoft Excel (.xlsx)**.
3. Save the backup as `Eternal_Love_Wishes_Backup_YYYY.csv`.

### 4.2 Google Drive Memory Photos Bulk Export
1. Navigate to Google Drive $\rightarrow$ Folders:
   - **`Eternal Love Wishes (Queen Nishika)`**
   - **`Eternal Love Memories (Nishika)`**
2. Right-click each folder and select **Download**.
3. Google will package all uploaded media into a `.zip` archive for offline safekeeping.

---

## 5. 🔒 5. Disaster Recovery & Emergency Failover

### Scenario A: Google Apps Script Webhook Unavailable
* **Symptom**: Cloud Sync status chip shows amber or network warning.
* **Auto-Recovery**: The client-side dispatch controller automatically catches the exception and stores the wish/photo in local storage cache (`localStorage`).
* **Manual Resolution**:
  1. Open the Google Sheet $\rightarrow$ **Extensions** $\rightarrow$ **Apps Script**.
  2. Click **Deploy** $\rightarrow$ **Manage deployments** $\rightarrow$ **New Version** $\rightarrow$ **Deploy**.
  3. Copy the fresh Web App URL and update `DEFAULT_GOOGLE_SHEET_URL` in `script.js` and `index.html`.

---

## 6. 🏛️ 6. Long-Term Permanent Preservation (Offline Kept)

To guarantee that Queen Nishika can open and experience this celebration 10, 20, or 50 years from now without relying on cloud services:

1. **Local Self-Contained Archive**:
   - Because Eternal Love utilizes **zero external framework dependencies**, the repository directory itself is a completely self-contained, perpetual digital keepsake.
2. **USB Keepsake Gift Box**:
   - Copy this entire repository folder onto an engraved luxury wooden USB drive or golden digital keepsake capsule.
   - Any computer running any browser in 2040+ can double-click `index.html` or `main.html` and launch the full celebration offline!

---

*Eternal Love Operations Runbook — Engineered to endure for a lifetime of memories.* 👑💖
