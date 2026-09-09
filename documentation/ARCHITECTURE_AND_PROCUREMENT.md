# 🏛️ Eternal Love — Architecture, Structure & Procurement Specification

```
===============================================================================
SYSTEM BLUEPRINT & PROCUREMENT SPECIFICATION
Project: Eternal Love — Ultra-Luxurious Romantic Birthday Celebration
Celebrant: Queen Nishika 👑 | Dedicated by: Dilip 💖
Birthday: September 22nd (22/09/2000) | Milestone: December 29, 2025
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
│  │  • index.html (Portal)  │  │  • Web Audio API Synth    │  │  • LocalStorage Cache │ │
│  │  • main.html (Arena)    │  │  • HTML5 Canvas Particles │  │  • Session Tokens     │ │
│  │  • 3D Unboxing & CSS    │  │  • Canvas Compression     │  │  • Deduplication Map  │ │
│  │  • Glassmorphic Tokens  │  │  • Media Lightbox Modal   │  │  • Strict PIN Verifier│ │
│  └────────────┬────────────┘  └─────────────┬─────────────┘  └───────────┬───────────┘ │
└───────────────┼─────────────────────────────┼────────────────────────────┼─────────────┘
                │                             │                            │
                ▼                             ▼                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                            CLOUD DISPATCH CONTROLLER (script.js)                       │
│                                                                                        │
│  1. Instant Local State Render & Audio / Confetti Feedback                             │
│  2. Asynchronous Background POST (`mode: 'no-cors'`, `Content-Type: text/plain`)       │
│  3. Real-Time GET Fetch (`doGet` / JSONP) with Direct Google Drive CDN Thumbnails       │
│  4. Graceful Network Fallback & Reactive UI Sync Chips                                 │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │ HTTPS POST & GET Webhooks
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                       SERVERLESS CLOUD TIER (Google Apps Script: Code.gs)              │
│                                                                                        │
│     Endpoint: `https://script.google.com/macros/s/.../exec`                            │
│     • doPost(e) Router for Wishes (Photos/Videos), Polaroid Photos & Secret Notes      │
│     • doGet(e) Live Ingestion & CDN URL Resolver                                       │
│     • Automatic Google Drive Folder & Sheet Tab Initializers                           │
└───────────────────────┬───────────────────────────────────┬────────────────────────────┘
                        │                                   │
       [ type == "wish" │ type == "secret_wish" ]           │ [ type == "photo" | wish media ]
                        ▼                                   ▼
┌──────────────────────────────────────────────────┐ ┌───────────────────────────────────┐
│              PERSONAL GOOGLE SHEET               │ │        PERSONAL GOOGLE DRIVE      │
│                                                  │ │                                   │
│  • "Wishes" Tab (10 Columns, Media URLs, Likes)  │ │  • Folder 1:                      │
│  • "Secret Wishes" Tab (Sealed Birthday Wishes)  │ │    "Eternal Love Wishes (Queen...)"│
│  • "Photos" Tab (8 Columns, Drive Links, Preview)│ │  • Folder 2:                      │
│    Formula: `=IMAGE("drive.google.com/...")`     │ │    "Eternal Love Memories (Ni...)"│
└──────────────────────────────────────────────────┘ └───────────────────────────────────┘
```

---

## 2. 🧩 Structural Component Inventory (Two-Tier Platform)

The platform comprises two primary HTML entry points:
1. **[index.html](file:///c:/Users/Himanshu/Documents/HTML/New%20folder/new/index.html)**: Pre-Launch Countdown & Early Birthday Blessing Hub with media uploads (photos & videos), dynamic sticky notes grid, full-screen Media Lightbox, and VIP virtual keypad (`2912` / `22092000`).
2. **[main.html](file:///c:/Users/Himanshu/Documents/HTML/New%20folder/new/main.html)**: Main Celebration Arena with Welcome Screen (`#introOverlay`), Passcode Lock (`#pagePasscodeOverlay`), 3D gift unboxing animation, and 25 handcrafted celebration stages (`#mainApp`).

| # | Section Anchor ID | Feature Module | Core Mechanics | Storage & Sync Endpoints |
| :-: | :--- | :--- | :--- | :--- |
| **0** | `#introOverlay` / `#pagePasscodeOverlay` | **Welcome Screen & 3D Unboxing** | 3D bouncing gift box, on-demand passcode overlay (`22092000`/`2912`), lid-opening physics, fanfare audio & confetti. | Session state |
| **1** | `#heroSec` | **Hero & Relationship Counter** | Live chronometer from Dec 29, 2025; interactive cheer buttons (`🥂 Cheers`, `💖 Infinite Love`). | `state.cheers`, `state.loves` |
| **2** | `#letterSec` | **Wax-Sealed Love Letter** | 3D crimson velvet envelope with crackable wax seal and typewriter text generator. | Static template with dynamic names |
| **3** | `#openWhenSec` | **"Open When..." Situation Envelopes** | 6 situation letters (*Miss Me, Stressful Day, Can't Sleep, Need A Smile, Feel Beautiful, Forever*). | `#openWhenLetterModal` |
| **4** | `#timelineSec` | **Milestone Journey Timeline** | Glowing vertical ribbon tracking 5 story chapters with badges and memories. | Static / DOM |
| **5** | `#cakeSec` | **3D Birthday Cake Ceremony** | 3-tier cake, candle blowout with audio puff and smoke particles, golden knife cake cutting. | `state.candlesLit` |
| **6** | `#cuddleSec` | **Cozy Starlit Cuddle Haven** | 3D animated sofa cuddle cinema, rhythmic breathing animation, camera switcher, fireside glow. | Real-time CSS 3D |
| **7** | `#jarSec` | **"100 Reasons Why I Love You" Jar** | Floating fireflies, 3D origami heart unfold, category filter pills (*Romance, Habits, Safe Haven, Queen*). | `state.reasonsExplored` |
| **8** | `#couponsSec` | **Redeemable Couple Love Coupons** | Perforated vouchers (*Massage, Breakfast, Movie Night, Shopping*), stamped `REDEEMED 💖`. | `state.claimedCoupons` in `localStorage` |
| **9** | `#bucketSec` | **Couple Bucket List Tracker** | Interactive dream checklist, progress fill bar, stats counter, custom dream submission form. | `state.completedBucketItems` |
| **10**| `#musicSec` | **Tri-Instrument Romantic Lounge** | Polyphonic Grand Piano (hotkeys `1-8`, `Q-U`), Acoustic Guitar (6 strummable strings, including 5th A2), Vintage Mixtape. | Web Audio API Polyphonic Synthesizer |
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
| **21**| `#rouletteSec` | **Date Night Fortune Roulette** | 3D spinning wheel with physics deceleration, custom date idea creator, voucher conversion. | In-memory + Coupons |
| **22**| `#soundscapeSec`| **Cosmic Ambient Soundscape** | 6-track Web Audio synthesizer (Rain, Fireplace, Ocean, Starlight, Lo-Fi Piano, Café) with sleep timer. | Web Audio API |
| **23**| `#capsuleSec` | **Future Love Time Capsule Vault** | Time-locked digital envelopes with live countdown padlocks and VIP Heart Key bypass. | In-memory state |
| **24**| `#journeySec` | **Our Cosmic Journey & Milestones** | Real-time orbital distance & heartbeat counter with interactive milestone pins. | In-memory state |

---

## 3. 🪟 Modal Architecture

The application contains **7 accessible modal dialogs** with keyboard accessibility and backdrop dismissals:
1. **`#vipModal`**: Virtual VIP keypad on `index.html` with romantic anniversary hints and numeric keyboard listener.
2. **`#mediaLightboxModal`**: Full-screen cinema lightbox for previewing wish photos and videos on `index.html`.
3. **`#pagePasscodeOverlay`**: Passcode lock overlay on `main.html` with 8-digit visual slots and numeric touch keypad.
4. **`#wishModal`**: Starry Time Capsule wish composer launched during candle blowout.
5. **`#customizeModal`**: Personalization control room for Celebrant Name, Theme, and Webhook URL.
6. **`#keepsakeModal`**: Royal Keepsake Love Certificate printable exporter.
7. **`#secretWishVaultModal`**: Secret Vault modal protected by PIN `2912` / `22092000` or Queen's Heart Key.

---

## 4. 💰 Procurement & Asset Inventory (Zero-Cost Architecture)

The entire architecture is designed with **$0.00 total cost of ownership (TCO)**, utilizing enterprise-grade free tiers without credit cards or monthly subscriptions:

| Component / Service | Chosen Provider | Enterprise Quota / Free Tier Limit | Estimated Project Usage | Monthly Cost |
| :--- | :--- | :--- | :--- | :---: |
| **Web Hosting & Edge CDN** | GitHub Pages (`.nojekyll` enabled) | 100 GB Bandwidth / month | ~500 MB / month | **$0.00** |
| **Serverless Backend** | Google Apps Script (GAS) | 20,000 executions / day | ~50–200 / day | **$0.00** |
| **Database Storage** | Google Sheets | 10,000,000 cells per spreadsheet | ~5,000 cells | **$0.00** |
| **Photo & Video Cloud Storage** | Google Drive | 15 GB Free per Google account | ~150 MB (wishes + photos) | **$0.00** |
| **Audio Synthesizer Engine**| Browser Native Web Audio API | Unlimited local device execution | 0 Network Bandwidth | **$0.00** |
| **Typography & Web Fonts** | Google Fonts CDN | Unlimited Global Delivery | Cached locally | **$0.00** |
| **Iconography** | FontAwesome 6 CDN | Unlimited Global Delivery | Cached locally | **$0.00** |
| **SSL Certificate** | GitHub Pages Fastly Edge SSL | Automatic Free SSL/TLS Renewal | 100% HTTPS Encrypted | **$0.00** |
| **Total Monthly Operating Cost** | | | | **$0.00 / mo** |

---

*Architectural Certification:* **100% Production Ready & Zero-Cost Certified** 👑💖
