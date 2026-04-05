'use strict';

const STORAGE_KEYS = {
  url: 'defaultUrl',
  autoRedirect: 'autoRedirect',
  delay: 'redirectDelay',
};

const DEFAULT_SETTINGS = {
  defaultUrl: '',
  autoRedirect: false,
  redirectDelay: 3,
};

// ── Elements ──────────────────────────────────────────────
const urlInput      = document.getElementById('url-input');
const autoToggle    = document.getElementById('auto-redirect');
const delayRow      = document.getElementById('delay-row');
const delaySelect   = document.getElementById('delay-select');
const saveBtn       = document.getElementById('btn-save');
const toast         = document.getElementById('toast');

// ── Load saved settings ───────────────────────────────────
chrome.storage.sync.get(DEFAULT_SETTINGS, (data) => {
  urlInput.value      = data.defaultUrl   || '';
  autoToggle.checked  = data.autoRedirect || false;
  delaySelect.value   = String(data.redirectDelay || 3);
  toggleDelayRow(autoToggle.checked);
});

// ── Toggle delay row visibility (CPU-friendly max-height) ─
function toggleDelayRow(visible) {
  if (visible) {
    delayRow.classList.remove('hidden-row');
  } else {
    delayRow.classList.add('hidden-row');
  }
}

autoToggle.addEventListener('change', () => {
  toggleDelayRow(autoToggle.checked);
});

// ── Save settings ─────────────────────────────────────────
saveBtn.addEventListener('click', () => {
  const rawUrl = urlInput.value.trim();

  if (!rawUrl) {
    showToast('Please enter an address.', true);
    return;
  }

  // Normalise: add https:// when no scheme is provided
  let finalUrl = rawUrl;
  if (!/^https?:\/\//i.test(finalUrl)) {
    finalUrl = 'https://' + finalUrl;
    urlInput.value = finalUrl;
  }

  // Basic URL validation
  try {
    new URL(finalUrl);
  } catch {
    showToast('Invalid URL – please check the address.', true);
    return;
  }

  const settings = {
    [STORAGE_KEYS.url]:          finalUrl,
    [STORAGE_KEYS.autoRedirect]: autoToggle.checked,
    [STORAGE_KEYS.delay]:        parseInt(delaySelect.value, 10),
  };

  chrome.storage.sync.set(settings, () => {
    if (chrome.runtime.lastError) {
      showToast('Could not save – please try again.', true);
    } else {
      showToast('Settings saved ✓');
    }
  });
});

// ── Toast helper ──────────────────────────────────────────
let toastTimer = null;

function showToast(message, isError = false) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.toggle('error', isError);
  toast.classList.add('visible');

  toastTimer = setTimeout(() => {
    toast.classList.remove('visible');
  }, 2500);
}
