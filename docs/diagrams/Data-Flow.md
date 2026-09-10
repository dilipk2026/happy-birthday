# Data Flow Diagrams (DFD) — Eternal Love (Queen Nishika Birthday Portal)

---

## 1. Level 0 Context DFD

[VERIFIED] The Level 0 DFD defines the information exchange between external actors (Celebrant, Dedicator, Guests) and the **Eternal Love** core system.

```mermaid
flowchart TD
    NISHIKA["Celebrant (Queen Nishika)"]
    DILIP["Dedicator / Admin (Dilip)"]
    GUESTS["Well-Wishers / Guests"]

    PORTAL(["Eternal Love Core System (Client + Apps Script)"])

    SHEETS[("Google Sheets Database")]
    DRIVE[("Google Drive Storage")]
    LS[("Browser LocalStorage")]

    NISHIKA -- "1. Enters Birthday Passcode (22092000)<br>2. Triggers Unboxing / Games" --> PORTAL
    PORTAL -- "3. Streams Audio, Photos, Letters, Wishes" --> NISHIKA

    DILIP -- "1. Enters VIP PIN (2912)<br>2. Manages Cloud Sync" --> PORTAL
    PORTAL -- "3. Displays Telemetry & Sync Status" --> DILIP

    GUESTS -- "1. Submits Wish Text + Video/Photo Blob" --> PORTAL
    PORTAL -- "2. Confirms Submission Toast" --> GUESTS

    PORTAL -- "Persists Local Wishes & Auth State" --> LS
    LS -- "Loads Cached Wishes & Stage" --> PORTAL

    PORTAL -- "Appends Wish & Telemetry Rows" --> SHEETS
    SHEETS -- "Returns Wishes via JSONP" --> PORTAL

    PORTAL -- "Uploads Base64 Media Blobs" --> DRIVE
    DRIVE -- "Returns Public Embed Preview URL" --> PORTAL
```

---

## 2. Level 1 Detailed Data Flow Diagram

```mermaid
flowchart LR
    subgraph InputSources["Input Process"]
        P1["User Input: Text Form"]
        P2["File Picker: Media File (MP4/JPG)"]
        P3["Passcode Prompt: 8-digit PIN"]
    end

    subgraph TransformationPipeline["Client Transformation & Validation"]
        SAN["escapeHTML() String Sanitizer"]
        ENC["FileReader.readAsDataURL() Base64 Encoder"]
        AUTH_VAL["Passcode Match Engine"]
    end

    subgraph StateAndStorage["Storage & Cloud Dispatch"]
        LS_STORE[("LocalStorage (Client)")]
        POST_REQ["fetch(webhook, {mode: 'no-cors'})"]
        GAS_EXEC["Google Apps Script doPost()"]
        DRIVE_STORE[("Google Drive Folder")]
        SHEET_STORE[("Google Sheets")]
    end

    P1 --> SAN
    P2 --> ENC
    P3 --> AUTH_VAL

    SAN --> LS_STORE
    SAN --> POST_REQ

    ENC --> POST_REQ
    AUTH_VAL --> LS_STORE

    POST_REQ --> GAS_EXEC
    GAS_EXEC --> DRIVE_STORE
    DRIVE_STORE --> GAS_EXEC
    GAS_EXEC --> SHEET_STORE
```

---

## 3. Video Wish Upload & Cloud Sync Data Flow

```mermaid
flowchart TD
    START(["User selects MP4 video on Wish Form"])
    READ["FileReader reads file as Base64 Data URL"]
    PAYLOAD["Construct JSON Payload with name, message, fileData, mimeType"]
    OPT_UI["Optimistically render local preview on Wish Wall"]
    CACHE_LS["Cache clean object in LocalStorage (No raw blob: URLs)"]
    DISPATCH["Dispatch POST request to Google Apps Script Webhook"]
    GAS_RECV["Google Apps Script receives Base64 payload"]
    GAS_DECODE["Utilities.base64Decode(data) into Byte Blob"]
    GAS_DRIVE["DriveApp.createFile(blob) in 'Eternal Love Wishes (Queen Nishika)'"]
    GAS_PERM["File.setSharing(Access.ANYONE_WITH_LINK, Permission.VIEW)"]
    GAS_URL["Generate permanent stream URL: https://drive.google.com/file/d/ID/preview"]
    GAS_SHEET["SpreadsheetApp appends row with timestamp, author, message, stream URL"]
    SUCCESS(["Permanent Cloud Link active & streamable across all devices"])

    START --> READ --> PAYLOAD --> OPT_UI --> CACHE_LS --> DISPATCH --> GAS_RECV --> GAS_DECODE --> GAS_DRIVE --> GAS_PERM --> GAS_URL --> GAS_SHEET --> SUCCESS
```
