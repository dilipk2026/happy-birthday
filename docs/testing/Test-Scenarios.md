# End-to-End Test Scenarios Matrix

> **Status**: `[VERIFIED]` • 20 Master Test Scenarios  
> **Traceability**: Mapped directly to IEEE-830 Requirements (`FR-001` to `FR-014` and `NFRs`)  

---

## Master Scenarios Summary

| Scenario ID | Module | Scenario Description | Type | Priority | Execution Status |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **`TS-001`** | Static Assets | Verify HTTP delivery, 200 OK status, and MIME types for all core files. | Positive | High | 🟢 **PASS** |
| **`TS-002`** | Launch Gatekeeper | Verify unauthenticated direct request to `main.html` redirects to `index.html`. | Security / Negative | Critical | 🟢 **PASS** |
| **`TS-003`** | Launch Router | Verify VIP URL parameters (`?vip=unlocked`, `?preview=true`, `?pin=2912`) grant access. | Positive | High | 🟢 **PASS** |
| **`TS-004`** | Countdown Portal | Verify live countdown chronometer renders valid positive integers for Days, Hours, Mins, Secs. | Positive | Medium | 🟢 **PASS** |
| **`TS-005`** | VIP Virtual Keypad | Verify virtual keypad rejects invalid PIN `"0000"` with shake animation and error tone. | Negative | High | 🟢 **PASS** |
| **`TS-006`** | VIP Authentication | Verify virtual keypad accepts anniversary PIN `2912` and routes to `main.html?vip=unlocked`. | Positive | Critical | 🟢 **PASS** |
| **`TS-007`** | Wish Submission | Verify guest wish form renders sticky note instantly on `#stickyNotesGrid` and dispatches POST. | Positive | High | 🟢 **PASS** |
| **`TS-008`** | Video Embed Normalizer | Verify Google Drive `/view` and `open?id=` links convert to streaming `/preview` iframes. | Positive | Critical | 🟢 **PASS** |
| **`TS-009`** | Base64 Video Encoding | Verify device video upload encodes to Base64 and dispatches payload to Google Apps Script. | Positive | Critical | 🟢 **PASS** |
| **`TS-010`** | Reload Persistence | Verify reloading `index.html` and `main.html` preserves video embeds without URL wiping. | Recovery | Critical | 🟢 **PASS** |
| **`TS-011`** | Filter Pill Isolation | Verify clicking Video filter pill isolates video notes without colliding with Memories filter. | Boundary | Medium | 🟢 **PASS** |
| **`TS-012`** | 3D Unboxing Stage | Verify Welcome Screen displays 3D gift box; tapping prompts for passcode. | Positive | High | 🟢 **PASS** |
| **`TS-013`** | Birthday Passcode Auth | Verify entering `22092000` triggers confetti cannon, fanfare audio, and reveals `#mainApp`. | Positive | Critical | 🟢 **PASS** |
| **`TS-014`** | Cake Cutting Simulation | Verify dragging knife slices strawberry cake, detaches slice to plate, and plays sound. | Positive | High | 🟢 **PASS** |
| **`TS-015`** | Magic Love Jar | Verify tapping jar unfolds origami stars and advances 100 sequential affirmations. | Positive | Medium | 🟢 **PASS** |
| **`TS-016`** | Fortune Roulette Wheel | Verify spinning wheel animates with mechanical audio clicks and selects date night idea. | Positive | Medium | 🟢 **PASS** |
| **`TS-017`** | Web Audio Synthesizer | Verify soundscape gain sliders and guitar keyboard strums produce real-time procedural audio. | Positive | High | 🟢 **PASS** |
| **`TS-018`** | Full-Screen Lightbox | Verify clicking video expand button opens full-screen `#mediaLightboxModal` with video player. | Positive | High | 🟢 **PASS** |
| **`TS-019`** | Responsive Viewport Audit | Verify 0px horizontal overflow across 320px, 375px, 768px, 1280px, and 2560px screen widths. | Boundary / UI | Critical | 🟢 **PASS** |
| **`TS-020`** | Clean Console Execution | Verify zero uncaught JavaScript exceptions, console errors, or page errors during all flows. | Quality / NFR | Critical | 🟢 **PASS** |
