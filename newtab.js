"use strict";

const DAYS = [
  "Pazar",
  "Pazartesi",
  "Salı",
  "Çarşamba",
  "Perşembe",
  "Cuma",
  "Cumartesi",
];
const MON = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];

const DEFAULT_SETTINGS = {
  defaultUrl: "",
  autoRedirect: false,
  redirectDelay: 3,
};

const engines = [
  { label: "Google", url: "https://www.google.com/search?q=" },
  { label: "DuckDuckGo", url: "https://duckduckgo.com/?q=" },
  { label: "Bing", url: "https://www.bing.com/search?q=" },
  { label: "Brave", url: "https://search.brave.com/search?q=" },
];

const el = (id) => document.getElementById(id);

const clockEl = el("clock");
const dateElPrimary = el("dateline");
const dateElLegacy = el("date");
const searchInput = el("searchInput");
const engineBtn = el("engineBtn");
const noteInput = el("noteInput");
const tipsList = el("tipsList");

function updateClock() {
  if (!clockEl && !dateElPrimary && !dateElLegacy) return;
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  if (clockEl) {
    clockEl.textContent = dateElLegacy ? `${hh}:${mm}:${ss}` : `${hh}:${mm}`;
  }
  const dateText = `${DAYS[now.getDay()]}, ${now.getDate()} ${MON[now.getMonth()]} ${now.getFullYear()}`;
  if (dateElPrimary) {
    dateElPrimary.textContent = dateText;
  }
  if (dateElLegacy) {
    dateElLegacy.textContent = dateText;
  }
}

function initClock() {
  updateClock();
  setInterval(updateClock, 1000);
}

function initSearch() {
  if (!searchInput) return;

  let engineIndex = 0;
  if (engineBtn) {
    engineBtn.addEventListener("click", () => {
      engineIndex = (engineIndex + 1) % engines.length;
      engineBtn.textContent = engines[engineIndex].label;
    });
  }

  searchInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    const q = searchInput.value.trim();
    if (!q) return;

    const looksLikeUrl =
      /^https?:\/\//i.test(q) || /^[a-z0-9-]+\.[a-z]{2,}/i.test(q);
    const target = /^https?:\/\//i.test(q)
      ? q
      : looksLikeUrl
        ? `https://${q}`
        : `${engines[engineIndex].url}${encodeURIComponent(q)}`;

    window.location.href = target;
  });
}

function initNotes() {
  if (!noteInput) return;
  noteInput.value = localStorage.getItem("he_note") || "";
  noteInput.addEventListener("input", () => {
    localStorage.setItem("he_note", noteInput.value);
  });
}

function initTips() {
  if (!tipsList) return;

  const tips = [
    "Ctrl + T → Yeni sekme",
    "Ctrl + L → Adres çubuğu",
    "Ctrl + W → Sekmeyi kapat",
    "Ctrl + Shift + T → Geri aç",
    "Ctrl + D → Yer imi ekle",
    "F5 → Sayfayı yenile",
    "F12 → Geliştirici araçları",
    "Alt + ← → Geri git",
  ];

  tips
    .slice()
    .sort(() => Math.random() - 0.5)
    .slice(0, 4)
    .forEach((tip) => {
      const li = document.createElement("li");
      li.className = "tip";
      li.textContent = tip;
      tipsList.appendChild(li);
    });
}

async function navigateTo(url) {
  if (!url) return;
  try {
    const tab = await chrome.tabs.getCurrent();
    if (tab && tab.id != null) {
      await chrome.tabs.update(tab.id, { url });
    } else {
      window.location.href = url;
    }
  } catch {
    window.location.href = url;
  }
}

function initAutoRedirect() {
  if (!chrome?.storage?.sync?.get) return;

  chrome.storage.sync.get(DEFAULT_SETTINGS, (data) => {
    const targetUrl = data.defaultUrl || "";
    if (!targetUrl || !data.autoRedirect) return;

    const delay = Number.isFinite(data.redirectDelay) ? data.redirectDelay : 3;
    const safeDelay = delay < 0 ? 0 : delay;

    if (safeDelay === 0) {
      navigateTo(targetUrl);
      return;
    }

    setTimeout(() => {
      navigateTo(targetUrl);
    }, safeDelay * 1000);
  });
}

initClock();
initSearch();
initNotes();
initTips();
initAutoRedirect();
