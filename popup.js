const container = document.getElementById("container");
const themeBtn = document.getElementById("toggle-theme");
const langSelect = document.getElementById("language");
const toggleAdsBtn = document.getElementById("toggle-ads");
const reloadBtn = document.getElementById("reload-page");
const feedbackBtn = document.getElementById("feedback");

let darkMode = false;
let adEnabled = true;
let lang = "ru";

const translations = {
  ru: {
    title: "Mail.ru AdBlocker+",
    theme: "Тема:",
    toggleTheme: dark => (dark ? "🌞 Светлая" : "🌙 Тёмная"),
    lang: "Язык:",
    toggleAds: enabled => (enabled ? "🚫 Выключить блокировку рекламы" : "✅ Включить блокировку рекламы"),
    reload: "🔄 Перезагрузить страницу",
    feedback: "✉️ Оставить отзыв",
  },
  en: {
    title: "Mail.ru AdBlocker+",
    theme: "Theme:",
    toggleTheme: dark => (dark ? "🌞 Light" : "🌙 Dark"),
    lang: "Language:",
    toggleAds: enabled => (enabled ? "🚫 Disable Ad Blocking" : "✅ Enable Ad Blocking"),
    reload: "🔄 Reload Page",
    feedback: "✉️ Send Feedback",
  }
};

chrome.storage.sync.get(["theme", "lang", "adEnabled"], (data) => {
  darkMode = data.theme === "dark";
  lang = data.lang || "ru";
  adEnabled = data.adEnabled !== false;

  updateUI();
});

themeBtn.addEventListener("click", () => {
  darkMode = !darkMode;
  chrome.storage.sync.set({ theme: darkMode ? "dark" : "light" });
  updateUI();
});

langSelect.addEventListener("change", () => {
  lang = langSelect.value;
  chrome.storage.sync.set({ lang });
  updateUI();
});

toggleAdsBtn.addEventListener("click", () => {
  adEnabled = !adEnabled;
  chrome.storage.sync.set({ adEnabled });
  chrome.runtime.sendMessage({ toggleAds: adEnabled });
  updateUI();
});

reloadBtn.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.tabs.reload(tab.id);
});

feedbackBtn.addEventListener("click", () => {
  window.open("mailto:darxaizov@yandex.ru?subject=Mail.ru AdBlocker+ Feedback", "_blank");
});

function updateUI() {
  const t = translations[lang];
  container.className = darkMode ? "dark" : "light";

  document.getElementById("title").textContent = t.title;
  document.getElementById("theme-label").textContent = t.theme;
  document.getElementById("lang-label").textContent = t.lang;
  themeBtn.textContent = t.toggleTheme(darkMode);
  toggleAdsBtn.textContent = t.toggleAds(adEnabled);
  reloadBtn.textContent = t.reload;
  feedbackBtn.textContent = t.feedback;
  langSelect.value = lang;
}
