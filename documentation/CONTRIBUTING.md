# 🛠️ Contributing to Eternal Love — Developer & Contributor Guide

```
===============================================================================
DEVELOPER CONTRIBUTION GUIDE & ENGINEERING STANDARDS
Project: Eternal Love — Ultra-Luxurious Romantic Celebration Web Application
Celebrant: Queen Nishika 👑 | Dedicated with Infinite Love by: Dilip 💖
Standard: Clean Vanilla JS (ES6+), Vanilla CSS3 Tokens & Semantic HTML5
Test Suite: Automated Playwright QA Matrix (playwright-test-runner.js)
===============================================================================
```

> **Welcome Developers & Contributors!** Thank you for helping build, polish, and extend this celebration platform. This guide outlines our design philosophy, coding standards, local development workflows, and testing requirements.

---

## 📑 Table of Contents

1. [🌟 1. Core Engineering Principles](#1-core-engineering-principles)
2. [💻 2. Local Development Setup](#2-local-development-setup)
3. [📁 3. Project Structure & Code Layout](#3-project-structure--code-layout)
4. [🎨 4. CSS Design System & Token Conventions](#4-css-design-system--token-conventions)
5. [⚡ 5. JavaScript Architecture & Style Guide](#5-javascript-architecture--style-guide)
6. [✨ 6. How to Add New Celebration Features](#6-how-to-add-new-celebration-features)
   - [6.1 Adding a New Theme](#61-adding-a-new-theme)
   - [6.2 Adding New Love Reasons to the Jar](#62-adding-new-love-reasons-to-the-jar)
   - [6.3 Adding New Sound Synth Melodies](#63-adding-new-sound-synth-melodies)
   - [6.4 Adding Love Coupons](#64-adding-love-coupons)
7. [🧪 7. Automated Testing & Quality Assurance](#7-automated-testing--quality-assurance)
8. [📝 8. Git Commit & Release Guidelines](#8-git-commit--release-guidelines)

---

## 1. 🌟 Core Engineering Principles

1. **Zero External Framework Dependencies**: We write pure, native Vanilla HTML5, CSS3, and ES6+ JavaScript. Do not introduce React, Vue, jQuery, Tailwind, or complex build bundlers without consensus.
2. **60 FPS Visual Elegance**: Animations, canvas particles, and 3D transforms must run silky smooth without layout thrashing or stutter.
3. **Mobile-First Responsiveness**: Every interactive element must look breathtaking and fit with 0px horizontal overflow on viewports from 320px up to 4K displays.
4. **Strict Passcode Integrity**: Passcodes are strictly locked to **`22092000`** (DOB) and **`2912`** (Anniversary PIN).
5. **Resilient Offline First**: The app must function smoothly even when disconnected from the network.

---

## 2. 💻 Local Development Setup

### Prerequisites
* Any modern web browser (Google Chrome, Microsoft Edge, Firefox, Safari).
* Node.js v16+ (for running Playwright test harness).
* A lightweight local HTTP server.

### Step-by-Step Setup
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/<YOUR-USERNAME>/eternal-love.git
   cd eternal-love
   ```

2. **Start a Local Development Server**:
   * **Using Python**:
     ```bash
     python -m http.server 8080
     ```
   * **Using Node.js (`npx serve`)**:
     ```bash
     npx serve . -p 8080
     ```

3. **Open in Browser**:
   Navigate to `http://localhost:8080` to experience the celebration.

---

## 3. 📁 Project Structure & Code Layout

```text
├── index.html                   # Pre-Launch Countdown & Early Birthday Blessing Media Portal
├── main.html                    # Main Celebration Arena (Welcome Screen, Passcode Lock, 25 Stages)
├── style.css                    # Luxury CSS Design System, Themes & Keyframe Animations
├── script.js                    # Core Interactive Engine, Web Audio Synth, Canvas Particles
├── Code.gs                      # Google Apps Script Serverless Backend Webhook Engine (v5.0)
├── playwright-test-runner.js    # Playwright Automated QA Test Suite (49/49 Assertions Passed)
├── playwright_test_results.json # Automated test results data log
├── favicon.svg                  # Scalable SVG Crown/Heart Vector Icon
├── webqr.png                    # Instant Mobile Access QR Code
├── README.md                    # Master Project Showcase & Quick Start Guide
└── documentation/               # Complete 14-Document Architecture & Specification Suite
```

---

## 4. 🎨 CSS Design System & Token Conventions

All styles must utilize CSS custom properties defined in `:root` or theme classes:

```css
:root {
  --primary-pink: #ff4081;
  --primary-glow: rgba(255, 64, 129, 0.45);
  --accent-gold: #ffd700;
  --bg-dark-1: #0d0614;
  --bg-dark-2: #190a2a;
  --glass-bg: rgba(255, 255, 255, 0.07);
  --glass-border: rgba(255, 255, 255, 0.15);
  --glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  --radius-sm: 8px;
  --radius-md: 16px;
  --radius-lg: 24px;
  --radius-full: 9999px;
  --transition-smooth: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## 5. ⚡ JavaScript Architecture & Style Guide

* **Defensive DOM Querying**: Always verify elements exist before attaching listeners:
  ```javascript
  const btn = document.getElementById('myButton');
  if (btn) {
    btn.addEventListener('click', handleAction);
  }
  ```
* **HTML Sanitization**: Always wrap dynamic user strings with `escapeHtml(str)` before DOM injection.
* **Strict Passcode Matching**: Use `isPasscodeMatch(pin)` comparing strictly to `'2912'` and `'22092000'`.

---

## 6. ✨ How to Add New Celebration Features

### 6.1 Adding a New Theme
1. Open `style.css` and declare your new theme class:
   ```css
   body.theme-emerald-royale {
     --bg-dark-1: #03140e;
     --bg-dark-2: #082d20;
     --accent-gold: #50fa7b;
     --primary-pink: #00f5d4;
   }
   ```
2. Open `main.html` and add a new theme option in the Theme Switcher.

### 6.2 Adding New Love Reasons to the Jar
Open `script.js` and append your reason object to `REASONS_DATABASE`:
```javascript
{
  category: 'romance',
  text: "The way your eyes light up when you talk about your passions.",
  author: "Dilip 💖"
}
```

---

## 7. 🧪 Automated Testing & Quality Assurance

Before committing changes, execute the automated Playwright test suite:

```bash
node playwright-test-runner.js
```

Ensure all 49 assertions pass with **0 console errors**.

---

## 8. 📝 Git Commit & Release Guidelines

We follow **Conventional Commits**:
* `feat:` A new celebration feature or interactive module.
* `fix:` A bug fix, layout adjustment, or responsive repair.
* `docs:` Documentation updates or additions.
* `style:` CSS formatting, theme refinement, or visual polish.
* `test:` Automated test suite updates.

---

*Thank you for contributing to Queen Nishika's Eternal Love Celebration!* 👑💖
