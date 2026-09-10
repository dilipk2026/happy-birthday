# 03. System Architecture & Component Topology

> **Status**: `[VERIFIED]` • Production Baseline v3.0.0  
> **Architecture Pattern**: Pure Client-Side Jamstack + Serverless Cloud Micro-Backend  
> **Hosting & Infrastructure**: GitHub Pages (Static Delivery) + Google Apps Script Engine + Google Cloud Storage  

---

## 1. Architectural Philosophy & Overview

**Eternal Love** is engineered under a high-performance, zero-maintenance architectural philosophy. It delivers an ultra-luxurious, animated, and responsive web application without requiring traditional dedicated application servers (e.g., Node.js/Express, Python/Django) or paid database instances.

### Key Architectural Pillars
1. **Pure Native Browser Execution**: Leverages native browser capabilities (Web Audio API, Canvas 2D, CSS 3D matrix transformations, RequestAnimationFrame physics loops) for smooth 60 FPS animation.
2. **Serverless Dual-Storage Persistence**:
   - **Structured Data**: Real-time logging into Google Sheets (`"Wishes"`, `"Photos"`, `"Videos"` tabs).
   - **Binary Media Archival**: Direct ingestion of Base64 video/image data into Google Drive folder `"Eternal Love Wishes (Queen Nishika)"` with automated public streaming links.
3. **Optimistic Local Cache Hydration**: State is cached in browser `localStorage`, ensuring instant, zero-latency rendering on page refreshes and graceful offline degradation.

---

## 2. System Context Diagram (C4 Level 1)

```mermaid
C4Context
    title System Context Diagram for Eternal Love Celebration Platform

    Person(queen, "Queen Nishika 👑", "The Birthday Queen & Primary Celebrant")
    Person(dilip, "Dilip 💖", "Author, Sponsor & Royal Court Administrator")
    Person(guest, "Royal Guests / Well-Wishers 🌟", "Friends & Family submitting blessings")

    System(eternalLove, "Eternal Love Web Platform", "Client-side web app (index.html & main.html) with 25 celebration stages & Web Audio synthesizer")
    
    System_Ext(githubPages, "GitHub Pages CDN", "Serves static HTML5, CSS3, JS, SVG, and screenshot assets over HTTPS")
    System_Ext(appsScript, "Google Apps Script Engine", "Serverless Code.gs handling doGet (JSON/JSONP) and doPost webhooks")
    System_Ext(googleSheets, "Google Sheets", "Persistent tabular storage for Wishes, Photos, and Video dedications")
    System_Ext(googleDrive, "Google Drive Storage", "Cloud folder storing binary video files (MP4/WebM) and high-res photos")
    System_Ext(externalMedia, "YouTube / Vimeo CDNs", "External video streaming providers embedded via iframe")

    Rel(queen, eternalLove, "Unlocks with DOB 22092000 / PIN 2912, explores 25 stages, cuts cake, claims coupons")
    Rel(dilip, eternalLove, "Submits royal wishes, shares QR links, customizes anniversary params")
    Rel(guest, eternalLove, "Views countdown, submits sticky notes, uploads photos/videos")

    Rel(eternalLove, githubPages, "Loads HTML/CSS/JS/assets over HTTPS")
    Rel(eternalLove, appsScript, "Fetches cloud wishes via JSONP / Dispatches dedications via POST")
    Rel(appsScript, googleSheets, "Appends rows across Wishes, Photos, Videos tabs")
    Rel(appsScript, googleDrive, "Decodes Base64 and creates streamable files in 'Eternal Love Wishes'")
    Rel(eternalLove, externalMedia, "Streams responsive video players")
```

---

## 3. Component Architecture (C4 Level 2)

```mermaid
graph TB
    subgraph ClientBrowser ["Client Browser Environment"]
        subgraph StaticEntry ["Presentation Layer"]
            IndexHtml["index.html<br/>(Pre-Launch Countdown & VIP Gate)"]
            MainHtml["main.html<br/>(25 Celebration Stages & Unboxing)"]
            StyleCss["style.css<br/>(298KB Design System & 9 Themes)"]
        end

        subgraph CoreEngines ["Frontend Core Engines (script.js)"]
            Router["Launch & Security Router<br/>(Date check & PIN Gate)"]
            StateMgr["State Management Engine<br/>(LocalStorage Sync & Cache)"]
            AudioSynth["Web Audio API Synthesizer<br/>(Polyphonic Chime & Soundscapes)"]
            PhysicsEngine["Canvas 2D Physics Engine<br/>(Confetti, Stars, Roulette, Cake)"]
            MediaNormalizer["Universal Media Normalizer<br/>(Drive / YouTube / Base64)"]
            DomController["25 Celebration Stage Controllers<br/>(Jar, Letters, Timeline, Cake, etc.)"]
        end

        subgraph StorageLayer ["Client Storage Layer"]
            LS_State[("localStorage: eternal_love_bday_state_v2")]
            LS_Wishes[("localStorage: eternal_love_sticky_wishes_v3")]
            SS_Auth[("sessionStorage: eternal_love_vip_unlocked")]
        end
    end

    subgraph GoogleCloud ["Google Cloud Serverless Micro-Backend"]
        GAS["Google Apps Script (Code.gs)<br/>doGet / doPost Webhook Handler"]
        SheetWishes[("Sheet Tab: Wishes (10 Cols)")]
        SheetPhotos[("Sheet Tab: Photos (8 Cols)")]
        SheetVideos[("Sheet Tab: Videos (8 Cols)")]
        DriveFolder[("Drive Folder: 'Eternal Love Wishes (Queen Nishika)'")]
    end

    IndexHtml --> Router
    MainHtml --> Router
    Router --> StateMgr
    StateMgr <--> LS_State
    StateMgr <--> LS_Wishes
    Router <--> SS_Auth

    StateMgr --> DomController
    DomController --> AudioSynth
    DomController --> PhysicsEngine
    DomController --> MediaNormalizer

    MediaNormalizer -- "doPost (JSON Payload)" --> GAS
    MediaNormalizer -- "doGet (JSONP Callback)" --> GAS

    GAS --> SheetWishes
    GAS --> SheetPhotos
    GAS --> SheetVideos
    GAS --> DriveFolder
```

---

## 4. Frontend Architecture Details

### 4.1 Modularity & Separation of Concerns
- **`index.html` (144KB)**: Self-contained pre-launch portal containing inline luxury styling for instant zero-FOUC (Flash of Unstyled Content) initial render, particle canvas background, and the pre-launch wish wall.
- **`main.html` (198KB)**: Master DOM document housing all 25 celebration stages, modals, audio control docks, and unboxing overlays.
- **`style.css` (298KB)**: Comprehensive design token system featuring CSS Custom Properties (`--primary-pink`, `--accent-gold`, `--royal-purple`), 9 atmospheric theme classes, CSS 3D perspective cards, and mobile media queries.
- **`script.js` (323KB)**: Monolithic, highly optimized JavaScript engine orchestrating state persistence, canvas physics loops, polyphonic Web Audio generation, and cloud sync.

### 4.2 State Management Architecture
The client application implements a unified reactive-like state store:
```javascript
const state = {
  recipientName: 'Nishika',
  senderName: 'Dilip',
  startDate: '2025-12-29',
  message: '...',
  theme: 'theme-magical',
  isMusicPlaying: false,
  musicMode: 'piano',
  candlesLit: true,
  poppedCount: 0,
  cheers: 128,
  loves: 256,
  reasonsExplored: 1,
  claimedCoupons: [],
  pinnedWishes: [],
  uploadedPhotos: [],
  secretWish: '',
  soundscapeVolumes: { master: 80, rain: 70, fire: 45, ocean: 0, chimes: 60, piano: 50, cafe: 0 },
  timeCapsules: [],
  customJourneyPins: [],
  googleSheetUrl: '...'
};
```
Every mutation triggers `saveState()` which safely syncs to `localStorage` with quota overflow handling.

---

## 5. Backend & Cloud Integration Architecture

### 5.1 Google Apps Script Serverless Service (`Code.gs`)
`Code.gs` acts as the cloud micro-backend executing within Google's V8 runtime:
- **`doGet(e)`**:
  - Serves structured JSON or JSONP containing persisted dedications.
  - Automatically formats Google Drive IDs into high-res CDN thumbnails (`drive.google.com/thumbnail?id=...&sz=w1000`) for images and streaming preview endpoints (`drive.google.com/file/d/.../preview`) for videos.
  - Sanitizes dead `blob:` strings.
- **`doPost(e)`**:
  - Parses incoming JSON payload from `index.html` and `main.html`.
  - Dispatches Base64 video data to `saveBase64ToDrive()`, generating binary MP4/WebM files in Queen Nishika's Google Drive folder with public view permissions.
  - Logs 10-column tabular rows into `"Wishes"` and cross-logs attachments into `"Photos"` and `"Videos"` tabs.

---

## 6. Security Boundaries & Data Isolation

```mermaid
flowchart LR
    subgraph PublicInternet ["Public Internet (Untrusted)"]
        GuestUser["Guest Visitor"]
    end

    subgraph SecurityBoundary1 ["Launch Router Boundary"]
        DateCheck["Target Launch Date Check<br/>(2026-09-21T23:00 IST)"]
        PinCheck["VIP PIN Gatekeeper<br/>(PIN: 2912 / DOB: 22092000)"]
    end

    subgraph SecurityBoundary2 ["Client Execution Sandbox"]
        XssFilter["DOM String Sanitizer<br/>(escapeHtml)"]
        MemoryStore["In-Memory Audio & State"]
        LocalStorageSandboxed["Origin-Isolated LocalStorage"]
    end

    subgraph SecurityBoundary3 ["Cloud Integration Boundary"]
        GasEndpoint["Google Apps Script Webhook<br/>(Anonymous execute / Owner storage)"]
        GoogleDriveIsolated["Google Drive Folder<br/>(Isolated namespace)"]
    end

    GuestUser --> DateCheck
    DateCheck -- "Before Launch Date" --> PinCheck
    PinCheck -- "Valid PIN" --> SecurityBoundary2
    PinCheck -- "Invalid PIN" --> IndexPortal["index.html (Public View)"]
    IndexPortal --> XssFilter
    SecurityBoundary2 --> GasEndpoint
    GasEndpoint --> GoogleDriveIsolated
```
