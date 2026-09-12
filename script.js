/* ==========================================================================
   ETERNAL LOVE — JAVASCRIPT ANIMATION, AUDIO & INTERACTIVE ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  try {
  // Global HTML Sanitizer
  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
  window.escapeHtml = escapeHtml;

  // --------------------------------------------------------------------------
  // 1. STATE MANAGEMENT, CACHE INVALIDATION & LOCAL STORAGE ENGINE
  // --------------------------------------------------------------------------
  const APP_VERSION = '2.1.0';
  const STORAGE_KEY = `eternal_love_bday_state_v${APP_VERSION}`;

  // Purge lingering Service Workers & legacy caches
  try {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((reg) => reg.unregister());
      });
    }
  } catch (swErr) {}

  // Check URL parameters early for forced reset or query overrides
  const urlParams = new URLSearchParams(window.location.search);
  const isResetRequested = urlParams.get('reset') === '1' || 
                           urlParams.get('reset') === 'true' || 
                           urlParams.get('fresh') === '1' || 
                           urlParams.get('purge') === '1';

  if (isResetRequested) {
    try {
      localStorage.clear();
      sessionStorage.clear();
      if ('caches' in window) {
        caches.keys().then((names) => names.forEach((n) => caches.delete(n)));
      }
    } catch (clearErr) {}
  } else {
    // Purge outdated version keys from localStorage automatically
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('eternal_love_bday_state_') && k !== STORAGE_KEY) {
          localStorage.removeItem(k);
        }
      }
    } catch (e) {}
  }

  let savedData = {};
  if (!isResetRequested) {
    try {
      savedData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch (e) {
      savedData = {};
    }
  }

  const DEFAULT_GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbwPnRNoIYc1b8E2loZiXZhwlDXn3H2ZjH5b_t-C328paUo8u2mcGewGJKscj1W71zW-/exec';

  const state = {
    recipientName: savedData.recipientName || 'Nishika',
    senderName: savedData.senderName || 'Dilip',
    startDate: savedData.startDate || '2025-12-29',
    message: savedData.message || 'To the most incredible, beautiful, and radiant woman in my life, Nishika: May your birthday be filled with infinite joy, sweet surprises, and all the happiness you bring into my world! 💖',
    theme: savedData.theme || 'theme-magical',
    isMusicPlaying: false,
    musicMode: 'piano', // 'piano' or 'birthday'
    candlesLit: true,
    poppedCount: savedData.poppedCount || 0,
    cheers: savedData.cheers || 128,
    loves: savedData.loves || 256,
    reasonsExplored: savedData.reasonsExplored || 1,
    claimedCoupons: savedData.claimedCoupons || [],
    pinnedWishes: savedData.pinnedWishes || [],
    uploadedPhotos: savedData.uploadedPhotos || [],
    secretWish: savedData.secretWish || '',
    favoriteReasons: savedData.favoriteReasons || [],
    completedBucketItems: savedData.completedBucketItems || ['b1', 'b2'],
    customBucketItems: savedData.customBucketItems || [],
    customDateIdeas: savedData.customDateIdeas || [],
    soundscapeVolumes: savedData.soundscapeVolumes || { master: 80, rain: 70, fire: 45, ocean: 0, chimes: 60, piano: 50, cafe: 0 },
    timeCapsules: savedData.timeCapsules || [],
    customJourneyPins: savedData.customJourneyPins || [],
    googleSheetUrl: savedData.googleSheetUrl || localStorage.getItem('eternal_love_sheet_url') || DEFAULT_GOOGLE_SHEET_URL
  };

  // Clean up any test mock or truncated URL and upgrade to full Google Sheet URL
  if (!state.googleSheetUrl || state.googleSheetUrl.includes('AKfycb_TEST_MOCK_SHEET') || state.googleSheetUrl === 'https://script.google.com/macros/s/AKfycbwPnRNoIYc1b8E2loZiXZh/exec') {
    state.googleSheetUrl = DEFAULT_GOOGLE_SHEET_URL;
    localStorage.setItem('eternal_love_sheet_url', DEFAULT_GOOGLE_SHEET_URL);
  }

  // URL Parameters override if present
  if (urlParams.get('name')) state.recipientName = decodeURIComponent(urlParams.get('name')).trim();
  if (urlParams.get('sender')) state.senderName = decodeURIComponent(urlParams.get('sender')).trim();
  if (urlParams.get('date')) state.startDate = decodeURIComponent(urlParams.get('date')).trim();
  if (urlParams.get('msg')) state.message = decodeURIComponent(urlParams.get('msg')).trim();
  if (urlParams.get('theme')) state.theme = urlParams.get('theme');
  if (urlParams.get('sheet')) state.googleSheetUrl = decodeURIComponent(urlParams.get('sheet')).trim();

  // Global helper to allow cache reset from console or events
  window.resetAppCache = function() {
    try {
      localStorage.clear();
      sessionStorage.clear();
      if ('caches' in window) {
        caches.keys().then((names) => {
          names.forEach((n) => caches.delete(n));
        });
      }
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((regs) => {
          regs.forEach((r) => r.unregister());
        });
      }
      if (typeof showToast === 'function') {
        showToast('Cache & state reset successfully! Reloading...');
      }
      setTimeout(() => {
        window.location.reload();
      }, 400);
    } catch (e) {
      window.location.reload();
    }
  };

  // Async helper to convert file to Base64
  function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
      if (!file) return resolve('');
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }
  window.readFileAsBase64 = readFileAsBase64;

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        recipientName: state.recipientName,
        senderName: state.senderName,
        startDate: state.startDate,
        message: state.message,
        theme: state.theme,
        poppedCount: state.poppedCount,
        cheers: state.cheers,
        loves: state.loves,
        reasonsExplored: state.reasonsExplored,
        claimedCoupons: state.claimedCoupons,
        pinnedWishes: state.pinnedWishes,
        uploadedPhotos: state.uploadedPhotos,
        secretWish: state.secretWish,
        favoriteReasons: state.favoriteReasons,
        completedBucketItems: state.completedBucketItems,
        customBucketItems: state.customBucketItems,
        customDateIdeas: state.customDateIdeas,
        soundscapeVolumes: state.soundscapeVolumes,
        timeCapsules: state.timeCapsules,
        customJourneyPins: state.customJourneyPins,
        googleSheetUrl: state.googleSheetUrl
      }));
      if (state.googleSheetUrl) {
        localStorage.setItem('eternal_love_sheet_url', state.googleSheetUrl);
      }
    } catch (e) {
      console.warn('Storage quota limit reached, saving safe representation:', e);
      try {
        const safeWishes = (state.pinnedWishes || []).map(w => {
          if (w.mediaUrl && w.mediaUrl.startsWith('data:video') && w.mediaUrl.length > 500000) {
            return { ...w, mediaUrl: '' };
          }
          return w;
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          ...state,
          pinnedWishes: safeWishes
        }));
      } catch (innerE) {
        console.warn('Storage quota completely unavailable:', innerE);
      }
    }
  }

  // Apply State to DOM Elements
  function applyStateToDOM() {
    document.querySelectorAll('.recipient-name-display').forEach(el => {
      el.textContent = state.recipientName;
    });

    const heroMsg = document.getElementById('heroMessage');
    if (heroMsg) heroMsg.textContent = state.message;

    const letterSign = document.getElementById('letterSenderSignature');
    if (letterSign) letterSign.textContent = `${state.senderName} 💖`;

    const keepsakeSign = document.getElementById('keepsakeSignDisplay');
    if (keepsakeSign) keepsakeSign.textContent = `${state.senderName} 💖`;

    const bouquetTag = document.getElementById('bouquetTagText');
    if (bouquetTag) bouquetTag.textContent = `To My Love ${state.recipientName} 👑 Forever In Bloom`;

    const giftingSender = document.getElementById('giftingSenderName');
    if (giftingSender) giftingSender.textContent = `Forever ${state.senderName} 💖`;

    const knifeEngraving = document.querySelector('.knife-engraving');
    if (knifeEngraving) knifeEngraving.textContent = `${state.senderName} & ${state.recipientName} 💖`;

    const blanketMonogram = document.querySelector('.blanket-monogram');
    if (blanketMonogram) blanketMonogram.textContent = `${state.senderName} + ${state.recipientName} 💖`;

    document.body.className = state.theme;

    // Theme Picker Dots
    document.querySelectorAll('.theme-dot').forEach(dot => {
      if (dot.getAttribute('data-theme') === state.theme) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // Form inputs in customizer modal
    const custName = document.getElementById('custNameInput');
    const custSender = document.getElementById('custSenderInput');
    const custDate = document.getElementById('custStartDateInput');
    const custMsg = document.getElementById('custMsgInput');
    const custSheet = document.getElementById('custGoogleSheetUrl');
    if (custName) custName.value = state.recipientName;
    if (custSender) custSender.value = state.senderName;
    if (custDate) custDate.value = state.startDate;
    if (custMsg) custMsg.value = state.message;
    if (custSheet) custSheet.value = state.googleSheetUrl || DEFAULT_GOOGLE_SHEET_URL;

    // Restore cheer & love counts
    const cheerCountEl = document.getElementById('cheerCount');
    const loveCountEl = document.getElementById('loveCount');
    const poppedScoreEl = document.getElementById('poppedScore');
    const drawnCountEl = document.getElementById('drawnCount');
    if (cheerCountEl) cheerCountEl.textContent = state.cheers;
    if (loveCountEl) loveCountEl.textContent = state.loves;
    if (poppedScoreEl) poppedScoreEl.textContent = state.poppedCount;
    if (drawnCountEl) drawnCountEl.textContent = state.reasonsExplored;

    // Restore claimed coupons
    state.claimedCoupons.forEach(id => {
      const ticket = document.querySelector(`.coupon-ticket[data-coupon-id="${id}"]`);
      if (ticket) {
        const btn = ticket.querySelector('.btn-claim-coupon');
        const stamp = ticket.querySelector('.claimed-stamp');
        if (btn) btn.style.display = 'none';
        if (stamp) stamp.classList.remove('hidden');
      }
    });

    renderPinnedWishes();
    updateShareUrl();
    updateCloudSyncChips();
  }

  // --------------------------------------------------------------------------
  // GOOGLE SHEETS & GOOGLE DRIVE CLOUD SYNC ENGINE
  // --------------------------------------------------------------------------
  function updateCloudSyncChips() {
    const isConfigured = Boolean(state.googleSheetUrl && state.googleSheetUrl.startsWith('http'));
    const wishChip = document.getElementById('wishSyncChip');
    const wishText = document.getElementById('wishSyncText');
    const photoChip = document.getElementById('photoSyncChip');
    const photoText = document.getElementById('photoSyncText');

    if (isConfigured) {
      if (wishChip && wishText) {
        wishChip.className = 'cloud-sync-chip';
        wishText.textContent = 'Google Sheets Connected ✨';
      }
      if (photoChip && photoText) {
        photoChip.className = 'cloud-sync-chip';
        photoText.textContent = 'Google Drive Connected 📸';
      }
    } else {
      if (wishChip && wishText) {
        wishChip.className = 'cloud-sync-chip offline';
        wishText.textContent = 'Saved Locally (Add Sheet URL)';
      }
      if (photoChip && photoText) {
        photoChip.className = 'cloud-sync-chip offline';
        photoText.textContent = 'Saved Locally (Add Sheet URL)';
      }
    }
  }

  async function sendToGoogleSheet(payload, options = {}) {
    const url = state.googleSheetUrl || localStorage.getItem('eternal_love_sheet_url') || DEFAULT_GOOGLE_SHEET_URL;
    const chipEl = options.chipElement;
    const textEl = options.textElement;

    if (!url || !url.startsWith('http')) {
      if (chipEl && textEl) {
        chipEl.className = 'cloud-sync-chip offline';
        textEl.textContent = 'Saved Locally ✨';
        setTimeout(() => updateCloudSyncChips(), 3500);
      }
      return { success: false, reason: 'no_url' };
    }

    if (chipEl && textEl) {
      chipEl.className = 'cloud-sync-chip syncing';
      textEl.textContent = 'Syncing to Google Cloud...';
    }

    try {
      const enrichedPayload = {
        ...payload,
        name: payload.name || payload.author || state.senderName || 'Well-wisher',
        author: payload.author || payload.name || state.senderName || 'Well-wisher',
        message: payload.message || payload.text || payload.wish || '',
        celebrant: state.recipientName,
        dedicatedBy: state.senderName,
        timestamp: payload.timestamp || new Date().toISOString(),
        localTime: new Date().toLocaleString()
      };

      await fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(enrichedPayload)
      });

      if (chipEl && textEl) {
        chipEl.className = 'cloud-sync-chip';
        textEl.textContent = options.successText || 'Synced to Google Cloud ✨';
        setTimeout(() => {
          updateCloudSyncChips();
        }, 4000);
      }
      return { success: true };
    } catch (err) {
      console.warn('Google Sheets cloud sync fallback to local storage:', err);
      if (chipEl && textEl) {
        chipEl.className = 'cloud-sync-chip offline';
        textEl.textContent = 'Saved Locally ✨';
        setTimeout(() => {
          updateCloudSyncChips();
        }, 3500);
      }
      return { success: false, error: err };
    }
  }
  window.sendToGoogleSheet = sendToGoogleSheet;

  // --------------------------------------------------------------------------
  // 2. SCROLL REVEAL OBSERVER (INTERSECTION OBSERVER) & MOBILE GUARANTEE
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.02, rootMargin: '120px 0px 80px 0px' });

  revealElements.forEach(el => {
    revealObserver.observe(el);
    // Instant reveal fallback on mobile / tablet devices (<= 1024px)
    if (window.innerWidth <= 1024) {
      el.classList.add('is-revealed');
    }
  });

  // Safeguard: Ensure Section 7 (Polaroid & Wish Wall) and all sections are revealed
  const ensureVisibleSections = () => {
    const memSec = document.getElementById('memoriesSec');
    if (memSec) {
      memSec.classList.add('is-revealed');
    }
    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 1.6 || window.innerWidth <= 1024) {
        el.classList.add('is-revealed');
      }
    });
  };
  window.addEventListener('load', ensureVisibleSections);
  window.addEventListener('resize', ensureVisibleSections);
  window.addEventListener('scroll', ensureVisibleSections, { passive: true });
  setTimeout(ensureVisibleSections, 200);
  setTimeout(ensureVisibleSections, 1000);

  // --------------------------------------------------------------------------
  // 3. WEB AUDIO SYNTHESIZER ENGINE
  // --------------------------------------------------------------------------
  class RomanticAudioEngine {
    constructor() {
      this.ctx = null;
      this.isPlaying = false;
      this.timerId = null;
      this.step = 0;

      // Track 1: Happy Birthday Melody (Frequencies in Hz)
      this.bdayNotes = [
        { f: 261.63, d: 0.35 }, { f: 261.63, d: 0.15 }, { f: 293.66, d: 0.5 },
        { f: 261.63, d: 0.5 }, { f: 349.23, d: 0.5 }, { f: 329.63, d: 0.9 },
        { f: 261.63, d: 0.35 }, { f: 261.63, d: 0.15 }, { f: 293.66, d: 0.5 },
        { f: 261.63, d: 0.5 }, { f: 392.00, d: 0.5 }, { f: 349.23, d: 0.9 },
        { f: 261.63, d: 0.35 }, { f: 261.63, d: 0.15 }, { f: 523.25, d: 0.5 },
        { f: 440.00, d: 0.5 }, { f: 349.23, d: 0.5 }, { f: 329.63, d: 0.5 },
        { f: 293.66, d: 0.9 }, { f: 466.16, d: 0.35 }, { f: 466.16, d: 0.15 },
        { f: 440.00, d: 0.5 }, { f: 349.23, d: 0.5 }, { f: 392.00, d: 0.5 },
        { f: 349.23, d: 1.2 }
      ];

      // Track 2: Romantic Piano Progression (Fmaj7 - Dm9 - Bbmaj7 - C9)
      this.pianoArp = [
        { f: 174.61, d: 0.5 }, { f: 261.63, d: 0.4 }, { f: 329.63, d: 0.4 }, { f: 349.23, d: 0.6 },
        { f: 261.63, d: 0.4 }, { f: 329.63, d: 0.4 }, { f: 440.00, d: 0.5 }, { f: 523.25, d: 0.7 },
        { f: 146.83, d: 0.5 }, { f: 220.00, d: 0.4 }, { f: 293.66, d: 0.4 }, { f: 349.23, d: 0.6 },
        { f: 261.63, d: 0.4 }, { f: 293.66, d: 0.4 }, { f: 440.00, d: 0.5 }, { f: 587.33, d: 0.7 },
        { f: 116.54, d: 0.5 }, { f: 233.08, d: 0.4 }, { f: 293.66, d: 0.4 }, { f: 349.23, d: 0.6 },
        { f: 233.08, d: 0.4 }, { f: 349.23, d: 0.4 }, { f: 466.16, d: 0.5 }, { f: 523.25, d: 0.7 },
        { f: 130.81, d: 0.5 }, { f: 261.63, d: 0.4 }, { f: 329.63, d: 0.4 }, { f: 392.00, d: 0.6 },
        { f: 261.63, d: 0.4 }, { f: 392.00, d: 0.4 }, { f: 523.25, d: 0.5 }, { f: 659.25, d: 0.8 }
      ];
    }

    initContext() {
      if (!this.ctx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContextClass();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    init() {
      this.initContext();
    }

    playTone(frequency, duration, type = 'triangle', gainVal = 0.14) {
      this.initContext();
      if (!this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);

        gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {}
    }

    playChime(frequency = 523.25, duration = 0.2, type = 'triangle') {
      this.playTone(frequency, duration, type, 0.15);
    }

    playStep() {
      if (!this.isPlaying) return;
      if (state.musicMode === 'piano') {
        const note = this.pianoArp[this.step % this.pianoArp.length];
        this.playTone(note.f, note.d * 1.5, 'sine', 0.16);
        this.playTone(note.f * 2, note.d * 1.0, 'triangle', 0.05);

        this.step++;
        this.timerId = setTimeout(() => this.playStep(), (note.d + 0.05) * 1000);
      } else {
        const note = this.bdayNotes[this.step % this.bdayNotes.length];
        this.playTone(note.f, note.d * 1.2, 'triangle', 0.18);
        this.playTone(note.f * 2, note.d * 0.8, 'sine', 0.08);

        this.step++;
        this.timerId = setTimeout(() => this.playStep(), (note.d + 0.08) * 1000);
      }
    }

    startMelody() {
      this.initContext();
      this.isPlaying = true;
      this.step = 0;
      this.playStep();
    }

    stopMelody() {
      this.isPlaying = false;
      if (this.timerId) clearTimeout(this.timerId);
    }


    createVinylCrackle() {
      if (!this.ctx) return null;
      try {
        const bufferSize = this.ctx.sampleRate * 2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          if (Math.random() < 0.002) {
            data[i] = (Math.random() * 2 - 1) * 0.4;
          } else {
            data[i] = (Math.random() * 2 - 1) * 0.015;
          }
        }
        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 1000;

        const gain = this.ctx.createGain();
        gain.gain.value = 0.06;

        source.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        source.start();
        return { source, gain };
      } catch (e) {
        return null;
      }
    }

    // Interactive Grand Piano Key Voice
    playPianoKey(frequency, duration = 1.3) {
      this.initContext();
      if (!this.ctx) return;
      try {
        const t = this.ctx.currentTime;
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const osc3 = this.ctx.createOscillator();

        const gainNode = this.ctx.createGain();
        const filterNode = this.ctx.createBiquadFilter();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(frequency, t);

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(frequency * 2, t);

        osc3.type = 'sine';
        osc3.frequency.setValueAtTime(frequency * 3, t);

        filterNode.type = 'lowpass';
        filterNode.frequency.setValueAtTime(3000, t);
        filterNode.frequency.exponentialRampToValueAtTime(200, t + duration);

        gainNode.gain.setValueAtTime(0.35, t);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, t + duration);

        osc1.connect(filterNode);
        osc2.connect(filterNode);
        osc3.connect(filterNode);
        filterNode.connect(gainNode);
        gainNode.connect(this.ctx.destination);

        osc1.start(t);
        osc2.start(t);
        osc3.start(t);
        osc1.stop(t + duration);
        osc2.stop(t + duration);
        osc3.stop(t + duration);
      } catch (e) {}
    }

    // Acoustic Guitar String Voice (Physical modeling with pluck attack & wooden resonance)
    playGuitarString(frequency, duration = 2.4) {
      this.initContext();
      if (!this.ctx) return;
      try {
        const t = this.ctx.currentTime;
        
        // Main fundamental oscillator (warm triangle)
        const osc = this.ctx.createOscillator();
        // High harmonic oscillator (bright acoustic steel/nylon sparkle)
        const oscHarmonic = this.ctx.createOscillator();
        // Subtle octave sub-tone for body depth
        const oscBody = this.ctx.createOscillator();
        
        const gainNode = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();
        const bodyFilter = this.ctx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(frequency, t);

        oscHarmonic.type = 'sawtooth';
        oscHarmonic.frequency.setValueAtTime(frequency * 2, t);

        oscBody.type = 'sine';
        oscBody.frequency.setValueAtTime(frequency, t);

        // Acoustic body resonant filter
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(3200, t);
        filter.frequency.exponentialRampToValueAtTime(Math.max(180, frequency * 1.5), t + duration);
        filter.Q.setValueAtTime(3.5, t);

        // Fast initial pluck attack & smooth exponential decay
        gainNode.gain.setValueAtTime(0.001, t);
        gainNode.gain.linearRampToValueAtTime(0.38, t + 0.015);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, t + duration);

        osc.connect(filter);
        oscHarmonic.connect(filter);
        oscBody.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.ctx.destination);

        osc.start(t);
        oscHarmonic.start(t);
        oscBody.start(t);
        osc.stop(t + duration);
        oscHarmonic.stop(t + duration);
        oscBody.stop(t + duration);
      } catch (e) {}
    }

    // Acoustic Guitar Chord Strum (Sequential realistic strumming)
    playGuitarChord(chordName) {
      const chordMap = {
        'C': [130.81, 164.81, 196.00, 261.63, 329.63, 523.25],
        'G': [98.00, 123.47, 146.83, 196.00, 246.94, 392.00],
        'Am': [110.00, 164.81, 220.00, 261.63, 329.63, 440.00],
        'F': [87.31, 130.81, 174.61, 220.00, 261.63, 349.23],
        'Em': [82.41, 123.47, 164.81, 196.00, 246.94, 329.63],
        'D': [146.83, 220.00, 293.66, 369.99, 440.00, 587.33]
      };
      const freqs = chordMap[chordName] || chordMap['C'];
      freqs.forEach((freq, idx) => {
        setTimeout(() => {
          this.playGuitarString(freq, 2.5);
        }, idx * 32);
      });
    }

    playPopSound() {
      this.initContext();
      if (!this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(480, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.28, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
      } catch (e) {}
    }

    playCheerSound() {
      this.initContext();
      const chord = [523.25, 659.25, 783.99, 1046.50];
      chord.forEach((f, i) => {
        setTimeout(() => this.playTone(f, 0.6, 'sine', 0.14), i * 90);
      });
    }

    playMagicChime() {
      this.initContext();
      const harp = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
      harp.forEach((f, i) => {
        setTimeout(() => this.playTone(f, 0.7, 'sine', 0.12), i * 65);
      });
    }

    playCelebrationFanfare() {
      this.initContext();
      const fanfare = [
        { f: 523.25, d: 0.15 }, { f: 523.25, d: 0.15 }, { f: 523.25, d: 0.15 },
        { f: 659.25, d: 0.4 }, { f: 783.99, d: 0.8 }, { f: 1046.50, d: 1.2 }
      ];
      fanfare.forEach((n, i) => {
        setTimeout(() => this.playTone(n.f, n.d, 'triangle', 0.2), i * 160);
      });
    }

    playBlowSound() {
      this.initContext();
      if (!this.ctx) return;
      try {
        const node = this.ctx.createBufferSource();
        const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.4, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < buffer.length; i++) data[i] = Math.random() * 2 - 1;
        node.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, this.ctx.currentTime);
        filter.frequency.linearRampToValueAtTime(200, this.ctx.currentTime + 0.4);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);

        node.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        node.start();
        node.stop(this.ctx.currentTime + 0.4);
      } catch (e) {}
    }
  }

  const audioSynth = new RomanticAudioEngine();

  // Unlock AudioContext on first user gesture
  const unlockAudio = () => {
    audioSynth.initContext();
    window.removeEventListener('click', unlockAudio);
    window.removeEventListener('touchstart', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
  };
  window.addEventListener('click', unlockAudio, { passive: true });
  window.addEventListener('touchstart', unlockAudio, { passive: true });
  window.addEventListener('keydown', unlockAudio, { passive: true });

  // Safe HTML Escaper Utility
  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // --------------------------------------------------------------------------
  // 4. HEADER DUAL-MODE MUSIC PLAYER & CONFETTI CANNON
  // --------------------------------------------------------------------------
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  const musicModeToggle = document.getElementById('musicModeBtn') || document.getElementById('musicModeToggle');
  const musicPill = document.getElementById('musicPill');
  const musicStatusText = document.getElementById('musicStatusText');
  const musicModeLabel = document.getElementById('musicModeLabel');
  const confettiCannonBtn = document.getElementById('confettiCannonBtn');

  function stopBackgroundMusic() {
    if (state.isMusicPlaying) {
      state.isMusicPlaying = false;
      audioSynth.stopMelody();
      if (musicPill) musicPill.classList.remove('playing');
      if (musicStatusText) musicStatusText.textContent = 'Play Melody';
    }
  }

  function startBackgroundMusic() {
    if (!state.isMusicPlaying) {
      state.isMusicPlaying = true;
      audioSynth.startMelody();
      if (musicPill) musicPill.classList.add('playing');
      if (musicStatusText) musicStatusText.textContent = 'Pause Music';
    }
  }

  if (musicToggleBtn) {
    musicToggleBtn.addEventListener('click', () => {
      if (state.isMusicPlaying) {
        stopBackgroundMusic();
      } else {
        // Stop lounge instruments before starting background music
        if (typeof stopAllLoungeMusic === 'function') stopAllLoungeMusic();
        startBackgroundMusic();
      }
    });
  }

  // --------------------------------------------------------------------------
  // CANDLELIGHT INTIMATE AMBIANCE CONTROLLER
  // --------------------------------------------------------------------------
  const candlelightToggleBtn = document.getElementById('candlelightToggleBtn');
  let isCandlelightActive = false;

  if (candlelightToggleBtn) {
    candlelightToggleBtn.addEventListener('click', () => {
      isCandlelightActive = !isCandlelightActive;
      document.body.classList.toggle('candlelight-active', isCandlelightActive);
      candlelightToggleBtn.classList.toggle('active', isCandlelightActive);
      const span = candlelightToggleBtn.querySelector('span');
      if (span) span.textContent = isCandlelightActive ? 'Candlelight: On' : 'Candlelight';

      if (isCandlelightActive) {
        audioSynth.playTone(440, 0.4, 'sine');
        showToast('Soft Candlelight Intimate Ambiance Activated 🕯️✨ Enjoy the warm glow.');
      } else {
        audioSynth.playPopSound();
        showToast('Candlelight ambiance turned off');
      }
    });
  }


  if (musicModeToggle) {
    musicModeToggle.addEventListener('click', () => {
      state.musicMode = state.musicMode === 'piano' ? 'birthday' : 'piano';
      if (musicModeLabel) {
        musicModeLabel.textContent = state.musicMode === 'piano' ? '🎹 Piano' : '🎂 Birthday';
      }
      if (state.isMusicPlaying) {
        audioSynth.stopMelody();
        audioSynth.startMelody();
      }
      showToast(`Soundtrack changed to ${state.musicMode === 'piano' ? 'Romantic Piano Arpeggios' : 'Birthday Melody'} 🎶`);
    });
  }

  if (confettiCannonBtn) {
    confettiCannonBtn.addEventListener('click', () => {
      audioSynth.playCelebrationFanfare();
      burstConfetti(window.innerWidth * 0.25, window.innerHeight * 0.4, 60);
      burstConfetti(window.innerWidth * 0.75, window.innerHeight * 0.4, 60);
      burstConfetti(window.innerWidth * 0.5, window.innerHeight * 0.3, 80);
      showToast('🎉 Radiant Birthday Confetti Cannon Blasted! ✨');
    });
  }

  // --------------------------------------------------------------------------
  // 5. BACKGROUND CANVAS PARTICLES & CONFETTI ENGINE
  // --------------------------------------------------------------------------
  const particleCanvas = document.getElementById('particleCanvas');
  const confettiCanvas = document.getElementById('confettiCanvas');
  let pCtx = particleCanvas ? particleCanvas.getContext('2d') : null;
  let cCtx = confettiCanvas ? confettiCanvas.getContext('2d') : null;

  function resizeCanvases() {
    if (particleCanvas) {
      particleCanvas.width = window.innerWidth;
      particleCanvas.height = window.innerHeight;
    }
    if (confettiCanvas) {
      confettiCanvas.width = window.innerWidth;
      confettiCanvas.height = window.innerHeight;
    }
  }
  window.addEventListener('resize', resizeCanvases);
  resizeCanvases();

  // Floating background cosmic sparkles
  const bgParticles = [];
  for (let i = 0; i < 45; i++) {
    bgParticles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: Math.random() * 2 + 0.8,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -Math.random() * 0.4 - 0.2,
      alpha: Math.random() * 0.7 + 0.2,
      pulse: Math.random() * 0.02 + 0.01
    });
  }

  function renderBackgroundParticles() {
    if (!pCtx || !particleCanvas) return;
    pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

    bgParticles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.alpha += Math.sin(Date.now() * p.pulse) * 0.01;

      if (p.y < -10) p.y = particleCanvas.height + 10;
      if (p.x < -10) p.x = particleCanvas.width + 10;
      if (p.x > particleCanvas.width + 10) p.x = -10;

      pCtx.beginPath();
      pCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      pCtx.fillStyle = `rgba(251, 191, 36, ${Math.max(0.1, Math.min(0.8, p.alpha))})`;
      pCtx.fill();
    });

    if (!document.hidden) {
      requestAnimationFrame(renderBackgroundParticles);
    }
  }

  // Only render particles if page is active
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      requestAnimationFrame(renderBackgroundParticles);
    }
  });
  renderBackgroundParticles();

  // 2D Confetti Particle Burst Engine (Zero-Idle-Lag Architecture)
  let activeConfetti = [];
  let confettiAnimId = null;
  const confettiColors = ['#f43f5e', '#fb7185', '#c084fc', '#fbbf24', '#fde047', '#38bdf8', '#34d399', '#ffffff'];

  function burstConfetti(originX, originY, count = 60) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 9 + 4;
      activeConfetti.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        size: Math.random() * 8 + 4,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 12,
        gravity: 0.18,
        drag: 0.98,
        alpha: 1
      });
    }

    if (!confettiAnimId) {
      confettiAnimId = requestAnimationFrame(renderConfetti);
    }
  }

  function renderConfetti() {
    if (!cCtx || !confettiCanvas) return;
    cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    if (activeConfetti.length === 0) {
      confettiAnimId = null;
      return; // Stop RAF loop when idle!
    }

    for (let i = activeConfetti.length - 1; i >= 0; i--) {
      const c = activeConfetti[i];
      c.x += c.vx;
      c.y += c.vy;
      c.vy += c.gravity;
      c.vx *= c.drag;
      c.rotation += c.rotSpeed;
      c.alpha -= 0.014;

      if (c.alpha <= 0 || c.y > confettiCanvas.height + 50) {
        activeConfetti.splice(i, 1);
        continue;
      }

      cCtx.save();
      cCtx.translate(c.x, c.y);
      cCtx.rotate((c.rotation * Math.PI) / 180);
      cCtx.globalAlpha = Math.max(0, c.alpha);
      cCtx.fillStyle = c.color;
      cCtx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size * 0.7);
      cCtx.restore();
    }

    confettiAnimId = requestAnimationFrame(renderConfetti);
  }

  // --------------------------------------------------------------------------
  // 5.5 MASTER ROYAL BIRTHDAY PASSCODE & OVERLAYS CONTROLLER
  // --------------------------------------------------------------------------
  const TARGET_LAUNCH_DATE = new Date('2026-09-21T23:00:00+05:30').getTime();
  const MASTER_PASSCODE = '22092000';
  const mainApp = document.getElementById('mainApp');
  const introOverlay = document.getElementById('introOverlay');
  const giftBoxTrigger = document.getElementById('giftBoxTrigger');
  const openGiftBtn = document.getElementById('openGiftBtn');
  const pagePasscodeOverlay = document.getElementById('pagePasscodeOverlay');
  const pagePasscodeInput = document.getElementById('pagePasscodeInput');
  const pagePasscodeSubmitBtn = document.getElementById('pagePasscodeSubmitBtn');
  const pagePasscodeFeedback = document.getElementById('pagePasscodeFeedback');
  const togglePasscodeVisibilityBtn = document.getElementById('togglePasscodeVisibilityBtn');
  const passcodeEyeIcon = document.getElementById('passcodeEyeIcon');
  const pagePasscodeHintToggleBtn = document.getElementById('pagePasscodeHintToggleBtn');
  const pagePasscodeHintBox = document.getElementById('pagePasscodeHintBox');
  const pagePasscodeKeypad = document.getElementById('pagePasscodeKeypad');

  let isPagePasscodeVerifying = false;
  let pagePasscodeErrorTimer = null;

  const VALID_PASSCODES = ['2912', '22092000'];

  function isPasscodeMatch(pin) {
    if (!pin) return false;
    const cleanDigits = String(pin).replace(/[^0-9]/g, '');
    return cleanDigits === '2912' || cleanDigits === '22092000';
  }

  function checkPasscodeAuth() {
    try {
      // Purge stale passcode tokens so Welcome Screen and lockscreen verification show reliably on every visit/reload
      localStorage.removeItem('eternal_love_passcode_auth');
      sessionStorage.removeItem('eternal_love_passcode_auth');
    } catch(e) {}

    // Stage 1: Always display the surprise gift unboxing Welcome Screen first on visit/reload
    if (pagePasscodeOverlay) {
      pagePasscodeOverlay.classList.remove('unlocked', 'fade-out');
      pagePasscodeOverlay.style.display = 'none';
      pagePasscodeOverlay.style.opacity = '0';
      pagePasscodeOverlay.style.visibility = 'hidden';
      pagePasscodeOverlay.style.pointerEvents = 'none';
    }
    if (introOverlay) {
      introOverlay.classList.remove('fade-out', 'unlocked', 'hidden');
      introOverlay.style.display = 'flex';
      introOverlay.style.opacity = '1';
      introOverlay.style.visibility = 'visible';
      introOverlay.style.pointerEvents = 'auto';
    }
    if (mainApp) {
      mainApp.classList.add('hidden');
      mainApp.style.display = 'none';
      mainApp.style.opacity = '0';
      mainApp.style.visibility = 'hidden';
    }
  }

  // Initial check on load
  checkPasscodeAuth();

  function resetPagePasscodeError() {
    if (pagePasscodeErrorTimer) {
      clearTimeout(pagePasscodeErrorTimer);
      pagePasscodeErrorTimer = null;
    }
    for (let i = 0; i < 8; i++) {
      const dot = document.getElementById('pDot' + i);
      if (dot) dot.classList.remove('error');
    }
    if (pagePasscodeInput) {
      pagePasscodeInput.dataset.hasError = 'false';
    }
  }

  function updatePasscodeDots(val) {
    for (let i = 0; i < 8; i++) {
      const dot = document.getElementById('pDot' + i);
      if (!dot) continue;
      if (i < val.length) {
        dot.textContent = '•';
        dot.classList.add('active');
        dot.classList.remove('error', 'success');
      } else {
        dot.textContent = '•';
        dot.classList.remove('active', 'error', 'success');
      }
    }
  }

  function highlightPageKeypadBtn(key) {
    if (!pagePasscodeKeypad) return;
    const btn = pagePasscodeKeypad.querySelector(`.pk-btn[data-key="${key}"]`);
    if (btn) {
      btn.classList.add('pressed');
      setTimeout(() => btn.classList.remove('pressed'), 150);
    }
  }

  function verifyPagePasscode() {
    if (!pagePasscodeInput) return;
    const rawVal = pagePasscodeInput.value.trim();
    const isMaster = isPasscodeMatch(rawVal);

    if (isMaster) {
      isPagePasscodeVerifying = true;
      resetPagePasscodeError();

      // Success State
      if (pagePasscodeFeedback) {
        pagePasscodeFeedback.className = 'passcode-feedback success';
        pagePasscodeFeedback.innerHTML = '<i class="fa-solid fa-crown"></i> Passcode Verified! Opening Birthday Surprise 👑';
      }

      for (let i = 0; i < 8; i++) {
        const dot = document.getElementById('pDot' + i);
        if (dot) dot.classList.add('success');
      }

      if (audioSynth && audioSynth.playCelebrationFanfare) audioSynth.playCelebrationFanfare();
      if (typeof burstConfetti === 'function') burstConfetti(window.innerWidth / 2, window.innerHeight / 2, 80);

      try {
        sessionStorage.setItem('eternal_love_passcode_auth', 'authenticated_' + rawVal);
        sessionStorage.setItem('birthday_surprise_unlocked', 'true');
        localStorage.removeItem('eternal_love_passcode_auth');
      } catch(e) {}

      setTimeout(() => {
        if (pagePasscodeOverlay) {
          pagePasscodeOverlay.classList.add('unlocked', 'fade-out', 'hidden');
          pagePasscodeOverlay.style.display = 'none';
        }
        if (typeof unboxBirthdaySurprise === 'function') {
          unboxBirthdaySurprise(true);
        }
        isPagePasscodeVerifying = false;
      }, 300);
    } else {
      isPagePasscodeVerifying = false;
      // Failure State
      if (pagePasscodeFeedback) {
        pagePasscodeFeedback.className = 'passcode-feedback error';
        pagePasscodeFeedback.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Incorrect passcode! Hint: My Love Nishika\'s Date of Birth in DDMMYYYY format 💕';
      }

      const card = document.querySelector('.page-passcode-card');
      if (card) {
        card.classList.add('shake');
        setTimeout(() => card.classList.remove('shake'), 600);
      }

      for (let i = 0; i < 8; i++) {
        const dot = document.getElementById('pDot' + i);
        if (dot) dot.classList.add('error');
      }

      if (audioSynth && audioSynth.playChime) audioSynth.playChime(220, 0.3); // Low error tone
      pagePasscodeInput.dataset.hasError = 'true';

      if (pagePasscodeErrorTimer) clearTimeout(pagePasscodeErrorTimer);
      pagePasscodeErrorTimer = setTimeout(() => {
        if (pagePasscodeInput && pagePasscodeInput.dataset.hasError === 'true') {
          pagePasscodeInput.value = '';
          updatePasscodeDots('');
          resetPagePasscodeError();
          if (pagePasscodeFeedback) {
            pagePasscodeFeedback.className = 'passcode-feedback';
            pagePasscodeFeedback.innerHTML = '';
          }
        }
      }, 800);
    }
  }

  if (pagePasscodeInput) {
    pagePasscodeInput.addEventListener('input', (e) => {
      if (pagePasscodeInput.dataset.hasError === 'true') {
        resetPagePasscodeError();
      }
      const digitsOnly = e.target.value.replace(/[^0-9]/g, '');
      if (e.target.value !== digitsOnly) {
        e.target.value = digitsOnly;
      }
      const val = e.target.value;
      updatePasscodeDots(val);
      if (pagePasscodeFeedback && pagePasscodeFeedback.classList.contains('error')) {
        pagePasscodeFeedback.className = 'passcode-feedback';
        pagePasscodeFeedback.innerHTML = '';
      }
      if (val.length > 0) {
        const lastChar = val[val.length - 1];
        highlightPageKeypadBtn(lastChar);
        if (audioSynth && audioSynth.playChime) {
          audioSynth.playChime(523.25 + (val.length * 35), 0.1);
        }
      }
      if (val.length === 8) {
        verifyPagePasscode();
      }
    });

    pagePasscodeInput.addEventListener('keydown', (e) => {
      let digit = null;
      if (/^[0-9]$/.test(e.key)) {
        digit = e.key;
      } else if (e.code) {
        const m = e.code.match(/^(Digit|Numpad)([0-9])$/);
        if (m) digit = m[2];
      }

      if (digit !== null) {
        if (pagePasscodeInput.dataset.hasError === 'true' || pagePasscodeInput.value.length >= 8) {
          e.preventDefault();
          pagePasscodeInput.value = digit;
          resetPagePasscodeError();
          updatePasscodeDots(digit);
          highlightPageKeypadBtn(digit);
          if (audioSynth && audioSynth.playChime) audioSynth.playChime(523.25 + 35, 0.1);
          if (pagePasscodeFeedback) {
            pagePasscodeFeedback.className = 'passcode-feedback';
            pagePasscodeFeedback.innerHTML = '';
          }
          return;
        }
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        verifyPagePasscode();
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        highlightPageKeypadBtn('BACK');
        if (pagePasscodeInput.dataset.hasError === 'true') {
          resetPagePasscodeError();
        }
      } else if (e.key.toLowerCase() === 'c' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        pagePasscodeInput.value = '';
        resetPagePasscodeError();
        updatePasscodeDots('');
        highlightPageKeypadBtn('C');
        if (pagePasscodeFeedback) {
          pagePasscodeFeedback.className = 'passcode-feedback';
          pagePasscodeFeedback.innerHTML = '';
        }
      }
    });

    setTimeout(() => {
      if (pagePasscodeOverlay && pagePasscodeOverlay.style.display !== 'none' && !pagePasscodeOverlay.classList.contains('unlocked')) {
        pagePasscodeInput.focus();
      }
    }, 200);
  }

  // Ensure autofocus when clicking anywhere on passcode card
  const passcodeCard = document.querySelector('.page-passcode-card');
  if (passcodeCard && pagePasscodeInput) {
    passcodeCard.addEventListener('click', (e) => {
      if (!e.target.closest('.pk-btn') && !e.target.closest('#togglePasscodeVisibilityBtn') && !e.target.closest('#pagePasscodeHintToggleBtn')) {
        pagePasscodeInput.focus();
      }
    });
  }

  if (pagePasscodeSubmitBtn) {
    pagePasscodeSubmitBtn.addEventListener('click', verifyPagePasscode);
  }

  const closePagePasscodeBtn = document.getElementById('closePagePasscodeBtn');
  function closePasscodeOverlay() {
    if (pagePasscodeOverlay) {
      pagePasscodeOverlay.classList.add('fade-out');
      setTimeout(() => {
        if (pagePasscodeOverlay) {
          pagePasscodeOverlay.style.display = 'none';
          pagePasscodeOverlay.classList.remove('fade-out');
        }
      }, 200);
    }
  }
  if (closePagePasscodeBtn) closePagePasscodeBtn.addEventListener('click', closePasscodeOverlay);
  if (pagePasscodeOverlay) {
    pagePasscodeOverlay.addEventListener('click', (e) => {
      if (e.target === pagePasscodeOverlay) closePasscodeOverlay();
    });
  }

  if (togglePasscodeVisibilityBtn && pagePasscodeInput && passcodeEyeIcon) {
    togglePasscodeVisibilityBtn.addEventListener('click', () => {
      if (pagePasscodeInput.type === 'password') {
        pagePasscodeInput.type = 'text';
        passcodeEyeIcon.className = 'fa-solid fa-eye-slash';
      } else {
        pagePasscodeInput.type = 'password';
        passcodeEyeIcon.className = 'fa-solid fa-eye';
      }
    });
  }

  if (pagePasscodeHintToggleBtn && pagePasscodeHintBox) {
    pagePasscodeHintToggleBtn.addEventListener('click', () => {
      pagePasscodeHintBox.classList.toggle('active');
      audioSynth.playChime(659.25, 0.2);
    });
  }


  // Glass Keypad click handler
  if (pagePasscodeKeypad && pagePasscodeInput) {
    pagePasscodeKeypad.addEventListener('click', (e) => {
      const btn = e.target.closest('.pk-btn');
      if (!btn) return;
      const key = btn.dataset.key;
      highlightPageKeypadBtn(key);
      if (audioSynth && audioSynth.playChime) audioSynth.playChime(523.25 + (pagePasscodeInput.value.length * 30), 0.1);

      if (pagePasscodeInput.dataset.hasError === 'true') {
        pagePasscodeInput.value = '';
        resetPagePasscodeError();
        updatePasscodeDots('');
      }

      if (key === 'C') {
        pagePasscodeInput.value = '';
        resetPagePasscodeError();
        if (pagePasscodeFeedback) {
          pagePasscodeFeedback.className = 'passcode-feedback';
          pagePasscodeFeedback.innerHTML = '';
        }
      } else if (key === 'BACK') {
        pagePasscodeInput.value = pagePasscodeInput.value.slice(0, -1);
      } else if (key && pagePasscodeInput.value.length < 8) {
        pagePasscodeInput.value += key;
      }

      updatePasscodeDots(pagePasscodeInput.value);
      if (pagePasscodeFeedback && key !== 'C' && pagePasscodeFeedback.classList.contains('error')) {
        pagePasscodeFeedback.className = 'passcode-feedback';
        pagePasscodeFeedback.innerHTML = '';
      }
      if (pagePasscodeInput.value.length === 8) {
        verifyPagePasscode();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 6. STAGE 1: 3D GIFT BOX UNBOXING CEREMONY
  // --------------------------------------------------------------------------
  let isSurpriseUnboxing = false;

  function unboxBirthdaySurprise(immediate = false) {
    if (isSurpriseUnboxing) return;
    isSurpriseUnboxing = true;

    try {
      if (giftBoxTrigger) giftBoxTrigger.classList.add('opening');
      if (openGiftBtn) {
        openGiftBtn.style.transform = 'scale(0.95)';
        openGiftBtn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles fa-spin"></i> <span>Unboxing Magic...</span>';
      }

      if (audioSynth) {
        try {
          if (audioSynth.ctx && audioSynth.ctx.state === 'suspended') {
            audioSynth.ctx.resume();
          }
          if (audioSynth.playCelebrationFanfare) audioSynth.playCelebrationFanfare();
        } catch (e) {
          console.warn('Audio play error in unbox:', e);
        }
      }

      if (typeof burstConfetti === 'function') {
        try {
          burstConfetti(window.innerWidth / 2, window.innerHeight / 2, 120);
          setTimeout(() => burstConfetti(window.innerWidth * 0.3, window.innerHeight * 0.4, 60), 250);
          setTimeout(() => burstConfetti(window.innerWidth * 0.7, window.innerHeight * 0.4, 60), 450);
        } catch (e) {
          console.warn('Confetti error in unbox:', e);
        }
      }
    } catch (err) {
      console.warn('Initial unboxing animation error:', err);
    }

    const delay = immediate ? 50 : 400;

    setTimeout(() => {
      try {
        const iOverlay = introOverlay || document.getElementById('introOverlay');
        const pOverlay = pagePasscodeOverlay || document.getElementById('pagePasscodeOverlay');
        const mApp = mainApp || document.getElementById('mainApp');

        if (iOverlay) {
          iOverlay.classList.add('fade-out', 'unlocked', 'hidden');
          iOverlay.style.opacity = '0';
          iOverlay.style.visibility = 'hidden';
          iOverlay.style.pointerEvents = 'none';
          iOverlay.style.display = 'none';
        }
        if (pOverlay) {
          pOverlay.classList.add('unlocked', 'fade-out', 'hidden');
          pOverlay.style.opacity = '0';
          pOverlay.style.visibility = 'hidden';
          pOverlay.style.pointerEvents = 'none';
          pOverlay.style.display = 'none';
        }
        if (mApp) {
          mApp.classList.remove('hidden');
          mApp.style.display = 'block';
          mApp.style.visibility = 'visible';
          mApp.style.opacity = '1';
        }

        try {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (e) {}

        if (!state.isMusicPlaying && musicToggleBtn && audioSynth) {
          try {
            state.isMusicPlaying = true;
            audioSynth.startMelody();
            if (musicPill) musicPill.classList.add('playing');
            if (musicStatusText) musicStatusText.textContent = 'Pause Music';
          } catch (e) {
            console.warn('Music auto-start warning:', e);
          }
        }

        if (typeof showToast === 'function') {
          showToast(`👑 Welcome to your royal celebration, My Love ${state.recipientName}! 💖✨`);
        }
      } catch (err) {
        console.error('Error completing unbox transition:', err);
      } finally {
        isSurpriseUnboxing = false;
      }
    }, delay);
  }

  function handleGiftBoxClick(e) {
    if (e && e.stopPropagation) e.stopPropagation();

    const isPreLaunch = Date.now() < TARGET_LAUNCH_DATE;
    const pOverlay = pagePasscodeOverlay || document.getElementById('pagePasscodeOverlay');
    if (pOverlay && isPreLaunch) {
      pOverlay.classList.remove('unlocked', 'fade-out', 'hidden');
      pOverlay.style.display = 'flex';
      pOverlay.style.opacity = '1';
      pOverlay.style.visibility = 'visible';
      pOverlay.style.pointerEvents = 'auto';
      if (pagePasscodeInput) {
        pagePasscodeInput.value = '';
        updatePasscodeDots('');
        resetPagePasscodeError();
        setTimeout(() => pagePasscodeInput.focus(), 150);
      }
      if (audioSynth && audioSynth.playChime) {
        audioSynth.playChime(659.25, 0.2);
      }
      if (pagePasscodeFeedback) {
        pagePasscodeFeedback.className = 'passcode-feedback';
        pagePasscodeFeedback.innerHTML = '✨ Enter My Love Nishika\'s Royal Birthday Passcode (22092000) to open your surprise!';
      }
      return;
    }

    unboxBirthdaySurprise(false);
  }

  // Expose globally for inline and external triggers
  window.handleGiftBoxClick = handleGiftBoxClick;
  window.unboxBirthdaySurprise = unboxBirthdaySurprise;

  if (giftBoxTrigger) {
    giftBoxTrigger.addEventListener('click', (e) => {
      handleGiftBoxClick(e);
    });
  }
  if (openGiftBtn) {
    openGiftBtn.addEventListener('click', (e) => {
      handleGiftBoxClick(e);
    });
  }
  const introContentElem = document.querySelector('.intro-content');
  if (introContentElem) {
    introContentElem.addEventListener('click', (e) => {
      if (!e.target.closest('#openGiftBtn') && !e.target.closest('#giftBoxTrigger')) {
        handleGiftBoxClick(e);
      }
    });
  }
  if (introOverlay) {
    introOverlay.addEventListener('click', (e) => {
      if (e.target === introOverlay && !isSurpriseUnboxing) {
        handleGiftBoxClick(e);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 7. LIVE RELATIONSHIP CLOCK COUNTER
  // --------------------------------------------------------------------------
  function updateLoveTimer() {
    const start = new Date(state.startDate);
    const now = new Date();
    if (isNaN(start.getTime())) return;

    let diffMs = now - start;
    if (diffMs < 0) diffMs = 0;

    const totalSecs = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSecs / 86400);
    const hours = Math.floor((totalSecs % 86400) / 3600);
    const minutes = Math.floor((totalSecs % 3600) / 60);
    const seconds = totalSecs % 60;

    const years = Math.floor(days / 365.25);
    const remainingDays = Math.floor(days % 365.25);
    const months = Math.floor(remainingDays / 30.4375);
    const exactDays = Math.floor(remainingDays % 30.4375);

    const setNum = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = String(val).padStart(2, '0');
      if (id === 'timerMins') {
        const alt = document.getElementById('timerMinutes');
        if (alt) alt.textContent = String(val).padStart(2, '0');
      }
      if (id === 'timerSecs') {
        const alt = document.getElementById('timerSeconds');
        if (alt) alt.textContent = String(val).padStart(2, '0');
      }
    };

    setNum('timerYears', years);
    setNum('timerMonths', months);
    setNum('timerDays', exactDays);
    setNum('timerHours', hours);
    setNum('timerMins', minutes);
    setNum('timerSecs', seconds);
  }
  setInterval(updateLoveTimer, 1000);
  updateLoveTimer();

  // --------------------------------------------------------------------------
  // 8. QUICK ACTION BAR (CHEERS, LOVE HEARTS, FIREWORKS)
  // --------------------------------------------------------------------------
  const cheerBtn = document.getElementById('cheerBtn');
  const loveBtn = document.getElementById('loveBtn');
  const fireworkTriggerBtn = document.getElementById('fireworkTriggerBtn');
  const cheerCountEl = document.getElementById('cheerCount');
  const loveCountEl = document.getElementById('loveCount');

  if (cheerBtn) {
    cheerBtn.addEventListener('click', (e) => {
      state.cheers++;
      if (cheerCountEl) cheerCountEl.textContent = state.cheers;
      saveState();

      audioSynth.playCheerSound();
      burstConfetti(e.clientX, e.clientY, 40);
      showToast('Cheers to the Birthday Love! 🥂✨');
    });
  }

  // Infinite Floating Love Hearts Fountain
  function launchInfiniteLoveHearts() {
    const emojis = ['💖', '💕', '💘', '💎', '✨', '🌹', '🥰', '👑', '💗', '💞'];
    for (let i = 0; i < 35; i++) {
      setTimeout(() => {
        const heart = document.createElement('div');
        heart.className = 'floating-love-burst-heart';
        heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];

        const startX = window.innerWidth * 0.15 + Math.random() * (window.innerWidth * 0.7);
        const startY = window.innerHeight * 0.85 + Math.random() * 50;
        heart.style.left = `${startX}px`;
        heart.style.top = `${startY}px`;

        const dx = (Math.random() - 0.5) * (window.innerWidth * 0.6);
        const dy = -(window.innerHeight * 0.6 + Math.random() * (window.innerHeight * 0.35));
        const rot = Math.floor((Math.random() - 0.5) * 90);
        const scale = (Math.random() * 0.8 + 1.2).toFixed(2);

        heart.style.setProperty('--dx', `${dx}px`);
        heart.style.setProperty('--dy', `${dy}px`);
        heart.style.setProperty('--rot', `${rot}deg`);
        heart.style.setProperty('--scale', scale);

        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 2300);
      }, i * 35);
    }
  }

  if (loveBtn) {
    loveBtn.addEventListener('click', (e) => {
      state.loves += 5;
      if (loveCountEl) loveCountEl.textContent = state.loves;
      saveState();

      audioSynth.playPopSound();
      launchInfiniteLoveHearts();
      burstConfetti(e.clientX || window.innerWidth / 2, e.clientY || window.innerHeight * 0.7, 30);
      showToast('Sent 100x Infinite Love & Radiant Hearts! 💖');
    });
  }

  // Fireworks Launch Salvo
  function launchFireworksSalvo() {
    const launchPoints = [
      { x: window.innerWidth * 0.2, y: window.innerHeight * 0.3 },
      { x: window.innerWidth * 0.5, y: window.innerHeight * 0.2 },
      { x: window.innerWidth * 0.8, y: window.innerHeight * 0.35 },
      { x: window.innerWidth * 0.35, y: window.innerHeight * 0.25 },
      { x: window.innerWidth * 0.65, y: window.innerHeight * 0.22 }
    ];

    launchPoints.forEach((pt, idx) => {
      setTimeout(() => {
        burstConfetti(pt.x, pt.y, 70);
        audioSynth.playTone(300 + idx * 80, 0.4, 'triangle', 0.25);
      }, idx * 280);
    });
  }

  if (fireworkTriggerBtn) {
    fireworkTriggerBtn.addEventListener('click', () => {
      audioSynth.playCelebrationFanfare();
      launchFireworksSalvo();
      showToast('Launching Royal Birthday Fireworks to the Sky! 🎆✨');
    });
  }

  // --------------------------------------------------------------------------
  // 9. SECTION 1: WAX-SEALED LOVE LETTER & TYPEWRITER ANIMATION
  // --------------------------------------------------------------------------
  const waxSealBtn = document.getElementById('waxSealBtn');
  const envelopeFlap = document.getElementById('envelopeFlap');
  const typewriterText = document.getElementById('typewriterText');
  const replayLetterBtn = document.getElementById('replayLetterBtn');

  function getPersonalizedLetter() {
    return `My dearest ${state.recipientName}, on this magical day, I celebrate the most incredible gift the universe ever brought into my life — you. Your laughter illuminates every room, your kindness brings peace to my heart, and your smile is my favorite view in the world. May your new year of life overflow with boundless joy, wild adventures, radiant health, and all the love you so effortlessly give to everyone around you. ${state.message} I love you endlessly, today and for all my tomorrows.`;
  }

  let typeTimer = null;
  function runTypewriter(text, element) {
    if (!element) return;
    element.textContent = '';
    if (typeTimer) clearInterval(typeTimer);

    let charIdx = 0;
    typeTimer = setInterval(() => {
      if (charIdx < text.length) {
        element.textContent += text.charAt(charIdx);
        charIdx++;
      } else {
        clearInterval(typeTimer);
      }
    }, 28);
  }

  function openLoveLetter() {
    if (envelopeFlap) envelopeFlap.classList.add('opened');
    audioSynth.playMagicChime();
    burstConfetti(window.innerWidth / 2, window.innerHeight * 0.5, 45);

    setTimeout(() => {
      runTypewriter(getPersonalizedLetter(), typewriterText);
    }, 500);
  }

  if (waxSealBtn) waxSealBtn.addEventListener('click', openLoveLetter);
  if (replayLetterBtn) {
    replayLetterBtn.addEventListener('click', () => {
      runTypewriter(getPersonalizedLetter(), typewriterText);
      audioSynth.playPopSound();
    });
  }

  // --------------------------------------------------------------------------
  // 10. SECTION 3: 3D CAKE & CANDLE BLOWOUT CEREMONY
  // --------------------------------------------------------------------------
  const candles = document.querySelectorAll('.candle');
  const blowCandlesBtn = document.getElementById('blowCandlesBtn');
  const relightCandlesBtn = document.getElementById('relightCandlesBtn');
  const cakeStatus = document.getElementById('cakeStatusText') || document.getElementById('cakeStatus');
  const wishModal = document.getElementById('wishModal');
  const timeCapsuleForm = document.getElementById('timeCapsuleForm');
  const secretWishInput = document.getElementById('secretWishInput');
  const closeWishModalBtn = document.getElementById('closeWishModalBtn');

  function blowOutCandles() {
    candles.forEach((c, idx) => {
      setTimeout(() => {
        c.classList.add('extinguished');
      }, idx * 120);
    });

    state.candlesLit = false;
    audioSynth.playBlowSound();

    if (cakeStatus) cakeStatus.textContent = 'Candles Extinguished! Secret wish unlocked! 🌟';
    if (blowCandlesBtn) blowCandlesBtn.style.display = 'none';
    if (relightCandlesBtn) relightCandlesBtn.style.display = 'inline-flex';

    setTimeout(() => {
      openModal(wishModal);
      audioSynth.playMagicChime();
      burstConfetti(window.innerWidth / 2, window.innerHeight * 0.4, 75);
    }, 900);
  }

  function relightCandles() {
    candles.forEach(c => c.classList.remove('extinguished'));
    state.candlesLit = true;
    audioSynth.playPopSound();

    if (cakeStatus) cakeStatus.textContent = 'All 5 Candles Glowing Warmly ✨';
    if (blowCandlesBtn) blowCandlesBtn.style.display = 'inline-flex';
    if (relightCandlesBtn) relightCandlesBtn.style.display = 'none';
  }

  if (blowCandlesBtn) blowCandlesBtn.addEventListener('click', blowOutCandles);
  if (relightCandlesBtn) relightCandlesBtn.addEventListener('click', relightCandles);

  // --------------------------------------------------------------------------
  // SECRET BIRTHDAY WISH VAULT MODAL CONTROLLER
  // --------------------------------------------------------------------------
  const openWishVaultBtn = document.getElementById('openWishVaultBtn');
  const secretWishVaultModal = document.getElementById('secretWishVaultModal');
  const closeWishVaultModalBtn = document.getElementById('closeWishVaultModalBtn');
  const doneWishVaultBtn = document.getElementById('doneWishVaultBtn');
  const vaultPasscodeInput = document.getElementById('vaultPasscodeInput');
  const submitPasscodeBtn = document.getElementById('submitPasscodeBtn');
  const instantHeartKeyBtn = document.getElementById('instantHeartKeyBtn');
  const vaultUnlockedState = document.getElementById('vaultUnlockedState');
  const vaultUnlockControls = document.getElementById('vaultUnlockControls');
  const vaultWishDisplay = document.getElementById('vaultWishDisplay');

  let isVaultUnlocked = false;

  function updateVaultDisplay() {
    if (vaultWishDisplay) {
      if (state.secretWish && state.secretWish.trim()) {
        vaultWishDisplay.textContent = `"${state.secretWish}"`;
      } else {
        vaultWishDisplay.textContent = '"No secret wish has been sealed yet! Blow out the candles on the cake to seal your wish."';
      }
    }
  }

  function unlockWishVault() {
    isVaultUnlocked = true;
    if (vaultUnlockedState) vaultUnlockedState.style.display = 'block';
    if (vaultUnlockControls) vaultUnlockControls.style.display = 'none';
    audioSynth.playCelebrationFanfare();
    burstConfetti(window.innerWidth / 2, window.innerHeight * 0.45, 60);
    showToast('Secret Wish Vault unlocked with cosmic harmony! ⭐🔮');
  }

  if (openWishVaultBtn) {
    openWishVaultBtn.addEventListener('click', () => {
      updateVaultDisplay();
      if (!isVaultUnlocked) {
        if (vaultUnlockedState) vaultUnlockedState.style.display = 'none';
        if (vaultUnlockControls) vaultUnlockControls.style.display = 'block';
      }
      if (secretWishVaultModal) openModal(secretWishVaultModal);
      audioSynth.playMagicChime();
    });
  }

  if (submitPasscodeBtn && vaultPasscodeInput) {
    submitPasscodeBtn.addEventListener('click', () => {
      const pin = vaultPasscodeInput.value.trim().replace(/\D/g, '');
      if (pin === '2912' || pin === '22092000') {
        unlockWishVault();
      } else {
        audioSynth.playPopSound();
        showToast("Incorrect Passcode! Hint: Enter 2912 or 22092000 💕");
      }
    });

    vaultPasscodeInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        submitPasscodeBtn.click();
      }
    });
  }

  if (instantHeartKeyBtn) {
    instantHeartKeyBtn.addEventListener('click', () => {
      unlockWishVault();
    });
  }

  if (closeWishVaultModalBtn) closeWishVaultModalBtn.addEventListener('click', () => closeModal(secretWishVaultModal));
  if (doneWishVaultBtn) doneWishVaultBtn.addEventListener('click', () => closeModal(secretWishVaultModal));


  // --------------------------------------------------------------------------
  // 3D & REAL HD BIRTHDAY CAKE CUTTING VIDEO CINEMA CONTROLLER
  // --------------------------------------------------------------------------
  const openCakeCutVideoBtn = document.getElementById('openCakeCutVideoBtn');
  const closeCakeCutVideoBtn = document.getElementById('closeCakeCutVideoBtn');
  const cakeCuttingCinema = document.getElementById('cakeCuttingCinema');
  const cakeRealVideoModeBtn = document.getElementById('cakeRealVideoModeBtn');
  const cake3DAnimationModeBtn = document.getElementById('cake3DAnimationModeBtn');
  const cakeRealVideoContainer = document.getElementById('cakeRealVideoContainer');
  const cakeRealCanvas = document.getElementById('cakeRealCanvas');
  const cakeCutStage3D = document.getElementById('cakeCutStage3D');
  const goldenKnife3D = document.getElementById('goldenKnife3D');
  const cakeSlice3D = document.getElementById('cakeSlice3D');
  const cutCakeAssembly = document.getElementById('cutCakeAssembly');
  const cakeCutWedgeGap = document.getElementById('cakeCutWedgeGap');
  const platedCakeSlice = document.getElementById('platedCakeSlice');
  const feedingLoveBubble = document.getElementById('feedingLoveBubble');
  const cutProgressBar = document.getElementById('cutProgressBar');
  const cutProgressFill = document.getElementById('cutProgressFill');
  const cutTimeReadout = document.getElementById('cutTimeReadout');
  const playCakeCutBtn = document.getElementById('playCakeCutBtn');
  const playCakeCutIcon = document.getElementById('playCakeCutIcon');
  const replayCakeCutBtn = document.getElementById('replayCakeCutBtn');
  const cutStatusCaption = document.getElementById('cutStatusCaption');
  const feedSliceBtn = document.getElementById('feedSliceBtn');

  let cinemaActiveMode = 'real'; // 'real' | '3d'
  let cakeCutDuration = 12; // 12 seconds total video for realistic celebration
  let cakeCutCurrentTime = 0;
  let cakeCutIsPlaying = false;
  let lastCakeTimestamp = 0;
  let cakeCutRafId = null;

  // Real Canvas 2D Context & Celebration Assets
  let realVideoCtx = cakeRealCanvas ? cakeRealCanvas.getContext('2d') : null;
  let confettiParticles = [];

  function initConfettiParticles() {
    confettiParticles = [];
    for (let i = 0; i < 50; i++) {
      confettiParticles.push({
        x: Math.random() * 960,
        y: Math.random() * 540,
        w: Math.random() * 9 + 4,
        h: Math.random() * 5 + 3,
        speedY: Math.random() * 1.8 + 0.8,
        speedX: (Math.random() - 0.5) * 1.4,
        angle: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.08,
        color: ['#f43f5e', '#fbbf24', '#38bdf8', '#a855f7', '#ec4899', '#ffffff', '#fde047'][Math.floor(Math.random() * 7)]
      });
    }
  }
  initConfettiParticles();

  // Render High-Definition Realistic Birthday Cake Frame on Canvas
  function drawRealHDVideoFrame(time) {
    if (!realVideoCtx || !cakeRealCanvas) return;
    const w = cakeRealCanvas.width;
    const h = cakeRealCanvas.height;
    const progress = Math.min(1, Math.max(0, time / cakeCutDuration));
    const now = performance.now() * 0.003;

    // 1. Warm Luxurious Ballroom Ambiance Background
    const bgGrad = realVideoCtx.createRadialGradient(w * 0.5, h * 0.45, 40, w * 0.5, h * 0.5, w * 0.7);
    bgGrad.addColorStop(0, '#2d1238');
    bgGrad.addColorStop(0.5, '#190a24');
    bgGrad.addColorStop(1, '#090310');
    realVideoCtx.fillStyle = bgGrad;
    realVideoCtx.fillRect(0, 0, w, h);

    // Warm Ambient Candlelight Aura
    const auraGrad = realVideoCtx.createRadialGradient(w * 0.5, h * 0.4, 20, w * 0.5, h * 0.4, 320);
    auraGrad.addColorStop(0, 'rgba(254, 240, 138, 0.22)');
    auraGrad.addColorStop(0.4, 'rgba(251, 191, 36, 0.1)');
    auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    realVideoCtx.fillStyle = auraGrad;
    realVideoCtx.fillRect(0, 0, w, h);

    // Background Bokeh Orbs
    for (let i = 0; i < 8; i++) {
      const bx = (w * 0.15 + (i * 115) + Math.sin(now + i) * 12) % w;
      const by = 80 + (i % 3) * 45 + Math.cos(now * 0.8 + i) * 8;
      const bRad = 18 + (i % 4) * 8;
      const bGrad = realVideoCtx.createRadialGradient(bx, by, 0, bx, by, bRad);
      bGrad.addColorStop(0, 'rgba(251, 191, 36, 0.25)');
      bGrad.addColorStop(1, 'rgba(251, 191, 36, 0)');
      realVideoCtx.fillStyle = bGrad;
      realVideoCtx.beginPath();
      realVideoCtx.arc(bx, by, bRad, 0, Math.PI * 2);
      realVideoCtx.fill();
    }

    // 2. Polished Mirror Gold Cake Platter
    const platterX = w * 0.5;
    const platterY = 440;
    const platGrad = realVideoCtx.createLinearGradient(platterX - 220, platterY, platterX + 220, platterY);
    platGrad.addColorStop(0, '#78350f');
    platGrad.addColorStop(0.2, '#fde047');
    platGrad.addColorStop(0.5, '#ffffff');
    platGrad.addColorStop(0.8, '#f59e0b');
    platGrad.addColorStop(1, '#78350f');
    realVideoCtx.fillStyle = platGrad;
    realVideoCtx.beginPath();
    realVideoCtx.ellipse(platterX, platterY, 210, 26, 0, 0, Math.PI * 2);
    realVideoCtx.fill();
    realVideoCtx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    realVideoCtx.lineWidth = 2;
    realVideoCtx.stroke();

    // 3. Bottom Tier (Red Velvet & Ruby Ganache)
    const t3W = 320;
    const t3H = 65;
    const t3X = platterX - t3W * 0.5;
    const t3Y = platterY - 60;
    const t3Grad = realVideoCtx.createLinearGradient(t3X, t3Y, t3X + t3W, t3Y);
    t3Grad.addColorStop(0, '#9f1239');
    t3Grad.addColorStop(0.3, '#f43f5e');
    t3Grad.addColorStop(0.7, '#fb7185');
    t3Grad.addColorStop(1, '#881337');
    realVideoCtx.fillStyle = t3Grad;
    realVideoCtx.beginPath();
    realVideoCtx.roundRect(t3X, t3Y, t3W, t3H, [16, 16, 22, 22]);
    realVideoCtx.fill();

    // Bottom Tier Frosting Trim
    realVideoCtx.fillStyle = '#fff1f2';
    for (let x = t3X + 12; x < t3X + t3W; x += 22) {
      realVideoCtx.beginPath();
      realVideoCtx.arc(x, t3Y + 4, 8, 0, Math.PI * 2);
      realVideoCtx.fill();
    }

    // 4. Middle Tier (Golden Custard Chiffon & Sugar Pearls)
    const t2W = 240;
    const t2H = 60;
    const t2X = platterX - t2W * 0.5;
    const t2Y = t3Y - 55;
    const t2Grad = realVideoCtx.createLinearGradient(t2X, t2Y, t2X + t2W, t2Y);
    t2Grad.addColorStop(0, '#ca8a04');
    t2Grad.addColorStop(0.3, '#fde047');
    t2Grad.addColorStop(0.7, '#fef08a');
    t2Grad.addColorStop(1, '#a16207');
    realVideoCtx.fillStyle = t2Grad;
    realVideoCtx.beginPath();
    realVideoCtx.roundRect(t2X, t2Y, t2W, t2H, [14, 14, 18, 18]);
    realVideoCtx.fill();

    // Middle Tier Pearls
    realVideoCtx.fillStyle = '#ffffff';
    for (let x = t2X + 10; x < t2X + t2W; x += 18) {
      realVideoCtx.beginPath();
      realVideoCtx.arc(x, t2Y + 3, 6, 0, Math.PI * 2);
      realVideoCtx.fill();
    }

    // 5. Top Tier (Vanilla Cream & Fresh Glazed Strawberries)
    const t1W = 170;
    const t1H = 55;
    const t1X = platterX - t1W * 0.5;
    const t1Y = t2Y - 50;
    const t1Grad = realVideoCtx.createLinearGradient(t1X, t1Y, t1X + t1W, t1Y);
    t1Grad.addColorStop(0, '#fecdd3');
    t1Grad.addColorStop(0.3, '#ffffff');
    t1Grad.addColorStop(0.7, '#fff1f2');
    t1Grad.addColorStop(1, '#fda4af');
    realVideoCtx.fillStyle = t1Grad;
    realVideoCtx.beginPath();
    realVideoCtx.roundRect(t1X, t1Y, t1W, t1H, [12, 12, 14, 14]);
    realVideoCtx.fill();

    // Top Berries
    realVideoCtx.font = '20px sans-serif';
    realVideoCtx.textAlign = 'center';
    realVideoCtx.fillText('🍓 🍒 🍓 🍒 🍓', platterX, t1Y + 4);

    // 6. Real Burning Birthday Candles with Dynamic Flame Flicker
    const candleCoords = [
      { x: platterX - 35, y: t1Y - 14, h: 22 },
      { x: platterX, y: t1Y - 20, h: 28 }, // Center Royal Candle
      { x: platterX + 35, y: t1Y - 14, h: 22 }
    ];

    candleCoords.forEach((c, idx) => {
      // Candle stick
      const cGrad = realVideoCtx.createLinearGradient(c.x - 3, c.y, c.x + 3, c.y);
      cGrad.addColorStop(0, '#d97706');
      cGrad.addColorStop(0.5, '#fef08a');
      cGrad.addColorStop(1, '#b45309');
      realVideoCtx.fillStyle = cGrad;
      realVideoCtx.fillRect(c.x - 3, c.y, 6, c.h);

      // Candle Wick
      realVideoCtx.strokeStyle = '#292524';
      realVideoCtx.lineWidth = 1.5;
      realVideoCtx.beginPath();
      realVideoCtx.moveTo(c.x, c.y);
      realVideoCtx.lineTo(c.x, c.y - 6);
      realVideoCtx.stroke();

      // Organic Animated Flame
      const flicker = Math.sin(now * 10 + idx * 2.3) * 2.5 + Math.cos(now * 15 + idx) * 1.5;
      const flameX = c.x + flicker * 0.4;
      const flameY = c.y - 14;
      const flameH = 14 + Math.abs(flicker);

      // Outer Flame Glow
      const fAura = realVideoCtx.createRadialGradient(flameX, flameY, 2, flameX, flameY, 24);
      fAura.addColorStop(0, 'rgba(251, 191, 36, 0.6)');
      fAura.addColorStop(0.5, 'rgba(244, 63, 94, 0.25)');
      fAura.addColorStop(1, 'rgba(0, 0, 0, 0)');
      realVideoCtx.fillStyle = fAura;
      realVideoCtx.beginPath();
      realVideoCtx.arc(flameX, flameY, 24, 0, Math.PI * 2);
      realVideoCtx.fill();

      // Flame Body (Tear Drop)
      realVideoCtx.fillStyle = '#f59e0b';
      realVideoCtx.beginPath();
      realVideoCtx.ellipse(flameX, flameY, 5, flameH * 0.5, 0, 0, Math.PI * 2);
      realVideoCtx.fill();

      // Inner Bright Yellow Core
      realVideoCtx.fillStyle = '#fef08a';
      realVideoCtx.beginPath();
      realVideoCtx.ellipse(flameX, flameY + 2, 3, flameH * 0.3, 0, 0, Math.PI * 2);
      realVideoCtx.fill();

      // Inner Blue Wick Base
      realVideoCtx.fillStyle = '#38bdf8';
      realVideoCtx.beginPath();
      realVideoCtx.arc(flameX, flameY + 5, 2, 0, Math.PI * 2);
      realVideoCtx.fill();
    });

    // 7. Dynamic Golden Knife & Slicing Action Synced to Progress
    let knifeX = 640;
    let knifeY = 120;
    let knifeAngle = -0.35;
    let sliceLiftX = 0;
    let sliceLiftY = 0;
    let sliceAlpha = 0;

    if (progress < 0.25) {
      // Scene 1: Approaching
      knifeX = 660 - progress * 400;
      knifeY = 110 + progress * 240;
      knifeAngle = -0.35 + progress * 0.4;
    } else if (progress < 0.6) {
      // Scene 2: Slicing through Cake
      const cutP = (progress - 0.25) / 0.35;
      knifeX = 560 - cutP * 120;
      knifeY = 170 + cutP * 95;
      knifeAngle = -0.1 + Math.sin(cutP * Math.PI * 4) * 0.05;

      // Slice gap starts opening
      realVideoCtx.fillStyle = '#fda4af';
      realVideoCtx.fillRect(t1X + 24, t1Y, 32 * cutP, t1H);
    } else if (progress < 0.88) {
      // Scene 3: Lifting the Slice
      const liftP = (progress - 0.6) / 0.28;
      knifeX = 440 + liftP * 240;
      knifeY = 265 - liftP * 80;
      knifeAngle = 0.15 + liftP * 0.2;

      sliceLiftX = liftP * 240;
      sliceLiftY = -liftP * 65;
      sliceAlpha = 1;

      // Gap revealed on top tier
      realVideoCtx.fillStyle = '#f43f5e';
      realVideoCtx.fillRect(t1X + 24, t1Y, 32, t1H);
    } else {
      // Scene 4: Plated on Porcelain Dish
      knifeX = 720;
      knifeY = 220;
      knifeAngle = 0.4;
      sliceAlpha = 0; // Seated on plate

      // Wedge gap permanently revealed
      realVideoCtx.fillStyle = '#f43f5e';
      realVideoCtx.fillRect(t1X + 24, t1Y, 32, t1H);
    }

    // Draw the Detached Slice if lifting
    if (sliceAlpha > 0) {
      const sX = t1X + 28 + sliceLiftX;
      const sY = t1Y + sliceLiftY;
      realVideoCtx.save();
      realVideoCtx.translate(sX, sY);
      realVideoCtx.rotate(sliceLiftX * 0.001);

      // Multi-layer slice on knife
      realVideoCtx.fillStyle = '#fff1f2';
      realVideoCtx.fillRect(-16, 0, 32, 45);
      realVideoCtx.fillStyle = '#fde047';
      realVideoCtx.fillRect(-16, 12, 32, 8);
      realVideoCtx.fillStyle = '#f43f5e';
      realVideoCtx.fillRect(-16, 20, 32, 6);
      realVideoCtx.fillStyle = '#fde047';
      realVideoCtx.fillRect(-16, 26, 32, 8);
      realVideoCtx.fillText('🍓✨', 0, -4);
      realVideoCtx.restore();
    }

    // Draw Plated Porcelain Dish on Right Side
    const dishX = 750;
    const dishY = 410;
    realVideoCtx.fillStyle = '#ffffff';
    realVideoCtx.beginPath();
    realVideoCtx.ellipse(dishX, dishY, 70, 20, 0, 0, Math.PI * 2);
    realVideoCtx.fill();
    realVideoCtx.strokeStyle = '#d97706';
    realVideoCtx.lineWidth = 2;
    realVideoCtx.stroke();

    if (progress >= 0.85) {
      // Sliced cake piece resting on plate!
      realVideoCtx.save();
      realVideoCtx.translate(dishX, dishY - 14);
      realVideoCtx.fillStyle = '#ffffff';
      realVideoCtx.fillRect(-16, 0, 32, 28);
      realVideoCtx.fillStyle = '#fde047';
      realVideoCtx.fillRect(-16, 8, 32, 6);
      realVideoCtx.fillStyle = '#f43f5e';
      realVideoCtx.fillRect(-16, 14, 32, 4);
      realVideoCtx.fillStyle = '#fde047';
      realVideoCtx.fillRect(-16, 18, 32, 6);
      realVideoCtx.fillText('🍓🍴', 0, -3);
      realVideoCtx.restore();
    }

    // Draw Damascus Golden Knife
    realVideoCtx.save();
    realVideoCtx.translate(knifeX, knifeY);
    realVideoCtx.rotate(knifeAngle);

    // Blade
    const bladeGrad = realVideoCtx.createLinearGradient(-90, -10, 20, 10);
    bladeGrad.addColorStop(0, '#ffffff');
    bladeGrad.addColorStop(0.3, '#fde047');
    bladeGrad.addColorStop(0.7, '#f59e0b');
    bladeGrad.addColorStop(1, '#b45309');
    realVideoCtx.fillStyle = bladeGrad;
    realVideoCtx.beginPath();
    realVideoCtx.moveTo(-90, 0);
    realVideoCtx.lineTo(-15, -12);
    realVideoCtx.lineTo(20, -12);
    realVideoCtx.lineTo(20, 12);
    realVideoCtx.lineTo(-15, 12);
    realVideoCtx.closePath();
    realVideoCtx.fill();

    // Blade Edge Shine
    realVideoCtx.strokeStyle = '#ffffff';
    realVideoCtx.lineWidth = 2;
    realVideoCtx.beginPath();
    realVideoCtx.moveTo(-90, 0);
    realVideoCtx.lineTo(20, 12);
    realVideoCtx.stroke();

    // Handle
    const handleGrad = realVideoCtx.createLinearGradient(20, 0, 85, 0);
    handleGrad.addColorStop(0, '#92400e');
    handleGrad.addColorStop(0.5, '#78350f');
    handleGrad.addColorStop(1, '#451a03');
    realVideoCtx.fillStyle = handleGrad;
    realVideoCtx.beginPath();
    realVideoCtx.roundRect(20, -10, 65, 20, [4, 8, 8, 4]);
    realVideoCtx.fill();
    realVideoCtx.strokeStyle = '#fde047';
    realVideoCtx.stroke();

    // Bolster & Pommel
    realVideoCtx.fillStyle = '#fde047';
    realVideoCtx.fillRect(18, -11, 5, 22);
    realVideoCtx.fillRect(82, -10, 5, 20);

    realVideoCtx.restore();

    // 8. Celebration Confetti Floating Particles
    if (progress > 0.4) {
      confettiParticles.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.angle += p.rotSpeed;
        if (p.y > h) p.y = -10;
        if (p.x > w) p.x = 0;
        if (p.x < 0) p.x = w;

        realVideoCtx.save();
        realVideoCtx.translate(p.x, p.y);
        realVideoCtx.rotate(p.angle);
        realVideoCtx.fillStyle = p.color;
        realVideoCtx.fillRect(-p.w * 0.5, -p.h * 0.5, p.w, p.h);
        realVideoCtx.restore();
      });
    }
  }

  // Real Video Live HUD Updates
  function updateRealVideoHUD() {
    const cur = cakeCutCurrentTime || 0;
    const dur = cakeCutDuration;
    const pct = Math.min(100, Math.max(0, (cur / dur) * 100));

    if (cutProgressFill) cutProgressFill.style.width = `${pct}%`;

    if (cutTimeReadout) {
      const curM = Math.floor(cur / 60);
      const curS = Math.floor(cur % 60);
      const durM = Math.floor(dur / 60);
      const durS = Math.floor(dur % 60);
      cutTimeReadout.textContent = `${curM}:${curS < 10 ? '0' : ''}${curS} / ${durM}:${durS < 10 ? '0' : ''}${durS}`;
    }

    if (pct < 25) {
      if (cutStatusCaption) cutStatusCaption.textContent = '🕯️ Royal Birthday Candles glowing... Making a heartfelt wish! 🌠';
    } else if (pct < 60) {
      if (cutStatusCaption) cutStatusCaption.textContent = '🍰 Slicing smoothly through luscious strawberry cream sponge cake... 🍓';
      if (feedSliceBtn) feedSliceBtn.style.display = 'inline-flex';
    } else if (pct < 85) {
      if (cutStatusCaption) cutStatusCaption.textContent = '✨ Lifting the royal celebratory first slice toward the golden plate... 🍰💖';
      if (feedSliceBtn) feedSliceBtn.style.display = 'inline-flex';
    } else {
      if (cutStatusCaption) cutStatusCaption.textContent = '🎉 Royal slice is served! Click "Feed to Nishika" below! 🍓👑';
      if (feedSliceBtn) feedSliceBtn.style.display = 'inline-flex';
    }
  }

  // Universal Cinema Loop (for both Real HD Engine and 3D Slicing)
  function universalCinemaLoop(timestamp) {
    if (!cakeCutIsPlaying) return;
    if (!lastCakeTimestamp) lastCakeTimestamp = timestamp;
    const delta = (timestamp - lastCakeTimestamp) / 1000;
    lastCakeTimestamp = timestamp;

    const prevTime = cakeCutCurrentTime;
    cakeCutCurrentTime += delta;

    if (cinemaActiveMode === 'real') {
      drawRealHDVideoFrame(cakeCutCurrentTime);
      updateRealVideoHUD();
    } else {
      updateCakeCutScene(cakeCutCurrentTime);
    }

    if (prevTime < 3.0 && cakeCutCurrentTime >= 3.0) {
      if (audioSynth && audioSynth.playMagicChime) audioSynth.playMagicChime();
    }
    if (prevTime < 9.0 && cakeCutCurrentTime >= 9.0) {
      if (audioSynth && audioSynth.playCelebrationFanfare) audioSynth.playCelebrationFanfare();
      burstConfetti(window.innerWidth / 2, window.innerHeight * 0.45, 75);
    }

    if (cakeCutCurrentTime >= cakeCutDuration) {
      pauseCakeCutVideo();
      if (feedSliceBtn) feedSliceBtn.style.display = 'inline-flex';
    } else {
      cakeCutRafId = requestAnimationFrame(universalCinemaLoop);
    }
  }

  function playCakeCutVideo() {
    if (cakeCutIsPlaying) return;
    cakeCutIsPlaying = true;
    lastCakeTimestamp = 0;
    if (playCakeCutIcon) playCakeCutIcon.className = 'fa-solid fa-pause';

    if (cakeCutCurrentTime >= cakeCutDuration) {
      cakeCutCurrentTime = 0;
    }
    if (audioSynth && audioSynth.playPopSound) audioSynth.playPopSound();
    cakeCutRafId = requestAnimationFrame(universalCinemaLoop);
  }

  function pauseCakeCutVideo() {
    cakeCutIsPlaying = false;
    lastCakeTimestamp = 0;
    if (cakeCutRafId) cancelAnimationFrame(cakeCutRafId);
    if (playCakeCutIcon) playCakeCutIcon.className = 'fa-solid fa-play';
  }

  function switchCinemaMode(mode) {
    cinemaActiveMode = mode;
    if (mode === 'real') {
      if (cakeRealVideoModeBtn) cakeRealVideoModeBtn.classList.add('active');
      if (cake3DAnimationModeBtn) cake3DAnimationModeBtn.classList.remove('active');
      if (cakeRealVideoContainer) cakeRealVideoContainer.style.display = 'flex';
      if (cakeCutStage3D) cakeCutStage3D.style.display = 'none';

      if (cakeCutCurrentTime >= cakeCutDuration) {
        cakeCutCurrentTime = 0;
      }
      drawRealHDVideoFrame(cakeCutCurrentTime);
      updateRealVideoHUD();
      playCakeCutVideo();
      if (cutStatusCaption) cutStatusCaption.textContent = '🎬 Real HD Video Active: Slicing the Royal Birthday Cake!';
    } else {
      if (cake3DAnimationModeBtn) cake3DAnimationModeBtn.classList.add('active');
      if (cakeRealVideoModeBtn) cakeRealVideoModeBtn.classList.remove('active');
      if (cakeRealVideoContainer) cakeRealVideoContainer.style.display = 'none';
      if (cakeCutStage3D) cakeCutStage3D.style.display = 'flex';

      if (cakeCutCurrentTime >= cakeCutDuration) {
        cakeCutCurrentTime = 0;
      }
      updateCakeCutScene(cakeCutCurrentTime);
      playCakeCutVideo();
      if (cutStatusCaption) cutStatusCaption.textContent = '🍰 3D Slicing Active: Damascus knife slicing through strawberry cream sponge!';
    }
    if (audioSynth && audioSynth.playPopSound) audioSynth.playPopSound();
  }

  if (cakeRealVideoModeBtn) {
    cakeRealVideoModeBtn.addEventListener('click', () => switchCinemaMode('real'));
  }
  if (cake3DAnimationModeBtn) {
    cake3DAnimationModeBtn.addEventListener('click', () => switchCinemaMode('3d'));
  }

  // 3D Scene Frame Logic
  function updateCakeCutScene(time) {
    cakeCutCurrentTime = Math.max(0, Math.min(cakeCutDuration, time));
    const pct = (cakeCutCurrentTime / cakeCutDuration) * 100;
    if (cutProgressFill) cutProgressFill.style.width = `${pct}%`;
    if (cutTimeReadout) {
      const s = Math.floor(cakeCutCurrentTime);
      cutTimeReadout.textContent = `0:0${s} / 0:12`.replace('0:010', '0:10').replace('0:011', '0:11').replace('0:012', '0:12');
    }

    if (cakeCutCurrentTime < 3.0) {
      // Scene 1: Knife Approach
      if (goldenKnife3D) goldenKnife3D.className = 'golden-knife-3d';
      if (cakeSlice3D) cakeSlice3D.className = 'cake-slice-3d';
      if (cakeCutWedgeGap) cakeCutWedgeGap.className = 'cake-cut-wedge-gap';
      if (platedCakeSlice) platedCakeSlice.className = 'plated-cake-slice';
      if (feedingLoveBubble) feedingLoveBubble.classList.remove('active');
      if (feedSliceBtn) feedSliceBtn.style.display = 'none';
      if (cutStatusCaption) cutStatusCaption.textContent = '🎬 Scene 1: Damascus golden knife aligning over the royal top tier...';
    } else if (cakeCutCurrentTime < 6.5) {
      // Scene 2: Slicing the Cake
      if (goldenKnife3D) goldenKnife3D.className = 'golden-knife-3d knife-cutting';
      if (cakeSlice3D) cakeSlice3D.className = 'cake-slice-3d';
      if (cakeCutWedgeGap) cakeCutWedgeGap.className = 'cake-cut-wedge-gap';
      if (platedCakeSlice) platedCakeSlice.className = 'plated-cake-slice';
      if (feedingLoveBubble) feedingLoveBubble.classList.remove('active');
      if (feedSliceBtn) feedSliceBtn.style.display = 'none';
      if (cutStatusCaption) cutStatusCaption.textContent = '🍰 Scene 2: Gliding smoothly through strawberry cream sponge...';
    } else if (cakeCutCurrentTime < 9.5) {
      // Scene 3: Slice Lift & Separation
      if (goldenKnife3D) goldenKnife3D.className = 'golden-knife-3d knife-lifting';
      if (cakeSlice3D) cakeSlice3D.className = 'cake-slice-3d cut-detached';
      if (cakeCutWedgeGap) cakeCutWedgeGap.className = 'cake-cut-wedge-gap revealed';
      if (platedCakeSlice) platedCakeSlice.className = 'plated-cake-slice';
      if (feedSliceBtn) feedSliceBtn.style.display = 'none';
      if (cutStatusCaption) cutStatusCaption.textContent = '✨ Scene 3: Lifting the 3D royal slice toward the golden plate...';
    } else {
      // Scene 4: Plated & Served with Cheers
      if (goldenKnife3D) goldenKnife3D.className = 'golden-knife-3d knife-done';
      if (cakeSlice3D) cakeSlice3D.className = 'cake-slice-3d cut-placed-invisible';
      if (cakeCutWedgeGap) cakeCutWedgeGap.className = 'cake-cut-wedge-gap revealed';
      if (platedCakeSlice) platedCakeSlice.className = 'plated-cake-slice placed';
      if (feedSliceBtn) feedSliceBtn.style.display = 'inline-flex';
      if (cutStatusCaption) cutStatusCaption.textContent = '🎉 Scene 4: Sliced & placed on plate! Click "Feed to Nishika" below! 🍓💖';
    }
  }

  // Initial draw of Real HD Frame on page load
  drawRealHDVideoFrame(0);

  if (openCakeCutVideoBtn) {
    openCakeCutVideoBtn.addEventListener('click', () => {
      if (cakeCuttingCinema) {
        cakeCuttingCinema.style.display = 'block';
        cakeCuttingCinema.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      playCakeCutVideo();
    });
  }

  if (closeCakeCutVideoBtn) {
    closeCakeCutVideoBtn.addEventListener('click', () => {
      pauseCakeCutVideo();
      if (cakeCuttingCinema) cakeCuttingCinema.style.display = 'none';
    });
  }

  if (playCakeCutBtn) {
    playCakeCutBtn.addEventListener('click', () => {
      if (cakeCutIsPlaying) pauseCakeCutVideo();
      else playCakeCutVideo();
    });
  }

  if (replayCakeCutBtn) {
    replayCakeCutBtn.addEventListener('click', () => {
      pauseCakeCutVideo();
      cakeCutCurrentTime = 0;
      if (cinemaActiveMode === 'real') {
        drawRealHDVideoFrame(0);
        updateRealVideoHUD();
      } else {
        updateCakeCutScene(0);
      }
      playCakeCutVideo();
    });
  }

  if (cutProgressBar) {
    cutProgressBar.addEventListener('click', (e) => {
      const rect = cutProgressBar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const pct = Math.max(0, Math.min(1, clickX / rect.width));
      cakeCutCurrentTime = pct * cakeCutDuration;

      if (cinemaActiveMode === 'real') {
        drawRealHDVideoFrame(cakeCutCurrentTime);
        updateRealVideoHUD();
      } else {
        updateCakeCutScene(cakeCutCurrentTime);
      }
    });
  }

  // Interactive Click on 3D Cake / Knife / Stage
  [cakeCutStage3D, cutCakeAssembly, cakeSlice3D, goldenKnife3D].forEach(el => {
    if (el) {
      el.addEventListener('click', (e) => {
        if (cinemaActiveMode !== '3d') return;
        // If clicked on feed button or plate, ignore
        if (e.target.closest('#feedSliceBtn') || e.target.closest('#platedCakeSlice')) return;

        if (cakeCutIsPlaying) {
          pauseCakeCutVideo();
        } else {
          if (cakeCutCurrentTime >= cakeCutDuration) {
            cakeCutCurrentTime = 0;
            updateCakeCutScene(0);
          }
          playCakeCutVideo();
        }
      });
    }
  });

  if (feedSliceBtn) {
    feedSliceBtn.addEventListener('click', () => {
      if (cinemaActiveMode === '3d' && platedCakeSlice) {
        platedCakeSlice.className = 'plated-cake-slice feeding';
      }
      if (feedingLoveBubble) feedingLoveBubble.classList.add('active');

      if (audioSynth && audioSynth.playCelebrationFanfare) audioSynth.playCelebrationFanfare();
      if (audioSynth && audioSynth.playMagicChime) audioSynth.playMagicChime();
      burstConfetti(window.innerWidth / 2, window.innerHeight * 0.45, 120);

      // Spawn floating hearts around active cinema container
      const targetContainer = cinemaActiveMode === 'real' ? cakeRealVideoContainer : document.getElementById('cakeCutStage3D');
      if (targetContainer) {
        for (let i = 0; i < 16; i++) {
          setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'floating-cuddle-heart';
            heart.textContent = ['💖', '🍓', '✨', '💕', '👑', '🎉', '🍰'][Math.floor(Math.random() * 7)];
            heart.style.left = `${45 + (Math.random() - 0.5) * 45}%`;
            heart.style.top = `${55 + (Math.random() - 0.5) * 35}%`;
            heart.style.zIndex = '10';
            targetContainer.appendChild(heart);
            setTimeout(() => heart.remove(), 2500);
          }, i * 110);
        }
      }

      showToast(`Fed the sweetest first slice to My Love ${state.recipientName}! 🍓🍰👑 "Forever sweeter with you, my Love!"`);

      setTimeout(() => {
        if (feedingLoveBubble) feedingLoveBubble.classList.remove('active');
        if (platedCakeSlice) platedCakeSlice.className = 'plated-cake-slice placed';
      }, 3400);
    });
  }

  // --------------------------------------------------------------------------
  // 3D ROMANTIC COUPLE CUDDLE CINEMA CONTROLLER
  // --------------------------------------------------------------------------
  const cuddleRoomScene = document.getElementById('cuddleRoomScene');
  const cuddleProgressBar = document.getElementById('cuddleProgressBar');
  const cuddleProgressFill = document.getElementById('cuddleProgressFill');
  const cuddleCurrentTimeEl = document.getElementById('cuddleCurrentTime');
  const cuddlePlayToggleBtn = document.getElementById('cuddlePlayToggleBtn');
  const cuddlePlayIcon = document.getElementById('cuddlePlayIcon');
  const cuddleReplayBtn = document.getElementById('cuddleReplayBtn');
  const cuddleSoundscapeBtn = document.getElementById('cuddleSoundscapeBtn');
  const cuddleSoundIcon = document.getElementById('cuddleSoundIcon');
  const cuddleSubtitleText = document.getElementById('cuddleSubtitleText');
  const cuddleSec = document.getElementById('cuddleSec');

  let cuddleDuration = 30; // 30 seconds loop
  let cuddleCurrentTime = 0;
  let cuddleIsPlaying = true;
  let cuddleRafId = null;
  let lastCuddleTimestamp = 0;
  let isCuddleInView = false;
  let cuddleSoundscapeActive = false;
  let cuddleSynthInterval = null;

  const cuddleSubtitles = [
    `"In your arms is where I always want to be... Happy Birthday, my Love Nishika." 💖`,
    `"Every storm in the universe fades away the moment I hold you close." 🛋️✨`,
    `"Under every star in the cosmos, my heart chooses you in every lifetime." 🌌`,
    `"Wrapped in this blanket with you, forever feels like it's just beginning." ☕🕯️`,
    `"With every gentle breath and heartbeat, I love you more than yesterday." 👑💓`
  ];

  function cuddleFrameLoop(timestamp) {
    if (!cuddleIsPlaying || !isCuddleInView) {
      cuddleRafId = null;
      return;
    }

    if (!lastCuddleTimestamp) lastCuddleTimestamp = timestamp;
    const delta = (timestamp - lastCuddleTimestamp) / 1000;
    lastCuddleTimestamp = timestamp;

    cuddleCurrentTime = (cuddleCurrentTime + delta) % cuddleDuration;
    const pct = (cuddleCurrentTime / cuddleDuration) * 100;
    if (cuddleProgressFill) cuddleProgressFill.style.width = `${pct.toFixed(2)}%`;

    if (cuddleCurrentTimeEl) {
      const s = Math.floor(cuddleCurrentTime);
      cuddleCurrentTimeEl.textContent = `0:${s < 10 ? '0' : ''}${s}`;
    }

    // Subtitle update every 6 seconds
    const subIdx = Math.floor((cuddleCurrentTime / cuddleDuration) * cuddleSubtitles.length);
    if (cuddleSubtitleText && cuddleSubtitles[subIdx]) {
      if (cuddleSubtitleText.textContent !== cuddleSubtitles[subIdx]) {
        cuddleSubtitleText.textContent = cuddleSubtitles[subIdx];
      }
    }

    cuddleRafId = requestAnimationFrame(cuddleFrameLoop);
  }

  function startCuddleLoop() {
    cuddleIsPlaying = true;
    lastCuddleTimestamp = 0;
    if (cuddlePlayIcon) cuddlePlayIcon.className = 'fa-solid fa-pause';
    if (!cuddleRafId && isCuddleInView) {
      cuddleRafId = requestAnimationFrame(cuddleFrameLoop);
    }
  }

  function pauseCuddleLoop() {
    cuddleIsPlaying = false;
    lastCuddleTimestamp = 0;
    if (cuddleRafId) cancelAnimationFrame(cuddleRafId);
    cuddleRafId = null;
    if (cuddlePlayIcon) cuddlePlayIcon.className = 'fa-solid fa-play';
  }

  // Viewport Observer for Cuddle Section
  if (cuddleSec) {
    const cuddleObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isCuddleInView = entry.isIntersecting;
        if (isCuddleInView && cuddleIsPlaying && !cuddleRafId) {
          lastCuddleTimestamp = 0;
          cuddleRafId = requestAnimationFrame(cuddleFrameLoop);
        }
      });
    }, { threshold: 0.1 });
    cuddleObserver.observe(cuddleSec);
  }

  if (cuddlePlayToggleBtn) {
    cuddlePlayToggleBtn.addEventListener('click', () => {
      if (cuddleIsPlaying) pauseCuddleLoop();
      else startCuddleLoop();
      audioSynth.playPopSound();
    });
  }

  if (cuddleReplayBtn) {
    cuddleReplayBtn.addEventListener('click', () => {
      cuddleCurrentTime = 0;
      lastCuddleTimestamp = 0;
      startCuddleLoop();
      audioSynth.playPopSound();
      showToast('Replaying cozy cuddle scene from beginning! 🛋️✨');
    });
  }

  if (cuddleProgressBar) {
    cuddleProgressBar.addEventListener('click', (e) => {
      const rect = cuddleProgressBar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const pct = Math.max(0, Math.min(1, clickX / rect.width));
      cuddleCurrentTime = pct * cuddleDuration;
      if (cuddleProgressFill) cuddleProgressFill.style.width = `${(pct * 100).toFixed(2)}%`;
      audioSynth.playPopSound();
    });
  }

  // Floating Romantic Love Whispers Controller
  const cuddleWhisperBtn = document.getElementById('cuddleWhisperBtn');
  const cuddleFloatingArena = document.getElementById('cuddleFloatingArena');

  const cuddleWhispersList = [
    `"Holding you, Nishika, is the most peaceful feeling in the universe." 💖`,
    `"Happy Birthday to my eternal love, my sweetest comfort, my Love." 👑✨`,
    `"With every breath, Dilip falls deeper in love with you." 💓`,
    `"Under millions of stars, you shine brighter than them all." 🌌`,
    `"Forever wrapped in warm cashmere and endless love with you." ☕🛋️`,
    `"Your smile is my favorite constellation, my Love Nishika." 💫`
  ];
  let whisperIndex = 0;

  if (cuddleWhisperBtn && cuddleFloatingArena) {
    cuddleWhisperBtn.addEventListener('click', () => {
      const text = cuddleWhispersList[whisperIndex % cuddleWhispersList.length];
      whisperIndex++;

      const note = document.createElement('div');
      note.className = 'floating-love-note whisper-dynamic';
      note.innerHTML = `<span class="note-icon">💌</span><span class="note-text">${escapeHtml(text)}</span>`;
      note.style.left = `${15 + Math.random() * 40}%`;
      note.style.top = `${30 + Math.random() * 40}px`;

      cuddleFloatingArena.appendChild(note);
      audioSynth.playMagicChime();
      showToast('Floated a sweet love whisper across the starlit sky! 💌✨');

      setTimeout(() => note.remove(), 7500);
    });
  }

  // Camera Angle Selector
  document.querySelectorAll('.cam-preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.cam-preset-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cam = btn.getAttribute('data-cam');
      if (cuddleRoomScene) {
        if (cam === 'closeup') {
          cuddleRoomScene.style.transform = 'scale(1.22) translateY(-15px) rotateX(6deg)';
        } else if (cam === 'panorama') {
          cuddleRoomScene.style.transform = 'scale(0.92) translateY(5px) rotateX(0deg)';
        } else if (cam === 'hearth') {
          cuddleRoomScene.style.transform = 'scale(1.1) translateX(30px) rotateY(-10deg) rotateX(4deg)';
        }
      }
      audioSynth.playPopSound();
    });
  });

  // Lo-Fi Cuddle Soundscape Synthesizer
  function playLoFiCuddleChords() {
    audioSynth.initContext();
    if (cuddleSynthInterval) clearInterval(cuddleSynthInterval);
    const chords = [
      [277.18, 349.23, 415.30, 523.25], // Dbmaj7
      [233.08, 277.18, 349.23, 440.00], // Bbm9
      [185.00, 233.08, 277.18, 369.99], // Gbmaj7
      [207.65, 261.63, 311.13, 415.30]  // Ab7
    ];
    let chordIdx = 0;

    const playNextChord = () => {
      if (!cuddleSoundscapeActive || !audioSynth.ctx) return;
      const chord = chords[chordIdx % chords.length];
      chordIdx++;
      chord.forEach((freq, i) => {
        try {
          const osc = audioSynth.ctx.createOscillator();
          const gain = audioSynth.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, audioSynth.ctx.currentTime + i * 0.08);
          gain.gain.setValueAtTime(0.04, audioSynth.ctx.currentTime + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.0001, audioSynth.ctx.currentTime + 3.2);
          osc.connect(gain);
          gain.connect(audioSynth.ctx.destination);
          osc.start(audioSynth.ctx.currentTime + i * 0.08);
          osc.stop(audioSynth.ctx.currentTime + 3.4);
        } catch (err) {}
      });
    };

    playNextChord();
    cuddleSynthInterval = setInterval(playNextChord, 3200);
  }

  if (cuddleSoundscapeBtn) {
    cuddleSoundscapeBtn.addEventListener('click', () => {
      cuddleSoundscapeActive = !cuddleSoundscapeActive;
      if (cuddleSoundscapeActive) {
        if (cuddleSoundIcon) cuddleSoundIcon.className = 'fa-solid fa-volume-high';
        cuddleSoundscapeBtn.style.background = 'var(--secondary)';
        playLoFiCuddleChords();
        showToast('Lo-Fi cozy cuddle soundscape enabled 📻☕');
      } else {
        if (cuddleSoundIcon) cuddleSoundIcon.className = 'fa-solid fa-volume-xmark';
        cuddleSoundscapeBtn.style.background = '';
        if (cuddleSynthInterval) clearInterval(cuddleSynthInterval);
        showToast('Lo-Fi soundscape paused');
      }
    });
  }

  // Initialize cuddle loop
  startCuddleLoop();

  // Secret Wish Submission
  if (timeCapsuleForm) {
    timeCapsuleForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const wishVal = secretWishInput ? secretWishInput.value.trim() : '';
      state.secretWish = wishVal;
      saveState();

      if (wishVal) {
        sendToGoogleSheet({
          type: 'secret_wish',
          wish: wishVal
        });
      }

      closeModal(wishModal);
      audioSynth.playCelebrationFanfare();
      burstConfetti(window.innerWidth / 2, window.innerHeight * 0.3, 90);
      showToast('Your secret wish has been launched to the stars! 🌟✨');
    });
  }
  if (closeWishModalBtn) closeWishModalBtn.addEventListener('click', () => closeModal(wishModal));


  // --------------------------------------------------------------------------
  // SECTION 2: "OPEN WHEN..." LOVE ENVELOPES CONTROLLER
  // --------------------------------------------------------------------------
  const openWhenLetterModal = document.getElementById('openWhenLetterModal');
  const closeOpenWhenModalBtn = document.getElementById('closeOpenWhenModalBtn');
  const closeOwLetterBtn = document.getElementById('closeOwLetterBtn');
  const owModalCategory = document.getElementById('owModalCategory');
  const owModalTitle = document.getElementById('owModalTitle');
  const owModalContent = document.getElementById('owModalContent');
  const owModalSignature = document.getElementById('owModalSignature');

  const openWhenLetters = {
    'miss-me': {
      category: 'Open When... 🫂',
      title: 'You Miss Me & Need A Hug',
      paragraphs: [
        'Close your eyes for three seconds, take a slow deep breath, and wrap your arms around yourself. Feel that warmth? That is me holding you, no matter how many miles or minutes stand between us.',
        'Whenever the world feels a little too quiet or you just miss hearing my voice, remember that my heart beats in rhythm with yours. You are never alone, my sweet Love. I am right here with you in every memory, every whisper of the wind, and every star in the night sky.',
        'You are my favorite thought, every hour of every day. Never forget how completely adored you are.'
      ]
    },
    'stressful-day': {
      category: 'Open When... ☕',
      title: "You've Had A Stressful Day",
      paragraphs: [
        'Drop your shoulders, unclench your jaw, and exhale. You fought so hard today, and you did wonderfully.',
        "You carry so much grace, dedication, and strength, but tonight you don't have to be strong. Tonight, the world can pause for you. Wrap yourself in the softest blanket, sip something warm, and let me take care of the rest.",
        'I am endlessly proud of everything you do and the kindness you offer the world, even on exhausting days. Tomorrow is a brand-new sunrise, and I will be right beside you.'
      ]
    },
    'cant-sleep': {
      category: 'Open When... 🌙',
      title: "You Can't Sleep At Night",
      paragraphs: [
        "If sleep is evading you tonight, don't count boring sheep. Count our sweet memories instead.",
        'Think of the way we laugh until our stomachs hurt, our late-night talks where time stands still, and all the dreamy adventures waiting for us. Picture me resting right beside you, gently brushing hair from your forehead until your eyelids grow comfortably heavy.',
        'Rest easy, my angel. The cosmos is keeping guard over you, and my heart is loving you all through the night.'
      ]
    },
    'need-smile': {
      category: 'Open When... 😊',
      title: 'You Need A Gentle Smile',
      paragraphs: [
        'Did you know that whenever you smile, it sets off an instant celebration in my heart?',
        'You possess that rare, radiant beauty that lights up everything around you. Remember the funny moments, our goofy inside jokes, and how cute you look when you get excited about the little things? That joy is your superpower.',
        'Keep that breathtaking smile on your face today, my Love—the world is infinitely brighter because of you.'
      ]
    }
  };

  function openOpenWhenLetter(letterKey) {
    const letter = openWhenLetters[letterKey] || openWhenLetters['miss-me'];
    if (owModalCategory) owModalCategory.textContent = letter.category;
    if (owModalTitle) owModalTitle.textContent = letter.title;
    if (owModalSignature) owModalSignature.textContent = `${state.senderName} 💖`;

    if (owModalContent) {
      owModalContent.innerHTML = letter.paragraphs
        .map(p => `<p>${p.replace(/My Love Nishika/g, `My Love ${state.recipientName}`).replace(/Nishika/g, state.recipientName)}</p>`)
        .join('');
    }

    if (openWhenLetterModal) openModal(openWhenLetterModal);
    audioSynth.playMagicChime();
    burstConfetti(window.innerWidth / 2, window.innerHeight * 0.45, 30);
    showToast(`Opened letter: "${letter.title}" 💌`);
  }

  document.querySelectorAll('.open-when-card').forEach(card => {
    const letterKey = card.getAttribute('data-letter-id');
    const seal = card.querySelector('.ow-wax-seal');
    const readBtn = card.querySelector('.ow-read-btn');

    const triggerOpen = (e) => {
      e.stopPropagation();
      openOpenWhenLetter(letterKey);
    };

    if (seal) seal.addEventListener('click', triggerOpen);
    if (readBtn) readBtn.addEventListener('click', triggerOpen);
    card.addEventListener('click', (e) => {
      if (e.target.closest('.ow-wax-seal') || e.target.closest('.ow-read-btn')) return;
      openOpenWhenLetter(letterKey);
    });
  });

  if (closeOpenWhenModalBtn) closeOpenWhenModalBtn.addEventListener('click', () => closeModal(openWhenLetterModal));
  if (closeOwLetterBtn) closeOwLetterBtn.addEventListener('click', () => closeModal(openWhenLetterModal));

  // --------------------------------------------------------------------------
  // 11. SECTION 4: 3D ORIGAMI FOLDED HEART CRAFT & MAGIC JAR
  // --------------------------------------------------------------------------
const romanticReasons = [
  // 💖 Pure Romance (1-20)
  { cat: "💖 Pure Romance", text: "The way your eyes sparkle with genuine warmth and happiness whenever you smile at me." },
  { cat: "💖 Pure Romance", text: "How hearing your gentle laugh instantly turns my worst day into my favorite day." },
  { cat: "💖 Pure Romance", text: "The electric feeling that runs through my heart every single time our fingers interlock." },
  { cat: "💖 Pure Romance", text: "How your sweet voice is genuinely the most calming and beautiful melody in the universe." },
  { cat: "💖 Pure Romance", text: "The soft, tender look you give me right before we share an unforgettable warm embrace." },
  { cat: "💖 Pure Romance", text: "How effortlessly you make my heart flutter like it is our very first date all over again." },
  { cat: "💖 Pure Romance", text: "The gentle warmth of your hand resting in mine during long quiet midnight drives." },
  { cat: "💖 Pure Romance", text: "The way you tilt your head when listening intently to my stories with pure adoration." },
  { cat: "💖 Pure Romance", text: "How even after all this time, looking into your radiant eyes still makes my heart skip a beat." },
  { cat: "💖 Pure Romance", text: "The sweet forehead kisses we share that speak volumes more than any spoken words ever could." },
  { cat: "💖 Pure Romance", text: "How you make romance feel so effortless, pure, and genuinely magical every single day." },
  { cat: "💖 Pure Romance", text: "The adorable way you whisper 'I love you' right before drifting off into peaceful sleep." },
  { cat: "💖 Pure Romance", text: "How you notice the subtle little things about me that nobody else in the world ever sees." },
  { cat: "💖 Pure Romance", text: "The poetic way your presence brings peace, harmony, and joy into every room you enter." },
  { cat: "💖 Pure Romance", text: "How dancing with you in the living room feels like floating among the brightest stars." },
  { cat: "💖 Pure Romance", text: "The warmth of your cheek pressed gently against my chest as we listen to the rain outside." },
  { cat: "💖 Pure Romance", text: "How my soul recognized yours the exact moment our journeys crossed paths." },
  { cat: "💖 Pure Romance", text: "The secret sweet glances we exchange across a crowded room that only we understand." },
  { cat: "💖 Pure Romance", text: "How every romantic song on the radio suddenly reminds me of your smile and laughter." },
  { cat: "💖 Pure Romance", text: "Simply knowing that of all the billions of souls on Earth, my heart found you." },

  // 🥰 Cute Habits (21-40)
  { cat: "🥰 Cute Habits", text: "The adorable little happy dance you do whenever your favorite food or dessert arrives." },
  { cat: "🥰 Cute Habits", text: "How cute you look when you get passionately excited talking about something you love." },
  { cat: "🥰 Cute Habits", text: "The way you scrunch your nose playfully whenever you are trying to be teasing and cheeky." },
  { cat: "🥰 Cute Habits", text: "How you wrap yourself up like a warm little burrito in blankets on chilly mornings." },
  { cat: "🥰 Cute Habits", text: "The sweet, sleepy voice you have in the morning before your first cup of coffee or tea." },
  { cat: "🥰 Cute Habits", text: "How you playfully steal my hoodies and sweaters because they smell like comfort and love." },
  { cat: "🥰 Cute Habits", text: "The cute way you pout when you pretend to be upset, but crack a smile two seconds later." },
  { cat: "🥰 Cute Habits", text: "How you double-check and triple-check cute things before leaving the house." },
  { cat: "🥰 Cute Habits", text: "The silly inside jokes we share where we both laugh so hard tears come to our eyes." },
  { cat: "🥰 Cute Habits", text: "How you get cozy in the car seat and rest your head against my shoulder while I drive." },
  { cat: "🥰 Cute Habits", text: "The sweet little noises you make when stretching or getting into a comfy cuddle position." },
  { cat: "🥰 Cute Habits", text: "How you always save the best and sweetest bite of food to feed to me with a smile." },
  { cat: "🥰 Cute Habits", text: "The adorable concentration face you make when working on something you care deeply about." },
  { cat: "🥰 Cute Habits", text: "How you send me cute animal reels and romantic memes in the middle of a busy workday." },
  { cat: "🥰 Cute Habits", text: "The way you sing your favorite songs in the car with 100% passion even when guessing the lyrics." },
  { cat: "🥰 Cute Habits", text: "How you hold my arm with both hands while walking together through breezy evening streets." },
  { cat: "🥰 Cute Habits", text: "The cute little sighs of pure relief you make when slipping into comfortable home pajamas." },
  { cat: "🥰 Cute Habits", text: "How you excitedly point out pretty sunsets, cute puppies, and sparkling twilight skies." },
  { cat: "🥰 Cute Habits", text: "The sweet habit of texting me 'get home safely' whenever we part ways." },
  { cat: "🥰 Cute Habits", text: "How you always look effortlessly charming even when your hair is in a messy bun." },

  // 🏡 Safe Haven & Comfort (41-60)
  { cat: "🏡 Safe Haven", text: "How every worry, anxiety, and doubt instantly melts away when you wrap your arms around me." },
  { cat: "🏡 Safe Haven", text: "How you make any location in the world feel like home simply by being right there beside me." },
  { cat: "🏡 Safe Haven", text: "The unmatched sense of calm that washes over my heart whenever you hold my hand." },
  { cat: "🏡 Safe Haven", text: "How safe and understood I feel sharing my deepest thoughts and vulnerabilities with you." },
  { cat: "🏡 Safe Haven", text: "Your gentle patience and the kindness you offer even during life's most chaotic days." },
  { cat: "🏡 Safe Haven", text: "The soothing reassurance in your voice reminding me that everything will be alright." },
  { cat: "🏡 Safe Haven", text: "How you love me for exactly who I am, without ever asking me to pretend or change." },
  { cat: "🏡 Safe Haven", text: "The peaceful quiet moments where we don't need to say a word to feel completely connected." },
  { cat: "🏡 Safe Haven", text: "How your hugs feel like returning to a warm fireside shelter after walking through a storm." },
  { cat: "🏡 Safe Haven", text: "The genuine empathy and emotional intelligence you bring into every conversation we have." },
  { cat: "🏡 Safe Haven", text: "How you celebrate my victories as if they were your own and lift me up during low days." },
  { cat: "🏡 Safe Haven", text: "The comfort of knowing that whatever tomorrow brings, we will conquer it together." },
  { cat: "🏡 Safe Haven", text: "How you listen with your entire heart when I need someone to talk to." },
  { cat: "🏡 Safe Haven", text: "The gentle way you brush hair from my forehead with pure tenderness." },
  { cat: "🏡 Safe Haven", text: "How you always know how to make me smile even when the world feels heavy." },
  { cat: "🏡 Safe Haven", text: "The sacred sanctuary of our cozy cuddling sessions under warm starry skylights." },
  { cat: "🏡 Safe Haven", text: "How your loyalty, honesty, and trustworthiness give my heart permanent peace of mind." },
  { cat: "🏡 Safe Haven", text: "The emotional safety of knowing our relationship is built on pure truth and devotion." },
  { cat: "🏡 Safe Haven", text: "How you inspire me to be the strongest, kindest, and most loving version of myself." },
  { cat: "🏡 Safe Haven", text: "The simple truth that you are my anchor, my peace, and my sweetest sanctuary." },

  // 👑 Radiant My Love Nishika (61-80)
  { cat: "💖 Radiant Love", text: "Your natural elegance, royal grace, and the dignified way you carry yourself everywhere." },
  { cat: "💖 Radiant Love", text: "The radiant beauty that shines from your pure golden heart and illuminates your face." },
  { cat: "💖 Radiant Love", text: "How fierce, dedicated, and hardworking you are when pursuing your goals and passions." },
  { cat: "💖 Radiant Love", text: "Your brilliant mind and the captivating perspective you bring to every discussion." },
  { cat: "💖 Radiant Love", text: "How you treat everyone around you with respect, warmth, and generous kindness." },
  { cat: "💖 Radiant Love", text: "The way you light up any gathering simply by walking in with your radiant presence." },
  { cat: "💖 Radiant Love", text: "How your confidence and sweet humility balance each other in the most captivating harmony." },
  { cat: "💖 Radiant Love", text: "Your impeccable style, whether dressed in royal finery or cozy oversized loungewear." },
  { cat: "💖 Radiant Love", text: "The strength and resilience you show when facing challenges, inspiring me every day." },
  { cat: "💖 Radiant Love", text: "How your beauty is timeless, breathtaking, and only grows more radiant with each sunrise." },
  { cat: "💖 Radiant Love", text: "Your sharp wit, wonderful sense of humor, and how quick you are to bring joy to others." },
  { cat: "💖 Radiant Love", text: "How you hold your crown with effortless dignity, never needing to boast or show off." },
  { cat: "💖 Radiant Love", text: "The genuine love and thoughtful care you pour into your family and close friends." },
  { cat: "💖 Radiant Love", text: "How you inspire everyone blessed to know you to become better and kinder human beings." },
  { cat: "💖 Radiant Love", text: "The gentle authority and poise you possess that commands natural respect and love." },
  { cat: "💖 Radiant Love", text: "How proud and honored Dilip feels every single day to walk beside My Love Nishika." },
  { cat: "💖 Radiant Love", text: "Your rare combination of boundless empathy, sharp intellect, and irresistible sweetness." },
  { cat: "💖 Radiant Love", text: "How you turn every ordinary space into a royal palace simply by being in it." },
  { cat: "💖 Radiant Love", text: "The sparkle of wisdom and kindness in your eyes that never dims." },
  { cat: "💖 Radiant Love", text: "Because you are the undisputed, forever-crowned Love of my entire world and heart." },

  // ☕ Daily Moments (81-90)
  { cat: "☕ Daily Moments", text: "The simple joy of grocery shopping together and turning everyday errands into cute dates." },
  { cat: "☕ Daily Moments", text: "Sharing late-night snacks at 1:00 AM while whispering so we don't wake the world." },
  { cat: "☕ Daily Moments", text: "The comforting aroma of morning coffee and tea while enjoying comfortable morning silence." },
  { cat: "☕ Daily Moments", text: "How we exchange cute emojis and sweet check-in messages during busy work hours." },
  { cat: "☕ Daily Moments", text: "Taking spontaneous detours on our way home just to spend ten extra minutes together." },
  { cat: "☕ Daily Moments", text: "Splitting a warm pastry or dessert and playfully fighting over who gets the last bite." },
  { cat: "☕ Daily Moments", text: "Watching movies on the sofa while you rest your feet on my lap for a gentle massage." },
  { cat: "☕ Daily Moments", text: "Singing along terribly to 2000s throwback hits in the car and laughing at ourselves." },
  { cat: "☕ Daily Moments", text: "How cooking a simple dinner together becomes our favorite Michelin-star memory." },
  { cat: "☕ Daily Moments", text: "The sweetest routine of saying 'goodnight, sleep tight, dream of me' every evening." },

  // 💫 Forever Love (91-100)
  { cat: "💫 Forever Love", text: "How easily we envision building a lifetime of beautiful memories, adventures, and milestones." },
  { cat: "💫 Forever Love", text: "The profound reassurance that my heart has found its eternal partner, best friend, and soulmate." },
  { cat: "💫 Forever Love", text: "How every anniversary date we celebrate feels like just the opening chapter of our grand saga." },
  { cat: "💫 Forever Love", text: "Knowing that as we grow older and our hair turns silver, my love for you will only deepen." },
  { cat: "💫 Forever Love", text: "How we promise to hold hands through every season of life — spring blossoms, autumn leaves, and winter snows." },
  { cat: "💫 Forever Love", text: "The sacred vow that no storm in the universe could ever shake our devotion to each other." },
  { cat: "💫 Forever Love", text: "How you make the concept of 'forever' feel not just possible, but the greatest adventure imaginable." },
  { cat: "💫 Forever Love", text: "The certainty that in any universe, in any timeline, my soul would find and choose you again." },
  { cat: "💫 Forever Love", text: "How every sunrise is a fresh opportunity for Dilip to love, protect, and cherish My Love Nishika." },
  { cat: "💫 Forever Love", text: "The eternal truth that I love you more than all words, more than all stars, endlessly and forever." }
];


  let currentCategory = 'all';
  let filteredReasons = [...romanticReasons];
  let currentReasonIndex = 0;

  const loveJarTrigger = document.getElementById('loveJarTrigger');
  const drawReasonBtn = document.getElementById('drawReasonBtn');
  const nextReasonBtn = document.getElementById('nextReasonBtn');
  const shuffleReasonBtn = document.getElementById('shuffleReasonBtn');
  const favReasonBtn = document.getElementById('favReasonBtn');
  const favReasonIcon = document.getElementById('favReasonIcon');
  const foldToggleBtn = document.getElementById('foldToggleBtn');
  const origamiHeartCraft = document.getElementById('origamiHeartCraft');
  const origamiModel = document.getElementById('origamiModel');
  const origamiInterior = document.getElementById('origamiInterior');
  const reasonIndexBadge = document.getElementById('reasonIndexBadge');
  const reasonCategoryBadge = document.getElementById('reasonCategoryBadge');
  const reasonText = document.getElementById('reasonText');
  const drawnCount = document.getElementById('drawnCount');
  const glassJar = document.querySelector('.glass-jar');

  function updateFilteredReasons() {
    if (currentCategory === 'all') {
      filteredReasons = [...romanticReasons];
    } else {
      filteredReasons = romanticReasons.filter(r => r.cat.toLowerCase().includes(currentCategory.toLowerCase()) || currentCategory.toLowerCase().includes(r.cat.toLowerCase()));
      if (filteredReasons.length === 0) filteredReasons = [...romanticReasons];
    }
    currentReasonIndex = 0;
  }

  // Category filter buttons
  document.querySelectorAll('.jar-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.jar-cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-jar-cat');
      updateFilteredReasons();
      drawNextReason(false);
      audioSynth.playPopSound();
      showToast(`Category selected: ${currentCategory} 💖`);
    });
  });

  function spawnFlyingOrigamiHeart(startX, startY, endX, endY) {
    const heart = document.createElement('div');
    heart.className = 'flying-origami-heart';
    heart.textContent = ['💌', '💖', '💎', '💕', '✨', '👑'][Math.floor(Math.random() * 6)];
    heart.style.left = `${startX}px`;
    heart.style.top = `${startY}px`;

    const dx = endX - startX;
    const dy = endY - startY;
    heart.style.setProperty('--target-dx', `${dx}px`);
    heart.style.setProperty('--target-dy', `${dy}px`);

    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1050);
  }

  function toggleOrigamiFold() {
    if (!origamiHeartCraft) return;
    const isUnfolded = origamiHeartCraft.classList.contains('unfolded');
    if (isUnfolded) {
      origamiHeartCraft.classList.remove('unfolded');
      audioSynth.playPopSound();
      showToast('Origami Heart Folded 💖');
    } else {
      origamiHeartCraft.classList.add('unfolded');
      audioSynth.playMagicChime();
      burstConfetti(window.innerWidth * 0.6, window.innerHeight * 0.55, 30);
      showToast('Origami Heart Unfolded ✨');
    }
  }

  if (origamiModel) origamiModel.addEventListener('click', toggleOrigamiFold);
  if (foldToggleBtn) foldToggleBtn.addEventListener('click', toggleOrigamiFold);

  function syncFavIcon(text) {
    if (!favReasonIcon) return;
    const isFav = (state.favoriteReasons || []).includes(text);
    if (isFav) {
      favReasonIcon.className = 'fa-solid fa-bookmark';
      favReasonIcon.style.color = '#fbbf24';
    } else {
      favReasonIcon.className = 'fa-regular fa-bookmark';
      favReasonIcon.style.color = '';
    }
  }

  function drawNextReason(incrementCount = true) {
    if (filteredReasons.length === 0) updateFilteredReasons();
    currentReasonIndex = (currentReasonIndex + 1) % filteredReasons.length;
    const item = filteredReasons[currentReasonIndex];

    if (incrementCount) {
      state.reasonsExplored++;
      saveState();
    }

    if (glassJar) {
      glassJar.classList.remove('jar-wobble');
      void glassJar.offsetWidth;
      glassJar.classList.add('jar-wobble');
    }

    if (glassJar && origamiHeartCraft) {
      const jarRect = glassJar.getBoundingClientRect();
      const craftRect = origamiHeartCraft.getBoundingClientRect();
      const sX = jarRect.left + jarRect.width / 2;
      const sY = jarRect.top + 30;
      const eX = craftRect.left + craftRect.width / 2;
      const eY = craftRect.top + 60;
      spawnFlyingOrigamiHeart(sX, sY, eX, eY);
    }

    audioSynth.playMagicChime();
    burstConfetti(window.innerWidth * 0.55, window.innerHeight * 0.55, 35);

    if (origamiHeartCraft) origamiHeartCraft.classList.add('unfolded');
    if (origamiInterior) {
      origamiInterior.style.animation = 'none';
      void origamiInterior.offsetWidth;
      origamiInterior.style.animation = 'unfoldScaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
    }

    if (reasonIndexBadge) reasonIndexBadge.textContent = `Reason #${currentReasonIndex + 1} of ${filteredReasons.length}`;
    if (reasonCategoryBadge) reasonCategoryBadge.textContent = item.cat;
    if (reasonText) reasonText.textContent = item.text.replace(/{name}/g, state.recipientName);
    if (drawnCount) drawnCount.textContent = state.reasonsExplored;
    syncFavIcon(item.text);
  }

  function drawRandomReason() {
    if (filteredReasons.length === 0) updateFilteredReasons();
    currentReasonIndex = Math.floor(Math.random() * filteredReasons.length);
    const item = filteredReasons[currentReasonIndex];

    state.reasonsExplored++;
    saveState();

    if (glassJar) {
      glassJar.classList.remove('jar-wobble');
      void glassJar.offsetWidth;
      glassJar.classList.add('jar-wobble');
    }

    audioSynth.playCelebrationFanfare();
    burstConfetti(window.innerWidth * 0.55, window.innerHeight * 0.55, 45);

    if (origamiHeartCraft) origamiHeartCraft.classList.add('unfolded');
    if (reasonIndexBadge) reasonIndexBadge.textContent = `Reason #${currentReasonIndex + 1} of ${filteredReasons.length}`;
    if (reasonCategoryBadge) reasonCategoryBadge.textContent = item.cat;
    if (reasonText) reasonText.textContent = item.text.replace(/{name}/g, state.recipientName);
    if (drawnCount) drawnCount.textContent = state.reasonsExplored;
    syncFavIcon(item.text);
    showToast('Shuffled to a random sweet love confession! 🔀💖');
  }

  if (loveJarTrigger) {
    loveJarTrigger.addEventListener('click', (e) => {
      if (e.target.closest('#drawReasonBtn') || e.target.closest('.jar-cat-btn')) return;
      drawNextReason();
    });
  }
  if (drawReasonBtn) {
    drawReasonBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      drawNextReason();
    });
  }
  if (nextReasonBtn) {
    nextReasonBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      drawNextReason();
    });
  }
  if (shuffleReasonBtn) {
    shuffleReasonBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      drawRandomReason();
    });
  }

  // --------------------------------------------------------------------------
  // REDEEMABLE COUPLE LOVE COUPONS CONTROLLER
  // --------------------------------------------------------------------------
  document.querySelectorAll('.btn-claim-coupon').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const ticket = btn.closest('.coupon-ticket');
      const couponId = btn.getAttribute('data-target') || (ticket ? ticket.getAttribute('data-coupon-id') : null);
      if (!couponId) return;

      if (!state.claimedCoupons.includes(couponId)) {
        state.claimedCoupons.push(couponId);
        saveState();
      }

      btn.style.display = 'none';
      if (ticket) {
        const stamp = ticket.querySelector('.claimed-stamp');
        if (stamp) stamp.classList.remove('hidden');
      }

      audioSynth.playCelebrationFanfare();
      burstConfetti(e.clientX || window.innerWidth / 2, e.clientY || window.innerHeight / 2, 50);
      const title = ticket ? ticket.querySelector('h4').textContent.trim() : 'Love Voucher';
      showToast(`Coupon Claimed: "${title}" 🎟️💖 Saved in your heart!`);
    });
  });

  // --------------------------------------------------------------------------
  // ROMANTIC COUPLE BUCKET LIST CONTROLLER
  // --------------------------------------------------------------------------
  const bucketProgressFill = document.getElementById('bucketProgressFill');
  const bucketStatsText = document.getElementById('bucketStatsText');
  const bucketItemsGrid = document.getElementById('bucketItemsGrid');
  const addBucketForm = document.getElementById('addBucketForm');
  const newBucketTitleInput = document.getElementById('newBucketTitleInput');

  function updateBucketListUI() {
    const allItems = document.querySelectorAll('.bucket-item');
    let completedCount = 0;

    allItems.forEach(item => {
      const id = item.getAttribute('data-bucket-id');
      const isCompleted = state.completedBucketItems.includes(id);
      const stamp = item.querySelector('.bucket-stamp');

      if (isCompleted) {
        item.classList.add('completed');
        if (stamp) stamp.classList.remove('hidden');
        completedCount++;
      } else {
        item.classList.remove('completed');
        if (stamp) stamp.classList.add('hidden');
      }
    });

    const total = allItems.length;
    const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;
    if (bucketProgressFill) bucketProgressFill.style.width = `${pct}%`;
    if (bucketStatsText) bucketStatsText.textContent = `${completedCount} of ${total} Dreams Cherished (${pct}%) ✨`;
  }

  function bindBucketItemClick(item) {
    item.addEventListener('click', (e) => {
      const id = item.getAttribute('data-bucket-id');
      const idx = state.completedBucketItems.indexOf(id);
      if (idx > -1) {
        state.completedBucketItems.splice(idx, 1);
        showToast('Dream marked for future adventures 🗺️');
      } else {
        state.completedBucketItems.push(id);
        audioSynth.playCelebrationFanfare();
        burstConfetti(e.clientX || window.innerWidth / 2, e.clientY || window.innerHeight / 2, 45);
        showToast('Dream Cherished & Marked Hand in Hand! 💕✨');
      }
      saveState();
      updateBucketListUI();
    });
  }

  document.querySelectorAll('.bucket-item').forEach(item => bindBucketItemClick(item));

  // Render Custom Bucket Items
  if (state.customBucketItems && state.customBucketItems.length > 0 && bucketItemsGrid) {
    state.customBucketItems.forEach(custom => {
      const itemEl = document.createElement('div');
      itemEl.className = 'bucket-item';
      itemEl.setAttribute('data-bucket-id', custom.id);
      itemEl.innerHTML = `
        <div class="bucket-check-box"><i class="fa-solid fa-check"></i></div>
        <div class="bucket-item-content">
          <h4 class="bucket-item-title">${escapeHtml(custom.title)}</h4>
          <p class="bucket-item-desc">${escapeHtml(custom.desc || 'A personalized romantic dream added with love 💕')}</p>
        </div>
        <span class="bucket-stamp hidden">CHERISHED ✨</span>
      `;
      bucketItemsGrid.appendChild(itemEl);
      bindBucketItemClick(itemEl);
    });
  }

  updateBucketListUI();

  if (addBucketForm && newBucketTitleInput) {
    addBucketForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = newBucketTitleInput.value.trim();
      if (!text) return;

      const newId = 'custom-' + Date.now();
      const newItem = { id: newId, title: text, desc: `Added with love by ${state.senderName} & ${state.recipientName} 💕` };
      state.customBucketItems.push(newItem);
      saveState();

      if (bucketItemsGrid) {
        const itemEl = document.createElement('div');
        itemEl.className = 'bucket-item';
        itemEl.setAttribute('data-bucket-id', newId);
        itemEl.innerHTML = `
          <div class="bucket-check-box"><i class="fa-solid fa-check"></i></div>
          <div class="bucket-item-content">
            <h4 class="bucket-item-title">${escapeHtml(text)}</h4>
            <p class="bucket-item-desc">${escapeHtml(newItem.desc)}</p>
          </div>
          <span class="bucket-stamp hidden">CHERISHED ✨</span>
        `;
        bucketItemsGrid.appendChild(itemEl);
        bindBucketItemClick(itemEl);
      }

      newBucketTitleInput.value = '';
      updateBucketListUI();
      audioSynth.playMagicChime();
      burstConfetti(window.innerWidth / 2, window.innerHeight * 0.6, 40);
      showToast('New couple dream added to our Bucket List! 🗺️✨');
    });
  }

  if (favReasonBtn) {
    favReasonBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const currentItem = filteredReasons[currentReasonIndex];
      if (!currentItem) return;
      state.favoriteReasons = state.favoriteReasons || [];
      const idx = state.favoriteReasons.indexOf(currentItem.text);
      if (idx > -1) {
        state.favoriteReasons.splice(idx, 1);
        showToast('Removed reason from favorites');
      } else {
        state.favoriteReasons.push(currentItem.text);
        showToast('Reason bookmarked in your heart! ⭐💖');
        audioSynth.playPopSound();
      }
      saveState();
      syncFavIcon(currentItem.text);
    });
  }


  // --------------------------------------------------------------------------
  // MUSIC LOUNGE INSTRUMENT TABS CONTROLLER
  // --------------------------------------------------------------------------
  const tabPianoBtn = document.getElementById('tabPianoBtn');
  const tabGuitarBtn = document.getElementById('tabGuitarBtn');
  const tabTapeBtn = document.getElementById('tabTapeBtn');
  const pianoView = document.getElementById('pianoView');
  const guitarView = document.getElementById('guitarView');
  const tapeView = document.getElementById('tapeView');

  function switchInstrumentTab(target) {
    [tabPianoBtn, tabGuitarBtn, tabTapeBtn].forEach(b => { if (b) b.classList.remove('active'); });
    [pianoView, guitarView, tapeView].forEach(v => { if (v) v.classList.remove('active'); });

    if (typeof stopPianoSong === 'function') stopPianoSong();
    if (typeof stopGuitarSong === 'function') stopGuitarSong();
    if (typeof pauseTapePlayback === 'function') pauseTapePlayback();

    if (target === 'piano' && tabPianoBtn && pianoView) {
      tabPianoBtn.classList.add('active');
      pianoView.classList.add('active');
      audioSynth.playTone(523.25, 0.3, 'sine');
      showToast('Switched to Grand Piano Lounge 🎹✨');
    } else if (target === 'guitar' && tabGuitarBtn && guitarView) {
      tabGuitarBtn.classList.add('active');
      guitarView.classList.add('active');
      audioSynth.playGuitarChord('C');
      showToast('Switched to Acoustic Guitar Serenade 🎸💖');
    } else if (target === 'tape' && tabTapeBtn && tapeView) {
      tabTapeBtn.classList.add('active');
      tapeView.classList.add('active');
      audioSynth.playPopSound();
      showToast('Switched to Vintage Mixtape Cassette Deck 📼🎶');
    }
  }

  if (tabPianoBtn) tabPianoBtn.addEventListener('click', () => switchInstrumentTab('piano'));
  if (tabGuitarBtn) tabGuitarBtn.addEventListener('click', () => switchInstrumentTab('guitar'));
  if (tabTapeBtn) tabTapeBtn.addEventListener('click', () => switchInstrumentTab('tape'));

  // Piano Auto-Play Songs
  const pianoSongs = {
    'bday-song': [
      { note: 'C4', f: 261.63, d: 0.35 }, { note: 'C4', f: 261.63, d: 0.2 },
      { note: 'D4', f: 293.66, d: 0.45 }, { note: 'C4', f: 261.63, d: 0.45 },
      { note: 'F4', f: 349.23, d: 0.45 }, { note: 'E4', f: 329.63, d: 0.8 },
      { note: 'C4', f: 261.63, d: 0.35 }, { note: 'C4', f: 261.63, d: 0.2 },
      { note: 'D4', f: 293.66, d: 0.45 }, { note: 'C4', f: 261.63, d: 0.45 },
      { note: 'G4', f: 392.00, d: 0.45 }, { note: 'F4', f: 349.23, d: 0.8 },
      { note: 'C4', f: 261.63, d: 0.35 }, { note: 'C4', f: 261.63, d: 0.2 },
      { note: 'C5', f: 523.25, d: 0.45 }, { note: 'A4', f: 440.00, d: 0.45 },
      { note: 'F4', f: 349.23, d: 0.45 }, { note: 'E4', f: 329.63, d: 0.45 },
      { note: 'D4', f: 293.66, d: 0.6 },
      { note: 'A#4', f: 466.16, d: 0.35 }, { note: 'A#4', f: 466.16, d: 0.2 },
      { note: 'A4', f: 440.00, d: 0.45 }, { note: 'F4', f: 349.23, d: 0.45 },
      { note: 'G4', f: 392.00, d: 0.45 }, { note: 'F4', f: 349.23, d: 1.0 }
    ],
    'thousand-years': [
      { note: 'C4', f: 261.63, d: 0.4 }, { note: 'E4', f: 329.63, d: 0.4 },
      { note: 'G4', f: 392.00, d: 0.4 }, { note: 'A4', f: 440.00, d: 0.5 },
      { note: 'G4', f: 392.00, d: 0.4 }, { note: 'E4', f: 329.63, d: 0.4 },
      { note: 'F4', f: 349.23, d: 0.5 }, { note: 'E4', f: 329.63, d: 0.4 },
      { note: 'D4', f: 293.66, d: 0.6 }, { note: 'C4', f: 261.63, d: 0.8 },
      { note: 'G4', f: 392.00, d: 0.5 }, { note: 'A4', f: 440.00, d: 0.6 },
      { note: 'C5', f: 523.25, d: 0.9 }, { note: 'B4', f: 493.88, d: 0.5 },
      { note: 'A4', f: 440.00, d: 0.8 }
    ],
    'all-of-me': [
      { note: 'F4', f: 349.23, d: 0.35 }, { note: 'G#4', f: 415.30, d: 0.35 },
      { note: 'C5', f: 523.25, d: 0.5 }, { note: 'A#4', f: 466.16, d: 0.4 },
      { note: 'G#4', f: 415.30, d: 0.4 }, { note: 'F4', f: 349.23, d: 0.6 },
      { note: 'C4', f: 261.63, d: 0.4 }, { note: 'F4', f: 349.23, d: 0.4 },
      { note: 'G4', f: 392.00, d: 0.5 }, { note: 'G#4', f: 415.30, d: 0.7 },
      { note: 'C5', f: 523.25, d: 0.6 }, { note: 'D#5', f: 622.25, d: 0.6 },
      { note: 'C5', f: 523.25, d: 0.9 }
    ],
    'golden-hour': [
      { note: 'C5', f: 523.25, d: 0.3 }, { note: 'D5', f: 587.33, d: 0.3 },
      { note: 'E5', f: 659.25, d: 0.4 }, { note: 'G4', f: 392.00, d: 0.3 },
      { note: 'C5', f: 523.25, d: 0.3 }, { note: 'E5', f: 659.25, d: 0.4 },
      { note: 'D5', f: 587.33, d: 0.3 }, { note: 'C5', f: 523.25, d: 0.3 },
      { note: 'B4', f: 493.88, d: 0.4 }, { note: 'A4', f: 440.00, d: 0.5 },
      { note: 'C5', f: 523.25, d: 0.6 }, { note: 'G4', f: 392.00, d: 0.8 }
    ],
    'river-flows': [
      { note: 'A4', f: 440.00, d: 0.4 }, { note: 'B4', f: 493.88, d: 0.3 },
      { note: 'C#5', f: 554.37, d: 0.5 }, { note: 'B4', f: 493.88, d: 0.3 },
      { note: 'C#5', f: 554.37, d: 0.5 }, { note: 'A4', f: 440.00, d: 0.6 },
      { note: 'E5', f: 659.25, d: 0.5 }, { note: 'D5', f: 587.33, d: 0.4 },
      { note: 'C#5', f: 554.37, d: 0.6 }, { note: 'B4', f: 493.88, d: 0.7 }
    ],
    'fur-elise': [
      { note: 'E5', f: 659.25, d: 0.3 }, { note: 'D#5', f: 622.25, d: 0.3 },
      { note: 'E5', f: 659.25, d: 0.3 }, { note: 'D#5', f: 622.25, d: 0.3 },
      { note: 'E5', f: 659.25, d: 0.3 }, { note: 'B4', f: 493.88, d: 0.3 },
      { note: 'D5', f: 587.33, d: 0.3 }, { note: 'C5', f: 523.25, d: 0.3 },
      { note: 'A4', f: 440.00, d: 0.7 }, { note: 'C4', f: 261.63, d: 0.3 },
      { note: 'E4', f: 329.63, d: 0.3 }, { note: 'A4', f: 440.00, d: 0.3 },
      { note: 'B4', f: 493.88, d: 0.7 }
    ]
  };

  let currentPianoSongTimer = null;
  let activePianoSongBtn = null;
  const stopPianoSongBtn = document.getElementById('stopPianoSongBtn');

  function triggerPianoKeyVisual(keyEl) {
    if (!keyEl) return;
    keyEl.classList.remove('active');
    void keyEl.offsetWidth;
    keyEl.classList.add('active');
    setTimeout(() => keyEl.classList.remove('active'), 250);
  }

  function stopPianoSong() {
    if (currentPianoSongTimer) clearTimeout(currentPianoSongTimer);
    if (activePianoSongBtn) activePianoSongBtn.classList.remove('playing');
    if (stopPianoSongBtn) stopPianoSongBtn.classList.add('hidden');
    activePianoSongBtn = null;
  }

  if (stopPianoSongBtn) stopPianoSongBtn.addEventListener('click', stopPianoSong);

  // Piano Key Interactive Clicks & Touches
  const pianoKeys = document.querySelectorAll('.piano-key');
  pianoKeys.forEach(key => {
    const playKey = () => {
      stopBackgroundMusic();
      stopPianoSong();
      if (typeof stopGuitarSong === 'function') stopGuitarSong();
      if (typeof pauseTapePlayback === 'function') pauseTapePlayback();
      const freq = parseFloat(key.dataset.freq);
      if (freq) {
        audioSynth.playPianoKey(freq, 1.5);
        triggerPianoKeyVisual(key);
      }
    };
    key.addEventListener('click', playKey);
    key.addEventListener('touchstart', (e) => {
      e.preventDefault();
      playKey();
    }, { passive: false });
  });

  // Physical Keyboard Support for Piano (Keys 1-8 / Q-U)
  const pianoKeyMap = {
    '1': 'C4', 'q': 'C4', 'Q': 'C4',
    '!': 'C#4',
    '2': 'D4', 'w': 'D4', 'W': 'D4',
    '@': 'D#4',
    '3': 'E4', 'e': 'E4', 'E': 'E4',
    '4': 'F4', 'r': 'F4', 'R': 'F4',
    '$': 'F#4',
    '5': 'G4', 't': 'G4', 'T': 'G4',
    '%': 'G#4',
    '6': 'A4', 'y': 'A4', 'Y': 'A4',
    '^': 'A#4',
    '7': 'B4', 'u': 'B4', 'U': 'B4',
    '8': 'C5', 'i': 'C5', 'I': 'C5'
  };
  window.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;
    if (!pianoView || !pianoView.classList.contains('active')) return;
    const note = pianoKeyMap[e.key];
    if (note) {
      const keyEl = document.querySelector(`.piano-key[data-note="${note}"]`);
      if (keyEl) {
        stopBackgroundMusic();
        stopPianoSong();
        if (typeof stopGuitarSong === 'function') stopGuitarSong();
        if (typeof pauseTapePlayback === 'function') pauseTapePlayback();
        const freq = parseFloat(keyEl.dataset.freq);
        if (freq) {
          audioSynth.playPianoKey(freq, 1.5);
          triggerPianoKeyVisual(keyEl);
        }
      }
    }
  });

  document.querySelectorAll('[data-piano-song]').forEach(btn => {
    btn.addEventListener('click', () => {
      stopBackgroundMusic();
      if (typeof stopGuitarSong === 'function') stopGuitarSong();
      if (typeof pauseTapePlayback === 'function') pauseTapePlayback();

      const songKey = btn.getAttribute('data-piano-song');
      const song = pianoSongs[songKey];
      if (!song) return;

      stopPianoSong();
      activePianoSongBtn = btn;
      btn.classList.add('playing');
      if (stopPianoSongBtn) stopPianoSongBtn.classList.remove('hidden');

      let step = 0;
      function playNextNote() {
        if (!activePianoSongBtn) return;
        const current = song[step % song.length];
        audioSynth.playPianoKey(current.f, current.d * 1.5);

        const targetKey = document.querySelector(`.piano-key[data-note="${current.note}"]`);
        if (targetKey) triggerPianoKeyVisual(targetKey);

        step++;
        currentPianoSongTimer = setTimeout(playNextNote, (current.d + 0.05) * 1000);
      }
      playNextNote();
      showToast(`Playing ${btn.textContent.trim()} 🎹✨`);
    });
  });

  // --- 🎸 ACOUSTIC GUITAR INTERACTIVE CONTROLLER ---
  const guitarStringRows = document.querySelectorAll('.guitar-string-row');
  const chordBtns = document.querySelectorAll('.chord-btn');
  const stopGuitarSongBtn = document.getElementById('stopGuitarSongBtn');
  let currentGuitarSongTimer = null;
  let activeGuitarSongBtn = null;

  function triggerStringVibration(rowEl) {
    if (!rowEl) return;
    rowEl.classList.remove('vibrating');
    void rowEl.offsetWidth;
    rowEl.classList.add('vibrating');
  }

  guitarStringRows.forEach(row => {
    const pluck = () => {
      stopBackgroundMusic();
      stopPianoSong();
      if (typeof pauseTapePlayback === 'function') pauseTapePlayback();

      const freq = parseFloat(row.dataset.freq);
      if (freq) {
        audioSynth.playGuitarString(freq, 2.0);
        triggerStringVibration(row);
      }
    };

    row.addEventListener('click', pluck);
    row.addEventListener('mouseenter', (e) => {
      if (e.buttons === 1) pluck();
    });
    row.addEventListener('touchstart', (e) => {
      pluck();
    }, { passive: true });
  });

  // Pluck Pill Buttons directly trigger pluck
  document.querySelectorAll('.pluck-pill-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const row = btn.closest('.guitar-string-row');
      if (row) {
        stopBackgroundMusic();
        stopPianoSong();
        if (typeof pauseTapePlayback === 'function') pauseTapePlayback();
        const freq = parseFloat(row.dataset.freq);
        if (freq) {
          audioSynth.playGuitarString(freq, 2.0);
          triggerStringVibration(row);
        }
      }
    });
  });

  function stopAllLoungeMusic() {
    stopPianoSong();
    stopGuitarSong();
    if (typeof pauseTapePlayback === 'function') pauseTapePlayback();
  }

  // Chord Buttons
  chordBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      stopBackgroundMusic();
      stopPianoSong();
      if (typeof pauseTapePlayback === 'function') pauseTapePlayback();

      const chord = btn.getAttribute('data-chord');
      audioSynth.playGuitarChord(chord);

      btn.classList.add('active');
      setTimeout(() => btn.classList.remove('active'), 300);

      guitarStringRows.forEach((row, i) => {
        setTimeout(() => triggerStringVibration(row), i * 30);
      });

      showToast(`Strumming ${chord} Chord 🎸✨`);
    });
  });

  // Guitar Auto-Play Serenade Songs
  const guitarSongs = {
    'perfect': [
      { chord: 'G', delay: 1.8 }, { chord: 'Em', delay: 1.8 },
      { chord: 'C', delay: 1.8 }, { chord: 'D', delay: 2.0 }
    ],
    'until-i-found-you': [
      { chord: 'C', delay: 1.6 }, { chord: 'Em', delay: 1.6 },
      { chord: 'F', delay: 1.6 }, { chord: 'G', delay: 1.8 }
    ],
    'cant-help': [
      { chord: 'C', delay: 1.6 }, { chord: 'Em', delay: 1.6 },
      { chord: 'Am', delay: 1.6 }, { chord: 'F', delay: 1.6 },
      { chord: 'C', delay: 1.6 }, { chord: 'G', delay: 2.0 }
    ],
    'love-story': [
      { chord: 'C', delay: 1.8 }, { chord: 'G', delay: 1.8 },
      { chord: 'Am', delay: 1.8 }, { chord: 'F', delay: 2.0 }
    ],
    'photograph': [
      { chord: 'D', delay: 1.8 }, { chord: 'Em', delay: 1.8 },
      { chord: 'G', delay: 1.8 }, { chord: 'D', delay: 2.0 }
    ],
    'just-the-way': [
      { chord: 'F', delay: 1.8 }, { chord: 'Am', delay: 1.8 },
      { chord: 'C', delay: 1.8 }, { chord: 'G', delay: 2.0 }
    ]
  };

  function stopGuitarSong() {
    if (currentGuitarSongTimer) clearTimeout(currentGuitarSongTimer);
    if (activeGuitarSongBtn) activeGuitarSongBtn.classList.remove('playing');
    if (stopGuitarSongBtn) stopGuitarSongBtn.classList.add('hidden');
    activeGuitarSongBtn = null;
  }

  if (stopGuitarSongBtn) stopGuitarSongBtn.addEventListener('click', stopGuitarSong);

  document.querySelectorAll('[data-guitar-song]').forEach(btn => {
    btn.addEventListener('click', () => {
      stopBackgroundMusic();
      stopPianoSong();
      if (typeof pauseTapePlayback === 'function') pauseTapePlayback();

      const songKey = btn.getAttribute('data-guitar-song');
      const song = guitarSongs[songKey];
      if (!song) return;

      stopGuitarSong();
      activeGuitarSongBtn = btn;
      btn.classList.add('playing');
      if (stopGuitarSongBtn) stopGuitarSongBtn.classList.remove('hidden');

      let step = 0;
      function playNextChord() {
        if (!activeGuitarSongBtn) return;
        const current = song[step % song.length];
        audioSynth.playGuitarChord(current.chord);

        const matchBtn = document.querySelector(`.chord-btn[data-chord="${current.chord}"]`);
        if (matchBtn) {
          matchBtn.classList.add('active');
          setTimeout(() => matchBtn.classList.remove('active'), 400);
        }

        guitarStringRows.forEach((row, i) => {
          setTimeout(() => triggerStringVibration(row), i * 30);
        });

        step++;
        currentGuitarSongTimer = setTimeout(playNextChord, current.delay * 1000);
      }
      playNextChord();
      showToast(`Serenading with ${btn.textContent.trim()} 🎸💖`);
    });
  });

  // --- 🎸 Physical Keyboard Playing for Acoustic Guitar ---
  const guitarStringKeyMap = {
    '1': 0, 'q': 0, 'Q': 0,
    '2': 1, 'w': 1, 'W': 1,
    '3': 2, 'e': 2, 'E': 2,
    '4': 3, 'r': 3, 'R': 3,
    '5': 4, 't': 4, 'T': 4,
    '6': 5, 'y': 5, 'Y': 5
  };

  const guitarChordKeyMap = {
    'a': 'C', 'A': 'C', 'z': 'C', 'Z': 'C',
    's': 'G', 'S': 'G', 'x': 'G', 'X': 'G',
    'd': 'Am', 'D': 'Am', 'c': 'Am', 'C': 'Am',
    'f': 'F', 'F': 'F', 'v': 'F', 'V': 'F',
    'g': 'Em', 'G': 'Em', 'b': 'Em', 'B': 'Em',
    'h': 'D', 'H': 'D', 'n': 'D', 'N': 'D'
  };

  window.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (!guitarView || !guitarView.classList.contains('active')) return;

    // Pluck individual guitar string
    const stringIndex = guitarStringKeyMap[e.key];
    if (stringIndex !== undefined) {
      const row = document.querySelector(`.guitar-string-row[data-string-idx="${stringIndex}"]`);
      if (row) {
        stopBackgroundMusic();
        stopPianoSong();
        stopGuitarSong();
        if (typeof pauseTapePlayback === 'function') pauseTapePlayback();

        const freq = parseFloat(row.dataset.freq);
        if (freq) {
          audioSynth.playGuitarString(freq, 2.5);
          triggerStringVibration(row);
        }
      }
      return;
    }

    // Strum Instant Chord
    const chordName = guitarChordKeyMap[e.key];
    if (chordName) {
      const chordBtn = document.querySelector(`.chord-btn[data-chord="${chordName}"]`);
      stopBackgroundMusic();
      stopPianoSong();
      stopGuitarSong();
      if (typeof pauseTapePlayback === 'function') pauseTapePlayback();

      audioSynth.playGuitarChord(chordName);

      if (chordBtn) {
        chordBtn.classList.add('active');
        setTimeout(() => chordBtn.classList.remove('active'), 320);
      }

      guitarStringRows.forEach((row, i) => {
        setTimeout(() => triggerStringVibration(row), i * 28);
      });

      showToast(`Strumming ${chordName} Chord via Keyboard 🎸✨`);
    }
  });

  // --- 📼 VINTAGE MIXTAPE CASSETTE CONTROLLER (EXPANDED ROMANTIC & BIRTHDAY PLAYLIST) ---
  const tapeTracks = [
    { title: "Track 1: A Thousand Years (Sweet Romance)", notes: [{f: 440, d: 0.5}, {f: 493.88, d: 0.5}, {f: 554.37, d: 0.8}, {f: 493.88, d: 0.5}, {f: 440, d: 1.0}] },
    { title: "Track 2: Can't Help Falling In Love", notes: [{f: 261.63, d: 0.6}, {f: 329.63, d: 0.6}, {f: 392, d: 0.8}, {f: 349.23, d: 0.6}, {f: 329.63, d: 0.6}, {f: 293.66, d: 1.2}] },
    { title: "Track 3: Golden Hour Piano Sunset", notes: [{f: 523.25, d: 0.4}, {f: 587.33, d: 0.4}, {f: 659.25, d: 0.6}, {f: 587.33, d: 0.4}, {f: 523.25, d: 0.8}] },
    { title: "Track 4: Happy Birthday Royal Celebration", notes: [{f: 261.63, d: 0.3}, {f: 261.63, d: 0.2}, {f: 293.66, d: 0.4}, {f: 261.63, d: 0.4}, {f: 349.23, d: 0.4}, {f: 329.63, d: 0.8}] },
    { title: "Track 5: Until I Found You (Vintage 50s Ballad)", notes: [{f: 329.63, d: 0.5}, {f: 392.00, d: 0.5}, {f: 440.00, d: 0.8}, {f: 392.00, d: 0.5}, {f: 349.23, d: 0.5}, {f: 329.63, d: 1.0}] },
    { title: "Track 6: Perfect Symphony (Ed Sheeran)", notes: [{f: 392.00, d: 0.5}, {f: 440.00, d: 0.5}, {f: 523.25, d: 0.8}, {f: 493.88, d: 0.5}, {f: 440.00, d: 0.5}, {f: 392.00, d: 1.2}] },
    { title: "Track 7: Fly Me To The Moon (Romantic Jazz)", notes: [{f: 440.00, d: 0.4}, {f: 392.00, d: 0.4}, {f: 349.23, d: 0.4}, {f: 329.63, d: 0.4}, {f: 293.66, d: 0.8}, {f: 349.23, d: 0.8}] },
    { title: "Track 8: You Are The Reason (Calum Scott)", notes: [{f: 349.23, d: 0.4}, {f: 392.00, d: 0.4}, {f: 440.00, d: 0.6}, {f: 523.25, d: 0.8}, {f: 440.00, d: 0.5}, {f: 349.23, d: 1.0}] }
  ];

  let currentTapeIndex = 0;
  let isTapePlaying = false;
  let tapeTimerInterval = null;
  let tapeSeconds = 0;
  let tapeMelodyTimer = null;

  const tapeTrackTitle = document.getElementById('tapeTrackTitle');
  const tapePlayBtn = document.getElementById('tapePlayBtn');
  const tapePlayIcon = document.getElementById('tapePlayIcon');
  const tapePrevBtn = document.getElementById('tapePrevBtn');
  const tapeNextBtn = document.getElementById('tapeNextBtn');
  const tapeTimerDisplay = document.getElementById('tapeTimerDisplay');
  const spoolLeft = document.getElementById('spoolLeft');
  const spoolRight = document.getElementById('spoolRight');
  const tapeCrackleBtn = document.getElementById('tapeCrackleBtn');
  const crackleStatus = document.getElementById('crackleStatus');

  let vinylCrackleEnabled = false;
  let vinylCrackleNode = null;

  function updateTapeTrackInfo() {
    if (tapeTrackTitle) tapeTrackTitle.textContent = tapeTracks[currentTapeIndex].title;
  }

  function playTapeMelody() {
    const track = tapeTracks[currentTapeIndex];
    let noteIdx = 0;
    function nextNote() {
      if (!isTapePlaying) return;
      const n = track.notes[noteIdx % track.notes.length];
      audioSynth.playPianoKey(n.f, n.d * 1.5);
      noteIdx++;
      tapeMelodyTimer = setTimeout(nextNote, n.d * 1000);
    }
    nextNote();
  }

  function pauseTapePlayback() {
    if (isTapePlaying) {
      isTapePlaying = false;
      if (tapePlayIcon) {
        tapePlayIcon.classList.remove('fa-pause');
        tapePlayIcon.classList.add('fa-play');
      }
      if (spoolLeft) spoolLeft.classList.remove('spinning');
      if (spoolRight) spoolRight.classList.remove('spinning');
      if (tapeTimerInterval) clearInterval(tapeTimerInterval);
      if (tapeMelodyTimer) clearTimeout(tapeMelodyTimer);
    }
  }

  function toggleTapePlayback() {
    if (isTapePlaying) {
      pauseTapePlayback();
    } else {
      stopBackgroundMusic();
      stopPianoSong();
      stopGuitarSong();

      isTapePlaying = true;
      if (tapePlayIcon) {
        tapePlayIcon.classList.remove('fa-play');
        tapePlayIcon.classList.add('fa-pause');
      }
      if (spoolLeft) spoolLeft.classList.add('spinning');
      if (spoolRight) spoolRight.classList.add('spinning');

      tapeTimerInterval = setInterval(() => {
        tapeSeconds++;
        const mins = String(Math.floor(tapeSeconds / 60)).padStart(2, '0');
        const secs = String(tapeSeconds % 60).padStart(2, '0');
        if (tapeTimerDisplay) tapeTimerDisplay.textContent = `${mins}:${secs}`;
      }, 1000);

      playTapeMelody();
      showToast(`Playing Vintage Mixtape: ${tapeTracks[currentTapeIndex].title} 📼🎶`);
    }
  }

  if (tapePlayBtn) tapePlayBtn.addEventListener('click', toggleTapePlayback);

  if (tapeNextBtn) {
    tapeNextBtn.addEventListener('click', () => {
      stopBackgroundMusic();
      stopPianoSong();
      stopGuitarSong();

      currentTapeIndex = (currentTapeIndex + 1) % tapeTracks.length;
      updateTapeTrackInfo();
      audioSynth.playPopSound();
      if (isTapePlaying) {
        if (tapeMelodyTimer) clearTimeout(tapeMelodyTimer);
        playTapeMelody();
      }
    });
  }

  if (tapePrevBtn) {
    tapePrevBtn.addEventListener('click', () => {
      stopBackgroundMusic();
      stopPianoSong();
      stopGuitarSong();

      currentTapeIndex = (currentTapeIndex - 1 + tapeTracks.length) % tapeTracks.length;
      updateTapeTrackInfo();
      audioSynth.playPopSound();
      if (isTapePlaying) {
        if (tapeMelodyTimer) clearTimeout(tapeMelodyTimer);
        playTapeMelody();
      }
    });
  }

  if (tapeCrackleBtn) {
    tapeCrackleBtn.addEventListener('click', () => {
      vinylCrackleEnabled = !vinylCrackleEnabled;
      if (crackleStatus) crackleStatus.textContent = vinylCrackleEnabled ? 'Crackle: Warm Hi-Fi ✨' : 'Crackle: Off';
      if (vinylCrackleEnabled) {
        audioSynth.initContext();
        if (!vinylCrackleNode) vinylCrackleNode = audioSynth.createVinylCrackle();
        showToast('Vinyl warmth crackle enabled! 📻✨');
      } else {
        if (vinylCrackleNode) {
          try { vinylCrackleNode.source.stop(); } catch(e){}
          vinylCrackleNode = null;
        }
        showToast('Vinyl crackle disabled');
      }
      audioSynth.playPopSound();
    });
  }

  // --------------------------------------------------------------------------
  // 14. SECTION 7: REALISTIC 3D FOREVER FLOWER BOUQUET STUDIO
  // --------------------------------------------------------------------------
  const bouquetBloomsArena = document.getElementById('bouquetBloomsArena');
  const bouquetStage = document.getElementById('bouquetStage');
  const bouquetWrapper = document.getElementById('bouquetWrapper');
  const giftBouquetBtn = document.getElementById('giftBouquetBtn');
  const clearBouquetBtn = document.getElementById('clearBouquetBtn');
  const satinRibbonBow = document.getElementById('satinRibbonBow');
  const bouquetTagText = document.getElementById('bouquetTagText');

  // Gifting Ceremony Modal Elements
  const bouquetGiftingOverlay = document.getElementById('bouquetGiftingOverlay');
  const closeGiftingModalBtn = document.getElementById('closeGiftingModalBtn');
  const heroBloomsDome = document.getElementById('heroBloomsDome');
  const heroRibbonBow = document.getElementById('heroRibbonBow');
  const acceptBouquetBtn = document.getElementById('acceptBouquetBtn');
  const vaseBouquetBtn = document.getElementById('vaseBouquetBtn');
  const giftingSenderName = document.getElementById('giftingSenderName');

  // Sync Tag with Recipient Name
  if (bouquetTagText) {
    bouquetTagText.textContent = `To My Love ${state.recipientName} 👑 Forever In Bloom`;
  }

  // 3D Perspective Mouse & Touch Tilt Physics
  if (bouquetStage && bouquetWrapper) {
    let isTiltActive = false;

    bouquetStage.addEventListener('mouseenter', () => { isTiltActive = true; });
    bouquetStage.addEventListener('mouseleave', () => {
      isTiltActive = false;
      bouquetWrapper.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0px)';
    });

    let tiltRafId = null;

    bouquetStage.addEventListener('mousemove', (e) => {
      if (tiltRafId) return;
      tiltRafId = requestAnimationFrame(() => {
        const rect = bouquetStage.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rotY = (x / (rect.width / 2)) * 24;
        const rotX = -(y / (rect.height / 2)) * 20;
        bouquetWrapper.style.transform = `rotateX(${rotX.toFixed(1)}deg) rotateY(${rotY.toFixed(1)}deg) translateZ(25px)`;
        tiltRafId = null;
      });
    });

    // Touch tilt for mobile screens
    bouquetStage.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const rect = bouquetStage.getBoundingClientRect();
        const touch = e.touches[0];
        const x = touch.clientX - rect.left - rect.width / 2;
        const y = touch.clientY - rect.top - rect.height / 2;
        const rotY = Math.max(-20, Math.min(20, (x / (rect.width / 2)) * 22));
        const rotX = Math.max(-16, Math.min(16, -(y / (rect.height / 2)) * 18));
        bouquetWrapper.style.transform = `rotateX(${rotX.toFixed(1)}deg) rotateY(${rotY.toFixed(1)}deg) translateZ(20px)`;
      }
    }, { passive: true });

    bouquetStage.addEventListener('touchend', () => {
      bouquetWrapper.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0px)';
    });
  }

  // Helper: Create Sprouting Volumetric Bloom
  function createSproutingBloom(emoji, name) {
    const bloom = document.createElement('div');
    bloom.className = 'bloom-stem';
    bloom.setAttribute('data-emoji', emoji);
    bloom.innerHTML = `
      <div class="stem-line"></div>
      <span class="bloom-petal">${emoji}</span>
      <span class="dewdrop"></span>
    `;

    // Compute natural dome distribution
    const angle = Math.random() * Math.PI;
    const radius = 30 + Math.random() * 85;
    const left = 140 + Math.cos(angle) * radius - 25;
    const top = 100 - Math.sin(angle) * (radius * 0.75) - 20;
    const rot = Math.floor(Math.random() * 40) - 20;
    const z = Math.floor(Math.random() * 20);

    bloom.style.left = `${Math.max(15, Math.min(235, left))}px`;
    bloom.style.top = `${Math.max(0, Math.min(130, top))}px`;
    bloom.style.setProperty('--rot', `${rot}deg`);
    bloom.style.transform = `rotate(${rot}deg) translateZ(${z}px)`;

    // Click bloom to pluck
    bloom.addEventListener('click', (e) => {
      e.stopPropagation();
      audioSynth.playPopSound();
      bloom.style.transform = 'scale(1.25) translateY(-25px)';
      bloom.style.opacity = '0';
      setTimeout(() => bloom.remove(), 250);
      showToast(`Plucked bloom from arrangement 🌸`);
    });

    return bloom;
  }

  // Add Flowers on Chip Click (Sprout Animation)
  document.querySelectorAll('.flower-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const emoji = chip.getAttribute('data-emoji');
      const name = chip.getAttribute('data-name');
      if (!bouquetBloomsArena) return;

      const bloom = createSproutingBloom(emoji, name);
      bouquetBloomsArena.appendChild(bloom);

      audioSynth.playPopSound();
      burstConfetti(window.innerWidth * 0.6, window.innerHeight * 0.6, 18);
      showToast(`Sprouted a ${name} into your 3D bouquet! 💎✨`);
    });
  });

  // Attach Pluck Handlers to Initial Starter Blooms
  if (bouquetBloomsArena) {
    bouquetBloomsArena.querySelectorAll('.bloom-stem').forEach(bloom => {
      bloom.addEventListener('click', (e) => {
        e.stopPropagation();
        audioSynth.playPopSound();
        bloom.style.transform = 'scale(1.25) translateY(-25px)';
        bloom.style.opacity = '0';
        setTimeout(() => bloom.remove(), 250);
        showToast(`Plucked bloom from arrangement 🌸`);
      });
    });
  }

  // Ribbon Color Swatches
  document.querySelectorAll('.ribbon-swatch').forEach(swatch => {
    swatch.addEventListener('click', () => {
      document.querySelectorAll('.ribbon-swatch').forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');

      const bg = swatch.style.background;
      const ribbonType = swatch.getAttribute('data-ribbon');

      const borderColors = {
        'rose-gold': '#fda4af',
        'ruby': '#f43f5e',
        'gold': '#fde047',
        'emerald': '#10b981',
        'sapphire': '#38bdf8'
      };
      const borderColor = borderColors[ribbonType] || '#fda4af';

      // Update Live Studio Ribbon
      if (satinRibbonBow) {
        const center = satinRibbonBow.querySelector('.ribbon-center');
        const left = satinRibbonBow.querySelector('.ribbon-loop-left');
        const right = satinRibbonBow.querySelector('.ribbon-loop-right');
        const tails = satinRibbonBow.querySelectorAll('.ribbon-tail');
        if (center) center.style.background = bg;
        if (left) left.style.borderColor = borderColor;
        if (right) right.style.borderColor = borderColor;
        tails.forEach(t => { t.style.background = bg; });
      }

      // Update Gifting Hero Ribbon
      if (heroRibbonBow) {
        const hKnot = heroRibbonBow.querySelector('.h-knot');
        const hLeft = heroRibbonBow.querySelector('.h-loop-l');
        const hRight = heroRibbonBow.querySelector('.h-loop-r');
        const hTails = heroRibbonBow.querySelectorAll('.h-tail-l, .h-tail-r');
        if (hKnot) hKnot.style.background = bg;
        if (hLeft) hLeft.style.borderColor = borderColor;
        if (hRight) hRight.style.borderColor = borderColor;
        hTails.forEach(t => { t.style.background = bg; });
      }

      audioSynth.playPopSound();
      showToast(`Silk ribbon updated to ${swatch.title}! 🎀`);
    });
  });

  // Falling Petals Shower Engine
  function spawnPetalShower(count = 55) {
    const petals = ['🌸', '🌹', '🌺', '🌷', '✨', '💎', '💖', '🤗', '🫖'];
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const p = document.createElement('div');
        p.className = 'falling-petal';
        p.textContent = petals[Math.floor(Math.random() * petals.length)];
        p.style.left = `${Math.random() * 95}vw`;
        p.style.animationDuration = `${3 + Math.random() * 2.5}s`;
        p.style.fontSize = `${22 + Math.random() * 18}px`;
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 5500);
      }, i * 60);
    }
  }

  // --------------------------------------------------------------------------
  // 3D BOUQUET GIFTING CEREMONY VIDEO CONTROLLER
  // --------------------------------------------------------------------------
  const heroBouquet3D = document.getElementById('heroBouquet3D');
  const giftingProgressBar = document.getElementById('giftingProgressBar');
  const giftingProgressFill = document.getElementById('giftingProgressFill');
  const giftingTimeReadout = document.getElementById('giftingTimeReadout');
  const playGiftingVideoBtn = document.getElementById('playGiftingVideoBtn');
  const playGiftingIcon = document.getElementById('playGiftingIcon');
  const replayGiftingVideoBtn = document.getElementById('replayGiftingVideoBtn');
  const giftingStatusCaption = document.getElementById('giftingStatusCaption');
  const heroTagDedication = document.getElementById('heroTagDedication');

  let giftingDuration = 10;
  let giftingCurrentTime = 0;
  let giftingIsPlaying = false;
  let giftingRafId = null;
  let lastGiftingTimestamp = 0;

  function updateGiftingScene(time) {
    giftingCurrentTime = Math.max(0, Math.min(giftingDuration, time));
    const pct = (giftingCurrentTime / giftingDuration) * 100;
    if (giftingProgressFill) giftingProgressFill.style.width = `${pct}%`;
    if (giftingTimeReadout) {
      const s = Math.floor(giftingCurrentTime);
      giftingTimeReadout.textContent = `0:0${s} / 0:10`.replace('0:010', '0:10');
    }

    if (giftingCurrentTime < 3.0) {
      // Scene 1: Presentation & Silk Tie
      if (heroBouquet3D) heroBouquet3D.className = 'hero-bouquet-3d';
      if (giftingStatusCaption) giftingStatusCaption.textContent = `🎬 Scene 1: Dilip carefully handcrafts and ties the eternal silk ribbon for My Love ${state.recipientName}... 🎀`;
    } else if (giftingCurrentTime < 6.0) {
      // Scene 2: 3D Offering Forward
      if (heroBouquet3D) heroBouquet3D.className = 'hero-bouquet-3d gift-offering';
      if (giftingStatusCaption) giftingStatusCaption.textContent = `💎 Scene 2: Dilip extends his arms forward, gifting the forever bouquet to his Love in 3D perspective... ✨`;
    } else if (giftingCurrentTime < 8.5) {
      // Scene 3: My Love Nishika Embraces Bouquet with Falling Petals
      if (heroBouquet3D) heroBouquet3D.className = 'hero-bouquet-3d gift-received';
      if (giftingStatusCaption) giftingStatusCaption.textContent = `👑 Scene 3: My Love ${state.recipientName} joyfully receives her blooms under a shower of falling petals! 🌸`;
    } else {
      // Scene 4: Royal Proclamation Dedicated
      if (heroBouquet3D) heroBouquet3D.className = 'hero-bouquet-3d gift-received';
      if (giftingStatusCaption) giftingStatusCaption.textContent = `💖 Scene 4: Eternal Love Proclamation Registered! 'To my My Love ${state.recipientName}, forever in bloom!' 📜👑`;
    }
  }

  function giftingFrameLoop(timestamp) {
    if (!giftingIsPlaying) return;
    if (!lastGiftingTimestamp) lastGiftingTimestamp = timestamp;
    const delta = (timestamp - lastGiftingTimestamp) / 1000;
    lastGiftingTimestamp = timestamp;

    const prev = giftingCurrentTime;
    giftingCurrentTime += delta;
    updateGiftingScene(giftingCurrentTime);

    if (prev < 3.0 && giftingCurrentTime >= 3.0) {
      audioSynth.playMagicChime();
    }
    if (prev < 6.0 && giftingCurrentTime >= 6.0) {
      audioSynth.playCelebrationFanfare();
      spawnPetalShower(50);
      burstConfetti(window.innerWidth / 2, window.innerHeight * 0.4, 75);
    }

    if (giftingCurrentTime >= giftingDuration) {
      pauseGiftingVideo();
    } else {
      giftingRafId = requestAnimationFrame(giftingFrameLoop);
    }
  }

  function playGiftingVideo() {
    giftingIsPlaying = true;
    lastGiftingTimestamp = 0;
    if (playGiftingIcon) playGiftingIcon.className = 'fa-solid fa-pause';
    if (giftingCurrentTime >= giftingDuration) giftingCurrentTime = 0;
    audioSynth.playPopSound();
    giftingRafId = requestAnimationFrame(giftingFrameLoop);
  }

  function pauseGiftingVideo() {
    giftingIsPlaying = false;
    lastGiftingTimestamp = 0;
    if (giftingRafId) cancelAnimationFrame(giftingRafId);
    if (playGiftingIcon) playGiftingIcon.className = 'fa-solid fa-play';
  }

  // Fullscreen 3D Bouquet Gifting Ceremony Activation
  function openGiftingCeremony() {
    if (!bouquetGiftingOverlay) return;

    if (giftingSenderName) {
      giftingSenderName.textContent = `Forever ${state.senderName} 💖`;
    }
    if (heroTagDedication) {
      heroTagDedication.textContent = `To My Love ${state.recipientName} 👑 Forever In Bloom`;
    }

    // Clone live blooms into hero dome
    if (heroBloomsDome && bouquetBloomsArena) {
      heroBloomsDome.innerHTML = '';
      bouquetBloomsArena.querySelectorAll('.bloom-stem').forEach(b => {
        const clone = b.cloneNode(true);
        heroBloomsDome.appendChild(clone);
      });
    }

    bouquetGiftingOverlay.classList.add('active');
    bouquetGiftingOverlay.setAttribute('aria-hidden', 'false');

    // Start video playback from 0
    giftingCurrentTime = 0;
    updateGiftingScene(0);
    playGiftingVideo();

    // Petal shower
    spawnPetalShower(70);
    burstConfetti(window.innerWidth / 2, window.innerHeight * 0.35, 90);
    showToast(`Royal Forever Bouquet 3D Video Ceremony playing for My Love ${state.recipientName}! 👑💎💖`);
  }

  function closeGiftingCeremony() {
    if (!bouquetGiftingOverlay) return;
    pauseGiftingVideo();
    bouquetGiftingOverlay.classList.remove('active');
    bouquetGiftingOverlay.setAttribute('aria-hidden', 'true');
  }

  if (giftBouquetBtn) giftBouquetBtn.addEventListener('click', openGiftingCeremony);
  if (closeGiftingModalBtn) closeGiftingModalBtn.addEventListener('click', closeGiftingCeremony);

  if (playGiftingVideoBtn) {
    playGiftingVideoBtn.addEventListener('click', () => {
      if (giftingIsPlaying) pauseGiftingVideo();
      else playGiftingVideo();
    });
  }

  if (replayGiftingVideoBtn) {
    replayGiftingVideoBtn.addEventListener('click', () => {
      pauseGiftingVideo();
      giftingCurrentTime = 0;
      updateGiftingScene(0);
      playGiftingVideo();
    });
  }

  if (giftingProgressBar) {
    giftingProgressBar.addEventListener('click', (e) => {
      const rect = giftingProgressBar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const pct = Math.max(0, Math.min(1, clickX / rect.width));
      updateGiftingScene(pct * giftingDuration);
    });
  }

  if (acceptBouquetBtn) {
    acceptBouquetBtn.addEventListener('click', () => {
      burstConfetti(window.innerWidth / 2, window.innerHeight * 0.5, 120);
      audioSynth.playCelebrationFanfare();
      showToast(`Bouquet accepted with infinite love! May our love bloom forever 💖👑`);
      setTimeout(closeGiftingCeremony, 1500);
    });
  }

  if (vaseBouquetBtn) {
    vaseBouquetBtn.addEventListener('click', () => {
      audioSynth.playPopSound();
      showToast(`Your forever blooms are preserved eternally in the Royal Palace Vase! 🪴🌸`);
      setTimeout(closeGiftingCeremony, 1200);
    });
  }

  // Reset / Rearrange Bouquet
  if (clearBouquetBtn) {
    clearBouquetBtn.addEventListener('click', () => {
      if (bouquetBloomsArena) {
        bouquetBloomsArena.innerHTML = `
          <div class="bloom-stem stem-1" data-emoji="🌹"><div class="stem-line"></div><span class="bloom-petal">🌹</span><span class="dewdrop"></span></div>
          <div class="bloom-stem stem-2" data-emoji="🌸"><div class="stem-line"></div><span class="bloom-petal">🌸</span><span class="dewdrop"></span></div>
          <div class="bloom-stem stem-3" data-emoji="🌻"><div class="stem-line"></div><span class="bloom-petal">🌻</span></div>
          <div class="bloom-stem stem-4" data-emoji="🌷"><div class="stem-line"></div><span class="bloom-petal">🌷</span></div>
          <div class="bloom-stem stem-5" data-emoji="✨"><div class="stem-line"></div><span class="bloom-petal">✨</span></div>
        `;

        bouquetBloomsArena.querySelectorAll('.bloom-stem').forEach(bloom => {
          bloom.addEventListener('click', (e) => {
            e.stopPropagation();
            audioSynth.playPopSound();
            bloom.style.transform = 'scale(1.25) translateY(-25px)';
            bloom.style.opacity = '0';
            setTimeout(() => bloom.remove(), 250);
            showToast(`Plucked bloom from arrangement 🌸`);
          });
        });
      }
      audioSynth.playPopSound();
      showToast('Bouquet arrangement reset to royal baseline! 🌸');
    });
  }

  // --------------------------------------------------------------------------
  // 15. SECTION 8: ROMANTIC COUPLE TRIVIA QUIZ
  // --------------------------------------------------------------------------
  const quizQuestions = [
    {
      q: 'Who said "I Love You" first?',
      options: [
        'Dilip with romantic butterflies 🥰',
        'Both of us at the exact same heartbeat 💓',
        'Her with the sweetest radiant smile ✨',
        'The universe wrote it in the stars 🌟'
      ],
      correct: 0,
      feedback: 'Pure romance! From that exact moment, my heart was yours forever.'
    },
    {
      q: "What is Dilip's absolute favorite thing about you?",
      options: [
        'Your radiant smile that lights up the world ✨',
        'Your kind, caring golden heart 💛',
        'Your adorable laugh and sweet habits 🥰',
        'All of the above multiplied by infinity! 👑💖'
      ],
      correct: 3,
      feedback: 'Correct! Every single thing about you is perfection to me.'
    },
    {
      q: "What is our official definition of a perfect date?",
      options: [
        'Cozy movie marathon & warm cuddles 🍿🧸',
        'Late-night ice cream & deep talks 🍦🌙',
        'Exploring new dreamy places together ✈️🌸',
        'Anywhere in the universe as long as you are with me 🏡💖'
      ],
      correct: 3,
      feedback: 'Spot on! Home is simply wherever you are.'
    },
    {
      q: "How much does Dilip love you?",
      options: [
        'To the moon and all the galaxies back 🌌',
        'More than all the words in every love poem 📜',
        'Growing deeper with every single sunrise 🌅',
        'Beyond infinity and for all eternity 🚀💖'
      ],
      correct: 3,
      feedback: 'Forever and always, my Love!'
    }
  ];

  let currentQuizStep = 0;
  const quizProgressFill = document.getElementById('quizProgressFill');
  const quizStepIndicator = document.getElementById('quizStepIndicator');
  const quizQuestionTitle = document.getElementById('quizQuestionTitle');
  const quizOptionsGrid = document.getElementById('quizOptionsGrid');
  const quizQuestionBox = document.getElementById('quizQuestionBox');
  const quizResultBanner = document.getElementById('quizResultBanner');
  const restartQuizBtn = document.getElementById('restartQuizBtn');

  function renderQuizStep() {
    if (!quizQuestionTitle || !quizOptionsGrid) return;
    const currentQ = quizQuestions[currentQuizStep];

    if (quizProgressFill) quizProgressFill.style.width = `${((currentQuizStep + 1) / quizQuestions.length) * 100}%`;
    if (quizStepIndicator) quizStepIndicator.textContent = `Question ${currentQuizStep + 1} of ${quizQuestions.length}`;
    quizQuestionTitle.textContent = currentQ.q.replace(/Dilip/g, state.senderName);

    quizOptionsGrid.innerHTML = '';
    currentQ.options.forEach((optText, idx) => {
      const optBtn = document.createElement('button');
      optBtn.className = 'quiz-option-btn';
      optBtn.textContent = optText.replace(/Dilip/g, state.senderName);
      optBtn.addEventListener('click', () => {
        optBtn.classList.add('correct');
        audioSynth.playMagicChime();
        burstConfetti(window.innerWidth / 2, window.innerHeight * 0.5, 35);
        showToast(currentQ.feedback);

        setTimeout(() => {
          if (currentQuizStep < quizQuestions.length - 1) {
            currentQuizStep++;
            renderQuizStep();
          } else {
            if (quizQuestionBox) quizQuestionBox.classList.add('hidden');
            if (quizResultBanner) quizResultBanner.classList.remove('hidden');
            audioSynth.playCelebrationFanfare();
            burstConfetti(window.innerWidth / 2, window.innerHeight * 0.4, 100);
            spawnPetalShower();
          }
        }, 1200);
      });
      quizOptionsGrid.appendChild(optBtn);
    });
  }

  renderQuizStep();

  if (restartQuizBtn) {
    restartQuizBtn.addEventListener('click', () => {
      currentQuizStep = 0;
      if (quizQuestionBox) quizQuestionBox.classList.remove('hidden');
      if (quizResultBanner) quizResultBanner.classList.add('hidden');
      renderQuizStep();
      audioSynth.playPopSound();
    });
  }

  // --------------------------------------------------------------------------
  // 16. SECTION 9: BALLOON POPPING MINI-GAME
  // --------------------------------------------------------------------------
  const balloonArena = document.getElementById('balloonArena');
  const arenaMsg = document.getElementById('arenaMsg');
  const poppedScore = document.getElementById('poppedScore');
  const spawnMoreBalloonsBtn = document.getElementById('spawnMoreBalloonsBtn');
  const clearBalloonsBtn = document.getElementById('clearBalloonsBtn');

  const balloonColors = ['#f43f5e', '#fb7185', '#c084fc', '#38bdf8', '#10b981', '#fbbf24'];
  const sweetWishes = [
    'My Love! 💖', 'Pure Love! 💖', 'Stay Radiant! ✨', 'Best Year Ever! 🎉',
    'Limitless Joy! ⭐', 'Forever Yours! 💕', 'So Beautiful! 🌸', 'Sweetest Smiles! 😊'
  ];

  function spawnSingleBalloon() {
    if (!balloonArena) return;
    const balloon = document.createElement('div');
    balloon.className = 'arena-balloon';

    const arenaRect = balloonArena.getBoundingClientRect();
    const xPos = Math.random() * (arenaRect.width - 70) + 10;
    const color = balloonColors[Math.floor(Math.random() * balloonColors.length)];
    const duration = Math.random() * 4 + 5;
    const delay = Math.random() * 2;

    balloon.style.left = `${xPos}px`;
    balloon.style.background = `radial-gradient(circle at 35% 35%, #fff 5%, ${color} 70%)`;
    balloon.style.animationDuration = `${duration}s`;
    balloon.style.animationDelay = `${delay}s`;

    balloon.addEventListener('click', (e) => {
      popBalloon(balloon, e.clientX, e.clientY);
    });

    balloonArena.appendChild(balloon);

    setTimeout(() => {
      if (balloon.parentNode === balloonArena) balloon.remove();
    }, (duration + delay) * 1000);
  }

  function spawnBalloonsInArena(count = 5) {
    if (arenaMsg) arenaMsg.style.display = 'none';
    for (let i = 0; i < count; i++) {
      setTimeout(() => spawnSingleBalloon(), i * 350);
    }
  }

  function popBalloon(balloonEl, clientX, clientY) {
    const rect = balloonEl.getBoundingClientRect();
    const arenaRect = balloonArena.getBoundingClientRect();
    const localX = rect.left - arenaRect.left + rect.width / 2;
    const localY = rect.top - arenaRect.top + rect.height / 2;

    audioSynth.playPopSound();

    // Particle burst
    for (let i = 0; i < 12; i++) {
      const p = document.createElement('div');
      p.className = 'pop-particle';
      p.style.left = `${localX}px`;
      p.style.top = `${localY}px`;
      p.style.backgroundColor = balloonEl.style.backgroundColor || '#fbbf24';
      const angle = (Math.PI * 2 / 12) * i;
      const dist = Math.random() * 40 + 20;
      p.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
      p.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
      balloonArena.appendChild(p);
      setTimeout(() => p.remove(), 600);
    }

    // Compliment Bubble
    const wishMsg = sweetWishes[Math.floor(Math.random() * sweetWishes.length)];
    const bubble = document.createElement('div');
    bubble.className = 'pop-wish-bubble';
    bubble.textContent = wishMsg;
    bubble.style.left = `${localX}px`;
    bubble.style.top = `${localY}px`;
    balloonArena.appendChild(bubble);
    setTimeout(() => bubble.remove(), 1600);

    balloonEl.remove();

    state.poppedCount++;
    if (poppedScore) poppedScore.textContent = state.poppedCount;
    saveState();

    if (state.poppedCount % 5 === 0) {
      burstConfetti(clientX, clientY, 40);
    }
  }

  if (spawnMoreBalloonsBtn) spawnMoreBalloonsBtn.addEventListener('click', () => spawnBalloonsInArena(5));
  if (clearBalloonsBtn) clearBalloonsBtn.addEventListener('click', () => {
    document.querySelectorAll('.arena-balloon').forEach(b => b.remove());
    if (arenaMsg) arenaMsg.style.display = 'block';
  });

  if (balloonArena) {
    balloonArena.addEventListener('click', (e) => {
      if (e.target === balloonArena || e.target === arenaMsg) spawnSingleBalloon();
    });
  }

  // --------------------------------------------------------------------------
  // 17. SECTION 10: 3D POLAROID TILT, PHOTO UPLOADER & WISH PINBOARD
  // --------------------------------------------------------------------------
  const tiltCards = document.querySelectorAll('.tilt-element');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      if (window.innerWidth <= 1024 || window.matchMedia('(hover: none)').matches) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04, 1.04, 1.04)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
    card.addEventListener('touchend', () => {
      card.style.transform = '';
    });
  });

  // --- 📸 POLAROID PHOTO UPLOADER & FILTER SUITE ---
  const photoUploadInput = document.getElementById('photoUploadInput');
  const uploadPhotoBtn = document.getElementById('uploadPhotoBtn');
  const polaroidGrid = document.getElementById('polaroidGrid');
  let currentActiveFilter = 'none';

  // Filter selection
  const photoFilterChips = document.querySelectorAll('.photo-filter-chips .filter-chip');
  photoFilterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      photoFilterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const filterType = chip.getAttribute('data-filter') || 'none';
      currentActiveFilter = filterType;

      if (polaroidGrid) {
        polaroidGrid.classList.remove('filter-rose', 'filter-golden', 'filter-vintage', 'filter-bw');
        if (filterType && filterType !== 'none') {
          polaroidGrid.classList.add(filterType);
        }
      }
      if (audioSynth && audioSynth.playPopSound) audioSynth.playPopSound();
      if (typeof showToast === 'function') {
        showToast(`Filter applied: ${chip.textContent.trim()} 📸`);
      }
    });
  });


  function compressImage(file, callback) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 800;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
        callback(dataUrl);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  if (uploadPhotoBtn && photoUploadInput) {
    uploadPhotoBtn.addEventListener('click', () => {
      photoUploadInput.click();
    });

    photoUploadInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      compressImage(file, (dataUrl) => {
        const photoItem = {
          dataUrl,
          filterClass: currentActiveFilter === 'none' ? '' : currentActiveFilter,
          caption: `Our unforgettable memory with ${state.recipientName} 💖`,
          tag: 'Real Moment'
        };

        state.uploadedPhotos.push(photoItem);
        saveState();
        renderUploadedPolaroid(photoItem, true);

        // Sync to Google Drive & Google Sheet
        sendToGoogleSheet({
          type: 'photo',
          name: state.senderName || 'Dilip',
          author: state.senderName || 'Dilip',
          caption: photoItem.caption,
          tag: photoItem.tag,
          base64: photoItem.dataUrl,
          dataUrl: photoItem.dataUrl
        }, {
          chipElement: document.getElementById('photoSyncChip'),
          textElement: document.getElementById('photoSyncText'),
          successText: 'Photo Saved to Google Drive! 📸✨',
          defaultText: 'Google Drive Connected 📸'
        });

        audioSynth.playMagicChime();
        burstConfetti(window.innerWidth / 2, window.innerHeight * 0.7, 50);
        showToast('Real couple photo optimized & added to the Polaroid Gallery! 📸✨');
      });
    });
  }

  function renderUploadedPolaroid(photoItem, prepend = false) {
    if (!polaroidGrid) return;
    const card = document.createElement('div');
    card.className = `polaroid-card dynamic-uploaded tilt-element ${photoItem.filterClass || ''}`;
    card.innerHTML = `
      <div class="polaroid-inner">
        <div class="polaroid-front">
          <div class="polaroid-photo">
            <img src="${photoItem.dataUrl}" alt="Our Memory" />
            <div class="photo-overlay-tag">${escapeHtml(photoItem.tag || 'Special Moment')}</div>
            <div class="sparkle-badge">💖</div>
          </div>
          <div class="polaroid-caption">
            <p class="caption-text">"${escapeHtml(photoItem.caption || 'Cherished memory')}"</p>
            <span class="caption-date">🌸 Forever Loved</span>
          </div>
        </div>
      </div>
    `;

    card.addEventListener('mousemove', (e) => {
      if (window.innerWidth <= 1024 || window.matchMedia('(hover: none)').matches) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04, 1.04, 1.04)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
    card.addEventListener('touchend', () => {
      card.style.transform = '';
    });

    if (prepend) {
      polaroidGrid.prepend(card);
    } else {
      polaroidGrid.appendChild(card);
    }
  }

  function renderAllPolaroidGallery() {
    const grid = polaroidGrid || document.getElementById('polaroidGrid') || document.getElementById('polaroidsGrid') || document.querySelector('.polaroid-grid');
    if (!grid) return;
    const dynamicCards = grid.querySelectorAll('.polaroid-card.dynamic-uploaded');
    dynamicCards.forEach(c => c.remove());
    if (state.uploadedPhotos && state.uploadedPhotos.length > 0) {
      state.uploadedPhotos.forEach(p => renderUploadedPolaroid(p));
    }
  }
  window.renderAllPolaroidGallery = renderAllPolaroidGallery;

  // Load existing uploaded photos from storage
  if (state.uploadedPhotos && state.uploadedPhotos.length > 0) {
    state.uploadedPhotos.forEach(p => renderUploadedPolaroid(p));
  }

  // --------------------------------------------------------------------------
  // 17. SECTION 10: STICKY WISH WALL ENGINE (With Photos, Videos & Cloud Sync)
  // --------------------------------------------------------------------------
  const wishForm = document.getElementById('wishForm');
  const wishAuthorInput = document.getElementById('wishAuthorInput');
  const wishTextInput = document.getElementById('wishTextInput');
  const wishesPinboard = document.getElementById('wishesPinboard');
  const syncWishesBtn = document.getElementById('syncWishesBtn');

  const mainCountAll = document.getElementById('mainCountAll');
  const mainCountPhotos = document.getElementById('mainCountPhotos');
  const mainCountVideos = document.getElementById('mainCountVideos');
  const mainCountRoyal = document.getElementById('mainCountRoyal');

  let mainSelectedMediaType = 'none';
  let mainSelectedMediaData = '';
  let mainSelectedTheme = 'pink';
  let mainActiveFilter = 'all';

  // Default multimedia royal dedications with photos & videos
  const DEFAULT_MAIN_WISHES = [
    {
      id: 'def_main_1',
      name: 'Dilip (With Infinite Devotion 👑)',
      author: 'Dilip (With Infinite Devotion 👑)',
      message: 'Happy Birthday to the most radiant, beautiful, and enchanting My Love Nishika! Every moment with you is poetry written in starlight. My whole heart is consecrated to you forever! 💕✨',
      text: 'Happy Birthday to the most radiant, beautiful, and enchanting My Love Nishika! Every moment with you is poetry written in starlight. My whole heart is consecrated to you forever! 💕✨',
      color: 'gold',
      styleClass: 'sticky-gold',
      mediaType: 'photo',
      mediaUrl: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=900&auto=format&fit=crop&q=80',
      likes: 58,
      isRoyal: true,
      localTime: 'Consecrated for Eternity'
    },
    {
      id: 'def_main_2',
      name: 'Celestial Rhapsody 🎶',
      author: 'Celestial Rhapsody 🎶',
      message: 'A heavenly romantic birthday melody dedicated to My Love Nishika! May your 26th year be filled with divine melodies and infinite royal joy! 🎂✨',
      text: 'A heavenly romantic birthday melody dedicated to My Love Nishika! May your 26th year be filled with divine melodies and infinite royal joy! 🎂✨',
      color: 'pink',
      styleClass: 'sticky-pink',
      mediaType: 'video',
      mediaUrl: 'https://www.youtube.com/watch?v=2Vv-BfVoq4g',
      likes: 44,
      isRoyal: false,
      localTime: 'September 2026'
    },
    {
      id: 'def_main_3',
      name: 'The Royal Court & Best Friends 🌸',
      author: 'The Royal Court & Best Friends 🌸',
      message: 'Wishing our magnificent My Love Nishika a spectacular birthday filled with grand surprises, unending laughter, and pure happiness! 👑💖',
      text: 'Wishing our magnificent My Love Nishika a spectacular birthday filled with grand surprises, unending laughter, and pure happiness! 👑💖',
      color: 'purple',
      styleClass: 'sticky-purple',
      mediaType: 'photo',
      mediaUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=900&auto=format&fit=crop&q=80',
      likes: 31,
      isRoyal: false,
      localTime: 'Special Blessing'
    },
    {
      id: 'def_main_4',
      name: 'Starlight Soulmates 💎',
      author: 'Starlight Soulmates 💎',
      message: 'Celebrating your grace, kindness, and royal brilliance. May all your celestial dreams turn into reality this year! 🌟✨',
      text: 'Celebrating your grace, kindness, and royal brilliance. May all your celestial dreams turn into reality this year! 🌟✨',
      color: 'sapphire',
      styleClass: 'sticky-cyan',
      mediaType: 'photo',
      mediaUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=900&auto=format&fit=crop&q=80',
      likes: 36,
      isRoyal: false,
      localTime: 'Anniversary Blessing'
    },
    {
      id: 'def_main_5',
      name: 'Sunset Blessings 🍑',
      author: 'Sunset Blessings 🍑',
      message: 'May every sunrise bring you radiant smiles and every sunset bring you peaceful serenity. Happy Birthday My Love Nishika! 🎂🥂',
      text: 'May every sunrise bring you radiant smiles and every sunset bring you peaceful serenity. Happy Birthday My Love Nishika! 🎂🥂',
      color: 'peach',
      styleClass: 'sticky-peach',
      mediaType: 'photo',
      mediaUrl: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=900&auto=format&fit=crop&q=80',
      likes: 27,
      isRoyal: false,
      localTime: 'Grand Celebration'
    }
  ];

  // Helper: Normalize Google Drive and web image URLs
  function normalizeGasImageUrl(url) {
    if (!url) return '';
    const trimmed = url.trim();
    if (trimmed.includes('drive.google.com') || trimmed.includes('docs.google.com') || trimmed.includes('googleusercontent.com')) {
      let id = '';
      const m1 = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      const m2 = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      const m3 = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
      const m4 = trimmed.match(/\/thumbnail\?id=([a-zA-Z0-9_-]+)/);
      if (m1 && m1[1]) id = m1[1];
      else if (m2 && m2[1]) id = m2[1];
      else if (m3 && m3[1]) id = m3[1];
      else if (m4 && m4[1]) id = m4[1];

      if (id) {
        return `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
      }
    }
    return trimmed;
  }

  // Helper: Robust YouTube Video ID Extractor
  function extractYouTubeId(url) {
    if (!url) return null;
    let str = url.toString().trim();
    const iframeMatch = str.match(/src=["']([^"']+)["']/i);
    if (iframeMatch && iframeMatch[1]) str = iframeMatch[1].trim();
    str = str.replace(/^[<"']+|[>"']+$/g, '');

    let match = str.match(/(?:youtube\.com|youtu\.be)\/shorts\/([a-zA-Z0-9_-]{11})/i);
    if (match && match[1]) return match[1];

    match = str.match(/(?:youtube\.com|youtu\.be)\/live\/([a-zA-Z0-9_-]{11})/i);
    if (match && match[1]) return match[1];

    match = str.match(/(?:youtube\.com\/(?:embed|v)|youtu\.be|youtube-nocookie\.com\/embed)\/([a-zA-Z0-9_-]{11})/i);
    if (match && match[1]) return match[1];

    match = str.match(/[?&]v=([a-zA-Z0-9_-]{11})/i);
    if (match && match[1]) return match[1];

    match = str.match(/(?:https?:\/\/)?(?:www\.|m\.|music\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?.*v=|embed\/|v\/|shorts\/|live\/)?([a-zA-Z0-9_-]{11})/i);
    if (match && match[1]) return match[1];

    return null;
  }

  // Helper: Parse video URLs into responsive iframes or video players
  function parseGasVideoEmbed(url, inLightbox = false) {
    if (!url) return '';
    const clean = url.toString().trim();

    // 1. YouTube standard watch, youtu.be, shorts, live, embed, mobile, music
    const ytId = extractYouTubeId(clean);
    if (ytId) {
      const embedUrl = `https://www.youtube.com/embed/${ytId}?autoplay=${inLightbox ? 1 : 0}&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`;
      const watchUrl = `https://www.youtube.com/watch?v=${ytId}`;
      return `
        <div class="video-embed-container" style="position:relative; width:100%; height:100%; min-height:160px; border-radius:10px; overflow:hidden; background:#000;">
          <iframe src="${embedUrl}" 
                  title="YouTube Video Player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  allowfullscreen 
                  loading="lazy" 
                  referrerpolicy="strict-origin-when-cross-origin"
                  style="width:100%; height:100%; min-height:160px; border:0; border-radius:10px; display:block;">
          </iframe>
          <a href="${watchUrl}" target="_blank" rel="noopener noreferrer" class="yt-direct-pill" title="Watch directly on YouTube" style="position:absolute; bottom:6px; right:6px; z-index:4; display:inline-flex; align-items:center; gap:4px; font-size:0.68rem; padding:3px 8px; border-radius:6px; background:rgba(0,0,0,0.78); color:#fff; text-decoration:none; border:1px solid rgba(255,255,255,0.25); backdrop-filter:blur(4px); transition:all 0.2s ease;">
            <i class="fa-brands fa-youtube" style="color:#ff0000;"></i> YouTube ↗
          </a>
        </div>
      `;
    }

    // 2. Vimeo
    if (clean.includes('vimeo.com/')) {
      const vMatch = clean.match(/vimeo\.com\/(?:video\/)?([0-9]+)/i);
      const vId = vMatch ? vMatch[1] : clean.split('vimeo.com/')[1].split('?')[0].split('/')[0].split('&')[0];
      if (vId) {
        return `<iframe src="https://player.vimeo.com/video/${vId}?autoplay=${inLightbox ? 1 : 0}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen loading="lazy" style="width:100%; height:100%; min-height:160px; border:0; border-radius:10px;"></iframe>`;
      }
    }

    // 3. Google Drive Video Link (all variants: /file/d/, open?id=, uc?id=, thumbnail?id=, googleusercontent.com/d/, docs.google.com)
    if (clean.includes('drive.google.com') || clean.includes('docs.google.com') || clean.includes('googleusercontent.com')) {
      let gId = '';
      const m1 = clean.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      const m2 = clean.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      const m3 = clean.match(/\/d\/([a-zA-Z0-9_-]+)/);
      const m4 = clean.match(/\/thumbnail\?id=([a-zA-Z0-9_-]+)/);
      if (m1 && m1[1]) gId = m1[1];
      else if (m2 && m2[1]) gId = m2[1];
      else if (m3 && m3[1]) gId = m3[1];
      else if (m4 && m4[1]) gId = m4[1];

      if (gId) {
        return `<iframe src="https://drive.google.com/file/d/${gId}/preview" allow="autoplay; encrypted-media" allowfullscreen loading="lazy" style="width:100%; height:100%; min-height:160px; border:0; border-radius:10px;"></iframe>`;
      }
    }

    // 4. Direct MP4 / WebM / Blob Video / Base64 Data URL
    return `<video src="${clean}" controls ${inLightbox ? 'autoplay' : ''} preload="metadata" playsinline style="width:100%; height:100%; min-height:160px; max-height:400px; object-fit:contain; border-radius:10px; background:#000;"></video>`;
  }
  window.parseGasVideoEmbed = parseGasVideoEmbed;

  function getWishAvatarLetter(name) {
    if (!name) return '👑';
    const clean = name.replace(/[^a-zA-Z]/g, '');
    return clean.length > 0 ? clean[0].toUpperCase() : '👑';
  }

  // Media Tab Switching in Main Wish Form
  const mainMediaTabBtns = document.querySelectorAll('.media-tab-btn[data-tab^="mainTab"]');
  mainMediaTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      mainMediaTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const targetTab = btn.getAttribute('data-tab');

      document.querySelectorAll('#wishBoardSection .media-content-pane').forEach(p => p.classList.remove('active'));
      if (targetTab === 'mainTabPhoto') {
        const pane = document.getElementById('mainTabPhoto');
        if (pane) pane.classList.add('active');
        mainSelectedMediaType = 'photo';
      } else if (targetTab === 'mainTabVideo') {
        const pane = document.getElementById('mainTabVideo');
        if (pane) pane.classList.add('active');
        mainSelectedMediaType = 'video';
      } else {
        mainSelectedMediaType = 'none';
        mainSelectedMediaData = '';
      }
    });
  });

  // Photo Attachment Handler
  const mainWishPhotoInput = document.getElementById('mainWishPhotoInput');
  const mainWishPhotoUrl = document.getElementById('mainWishPhotoUrl');
  const mainPhotoPreviewBox = document.getElementById('mainPhotoPreviewBox');
  const mainPhotoPreviewImg = document.getElementById('mainPhotoPreviewImg');
  const mainRemovePhotoBtn = document.getElementById('mainRemovePhotoBtn');

  if (mainWishPhotoInput) {
    mainWishPhotoInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          const dataUrl = await readFileAsBase64(file);
          mainSelectedMediaData = dataUrl;
          mainSelectedMediaType = 'photo';
          if (mainPhotoPreviewImg) mainPhotoPreviewImg.src = dataUrl;
          if (mainPhotoPreviewBox) mainPhotoPreviewBox.style.display = 'inline-block';
          if (mainWishPhotoUrl) mainWishPhotoUrl.value = '';
        } catch(err) {
          console.warn('Photo encoding error:', err);
        }
      }
    });
  }

  if (mainWishPhotoUrl) {
    mainWishPhotoUrl.addEventListener('input', (e) => {
      const val = normalizeGasImageUrl(e.target.value);
      if (val) {
        mainSelectedMediaData = val;
        mainSelectedMediaType = 'photo';
        if (mainPhotoPreviewImg) mainPhotoPreviewImg.src = val;
        if (mainPhotoPreviewBox) mainPhotoPreviewBox.style.display = 'inline-block';
        if (mainWishPhotoInput) mainWishPhotoInput.value = '';
      }
    });
  }

  if (mainRemovePhotoBtn) {
    mainRemovePhotoBtn.addEventListener('click', () => {
      if (mainWishPhotoInput) mainWishPhotoInput.value = '';
      if (mainWishPhotoUrl) mainWishPhotoUrl.value = '';
      if (mainPhotoPreviewBox) mainPhotoPreviewBox.style.display = 'none';
      if (mainPhotoPreviewImg) mainPhotoPreviewImg.src = '';
      mainSelectedMediaData = '';
      mainSelectedMediaType = 'none';
    });
  }

  // Video Attachment Handlers
  const mainWishVideoInput = document.getElementById('mainWishVideoInput');
  const mainWishVideoUrl = document.getElementById('mainWishVideoUrl');
  const mainVideoPreviewBox = document.getElementById('mainVideoPreviewBox');
  const mainVideoPreviewContainer = document.getElementById('mainVideoPreviewContainer');
  const mainRemoveVideoBtn = document.getElementById('mainRemoveVideoBtn');

  function updateMainVideoPreview(src) {
    if (!src) {
      if (mainVideoPreviewBox) mainVideoPreviewBox.style.display = 'none';
      if (mainVideoPreviewContainer) mainVideoPreviewContainer.innerHTML = '';
      mainSelectedMediaData = '';
      return;
    }
    mainSelectedMediaData = src;
    mainSelectedMediaType = 'video';
    if (mainVideoPreviewContainer) {
      mainVideoPreviewContainer.innerHTML = parseGasVideoEmbed(src, false);
    }
    if (mainVideoPreviewBox) mainVideoPreviewBox.style.display = 'inline-block';
  }

  if (mainWishVideoInput) {
    mainWishVideoInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 25 * 1024 * 1024) {
          alert('Video file is larger than 25MB. Please choose a smaller video clip or paste a YouTube / Google Drive link.');
          return;
        }
        const videoUrl = URL.createObjectURL(file);
        updateMainVideoPreview(videoUrl);

        try {
          const base64Data = await readFileAsBase64(file);
          mainSelectedMediaData = base64Data;
          mainSelectedMediaType = 'video';
          if (mainWishVideoUrl) mainWishVideoUrl.value = '';
        } catch(vErr) {
          console.warn('Video encoding error:', vErr);
        }
      }
    });
  }

  if (mainWishVideoUrl) {
    mainWishVideoUrl.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      if (val) {
        updateMainVideoPreview(val);
        if (mainWishVideoInput) mainWishVideoInput.value = '';
      }
    });
  }

  if (mainRemoveVideoBtn) {
    mainRemoveVideoBtn.addEventListener('click', () => {
      if (mainWishVideoInput) mainWishVideoInput.value = '';
      if (mainWishVideoUrl) mainWishVideoUrl.value = '';
      if (mainVideoPreviewBox) mainVideoPreviewBox.style.display = 'none';
      if (mainVideoPreviewContainer) mainVideoPreviewContainer.innerHTML = '';
      mainSelectedMediaData = '';
      mainSelectedMediaType = 'none';
    });
  }

  // Theme Color Swatches Picker
  const mainColorChips = document.querySelectorAll('#mainStickyColorPalette .color-chip');
  mainColorChips.forEach(chip => {
    chip.addEventListener('click', () => {
      mainColorChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      mainSelectedTheme = chip.getAttribute('data-theme') || 'pink';
    });
  });

  // Filter Pills Handler
  const mainFilterPills = document.querySelectorAll('#mainWishFilterBar .filter-pill');
  mainFilterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      mainFilterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      mainActiveFilter = pill.getAttribute('data-filter') || 'all';
      renderPinnedWishes();
    });
  });

  function isPhotoItem(w) {
    if (!w) return false;
    const type = (w.mediaType || '').toLowerCase();
    if (type === 'video') return false;
    if (type === 'photo') return true;
    const url = (w.mediaUrl || w.mediaData || '').toLowerCase();
    if (!url) return false;
    if (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com') || url.includes('/preview') || /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url) || url.startsWith('data:video')) {
      return false;
    }
    return url.startsWith('data:image') ||
           url.includes('googleusercontent.com') ||
           url.includes('drive.google.com') ||
           url.includes('photos.app.goo.gl') ||
           /\.(jpg|jpeg|png|gif|webp|avif|svg)(\?.*)?$/i.test(url);
  }

  function isVideoItem(w) {
    if (!w) return false;
    const type = (w.mediaType || '').toLowerCase();
    if (type === 'video') return true;
    if (type === 'photo') return false;
    const url = (w.mediaUrl || w.mediaData || '').toLowerCase();
    if (!url) return false;
    return url.includes('youtube.com') ||
           url.includes('youtu.be') ||
           url.includes('vimeo.com') ||
           url.includes('/preview') ||
           url.startsWith('data:video') ||
           /\.(mp4|webm|ogg|mov|m4v|avi|mkv)(\?.*)?$/i.test(url);
  }

  // Universal Media URL Normalizer (Keeps Video stream links intact and converts Photos to fast CDN thumbnails)
  function normalizeCloudImageUrl(url, isVideo = false) {
    if (!url) return '';
    url = url.toString().trim();
    if (url.startsWith('blob:')) return '';
    if (url.startsWith('data:image') || url.startsWith('data:video')) return url;

    let driveId = '';
    if (url.includes('drive.google.com') || url.includes('docs.google.com') || url.includes('googleusercontent.com')) {
      const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/) ||
                      url.match(/\/d\/([a-zA-Z0-9_-]+)/) ||
                      url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
                      url.match(/\/thumbnail\?id=([a-zA-Z0-9_-]+)/);
      if (idMatch && idMatch[1]) {
        driveId = idMatch[1];
      }
    }

    if (driveId) {
      if (isVideo || url.includes('/preview') || url.match(/\.(mp4|webm|mov|m4v)/i)) {
        return `https://drive.google.com/file/d/${driveId}/preview`;
      }
      return `https://lh3.googleusercontent.com/d/${driveId}`;
    }
    return url;
  }
  window.normalizeCloudImageUrl = normalizeCloudImageUrl;

  // Render Dynamic Sticky Notes on Wall
  function renderPinnedWishes() {
    if (!wishesPinboard) return;
    wishesPinboard.innerHTML = '';

    // Ensure default wishes exist if state is empty
    if (!state.pinnedWishes || state.pinnedWishes.length === 0) {
      state.pinnedWishes = [...DEFAULT_MAIN_WISHES];
    }

    const allNotes = state.pinnedWishes;

    const filtered = allNotes.filter(w => {
      const isPhoto = isPhotoItem(w);
      const isVideo = isVideoItem(w);
      const isRoyal = w.isRoyal || (w.author && w.author.toLowerCase().includes('dilip')) || (w.name && w.name.toLowerCase().includes('dilip'));

      if (mainActiveFilter === 'photo') return isPhoto;
      if (mainActiveFilter === 'video') return isVideo;
      if (mainActiveFilter === 'royal') return isRoyal;
      return true;
    });

    // Update Counter Badges
    if (mainCountAll) mainCountAll.textContent = allNotes.length;
    if (mainCountPhotos) mainCountPhotos.textContent = allNotes.filter(w => isPhotoItem(w)).length;
    if (mainCountVideos) mainCountVideos.textContent = allNotes.filter(w => isVideoItem(w)).length;
    if (mainCountRoyal) mainCountRoyal.textContent = allNotes.filter(w => w.isRoyal || (w.author && w.author.toLowerCase().includes('dilip')) || (w.name && w.name.toLowerCase().includes('dilip'))).length;

    if (filtered.length === 0) {
      wishesPinboard.innerHTML = `
        <div class="sticky-empty-box">
          <i class="fa-solid fa-sparkles"></i>
          <h3>No notes in this category yet</h3>
          <p>Be the first to consecrate a heartfelt wish, photo, or video dedication for My Love Nishika!</p>
        </div>
      `;
      return;
    }

    const rotationAngles = [-2.0, 1.8, -1.4, 2.2, -1.8, 1.5, -2.2, 1.7];

    filtered.forEach((item, idx) => {
      const rot = item.rot !== undefined ? item.rot : rotationAngles[idx % rotationAngles.length];
      const authorName = item.author || item.name || 'Loving Well-wisher';
      const messageText = item.message || item.text || '';
      const isRoyal = item.isRoyal || authorName.toLowerCase().includes('dilip');
      const themeClass = item.styleClass || `theme-${item.color || 'pink'}`;
      const isPhoto = isPhotoItem(item);
      const isVideo = isVideoItem(item);
      const rawMediaUrl = item.mediaUrl || item.mediaData || '';
      const mediaUrl = isPhoto ? normalizeCloudImageUrl(rawMediaUrl) : rawMediaUrl;
      const likesCount = item.likes || Math.floor(Math.random() * 8) + 12;

      const sticky = document.createElement('div');
      sticky.className = `wish-sticky ${themeClass}`;
      sticky.style.transform = `rotate(${rot}deg)`;

      let mediaHtml = '';
      if (isPhoto && mediaUrl) {
        mediaHtml = `
          <div class="sticky-media-wrap" data-img="${mediaUrl}" data-author="${encodeURIComponent(authorName)}" data-msg="${encodeURIComponent(messageText)}">
            <img src="${mediaUrl}" alt="Attached Memory" loading="lazy" onerror="this.onerror=null; if(this.src.indexOf('lh3.googleusercontent.com')!==-1){this.src=this.src.replace('lh3.googleusercontent.com/d/','drive.google.com/thumbnail?id=').split('?')[0]+'&sz=w1000';}" />
            <span class="sticky-media-badge"><i class="fa-solid fa-expand"></i> View Photo</span>
          </div>
        `;
      } else if (isVideo && mediaUrl) {
        mediaHtml = `
          <div class="sticky-video-embed">
            <div class="sticky-video-action-bar">
              <button type="button" class="sticky-video-expand-btn" data-video="${mediaUrl}" data-author="${encodeURIComponent(authorName)}" data-msg="${encodeURIComponent(messageText)}" title="Expand Video in Lightbox">
                <i class="fa-solid fa-expand"></i> Lightbox
              </button>
            </div>
            ${parseGasVideoEmbed(mediaUrl, false)}
          </div>
        `;
      }

      sticky.innerHTML = `
        <span class="pin">📌</span>
        <div class="sticky-card-header">
          <div class="sticky-avatar">${getWishAvatarLetter(authorName)}</div>
          <div class="sticky-author-info">
            <div class="sticky-author-name ${isRoyal ? 'is-royal' : ''}">
              ${escapeHtml(authorName)} ${isRoyal ? '👑' : '✨'}
            </div>
            <div class="sticky-date">${item.localTime || 'Recently'}</div>
          </div>
        </div>
        <p class="sticky-msg">"${escapeHtml(messageText)}"</p>
        ${mediaHtml}
        <div class="sticky-card-footer">
          <button type="button" class="sticky-like-btn" data-id="${item.id || ('wish_' + idx)}">
            <i class="fa-solid fa-heart"></i>
            <span class="like-count">${likesCount}</span>
          </button>
          <span class="sticky-tag">#MyLoveNishika2026</span>
        </div>
      `;

      // Photo Lightbox Click
      const mediaWrap = sticky.querySelector('.sticky-media-wrap');
      if (mediaWrap) {
        mediaWrap.addEventListener('click', () => {
          openMediaLightbox('photo', mediaUrl, authorName, messageText);
        });
      }

      // Video Lightbox Click
      const videoExpandBtn = sticky.querySelector('.sticky-video-expand-btn');
      if (videoExpandBtn) {
        videoExpandBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          openMediaLightbox('video', mediaUrl, authorName, messageText);
        });
      }

      // Like Button Interaction
      const likeBtn = sticky.querySelector('.sticky-like-btn');
      if (likeBtn) {
        likeBtn.addEventListener('click', () => {
          if (typeof audioSynth !== 'undefined' && audioSynth && typeof audioSynth.playChime === 'function') {
            try { audioSynth.playChime(659.25, 0.2); } catch(e) {}
          }
          item.likes = (item.likes || likesCount) + 1;
          likeBtn.classList.add('liked');
          const countSpan = likeBtn.querySelector('.like-count');
          if (countSpan) countSpan.textContent = item.likes;
          saveState();
        });
      }

      wishesPinboard.appendChild(sticky);
    });
  }
  window.renderPinnedWishes = renderPinnedWishes;

  // JSONP Fallback loader for Google Apps Script Web App
  function fetchGasJsonp(url, timeoutMs = 8000) {
    return new Promise((resolve, reject) => {
      const callbackName = 'gas_main_jsonp_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
      const script = document.createElement('script');
      const timeout = setTimeout(() => {
        cleanup();
        reject(new Error('JSONP request timed out'));
      }, timeoutMs);

      function cleanup() {
        clearTimeout(timeout);
        if (script.parentNode) script.parentNode.removeChild(script);
        delete window[callbackName];
      }

      window[callbackName] = (data) => {
        cleanup();
        resolve(data);
      };

      const separator = url.includes('?') ? '&' : '?';
      script.src = `${url}${separator}callback=${callbackName}`;
      script.onerror = () => {
        cleanup();
        reject(new Error('JSONP script load error'));
      };
      document.body.appendChild(script);
    });
  }

  // Live Cloud Fetch for Wishes, Photos & Videos
  async function fetchCloudWishes() {
    const sheetUrl = state.googleSheetUrl || localStorage.getItem('eternal_love_sheet_url') || DEFAULT_GOOGLE_SHEET_URL;
    if (!sheetUrl || !sheetUrl.startsWith('http')) return;

    if (syncWishesBtn) syncWishesBtn.classList.add('rotating');
    let cloudWishes = [];
    let cloudPhotos = [];

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(sheetUrl + '?action=getAll', {
        method: 'GET',
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data) {
          if (Array.isArray(data.wishes)) {
            data.wishes.forEach(w => {
              const rawMediaUrl = w.mediaUrl || w.mediaLink || w.mediaData || w.videoUrl || '';
              const isVideo = (w.mediaType === 'video') || isVideoItem({ mediaType: w.mediaType, mediaUrl: rawMediaUrl });
              const normalizedMediaUrl = normalizeCloudImageUrl(rawMediaUrl, isVideo);
              const authorName = w.author || w.name || 'Loving Well-wisher';
              const messageText = w.message || w.text || '';
              const isRoyal = w.isRoyal || authorName.toLowerCase().includes('dilip');

              cloudWishes.push({
                id: w.id || ('gs_wish_' + Math.random()),
                author: authorName,
                name: authorName,
                message: messageText,
                text: messageText,
                color: w.color || 'pink',
                styleClass: w.styleClass || `theme-${w.color || 'pink'}`,
                mediaType: isVideo ? 'video' : (w.mediaType || (rawMediaUrl ? 'photo' : 'none')),
                mediaUrl: normalizedMediaUrl,
                mediaData: normalizedMediaUrl,
                likes: w.likes || (Math.floor(Math.random() * 8) + 12),
                isRoyal: isRoyal,
                localTime: w.localTime || 'Recently',
                timestamp: w.timestamp || new Date().toISOString()
              });
            });
          }

          if (Array.isArray(data.photos)) {
            data.photos.forEach(p => {
              const photoUrl = normalizeCloudImageUrl(p.imgUrl || p.driveUrl || '', false);
              const author = p.dedicatedBy || 'Dilip 👑';
              const caption = p.caption || `Our unforgettable memory with ${p.celebrant || state.recipientName} 💖`;

              cloudPhotos.push({
                id: p.id || ('gs_photo_' + Math.random()),
                imgUrl: photoUrl,
                dataUrl: photoUrl,
                rawDriveUrl: p.driveUrl || '',
                caption: caption,
                tag: p.tag || 'Real Moment 📸',
                celebrant: p.celebrant || 'Nishika',
                dedicatedBy: author,
                localTime: p.localTime || 'Recently',
                timestamp: p.timestamp || new Date().toISOString()
              });

              cloudWishes.push({
                id: p.id || ('photo_sticky_' + Math.random()),
                author: author,
                name: author,
                message: caption,
                text: caption,
                color: 'peach',
                styleClass: 'theme-peach',
                mediaType: 'photo',
                mediaUrl: photoUrl,
                likes: 24,
                isRoyal: true,
                localTime: p.localTime || 'Recently',
                timestamp: p.timestamp || new Date().toISOString()
              });
            });
          }

          if (Array.isArray(data.videos)) {
            data.videos.forEach(v => {
              const rawUrl = v.videoUrl || v.driveUrl || v.mediaUrl || '';
              const videoUrl = normalizeCloudImageUrl(rawUrl, true);
              const sender = v.dedicatedBy || v.author || v.name || 'Dilip 👑';
              const caption = v.caption || v.message || 'Royal video dedication for My Love Nishika 🎬';

              cloudWishes.push({
                id: v.id || ('gs_video_' + Math.random()),
                author: sender,
                name: sender,
                message: caption,
                text: caption,
                color: 'gold',
                styleClass: 'theme-gold',
                mediaType: 'video',
                mediaUrl: videoUrl,
                mediaData: videoUrl,
                likes: 30,
                isRoyal: true,
                localTime: v.localTime || 'Recently',
                timestamp: v.timestamp || new Date().toISOString()
              });
            });
          }
        }
      }
    } catch (fetchErr) {
      console.warn('Standard fetch failed in main arena, attempting JSONP fallback...', fetchErr);
      try {
        const data = await fetchGasJsonp(sheetUrl + '?action=getAll');
        if (data) {
          if (Array.isArray(data.wishes)) {
            data.wishes.forEach(w => {
              const rawMediaUrl = w.mediaUrl || w.mediaLink || w.mediaData || w.videoUrl || '';
              const isVideo = (w.mediaType === 'video') || isVideoItem({ mediaType: w.mediaType, mediaUrl: rawMediaUrl });
              const normalizedMediaUrl = normalizeCloudImageUrl(rawMediaUrl, isVideo);
              const authorName = w.author || w.name || 'Loving Well-wisher';
              const messageText = w.message || w.text || '';
              const isRoyal = w.isRoyal || authorName.toLowerCase().includes('dilip');

              cloudWishes.push({
                id: w.id || ('gs_wish_' + Math.random()),
                author: authorName,
                name: authorName,
                message: messageText,
                text: messageText,
                color: w.color || 'pink',
                styleClass: w.styleClass || `theme-${w.color || 'pink'}`,
                mediaType: isVideo ? 'video' : (w.mediaType || (rawMediaUrl ? 'photo' : 'none')),
                mediaUrl: normalizedMediaUrl,
                mediaData: normalizedMediaUrl,
                likes: w.likes || (Math.floor(Math.random() * 8) + 12),
                isRoyal: isRoyal,
                localTime: w.localTime || 'Recently',
                timestamp: w.timestamp || new Date().toISOString()
              });
            });
          }

          if (Array.isArray(data.photos)) {
            data.photos.forEach(p => {
              const photoUrl = normalizeCloudImageUrl(p.imgUrl || p.driveUrl || '', false);
              const author = p.dedicatedBy || 'Dilip 👑';
              const caption = p.caption || `Our unforgettable memory with ${p.celebrant || state.recipientName} 💖`;

              cloudPhotos.push({
                id: p.id || ('gs_photo_' + Math.random()),
                imgUrl: photoUrl,
                dataUrl: photoUrl,
                rawDriveUrl: p.driveUrl || '',
                caption: caption,
                tag: p.tag || 'Real Moment 📸',
                celebrant: p.celebrant || 'Nishika',
                dedicatedBy: author,
                localTime: p.localTime || 'Recently',
                timestamp: p.timestamp || new Date().toISOString()
              });

              cloudWishes.push({
                id: p.id || ('photo_sticky_' + Math.random()),
                author: author,
                name: author,
                message: caption,
                text: caption,
                color: 'peach',
                styleClass: 'theme-peach',
                mediaType: 'photo',
                mediaUrl: photoUrl,
                likes: 24,
                isRoyal: true,
                localTime: p.localTime || 'Recently',
                timestamp: p.timestamp || new Date().toISOString()
              });
            });
          }

          if (Array.isArray(data.videos)) {
            data.videos.forEach(v => {
              const rawUrl = v.videoUrl || v.driveUrl || v.mediaUrl || '';
              const videoUrl = normalizeCloudImageUrl(rawUrl, true);
              const sender = v.dedicatedBy || v.author || v.name || 'Dilip 👑';
              const caption = v.caption || v.message || 'Royal video dedication for My Love Nishika 🎬';

              cloudWishes.push({
                id: v.id || ('gs_video_' + Math.random()),
                author: sender,
                name: sender,
                message: caption,
                text: caption,
                color: 'gold',
                styleClass: 'theme-gold',
                mediaType: 'video',
                mediaUrl: videoUrl,
                mediaData: videoUrl,
                likes: 30,
                isRoyal: true,
                localTime: v.localTime || 'Recently',
                timestamp: v.timestamp || new Date().toISOString()
              });
            });
          }
        }
      } catch (jsonpErr) {
        console.warn('JSONP fallback also failed in main arena:', jsonpErr);
      }
    }

    // Merge Photos into state.uploadedPhotos & re-render Polaroid Gallery
    if (cloudPhotos.length > 0) {
      const photoMap = new Map();
      [...cloudPhotos, ...(state.uploadedPhotos || [])].forEach(p => {
        const key = (p.imgUrl || p.dataUrl || p.caption).trim().toLowerCase();
        if (key && !photoMap.has(key)) {
          photoMap.set(key, p);
        }
      });
      state.uploadedPhotos = Array.from(photoMap.values());
      saveState();
      renderAllPolaroidGallery();
    }

    // Merge Wishes into state.pinnedWishes & re-render Sticky Wish Wall
    const mergedMap = new Map();
    [...cloudWishes, ...(state.pinnedWishes || []), ...DEFAULT_MAIN_WISHES].forEach(w => {
      const key = ((w.author || w.name) + '_' + (w.message || w.text)).trim().toLowerCase();
      if (!mergedMap.has(key)) {
        mergedMap.set(key, w);
      }
    });

    state.pinnedWishes = Array.from(mergedMap.values());
    saveState();

    if (syncWishesBtn) syncWishesBtn.classList.remove('rotating');
    renderPinnedWishes();
  }

  if (syncWishesBtn) syncWishesBtn.addEventListener('click', fetchCloudWishes);
  fetchCloudWishes();

  // Wish Form Submission Handler
  if (wishForm) {
    wishForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const author = wishAuthorInput ? wishAuthorInput.value.trim() : (state.senderName || 'Loving Friend');
      const text = wishTextInput ? wishTextInput.value.trim() : '';
      if (!text) return;

      // Ensure Base64 file is fully encoded before dispatching payload
      if (mainSelectedMediaType === 'video' && mainWishVideoInput && mainWishVideoInput.files && mainWishVideoInput.files[0]) {
        try {
          mainSelectedMediaData = await readFileAsBase64(mainWishVideoInput.files[0]);
        } catch (vErr) {
          console.warn('Main wish video encoding error:', vErr);
        }
      } else if (mainSelectedMediaType === 'photo' && mainWishPhotoInput && mainWishPhotoInput.files && mainWishPhotoInput.files[0]) {
        if (!mainSelectedMediaData || !mainSelectedMediaData.startsWith('data:image')) {
          try {
            mainSelectedMediaData = await readFileAsBase64(mainWishPhotoInput.files[0]);
          } catch (pErr) {
            console.warn('Main wish photo encoding error:', pErr);
          }
        }
      }

      const randomRot = (Math.random() * 5 - 2.5).toFixed(1);
      const styleThemeClass = `theme-${mainSelectedTheme}`;

      const newWish = {
        id: 'local_wish_' + Date.now(),
        author: author,
        name: author,
        text: text,
        message: text,
        color: mainSelectedTheme,
        styleClass: styleThemeClass,
        rot: randomRot,
        mediaType: mainSelectedMediaType,
        mediaUrl: mainSelectedMediaData,
        mediaData: mainSelectedMediaData,
        likes: 1,
        isRoyal: author.toLowerCase().includes('dilip'),
        localTime: 'Just Now',
        timestamp: new Date().toISOString()
      };

      if (!state.pinnedWishes) state.pinnedWishes = [];
      state.pinnedWishes.unshift(newWish);
      saveState();
      renderPinnedWishes();

      audioSynth.playCheerSound();
      burstConfetti(window.innerWidth / 2, window.innerHeight * 0.7, 45);

      // Sync wish note to Google Sheets & Drive
      sendToGoogleSheet({
        type: 'wish',
        name: author,
        author: author,
        message: text,
        text: text,
        color: mainSelectedTheme,
        styleClass: styleThemeClass,
        mediaType: mainSelectedMediaType,
        mediaData: mainSelectedMediaData,
        mediaUrl: mainSelectedMediaData,
        dataUrl: mainSelectedMediaData,
        videoUrl: mainSelectedMediaData,
        celebrant: state.recipientName || 'Nishika',
        dedicatedBy: state.senderName || 'Dilip',
        timestamp: new Date().toISOString(),
        localTime: new Date().toLocaleString()
      }, {
        chipElement: document.getElementById('wishSyncChip'),
        textElement: document.getElementById('wishSyncText'),
        successText: 'Wish & Media Saved to Google Sheets! 💖✨',
        defaultText: 'Google Sheets Connected ✨'
      });

      // Reset form
      wishForm.reset();
      mainSelectedMediaData = '';
      mainSelectedMediaType = 'none';
      if (mainPhotoPreviewBox) mainPhotoPreviewBox.style.display = 'none';
      if (mainPhotoPreviewImg) mainPhotoPreviewImg.src = '';
      if (mainVideoPreviewBox) mainVideoPreviewBox.style.display = 'none';
      if (mainVideoPreviewContainer) mainVideoPreviewContainer.innerHTML = '';

      mainMediaTabBtns.forEach(b => b.classList.remove('active'));
      const defaultTab = document.querySelector('.media-tab-btn[data-tab="mainTabNone"]');
      if (defaultTab) defaultTab.classList.add('active');
      document.querySelectorAll('#wishBoardSection .media-content-pane').forEach(p => p.classList.remove('active'));

      showToast('Note & media pinned to My Love Nishika\'s celebration board! 📌✨');
    });
  }

  // --------------------------------------------------------------------------
  // MEDIA LIGHTBOX CONTROLLER (Photos & Videos)
  // --------------------------------------------------------------------------
  const mediaLightboxModal = document.getElementById('mediaLightboxModal');
  const closeMediaLightboxBtn = document.getElementById('closeMediaLightboxBtn');
  const lightboxViewport = document.getElementById('lightboxViewport');
  const lightboxAuthorName = document.getElementById('lightboxAuthorName');
  const lightboxMessage = document.getElementById('lightboxMessage');

  function openMediaLightbox(type, url, author, msg) {
    if (!mediaLightboxModal || !lightboxViewport) return;
    if (typeof audioSynth !== 'undefined' && audioSynth && typeof audioSynth.playChime === 'function') {
      try { audioSynth.playChime(659.25, 0.2); } catch(e) {}
    }

    if (type === 'photo') {
      lightboxViewport.innerHTML = `<img src="${escapeHtml(url)}" alt="Full Photo" style="max-width:100%; max-height:60vh; object-fit:contain; border-radius:12px;" />`;
    } else if (type === 'video') {
      lightboxViewport.innerHTML = `<div style="width:100%; height:55vh; max-height:550px;">${parseGasVideoEmbed(url, true)}</div>`;
    }

    const decodedAuthor = decodeURIComponent(author || 'Loving Well-wisher');
    const decodedMsg = decodeURIComponent(msg || '');

    if (lightboxAuthorName) lightboxAuthorName.innerHTML = `<i class="fa-solid fa-crown"></i> <span>${escapeHtml(decodedAuthor)}</span>`;
    if (lightboxMessage) lightboxMessage.textContent = decodedMsg;

    mediaLightboxModal.classList.add('active');
  }
  window.openMediaLightbox = openMediaLightbox;

  function closeMediaLightbox() {
    if (!mediaLightboxModal) return;
    mediaLightboxModal.classList.remove('active');
    if (lightboxViewport) lightboxViewport.innerHTML = '';
  }

  if (closeMediaLightboxBtn) closeMediaLightboxBtn.addEventListener('click', closeMediaLightbox);
  if (mediaLightboxModal) {
    mediaLightboxModal.addEventListener('click', (e) => {
      if (e.target === mediaLightboxModal) closeMediaLightbox();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mediaLightboxModal && mediaLightboxModal.classList.contains('active')) {
      closeMediaLightbox();
    }
  });



  // --------------------------------------------------------------------------
  // 18. SECTION 11: MYSTERY BIRTHDAY FORTUNE CARDS
  // --------------------------------------------------------------------------
  const mysteryCards = document.querySelectorAll('.mystery-box-card');
  mysteryCards.forEach(card => {
    card.addEventListener('click', () => {
      if (!card.classList.contains('flipped')) {
        card.classList.add('flipped');
        if (typeof audioSynth !== 'undefined' && audioSynth && typeof audioSynth.playCelebrationFanfare === 'function') {
          try { audioSynth.playCelebrationFanfare(); } catch(e) {}
        }
        const rect = card.getBoundingClientRect();
        burstConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 50);
      }
    });
  });

  // --------------------------------------------------------------------------
  // NOSTALGIC VINTAGE CINEMATIC PROJECTOR CONTROLLER
  // --------------------------------------------------------------------------
  const prevCinemaFrameBtn = document.getElementById('prevCinemaFrameBtn');
  const nextCinemaFrameBtn = document.getElementById('nextCinemaFrameBtn');
  const cinemaSceneIndicator = document.getElementById('cinemaSceneIndicator');
  const filmFrames = document.querySelectorAll('.cinema-projection-screen .film-frame');
  const projSpoolTop = document.getElementById('projSpoolTop');
  const projSpoolBottom = document.getElementById('projSpoolBottom');
  let currentCinemaScene = 0;

  function switchCinemaScene(newIndex) {
    if (!filmFrames || filmFrames.length === 0) return;
    currentCinemaScene = (newIndex + filmFrames.length) % filmFrames.length;

    filmFrames.forEach((frame, idx) => {
      frame.classList.toggle('active', idx === currentCinemaScene);
    });

    if (cinemaSceneIndicator) {
      cinemaSceneIndicator.textContent = `Scene ${currentCinemaScene + 1} / ${filmFrames.length}`;
    }

    // Spin spools fast during reel transition
    if (projSpoolTop && projSpoolBottom) {
      projSpoolTop.style.animationDuration = '0.8s';
      projSpoolBottom.style.animationDuration = '0.8s';
      setTimeout(() => {
        projSpoolTop.style.animationDuration = '3s';
        projSpoolBottom.style.animationDuration = '3s';
      }, 700);
    }

    audioSynth.playPopSound();
  }

  if (prevCinemaFrameBtn) {
    prevCinemaFrameBtn.addEventListener('click', () => switchCinemaScene(currentCinemaScene - 1));
  }
  if (nextCinemaFrameBtn) {
    nextCinemaFrameBtn.addEventListener('click', () => switchCinemaScene(currentCinemaScene + 1));
  }

  // --------------------------------------------------------------------------
  // 19. MODALS & KEEPSAKE CERTIFICATE
  // --------------------------------------------------------------------------
  function openModal(modalEl, pushHistory = true) {
    if (!modalEl) return;
    if (!modalEl.classList.contains('active')) {
      modalEl.classList.add('active');
      if (pushHistory && modalEl.id) {
        try {
          history.pushState({ modalId: modalEl.id }, '', '#' + modalEl.id);
        } catch(e) {}
      }
    }
  }

  function closeModal(modalEl, fromHistory = false) {
    if (!modalEl) return;
    const wasActive = modalEl.classList.contains('active');
    modalEl.classList.remove('active');
    if (wasActive && !fromHistory && modalEl.id) {
      if (window.location.hash === '#' + modalEl.id || (history.state && history.state.modalId === modalEl.id)) {
        try {
          history.back();
        } catch(e) {
          history.replaceState(null, '', window.location.pathname + window.location.search);
        }
      }
    }
  }

  // Personalize Modal
  const customizeBtn = document.getElementById('customizeBtn');
  const customizeModal = document.getElementById('customizeModal');
  const closeCustomizeModalBtn = document.getElementById('closeCustomizeModalBtn');
  const shareFooterBtn = document.getElementById('shareFooterBtn');

  if (customizeBtn) customizeBtn.addEventListener('click', () => openModal(customizeModal));
  if (shareFooterBtn) shareFooterBtn.addEventListener('click', () => openModal(customizeModal));
  if (closeCustomizeModalBtn) closeCustomizeModalBtn.addEventListener('click', () => closeModal(customizeModal));

  // Keepsake Certificate Modal
  const openKeepsakeBtn = document.getElementById('openKeepsakeBtn');
  const keepsakeModal = document.getElementById('keepsakeModal');
  const closeKeepsakeModalBtn = document.getElementById('closeKeepsakeModalBtn');
  const printCardBtn = document.getElementById('printCardBtn');

  if (openKeepsakeBtn) openKeepsakeBtn.addEventListener('click', () => openModal(keepsakeModal));
  if (closeKeepsakeModalBtn) closeKeepsakeModalBtn.addEventListener('click', () => closeModal(keepsakeModal));
  if (printCardBtn) printCardBtn.addEventListener('click', () => window.print());

  // Theme Picker in Modal
  document.querySelectorAll('.theme-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      document.querySelectorAll('.theme-dot').forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
      state.theme = dot.getAttribute('data-theme');
      document.body.className = state.theme;
      saveState();
      updateShareUrl();
    });
  });

  // Customizer Form Submit
  const customizeForm = document.getElementById('customizeForm');
  const custNameInput = document.getElementById('custNameInput');
  const custSenderInput = document.getElementById('custSenderInput');
  const custStartDateInput = document.getElementById('custStartDateInput');
  const custMsgInput = document.getElementById('custMsgInput');
  const custGoogleSheetUrl = document.getElementById('custGoogleSheetUrl');

  if (customizeForm) {
    customizeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      state.recipientName = (custNameInput && custNameInput.value.trim()) || 'Nishika';
      if (custSenderInput) state.senderName = custSenderInput.value.trim() || 'Dilip';
      if (custStartDateInput && custStartDateInput.value) state.startDate = custStartDateInput.value;
      if (custMsgInput) state.message = custMsgInput.value.trim() || state.message;
      if (custGoogleSheetUrl) {
        state.googleSheetUrl = custGoogleSheetUrl.value.trim();
        localStorage.setItem('eternal_love_sheet_url', state.googleSheetUrl);
      }

      saveState();
      applyStateToDOM();
      updateCloudSyncChips();
      closeModal(customizeModal);
      showToast('Personalized settings & Cloud Sync updated! 💖');
      burstConfetti(window.innerWidth / 2, 200, 60);
    });
  }

  // Live input link updater
  if (custNameInput) custNameInput.addEventListener('input', () => {
    state.recipientName = custNameInput.value.trim() || 'Sweetheart';
    updateShareUrl();
  });

  if (custGoogleSheetUrl) {
    custGoogleSheetUrl.addEventListener('input', () => {
      state.googleSheetUrl = custGoogleSheetUrl.value.trim();
      updateShareUrl();
      updateCloudSyncChips();
    });
  }

  function updateShareUrl() {
    const shareUrlInput = document.getElementById('shareUrlInput');
    if (!shareUrlInput) return;
    try {
      let base = window.location.href ? window.location.href.split('?')[0].split('#')[0] : 'main.html';
      const url = new URL(base, window.location.origin && window.location.origin !== 'null' ? window.location.origin : 'http://localhost');
      url.searchParams.set('name', state.recipientName);
      url.searchParams.set('sender', state.senderName);
      url.searchParams.set('date', state.startDate);
      if (state.message) url.searchParams.set('msg', state.message);
      url.searchParams.set('theme', state.theme);
      if (state.googleSheetUrl) url.searchParams.set('sheet', state.googleSheetUrl);
      shareUrlInput.value = url.toString();
    } catch (e) {
      shareUrlInput.value = (window.location.href || 'main.html').split('#')[0];
    }
  }

  // Copy Share URL Button
  const copyShareUrlBtn = document.getElementById('copyShareUrlBtn');
  const copyBtnText = document.getElementById('copyBtnText');
  if (copyShareUrlBtn) {
    copyShareUrlBtn.addEventListener('click', () => {
      const shareUrlInput = document.getElementById('shareUrlInput');
      if (shareUrlInput) {
        shareUrlInput.select();
        navigator.clipboard.writeText(shareUrlInput.value).then(() => {
          if (copyBtnText) copyBtnText.textContent = 'Copied!';
          showToast('Shareable link copied to clipboard! 📋💖');
          setTimeout(() => {
            if (copyBtnText) copyBtnText.textContent = 'Copy Link';
          }, 2500);
        }).catch(() => {
          showToast('Select & copy link manually!');
        });
      }
    });
  }

  // --------------------------------------------------------------------------
  // 20. CONSTELLATION OF LOVE & STAR REGISTRY FOR NISHIKA (MOBILE-OPTIMIZED)
  // --------------------------------------------------------------------------
  const constellationCanvas = document.getElementById('constellationCanvas');
  const starModal = document.getElementById('starModal');
  const openStarRegistryBtn = document.getElementById('openStarRegistryBtn');
  const closeStarModalBtn = document.getElementById('closeStarModalBtn');
  const printStarCertBtn = document.getElementById('printStarCertBtn');

  if (openStarRegistryBtn) openStarRegistryBtn.addEventListener('click', () => openModal(starModal));
  if (closeStarModalBtn) closeStarModalBtn.addEventListener('click', () => closeModal(starModal));
  if (printStarCertBtn) printStarCertBtn.addEventListener('click', () => window.print());

  if (constellationCanvas) {
    const starCtx = constellationCanvas.getContext('2d');
    let activeConstellationPattern = 'crown';
    let userPlacedStars = [];
    let isConstellationVisible = false;
    let constelAnimId = null;

    // Normalized coordinates kept within upper 60% of canvas height (y: 0.12 - 0.58)
    // guaranteeing 100% full visibility and zero obstruction by the bottom dock on mobile!
    const constellationPatterns = {
      crown: [
        { x: 0.18, y: 0.46 }, { x: 0.34, y: 0.20 }, { x: 0.5, y: 0.36 },
        { x: 0.66, y: 0.20 }, { x: 0.82, y: 0.46 }, { x: 0.5, y: 0.56 }, { x: 0.18, y: 0.46 }
      ],
      heart: [
        { x: 0.5, y: 0.24 }, { x: 0.38, y: 0.12 }, { x: 0.24, y: 0.16 },
        { x: 0.2, y: 0.32 }, { x: 0.5, y: 0.58 }, { x: 0.8, y: 0.32 },
        { x: 0.76, y: 0.16 }, { x: 0.62, y: 0.12 }, { x: 0.5, y: 0.24 }
      ],
      infinity: [
        { x: 0.22, y: 0.35 }, { x: 0.34, y: 0.20 }, { x: 0.5, y: 0.35 },
        { x: 0.66, y: 0.50 }, { x: 0.78, y: 0.35 }, { x: 0.66, y: 0.20 },
        { x: 0.5, y: 0.35 }, { x: 0.34, y: 0.50 }, { x: 0.22, y: 0.35 }
      ]
    };

    let constelLogicalW = 800;
    let constelLogicalH = 380;

    function resizeConstellationCanvas() {
      if (!constellationCanvas || !constellationCanvas.parentElement) return;
      const rect = constellationCanvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      constelLogicalW = rect.width || constellationCanvas.parentElement.clientWidth || 360;
      constelLogicalH = rect.height || constellationCanvas.parentElement.clientHeight || 380;
      constellationCanvas.width = Math.round(constelLogicalW * dpr);
      constellationCanvas.height = Math.round(constelLogicalH * dpr);
      starCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawConstellationSky();
    }

    function drawConstellationSky() {
      if (!starCtx) return;
      const w = constelLogicalW;
      const h = constelLogicalH;
      starCtx.clearRect(0, 0, w, h);

      const time = Date.now() * 0.002;

      // 1. Draw faint background twinkling cosmos
      for (let i = 0; i < 35; i++) {
        const sx = ((Math.sin(i * 127 + 1) * 0.5 + 0.5) * w);
        const sy = ((Math.cos(i * 73 + 2) * 0.5 + 0.5) * (h * 0.85));
        const twinkle = Math.sin(time + i) * 0.3 + 0.5;
        starCtx.beginPath();
        starCtx.arc(sx, sy, 1.2, 0, Math.PI * 2);
        starCtx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.15, twinkle)})`;
        starCtx.fill();
      }

      // 2. Draw active constellation connecting lines
      const pts = constellationPatterns[activeConstellationPattern] || constellationPatterns.crown;
      starCtx.beginPath();
      starCtx.strokeStyle = 'rgba(251, 191, 36, 0.82)';
      starCtx.lineWidth = 2.2;
      starCtx.shadowColor = '#fbbf24';
      starCtx.shadowBlur = 14;

      pts.forEach((pt, idx) => {
        const px = pt.x * w;
        const py = pt.y * h;
        if (idx === 0) starCtx.moveTo(px, py);
        else starCtx.lineTo(px, py);
      });
      starCtx.stroke();
      starCtx.shadowBlur = 0;

      // 3. Draw user-placed custom glowing stars
      for (let i = userPlacedStars.length - 1; i >= 0; i--) {
        const uStar = userPlacedStars[i];
        uStar.alpha -= 0.004;
        if (uStar.alpha <= 0) {
          userPlacedStars.splice(i, 1);
          continue;
        }
        starCtx.save();
        starCtx.beginPath();
        starCtx.arc(uStar.x, uStar.y, uStar.radius, 0, Math.PI * 2);
        starCtx.fillStyle = `rgba(255, 245, 180, ${uStar.alpha})`;
        starCtx.shadowColor = '#fbbf24';
        starCtx.shadowBlur = 15;
        starCtx.fill();

        // Sparkle crosshairs
        starCtx.strokeStyle = `rgba(255, 255, 255, ${uStar.alpha * 0.8})`;
        starCtx.lineWidth = 1;
        starCtx.beginPath();
        starCtx.moveTo(uStar.x - 8, uStar.y);
        starCtx.lineTo(uStar.x + 8, uStar.y);
        starCtx.moveTo(uStar.x, uStar.y - 8);
        starCtx.lineTo(uStar.x, uStar.y + 8);
        starCtx.stroke();
        starCtx.restore();
      }

      // 4. Draw glowing constellation star nodes with breathing radiance
      pts.forEach((pt, idx) => {
        const px = pt.x * w;
        const py = pt.y * h;
        const pulse = Math.sin(time * 2 + idx) * 1.5;

        // Outer starlight halo
        const halo = starCtx.createRadialGradient(px, py, 2, px, py, 14 + pulse);
        halo.addColorStop(0, 'rgba(251, 191, 36, 0.7)');
        halo.addColorStop(0.5, 'rgba(192, 132, 252, 0.4)');
        halo.addColorStop(1, 'rgba(192, 132, 252, 0)');
        starCtx.fillStyle = halo;
        starCtx.beginPath();
        starCtx.arc(px, py, 14 + pulse, 0, Math.PI * 2);
        starCtx.fill();

        // Core bright diamond star
        starCtx.beginPath();
        starCtx.arc(px, py, 4.5 + pulse * 0.3, 0, Math.PI * 2);
        starCtx.fillStyle = '#ffffff';
        starCtx.shadowColor = '#ffd700';
        starCtx.shadowBlur = 12;
        starCtx.fill();
        starCtx.shadowBlur = 0;
      });
    }

    function animateConstellationLoop() {
      if (!isConstellationVisible) {
        constelAnimId = null;
        return;
      }
      drawConstellationSky();
      constelAnimId = requestAnimationFrame(animateConstellationLoop);
    }

    const constelObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isConstellationVisible = entry.isIntersecting;
        if (isConstellationVisible && !constelAnimId) {
          constelAnimId = requestAnimationFrame(animateConstellationLoop);
        }
      });
    }, { threshold: 0.05 });
    constelObserver.observe(constellationCanvas);

    // Interactive Touch / Tap / Click on Constellation Sky
    function handleConstellationTap(clientX, clientY) {
      if (!constellationCanvas) return;
      const rect = constellationCanvas.getBoundingClientRect();
      const clickX = clientX - rect.left;
      const clickY = clientY - rect.top;

      userPlacedStars.push({
        x: clickX,
        y: clickY,
        radius: Math.random() * 2.5 + 3,
        alpha: 1.0
      });

      if (audioSynth && typeof audioSynth.playMagicChime === 'function') {
        audioSynth.playMagicChime();
      }
      burstConfetti(clientX, clientY, 15);
    }

    constellationCanvas.addEventListener('click', (e) => {
      if (e.target && e.target.closest && e.target.closest('.constellation-info-dock')) return;
      handleConstellationTap(e.clientX, e.clientY);
    });

    constellationCanvas.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches[0]) {
        handleConstellationTap(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    document.querySelectorAll('.constellation-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.constellation-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        activeConstellationPattern = chip.getAttribute('data-constellation');
        drawConstellationSky();
        if (audioSynth && typeof audioSynth.playMagicChime === 'function') {
          audioSynth.playMagicChime();
        }
        burstConfetti(window.innerWidth / 2, window.innerHeight * 0.6, 25);
      });
    });
  }

  // --------------------------------------------------------------------------
  // 21. FLOATING SKY LANTERNS FESTIVAL (MOBILE-OPTIMIZED)
  // --------------------------------------------------------------------------
  const lanternCanvas = document.getElementById('lanternCanvas');
  const lanternWishInput = document.getElementById('lanternWishInput');
  const releaseLanternBtn = document.getElementById('releaseLanternBtn');
  let activeLanterns = [];

  if (lanternCanvas) {
    const lCtx = lanternCanvas.getContext('2d');
    let isLanternsVisible = false;
    let lanternAnimId = null;
    let lanternLogicalW = 800;
    let lanternLogicalH = 380;

    const ambientWishes = [
      'Happy Birthday Nishika 👑',
      'Endless Love 💖',
      'Forever Dilip & Nishika ✨',
      'Nishika\'s Radiant Smile 🌟',
      'Eternal Joy & Peace 🌸',
      'Love of My Heart 💎'
    ];

    function resizeLanternCanvas() {
      if (!lanternCanvas || !lanternCanvas.parentElement) return;
      const rect = lanternCanvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      lanternLogicalW = rect.width || lanternCanvas.parentElement.clientWidth || 360;
      lanternLogicalH = rect.height || lanternCanvas.parentElement.clientHeight || 380;
      lanternCanvas.width = Math.round(lanternLogicalW * dpr);
      lanternCanvas.height = Math.round(lanternLogicalH * dpr);
      lCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function spawnLantern(wishText, customX, customY) {
      const w = lanternLogicalW;
      const h = lanternLogicalH;
      const startX = (typeof customX === 'number') 
        ? Math.max(30, Math.min(w - 30, customX))
        : (Math.random() * (Math.max(140, w - 80)) + 40);
      const startY = (typeof customY === 'number') ? customY : (h + 30);

      activeLanterns.push({
        x: startX,
        y: startY,
        vy: -(Math.random() * 0.7 + 0.8),
        vx: (Math.random() - 0.5) * 0.3,
        width: Math.min(36, Math.max(28, w * 0.08)),
        height: Math.min(48, Math.max(38, w * 0.11)),
        sway: Math.random() * Math.PI * 2,
        swaySpeed: Math.random() * 0.002 + 0.0015,
        wish: wishText || ambientWishes[Math.floor(Math.random() * ambientWishes.length)],
        isUserSpawned: !!wishText
      });
    }

    // Dynamic initial ambient lanterns positioned proportionally
    function initAmbientLanterns() {
      activeLanterns = [];
      const count = 5;
      for (let i = 0; i < count; i++) {
        activeLanterns.push({
          x: Math.random() * (Math.max(140, lanternLogicalW - 80)) + 40,
          y: Math.random() * (lanternLogicalH * 0.7) + 40,
          vy: -(Math.random() * 0.4 + 0.35),
          vx: (Math.random() - 0.5) * 0.2,
          width: Math.min(32, Math.max(26, lanternLogicalW * 0.075)),
          height: Math.min(44, Math.max(36, lanternLogicalW * 0.1)),
          sway: Math.random() * Math.PI * 2,
          swaySpeed: 0.002,
          wish: ambientWishes[i % ambientWishes.length],
          isUserSpawned: false
        });
      }
    }

    function renderSkyLanterns() {
      if (!lCtx || !isLanternsVisible) {
        lanternAnimId = null;
        return;
      }

      const w = lanternLogicalW;
      const h = lanternLogicalH;
      lCtx.clearRect(0, 0, w, h);

      // Auto-replenish ambient lanterns so the sky is never empty
      if (activeLanterns.length < 5) {
        spawnLantern(null);
      }

      const now = Date.now();

      for (let i = activeLanterns.length - 1; i >= 0; i--) {
        const lan = activeLanterns[i];
        lan.y += lan.vy;
        lan.x += lan.vx + Math.sin(now * lan.swaySpeed + lan.sway) * 0.3;

        // Wrap or remove if above top
        if (lan.y < -70) {
          activeLanterns.splice(i, 1);
          continue;
        }

        lCtx.save();
        lCtx.translate(lan.x, lan.y);

        // Flame flicker factor
        const flicker = Math.sin(now * 0.01 + lan.sway) * 1.5;

        // 1. Soft Outer Radiant Gold/Rose Halo
        const outerHalo = lCtx.createRadialGradient(0, 0, lan.height * 0.15, 0, 0, lan.height * 1.35 + flicker);
        outerHalo.addColorStop(0, 'rgba(251, 191, 36, 0.45)');
        outerHalo.addColorStop(0.6, 'rgba(244, 63, 94, 0.18)');
        outerHalo.addColorStop(1, 'rgba(251, 191, 36, 0)');
        lCtx.fillStyle = outerHalo;
        lCtx.beginPath();
        lCtx.arc(0, 0, lan.height * 1.3 + flicker, 0, Math.PI * 2);
        lCtx.fill();

        // 2. Traditional Paper Shell with Warm Radiant Gradient
        const grad = lCtx.createRadialGradient(0, lan.height * 0.2, 3, 0, 0, lan.height * 0.9);
        grad.addColorStop(0, 'rgba(255, 252, 210, 0.98)');
        grad.addColorStop(0.45, 'rgba(251, 191, 36, 0.92)');
        grad.addColorStop(0.85, 'rgba(244, 63, 94, 0.78)');
        grad.addColorStop(1, 'rgba(190, 18, 60, 0.65)');

        lCtx.fillStyle = grad;
        lCtx.beginPath();
        lCtx.roundRect(-lan.width / 2, -lan.height / 2, lan.width, lan.height, [8, 8, 4, 4]);
        lCtx.fill();

        // Subtle wooden rib rings
        lCtx.strokeStyle = 'rgba(180, 83, 9, 0.4)';
        lCtx.lineWidth = 1;
        lCtx.beginPath();
        lCtx.moveTo(-lan.width / 2 + 2, 0);
        lCtx.lineTo(lan.width / 2 - 2, 0);
        lCtx.stroke();

        // 3. Inner Glowing Core Candle Flame
        lCtx.fillStyle = '#ffffff';
        lCtx.shadowColor = '#ffd700';
        lCtx.shadowBlur = 8 + flicker;
        lCtx.beginPath();
        lCtx.arc(0, lan.height / 3.2, 3.2, 0, Math.PI * 2);
        lCtx.fill();
        lCtx.shadowBlur = 0;

        // 4. Subtle Wish Banner label
        if (lan.wish && lan.y > 20) {
          lCtx.font = `600 ${Math.max(9, Math.min(11, w * 0.028))}px sans-serif`;
          lCtx.fillStyle = 'rgba(255, 255, 255, 0.88)';
          lCtx.textAlign = 'center';
          lCtx.fillText(lan.wish.length > 22 ? lan.wish.substring(0, 20) + '…' : lan.wish, 0, -lan.height / 2 - 5);
        }

        lCtx.restore();
      }

      lanternAnimId = requestAnimationFrame(renderSkyLanterns);
    }

    const lanternObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isLanternsVisible = entry.isIntersecting;
        if (isLanternsVisible && !lanternAnimId) {
          lanternAnimId = requestAnimationFrame(renderSkyLanterns);
        }
      });
    }, { threshold: 0.05 });
    lanternObserver.observe(lanternCanvas);

    // Tap/Click anywhere on sky to release a custom lantern immediately
    function handleLanternSkyTap(clientX, clientY) {
      if (!lanternCanvas) return;
      const rect = lanternCanvas.getBoundingClientRect();
      const tapX = clientX - rect.left;
      const tapY = clientY - rect.top;

      const wish = (lanternWishInput && lanternWishInput.value.trim()) || ambientWishes[Math.floor(Math.random() * ambientWishes.length)];
      spawnLantern(wish, tapX, tapY);

      if (audioSynth && typeof audioSynth.playPopSound === 'function') {
        audioSynth.playPopSound();
      }
      burstConfetti(clientX, clientY, 20);
      showToast('Lantern released into the starlight! 🏮✨');
    }

    lanternCanvas.addEventListener('click', (e) => {
      if (e.target && e.target.closest && e.target.closest('.lantern-composer-dock')) return;
      handleLanternSkyTap(e.clientX, e.clientY);
    });

    lanternCanvas.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches[0]) {
        handleLanternSkyTap(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    if (releaseLanternBtn) {
      releaseLanternBtn.addEventListener('click', () => {
        const wish = (lanternWishInput && lanternWishInput.value.trim()) || 'Happy Birthday Nishika 💖';
        spawnLantern(wish);
        if (audioSynth && typeof audioSynth.playCelebrationFanfare === 'function') {
          audioSynth.playCelebrationFanfare();
        }
        burstConfetti(window.innerWidth / 2, window.innerHeight * 0.6, 50);
        showToast('Your glowing sky lantern has ascended into the stars! 🏮✨');
        if (lanternWishInput) lanternWishInput.value = '';
      });
    }

    // Unified Master Resize Handler for Both Canvases
    function handleMasterCanvasesResize() {
      if (typeof resizeConstellationCanvas === 'function') resizeConstellationCanvas();
      if (typeof resizeLanternCanvas === 'function') resizeLanternCanvas();
    }

    window.addEventListener('resize', handleMasterCanvasesResize);
    window.addEventListener('orientationchange', () => setTimeout(handleMasterCanvasesResize, 150));
    setTimeout(() => {
      handleMasterCanvasesResize();
      initAmbientLanterns();
    }, 120);
  }

  // --------------------------------------------------------------------------
  // 22. VIRTUAL "LOVE CLAW" BIRTHDAY ARCADE
  // --------------------------------------------------------------------------
  const clawAssembly = document.getElementById('clawAssembly');
  const clawRope = document.getElementById('clawRope');
  const clawHead = document.getElementById('clawHead');
  const clawLeftBtn = document.getElementById('clawLeftBtn');
  const clawRightBtn = document.getElementById('clawRightBtn');
  const clawDropBtn = document.getElementById('clawDropBtn');
  const clawRevealBanner = document.getElementById('clawRevealBanner');
  const clawPrizeText = document.getElementById('clawPrizeText');

  let clawPosPct = 50;
  let isClawDropping = false;

  const clawPrizes = [
    'Candlelight Rooftop Date Under The Stars 🍷✨',
    'Unlimited Warm Cuddles & Back Rubs 🧸💖',
    'Midnight Ice Cream Date (Nishika\'s Choice) 🍦🌙',
    'Movie Marathon with 100% Her Picks 🍿🧸',
    '100 Sweet Forehead Kisses & Hugs 💋👑'
  ];

  if (clawLeftBtn) {
    clawLeftBtn.addEventListener('click', () => {
      if (isClawDropping) return;
      clawPosPct = Math.max(15, clawPosPct - 12);
      if (clawAssembly) clawAssembly.style.left = `${clawPosPct}%`;
      audioSynth.playPopSound();
    });
  }

  if (clawRightBtn) {
    clawRightBtn.addEventListener('click', () => {
      if (isClawDropping) return;
      clawPosPct = Math.min(85, clawPosPct + 12);
      if (clawAssembly) clawAssembly.style.left = `${clawPosPct}%`;
      audioSynth.playPopSound();
    });
  }

  if (clawDropBtn) {
    clawDropBtn.addEventListener('click', () => {
      if (isClawDropping) return;
      isClawDropping = true;
      if (clawRevealBanner) clawRevealBanner.classList.add('hidden');

      // Drop claw rope
      if (clawRope) clawRope.style.height = '160px';
      audioSynth.playTone(320, 0.4, 'triangle');

      setTimeout(() => {
        // Pinch fingers
        if (clawHead) clawHead.classList.add('grabbing');
        audioSynth.playPopSound();

        setTimeout(() => {
          // Retract claw
          if (clawRope) clawRope.style.height = '35px';

          setTimeout(() => {
            if (clawHead) clawHead.classList.remove('grabbing');
            isClawDropping = false;

            // Reveal Prize
            const wonPrize = clawPrizes[Math.floor(Math.random() * clawPrizes.length)];
            if (clawPrizeText) clawPrizeText.textContent = wonPrize;
            if (clawRevealBanner) clawRevealBanner.classList.remove('hidden');

            audioSynth.playCelebrationFanfare();
            burstConfetti(window.innerWidth / 2, window.innerHeight * 0.6, 60);
            showToast(`Love Claw Won: ${wonPrize}! 🧸🎉`);
          }, 700);
        }, 500);
      }, 700);
    });
  }


  // --------------------------------------------------------------------------
  // 24. THE ENCHANTED ROYAL MIRROR OF AFFIRMATIONS
  // --------------------------------------------------------------------------
  const nishikaAffirmations = [
    "Nishika, you illuminate every room with your natural grace, kindness, and radiant beauty.",
    "Your smile is my favorite view in the universe, turning every ordinary moment into magic.",
    "Nishika, you are fiercely intelligent, deeply caring, and the sweetest soul I know.",
    "Being loved by you, Nishika, is the greatest blessing my heart has ever received.",
    "You inspire me every day with your gentle strength, warm laughter, and golden heart.",
    "Nishika, you are officially crowned the undisputed Love of my heart, today and forever! 👑"
  ];

  let currentAffirmationIdx = 0;
  const enchantedMirrorTrigger = document.getElementById('enchantedMirrorTrigger');
  const nextAffirmationBtn = document.getElementById('nextAffirmationBtn');
  const mirrorAffirmationText = document.getElementById('mirrorAffirmationText');
  const mirrorContent = document.getElementById('mirrorContent');

  function cycleNishikaAffirmation() {
    currentAffirmationIdx = (currentAffirmationIdx + 1) % nishikaAffirmations.length;
    if (mirrorContent) {
      mirrorContent.style.animation = 'none';
      void mirrorContent.offsetWidth;
      mirrorContent.style.animation = 'mirrorFade 0.6s ease forwards';
    }
    if (mirrorAffirmationText) {
      mirrorAffirmationText.textContent = `"${nishikaAffirmations[currentAffirmationIdx]}"`;
    }
    audioSynth.playMagicChime();
    burstConfetti(window.innerWidth / 2, window.innerHeight * 0.6, 35);
    showToast('The Enchanted Mirror reflects true love for Nishika! ✨💖');
  }

  if (enchantedMirrorTrigger) enchantedMirrorTrigger.addEventListener('click', cycleNishikaAffirmation);
  if (nextAffirmationBtn) nextAffirmationBtn.addEventListener('click', cycleNishikaAffirmation);

  // --------------------------------------------------------------------------
  // 25. COUPLE'S DATE NIGHT FORTUNE ROULETTE ENGINE
  // --------------------------------------------------------------------------
  const defaultDateIdeas = [
    { id: 'd1', title: 'Candlelight Rooftop Dinner', desc: 'A dreamy 3-course private dinner under the moonlit sky with soft violin melodies.', category: 'Intimate Romance', time: 'Tonight', vibe: 'Pure Romance' },
    { id: 'd2', title: 'Midnight Stargazing & Hot Cocoa', desc: 'Cozying under warm blankets, watching shooting stars and sharing infinite secrets.', category: 'Pure Romance', time: 'Midnight', vibe: 'Starlight Dream' },
    { id: 'd3', title: 'Cozy Blanket Fort Movie Marathon', desc: 'Building a giant living room fairy-lit fort with endless popcorn and cuddle breaks.', category: 'Cozy Stay-In', time: 'Anytime', vibe: 'Cozy Hugs' },
    { id: 'd4', title: 'Spontaneous Road Trip Adventure', desc: 'Packing a quick basket and driving towards the sunrise or a secluded scenic viewpoint.', category: 'Spontaneous Trip', time: 'Weekend', vibe: 'Adventurous' },
    { id: 'd5', title: 'Royal Pampering & Couples Spa', desc: 'A full evening of warm aromatic bubble bath, foot massage, and royal relaxation.', category: 'Royal Pampering', time: 'Evening', vibe: 'Luxury Pamper' },
    { id: 'd6', title: 'Sunset Beach Walk & Hand-in-Hand Chat', desc: 'Strolling barefoot in the gentle surf as the sky turns rose, gold, and amethyst.', category: 'Pure Romance', time: 'Golden Hour', vibe: 'Dreamy Vibe' },
    { id: 'd7', title: 'Cook My Love\'s Favorite Dish Together', desc: 'Cooking our favorite romantic pasta or dessert while slow dancing in the kitchen.', category: 'Sweet Fun', time: 'Dinner Time', vibe: 'Sweet Fun' },
    { id: 'd8', title: 'Slow Dance in the Dark with Fairy Lights', desc: 'Dimming all lights, turning on our acoustic playlist, and getting lost in each other\'s arms.', category: 'Intimate Romance', time: 'Late Night', vibe: 'Infinite Love' }
  ];

  function getAllDateIdeas() {
    return [...defaultDateIdeas, ...(state.customDateIdeas || [])];
  }

  const rouletteCanvas = document.getElementById('rouletteCanvas');
  const rouletteTicker = document.getElementById('rouletteTicker');
  const spinRouletteBtn = document.getElementById('spinRouletteBtn');
  const rouletteCenterHub = document.getElementById('rouletteCenterHub');
  const rouletteResultTitle = document.getElementById('rouletteResultTitle');
  const rouletteResultDesc = document.getElementById('rouletteResultDesc');
  const rouletteTimeTag = document.getElementById('rouletteTimeTag');
  const rouletteVibeTag = document.getElementById('rouletteVibeTag');
  const claimDateCouponBtn = document.getElementById('claimDateCouponBtn');
  const openAddDateModalBtn = document.getElementById('openAddDateModalBtn');
  const newDateIdeaModal = document.getElementById('newDateIdeaModal');
  const closeNewDateIdeaModalBtn = document.getElementById('closeNewDateIdeaModalBtn');
  const newDateIdeaForm = document.getElementById('newDateIdeaForm');
  const rouletteIdeasCloud = document.getElementById('rouletteIdeasCloud');
  const rouletteIdeaCount = document.getElementById('rouletteIdeaCount');

  let rouletteAngle = 0;
  let rouletteVelocity = 0;
  let isRouletteSpinning = false;
  let selectedDateIdea = null;
  let lastSectorCrossed = -1;

  const rouletteColors = [
    ['#9d4edd', '#7b2cbf'],
    ['#ff4081', '#f43f5e'],
    ['#ffd700', '#d97706'],
    ['#ec4899', '#be185d'],
    ['#8b5cf6', '#6d28d9'],
    ['#06b6d4', '#0891b2'],
    ['#f59e0b', '#b45309'],
    ['#10b981', '#047857'],
    ['#e11d48', '#9f1239'],
    ['#6366f1', '#4338ca']
  ];

  function drawRouletteWheel() {
    if (!rouletteCanvas) return;
    const ctx = rouletteCanvas.getContext('2d');
    const width = rouletteCanvas.width;
    const height = rouletteCanvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = width / 2 - 8;

    ctx.clearRect(0, 0, width, height);

    const ideas = getAllDateIdeas();
    const numSlices = ideas.length;
    const sliceAngle = (Math.PI * 2) / numSlices;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rouletteAngle);

    // Draw Slices
    for (let i = 0; i < numSlices; i++) {
      const startAngle = i * sliceAngle;
      const endAngle = (i + 1) * sliceAngle;
      const [col1, col2] = rouletteColors[i % rouletteColors.length];

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();

      const grad = ctx.createRadialGradient(0, 0, 30, 0, 0, radius);
      grad.addColorStop(0, col1);
      grad.addColorStop(1, col2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Golden Slice Border
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.6)';
      ctx.stroke();

      // Outer Edge Bead / Stud
      const midAngle = startAngle + sliceAngle / 2;
      const beadX = Math.cos(midAngle) * (radius - 12);
      const beadY = Math.sin(midAngle) * (radius - 12);
      ctx.beginPath();
      ctx.arc(beadX, beadY, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#ffd700';
      ctx.shadowColor = '#ffd700';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Slice Text
      ctx.save();
      ctx.rotate(midAngle);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px Outfit, sans-serif';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 4;

      const titleText = ideas[i].title.length > 20 ? ideas[i].title.substring(0, 18) + '…' : ideas[i].title;
      ctx.fillText(titleText, radius - 26, 5);
      ctx.restore();
    }

    ctx.restore();
  }

  function renderRouletteIdeasCloud() {
    if (!rouletteIdeasCloud) return;
    const ideas = getAllDateIdeas();
    if (rouletteIdeaCount) rouletteIdeaCount.textContent = ideas.length;

    rouletteIdeasCloud.innerHTML = ideas.map((idea, idx) => `
      <span class="idea-chip ${selectedDateIdea && selectedDateIdea.id === idea.id ? 'active-choice' : ''}" data-idea-idx="${idx}">
        ${idea.category.includes('Romance') ? '🌹' : idea.category.includes('Stay') ? '🛋️' : idea.category.includes('Trip') ? '🚗' : idea.category.includes('Pamper') ? '👑' : '🎡'} ${escapeHtml(idea.title)}
      </span>
    `).join('');
  }

  function spinRoulette() {
    if (isRouletteSpinning) return;
    isRouletteSpinning = true;
    if (claimDateCouponBtn) claimDateCouponBtn.disabled = true;

    // Start with powerful random angular velocity
    rouletteVelocity = 0.28 + Math.random() * 0.18;
    lastSectorCrossed = -1;

    if (audioSynth && audioSynth.playSparkleChime) {
      audioSynth.playSparkleChime();
    }

    function animateSpin() {
      rouletteAngle += rouletteVelocity;
      rouletteVelocity *= 0.984; // Smooth deceleration friction

      // Check current sector at top needle (Top needle is at -Math.PI / 2)
      const ideas = getAllDateIdeas();
      const numSlices = ideas.length;
      const sliceAngle = (Math.PI * 2) / numSlices;
      
      const normalizedAngle = (2 * Math.PI - (rouletteAngle % (2 * Math.PI))) % (2 * Math.PI);
      const topPointerAngle = (normalizedAngle + Math.PI * 1.5) % (2 * Math.PI);
      const currentSector = Math.floor(topPointerAngle / sliceAngle);

      if (currentSector !== lastSectorCrossed) {
        lastSectorCrossed = currentSector;
        if (rouletteTicker) {
          rouletteTicker.classList.add('tick-bounce');
          setTimeout(() => rouletteTicker.classList.remove('tick-bounce'), 60);
        }
        if (audioSynth && audioSynth.playPopSound && rouletteVelocity > 0.03) {
          audioSynth.playPopSound();
        }
      }

      drawRouletteWheel();

      if (rouletteVelocity > 0.002) {
        requestAnimationFrame(animateSpin);
      } else {
        isRouletteSpinning = false;
        selectedDateIdea = ideas[currentSector];
        displayRouletteResult(selectedDateIdea);
      }
    }

    requestAnimationFrame(animateSpin);
  }

  function displayRouletteResult(idea) {
    if (!idea) return;
    if (rouletteResultTitle) rouletteResultTitle.textContent = `${idea.title} ✨`;
    if (rouletteResultDesc) rouletteResultDesc.textContent = `"${idea.desc}"`;
    if (rouletteTimeTag) rouletteTimeTag.textContent = idea.time || 'Tonight';
    if (rouletteVibeTag) rouletteVibeTag.textContent = idea.vibe || idea.category;
    if (claimDateCouponBtn) claimDateCouponBtn.disabled = false;

    renderRouletteIdeasCloud();
    audioSynth.playCelebrationFanfare();
    burstConfetti(window.innerWidth / 2, window.innerHeight * 0.6, 50);
    showToast(`Tonight's Royal Date: ${idea.title}! 🎡💕`);
  }

  if (spinRouletteBtn) spinRouletteBtn.addEventListener('click', spinRoulette);
  if (rouletteCenterHub) rouletteCenterHub.addEventListener('click', spinRoulette);

  if (claimDateCouponBtn) {
    claimDateCouponBtn.addEventListener('click', () => {
      if (!selectedDateIdea) return;
      const couponId = 'custom_date_' + Date.now();
      if (!state.claimedCoupons.includes(couponId)) {
        state.claimedCoupons.push(couponId);
        saveState();
      }
      claimDateCouponBtn.disabled = true;
      audioSynth.playMagicChime();
      burstConfetti(window.innerWidth / 2, window.innerHeight * 0.5, 45);
      showToast(`🎟️ "${selectedDateIdea.title}" claimed as a VIP Love Coupon!`);
    });
  }

  if (openAddDateModalBtn) openAddDateModalBtn.addEventListener('click', () => openModal(newDateIdeaModal));
  if (closeNewDateIdeaModalBtn) closeNewDateIdeaModalBtn.addEventListener('click', () => closeModal(newDateIdeaModal));

  if (newDateIdeaForm) {
    newDateIdeaForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const titleInput = document.getElementById('dateIdeaTitleInput');
      const descInput = document.getElementById('dateIdeaDescInput');
      const catSelect = document.getElementById('dateIdeaCategorySelect');

      if (!titleInput || !descInput) return;
      const newIdea = {
        id: 'cdate_' + Date.now(),
        title: titleInput.value.trim(),
        desc: descInput.value.trim(),
        category: catSelect ? catSelect.value : 'Intimate Romance',
        time: 'Special Date',
        vibe: 'Handcrafted With Love'
      };

      state.customDateIdeas.push(newIdea);
      saveState();
      drawRouletteWheel();
      renderRouletteIdeasCloud();
      closeModal(newDateIdeaModal);
      newDateIdeaForm.reset();
      showToast(`Added "${newIdea.title}" to Royal Roulette! 🎡✨`);
      audioSynth.playSuccessBeep();
    });
  }

  drawRouletteWheel();
  renderRouletteIdeasCloud();

  // --------------------------------------------------------------------------
  // 26. COSMIC AMBIENT SOUNDSCAPE SANCTUARY ENGINE
  // --------------------------------------------------------------------------
  let soundscapeAudioCtx = null;
  let soundscapeMasterGain = null;
  let isSoundscapePlaying = false;
  let soundscapeTimerInterval = null;
  let soundscapeTimerSeconds = 0;

  const trackNodes = {
    rain: { gain: null, source: null, filter: null },
    fire: { gain: null, source: null, filter: null },
    ocean: { gain: null, source: null, filter: null, lfo: null },
    chimes: { gain: null, timer: null },
    piano: { gain: null, timer: null },
    cafe: { gain: null, source: null, filter: null }
  };

  const soundscapeMasterToggle = document.getElementById('soundscapeMasterToggle');
  const soundscapePlayIcon = document.getElementById('soundscapePlayIcon');
  const soundscapeMasterLabel = document.getElementById('soundscapeMasterLabel');
  const soundscapeMasterVol = document.getElementById('soundscapeMasterVol');
  const soundscapeMasterPercent = document.getElementById('soundscapeMasterPercent');
  const soundscapeTimerSelect = document.getElementById('soundscapeTimerSelect');
  const soundscapeTimerBadge = document.getElementById('soundscapeTimerBadge');
  const soundscapeTimerCountdown = document.getElementById('soundscapeTimerCountdown');

  function initSoundscapeAudio() {
    if (soundscapeAudioCtx) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      soundscapeAudioCtx = new AudioContext();
      soundscapeMasterGain = soundscapeAudioCtx.createGain();
      soundscapeMasterGain.gain.setValueAtTime((state.soundscapeVolumes.master || 80) / 100, soundscapeAudioCtx.currentTime);
      soundscapeMasterGain.connect(soundscapeAudioCtx.destination);
    } catch (e) {
      console.warn('Web Audio API not supported for soundscape', e);
    }
  }

  // 1. Rain Generator (Pink Noise + Bandpass Filter)
  function startRainSound() {
    if (!soundscapeAudioCtx || trackNodes.rain.source) return;
    const bufferSize = soundscapeAudioCtx.sampleRate * 2;
    const noiseBuffer = soundscapeAudioCtx.createBuffer(1, bufferSize, soundscapeAudioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
      b6 = white * 0.115926;
    }

    const whiteNoise = soundscapeAudioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = soundscapeAudioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(850, soundscapeAudioCtx.currentTime);
    filter.Q.setValueAtTime(1.1, soundscapeAudioCtx.currentTime);

    const gain = soundscapeAudioCtx.createGain();
    gain.gain.setValueAtTime((state.soundscapeVolumes.rain || 70) / 100 * 0.4, soundscapeAudioCtx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(soundscapeMasterGain);
    whiteNoise.start();

    trackNodes.rain = { source: whiteNoise, filter, gain };
  }

  // 2. Fireplace Generator (Brownian Noise + Random Bursts)
  function startFireSound() {
    if (!soundscapeAudioCtx || trackNodes.fire.source) return;
    const bufferSize = soundscapeAudioCtx.sampleRate * 2;
    const noiseBuffer = soundscapeAudioCtx.createBuffer(1, bufferSize, soundscapeAudioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      if (Math.random() < 0.002) output[i] += (Math.random() * 2 - 1) * 0.45;
      output[i] *= 0.6;
    }

    const brownNoise = soundscapeAudioCtx.createBufferSource();
    brownNoise.buffer = noiseBuffer;
    brownNoise.loop = true;

    const filter = soundscapeAudioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(500, soundscapeAudioCtx.currentTime);

    const gain = soundscapeAudioCtx.createGain();
    gain.gain.setValueAtTime((state.soundscapeVolumes.fire || 45) / 100 * 0.5, soundscapeAudioCtx.currentTime);

    brownNoise.connect(filter);
    filter.connect(gain);
    gain.connect(soundscapeMasterGain);
    brownNoise.start();

    trackNodes.fire = { source: brownNoise, filter, gain };
  }

  // 3. Ocean Waves Generator (Modulated Noise Swells)
  function startOceanSound() {
    if (!soundscapeAudioCtx || trackNodes.ocean.source) return;
    const bufferSize = soundscapeAudioCtx.sampleRate * 2;
    const noiseBuffer = soundscapeAudioCtx.createBuffer(1, bufferSize, soundscapeAudioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.998 * b0 + white * 0.055;
      b1 = 0.993 * b1 + white * 0.075;
      b2 = 0.969 * b2 + white * 0.153;
      output[i] = (b0 + b1 + b2) * 0.12;
    }

    const oceanNoise = soundscapeAudioCtx.createBufferSource();
    oceanNoise.buffer = noiseBuffer;
    oceanNoise.loop = true;

    const filter = soundscapeAudioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, soundscapeAudioCtx.currentTime);

    const lfo = soundscapeAudioCtx.createOscillator();
    lfo.frequency.setValueAtTime(0.08, soundscapeAudioCtx.currentTime); // Wave swell period ~12.5s
    const lfoGain = soundscapeAudioCtx.createGain();
    lfoGain.gain.setValueAtTime(320, soundscapeAudioCtx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    const gain = soundscapeAudioCtx.createGain();
    gain.gain.setValueAtTime((state.soundscapeVolumes.ocean || 0) / 100 * 0.45, soundscapeAudioCtx.currentTime);

    oceanNoise.connect(filter);
    filter.connect(gain);
    gain.connect(soundscapeMasterGain);
    oceanNoise.start();

    trackNodes.ocean = { source: oceanNoise, filter, lfo, gain };
  }

  // 4. Starlight Chimes Generator (Pentatonic Overtones)
  function startChimesSound() {
    if (!soundscapeAudioCtx || trackNodes.chimes.gain) return;
    const chimesGain = soundscapeAudioCtx.createGain();
    chimesGain.gain.setValueAtTime((state.soundscapeVolumes.chimes || 60) / 100 * 0.35, soundscapeAudioCtx.currentTime);
    chimesGain.connect(soundscapeMasterGain);

    const chimeNotes = [659.25, 783.99, 987.77, 1318.51, 1567.98, 1975.53];
    const chimeTimer = setInterval(() => {
      if (!isSoundscapePlaying || !soundscapeAudioCtx) return;
      if (Math.random() < 0.65) {
        const osc = soundscapeAudioCtx.createOscillator();
        const noteGain = soundscapeAudioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(chimeNotes[Math.floor(Math.random() * chimeNotes.length)], soundscapeAudioCtx.currentTime);

        const now = soundscapeAudioCtx.currentTime;
        noteGain.gain.setValueAtTime(0.001, now);
        noteGain.gain.exponentialRampToValueAtTime(0.25, now + 0.05);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

        osc.connect(noteGain);
        noteGain.connect(chimesGain);
        osc.start(now);
        osc.stop(now + 2.6);
      }
    }, 1800);

    trackNodes.chimes = { gain: chimesGain, timer: chimeTimer };
  }

  // 5. Dreamy Lo-Fi Piano Harmony Generator
  function startPianoPadSound() {
    if (!soundscapeAudioCtx || trackNodes.piano.gain) return;
    const pianoGain = soundscapeAudioCtx.createGain();
    pianoGain.gain.setValueAtTime((state.soundscapeVolumes.piano || 50) / 100 * 0.3, soundscapeAudioCtx.currentTime);
    pianoGain.connect(soundscapeMasterGain);

    const chords = [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7
      [220.00, 261.63, 329.63, 392.00], // Am7
      [174.61, 220.00, 261.63, 329.63], // Fmaj7
      [196.00, 246.94, 293.66, 392.00]  // G
    ];
    let chordIdx = 0;

    const pianoTimer = setInterval(() => {
      if (!isSoundscapePlaying || !soundscapeAudioCtx) return;
      const currentChord = chords[chordIdx % chords.length];
      chordIdx++;

      currentChord.forEach((freq) => {
        const osc = soundscapeAudioCtx.createOscillator();
        const noteGain = soundscapeAudioCtx.createGain();
        const filter = soundscapeAudioCtx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, soundscapeAudioCtx.currentTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(900, soundscapeAudioCtx.currentTime);

        const now = soundscapeAudioCtx.currentTime;
        noteGain.gain.setValueAtTime(0.001, now);
        noteGain.gain.linearRampToValueAtTime(0.12, now + 1.2);
        noteGain.gain.linearRampToValueAtTime(0.001, now + 4.8);

        osc.connect(filter);
        filter.connect(noteGain);
        noteGain.connect(pianoGain);
        osc.start(now);
        osc.stop(now + 5.0);
      });
    }, 4500);

    trackNodes.piano = { gain: pianoGain, timer: pianoTimer };
  }

  // 6. Parisian Café Resonance Generator
  function startCafeSound() {
    if (!soundscapeAudioCtx || trackNodes.cafe.source) return;
    const bufferSize = soundscapeAudioCtx.sampleRate * 2;
    const noiseBuffer = soundscapeAudioCtx.createBuffer(1, bufferSize, soundscapeAudioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.04;
    }

    const cafeNoise = soundscapeAudioCtx.createBufferSource();
    cafeNoise.buffer = noiseBuffer;
    cafeNoise.loop = true;

    const filter = soundscapeAudioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(420, soundscapeAudioCtx.currentTime);
    filter.Q.setValueAtTime(1.5, soundscapeAudioCtx.currentTime);

    const gain = soundscapeAudioCtx.createGain();
    gain.gain.setValueAtTime((state.soundscapeVolumes.cafe || 0) / 100 * 0.35, soundscapeAudioCtx.currentTime);

    cafeNoise.connect(filter);
    filter.connect(gain);
    gain.connect(soundscapeMasterGain);
    cafeNoise.start();

    trackNodes.cafe = { source: cafeNoise, filter, gain };
  }

  function startAllSoundscapeTracks() {
    initSoundscapeAudio();
    if (soundscapeAudioCtx && soundscapeAudioCtx.state === 'suspended') {
      soundscapeAudioCtx.resume();
    }
    startRainSound();
    startFireSound();
    startOceanSound();
    startChimesSound();
    startPianoPadSound();
    startCafeSound();
    isSoundscapePlaying = true;
    updateSoundscapeUI();
  }

  function stopAllSoundscapeTracks() {
    Object.keys(trackNodes).forEach(key => {
      const node = trackNodes[key];
      if (node.source) {
        try { node.source.stop(); } catch (e) {}
        node.source = null;
      }
      if (node.lfo) {
        try { node.lfo.stop(); } catch (e) {}
        node.lfo = null;
      }
      if (node.timer) {
        clearInterval(node.timer);
        node.timer = null;
      }
      node.gain = null;
    });
    isSoundscapePlaying = false;
    updateSoundscapeUI();
  }

  function toggleSoundscape() {
    if (isSoundscapePlaying) {
      stopAllSoundscapeTracks();
      showToast('Soundscape Sanctuary paused 🌙');
    } else {
      startAllSoundscapeTracks();
      showToast('Playing Cosmic Soundscape Sanctuary 🌌✨');
    }
  }

  function updateSoundscapeUI() {
    if (soundscapePlayIcon) {
      soundscapePlayIcon.className = isSoundscapePlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play';
    }
    if (soundscapeMasterLabel) {
      soundscapeMasterLabel.textContent = isSoundscapePlaying ? 'Pause Soundscape' : 'Play Soundscape';
    }

    // Animate visualizer meters
    ['Rain', 'Fire', 'Ocean', 'Chimes', 'Piano', 'Cafe'].forEach(track => {
      const meter = document.getElementById(`meter${track}`);
      const vol = state.soundscapeVolumes[track.toLowerCase()] || 0;
      if (meter) {
        meter.style.width = isSoundscapePlaying && vol > 0 ? `${vol}%` : '0%';
      }
    });
  }

  if (soundscapeMasterToggle) soundscapeMasterToggle.addEventListener('click', toggleSoundscape);

  if (soundscapeMasterVol) {
    soundscapeMasterVol.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      state.soundscapeVolumes.master = val;
      if (soundscapeMasterPercent) soundscapeMasterPercent.textContent = `${val}%`;
      if (soundscapeMasterGain && soundscapeAudioCtx) {
        soundscapeMasterGain.gain.setValueAtTime(val / 100, soundscapeAudioCtx.currentTime);
      }
      saveState();
    });
  }

  // Setup individual track volume sliders
  const soundTrackConfigs = [
    { key: 'rain', slider: 'volRain', label: 'labelVolRain', scale: 0.4 },
    { key: 'fire', slider: 'volFire', label: 'labelVolFire', scale: 0.5 },
    { key: 'ocean', slider: 'volOcean', label: 'labelVolOcean', scale: 0.45 },
    { key: 'chimes', slider: 'volChimes', label: 'labelVolChimes', scale: 0.35 },
    { key: 'piano', slider: 'volPiano', label: 'labelVolPiano', scale: 0.3 },
    { key: 'cafe', slider: 'volCafe', label: 'labelVolCafe', scale: 0.35 }
  ];

  soundTrackConfigs.forEach(({ key, slider, label, scale }) => {
    const sliderEl = document.getElementById(slider);
    const labelEl = document.getElementById(label);
    if (sliderEl) {
      sliderEl.value = state.soundscapeVolumes[key] !== undefined ? state.soundscapeVolumes[key] : 50;
      if (labelEl) labelEl.textContent = `${sliderEl.value}%`;

      sliderEl.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        state.soundscapeVolumes[key] = val;
        if (labelEl) labelEl.textContent = `${val}%`;
        if (trackNodes[key].gain && soundscapeAudioCtx) {
          trackNodes[key].gain.gain.setValueAtTime((val / 100) * scale, soundscapeAudioCtx.currentTime);
        }
        updateSoundscapeUI();
        saveState();
      });
    }
  });

  // Track Mute Buttons
  document.querySelectorAll('.track-mute-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const track = btn.getAttribute('data-track');
      if (!track) return;
      const isMuted = btn.classList.toggle('muted');
      const icon = btn.querySelector('i');
      if (icon) icon.className = isMuted ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-high';

      const sliderEl = document.getElementById(`vol${track.charAt(0).toUpperCase() + track.slice(1)}`);
      const targetVol = isMuted ? 0 : (state.soundscapeVolumes[track] || 50);
      const scale = soundTrackConfigs.find(c => c.key === track)?.scale || 0.4;

      if (trackNodes[track].gain && soundscapeAudioCtx) {
        trackNodes[track].gain.gain.setValueAtTime((targetVol / 100) * scale, soundscapeAudioCtx.currentTime);
      }
    });
  });

  // Soundscape Mood Presets
  const soundscapePresets = {
    midnight: { rain: 20, fire: 30, ocean: 0, chimes: 80, piano: 65, cafe: 0 },
    rainy: { rain: 90, fire: 60, ocean: 0, chimes: 20, piano: 40, cafe: 0 },
    fireside: { rain: 30, fire: 85, ocean: 0, chimes: 35, piano: 55, cafe: 0 },
    ocean: { rain: 10, fire: 0, ocean: 85, chimes: 70, piano: 45, cafe: 0 },
    cafe: { rain: 45, fire: 20, ocean: 0, chimes: 30, piano: 70, cafe: 80 },
    zen: { rain: 35, fire: 15, ocean: 50, chimes: 80, piano: 60, cafe: 0 }
  };

  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const presetKey = btn.getAttribute('data-preset');
      const preset = soundscapePresets[presetKey];
      if (!preset) return;

      Object.keys(preset).forEach(track => {
        state.soundscapeVolumes[track] = preset[track];
        const sliderEl = document.getElementById(`vol${track.charAt(0).toUpperCase() + track.slice(1)}`);
        const labelEl = document.getElementById(`labelVol${track.charAt(0).toUpperCase() + track.slice(1)}`);
        if (sliderEl) sliderEl.value = preset[track];
        if (labelEl) labelEl.textContent = `${preset[track]}%`;

        const scale = soundTrackConfigs.find(c => c.key === track)?.scale || 0.4;
        if (trackNodes[track].gain && soundscapeAudioCtx) {
          trackNodes[track].gain.gain.setValueAtTime((preset[track] / 100) * scale, soundscapeAudioCtx.currentTime);
        }
      });

      if (!isSoundscapePlaying) {
        startAllSoundscapeTracks();
      } else {
        updateSoundscapeUI();
      }
      saveState();
      showToast(`Mood Preset: ${btn.textContent.trim()} activated ✨`);
    });
  });

  // Soundscape Sleep Timer
  if (soundscapeTimerSelect) {
    soundscapeTimerSelect.addEventListener('change', (e) => {
      const minutes = parseInt(e.target.value, 10);
      if (soundscapeTimerInterval) clearInterval(soundscapeTimerInterval);

      if (minutes > 0) {
        soundscapeTimerSeconds = minutes * 60;
        if (soundscapeTimerBadge) soundscapeTimerBadge.classList.remove('hidden');
        if (!isSoundscapePlaying) startAllSoundscapeTracks();

        soundscapeTimerInterval = setInterval(() => {
          soundscapeTimerSeconds--;
          const m = Math.floor(soundscapeTimerSeconds / 60);
          const s = soundscapeTimerSeconds % 60;
          if (soundscapeTimerCountdown) {
            soundscapeTimerCountdown.textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
          }

          if (soundscapeTimerSeconds <= 0) {
            clearInterval(soundscapeTimerInterval);
            stopAllSoundscapeTracks();
            if (soundscapeTimerBadge) soundscapeTimerBadge.classList.add('hidden');
            soundscapeTimerSelect.value = '0';
            showToast('Sleep timer reached. Goodnight, My Love Nishika 🌙💤');
          }
        }, 1000);
      } else {
        if (soundscapeTimerBadge) soundscapeTimerBadge.classList.add('hidden');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 27. FUTURE LOVE TIME CAPSULE VAULT ENGINE
  // --------------------------------------------------------------------------
  const defaultTimeCapsules = [
    {
      id: 'cap_bday_2027',
      title: 'A Letter to My Love Nishika on September 20, 2027',
      unlockDate: '2027-09-20T00:00:00+05:30',
      tag: '👑 Next Royal Birthday',
      desc: 'Reflecting on one full year of magic since your royal coronation day. Sealed with eternal promises.',
      message: 'My dearest My Love Nishika,\n\nIf you are reading this today, another breathtaking year of your life has illuminated the cosmos. Over the past 365 days, my heart has loved you in ways I never thought possible. Every single sunrise with you feels like poetry. Thank you for your warmth, your radiant smile, and your gentle soul. Happy Birthday, my whole universe!\n\nWith all my love and devotion,\nForever Dilip 💖'
    },
    {
      id: 'cap_anniversary_2026',
      title: 'Our 1st Anniversary Golden Milestone',
      unlockDate: '2026-12-29T00:00:00+05:30',
      tag: '💖 Anniversary Celebration',
      desc: 'Looking back on our very first chapter of love hand in hand.',
      message: 'Happy 1st Anniversary, my love!\n\nOne full year of holding your hand, sharing whispers under the stars, laughing at our silly jokes, and falling deeper in love every second. Choosing you was the greatest decision of my life, and choosing you every single day is my highest joy.\n\nForever yours,\nDilip 💕'
    },
    {
      id: 'cap_valentine_2027',
      title: 'Valentine\'s Starlight Midnight Confession',
      unlockDate: '2027-02-14T00:00:00+05:30',
      tag: '🌹 Valentine\'s Day Special',
      desc: 'A secret Valentine message sealed across the universe for My Love Nishika.',
      message: 'To my forever Valentine, Nishika 🌹\n\nIn a galaxy of billions, my soul found its true north in you. You are my favorite thought in the morning and my sweetest dream at night. Happy Valentine\'s Day, my Love!\n\nLove always,\nDilip 💖'
    },
    {
      id: 'cap_newyear_2026',
      title: 'New Year\'s Eve Midnight Starlight Toast',
      unlockDate: '2026-12-31T23:59:59+05:30',
      tag: '✨ New Year Milestone',
      desc: 'A toast to crossing into a brand-new year together in infinite love.',
      message: 'Happy New Year, my beautiful Love! 🥂✨\n\nAs the clock strikes midnight, my only wish for this upcoming year is to make you smile every day, hold you close through every storm, and celebrate you endlessly.\n\nDevotedly yours,\nDilip 👑💖'
    }
  ];

  function getAllTimeCapsules() {
    return [...defaultTimeCapsules, ...(state.timeCapsules || [])];
  }

  const openSpotlightCapsuleBtn = document.getElementById('openSpotlightCapsuleBtn');
  const vipCapsuleBypassBtn = document.getElementById('vipCapsuleBypassBtn');
  const openCreateCapsuleBtn = document.getElementById('openCreateCapsuleBtn');
  const createCapsuleModal = document.getElementById('createCapsuleModal');
  const closeCreateCapsuleModalBtn = document.getElementById('closeCreateCapsuleModalBtn');
  const createCapsuleForm = document.getElementById('createCapsuleForm');
  const capsulesGrid = document.getElementById('capsulesGrid');
  const capsuleCountTotal = document.getElementById('capsuleCountTotal');
  const viewCapsuleModal = document.getElementById('viewCapsuleModal');
  const closeViewCapsuleModalBtn = document.getElementById('closeViewCapsuleModalBtn');
  const closeViewCapsuleBtn = document.getElementById('closeViewCapsuleBtn');
  const viewCapsuleVipBypassBtn = document.getElementById('viewCapsuleVipBypassBtn');

  let activeViewingCapsule = null;
  let currentCapsuleFilter = 'all';

  function updateCapsuleSpotlightCountdown() {
    const capsules = getAllTimeCapsules();
    const now = Date.now();
    const lockedCapsules = capsules.filter(c => new Date(c.unlockDate).getTime() > now)
                                   .sort((a, b) => new Date(a.unlockDate).getTime() - new Date(b.unlockDate).getTime());

    const spotlightCap = lockedCapsules.length > 0 ? lockedCapsules[0] : capsules[0];
    if (!spotlightCap) return;

    const spotlightTitle = document.getElementById('spotlightTitle');
    const spotlightDesc = document.getElementById('spotlightDesc');
    const spotlightTag = document.getElementById('spotlightTag');
    if (spotlightTitle) spotlightTitle.textContent = spotlightCap.title;
    if (spotlightDesc) spotlightDesc.textContent = `"${spotlightCap.desc || spotlightCap.title}"`;
    if (spotlightTag) spotlightTag.textContent = spotlightCap.tag || '👑 Time Capsule';

    const diff = new Date(spotlightCap.unlockDate).getTime() - now;
    const capDays = document.getElementById('capDays');
    const capHours = document.getElementById('capHours');
    const capMins = document.getElementById('capMins');
    const capSecs = document.getElementById('capSecs');

    if (diff > 0) {
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);

      if (capDays) capDays.textContent = d.toString().padStart(2, '0');
      if (capHours) capHours.textContent = h.toString().padStart(2, '0');
      if (capMins) capMins.textContent = m.toString().padStart(2, '0');
      if (capSecs) capSecs.textContent = s.toString().padStart(2, '0');
    } else {
      if (capDays) capDays.textContent = '00';
      if (capHours) capHours.textContent = '00';
      if (capMins) capMins.textContent = '00';
      if (capSecs) capSecs.textContent = '00';
    }
  }

  function renderTimeCapsulesGrid() {
    if (!capsulesGrid) return;
    const capsules = getAllTimeCapsules();
    if (capsuleCountTotal) capsuleCountTotal.textContent = capsules.length;
    const now = Date.now();

    const filtered = capsules.filter(c => {
      const isLocked = new Date(c.unlockDate).getTime() > now;
      if (currentCapsuleFilter === 'locked') return isLocked;
      if (currentCapsuleFilter === 'unlocked') return !isLocked;
      return true;
    });

    capsulesGrid.innerHTML = filtered.map(cap => {
      const unlockTime = new Date(cap.unlockDate).getTime();
      const isLocked = unlockTime > now;
      const formattedDate = new Date(cap.unlockDate).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
      });

      return `
        <div class="capsule-card-item ${!isLocked ? 'unlocked-state' : ''}">
          <div class="capsule-item-top">
            <span class="capsule-tag-badge">${escapeHtml(cap.tag || '💌 Milestone')}</span>
            <span class="capsule-unlock-status">
              ${isLocked ? '<i class="fa-solid fa-lock"></i> Locked' : '<i class="fa-solid fa-lock-open"></i> Unlocked'}
            </span>
          </div>
          <h4 class="capsule-item-title">${escapeHtml(cap.title)}</h4>
          <p class="capsule-item-preview">${isLocked ? 'Encrypted secret letter locked until ' + formattedDate : 'Unsealed love letter ready to be read 💕'}</p>
          <div class="capsule-item-footer">
            <span class="capsule-date-stamped"><i class="fa-solid fa-calendar"></i> ${formattedDate}</span>
            <button type="button" class="btn-primary view-cap-btn" data-cap-id="${cap.id}">
              <i class="fa-solid ${isLocked ? 'fa-key' : 'fa-envelope-open'}"></i> ${isLocked ? 'View Vault' : 'Read Letter'}
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Attach click handlers
    capsulesGrid.querySelectorAll('.view-cap-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const capId = btn.getAttribute('data-cap-id');
        const cap = capsules.find(c => c.id === capId);
        if (cap) openViewCapsuleModal(cap);
      });
    });
  }

  function openViewCapsuleModal(cap, bypassLock = false) {
    if (!cap) return;
    activeViewingCapsule = cap;

    const viewCapsuleTag = document.getElementById('viewCapsuleTag');
    const viewCapsuleTitle = document.getElementById('viewCapsuleTitle');
    const viewCapsuleStatus = document.getElementById('viewCapsuleStatus');
    const viewCapsuleCurtain = document.getElementById('viewCapsuleCurtain');
    const viewCapsuleLetterContent = document.getElementById('viewCapsuleLetterContent');
    const viewCapsuleMessageText = document.getElementById('viewCapsuleMessageText');
    const viewCapsuleSignature = document.getElementById('viewCapsuleSignature');
    const viewCapsuleTimestamp = document.getElementById('viewCapsuleTimestamp');

    const isUnlocked = new Date(cap.unlockDate).getTime() <= Date.now() || bypassLock;

    if (viewCapsuleTag) viewCapsuleTag.textContent = cap.tag || '👑 Time Capsule';
    if (viewCapsuleTitle) viewCapsuleTitle.textContent = cap.title;
    if (viewCapsuleStatus) {
      viewCapsuleStatus.innerHTML = isUnlocked
        ? '<i class="fa-solid fa-lock-open" style="color:#22c55e;"></i> Unlocked & Consecrated'
        : `<i class="fa-solid fa-lock"></i> Locked until ${new Date(cap.unlockDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
    }

    if (isUnlocked) {
      if (viewCapsuleCurtain) viewCapsuleCurtain.classList.add('hidden');
      if (viewCapsuleLetterContent) viewCapsuleLetterContent.classList.remove('hidden');
      if (viewCapsuleMessageText) viewCapsuleMessageText.innerHTML = escapeHtml(cap.message).replace(/\n/g, '<br>');
      if (viewCapsuleSignature) viewCapsuleSignature.textContent = `Forever ${state.senderName} 💖`;
      if (viewCapsuleTimestamp) viewCapsuleTimestamp.textContent = `Sealed for My Love ${state.recipientName} • Consecrated with Eternal Love`;
      audioSynth.playCelebrationFanfare();
    } else {
      if (viewCapsuleCurtain) viewCapsuleCurtain.classList.remove('hidden');
      if (viewCapsuleLetterContent) viewCapsuleLetterContent.classList.add('hidden');
      audioSynth.playPopSound();
    }

    openModal(viewCapsuleModal);
  }

  if (openSpotlightCapsuleBtn) {
    openSpotlightCapsuleBtn.addEventListener('click', () => {
      const capsules = getAllTimeCapsules();
      const now = Date.now();
      const lockedCapsules = capsules.filter(c => new Date(c.unlockDate).getTime() > now)
                                     .sort((a, b) => new Date(a.unlockDate).getTime() - new Date(b.unlockDate).getTime());
      openViewCapsuleModal(lockedCapsules[0] || capsules[0]);
    });
  }

  if (vipCapsuleBypassBtn) {
    vipCapsuleBypassBtn.addEventListener('click', () => {
      const capsules = getAllTimeCapsules();
      openViewCapsuleModal(capsules[0], true);
      showToast('My Love Nishika Heart Key VIP Bypass Unlocked! 👑✨');
    });
  }

  if (viewCapsuleVipBypassBtn) {
    viewCapsuleVipBypassBtn.addEventListener('click', () => {
      if (activeViewingCapsule) {
        openViewCapsuleModal(activeViewingCapsule, true);
        showToast('VIP Master Heart Key: Letter Unsealed! 💌💖');
      }
    });
  }

  if (openCreateCapsuleBtn) openCreateCapsuleBtn.addEventListener('click', () => openModal(createCapsuleModal));
  if (closeCreateCapsuleModalBtn) closeCreateCapsuleModalBtn.addEventListener('click', () => closeModal(createCapsuleModal));
  if (closeViewCapsuleModalBtn) closeViewCapsuleModalBtn.addEventListener('click', () => closeModal(viewCapsuleModal));
  if (closeViewCapsuleBtn) closeViewCapsuleBtn.addEventListener('click', () => closeModal(viewCapsuleModal));

  // Capsule Filter Chips
  document.querySelectorAll('[data-capsule-filter]').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('[data-capsule-filter]').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentCapsuleFilter = chip.getAttribute('data-capsule-filter');
      renderTimeCapsulesGrid();
    });
  });

  if (createCapsuleForm) {
    createCapsuleForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const titleInput = document.getElementById('capsuleTitleInput');
      const dateInput = document.getElementById('capsuleUnlockDateInput');
      const tagSelect = document.getElementById('capsuleTagSelect');
      const msgInput = document.getElementById('capsuleMessageInput');

      if (!titleInput || !dateInput || !msgInput) return;
      const newCap = {
        id: 'cap_custom_' + Date.now(),
        title: titleInput.value.trim(),
        unlockDate: new Date(dateInput.value).toISOString(),
        tag: tagSelect ? tagSelect.value : '💌 Eternal Love Secret',
        desc: 'Custom love capsule sealed in the cosmic vault.',
        message: msgInput.value.trim()
      };

      state.timeCapsules.push(newCap);
      saveState();
      renderTimeCapsulesGrid();
      updateCapsuleSpotlightCountdown();
      closeModal(createCapsuleModal);
      createCapsuleForm.reset();
      showToast(`Encrypted & sealed "${newCap.title}" in the vault! ⏳✨`);
      audioSynth.playMagicChime();
      burstConfetti(window.innerWidth / 2, window.innerHeight * 0.5, 40);
    });
  }

  setInterval(updateCapsuleSpotlightCountdown, 1000);
  updateCapsuleSpotlightCountdown();
  renderTimeCapsulesGrid();

  // --------------------------------------------------------------------------
  // 28. OUR COSMIC JOURNEY & MILESTONES MAP ENGINE
  // --------------------------------------------------------------------------
  const defaultJourneyMilestones = [
    {
      id: 'm1',
      title: 'Genesis: Where Our Universe Began',
      date: '2025-12-29',
      category: 'genesis',
      location: 'The First Spark',
      desc: 'The exact celestial moment our paths converged and two souls recognized each other across space and time.'
    },
    {
      id: 'm2',
      title: 'Our First Magical Date',
      date: '2026-01-14',
      category: 'romance',
      location: 'Moonlit City Lights',
      desc: 'Endless conversations over warm coffee and gentle smiles that made the entire outside world fade away.'
    },
    {
      id: 'm3',
      title: 'Whispering Dreams Under The Stars',
      date: '2026-03-20',
      category: 'romance',
      location: 'Constellation Ridge',
      desc: 'Looking up at the night sky hand in hand and realizing our love is written across the stars.'
    },
    {
      id: 'm4',
      title: 'Unforgettable Road Trip Adventure',
      date: '2026-05-18',
      category: 'adventure',
      location: 'Golden Horizon Byway',
      desc: 'Singing our favorite songs at the top of our lungs with the warm breeze and golden sunset surrounding us.'
    },
    {
      id: 'm5',
      title: 'My Love Nishika\'s Royal Birthday Celebration',
      date: '2026-09-20',
      category: 'celebration',
      location: 'Eternal Love Grand Arena',
      desc: 'Today the whole universe celebrates the most precious, radiant, and adored Love of my heart! 👑✨'
    },
    {
      id: 'm6',
      title: 'Forever & Beyond: Our Horizon',
      date: '2027-12-29',
      category: 'future',
      location: 'Infinite Future Dreams',
      desc: 'A lifetime of adventures, cozy mornings, shared triumphs, and unconditional love awaiting us.'
    }
  ];

  function getAllJourneyPins() {
    return [...defaultJourneyMilestones, ...(state.customJourneyPins || [])];
  }

  const cosmicDistanceVal = document.getElementById('cosmicDistanceVal');
  const cosmicHeartbeatsVal = document.getElementById('cosmicHeartbeatsVal');
  const cosmicMilestonesCount = document.getElementById('cosmicMilestonesCount');
  const journeyNodesGrid = document.getElementById('journeyNodesGrid');
  const openAddJourneyPinBtn = document.getElementById('openAddJourneyPinBtn');
  const addJourneyPinModal = document.getElementById('addJourneyPinModal');
  const closeAddJourneyPinModalBtn = document.getElementById('closeAddJourneyPinModalBtn');
  const addJourneyPinForm = document.getElementById('addJourneyPinForm');

  function updateCosmicStats() {
    const start = new Date(state.startDate || '2025-12-29').getTime();
    const now = Date.now();
    const daysInLove = Math.max(1, Math.floor((now - start) / (1000 * 60 * 60 * 24)));

    // Earth orbital speed around sun is ~2.57 Million km per day!
    const kmTraveled = daysInLove * 2570000;
    // Average resting heart rate ~75 bpm
    const heartbeats = daysInLove * 24 * 60 * 75;

    if (cosmicDistanceVal) cosmicDistanceVal.textContent = kmTraveled.toLocaleString();
    if (cosmicHeartbeatsVal) cosmicHeartbeatsVal.textContent = heartbeats.toLocaleString();
    if (cosmicMilestonesCount) cosmicMilestonesCount.textContent = getAllJourneyPins().length;
  }

  function renderJourneyMap() {
    if (!journeyNodesGrid) return;
    const pins = getAllJourneyPins().sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    if (cosmicMilestonesCount) cosmicMilestonesCount.textContent = pins.length;

    journeyNodesGrid.innerHTML = pins.map((pin, idx) => {
      const pinDate = new Date(pin.date).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
      });

      return `
        <div class="journey-node-card">
          <div class="node-pin-badge">${idx + 1}</div>
          <span class="node-date"><i class="fa-solid fa-calendar-day"></i> ${pinDate}</span>
          <h4 class="node-title">${escapeHtml(pin.title)}</h4>
          <span class="node-location"><i class="fa-solid fa-location-dot"></i> ${escapeHtml(pin.location || 'Special Memory')}</span>
          <p class="node-desc">${escapeHtml(pin.desc)}</p>
        </div>
      `;
    }).join('');
  }

  if (openAddJourneyPinBtn) openAddJourneyPinBtn.addEventListener('click', () => openModal(addJourneyPinModal));
  if (closeAddJourneyPinModalBtn) closeAddJourneyPinModalBtn.addEventListener('click', () => closeModal(addJourneyPinModal));

  if (addJourneyPinForm) {
    addJourneyPinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const titleInput = document.getElementById('pinTitleInput');
      const dateInput = document.getElementById('pinDateInput');
      const catSelect = document.getElementById('pinCategorySelect');
      const locInput = document.getElementById('pinLocationInput');
      const descInput = document.getElementById('pinDescInput');

      if (!titleInput || !dateInput || !descInput) return;
      const newPin = {
        id: 'pin_' + Date.now(),
        title: titleInput.value.trim(),
        date: dateInput.value,
        category: catSelect ? catSelect.value : 'romance',
        location: locInput ? locInput.value.trim() : 'Our Cherished Place',
        desc: descInput.value.trim()
      };

      state.customJourneyPins.push(newPin);
      saveState();
      renderJourneyMap();
      updateCosmicStats();
      closeModal(addJourneyPinModal);
      addJourneyPinForm.reset();
      showToast(`Consecrated milestone "${newPin.title}" on Cosmic Map! 🗺️✨`);
      audioSynth.playCelebrationFanfare();
      burstConfetti(window.innerWidth / 2, window.innerHeight * 0.5, 45);
    });
  }

  updateCosmicStats();
  renderJourneyMap();
  setInterval(updateCosmicStats, 5000);

  // --------------------------------------------------------------------------
  // 29. KEYBOARD SHORTCUTS CHEAT SHEET MODAL & GLOBAL HOTKEYS
  // --------------------------------------------------------------------------
  const shortcutsBtn = document.getElementById('shortcutsBtn');
  const floatingShortcutsBtn = document.getElementById('floatingShortcutsBtn');
  const footerShortcutsBtn = document.getElementById('footerShortcutsBtn');
  const shortcutsModal = document.getElementById('shortcutsModal');
  const closeShortcutsModalBtn = document.getElementById('closeShortcutsModalBtn');
  const doneShortcutsBtn = document.getElementById('doneShortcutsBtn');

  function openShortcutsModal() {
    if (shortcutsModal) {
      openModal(shortcutsModal);
      if (typeof audioSynth !== 'undefined' && audioSynth.playPopSound) {
        audioSynth.playPopSound();
      }
    }
  }

  function closeShortcutsModal() {
    if (shortcutsModal) closeModal(shortcutsModal);
  }

  if (shortcutsBtn) shortcutsBtn.addEventListener('click', openShortcutsModal);
  if (floatingShortcutsBtn) floatingShortcutsBtn.addEventListener('click', openShortcutsModal);
  if (footerShortcutsBtn) footerShortcutsBtn.addEventListener('click', openShortcutsModal);
  if (closeShortcutsModalBtn) closeShortcutsModalBtn.addEventListener('click', closeShortcutsModal);
  if (doneShortcutsBtn) doneShortcutsBtn.addEventListener('click', closeShortcutsModal);

  // Universal Global Keyboard Shortcuts Dispatcher
  window.addEventListener('keydown', (e) => {
    // If Passcode Overlay is active, route keystrokes directly to passcode handler
    if (pagePasscodeOverlay && pagePasscodeOverlay.style.display !== 'none' && !pagePasscodeOverlay.classList.contains('unlocked')) {
      let digit = null;
      if (/^[0-9]$/.test(e.key)) {
        digit = e.key;
      } else if (e.code) {
        const m = e.code.match(/^(Digit|Numpad)([0-9])$/);
        if (m) digit = m[2];
      }

      if (digit !== null && pagePasscodeInput) {
        if (document.activeElement !== pagePasscodeInput) {
          e.preventDefault();
          if (pagePasscodeInput.dataset.hasError === 'true' || pagePasscodeInput.value.length >= 8) {
            pagePasscodeInput.value = '';
            resetPagePasscodeError();
          }
          if (pagePasscodeInput.value.length < 8) {
            pagePasscodeInput.value += digit;
            updatePasscodeDots(pagePasscodeInput.value);
            highlightPageKeypadBtn(digit);
            if (audioSynth && audioSynth.playChime) audioSynth.playChime(523.25 + (pagePasscodeInput.value.length * 35), 0.1);
            if (isPasscodeMatch(pagePasscodeInput.value) || pagePasscodeInput.value.length === 8) {
              verifyPagePasscode();
            }
          }
          pagePasscodeInput.focus();
          return;
        }
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        verifyPagePasscode();
        return;
      }

      if (document.activeElement !== pagePasscodeInput) {
        if (e.key === 'Backspace' || e.key === 'Delete') {
          e.preventDefault();
          if (pagePasscodeInput) {
            if (pagePasscodeInput.dataset.hasError === 'true') resetPagePasscodeError();
            pagePasscodeInput.value = pagePasscodeInput.value.slice(0, -1);
            updatePasscodeDots(pagePasscodeInput.value);
            highlightPageKeypadBtn('BACK');
          }
          return;
        }
        if (e.key.toLowerCase() === 'c' && !e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          if (pagePasscodeInput) {
            pagePasscodeInput.value = '';
            resetPagePasscodeError();
            updatePasscodeDots('');
            highlightPageKeypadBtn('C');
          }
          return;
        }
      }
    }

    // If Surprise Gift Box Intro Overlay is active, Space or Enter triggers unboxing
    if (introOverlay && introOverlay.style.display !== 'none' && !introOverlay.classList.contains('fade-out')) {
      if (e.key === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        handleGiftBoxClick(e);
        return;
      }
    }

    // Escape closes all open modals
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.active').forEach(m => closeModal(m));
      return;
    }

    // Ignore keystrokes when typing inside inputs / textareas / selects
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    const key = e.key.toLowerCase();

    // 1. Shortcuts Modal Toggle (? or H)
    if (e.key === '?' || key === 'h') {
      e.preventDefault();
      if (shortcutsModal) {
        if (shortcutsModal.classList.contains('active')) closeModal(shortcutsModal);
        else openModal(shortcutsModal);
      }
      return;
    }

    // 2. Space: Toggle Background Melody / Active Media
    if (e.code === 'Space') {
      e.preventDefault();
      if (cakeCuttingCinema && cakeCuttingCinema.style.display !== 'none') {
        if (playCakeCutBtn) playCakeCutBtn.click();
      } else {
        if (musicToggleBtn) musicToggleBtn.click();
      }
      return;
    }

    // 3. M: Toggle Mute / Melody Playback
    if (key === 'm') {
      if (musicToggleBtn) musicToggleBtn.click();
      return;
    }

    // 4. C: Open Cake Cutting Video Cinema & Scroll
    if (key === 'c' && (!guitarView || !guitarView.classList.contains('active'))) {
      if (openCakeCutVideoBtn) openCakeCutVideoBtn.click();
      return;
    }

    // 5. B: Blow Out / Relight Birthday Candles
    if (key === 'b' && (!guitarView || !guitarView.classList.contains('active'))) {
      if (blowCandlesBtn && blowCandlesBtn.style.display !== 'none') blowCandlesBtn.click();
      else if (relightCandlesBtn && relightCandlesBtn.style.display !== 'none') relightCandlesBtn.click();
      return;
    }

    // 6. V: Open Secret Wish Capsule Vault
    if (key === 'v' && (!guitarView || !guitarView.classList.contains('active'))) {
      if (openWishVaultBtn) openWishVaultBtn.click();
      return;
    }

    // 7. L: Blast Confetti & Love Shower
    if (key === 'l') {
      if (confettiCannonBtn) confettiCannonBtn.click();
      return;
    }

    // 8. P: Scroll to Polaroid Memories Gallery
    if (key === 'p' && (!pianoView || !pianoView.classList.contains('active'))) {
      const memSec = document.getElementById('memoriesSec');
      if (memSec) memSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    // 9. K / N: Enchanted Mirror Royal Affirmation
    if (key === 'k' || key === 'n') {
      cycleNishikaAffirmation();
      return;
    }

    // 10. R: Spin Date Night Fortune Roulette Wheel
    if (key === 'r') {
      const rSec = document.getElementById('rouletteSec');
      if (rSec) rSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      spinRoulette();
      return;
    }

    // 11. S: Toggle / Cycle Ambient Soundscape Sanctuary
    if (key === 's' && (!guitarView || !guitarView.classList.contains('active'))) {
      const sSec = document.getElementById('soundscapeSec');
      if (sSec) sSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      toggleSoundscape();
      return;
    }

    // 12. O: Open Future Love Time Capsule Vault
    if (key === 'o') {
      const capSec = document.getElementById('capsuleSec');
      if (capSec) capSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (openSpotlightCapsuleBtn) openSpotlightCapsuleBtn.click();
      return;
    }

    // 13. J: Jump to Cosmic Journey & Milestones Map
    if (key === 'j') {
      const jSec = document.getElementById('journeySec');
      if (jSec) jSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      showToast('Viewing Our Cosmic Journey Map 🗺️✨');
      return;
    }

    // 14. T: Toggle Soft Candlelight Ambiance
    if (key === 't' && (!guitarView || !guitarView.classList.contains('active')) && (!pianoView || !pianoView.classList.contains('active'))) {
      if (candlelightToggleBtn) candlelightToggleBtn.click();
      return;
    }
  });

  // --------------------------------------------------------------------------
  // 25. TOAST NOTIFICATIONS
  // --------------------------------------------------------------------------
  const toastEl = document.getElementById('toastNotification');
  const toastMsg = document.getElementById('toastMessage');
  let toastTimer = null;

  function showToast(message) {
    if (!toastEl || !toastMsg) return;
    toastMsg.textContent = message;
    toastEl.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 3200);
  }

  // History Back & Mobile Gesture Navigation Manager (Closes open overlays instead of exiting page)
  window.addEventListener('popstate', (e) => {
    document.querySelectorAll('.modal-backdrop.active, .media-lightbox-overlay.active, .lightbox-modal-overlay.active').forEach((m) => {
      closeModal(m, true);
    });
    const passcodeOverlay = document.getElementById('pagePasscodeOverlay');
    if (passcodeOverlay && passcodeOverlay.style.display !== 'none' && !passcodeOverlay.classList.contains('unlocked')) {
      passcodeOverlay.style.display = 'none';
      passcodeOverlay.classList.remove('unlocked');
    }
  });

  // Bfcache / Page Restoration Lifecycle Handler
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      document.querySelectorAll('.modal-backdrop.active, .media-lightbox-overlay.active, .lightbox-modal-overlay.active').forEach((m) => {
        closeModal(m, true);
      });
      if (window.location.hash.startsWith('#') && window.location.hash.includes('Modal')) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    }
  });

  // --------------------------------------------------------------------------
  // 26. AUTOMATIC CACHE & SESSION PURGE ON WINDOW/TAB CLOSE
  // --------------------------------------------------------------------------
  window.addEventListener('pagehide', () => {
    try {
      if ('caches' in window) {
        caches.keys().then((names) => {
          names.forEach((name) => caches.delete(name));
        });
      }
    } catch (e) {}
  });

  // Initialize State & UI
  applyStateToDOM();
  } catch (err) {
    console.error('Initialization error:', err);
  }
});

