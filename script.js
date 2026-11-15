/* ==========================================
   TECHJI OS 1.1
   COMPLETE OPERATING SYSTEM ENVIRONMENT
========================================== */

// ELEMENTS
const desktop = document.getElementById("desktop");
const windowArea = document.getElementById("window-area");
const taskbarApps = document.getElementById("taskbar-apps");
const startMenu = document.getElementById("start-menu");
const startButton = document.getElementById("start-button");

// SYSTEM VARIABLES
let windows = {};
let topZ = 10;
let windowCount = 0;

// STORAGE
function loadStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved === null ? fallback : JSON.parse(saved);
  } catch (error) {
    console.error("Storage loading error:", error);
    return fallback;
  }
}

function saveStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error("Storage saving error:", error);
    return false;
  }
}

// APPLICATIONS
const apps = {
  Computer: {
    icon: "💻",
    title: "My Computer"
  },
  Files: {
    icon: "📁",
    title: "File Manager"
  },
  Notes: {
    icon: "📝",
    title: "Notes"
  },
  Settings: {
    icon: "⚙️",
    title: "Settings"
  },
  Browser: {
    icon: "🌐",
    title: "TECHJI Web"
  }
};

// FILE SYSTEM
let files = loadStorage("techji_files", [
  {
    id: 1,
    name: "Welcome.txt",
    content: "Welcome to TECHJI OS 1.1!"
  },
  {
    id: 2,
    name: "My Project.txt",
    content: "My first TECHJI project."
  }
]);

if (!Array.isArray(files)) files = [];

let nextFileId = Math.max(
  0,
  ...files.map(file => Number(file.id) || 0)
) + 1;

// NOTES
let notes = loadStorage("techji_notes", "");

if (typeof notes !== "string") notes = "";

// SETTINGS
let systemSettings = loadStorage("techji_settings", {
  theme: "dark",
  accent: "#63b9ff",
  wallpaper: "ocean"
});

const validThemes = ["dark", "light"];

const validColors = [
  "#63b9ff",
  "#a78bfa",
  "#42d6a4",
  "#ff8b8b",
  "#f4bd55"
];

const validWallpapers = [
  "ocean",
  "sunset",
  "forest",
  "midnight"
];

if (!validThemes.includes(systemSettings.theme)) {
  systemSettings.theme = "dark";
}

if (!validColors.includes(systemSettings.accent)) {
  systemSettings.accent = "#63b9ff";
}

if (!validWallpapers.includes(systemSettings.wallpaper)) {
  systemSettings.wallpaper = "ocean";
}

// APPLY SETTINGS
function applySettings() {
  desktop.dataset.theme = systemSettings.theme;
  desktop.dataset.wallpaper = systemSettings.wallpaper;

  desktop.style.setProperty(
    "--accent",
    systemSettings.accent
  );
}

function updateSettings() {
  saveStorage("techji_settings", systemSettings);
  applySettings();
}

applySettings();

// ==========================================
// TECHJI BOOT SYSTEM
// ==========================================

function startBoot() {
  const bootScreen = document.getElementById("boot-screen");
  const progress = document.getElementById("boot-progress");
  const status = document.getElementById("boot-status");

  if (!bootScreen) return;

  const stages = [
    {
      progress: 10,
      text: "Initializing system..."
    },
    {
      progress: 30,
      text: "Loading desktop environment..."
    },
    {
      progress: 50,
      text: "Loading applications..."
    },
    {
      progress: 75,
      text: "Preparing user interface..."
    },
    {
      progress: 90,
      text: "Starting TECHJI services..."
    },
    {
      progress: 100,
      text: "Welcome to TECHJI OS."
    }
  ];

  let currentStage = 0;

  const bootInterval = setInterval(() => {
    if (currentStage >= stages.length) {
      clearInterval(bootInterval);

      setTimeout(() => {
        bootScreen.classList.add("boot-finished");
      }, 500);

      return;
    }

    const stage = stages[currentStage];

    progress.style.width = stage.progress + "%";
    status.textContent = stage.text;

    currentStage++;
  }, 450);
}

startBoot();

// ==========================================
// START MENU
// ==========================================

function toggleStart() {
  startMenu.classList.toggle("hidden");

  if (!startMenu.classList.contains("hidden")) {
    const search = document.getElementById("app-search");

    search.value = "";
    filterApps("");
    search.focus();
  }
}

startButton.addEventListener("click", toggleStart);

// APP SEARCH
function filterApps(query) {
  const buttons = document.querySelectorAll(
    "#start-app-list button"
  );

  buttons.forEach(button => {
    const matches = button.textContent
      .toLowerCase()
      .includes(query.toLowerCase());

    button.style.display = matches ? "block" : "none";
  });
}

document.getElementById("app-search")
  .addEventListener("input", event => {
    filterApps(event.target.value);
  });

// APP BUTTONS
document.addEventListener("click", event => {
  const button = event.target.closest("[data-app]");

  if (!button) return;

  openApp(button.dataset.app);
});

// ==========================================
// OPEN APPLICATION
// ==========================================

function openApp(name) {
  startMenu.classList.add("hidden");

  if (!apps[name]) return;

  if (windows[name]) {
    restoreWindow(name);
    focusWindow(name);
    return;
  }

  windowCount++;

  const win = document.createElement("section");
  win.className = "window";

  win.style.top =
    `${40 + (windowCount % 5) * 30}px`;

  win.style.left =
    `${70 + (windowCount % 5) * 35}px`;

  if (name === "Browser") {
    win.style.width = "min(1000px, 90vw)";
    win.style.height = "min(650px, 80vh)";
  }

  // WINDOW HEADER
  const header = document.createElement("header");
  header.className = "window-header";

  const title = document.createElement("span");
  title.className = "window-title";
  title.textContent =
    `${apps[name].icon} ${apps[name].title}`;

  const controls = document.createElement("div");
  controls.className = "window-controls";

  const minButton = document.createElement("button");
  minButton.className = "min-button";
  minButton.textContent = "—";
  minButton.title = "Minimize";

  const maxButton = document.createElement("button");
  maxButton.className = "max-button";
  maxButton.textContent = "□";
  maxButton.title = "Maximize";

  const closeButton = document.createElement("button");
  closeButton.className = "close-button";
  closeButton.textContent = "✕";
  closeButton.title = "Close";

  controls.append(minButton, maxButton, closeButton);
  header.append(title, controls);

  // WINDOW CONTENT
  const content = document.createElement("div");
  content.className = "window-content";

  win.append(header, content);
  windowArea.appendChild(win);

  // TASKBAR BUTTON
  const taskButton = document.createElement("button");
  taskButton.className = "taskbar-app";
  taskButton.textContent =
    `${apps[name].icon} ${name}`;

  taskbarApps.appendChild(taskButton);

  // SAVE WINDOW INFORMATION
  windows[name] = {
    element: win,
    taskButton: taskButton,
    maximized: false,
    minimized: false,
    previous: null
  };

  // WINDOW CONTROLS
  minButton.addEventListener("click", () => {
    minimizeWindow(name);
  });

  maxButton.addEventListener("click", () => {
    maximizeWindow(name);
  });

  closeButton.addEventListener("click", () => {
    closeWindow(name);
  });

  taskButton.addEventListener("click", () => {
    toggleWindow(name);
  });

  win.addEventListener("pointerdown", () => {
    focusWindow(name);
  });

  makeDraggable(win, header, name);

  renderApp(name);
  focusWindow(name);
}

// ==========================================
// APPLICATION CONTENT
// ==========================================

function renderApp(name) {
  const content =
    windows[name].element.querySelector(".window-content");

  if (name === "Computer") {
    content.innerHTML = `
      <h2>Welcome to TECHJI OS</h2>
      <p>Your personal desktop environment.</p>

      <div class="settings-section">
        <h3>System Information</h3>
        <p>Operating System: TECHJI OS</p>
        <p>Version: 1.1</p>
        <p>Environment: TECHJI Desktop</p>
        <p>Status: Running</p>
        <p>Installed Applications: 5</p>
      </div>

      <div class="settings-section">
        <h3>Storage</h3>
        <p>Virtual files: ${files.length}</p>
      </div>
    `;
  }

  // FILE MANAGER
  if (name === "Files") {
    content.innerHTML = `
      <h2>📁 File Manager</h2>
      <p>Manage your TECHJI virtual files.</p>

      <div class="app-toolbar">
        <input
          id="new-file-name"
          placeholder="Enter file name..."
          maxlength="80"
        >

        <button class="app-button" id="create-file">
          + Create
        </button>
      </div>

      <div id="file-list"></div>
    `;

    content.querySelector("#create-file")
      .addEventListener("click", createFile);

    content.querySelector("#new-file-name")
      .addEventListener("keydown", event => {
        if (event.key === "Enter") createFile();
      });

    renderFiles();
  }

  // NOTES
  if (name === "Notes") {
    content.innerHTML = `
      <h2>📝 Notes</h2>
      <p>Your notes are saved automatically.</p>

      <textarea
        class="notes-editor"
        id="notes-text"
        placeholder="Start writing something..."
      ></textarea>

      <div class="save-status" id="notes-status">
        Ready
      </div>
    `;

    const editor = content.querySelector("#notes-text");
    const status = content.querySelector("#notes-status");

    editor.value = notes;

    editor.addEventListener("input", () => {
      notes = editor.value;

      const saved = saveStorage("techji_notes", notes);

      status.textContent = saved
        ? "✓ All changes saved"
        : "Save failed";
    });
  }  // SETTINGS
  if (name === "Settings") {
    content.innerHTML = `
      <h2>⚙️ Personalization</h2>
      <p>Customize your TECHJI experience.</p>

      <div class="settings-section">
        <h3>Appearance</h3>

        <div class="settings-options">
          <button class="settings-option"
            data-theme-choice="dark">
            🌙 Dark
          </button>

          <button class="settings-option"
            data-theme-choice="light">
            ☀️ Light
          </button>
        </div>
      </div>

      <div class="settings-section">
        <h3>Accent Color</h3>

        <div class="settings-options">
          <button class="color-option"
            data-color="#63b9ff"
            style="background:#63b9ff"
            aria-label="Blue"></button>

          <button class="color-option"
            data-color="#a78bfa"
            style="background:#a78bfa"
            aria-label="Purple"></button>

          <button class="color-option"
            data-color="#42d6a4"
            style="background:#42d6a4"
            aria-label="Green"></button>

          <button class="color-option"
            data-color="#ff8b8b"
            style="background:#ff8b8b"
            aria-label="Red"></button>

          <button class="color-option"
            data-color="#f4bd55"
            style="background:#f4bd55"
            aria-label="Orange"></button>
        </div>
      </div>

      <div class="settings-section">
        <h3>Desktop Wallpaper</h3>

        <div class="settings-options">
          <button class="settings-option"
            data-wallpaper-choice="ocean">
            🌊 Ocean
          </button>

          <button class="settings-option"
            data-wallpaper-choice="sunset">
            🌅 Sunset
          </button>

          <button class="settings-option"
            data-wallpaper-choice="forest">
            🌲 Forest
          </button>

          <button class="settings-option"
            data-wallpaper-choice="midnight">
            🌌 Midnight
          </button>
        </div>
      </div>

      <div class="settings-section">
        <h3>System Information</h3>
        <p>TECHJI OS Version 1.1</p>
        <p>Desktop Environment: TECHJI</p>
        <p>Status: Running</p>
      </div>
    `;

    setupSettings(content);
  }

  // TECHJI WEB
  if (name === "Browser") {
    content.innerHTML = `
      <div class="browser">

        <div class="browser-tabs" id="browser-tabs">
          <button class="browser-new-tab"
            id="browser-new-tab"
            title="New tab">
            +
          </button>
        </div>

        <div class="browser-toolbar">

          <button class="browser-nav-button"
            id="browser-back"
            title="Back">
            ←
          </button>

          <button class="browser-nav-button"
            id="browser-forward"
            title="Forward">
            →
          </button>

          <button class="browser-nav-button"
            id="browser-reload"
            title="Reload">
            ↻
          </button>

          <button class="browser-nav-button"
            id="browser-home-button"
            title="Home">
            ⌂
          </button>

          <input
            class="browser-address"
            id="browser-address"
            placeholder="Search Google or enter a website..."
            autocomplete="off"
          >

          <button class="browser-go" id="browser-go">
            Go
          </button>

        </div>

        <div class="browser-viewport" id="browser-viewport">
        </div>

        <div class="browser-status" id="browser-status">
          TECHJI Web is ready.
        </div>

      </div>
    `;

    setupBrowser(content);
  }
}

// ==========================================
// SETTINGS CONTROLS
// ==========================================

function setupSettings(content) {

  function refreshSelection() {

    content.querySelectorAll("[data-theme-choice]")
      .forEach(button => {
        button.classList.toggle(
          "selected",
          button.dataset.themeChoice === systemSettings.theme
        );
      });

    content.querySelectorAll("[data-color]")
      .forEach(button => {
        button.classList.toggle(
          "selected",
          button.dataset.color === systemSettings.accent
        );
      });

    content.querySelectorAll("[data-wallpaper-choice]")
      .forEach(button => {
        button.classList.toggle(
          "selected",
          button.dataset.wallpaperChoice === systemSettings.wallpaper
        );
      });
  }

  content.querySelectorAll("[data-theme-choice]")
    .forEach(button => {
      button.addEventListener("click", () => {
        systemSettings.theme = button.dataset.themeChoice;

        updateSettings();
        refreshSelection();
      });
    });

  content.querySelectorAll("[data-color]")
    .forEach(button => {
      button.addEventListener("click", () => {
        systemSettings.accent = button.dataset.color;

        updateSettings();
        refreshSelection();
      });
    });

  content.querySelectorAll("[data-wallpaper-choice]")
    .forEach(button => {
      button.addEventListener("click", () => {
        systemSettings.wallpaper =
          button.dataset.wallpaperChoice;

        updateSettings();
        refreshSelection();
      });
    });

  refreshSelection();
}

// ==========================================
// TECHJI WEB BROWSER ENGINE
// ==========================================

let browserTabs = [];
let activeBrowserTab = 0;

// CREATE BROWSER TAB
function createBrowserTab(url = "") {

  browserTabs.push({
    id: Date.now() + Math.random(),
    url: url,
    history: [],
    historyIndex: -1,
    title: "New Tab"
  });

  activeBrowserTab = browserTabs.length - 1;

  renderBrowser();
}

// GET ACTIVE TAB
function getBrowserTab() {
  return browserTabs[activeBrowserTab];
}

// SETUP BROWSER
function setupBrowser(content) {

  browserTabs = [];
  activeBrowserTab = 0;

  const address = content.querySelector("#browser-address");

  content.querySelector("#browser-new-tab")
    .addEventListener("click", () => {
      createBrowserTab();
    });

  content.querySelector("#browser-go")
    .addEventListener("click", () => {
      browserNavigate(address.value);
    });

  address.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      browserNavigate(address.value);
    }
  });

  content.querySelector("#browser-back")
    .addEventListener("click", browserBack);

  content.querySelector("#browser-forward")
    .addEventListener("click", browserForward);

  content.querySelector("#browser-reload")
    .addEventListener("click", browserReload);

  content.querySelector("#browser-home-button")
    .addEventListener("click", browserHome);

  createBrowserTab();
}

// ==========================================
// URL PROCESSING
// ==========================================

function processBrowserURL(input) {

  let value = input.trim();

  if (!value) return null;

  // Treat ordinary text as a Google search
  if (
    value.includes(" ") ||
    (!value.includes(".") && !/^https?:\/\//i.test(value))
  ) {
    return "https://www.google.com/search?q=" +
      encodeURIComponent(value);
  }

  // Add HTTPS if no protocol was supplied
  if (!/^https?:\/\//i.test(value)) {
    value = "https://" + value;
  }

  try {
    const parsed = new URL(value);

    if (!["http:", "https:"].includes(parsed.protocol)) {
      return null;
    }

    return parsed.href;

  } catch (error) {
    return null;
  }
}

// ==========================================
// BROWSER NAVIGATION
// ==========================================

function browserNavigate(input) {

  const url = processBrowserURL(input);
  const tab = getBrowserTab();

  if (!url || !tab) {
    setBrowserStatus("Please enter a valid website or search.");
    return;
  }

  // Remove forward history when navigating to a new page
  tab.history = tab.history.slice(
    0,
    tab.historyIndex + 1
  );

  tab.history.push(url);
  tab.historyIndex = tab.history.length - 1;
  tab.url = url;

  try {
    tab.title = new URL(url).hostname;
  } catch (error) {
    tab.title = "Website";
  }

  renderBrowser();
}

// ==========================================
// RENDER BROWSER
// ==========================================

function renderBrowser() {

  const data = windows.Browser;

  if (!data) return;

  const content =
    data.element.querySelector(".window-content");

  const tabsElement =
    content.querySelector("#browser-tabs");

  const viewport =
    content.querySelector("#browser-viewport");

  const address =
    content.querySelector("#browser-address");

  const tab = getBrowserTab();

  if (!tab) return;

  // RENDER TABS
  tabsElement.innerHTML = "";

  browserTabs.forEach((browserTab, index) => {

    const tabButton = document.createElement("button");

    tabButton.className =
      "browser-tab" +
      (index === activeBrowserTab ? " active" : "");

    const tabTitle = document.createElement("span");
    tabTitle.className = "browser-tab-title";
    tabTitle.textContent = browserTab.title || "New Tab";

    const closeButton = document.createElement("button");
    closeButton.className = "browser-tab-close";
    closeButton.textContent = "×";
    closeButton.title = "Close tab";

    closeButton.addEventListener("click", event => {
      event.stopPropagation();
      closeBrowserTab(index);
    });

    tabButton.append(tabTitle, closeButton);

    tabButton.addEventListener("click", () => {
      activeBrowserTab = index;
      renderBrowser();
    });

    tabsElement.appendChild(tabButton);
  });

  // NEW TAB BUTTON
  const newTabButton =
    content.querySelector("#browser-new-tab");

  tabsElement.appendChild(newTabButton);

  // ADDRESS BAR
  address.value = tab.url || "";

  // CLEAR VIEWPORT
  viewport.innerHTML = "";

  // HOME PAGE
  if (!tab.url) {

    viewport.innerHTML = `
      <div class="browser-home">

        <div class="browser-home-logo">T</div>

        <h2>TECHJI WEB</h2>

        <p>Your window to the internet.</p>

        <form class="browser-home-search"
          id="browser-home-search">

          <input
            id="browser-home-input"
            placeholder="Search the web..."
            autocomplete="off"
          >

          <button type="submit">
            Search
          </button>

        </form>

        <div class="browser-home-links">

          <button data-site="https://www.google.com">
            Google
          </button>

          <button data-site="https://www.youtube.com">
            YouTube
          </button>

          <button data-site="https://www.wikipedia.org">
            Wikipedia
          </button>

        </div>

      </div>
    `;

    content.querySelector("#browser-home-search")
      .addEventListener("submit", event => {

        event.preventDefault();

        browserNavigate(
          content.querySelector("#browser-home-input").value
        );

      });

    content.querySelectorAll("[data-site]")
      .forEach(button => {

        button.addEventListener("click", () => {
          browserNavigate(button.dataset.site);
        });

      });

    setBrowserStatus("Welcome to TECHJI Web.");

    return;
  }

  // WEBSITE VIEW
  const frame = document.createElement("iframe");

  frame.className = "browser-frame";
  frame.title = "TECHJI Web browser";

  frame.setAttribute(
    "sandbox",
    "allow-forms allow-scripts allow-popups"
  );

  frame.referrerPolicy = "strict-origin-when-cross-origin";
  frame.src = tab.url;

  frame.addEventListener("load", () => {
    setBrowserStatus(
      "Website loaded. Some sites may restrict embedding."
    );
  });

  viewport.appendChild(frame);

  // EXTERNAL OPEN OPTION
  const external = document.createElement("div");

  external.className = "browser-external";

  external.innerHTML = `
    Having trouble viewing this website?

    <button id="browser-external-open">
      Open externally ↗
    </button>
  `;

  const openButton =
    external.querySelector("#browser-external-open");

  openButton.addEventListener("click", () => {
    window.open(
      tab.url,
      "_blank",
      "noopener,noreferrer"
    );
  });

  viewport.appendChild(external);

  setBrowserStatus("Loading " + tab.title + "...");
}

// ==========================================
// CLOSE BROWSER TAB
// ==========================================

function closeBrowserTab(index) {

  if (browserTabs.length === 1) {
    browserTabs = [];
    createBrowserTab();
    return;
  }

  browserTabs.splice(index, 1);

  if (activeBrowserTab >= browserTabs.length) {
    activeBrowserTab = browserTabs.length - 1;
  } else if (index < activeBrowserTab) {
    activeBrowserTab--;
  }

  renderBrowser();
}

// ==========================================
// BROWSER BACK
// ==========================================

function browserBack() {

  const tab = getBrowserTab();

  if (!tab || tab.historyIndex <= 0) return;

  tab.historyIndex--;
  tab.url = tab.history[tab.historyIndex];

  try {
    tab.title = new URL(tab.url).hostname;
  } catch (error) {
    tab.title = "Website";
  }

  renderBrowser();
}

// ==========================================
// BROWSER FORWARD
// ==========================================

function browserForward() {

  const tab = getBrowserTab();

  if (
    !tab ||
    tab.historyIndex >= tab.history.length - 1
  ) return;

  tab.historyIndex++;
  tab.url = tab.history[tab.historyIndex];

  try {
    tab.title = new URL(tab.url).hostname;
  } catch (error) {
    tab.title = "Website";
  }

  renderBrowser();
}

// ==========================================
// BROWSER RELOAD
// ==========================================

function browserReload() {

  const tab = getBrowserTab();

  if (!tab || !tab.url) {
    renderBrowser();
    return;
  }

  renderBrowser();
}

// ==========================================
// BROWSER HOME
// ==========================================

function browserHome() {

  const tab = getBrowserTab();

  if (!tab) return;

  tab.url = "";
  tab.title = "New Tab";

  renderBrowser();
}

// ==========================================
// BROWSER STATUS
// ==========================================

function setBrowserStatus(message) {

  const status =
    windows.Browser?.element.querySelector("#browser-status");

  if (status) {
    status.textContent = message;
  }
}// ==========================================
// FILE MANAGER
// ==========================================

function renderFiles() {

  const list =
    windows.Files?.element.querySelector("#file-list");

  if (!list) return;

  list.replaceChildren();

  if (files.length === 0) {

    const empty = document.createElement("p");

    empty.textContent =
      "No files yet. Create your first file!";

    list.appendChild(empty);

    return;
  }

  files.forEach(file => {

    const item = document.createElement("div");
    item.className = "file-item";

    const icon = document.createElement("span");
    icon.textContent = "📄";

    const label = document.createElement("span");
    label.className = "file-name";
    label.textContent = file.name;

    const open = document.createElement("button");
    open.textContent = "Open";

    open.addEventListener("click", () => {
      editFile(file.id);
    });

    const rename = document.createElement("button");
    rename.textContent = "Rename";

    rename.addEventListener("click", () => {
      renameFile(file.id);
    });

    const remove = document.createElement("button");
    remove.textContent = "Delete";

    remove.addEventListener("click", () => {
      deleteFile(file.id);
    });

    item.append(icon, label, open, rename, remove);
    list.appendChild(item);

  });
}

// ==========================================
// CREATE FILE
// ==========================================

function createFile() {

  const input =
    windows.Files.element.querySelector("#new-file-name");

  const name = input.value.trim();

  if (!name) {
    alert("Please enter a file name.");
    return;
  }

  const file = {
    id: nextFileId++,
    name: name,
    content: ""
  };

  files.push(file);

  if (saveStorage("techji_files", files)) {

    input.value = "";
    renderFiles();

  } else {

    files.pop();
    nextFileId--;

  }
}

// ==========================================
// OPEN AND EDIT FILE
// ==========================================

function editFile(id) {

  const file = files.find(file => file.id === id);

  if (!file) return;

  const updated = prompt(
    "Edit contents of " + file.name,
    file.content
  );

  if (updated === null) return;

  const oldContent = file.content;

  file.content = updated;

  if (!saveStorage("techji_files", files)) {
    file.content = oldContent;
  }
}

// ==========================================
// RENAME FILE
// ==========================================

function renameFile(id) {

  const file = files.find(file => file.id === id);

  if (!file) return;

  const updated = prompt(
    "Enter new file name:",
    file.name
  );

  if (updated === null || !updated.trim()) return;

  const oldName = file.name;

  file.name = updated.trim();

  if (saveStorage("techji_files", files)) {

    renderFiles();

  } else {

    file.name = oldName;

  }
}

// ==========================================
// DELETE FILE
// ==========================================

function deleteFile(id) {

  const file = files.find(file => file.id === id);

  if (!file) return;

  if (!confirm("Delete " + file.name + "?")) return;

  const oldFiles = files;

  files = files.filter(file => file.id !== id);

  if (saveStorage("techji_files", files)) {

    renderFiles();

  } else {

    files = oldFiles;

  }
}

// ==========================================
// WINDOW FOCUS
// ==========================================

function focusWindow(name) {

  const data = windows[name];

  if (!data || data.minimized) return;

  topZ++;

  data.element.style.zIndex = topZ;

  Object.entries(windows).forEach(([appName, app]) => {

    app.taskButton.classList.toggle(
      "active",
      appName === name
    );

  });
}

// ==========================================
// MINIMIZE WINDOW
// ==========================================

function minimizeWindow(name) {

  const data = windows[name];

  if (!data) return;

  data.minimized = true;

  data.element.classList.add("minimized");

  data.taskButton.classList.remove("active");
}

// ==========================================
// RESTORE WINDOW
// ==========================================

function restoreWindow(name) {

  const data = windows[name];

  if (!data) return;

  data.minimized = false;

  data.element.classList.remove("minimized");
}

// ==========================================
// MAXIMIZE WINDOW
// ==========================================

function maximizeWindow(name) {

  const data = windows[name];

  if (!data) return;

  const win = data.element;

  if (!data.maximized) {

    data.previous = {
      top: win.style.top,
      left: win.style.left,
      width: win.style.width,
      height: win.style.height
    };

    win.classList.add("maximized");

    data.maximized = true;

  } else {

    win.classList.remove("maximized");

    if (data.previous) {
      Object.assign(win.style, data.previous);
    }

    data.maximized = false;
  }

  focusWindow(name);
}

// ==========================================
// CLOSE WINDOW
// ==========================================

function closeWindow(name) {

  const data = windows[name];

  if (!data) return;

  data.element.remove();
  data.taskButton.remove();

  delete windows[name];

  if (name === "Browser") {

    browserTabs = [];
    activeBrowserTab = 0;

  }
}

// ==========================================
// TASKBAR WINDOW CONTROL
// ==========================================

function toggleWindow(name) {

  const data = windows[name];

  if (!data) return;

  if (data.minimized) {

    restoreWindow(name);
    focusWindow(name);

  } else if (
    data.taskButton.classList.contains("active")
  ) {

    minimizeWindow(name);

  } else {

    focusWindow(name);

  }
}

// ==========================================
// DRAG WINDOWS
// ==========================================

function makeDraggable(win, header, name) {

  let dragging = false;

  let startX = 0;
  let startY = 0;

  let originalX = 0;
  let originalY = 0;

  header.addEventListener("pointerdown", event => {

    if (event.target.closest("button")) return;

    if (windows[name].maximized) return;

    dragging = true;

    startX = event.clientX;
    startY = event.clientY;

    originalX = win.offsetLeft;
    originalY = win.offsetTop;

    header.setPointerCapture(event.pointerId);

    focusWindow(name);

  });

  header.addEventListener("pointermove", event => {

    if (!dragging) return;

    const newX =
      originalX + event.clientX - startX;

    const newY =
      originalY + event.clientY - startY;

    const maxX = window.innerWidth - 100;
    const maxY = window.innerHeight - 100;

    win.style.left =
      `${Math.max(0, Math.min(newX, maxX))}px`;

    win.style.top =
      `${Math.max(0, Math.min(newY, maxY))}px`;

  });

  header.addEventListener("pointerup", () => {
    dragging = false;
  });

  header.addEventListener("pointercancel", () => {
    dragging = false;
  });
}

// ==========================================
// CLOCK
// ==========================================

function updateClock() {

  document.getElementById("clock").textContent =
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });

}

updateClock();

setInterval(updateClock, 1000);

// ==========================================
// SYSTEM STARTED
// ==========================================

console.log("TECHJI OS 1.1 started successfully.");