# 📜 Software Requirements Specification (SRS) — Eternal Love Web Application

```
===============================================================================
SOFTWARE REQUIREMENTS SPECIFICATION (IEEE-830 COMPLIANT)
Project: Eternal Love — Ultra-Luxurious Romantic Birthday Celebration
System Identifier: EL-PROD-2026-V2
Celebrant: Queen Komal 👑 | Stakeholder: Dilip 💖
Standard: IEEE Std 830-1998 (Recommended Practice for Software Requirements)
===============================================================================
```

---

## 📑 Table of Contents

1. [📌 1. Introduction](#1-introduction)
   - [1.1 Purpose](#11-purpose)
   - [1.2 Document Conventions](#12-document-conventions)
   - [1.3 Intended Audience](#13-intended-audience)
   - [1.4 Project Scope](#14-project-scope)
   - [1.5 References](#15-references)
2. [🌐 2. Overall Description](#2-overall-description)
   - [2.1 Product Perspective](#21-product-perspective)
   - [2.2 Product Functions](#22-product-functions)
   - [2.3 User Classes and Characteristics](#23-user-classes-and-characteristics)
   - [2.4 Operating Environment](#24-operating-environment)
   - [2.5 Design and Implementation Constraints](#25-design-and-implementation-constraints)
   - [2.6 Assumptions and Dependencies](#26-assumptions-and-dependencies)
3. [⚙️ 3. Specific Functional Requirements](#3-specific-functional-requirements)
   - [3.1 Module 1: State Engine & Persistence (FR-01 to FR-03)](#31-module-1-state-engine--persistence)
   - [3.2 Module 2: Visual Canvas & Particle Physics (FR-04 to FR-06)](#32-module-2-visual-canvas--particle-physics)
   - [3.3 Module 3: Polyphonic Web Audio Engine (FR-07 to FR-09)](#33-module-3-polyphonic-web-audio-engine)
   - [3.4 Module 4: 3D Cake Cutting Ceremony (FR-10 to FR-12)](#34-module-4-3d-cake-cutting-ceremony)
   - [3.5 Module 5: 100+ Reasons Love Jar (FR-13 to FR-15)](#35-module-5-100-reasons-love-jar)
   - [3.6 Module 6: 3D Memory Scrapbook & Drive Sync (FR-16 to FR-18)](#36-module-6-3d-memory-scrapbook--drive-sync)
   - [3.7 Module 7: Secret Vault Security (FR-19 to FR-21)](#37-module-7-secret-vault-security)
   - [3.8 Module 8: Live Cloud Guestbook (FR-22 to FR-25)](#38-module-8-live-cloud-guestbook)
4. [🛡️ 4. Non-Functional Requirements (NFR)](#4-non-functional-requirements-nfr)
   - [4.1 Performance Requirements](#41-performance-requirements)
   - [4.2 Safety & Security Requirements](#42-safety--security-requirements)
   - [4.3 Software Quality Attributes](#43-software-quality-attributes)
5. [🔄 5. System Data Flow & State Transitions](#5-system-data-flow--state-transitions)
6. [✅ 6. Verification & Traceability Matrix](#6-verification--traceability-matrix)

---

## 1. 📌 Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) establishes the complete functional and non-functional requirements for the **Eternal Love** romantic celebration web application (Release v2.0.0). It defines system behavior, interfaces, hardware/software constraints, and verification criteria for developers, designers, and quality assurance personnel.

### 1.2 Document Conventions
* **FR-xx**: Functional Requirement identifier.
* **NFR-xx**: Non-Functional Requirement identifier.
* **SHALL / MUST**: Mandatory system behavior.
* **SHOULD**: Highly recommended behavior.
* **MAY**: Optional capability.

### 1.3 Intended Audience
* **Primary Stakeholder & Celebrant**: Queen Komal 👑 & Dilip 💖
* **Software Engineers & Maintainers**: Full-stack web engineers maintaining the client and cloud pipelines.
* **QA & Test Automation Engineers**: Reviewing test plans against functional requirements.

### 1.4 Project Scope
The Eternal Love system is a zero-dependency, static progressive web application engineered to deliver an emotional, animated, and interactive birthday celebration experience. It features real-time relationship chronometers, 3D interactive physics stages, real-time audio synthesis, encrypted secret vaults, and a serverless Google Cloud synchronization pipeline.

### 1.5 References
* IEEE Std 830-1998: IEEE Recommended Practice for Software Requirements Specifications.
* W3C Web Audio API Specification (W3C Working Draft).
* ECMAScript 2023 (ES14) Language Specification.
* W3C HTML5 & CSS3 Standard Recommendations.

---

## 2. 🌐 Overall Description

### 2.1 Product Perspective
Eternal Love operates as an autonomous, client-first web application deployed on high-speed global static edge CDNs (GitHub Pages / Vercel / Netlify) backed by an asynchronous Google Apps Script webhook integration.

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT TIER (HTML5/CSS3/ES6)           │
│  ┌──────────────────┐  ┌──────────────────┐  ┌───────────┐  │
│  │ Web Audio Engine │  │ Canvas Particles │  │ UI Engine │  │
│  └────────┬─────────┘  └────────┬─────────┘  └─────┬─────┘  │
└───────────┼─────────────────────┼──────────────────┼────────┘
            │                     │                  │
            ▼                     ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│                 LOCAL STORAGE CACHE LAYER                   │
└─────────────────────────────┬───────────────────────────────┘
                              │ HTTPS POST (mode: no-cors)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│         SERVERLESS GOOGLE APPS SCRIPT WEBHOOK ENGINE        │
│          ┌───────────────────┐  ┌───────────────────┐       │
│          │   Google Sheets   │  │   Google Drive    │       │
│          │  (Structured DB)  │  │  (Binary Storage) │       │
│          └───────────────────┘  └───────────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Product Functions
* Real-time chronometer calculation from relationship inception (2025-12-29).
* Interactive 3D birthday cake cutting and candle extinguishing with particle physics.
* Interactive 100+ Love Reason generator with category indexing and favoriting.
* Interactive 3D Polaroid photo album with image upload and Google Drive storage.
* Passcode-secured (PIN: `2912` / Queen Bypass) secret vault.
* Polyphonic algorithmic sound synthesis (Chopin Nocturne, Birthday Fanfare, Acoustic Guitar, Fireplace crackle).
* Live cloud guestbook synchronized to Google Sheets in real-time.

### 2.3 User Classes and Characteristics
1. **The Queen (Komal)**: Primary user, recipient of dedicated love notes, unlocked bypass keys, personalized messages, and love coupons.
2. **The Creator (Dilip)**: Primary author, administrator of Google Cloud databases, sender of custom letters and promises.
3. **Celebration Guests**: Friends and family viewing the celebration and writing public birthday wishes on the guestbook.

### 2.4 Operating Environment
* **Browsers**: Google Chrome 90+, Apple Safari 14+, Mozilla Firefox 88+, Microsoft Edge 90+, Mobile Safari / Chrome.
* **Display Range**: 320px (iPhone SE) to 3840px (4K UHD TV/Monitor).
* **Network**: 100% functional offline with local persistence; synchronizes when connected to Internet.

### 2.5 Design and Implementation Constraints
* **Zero External JS/CSS Frameworks**: No React, Vue, Angular, jQuery, Tailwind, or Bootstrap to ensure zero bundle bloat and guaranteed perpetual stability.
* **Serverless Cost Constraint**: Total operational cost MUST remain $0.00 forever.
* **Payload Limit**: Base64 photo payloads MUST be downscaled on the client before transmission to remain under 10MB.

---

## 3. ⚙️ Specific Functional Requirements

### 3.1 Module 1: State Engine & Persistence
* **FR-01 (Local State Initialization)**: The system SHALL initialize user state from `localStorage` under the key `eternal_love_bday_state_v2`.
* **FR-02 (URL Query Override)**: The system SHALL parse URL query parameters (`name`, `sender`, `date`, `msg`, `theme`, `sheet`) to override default state variables dynamically.
* **FR-03 (Auto-Serialization)**: The system SHALL serialize all state modifications immediately to prevent data loss on page refresh.

### 3.2 Module 2: Visual Canvas & Particle Physics
* **FR-04 (Celestial Canvas)**: The system SHALL render a dynamic HTML5 Canvas background supporting floating heart particles, shooting stars, and ambient fireflies at 60 FPS.
* **FR-05 (Confetti Cannon)**: The system SHALL trigger full-screen randomized physics confetti upon cake cutting, wish submission, and milestone completions.
* **FR-06 (Theme Dynamic Switcher)**: The system SHALL support 6 distinct CSS token themes without reloading the DOM.

### 3.3 Module 3: Polyphonic Web Audio Engine
* **FR-07 (Autoplay Compliance)**: The system SHALL initialize the `AudioContext` in a suspended state and resume immediately upon first user interaction.
* **FR-08 (Synthesizer Melodies)**: The system SHALL generate polyphonic frequencies with ADSR envelopes for *Chopin Nocturne*, *Happy Birthday*, and *Acoustic Guitar*.
* **FR-09 (Fireplace Brown Noise)**: The system SHALL generate algorithmic procedural brown noise to simulate realistic crackling fire embers in Cuddle Haven.

### 3.4 Module 4: 3D Cake Cutting Ceremony
* **FR-10 (Candle Extinguishing)**: The system SHALL extinguish candle flame animations and emit smoke particles when clicked or when the "Blow Candles" trigger is pressed.
* **FR-11 (Knife Drag & Slicing)**: The system SHALL animate the golden engraved cake knife cutting through the cake frosting along the Y-axis.
* **FR-12 (Fanfare & Audio Sync)**: The system SHALL play a celebratory arpeggio chime and trigger confetti upon ceremony completion.

### 3.5 Module 5: 100+ Reasons Love Jar
* **FR-13 (Random Reason Draw)**: The system SHALL randomly draw a reason note from the active filtered pool upon tapping the jar.
* **FR-14 (Category Filtering)**: The system SHALL filter reasons across 5 categories: Romance, Queen Vibes, Little Things, Brilliance, and Shared Memories.
* **FR-15 (Favorites Bookmarking)**: The system SHALL allow users to bookmark reasons to an in-memory and persisted favorites collection.

### 3.6 Module 6: 3D Memory Scrapbook & Drive Sync
* **FR-16 (3D Perspective Tilt & Flip)**: The system SHALL tilt Polaroid cards on hover/touch and flip 180 degrees to display handwritten captions.
* **FR-17 (Client-Side Compression)**: The system SHALL downscale user-uploaded images to a maximum dimension of 1280px via HTML5 Canvas before Base64 encoding.
* **FR-18 (Cloud Asset Synchronization)**: The system SHALL send compressed photo payloads to Google Apps Script for storage in Google Drive.

### 3.7 Module 7: Secret Vault Security
* **FR-19 (PIN Verification)**: The system SHALL require the 4-digit PIN `2912` to unlock the Secret Vault.
* **FR-20 (Biometric Bypass)**: The system SHALL provide a single-tap "Queen's Heart Key" bypass button for immediate access.
* **FR-21 (Secret Wish Sealing)**: The system SHALL accept and seal Queen Komal's secret birthday wish, dispatching it to the `"Secret Wishes"` ledger.

### 3.8 Module 8: Live Cloud Guestbook
* **FR-22 (Wish Submission)**: The system SHALL accept visitor name, message, and color theme selection.
* **FR-23 (Instant Optimistic UI)**: The system SHALL render the new wish card to the DOM immediately with confetti animation prior to network confirmation.
* **FR-24 (Cloud Webhook Dispatch)**: The system SHALL execute an asynchronous HTTPS POST to Google Apps Script with `mode: 'no-cors'`.
* **FR-25 (Local Fallback)**: If network connectivity fails, the system SHALL store the wish locally and display an offline synchronization status chip.

### 3.9 Module 9: Automated Launch Gate & Pre-Launch Teaser
* **FR-26 (Pre-Launch Dynamic Router)**: The system SHALL evaluate client time on root initialization and redirect traffic to `coming-soon.html` if `Date.now() < 2026-09-20T00:00:00+05:30` unless a verified VIP bypass token is present.
* **FR-27 (VIP Early Access Bypass)**: The system SHALL permit immediate access to `index.html` upon entering PIN `2912` or tapping the Queen's Heart Key on the Coming Soon page, caching authorization in `sessionStorage` and `localStorage`.
* **FR-28 (Post-Launch Auto Handover)**: On or after September 20, 2026, the system SHALL automatically serve `index.html` as the default primary stage without requiring manual server redeployment.

---

## 4. 🛡️ Non-Functional Requirements (NFR)

### 4.1 Performance Requirements
* **NFR-01 (Frame Rate)**: All canvas particles, 3D CSS transforms, and scroll transitions SHALL maintain $\ge 58\text{ FPS}$ on standard mobile and desktop hardware.
* **NFR-02 (Bundle Size & Load Time)**: Initial DOM Content Loaded SHALL occur in under $350\text{ ms}$ on 4G networks (Total uncompressed assets $< 600\text{ KB}$).
* **NFR-03 (Zero Dependencies)**: The runtime SHALL require zero external NPM dependencies, script tags, or foreign CDN libraries.

### 4.2 Safety & Security Requirements
* **NFR-04 (Sanitization)**: All user-submitted text SHALL be HTML entity escaped to prevent Cross-Site Scripting (XSS).
* **NFR-05 (Zero Token Exposure)**: The client application SHALL NOT contain or expose any private API tokens, private keys, or service account credentials.
* **NFR-06 (Privacy Commitment)**: The application SHALL NOT include third-party tracking scripts, advertising pixels, or telemetry beacons.

### 4.3 Software Quality Attributes
* **NFR-07 (Responsiveness)**: The layout SHALL adapt flawlessly across viewports from $320\text{ px}$ to $3840\text{ px}$ width with $0\text{ px}$ horizontal overflow.
* **NFR-08 (Accessibility)**: Text contrast SHALL comply with WCAG 2.1 Level AA standards across all 6 selectable themes.
* **NFR-09 (Reliability & Fault Tolerance)**: Network failures SHALL NOT block or degrade any client-side interactive feature.

---

## 5. 🔄 System Data Flow & State Transitions

```
[ User Interaction ] 
       │
       ▼
[ Event Listener Controller ]
       │
       ├─► [ Synthesizer Audio Trigger ] ──► [ AudioContext DAC ]
       ├─► [ DOM Renderer / Canvas ]     ──► [ Viewport Display (60 FPS) ]
       ├─► [ LocalStorage Engine ]       ──► [ Browser Storage ]
       └─► [ Cloud Dispatcher ]          ──► [ POST Webhook ] ──► [ Google Sheet / Drive ]
```

---

## 6. ✅ Verification & Traceability Matrix

| Req ID | Requirement Description | Verification Method | Pass Criteria |
| :---: | :--- | :---: | :--- |
| **FR-01** | Local state load | Unit / Integration Test | `savedData` populated from `localStorage` |
| **FR-02** | URL parameter override | Integration Test | Query parameters mutate active state |
| **FR-04** | 60 FPS Canvas Particles | Performance Profiler | Frame rate $\ge 58\text{ FPS}$ |
| **FR-07** | Web Audio Autoplay unlock | User Event Test | `AudioContext.state === 'running'` |
| **FR-10** | Candle blow mechanism | Component Test | Flame DOM classes removed, smoke emitted |
| **FR-19** | Vault PIN `2912` | Security Test | Unlocks content if `pin === '2912'` |
| **FR-24** | Google Cloud Webhook sync | E2E Network Test | HTTP POST returns `200 OK`, row appended |
| **NFR-07**| 320px-1920px Zero Overflow | Visual Viewport CDP | `document.body.scrollWidth === innerWidth` |

---

*Certified compliant with IEEE-830 Standards for Software Requirements Engineering.* 📜✨
