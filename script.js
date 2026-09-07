/* ==========================================================================
   ETERNAL LOVE — JAVASCRIPT ANIMATION, AUDIO & INTERACTIVE ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  try {
  // --------------------------------------------------------------------------
  // 1. STATE MANAGEMENT & LOCAL STORAGE PERSISTENCE
  // --------------------------------------------------------------------------
  const STORAGE_KEY = 'eternal_love_bday_state_v2';
  let savedData = {};
  try {
    savedData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch (e) {
    savedData = {};
  }

  const DEFAULT_GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbwPnRNoIYc1b8E2loZiXZhwlDXn3H2ZjH5b_t-C328paUo8u2mcGewGJKscj1W71zW-/exec';

  const state = {
    recipientName: savedData.recipientName || 'Komal',
    senderName: savedData.senderName || 'Dilip',
    startDate: savedData.startDate || '2025-12-29',
    message: savedData.message || 'To the most incredible, beautiful, and radiant woman in my life, Komal: May your birthday be filled with infinite joy, sweet surprises, and all the happiness you bring into my world! 💖',
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
    googleSheetUrl: savedData.googleSheetUrl || localStorage.getItem('eternal_love_sheet_url') || DEFAULT_GOOGLE_SHEET_URL
  };

  // Clean up any test mock or truncated URL and upgrade to full Google Sheet URL
  if (!state.googleSheetUrl || state.googleSheetUrl.includes('AKfycb_TEST_MOCK_SHEET') || state.googleSheetUrl === 'https://script.google.com/macros/s/AKfycbwPnRNoIYc1b8E2loZiXZh/exec') {
    state.googleSheetUrl = DEFAULT_GOOGLE_SHEET_URL;
    localStorage.setItem('eternal_love_sheet_url', DEFAULT_GOOGLE_SHEET_URL);
  }

  // URL Parameters override if present
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('name')) state.recipientName = decodeURIComponent(urlParams.get('name')).trim();
  if (urlParams.get('sender')) state.senderName = decodeURIComponent(urlParams.get('sender')).trim();
  if (urlParams.get('date')) state.startDate = decodeURIComponent(urlParams.get('date')).trim();
  if (urlParams.get('msg')) state.message = decodeURIComponent(urlParams.get('msg')).trim();
  if (urlParams.get('theme')) state.theme = urlParams.get('theme');
  if (urlParams.get('sheet')) state.googleSheetUrl = decodeURIComponent(urlParams.get('sheet')).trim();

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
        googleSheetUrl: state.googleSheetUrl
      }));
      if (state.googleSheetUrl) {
        localStorage.setItem('eternal_love_sheet_url', state.googleSheetUrl);
      }
    } catch (e) {
      console.warn('Storage quota limit reached or unavailable', e);
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
    if (bouquetTag) bouquetTag.textContent = `To Queen ${state.recipientName} 👑 Forever In Bloom`;

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
        celebrant: state.recipientName,
        dedicatedBy: state.senderName,
        timestamp: new Date().toISOString(),
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
  // 2. SCROLL REVEAL OBSERVER (INTERSECTION OBSERVER)
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

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
  // 6. STAGE 1: 3D GIFT BOX UNBOXING CEREMONY
  // --------------------------------------------------------------------------
  const introOverlay = document.getElementById('introOverlay');
  const mainApp = document.getElementById('mainApp');
  const giftBoxTrigger = document.getElementById('giftBoxTrigger');
  const openGiftBtn = document.getElementById('openGiftBtn');

  function unboxBirthdaySurprise() {
    if (giftBoxTrigger) giftBoxTrigger.classList.add('opening');
    audioSynth.playCelebrationFanfare();
    burstConfetti(window.innerWidth / 2, window.innerHeight / 2, 110);

    setTimeout(() => {
      if (introOverlay) introOverlay.classList.add('fade-out');
      if (mainApp) mainApp.classList.remove('hidden');

      if (!state.isMusicPlaying && musicToggleBtn) {
        state.isMusicPlaying = true;
        audioSynth.startMelody();
        if (musicPill) musicPill.classList.add('playing');
        if (musicStatusText) musicStatusText.textContent = 'Pause Music';
      }

      showToast(`Welcome to your celebration, ${state.recipientName}! 👑💖`);
    }, 700);
  }

  if (giftBoxTrigger) giftBoxTrigger.addEventListener('click', unboxBirthdaySurprise);
  if (openGiftBtn) openGiftBtn.addEventListener('click', unboxBirthdaySurprise);

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
      showToast('Cheers to the Birthday Queen! 🥂✨');
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
      const pin = vaultPasscodeInput.value.trim();
      const dateDigits = (state.startDate || '2025-12-29').replace(/\D/g, '');
      const validPins = ['2912', '1229', '2025', '0509', '0905', dateDigits.slice(-4), dateDigits.slice(0, 4)];
      if (validPins.includes(pin) || pin === '2912' || pin.length === 4) {
        unlockWishVault();
      } else {
        audioSynth.playPopSound();
        showToast("Incorrect PIN! Hint: Anniversary PIN (2912) or tap Queen's Heart Key below 💕");
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
      if (cutStatusCaption) cutStatusCaption.textContent = '🎉 Royal slice is served! Click "Feed to Komal" below! 🍓👑';
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
      if (cutStatusCaption) cutStatusCaption.textContent = '🎉 Scene 4: Sliced & placed on plate! Click "Feed to Komal" below! 🍓💖';
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

      showToast(`Fed the sweetest first slice to Queen ${state.recipientName}! 🍓🍰👑 "Forever sweeter with you, my Queen!"`);

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
    `"In your arms is where I always want to be... Happy Birthday, my Queen Komal." 💖`,
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
    `"Holding you, Komal, is the most peaceful feeling in the universe." 💖`,
    `"Happy Birthday to my eternal love, my sweetest comfort, my Queen." 👑✨`,
    `"With every breath, Dilip falls deeper in love with you." 💓`,
    `"Under millions of stars, you shine brighter than them all." 🌌`,
    `"Forever wrapped in warm cashmere and endless love with you." ☕🛋️`,
    `"Your smile is my favorite constellation, my Queen Komal." 💫`
  ];
  let whisperIndex = 0;

  if (cuddleWhisperBtn && cuddleFloatingArena) {
    cuddleWhisperBtn.addEventListener('click', () => {
      const text = cuddleWhispersList[whisperIndex % cuddleWhispersList.length];
      whisperIndex++;

      const note = document.createElement('div');
      note.className = 'floating-love-note whisper-dynamic';
      note.innerHTML = `<span class="note-icon">💌</span><span class="note-text">${text}</span>`;
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
        'Whenever the world feels a little too quiet or you just miss hearing my voice, remember that my heart beats in rhythm with yours. You are never alone, my sweet Queen. I am right here with you in every memory, every whisper of the wind, and every star in the night sky.',
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
        'Keep that breathtaking smile on your face today, my Queen—the world is infinitely brighter because of you.'
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
        .map(p => `<p>${p.replace(/Queen Komal/g, `Queen ${state.recipientName}`).replace(/Komal/g, state.recipientName)}</p>`)
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

  // 👑 Radiant Queen Komal (61-80)
  { cat: "👑 Radiant Queen", text: "Your natural elegance, royal grace, and the dignified way you carry yourself everywhere." },
  { cat: "👑 Radiant Queen", text: "The radiant beauty that shines from your pure golden heart and illuminates your face." },
  { cat: "👑 Radiant Queen", text: "How fierce, dedicated, and hardworking you are when pursuing your goals and passions." },
  { cat: "👑 Radiant Queen", text: "Your brilliant mind and the captivating perspective you bring to every discussion." },
  { cat: "👑 Radiant Queen", text: "How you treat everyone around you with respect, warmth, and generous kindness." },
  { cat: "👑 Radiant Queen", text: "The way you light up any gathering simply by walking in with your radiant presence." },
  { cat: "👑 Radiant Queen", text: "How your confidence and sweet humility balance each other in the most captivating harmony." },
  { cat: "👑 Radiant Queen", text: "Your impeccable style, whether dressed in royal finery or cozy oversized loungewear." },
  { cat: "👑 Radiant Queen", text: "The strength and resilience you show when facing challenges, inspiring me every day." },
  { cat: "👑 Radiant Queen", text: "How your beauty is timeless, breathtaking, and only grows more radiant with each sunrise." },
  { cat: "👑 Radiant Queen", text: "Your sharp wit, wonderful sense of humor, and how quick you are to bring joy to others." },
  { cat: "👑 Radiant Queen", text: "How you hold your crown with effortless dignity, never needing to boast or show off." },
  { cat: "👑 Radiant Queen", text: "The genuine love and thoughtful care you pour into your family and close friends." },
  { cat: "👑 Radiant Queen", text: "How you inspire everyone blessed to know you to become better and kinder human beings." },
  { cat: "👑 Radiant Queen", text: "The gentle authority and poise you possess that commands natural respect and love." },
  { cat: "👑 Radiant Queen", text: "How proud and honored Dilip feels every single day to walk beside Queen Komal." },
  { cat: "👑 Radiant Queen", text: "Your rare combination of boundless empathy, sharp intellect, and irresistible sweetness." },
  { cat: "👑 Radiant Queen", text: "How you turn every ordinary space into a royal palace simply by being in it." },
  { cat: "👑 Radiant Queen", text: "The sparkle of wisdom and kindness in your eyes that never dims." },
  { cat: "👑 Radiant Queen", text: "Because you are the undisputed, forever-crowned Queen of my entire world and heart." },

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
  { cat: "💫 Forever Love", text: "How every sunrise is a fresh opportunity for Dilip to love, protect, and cherish Queen Komal." },
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
    bouquetTagText.textContent = `To Queen ${state.recipientName} 👑 Forever In Bloom`;
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
      if (giftingStatusCaption) giftingStatusCaption.textContent = `🎬 Scene 1: Dilip carefully handcrafts and ties the eternal silk ribbon for Queen ${state.recipientName}... 🎀`;
    } else if (giftingCurrentTime < 6.0) {
      // Scene 2: 3D Offering Forward
      if (heroBouquet3D) heroBouquet3D.className = 'hero-bouquet-3d gift-offering';
      if (giftingStatusCaption) giftingStatusCaption.textContent = `💎 Scene 2: Dilip extends his arms forward, gifting the forever bouquet to his Queen in 3D perspective... ✨`;
    } else if (giftingCurrentTime < 8.5) {
      // Scene 3: Queen Komal Embraces Bouquet with Falling Petals
      if (heroBouquet3D) heroBouquet3D.className = 'hero-bouquet-3d gift-received';
      if (giftingStatusCaption) giftingStatusCaption.textContent = `👑 Scene 3: Queen ${state.recipientName} joyfully receives her blooms under a shower of falling petals! 🌸`;
    } else {
      // Scene 4: Royal Proclamation Dedicated
      if (heroBouquet3D) heroBouquet3D.className = 'hero-bouquet-3d gift-received';
      if (giftingStatusCaption) giftingStatusCaption.textContent = `💖 Scene 4: Eternal Love Proclamation Registered! 'To my Queen ${state.recipientName}, forever in bloom!' 📜👑`;
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
      heroTagDedication.textContent = `To Queen ${state.recipientName} 👑 Forever In Bloom`;
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
    showToast(`Royal Forever Bouquet 3D Video Ceremony playing for Queen ${state.recipientName}! 👑💎💖`);
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
      feedback: 'Forever and always, my Queen!'
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
    'My Queen! 👑', 'Pure Love! 💖', 'Stay Radiant! ✨', 'Best Year Ever! 🎉',
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
  });

  // --- 📸 POLAROID PHOTO UPLOADER & FILTER SUITE ---
  const photoUploadInput = document.getElementById('photoUploadInput');
  const uploadPhotoBtn = document.getElementById('uploadPhotoBtn');
  const polaroidGrid = document.getElementById('polaroidGrid');
  let currentActiveFilter = 'none';

  // Filter selection
  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentActiveFilter = chip.getAttribute('data-filter');
      audioSynth.playPopSound();
      showToast(`Filter selected: ${chip.textContent.trim()} 📸`);
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
          caption: photoItem.caption,
          tag: photoItem.tag,
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
    card.className = `polaroid-card tilt-element ${photoItem.filterClass || ''}`;
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

    if (prepend) {
      polaroidGrid.prepend(card);
    } else {
      polaroidGrid.appendChild(card);
    }
  }

  // Load existing uploaded photos from storage
  if (state.uploadedPhotos && state.uploadedPhotos.length > 0) {
    state.uploadedPhotos.forEach(p => renderUploadedPolaroid(p));
  }

  // Sticky Pinboard
  const wishForm = document.getElementById('wishForm');
  const wishAuthorInput = document.getElementById('wishAuthorInput');
  const wishTextInput = document.getElementById('wishTextInput');
  const wishesPinboard = document.getElementById('wishesPinboard');
  const stickyClasses = ['sticky-gold', 'sticky-pink', 'sticky-cyan'];

  function renderPinnedWishes() {
    if (!wishesPinboard) return;
    state.pinnedWishes.forEach(item => {
      const sticky = document.createElement('div');
      sticky.className = `wish-sticky ${item.styleClass || 'sticky-pink'}`;
      sticky.style.transform = `rotate(${item.rot || 0}deg)`;
      sticky.innerHTML = `
        <span class="pin">📌</span>
        <p class="sticky-msg">"${escapeHtml(item.text)}"</p>
        <span class="sticky-author">— ${escapeHtml(item.author)}</span>
      `;
      wishesPinboard.prepend(sticky);
    });
  }

  if (wishForm) {
    wishForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const author = wishAuthorInput ? wishAuthorInput.value.trim() : '';
      const text = wishTextInput ? wishTextInput.value.trim() : '';
      if (!author || !text) return;

      const randomStickyClass = stickyClasses[Math.floor(Math.random() * stickyClasses.length)];
      const randomRot = (Math.random() * 6 - 3).toFixed(1);

      const newWish = { author, text, styleClass: randomStickyClass, rot: randomRot };
      state.pinnedWishes.push(newWish);
      saveState();

      const sticky = document.createElement('div');
      sticky.className = `wish-sticky ${randomStickyClass}`;
      sticky.style.transform = `rotate(${randomRot}deg)`;
      sticky.innerHTML = `
        <span class="pin">📌</span>
        <p class="sticky-msg">"${escapeHtml(text)}"</p>
        <span class="sticky-author">— ${escapeHtml(author)}</span>
      `;

      wishesPinboard.prepend(sticky);
      audioSynth.playCheerSound();
      burstConfetti(window.innerWidth / 2, window.innerHeight * 0.7, 40);

      // Sync wish to Google Sheets
      sendToGoogleSheet({
        type: 'wish',
        author: author,
        message: text,
        styleClass: randomStickyClass
      }, {
        chipElement: document.getElementById('wishSyncChip'),
        textElement: document.getElementById('wishSyncText'),
        successText: 'Wish Saved to Google Sheets! 💖✨',
        defaultText: 'Google Sheets Connected ✨'
      });

      if (wishAuthorInput) wishAuthorInput.value = '';
      if (wishTextInput) wishTextInput.value = '';
      showToast('Note pinned & saved to celebration board! 📌✨');
    });
  }



  // --------------------------------------------------------------------------
  // 18. SECTION 11: MYSTERY BIRTHDAY FORTUNE CARDS
  // --------------------------------------------------------------------------
  const mysteryCards = document.querySelectorAll('.mystery-box-card');
  mysteryCards.forEach(card => {
    card.addEventListener('click', () => {
      if (!card.classList.contains('flipped')) {
        card.classList.add('flipped');
        audioSynth.playCheerSound();
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
  function openModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.add('active');
  }

  function closeModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.remove('active');
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
      state.recipientName = (custNameInput && custNameInput.value.trim()) || 'Komal';
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
    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set('name', state.recipientName);
    url.searchParams.set('sender', state.senderName);
    url.searchParams.set('date', state.startDate);
    if (state.message) url.searchParams.set('msg', state.message);
    url.searchParams.set('theme', state.theme);
    if (state.googleSheetUrl) url.searchParams.set('sheet', state.googleSheetUrl);
    shareUrlInput.value = url.toString();
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
  // 20. CONSTELLATION OF LOVE & STAR REGISTRY FOR KOMAL
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

    const constellationPatterns = {
      crown: [
        { x: 0.2, y: 0.65 }, { x: 0.35, y: 0.35 }, { x: 0.5, y: 0.55 },
        { x: 0.65, y: 0.35 }, { x: 0.8, y: 0.65 }, { x: 0.5, y: 0.8 }, { x: 0.2, y: 0.65 }
      ],
      heart: [
        { x: 0.5, y: 0.35 }, { x: 0.4, y: 0.2 }, { x: 0.25, y: 0.25 },
        { x: 0.2, y: 0.45 }, { x: 0.5, y: 0.8 }, { x: 0.8, y: 0.45 },
        { x: 0.75, y: 0.25 }, { x: 0.6, y: 0.2 }, { x: 0.5, y: 0.35 }
      ],
      infinity: [
        { x: 0.25, y: 0.5 }, { x: 0.35, y: 0.3 }, { x: 0.5, y: 0.5 },
        { x: 0.65, y: 0.7 }, { x: 0.75, y: 0.5 }, { x: 0.65, y: 0.3 },
        { x: 0.5, y: 0.5 }, { x: 0.35, y: 0.7 }, { x: 0.25, y: 0.5 }
      ]
    };

    function drawConstellationSky() {
      if (!starCtx) return;
      const w = constellationCanvas.width;
      const h = constellationCanvas.height;
      starCtx.clearRect(0, 0, w, h);

      // Draw faint background stars
      for (let i = 0; i < 40; i++) {
        const sx = (Math.sin(i * 99) * 0.5 + 0.5) * w;
        const sy = (Math.cos(i * 33) * 0.5 + 0.5) * h;
        starCtx.beginPath();
        starCtx.arc(sx, sy, 1.2, 0, Math.PI * 2);
        starCtx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        starCtx.fill();
      }

      // Draw active constellation lines
      const pts = constellationPatterns[activeConstellationPattern] || constellationPatterns.crown;
      starCtx.beginPath();
      starCtx.strokeStyle = 'rgba(251, 191, 36, 0.75)';
      starCtx.lineWidth = 2;
      starCtx.shadowColor = '#fbbf24';
      starCtx.shadowBlur = 12;

      pts.forEach((pt, idx) => {
        const px = pt.x * w;
        const py = pt.y * h;
        if (idx === 0) starCtx.moveTo(px, py);
        else starCtx.lineTo(px, py);
      });
      starCtx.stroke();
      starCtx.shadowBlur = 0;

      // Draw glowing constellation star nodes
      pts.forEach(pt => {
        const px = pt.x * w;
        const py = pt.y * h;
        starCtx.beginPath();
        starCtx.arc(px, py, 4.5, 0, Math.PI * 2);
        starCtx.fillStyle = '#fff';
        starCtx.shadowColor = '#c084fc';
        starCtx.shadowBlur = 10;
        starCtx.fill();
        starCtx.shadowBlur = 0;
      });
    }

    function resizeInteractiveCanvases() {
      if (constellationCanvas && constellationCanvas.parentElement) {
        constellationCanvas.width = constellationCanvas.parentElement.clientWidth || 800;
        constellationCanvas.height = constellationCanvas.parentElement.clientHeight || 380;
        drawConstellationSky();
      }
      if (lanternCanvas && lanternCanvas.parentElement) {
        lanternCanvas.width = lanternCanvas.parentElement.clientWidth || 800;
        lanternCanvas.height = lanternCanvas.parentElement.clientHeight || 350;
      }
    }

    window.addEventListener('resize', resizeInteractiveCanvases);
    setTimeout(resizeInteractiveCanvases, 100);

    drawConstellationSky();

    document.querySelectorAll('.constellation-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.constellation-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        activeConstellationPattern = chip.getAttribute('data-constellation');
        drawConstellationSky();
        audioSynth.playMagicChime();
        burstConfetti(window.innerWidth / 2, window.innerHeight * 0.6, 25);
      });
    });
  }

  // --------------------------------------------------------------------------
  // 21. FLOATING SKY LANTERNS FESTIVAL
  // --------------------------------------------------------------------------
  const lanternCanvas = document.getElementById('lanternCanvas');
  const lanternWishInput = document.getElementById('lanternWishInput');
  const releaseLanternBtn = document.getElementById('releaseLanternBtn');
  let activeLanterns = [];

  if (lanternCanvas) {
    const lCtx = lanternCanvas.getContext('2d');

    function spawnLantern(wishText) {
      activeLanterns.push({
        x: Math.random() * (lanternCanvas.width - 120) + 60,
        y: lanternCanvas.height + 40,
        vy: -(Math.random() * 0.8 + 0.9),
        vx: (Math.random() - 0.5) * 0.35,
        width: 38,
        height: 52,
        sway: Math.random() * 2,
        wish: wishText || 'For Komal 💖'
      });
    }

    // Default starting ambient lanterns
    for (let i = 0; i < 6; i++) {
      activeLanterns.push({
        x: Math.random() * 700 + 50,
        y: Math.random() * 300 + 40,
        vy: -(Math.random() * 0.4 + 0.4),
        vx: (Math.random() - 0.5) * 0.2,
        width: 30,
        height: 42,
        sway: Math.random() * 2,
        wish: 'Happy Birthday Komal 👑'
      });
    }

    let isLanternsVisible = false;
    let lanternAnimId = null;

    function renderSkyLanterns() {
      if (!lCtx || !isLanternsVisible) {
        lanternAnimId = null;
        return;
      }
      lCtx.clearRect(0, 0, lanternCanvas.width, lanternCanvas.height);

      for (let i = activeLanterns.length - 1; i >= 0; i--) {
        const lan = activeLanterns[i];
        lan.y += lan.vy;
        lan.x += lan.vx + Math.sin(Date.now() * 0.002 + lan.sway) * 0.25;

        if (lan.y < -70) {
          activeLanterns.splice(i, 1);
          continue;
        }

        // Draw glowing lantern body with performant radial glow
        lCtx.save();
        lCtx.translate(lan.x, lan.y);

        // Soft outer ambient halo
        const outerHalo = lCtx.createRadialGradient(0, 0, lan.height * 0.2, 0, 0, lan.height * 1.3);
        outerHalo.addColorStop(0, 'rgba(251, 191, 36, 0.35)');
        outerHalo.addColorStop(1, 'rgba(251, 191, 36, 0)');
        lCtx.fillStyle = outerHalo;
        lCtx.beginPath();
        lCtx.arc(0, 0, lan.height * 1.2, 0, Math.PI * 2);
        lCtx.fill();

        // Lantern Paper Shell
        const grad = lCtx.createRadialGradient(0, 0, 5, 0, 0, lan.height);
        grad.addColorStop(0, 'rgba(255, 245, 180, 0.95)');
        grad.addColorStop(0.5, 'rgba(245, 158, 11, 0.85)');
        grad.addColorStop(1, 'rgba(225, 29, 72, 0.6)');

        lCtx.fillStyle = grad;
        lCtx.beginPath();
        lCtx.roundRect(-lan.width / 2, -lan.height / 2, lan.width, lan.height, [8, 8, 4, 4]);
        lCtx.fill();

        // Inner glowing core flame
        lCtx.fillStyle = '#fff';
        lCtx.beginPath();
        lCtx.arc(0, lan.height / 3, 3.5, 0, Math.PI * 2);
        lCtx.fill();

        lCtx.restore();
      }

      lanternAnimId = requestAnimationFrame(renderSkyLanterns);
    }

    // Only render when scrolled into view
    const lanternObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isLanternsVisible = entry.isIntersecting;
        if (isLanternsVisible && !lanternAnimId) {
          lanternAnimId = requestAnimationFrame(renderSkyLanterns);
        }
      });
    }, { threshold: 0.05 });
    lanternObserver.observe(lanternCanvas);

    if (releaseLanternBtn) {
      releaseLanternBtn.addEventListener('click', () => {
        const wish = (lanternWishInput && lanternWishInput.value.trim()) || 'Happy Birthday Komal 💖';
        spawnLantern(wish);
        audioSynth.playCelebrationFanfare();
        burstConfetti(window.innerWidth / 2, window.innerHeight * 0.6, 50);
        showToast('Your glowing sky lantern has ascended into the stars! 🏮✨');
        if (lanternWishInput) lanternWishInput.value = '';
      });
    }
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
    'Midnight Ice Cream Date (Komal\'s Choice) 🍦🌙',
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
  const komalAffirmations = [
    "Komal, you illuminate every room with your natural grace, kindness, and radiant beauty.",
    "Your smile is my favorite view in the universe, turning every ordinary moment into magic.",
    "Komal, you are fiercely intelligent, deeply caring, and the sweetest soul I know.",
    "Being loved by you, Komal, is the greatest blessing my heart has ever received.",
    "You inspire me every day with your gentle strength, warm laughter, and golden heart.",
    "Komal, you are officially crowned the undisputed Queen of my heart, today and forever! 👑"
  ];

  let currentAffirmationIdx = 0;
  const enchantedMirrorTrigger = document.getElementById('enchantedMirrorTrigger');
  const nextAffirmationBtn = document.getElementById('nextAffirmationBtn');
  const mirrorAffirmationText = document.getElementById('mirrorAffirmationText');
  const mirrorContent = document.getElementById('mirrorContent');

  function cycleKomalAffirmation() {
    currentAffirmationIdx = (currentAffirmationIdx + 1) % komalAffirmations.length;
    if (mirrorContent) {
      mirrorContent.style.animation = 'none';
      void mirrorContent.offsetWidth;
      mirrorContent.style.animation = 'mirrorFade 0.6s ease forwards';
    }
    if (mirrorAffirmationText) {
      mirrorAffirmationText.textContent = `"${komalAffirmations[currentAffirmationIdx]}"`;
    }
    audioSynth.playMagicChime();
    burstConfetti(window.innerWidth / 2, window.innerHeight * 0.6, 35);
    showToast('The Enchanted Mirror reflects true love for Komal! ✨💖');
  }

  if (enchantedMirrorTrigger) enchantedMirrorTrigger.addEventListener('click', cycleKomalAffirmation);
  if (nextAffirmationBtn) nextAffirmationBtn.addEventListener('click', cycleKomalAffirmation);

  // --------------------------------------------------------------------------
  // 25. KEYBOARD SHORTCUTS CHEAT SHEET MODAL & GLOBAL HOTKEYS
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

    // 9. K: Enchanted Mirror Royal Affirmation
    if (key === 'k') {
      cycleKomalAffirmation();
      return;
    }

    // 10. T: Toggle Soft Candlelight Ambiance
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

  // Initialize State & UI
  applyStateToDOM();
  } catch (err) {
    console.error('Initialization error:', err);
  }
});

