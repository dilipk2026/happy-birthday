# Sequence Diagrams — Eternal Love (Queen Nishika Birthday Portal)

---

## 1. End-to-End Unboxing & Passcode Authentication Flow

[VERIFIED] The sequence below details Queen Nishika's unboxing interaction on `index.html` through passcode entry and transition to `main.html`.

```mermaid
sequenceDiagram
    autonumber
    actor Nishika as Queen Nishika 👑
    participant Browser as Browser UI (DOM)
    participant Engine as Script.js Engine
    participant Audio as Web Audio Synth
    participant Storage as Browser LocalStorage

    Nishika->>Browser: Loads Portal Landing Page (index.html)
    Browser->>Engine: DOMContentLoaded event fired
    Engine->>Storage: Check localStorage('nishika_portal_unlocked')
    alt If already unlocked
        Storage-->>Engine: Returns 'true'
        Engine->>Browser: Auto-redirect to main.html
    else First-time visitor
        Storage-->>Engine: Returns null / 'false'
        Engine->>Browser: Render 3D Gift Box & Starlight Canvas
    end

    Nishika->>Browser: Clicks "Tap to Open My Gift 🎁"
    Browser->>Engine: handleGiftUnbox() triggered
    Engine->>Audio: resume() & triggerUnboxChimes()
    Audio-->>Nishika: Polyphonic celebratory chimes sound
    Engine->>Browser: Play 3D Lid Open Animation & Heart Canvas Burst
    Engine->>Browser: Display Countdown & Stage 2 Passcode Modal

    Nishika->>Browser: Enters Birthday Passcode ("22092000")
    Browser->>Engine: verifyPasscode("22092000")
    alt Correct Passcode ("22092000")
        Engine->>Storage: setItem('nishika_portal_unlocked', 'true')
        Engine->>Browser: Play Success Sound & Fade In Transition
        Engine->>Browser: window.location.href = 'main.html'
    else Invalid Passcode
        Engine->>Browser: Trigger CSS Shake Animation & Error Toast
    end
```

---

## 2. Multimedia Wish Submission & Google Cloud Sync Sequence

```mermaid
sequenceDiagram
    autonumber
    actor Guest as Well-Wisher / Guest
    participant Form as Wish Form (DOM)
    participant Encoder as Base64 FileReader Engine
    participant Wall as Sticky Wish Wall
    participant Storage as LocalStorage
    participant Webhook as Google Apps Script (Code.gs)
    participant Drive as Google Drive Storage
    participant Sheets as Google Sheets Database

    Guest->>Form: Enters Name, Wish Message, and selects MP4 Video
    Guest->>Form: Clicks "Submit Royal Wish ✨"
    Form->>Encoder: readAsDataURL(videoFile)
    Encoder-->>Form: Returns Base64 String ("data:video/mp4;base64,...")
    
    Form->>Wall: Optimistically pin temporary sticky note
    Form->>Storage: Save wish item (clean data, no ephemeral blob URLs)
    
    Form->>Webhook: POST Base64 Payload via fetch(mode: 'no-cors')
    activate Webhook
    Webhook->>Webhook: Utilities.base64Decode(data)
    Webhook->>Drive: DriveApp.createFile(videoBlob) in Folder
    Drive->>Drive: setSharing(ANYONE_WITH_LINK, VIEW)
    Drive-->>Webhook: Returns File ID & Stream URL
    Webhook->>Sheets: SpreadsheetApp.appendRow([Timestamp, Name, Message, StreamURL])
    Sheets-->>Webhook: Transaction Committed
    deactivate Webhook
    
    Form-->>Guest: Displays "Wish Saved to Cloud ✨" Notification Toast
```

---

## 3. Web Audio Polyphonic Synthesizer Generation Sequence

```mermaid
sequenceDiagram
    autonumber
    actor User as User / Celebrant
    participant Browser as Browser DOM Event
    participant Synth as Web Audio Engine (script.js)
    participant Ctx as AudioContext Subsystem
    participant MasterGain as Master GainNode
    participant Node1 as OscillatorNode (Note 1)
    participant Node2 as OscillatorNode (Note 2)
    participant Dest as AudioDestination (Speakers)

    User->>Browser: Clicks anywhere on screen / Unboxes Gift
    Browser->>Synth: initAudioEngine()
    Synth->>Ctx: new AudioContext() / resume()
    Synth->>MasterGain: createGain() with volume = 0.5
    MasterGain->>Dest: connect(destination)

    Synth->>Node1: createOscillator(type: 'sine', freq: 523.25 Hz / C5)
    Synth->>Node2: createOscillator(type: 'triangle', freq: 659.25 Hz / E5)
    Node1->>MasterGain: connect(gainNode)
    Node2->>MasterGain: connect(gainNode)

    Synth->>Node1: start(now) -> stop(now + 1.2s)
    Synth->>Node2: start(now + 0.1s) -> stop(now + 1.2s)
    Node1-->>Dest: Synthesized audio waves output
    Node2-->>Dest: Synthesized audio waves output
    Note over Synth,Dest: Envelope decay applies linearRampToValueAtTime(0.001)
```

---

## 4. VIP Dedicator Admin Authentication Sequence

```mermaid
sequenceDiagram
    autonumber
    actor Dilip as Dilip (Dedicator) 💖
    participant AdminModal as Secret Admin Modal
    participant AuthGuard as Script.js Auth Guard
    participant Telemetry as Telemetry Display Panel
    participant Cloud as Google Apps Script JSONP

    Dilip->>AdminModal: Enters VIP Anniversary PIN ("2912")
    AdminModal->>AuthGuard: checkVIPClearance("2912")
    alt Valid PIN ("2912")
        AuthGuard->>Telemetry: Reveal Sync Controls & Google Spreadsheet Link
        AuthGuard->>Cloud: Request latest cloud telemetry & wish count
        Cloud-->>Telemetry: Returns live wish count & sync timestamp
        Telemetry-->>Dilip: Displays "VIP Access Granted — Cloud Linked"
    else Invalid PIN
        AuthGuard->>AdminModal: Shake input & clear digits
    end
```
