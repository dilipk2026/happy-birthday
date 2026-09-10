# User Acceptance Testing (UAT) Test Cases — Eternal Love

---

## 1. UAT Strategy & Business Acceptance Criteria
[VERIFIED] User Acceptance Testing (UAT) verifies that the **Eternal Love** portal fulfills its core emotional, interactive, and aesthetic objectives for the primary stakeholders:
1. **The Royal Celebrant (Queen Nishika 👑)**: Smooth unboxing journey, emotional love letters, photo memories, interactive games, audio harmony, and sticky wishes.
2. **The Dedicator / Creator (Dilip 💖)**: VIP admin controls, passcode verification, zero data loss on wish submissions, and flawless cloud synchronization to Google Drive / Sheets.
3. **Guests & Well-Wishers**: Fast submission of multimedia wishes, instant playback, and celebration ambiance.

---

## 2. Business Acceptance Test Matrix

| UAT ID | Target Stakeholder | Feature / Journey | Business Acceptance Scenario | Expected Business Result | UAT Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **UAT-01** | Queen Nishika | Stage 1: Gift Unboxing | Open landing page, interact with 3D gift box and click to trigger celebration | Gift box unfolds smoothly, heart particles burst, ambient music fades in, and countdown / unlocked state appears | [VERIFIED] Passed |
| **UAT-02** | Queen Nishika | Stage 2: Main Portal Unlock | Enter Birthday Passcode (`22092000`) on lock screen | Lock unlocks with sound effect, transitions to `main.html`, displays personalized royal greeting | [VERIFIED] Passed |
| **UAT-03** | Queen Nishika | Photo Memories Carousel | Browse through chronological relationship photo memories | High-res photos display smoothly with captions, left/right controls and touch swipe work intuitively | [VERIFIED] Passed |
| **UAT-04** | Queen Nishika | Love Letters & Reasons | Read romantic letters and flip through "Reasons Why I Love You" cards | Interactive card flipping reveals heartfelt messages with gentle hover animations and clear typography | [VERIFIED] Passed |
| **UAT-05** | Queen Nishika | Virtual Cake & Candle Blow | Tap interactive birthday cake to light and blow out candles | Candles extinguish with micro-animation, fireworks trigger across the screen, and festive sound plays | [VERIFIED] Passed |
| **UAT-06** | Queen Nishika | Magic Mirror Questionnaire | Answer playful romantic trivia in the Magic Mirror module | Answers provide charming affirmations and customized love responses with confetti bursts | [VERIFIED] Passed |
| **UAT-07** | Queen Nishika | Audio Controls & Playlist | Toggle background romantic soundtrack and switch tracks | Audio plays smoothly without stuttering, volume slider adjusts gain, mute toggles sound instantly | [VERIFIED] Passed |
| **UAT-08** | Dilip | VIP Secret Admin Panel | Enter VIP Anniversary PIN (`2912`) in modal | Admin controls reveal live sync stats, telemetry, and manual cloud sync triggers | [VERIFIED] Passed |
| **UAT-09** | Well-Wisher / Guest | Post-it Sticky Wish Note | Submit a text wish with custom color selection on the Wish Wall | New sticky note pins instantly to the live board, persists on refresh, and dispatches to Google Sheets | [VERIFIED] Passed |
| **UAT-10** | Well-Wisher / Guest | Video & Image Media Upload | Upload a personal video/photo wish message | File encodes to Base64, uploads to Google Drive, displays embed preview, and saves permanent link | [VERIFIED] Passed |
| **UAT-11** | Queen Nishika | Mobile Viewport Experience | Access portal on iPhone (Safari) and Android (Chrome) | UI reflows seamlessly to 375px/390px screens with zero horizontal overflow and responsive touch targets | [VERIFIED] Passed |
| **UAT-12** | Queen Nishika & Dilip | Cross-Session Persistence | Return to portal after closing browser tab | Authentication state, unlocked stage, and local sticky notes remain intact without re-locking | [VERIFIED] Passed |

---

## 3. Detailed UAT Scenario Walkthroughs

### UAT-01: Royal Unboxing Ceremony
- **Actor**: Queen Nishika 👑
- **Preconditions**: User navigates to root URL (`/index.html`).
- **Execution Steps**:
  1. Queen Nishika loads the page on her mobile device or laptop.
  2. The screen displays an ambient dark gradient with floating starlight particles and a sparkling 3D Gift Box.
  3. Queen Nishika taps "Tap to Open My Gift 🎁".
  4. The gift box lid lifts with a 3D perspective animation, celebratory confetti explodes, and synthesized chimes sound.
- **Acceptance Criteria**:
  - The unboxing animation must evoke delight with zero stutter.
  - Music begins smoothly with user interaction consent.
  - The UI advances to the countdown / celebration dashboard.

### UAT-08: VIP Dedicator Telemetry Verification
- **Actor**: Dilip 💖
- **Preconditions**: Accessing portal dashboard on `main.html`.
- **Execution Steps**:
  1. Dilip opens the VIP Passcode prompt.
  2. Dilip enters anniversary key `2912`.
  3. The system confirms VIP clearance, unlocking developer telemetry and direct link to Google Spreadsheet data.
- **Acceptance Criteria**:
  - Valid key `2912` unlocks admin features immediately.
  - Invalid keys display graceful error shakes without exposing the passcode.

### UAT-10: Video Wish Streaming & Google Drive Cloud Backup
- **Actor**: Guest / Well-Wisher
- **Preconditions**: Wish submission form open on `main.html` or `index.html`.
- **Execution Steps**:
  1. Guest enters name "Aarav", writes "Happy Birthday Nishika!", and attaches a short MP4 video greeting.
  2. Guest clicks "Submit Royal Wish ✨".
  3. Client asynchronously encodes video to Base64 and dispatches payload to Google Apps Script Webhook.
  4. Apps Script creates MP4 file in Google Drive folder `"Eternal Love Wishes (Queen Nishika)"` and logs entry to Google Sheets.
  5. The Wish Wall renders the video preview instantly.
- **Acceptance Criteria**:
  - No `blob:` temporary URLs are stored in LocalStorage.
  - Google Drive link is retrievable and playable across devices.
  - Form displays celebratory submission confirmation toast.

---

## 4. UAT Sign-Off & Acceptance Decision

```
+-----------------------------------------------------------------------------+
|                          UAT SIGN-OFF RECORD                                |
+-----------------------+-----------------------------------------------------+
| Product Name          | Eternal Love — Queen Nishika Birthday Portal        |
| Release Version       | v3.0.0 (Production Master)                          |
| Target Milestone Date | September 21-22, 2026                               |
| Acceptance Result     | ACCEPTED & APPROVED FOR CELEBRATION DISPATCH        |
| Stakeholder Approval  | Dilip (Lead Creator) & Queen Nishika (Celebrant)    |
+-----------------------+-----------------------------------------------------+
```
