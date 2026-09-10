# 11. Maintenance, Operations & Rollover Runbook

> **Status**: `[VERIFIED]` • Production Baseline v3.0.0  
> **Maintenance Cycle**: Annual Birthday Rollover & Cloud Quota Audits  

---

## 1. Routine Operational Maintenance

Because Eternal Love is hosted statically on GitHub Pages with serverless Google Apps Script backend, routine server OS patching and database index rebuilding are unnecessary. Operational maintenance is focused on:

| Maintenance Task | Frequency | Procedure | Responsible |
| :--- | :--- | :--- | :--- |
| **Cloud Quota Review** | Monthly / Pre-Event | Check Google Drive storage and Google Sheet row count ($<5,000\text{ rows}$). | Dilip |
| **Spreadsheet Archival** | Post-Birthday | Export Google Sheet as `.xlsx` / `.csv` backup and archive media folder. | Dilip |
| **Annual Launch Rollover** | Annually (Aug/Sept) | Increment target launch date timestamp for the next celebration year. | Developer / Dilip |
| **Link & Embed Health Audit** | Semi-Annually | Run `node playwright-test-runner.js` to verify third-party CDN health. | QA / Developer |

---

## 2. Annual Birthday Rollover Runbook

To configure the platform for subsequent celebration years:

### Step 1: Update Launch Target in `index.html` & `main.html`
In [`index.html`](../index.html) (line ~9) and [`main.html`](../main.html) (line ~10):
```javascript
// Update target year from 2026 to 2027
const TARGET_LAUNCH_DATE = new Date('2027-09-21T23:00:00+05:30').getTime();
```

### Step 2: Update Relationship Milestone in `script.js`
In [`script.js`](../script.js) (line ~35):
Verify the anniversary start date remains `'2025-12-29'` so the live counter accurately displays total days, hours, and minutes of love.

### Step 3: Archive Previous Year's Google Sheet
1. Open active Google Sheet.
2. Click **File** $\rightarrow$ **Download** $\rightarrow$ **Microsoft Excel (.xlsx)**.
3. Rename previous tab to `"Wishes_2026"` and create fresh `"Wishes"` tab with standard 10 columns.

---

## 3. Google Cloud Quota & Storage Management

Google Workspace free consumer accounts provide:
- **Google Drive Storage**: 15GB shared across Drive and Gmail.
- **Google Apps Script Fetch Quota**: 20,000 URL Fetch calls/day.
- **Script Runtime Limit**: 6 minutes per single execution.

### Quota Optimization Controls Implemented:
1. **Canvas Downsampling**: High-resolution mobile phone camera photos (10MB+) are compressed to $<300\text{KB}$ before transmission.
2. **Video File Limit**: Video file picker enforces $\le 25\text{MB}$ limit, encouraging YouTube/Vimeo/Drive link embeds for long video reels.
3. **Local Hydration**: Wishes are cached in browser `localStorage`, reducing unnecessary repetitive GET calls to Google Apps Script.

---

## 4. Browser Cache Purge Procedures

If a user reports viewing an older cached version of the celebration:
- **Hard Refresh (Desktop)**: Press <kbd>Ctrl</kbd> + <kbd>F5</kbd> (Windows) or <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>R</kbd> (Mac).
- **Mobile Cache Refresh**: Open browser settings $\rightarrow$ Privacy $\rightarrow$ Clear Browsing Data $\rightarrow$ Cached images and files.
