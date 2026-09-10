# System Architecture Diagrams — Eternal Love (Queen Nishika Birthday Portal)

---

## 1. System Context Diagram (C4 Level 1)

[VERIFIED] The following Mermaid diagram illustrates the high-level actors, external cloud ecosystems, and core system boundaries of the **Eternal Love** application.

```mermaid
C4Context
    title System Context Diagram - Eternal Love Birthday Portal

    Person(nishika, "Queen Nishika", "The Royal Celebrant interacting with unboxing, love letters, games, and memories.")
    Person(dilip, "Dilip", "The Dedicator & Admin managing telemetry, secrets, and cloud synchronization.")
    Person(guests, "Well-Wishers / Guests", "Friends submitting sticky notes and multimedia video/photo wishes.")

    Enterprise_Boundary(b0, "Eternal Love System Ecosystem") {
        System(portal, "Eternal Love Web Portal", "Static Single-Page Application (HTML5 / Vanilla CSS3 / Modern ES6 JS) hosted on CDN / GitHub Pages.")
    }

    System_Ext(google_apps_script, "Google Apps Script Serverless Engine", "Handles incoming webhooks (doPost), Base64 decoding, file streaming, and JSONP wish endpoints.")
    System_Ext(google_drive, "Google Drive Storage", "Cloud Blob storage folder 'Eternal Love Wishes (Queen Nishika)' hosting multimedia MP4/JPEG uploads.")
    System_Ext(google_sheets, "Google Sheets Database", "Tabular database storing Wishes, Telemetry, and VIP Guest records.")

    Rel(nishika, portal, "Unboxes gift, enters birthday passcode, views memories & audio", "HTTPS / Browser")
    Rel(dilip, portal, "Enters VIP PIN 2912, accesses telemetry, triggers sync", "HTTPS / Browser")
    Rel(guests, portal, "Submits multimedia wishes & attaches Base64 videos", "HTTPS / Browser")

    Rel(portal, google_apps_script, "Dispatches Base64 wishes & fetches JSONP data", "HTTPS / REST Webhook")
    Rel(google_apps_script, google_drive, "Creates files, sets public view permissions, generates preview URLs", "Google Apps Script DriveApp API")
    Rel(google_apps_script, google_sheets, "Appends wish row with timestamp, author, message, and media URL", "Google Apps Script SpreadsheetApp API")
```

---

## 2. Component Architecture Diagram (C4 Level 2)

```mermaid
flowchart TB
    subgraph Client["Client Browser (Desktop & Mobile)"]
        direction TB
        subgraph UI["Presentation Layer (HTML5 & CSS3)"]
            INDEX["index.html (Stage 1 Landing & Lock)"]
            MAIN["main.html (Stage 2 Celebration Portal)"]
            CSS["style.css (Design System, 3D Parallax, Dark Theme)"]
        end

        subgraph CoreJS["Application Engine (script.js)"]
            ROUTER["State & Stage Router (Stage 1 / 2)"]
            AUTH["Dual-Layer Auth Engine (PIN 2912 / Passcode 22092000)"]
            AUDIO["Web Audio Synthesizer (Oscillators, Chords, Chimes)"]
            COUNTDOWN["Countdown & Multi-Timezone Clock Engine"]
            CANVAS1["Heart Particle Canvas Animation Engine"]
            CANVAS2["Fireworks Simulation Canvas Engine"]
            WISH["Wish Wall & Base64 Media Encoder"]
            GAMES["Interactive Games (Mirror, Cake, Letters)"]
        end

        subgraph LocalStorageEngine["Client Storage Subsystem"]
            LS["Browser LocalStorage (nsh_unlocked, nsh_wishes, nsh_audio)"]
        end
    end

    subgraph GoogleCloud["Google Cloud / Workspace Ecosystem"]
        direction TB
        WEBHOOK["Google Apps Script (Code.gs Webhook Endpoint)"]
        DRIVE["Google Drive Folder ('Eternal Love Wishes (Queen Nishika)')"]
        SHEETS["Google Sheets ('Wishes', 'Telemetry', 'VIP Guests')"]
    end

    INDEX --> ROUTER
    MAIN --> ROUTER
    ROUTER --> AUTH
    ROUTER --> COUNTDOWN
    ROUTER --> CANVAS1
    ROUTER --> AUDIO
    ROUTER --> GAMES
    ROUTER --> WISH

    AUTH --> LS
    WISH --> LS
    AUDIO --> LS

    WISH -- "POST Base64 Payload" --> WEBHOOK
    WEBHOOK -- "Save Binary File" --> DRIVE
    DRIVE -- "Return Stream URL" --> WEBHOOK
    WEBHOOK -- "Append Row" --> SHEETS
    WEBHOOK -. "JSONP Wish Sync" .-> WISH
```

---

## 3. Security Boundary & Data Trust Zone Model

```mermaid
flowchart LR
    subgraph PublicZone["Public / Guest Zone (Untrusted)"]
        GUEST_INPUT["Guest Wish Form Input (Name, Message, Attached Media)"]
    end

    subgraph ClientSanitizationZone["Client-Side Sanitization Boundary"]
        SANITIZER["escapeHTML() DOM XSS Sanitizer"]
        B64_ENCODER["FileReader Base64 Encoder & MIME Validator"]
    end

    subgraph VIPZone["Privileged VIP Zone (Passcode Protected)"]
        PIN_GUARD["Passcode Verification (2912 / 22092000)"]
        ADMIN_PANEL["Admin Telemetry & Reset Modals"]
    end

    subgraph ServerlessZone["Google Cloud Execution Boundary"]
        GAS_GUARD["doPost() Payload Parser & Exception Shield"]
        DRIVE_STORAGE["Google Drive Folder (Public Embed Link Generation)"]
        SHEET_STORAGE["Google Sheets Append Transaction"]
    end

    GUEST_INPUT --> SANITIZER
    GUEST_INPUT --> B64_ENCODER
    SANITIZER --> GAS_GUARD
    B64_ENCODER --> GAS_GUARD

    PIN_GUARD --> ADMIN_PANEL

    GAS_GUARD --> DRIVE_STORAGE
    GAS_GUARD --> SHEET_STORAGE
```

---

## 4. Deployment Topology Diagram

```mermaid
flowchart TD
    subgraph EdgeDelivery["Edge Distribution Layer"]
        CDN["GitHub Pages / Global Edge CDN"]
        STATIC_REPO["Static Source Code Repository (HTML/CSS/JS/Assets)"]
        STATIC_REPO --> CDN
    end

    subgraph EndUserDevices["End-User Client Devices"]
        DESKTOP["Desktop Browser (Chrome/Firefox/Edge 1920x1080)"]
        IPHONE["Mobile iOS Safari (iPhone 14/15/SE 375-390px)"]
        ANDROID["Mobile Android Chrome (Samsung/Pixel 360-414px)"]
    end

    subgraph CloudBackend["Google Cloud Services"]
        APPS_SCRIPT["Google Apps Script Execution Cluster"]
        GOOGLE_DRIVE["Google Drive Storage Cluster"]
        GOOGLE_SHEETS["Google Sheets Tabular Database"]
    end

    CDN --> DESKTOP
    CDN --> IPHONE
    CDN --> ANDROID

    DESKTOP -- "HTTPS REST / JSONP" --> APPS_SCRIPT
    IPHONE -- "HTTPS REST / JSONP" --> APPS_SCRIPT
    ANDROID -- "HTTPS REST / JSONP" --> APPS_SCRIPT

    APPS_SCRIPT --> GOOGLE_DRIVE
    APPS_SCRIPT --> GOOGLE_SHEETS
```
