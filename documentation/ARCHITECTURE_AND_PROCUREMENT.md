# 🏛️ Eternal Love — Architecture, Structure & Procurement Specification

```
===============================================================================
SYSTEM BLUEPRINT & PROCUREMENT SPECIFICATION
Project: Eternal Love — Ultra-Luxurious Romantic Birthday Celebration
Celebrant: Queen Nishika 👑 | Dedicated by: Dilip 💖
Architecture: Pure Vanilla Web APIs + Serverless Google Cloud Micro-Engine
Total Cost of Ownership (TCO): $0.00 (100% Free Forever, Zero Recurring Fees)
===============================================================================
```

---

## 1. 🏛️ System Architecture Overview

Eternal Love is engineered as a **hybrid local-first progressive static web application** backed by an enterprise-grade, serverless Google Cloud data synchronization pipeline:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                CLIENT TIER (User Browser)                               │
│                                                                                        │
│  ┌─────────────────────────┐  ┌───────────────────────────┐  ┌───────────────────────┐ │
│  │     PRESENTATION        │  │     NATIVE WEB APIS       │  │    LOCAL PERSISTENCE  │ │
│  │  • Semantic HTML5       │  │  • Web Audio API Synth    │  │  • LocalStorage Cache │ │
│  │  • Vanilla CSS Tokens   │  │  • HTML5 Canvas Particles │  │  • URL Query Parser   │ │
│  │  • 3D CSS Perspectives  │  │  • Intersection Observer  │  │  • Client Downscaler  │ │
│  └────────────┬────────────┘  └─────────────┬─────────────┘  └───────────┬───────────┘ │
└───────────────┼─────────────────────────────┼────────────────────────────┼─────────────┘
                │                             │                            │
                ▼                             ▼                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                            CLOUD DISPATCH CONTROLLER (script.js)                       │
│                                                                                        │
│  1. Instant Local State Render & Audio / Confetti Feedback                             │
│  2. Asynchronous Background POST (`mode: 'no-cors'`, `Content-Type: text/plain`)       │
│  3. Graceful Network Fallback & Reactive UI Sync Chips                                 │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │ HTTPS POST Webhook
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                       SERVERLESS CLOUD TIER (Google Apps Script)                       │
│                                                                                        │
│     Endpoint: `https://script.google.com/macros/s/.../exec`                            │
│     • doPost(e) Request Router                                                         │
│     • doGet(e) Health Check                                                            │
│     • Auto-creates Sheets, Pastel Header Formatting, Row Dimensions                    │
└───────────────────────┬───────────────────────────────────┬────────────────────────────┘
                        │                                   │
       [ type == "wish" │ type == "secret_wish" ]           │ [ type == "photo" ]
                        ▼                                   ▼
┌──────────────────────────────────────────────────┐ ┌───────────────────────────────────┐
│              PERSONAL GOOGLE SHEET               │ │        PERSONAL GOOGLE DRIVE      │
│                                                  │ │                                   │
│  • "Wishes" Tab (Timestamp, Sender, Note, Style) │ │  • Folder:                        │
│  • "Secret Wishes" Tab (Sealed Birthday Wishes)  │ │    "Eternal Love Memories (Nishika)"│
│  • "Photos" Tab (Direct Drive URL & Live Preview)│ │  • Auto Base64 Blob Decode        │
│    Formula: `=IMAGE("drive.google.com/uc?id=..")`│ │  • Public View Permission Set     │
└──────────────────────────────────────────────────┘ └───────────────────────────────────┘
```

---

## 2. 🧩 Structural Component Inventory (21 Handcrafted Modules)

The application architecture is structured into 21 distinct modular stages across [coming-soon.html](file:///c:/Users/Himanshu/Documents/HTML/New%20folder/new/coming-soon.html) and [index.html](file:///c:/Users/Himanshu/Documents/HTML/New%20folder/new/index.html), styled by [style.css](file:///c:/Users/Himanshu/Documents/HTML/New%20folder/new/style.css), and driven by [script.js](file:///c:/Users/Himanshu/Documents/HTML/New%20folder/new/script.js):

| # | Section Anchor ID | Feature Module | Core Mechanics | Storage & Sync Endpoints |
| :-: | :--- | :--- | :--- | :--- |
| **-1**| `coming-soon.html`| **Grand Launch Teaser Gate** | Live countdown to Sept 20, 2026, VIP PIN keypad (`2912`), pre-launch blessing dispatch, auto-router. | **Google Sheets `"Wishes"` Tab** |
| **0** | `#introOverlay` | **3D Surprise Gift Unboxing** | 3D gift box with lid-opening physics, confetti bursts, fanfare audio, unlocks main celebration. | Session state |
| **1** | `#heroSec` | **Hero & Relationship Counter** | Live countdown from Dec 29, 2025; interactive cheer buttons (`🥂 Cheers`, `💖 Infinite Love`). | `state.cheers`, `state.loves` |
| **2** | `#letterSec` | **Wax-Sealed Love Letter** | 3D crimson velvet envelope with crackable wax seal and typewriter text generator. | Static template with dynamic names |
| **3** | `#openWhenSec` | **"Open When..." Situation Envelopes** | 6 situation letters (*Miss Me, Stressful Day, Can't Sleep, Need A Smile, Feel Beautiful, Forever*). | `#openWhenLetterModal` |
| **4** | `#timelineSec` | **Milestone Journey Timeline** | Glowing vertical ribbon tracking 5 story chapters with badges and memories. | Static / DOM |
| **5** | `#cakeSec` | **3D Birthday Cake Ceremony** | 3-tier cake, candle blowout with audio puff and smoke particles, golden knife cake cutting. | `state.candlesLit` |
| **6** | `#cuddleSec` | **Cozy Starlit Cuddle Haven** | 3D animated sofa cuddle cinema, rhythmic breathing animation, camera switcher, fireside glow. | Real-time CSS 3D |
| **7** | `#jarSec` | **"100 Reasons Why I Love You" Jar** | Floating fireflies, 3D origami heart unfold, category filter pills (*Romance, Habits, Safe Haven, Queen*). | `state.reasonsExplored` |
| **8** | `#couponsSec` | **Redeemable Couple Love Coupons** | Perforated vouchers (*Midnight Ice Cream, Rooftop Date, Cuddles*), stamped `REDEEMED 💖`. | `state.claimedCoupons` in `localStorage` |
| **9** | `#bucketSec` | **Couple Bucket List Tracker** | Interactive dream checklist, progress fill bar, stats counter, custom dream submission form. | `state.completedBucketItems` |
| **10**| `#musicSec` | **Tri-Instrument Romantic Lounge** | Polyphonic Grand Piano (hotkeys `1-8`, `Q-U`), Acoustic Guitar (6 strummable strings), Vintage Mixtape. | Web Audio API Polyphonic Synthesizer |
| **11**| `#bouquetSec` | **3D Forever Flower Bouquet Studio**| Flower garden picker (Roses, Peonies, Orchids), ribbons, royal full-screen gifting ceremony card. | Procedural SVG & 3D Cards |
| **12**| `#quizSec` | **Couple Trivia Quiz** | 5-question love quiz, instant answer feedback pills, score calculation, customized love commentary. | In-memory game state |
| **13**| `#memoriesSec`| **Vintage Polaroid Gallery** | Polaroid snapshots with paper tilts, canvas downscaled image uploader, auto Google Drive sync. | **Google Drive + Sheets `"Photos"` Tab** |
| **14**| `#wishSec` | **Celebration Pinboard** | Interactive post-it notes with pastel colors, real-time submission form, auto Google Sheet sync. | **Google Sheets `"Wishes"` Tab** |
| **15**| `#fortuneSec` | **Mystery Birthday Fortune Cards** | Crystal ball gaze, 3 golden fortune envelopes with randomized sweet predictions. | In-memory state |
| **16**| `#constellationSec`| **Constellation of Our Love** | Twinkling night sky star registry and printable official "Star Registry Certificate" in Nishika's name. | `#keepsakeModal` |
| **17**| `#lanternSec` | **Floating Sky Lantern Release** | Interactive paper lantern with custom wish inscription launched into the night sky with floating physics. | Physics particle loop |
| **18**| `#clawSec` | **"Love Claw" Surprise Arcade** | Controllable mechanical crane with Left/Right/Drop buttons, grabs golden surprise eggs. | Arcade canvas physics |
| **19**| `#projectorSec`| **Cinematic 8mm Story Projector** | Retro movie projector with spinning reels, vintage film grain, and narrative love story frames. | Frame scrubber |
| **20**| `#mirrorSec` | **Enchanted Mirror of Queen Nishika** | Ornate gold mirror reflecting randomized daily royal affirmations for the Queen. | Procedural text pool |

---

## 3. 🪟 Modal Architecture

The application contains **5 isolated, accessible modal dialogs** with click-outside dismissal and keyboard accessibility:

1. **`#wishModal`**: The Starry Time Capsule wish composer launched during the candle blowout. Dispatches secret wishes to the `"Secret Wishes"` Google Sheet tab.
2. **`#customizeModal`**: The Personalization control room allowing instant live editing of Celebrant Name, Sender Name, Anniversary Date, Custom Headline, 9 Aesthetic Themes, and the Google Sheets Webhook URL.
3. **`#keepsakeModal`**: The Royal Keepsake Love Certificate with gold foil borders, official wax crest, and printable export formatting.
4. **`#openWhenLetterModal`**: The Luxury Stationery Reader that unfolds handwritten love letters on parchment paper with gold deckle edges.
5. **`#secretWishVaultModal`**: The Queen's Vault modal protected by anniversary PIN (`2912`) or 1-tap *Queen's Heart Key*, revealing her private birthday wish.

---

## 4. 💰 Procurement & Asset Inventory (Zero-Cost Architecture)

The entire architecture is designed with **$0.00 total cost of ownership (TCO)**, utilizing enterprise-grade free tiers without credit cards, monthly subscriptions, or third-party quota paywalls:

### Financial & Resource Breakdown
| Component / Service | Chosen Provider | Enterprise Quota / Free Tier Limit | Estimated Project Usage | Monthly Cost |
| :--- | :--- | :--- | :--- | :---: |
| **Web Hosting & Edge CDN** | GitHub Pages (`.nojekyll` enabled) | 100 GB Bandwidth / month | ~500 MB / month | **$0.00** |
| **Serverless Backend** | Google Apps Script (GAS) | 20,000 executions / day | ~50–200 / day | **$0.00** |
| **Database Storage** | Google Sheets | 10,000,000 cells per spreadsheet | ~5,000 cells | **$0.00** |
| **Photo Cloud Storage** | Google Drive | 15 GB Free per Google account | ~40 MB (1,000 photos) | **$0.00** |
| **Audio Synthesizer Engine**| Browser Native Web Audio API | Unlimited local device execution | 0 Network Bandwidth | **$0.00** |
| **Typography & Web Fonts** | Google Fonts CDN | Unlimited Global Delivery | Cached locally | **$0.00** |
| **Iconography** | FontAwesome 6 CDN | Unlimited Global Delivery | Cached locally | **$0.00** |
| **SSL Certificate** | GitHub Pages Fastly Edge SSL | Automatic Free SSL/TLS Renewal | 100% HTTPS Encrypted | **$0.00** |
| **Total Monthly Operating Cost** | | | | **$0.00 / mo** |

### Comparison with Commercial Alternatives
| Requirement | Eternal Love Solution | Commercial Alternative | Alternative Cost | Risk Eliminated |
| :--- | :--- | :--- | :---: | :--- |
| **Form Data Collection** | Google Apps Script (`Code.gs`) | Formspree / Typeform | $19–$35 / mo | Submission quota lockouts |
| **Spreadsheet Sync** | Direct Native Google API | SheetDB / Zapier | $14–$29 / mo | API rate throttling & fees |
| **Photo Storage** | Google Drive Folder | Cloudinary / AWS S3 | $10–$25 / mo | Unexpected cloud bandwidth bills |
| **Audio Synthesis** | Native Web Audio API ADSR | Spotify API / Soundcloud | $12 / mo | Copyright strikes & token expiry |

---

## 5. 🔄 Step-by-Step Operational Workflows

### Workflow 1: How Dilip Personalizes the Celebration (In-App)
1. Launch the website in any browser.
2. Click the **⚙️ Personalize** button in the top navigation bar.
3. Edit her name (e.g. `Nishika`, `Queen Nishika`, `My Love`).
4. Set the relationship start date for the precision countdown ticker (`2025-12-29`).
5. Choose from any of the **9 Curated Luxury Themes** (*Magical Violet, Emerald Aurora, Sunset Rose Gold, etc.*).
6. Verify or update the **Google Sheets Webhook URL**.
7. Click **Apply All Changes**. The site updates instantly with audio fanfare and confetti!

### Workflow 2: Generating Personalized Share Links
1. Open the **⚙️ Personalize** modal.
2. The read-only box at the bottom dynamically generates your live personalized URL:
   ```
   https://<your-domain>/?name=Nishika&sender=Dilip&date=2025-12-29&theme=theme-magical&sheet=https%3A%2F%2Fscript.google.com%2F...
   ```
3. Click **Copy Link** to share directly via WhatsApp, Instagram, or iMessage.

### Workflow 3: How Guests & Loved Ones Submit Wishes
1. Scroll down to Section 14: **Celebration Pinboard**.
2. Type sender name and heartfelt birthday wish.
3. Click **Pin My Note 📌**.
4. The sticky note immediately pins to the board with cheer audio and confetti.
5. The cloud sync chip displays `Syncing...` and confirms `Wish Saved to Google Sheets! 💖✨`.
6. The note is permanently recorded in your Google Sheet under the `"Wishes"` tab.

### Workflow 4: How Polaroid Photos are Processed & Stored in Google Drive
1. Scroll down to Section 13: **Vintage Polaroid Photo Gallery**.
2. Click **Add Real Polaroid 📷** and select an image.
3. The client-side canvas engine automatically resizes the photo to max 800px and compresses it to ~40KB.
4. The photo appears instantly inside the tilted polaroid gallery.
5. In the background, the image data dispatches to your Google Apps Script endpoint.
6. The script creates a file in your Google Drive folder (`Eternal Love Memories (Nishika)`), sets public viewing permissions, and logs the direct Drive URL and `=IMAGE(url)` formula into the `"Photos"` tab of your Google Sheet!

### Workflow 5: How Nishika Unlocks Her Secret Wish Vault
1. Scroll to Section 5: **3D Birthday Cake Ceremony**.
2. Click **View or Unlock Secret Wish Vault 🗝️**.
3. Enter anniversary PIN `2912` (or tap the golden **Queen's Heart Key**).
4. The celestial orb cracks open with chime sound FX, revealing the private wish sealed during her candle blowout.

---

*Architectural Certification:* **100% Production Ready & Zero-Cost Certified**  
*Document Version:* **v1.0.0 (Release)**
