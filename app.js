/**
 * Personal Hub • Real-Time Engine & Interactive Controls
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');
  const ampmBadgeEl = document.getElementById('ampmBadge');
  const dateWeekdayEl = document.getElementById('dateWeekday');
  const dateFullEl = document.getElementById('dateFull');
  const timezoneDisplayEl = document.getElementById('timezoneDisplay');
  const gmtOffsetChipEl = document.getElementById('gmtOffsetChip');
  const dayOfYearDisplayEl = document.getElementById('dayOfYearDisplay');
  const dayPercentEl = document.getElementById('dayPercent');
  const dayProgressBar = document.getElementById('dayProgressBar');
  const yearPercentEl = document.getElementById('yearPercent');
  const yearProgressBar = document.getElementById('yearProgressBar');
  const militaryTimeEl = document.getElementById('militaryTime');
  const localTimestampSmallEl = document.getElementById('localTimestampSmall');

  // Greeting & Profile Elements
  const greetingIconEl = document.getElementById('greetingIcon');
  const greetingTextEl = document.getElementById('greetingText');
  const userNameEl = document.getElementById('userName');
  const editNameBtn = document.getElementById('editNameBtn');
  const avatarLetterEl = document.getElementById('avatarLetter');

  // Analog Hands
  const analogHourHand = document.getElementById('analogHour');
  const analogMinuteHand = document.getElementById('analogMinute');
  const analogSecondHand = document.getElementById('analogSecond');

  // Modal & Form Elements
  const nameEditModal = document.getElementById('nameEditModal');
  const nameEditForm = document.getElementById('nameEditForm');
  const nameInput = document.getElementById('nameInput');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const cancelModalBtn = document.getElementById('cancelModalBtn');

  // Actions & Utilities
  const toastNotification = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');
  const copyTimeBtn = document.getElementById('copyTimeBtn');
  const focusModeBtn = document.getElementById('focusModeBtn');
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const soundLabel = document.getElementById('soundLabel');
  const formatToggleBtn = document.getElementById('formatToggleBtn');
  const formatBadge = document.getElementById('formatBadge');
  const quoteRefreshBtn = document.getElementById('quoteRefreshBtn');
  const quoteTextEl = document.getElementById('quoteText');
  const quoteAuthorEl = document.getElementById('quoteAuthor');
  const themeDots = document.querySelectorAll('.theme-dot');

  // State
  let is24HourFormat = localStorage.getItem('time_format_24h') === 'true';
  let soundEnabled = false;
  let audioCtx = null;
  let lastSecondPlayed = -1;

  // Inspirational Quotes Pool
  const quotes = [
    { text: "Time is not what we spend, but the canvas on which we craft our lives.", author: "Daily Reflection" },
    { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
    { text: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs" },
    { text: "Focus is a muscle; practice brings clarity.", author: "Deep Work" },
    { text: "Every second is a chance to begin anew.", author: "Mindful Living" },
    { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" }
  ];

  /* --------------------------------------------------------------------------
     Name Management & Persistence
     -------------------------------------------------------------------------- */
  function loadSavedName() {
    const savedName = localStorage.getItem('personal_user_name') || 'Alex Morgan';
    updateNameDisplay(savedName);
  }

  function updateNameDisplay(name) {
    const cleanName = name.trim() || 'Alex Morgan';
    userNameEl.textContent = cleanName;
    const initial = cleanName.charAt(0).toUpperCase();
    avatarLetterEl.textContent = initial || 'A';
    localStorage.setItem('personal_user_name', cleanName);
  }

  function openNameModal() {
    nameInput.value = userNameEl.textContent;
    nameEditModal.showModal();
    nameInput.select();
  }

  function closeNameModal() {
    nameEditModal.close();
  }

  userNameEl.addEventListener('click', openNameModal);
  userNameEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openNameModal();
    }
  });
  editNameBtn.addEventListener('click', openNameModal);
  closeModalBtn.addEventListener('click', closeNameModal);
  cancelModalBtn.addEventListener('click', closeNameModal);

  nameEditForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newName = nameInput.value.trim();
    if (newName) {
      updateNameDisplay(newName);
      closeNameModal();
      showToast(`Welcome, ${newName}!`);
    }
  });

  /* --------------------------------------------------------------------------
     Theme Management
     -------------------------------------------------------------------------- */
  function initTheme() {
    const savedTheme = localStorage.getItem('personal_theme') || 'violet';
    setTheme(savedTheme);

    themeDots.forEach(dot => {
      dot.addEventListener('click', () => {
        const selectedTheme = dot.dataset.theme;
        setTheme(selectedTheme);
      });
    });
  }

  function setTheme(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('personal_theme', themeName);
    themeDots.forEach(dot => {
      dot.classList.toggle('active', dot.dataset.theme === themeName);
    });
  }

  /* --------------------------------------------------------------------------
     12h / 24h Format Toggle
     -------------------------------------------------------------------------- */
  function updateFormatUI() {
    formatBadge.textContent = is24HourFormat ? '24H' : '12H';
    ampmBadgeEl.style.display = is24HourFormat ? 'none' : 'block';
  }

  formatToggleBtn.addEventListener('click', () => {
    is24HourFormat = !is24HourFormat;
    localStorage.setItem('time_format_24h', is24HourFormat);
    updateFormatUI();
    showToast(`Switched to ${is24HourFormat ? '24-hour' : '12-hour'} format`);
  });

  /* --------------------------------------------------------------------------
     Time Calculations & Live Updates
     -------------------------------------------------------------------------- */
  function getGmtOffsetString(date) {
    const offsetMinutes = -date.getTimezoneOffset();
    const sign = offsetMinutes >= 0 ? '+' : '-';
    const absMinutes = Math.abs(offsetMinutes);
    const hours = String(Math.floor(absMinutes / 60)).padStart(2, '0');
    const minutes = String(absMinutes % 60).padStart(2, '0');
    return `UTC${sign}${hours}:${minutes}`;
  }

  function updateGreeting(hours) {
    let greeting = 'Good Morning';
    let icon = '🌅';

    if (hours >= 5 && hours < 12) {
      greeting = 'Good Morning';
      icon = '🌅';
    } else if (hours >= 12 && hours < 17) {
      greeting = 'Good Afternoon';
      icon = '☀️';
    } else if (hours >= 17 && hours < 21) {
      greeting = 'Good Evening';
      icon = '🌇';
    } else {
      greeting = 'Good Night';
      icon = '🌙';
    }

    greetingTextEl.textContent = greeting;
    greetingIconEl.textContent = icon;
  }

  function updateProgressBars(now) {
    // 1. Day progress
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const msSinceMidnight = now - startOfDay;
    const msInDay = 24 * 60 * 60 * 1000;
    const dayProgress = Math.min(100, Math.max(0, (msSinceMidnight / msInDay) * 100));
    dayPercentEl.textContent = `${dayProgress.toFixed(1)}%`;
    dayProgressBar.style.width = `${dayProgress.toFixed(2)}%`;

    // 2. Year progress
    const startOfYear = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
    const endOfYear = new Date(now.getFullYear() + 1, 0, 1, 0, 0, 0, 0);
    const yearProgress = ((now - startOfYear) / (endOfYear - startOfYear)) * 100;
    yearPercentEl.textContent = `${yearProgress.toFixed(1)}%`;
    yearProgressBar.style.width = `${yearProgress.toFixed(2)}%`;

    // 3. Day of Year
    const dayIndex = Math.floor((now - startOfYear) / (1000 * 60 * 60 * 24)) + 1;
    const isLeap = (now.getFullYear() % 4 === 0 && now.getFullYear() % 100 !== 0) || (now.getFullYear() % 400 === 0);
    const totalDays = isLeap ? 366 : 365;
    dayOfYearDisplayEl.textContent = `Day ${dayIndex} of ${totalDays}`;
  }

  // Timezone Info
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local System';
    timezoneDisplayEl.textContent = tz.replace('_', ' ');
  } catch {
    timezoneDisplayEl.textContent = 'Local Time';
  }

  /* --------------------------------------------------------------------------
     Digital Clock Tick
     -------------------------------------------------------------------------- */
  function tickDigital() {
    const now = new Date();
    const rawHours = now.getHours();
    const rawMinutes = now.getMinutes();
    const rawSeconds = now.getSeconds();

    // 12 vs 24 hours
    let displayHours = rawHours;
    let ampm = 'AM';
    if (!is24HourFormat) {
      ampm = rawHours >= 12 ? 'PM' : 'AM';
      displayHours = rawHours % 12;
      if (displayHours === 0) displayHours = 12;
    }

    hoursEl.textContent = String(displayHours).padStart(2, '0');
    minutesEl.textContent = String(rawMinutes).padStart(2, '0');
    secondsEl.textContent = String(rawSeconds).padStart(2, '0');
    ampmBadgeEl.textContent = ampm;

    // Date Strings
    const weekdayOptions = { weekday: 'long' };
    const dateOptions = { month: 'long', day: 'numeric', year: 'numeric' };
    dateWeekdayEl.textContent = now.toLocaleDateString(undefined, weekdayOptions);
    dateFullEl.textContent = now.toLocaleDateString(undefined, dateOptions);

    // GMT chip & footer
    const offsetStr = getGmtOffsetString(now);
    gmtOffsetChipEl.textContent = offsetStr;
    militaryTimeEl.textContent = `${String(rawHours).padStart(2, '0')}:${String(rawMinutes).padStart(2, '0')}:${String(rawSeconds).padStart(2, '0')} (${offsetStr})`;
    localTimestampSmallEl.textContent = now.toLocaleTimeString();

    // Greeting & progress
    updateGreeting(rawHours);
    updateProgressBars(now);

    // Audio tick trigger
    if (soundEnabled && rawSeconds !== lastSecondPlayed) {
      playTickSound();
      lastSecondPlayed = rawSeconds;
    }
  }

  /* --------------------------------------------------------------------------
     Analog Clock Smooth Animation (requestAnimationFrame)
     -------------------------------------------------------------------------- */
  function renderAnalogHands() {
    const now = new Date();
    const ms = now.getMilliseconds();
    const seconds = now.getSeconds() + ms / 1000;
    const minutes = now.getMinutes() + seconds / 60;
    const hours = (now.getHours() % 12) + minutes / 60;

    const secondDeg = seconds * 6;      // 360 / 60
    const minuteDeg = minutes * 6;      // 360 / 60
    const hourDeg = hours * 30;         // 360 / 12

    analogHourHand.style.transform = `rotate(${hourDeg}deg)`;
    analogMinuteHand.style.transform = `rotate(${minuteDeg}deg)`;
    analogSecondHand.style.transform = `rotate(${secondDeg}deg)`;

    requestAnimationFrame(renderAnalogHands);
  }

  /* --------------------------------------------------------------------------
     Subtle Web Audio Ambient Tick
     -------------------------------------------------------------------------- */
  function playTickSound() {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.015, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    } catch {
      // Audio playback silently ignored if unsupported
    }
  }

  soundToggleBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundLabel.textContent = soundEnabled ? 'Sound On' : 'Sound Off';
    soundToggleBtn.classList.toggle('active', soundEnabled);
    if (soundEnabled) {
      playTickSound();
      showToast('Clock ticking audio enabled');
    } else {
      showToast('Audio muted');
    }
  });

  /* --------------------------------------------------------------------------
     Toast Notification Helper
     -------------------------------------------------------------------------- */
  let toastTimer = null;
  function showToast(message) {
    if (toastTimer) clearTimeout(toastTimer);
    toastMessage.textContent = message;
    toastNotification.classList.add('show');
    toastTimer = setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 2800);
  }

  /* --------------------------------------------------------------------------
     Quick Actions: Copy, Focus, Quote Refresh
     -------------------------------------------------------------------------- */
  copyTimeBtn.addEventListener('click', async () => {
    const now = new Date();
    const formatted = `${now.toLocaleDateString()} ${now.toLocaleTimeString()} (${getGmtOffsetString(now)})`;
    try {
      await navigator.clipboard.writeText(formatted);
      showToast('Timestamp copied to clipboard!');
    } catch {
      // Fallback
      showToast(formatted);
    }
  });

  focusModeBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        showToast('Entered Focus Fullscreen Mode (Press Esc to exit)');
      }).catch(() => {
        showToast('Fullscreen mode not available');
      });
    } else {
      document.exitFullscreen();
    }
  });

  let currentQuoteIndex = 0;
  quoteRefreshBtn.addEventListener('click', () => {
    currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
    quoteTextEl.style.opacity = '0';
    setTimeout(() => {
      quoteTextEl.textContent = `"${quotes[currentQuoteIndex].text}"`;
      quoteAuthorEl.textContent = `— ${quotes[currentQuoteIndex].author}`;
      quoteTextEl.style.opacity = '1';
    }, 180);
  });

  /* --------------------------------------------------------------------------
     Initialization
     -------------------------------------------------------------------------- */
  loadSavedName();
  initTheme();
  updateFormatUI();
  
  // Initial tick and interval
  tickDigital();
  setInterval(tickDigital, 1000);

  // Smooth continuous analog animation
  requestAnimationFrame(renderAnalogHands);
});
