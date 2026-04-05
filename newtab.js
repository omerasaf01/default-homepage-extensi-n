'use strict';

const DEFAULT_SETTINGS = {
  defaultUrl: '',
  autoRedirect: false,
  redirectDelay: 3,
};

// ── Elements ──────────────────────────────────────────────
const clockEl        = document.getElementById('clock');
const dateEl         = document.getElementById('date');
const urlDisplay     = document.getElementById('url-display');
const countdownWrap  = document.getElementById('countdown-wrap');
const countdownEl    = document.getElementById('countdown');
const btnGo          = document.getElementById('btn-go');
const btnCancel      = document.getElementById('btn-cancel');
const btnSettings    = document.getElementById('btn-settings');
const noUrlHint      = document.getElementById('no-url-hint');
const hintSettings   = document.getElementById('hint-settings');

// ── Clock ─────────────────────────────────────────────────
function updateClock() {
  const now = new Date();

  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  clockEl.textContent = `${hh}:${mm}:${ss}`;

  dateEl.textContent = now.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

updateClock();
setInterval(updateClock, 1000);

// ── State ─────────────────────────────────────────────────
let currentUrl   = '';
let countdownTimer = null;
let remaining    = 0;

// ── Load settings & initialise UI ─────────────────────────
chrome.storage.sync.get(DEFAULT_SETTINGS, (data) => {
  currentUrl = data.defaultUrl || '';

  if (currentUrl) {
    urlDisplay.textContent = currentUrl;
    noUrlHint.classList.add('hidden');
    btnGo.classList.remove('hidden');

    if (data.autoRedirect) {
      startCountdown(parseInt(data.redirectDelay, 10) || 3);
    }
  } else {
    urlDisplay.classList.add('hidden');
    btnGo.classList.add('hidden');
    noUrlHint.classList.remove('hidden');
  }
});

// ── Countdown ─────────────────────────────────────────────
function startCountdown(seconds) {
  remaining = seconds;
  countdownEl.textContent = remaining;
  countdownWrap.classList.remove('hidden');
  btnCancel.classList.remove('hidden');

  countdownTimer = setInterval(() => {
    remaining -= 1;
    countdownEl.textContent = remaining;

    if (remaining <= 0) {
      clearInterval(countdownTimer);
      navigate();
    }
  }, 1000);
}

function cancelCountdown() {
  clearInterval(countdownTimer);
  countdownTimer = null;
  countdownWrap.classList.add('hidden');
  btnCancel.classList.add('hidden');
}

// ── Navigation ────────────────────────────────────────────
function navigate() {
  if (currentUrl) {
    window.location.href = currentUrl;
  }
}

// ── Button handlers ───────────────────────────────────────
btnGo.addEventListener('click', () => {
  cancelCountdown();
  navigate();
});

btnCancel.addEventListener('click', cancelCountdown);

btnSettings.addEventListener('click', openSettings);
hintSettings.addEventListener('click', openSettings);

function openSettings() {
  // Opening the extension popup programmatically is not allowed from a
  // content page; redirect to the popup page directly instead.
  window.open(chrome.runtime.getURL('popup.html'), '_blank', 'width=360,height=320');
}

// ── React to storage changes (settings updated while tab open) ─
chrome.storage.onChanged.addListener((changes) => {
  if (changes.defaultUrl) {
    currentUrl = changes.defaultUrl.newValue || '';
    if (currentUrl) {
      urlDisplay.textContent = currentUrl;
      urlDisplay.classList.remove('hidden');
      noUrlHint.classList.add('hidden');
      btnGo.classList.remove('hidden');
    } else {
      urlDisplay.classList.add('hidden');
      noUrlHint.classList.remove('hidden');
      btnGo.classList.add('hidden');
      cancelCountdown();
    }
  }
});
