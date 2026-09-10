# UI, Visual & Responsive Matrix Test Cases

> **Status**: `[VERIFIED]` • Production Baseline v3.0.0  
> **Testing Scope**: UI Components, Multi-Device Responsive Matrix, CSS 3D Animations & Modals  

---

## 1. UI & Visual Test Cases Matrix

| Test ID | UI Component / Page | Condition / Action | Expected Visual & DOM Behavior | Status |
| :--- | :--- | :--- | :--- | :---: |
| **`UI-01`** | `index.html` Header | Page load on desktop & mobile | Sticky header renders brand logo, countdown clock, VIP button | 🟢 **PASS** |
| **`UI-02`** | Countdown Chronometer | Live timer operation | Numbers update smoothly; cards adapt to 2 columns on mobile $<360\text{px}$ | 🟢 **PASS** |
| **`UI-03`** | VIP Keypad Modal | Click trigger button | Glassmorphism backdrop blur activates, keypad scales up | 🟢 **PASS** |
| **`UI-04`** | Keypad Shake Feedback | Enter invalid PIN | Modal box executes CSS keyframe shake animation | 🟢 **PASS** |
| **`UI-05`** | Sticky Wish Wall Grid | Render notes on desktop | Grid renders 3 columns on desktop, 2 on tablet, 1 on mobile | 🟢 **PASS** |
| **`UI-06`** | 320px Compact Mobile | Viewport 320px width (iPhone SE) | `scrollWidth - innerWidth` is exactly 0px (Zero horizontal overflow) | 🟢 **PASS** |
| **`UI-07`** | 375px Standard Mobile | Viewport 375px width (iPhone 14) | `scrollWidth - innerWidth` is exactly 0px (Zero horizontal overflow) | 🟢 **PASS** |
| **`UI-08`** | 768px Tablet Viewport | Viewport 768px width (iPad Mini) | `scrollWidth - innerWidth` is exactly 0px (Zero horizontal overflow) | 🟢 **PASS** |
| **`UI-09`** | 1280px Desktop Viewport| Viewport 1280px width (Laptop) | `scrollWidth - innerWidth` is exactly 0px (Zero horizontal overflow) | 🟢 **PASS** |
| **`UI-10`** | 2560px 4K Ultra-Wide | Viewport 2560px width (4K UHD) | Content max-width constrained to 1180px, centered layout | 🟢 **PASS** |
| **`UI-11`** | 3D Gift Box Unboxing | Tap gift box on `main.html` | Box pulses, lid rotates open in 3D perspective space | 🟢 **PASS** |
| **`UI-12`** | Interactive Cake Canvas | Drag Damascus knife | Knife follows cursor, slices cake, slice moves to porcelain dish | 🟢 **PASS** |
| **`UI-13`** | Fortune Roulette Wheel | Spin wheel button | Wheel rotates with deceleration physics, ticker ticks on pins | 🟢 **PASS** |
| **`UI-14`** | Full-Screen Lightbox | Click video expand button | `#mediaLightboxModal` activates with responsive video player | 🟢 **PASS** |
| **`UI-15`** | Keyboard Cheat Sheet | Press <kbd>?</kbd> key | Modal opens showing two-column list of all hotkeys | 🟢 **PASS** |
