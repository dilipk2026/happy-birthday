# 🛠️ Contributing to Eternal Love — Developer & Contributor Guide

```
===============================================================================
DEVELOPER CONTRIBUTION GUIDE & ENGINEERING STANDARDS
Project: Eternal Love — Ultra-Luxurious Romantic Celebration Web Application
Celebrant: Queen Nishika 👑 | Dedicated with Infinite Love by: Dilip 💖
Standard: Clean Vanilla JS (ES6+), Vanilla CSS3 Tokens & Semantic HTML5
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
7. [🧪 7. Testing & Quality Assurance](#7-testing--quality-assurance)
8. [📝 8. Git Commit & Release Guidelines](#8-git-commit--release-guidelines)

---

## 1. 🌟 Core Engineering Principles

1. **Zero External Framework Dependencies**: We write pure, native Vanilla HTML5, CSS3, and ES6+ JavaScript. Do not introduce React, Vue, jQuery, Tailwind, or external bundle tooling without explicit consensus.
2. **60 FPS Visual Elegance**: Animations, canvas particles, and 3D transforms must run silky smooth without layout thrashing or stutter.
3. **Mobile-First Responsiveness**: Every single interactive element must look breathtaking and fit with 0px horizontal overflow on viewports from 320px up to 4K displays.
4. **Resilient Offline First**: The app must function smoothly even when completely disconnected from the internet.

---

## 2. 💻 Local Development Setup

### Prerequisites
* Any modern web browser (Google Chrome, Microsoft Edge, Firefox, Safari).
* A lightweight local HTTP server (such as VS Code Live Server, Python HTTP server, or Node.js).

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
   * **Using VS Code**:
     Install the **Live Server** extension and click **"Go Live"** in the bottom status bar.

3. **Open in Browser**:
   Navigate to `http://localhost:8080` to experience the celebration.

---

## 3. 📁 Project Structure & Code Layout

```text
├── index.html                   # Master Semantic HTML5 Presentation Shell
├── style.css                    # Luxury CSS Design System, Themes & Keyframe Animations
├── script.js                    # Core Interactive Engine, Web Audio Synth, Canvas Particles
├── Code.gs                      # Google Apps Script Serverless Backend Webhook Engine
├── netlify.toml                 # Netlify Edge Routing & Header Optimization Config
├── vercel.json                  # Vercel Global Edge CDN & Cache-Control Configuration
├── screenshots/                 # High-Definition Showcase & Multi-Device Previews
├── README.md                    # Master Project Showcase & Quick Start Guide
├── USER_GUIDE.md                # Interactive User Guide & Celebration Handbook
├── ARCHITECTURE_AND_PROCUREMENT.md # System Architecture & Zero-Cost Procurement Blueprint
├── API_DOCUMENTATION.md         # Serverless API Specification & Payload Models
├── SOFTWARE_REQUIREMENTS_SPECIFICATION.md # IEEE-830 Compliant Functional Requirements
├── SECURITY_AND_PRIVACY_POLICY.md # Security Threat Model & Zero-Tracking Privacy Policy
├── TESTING_REPORT.md            # Multi-Device Verification & Automation Test Report
├── FAQ_AND_TROUBLESHOOTING.md   # Troubleshooting Guide & Operational Knowledge Base
├── MAINTENANCE_AND_OPERATIONS.md # Annual Runbook, Backup & Long-Term Archival Guide
├── CONTRIBUTING.md              # Contributor Workflow & Coding Standards (This File)
├── CHANGELOG.md                 # Semantic Release History & Milestone Changelog
└── DOCUMENTATION_INDEX.md       # Master Documentation Directory & Navigation Map
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

### CSS Guidelines:
* Use `rem` and `em` for scalable typography.
* Ensure all modals and containers use `max-width: 95vw` and `box-sizing: border-box` to prevent horizontal scrolling.
* Use `backdrop-filter: blur(12px)` for glassmorphic elements with solid color fallback.

---

## 5. ⚡ JavaScript Architecture & Style Guide

* **Event Delegation**: Attach event listeners at parent containers when handling dynamic lists (e.g., love reasons, bucket list checkboxes).
* **Async/Await**: Use modern `async/await` syntax for all asynchronous operations and network calls.
* **Defensive DOM Querying**: Always verify DOM elements exist before attaching listeners or mutating attributes:
  ```javascript
  const btn = document.getElementById('myButton');
  if (btn) {
    btn.addEventListener('click', handleAction);
  }
  ```
* **State Immutability**: Mutate the global `state` object predictably and always follow with `saveState()`.

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
2. Open `index.html` and add a new theme dot option in the Theme Switcher.

### 6.2 Adding New Love Reasons to the Jar
Open `script.js` and append your reason object to the `REASONS_DATABASE` array:
```javascript
{
  category: 'romance', // or 'queen', 'little-things', 'brilliance', 'memories'
  text: "The way your eyes light up when you talk about your passions.",
  author: "Dilip 💖"
}
```

### 6.3 Adding New Sound Synth Melodies
In `script.js`, extend the `playSynthMelody()` frequency array:
```javascript
const myNewMelody = [
  { note: 'C4', duration: 0.4 },
  { note: 'E4', duration: 0.4 },
  { note: 'G4', duration: 0.8 }
];
```

---

## 7. 🧪 Testing & Quality Assurance

Before submitting pull requests or committing new features:
1. **Responsive Matrix Verification**: Test the viewport across 320px, 375px, 768px, 1366px, and 1920px. Confirm horizontal overflow is exactly `0px`.
2. **Audio Synth Verification**: Confirm audio initializes without throwing `AudioContext` errors.
3. **Console Hygiene**: Ensure 0 uncaught errors or unhandled promise rejections appear in DevTools.
4. **Cloud Integration Check**: Ensure test wish submissions deliver successfully to the Google Sheet.

---

## 8. 📝 Git Commit & Release Guidelines

We follow **Conventional Commits**:
* `feat:` A new celebration feature or interactive module.
* `fix:` A bug fix, layout adjustment, or responsive repair.
* `docs:` Documentation updates or additions.
* `style:` CSS formatting, theme refinement, or visual polish.
* `refactor:` Code refactoring with no functional changes.
* `perf:` Performance optimization (particle throttling, image compression).

### Example Commit:
```bash
git commit -m "feat(synth): add acoustic guitar arpeggio melody mode"
```

---

*Thank you for contributing to Queen Nishika's Eternal Love Celebration!* 👑💖
