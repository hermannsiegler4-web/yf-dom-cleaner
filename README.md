# 🧹 Yahoo Finance DOM Cleaner

> 






---

## 📖 Description

 is a lightweight userscript for  and  that automatically removes unwanted DOM elements from .

Unlike simple one-shot scripts, it leverages the  to watch for nodes injected  the initial page load — ensuring that lazy-loaded, deferred, or dynamically rendered elements are caught and removed the moment they appear in the DOM.

---

## ✨ Features

- 🪶  — zero external dependencies, pure vanilla JavaScript
- ⚡  — targets elements on page load and in real time
- 👁️  — intercepts dynamically injected and lazy-loaded nodes
- 🔧  — add or remove element IDs from a single array at the top of the script
- 🌐  — runs across all Yahoo Finance subpages (` 🔒  — makes no network requests, stores no data, touches nothing outside the target IDs

---

## 📦 Installation

### Prerequisites

Install a userscript manager for your browser:

| Browser | Recommended Extension |
|---|---|
| Chrome / Edge / Brave |  |
| Firefox |  or  |
| Safari |  |

---

### 🟢 Option A — One-Click Install (Recommended)

Click the link below. Your userscript manager will automatically prompt you to install the script.

> 



---

### 🔵 Option B — Manual Install (Tampermonkey)

1. Open your browser and click the  extension icon.
2. Select  from the dropdown menu.
3. Delete all placeholder content in the editor.
4. Copy the full contents of  from this repository.
5. Paste it into the Tampermonkey editor.
6. Press  (or  on macOS) to save.
7. Navigate to  — the script is now active. ✅

---

### 🟠 Option C — Manual Install (Greasemonkey)

1. Open  and click the  extension icon.
2. Click the  → .
3. Fill in the metadata fields, or dismiss and edit the raw script directly.
4. Copy and paste the full contents of .
5. Save the script.
6. Visit  to confirm it is running. ✅

---

## ⚙️ Configuration

All target element IDs are defined in a single array near the top of the script. Editing this array is the .

```javascript
// ─── CONFIGURATION ──────────────────────────────────────────────
// Add or remove element IDs here to control what gets stripped.
const ELEMENT_IDS_TO_REMOVE = [
  'sda-E2E',        // Default: known unwanted element
  // 'some-other-id',
  // 'another-element',
];
// ────────────────────────────────────────────────────────────────
```

### ➕ Adding a New Target Element

1. On Yahoo Finance, right-click the element you want to remove.
2. Select  to open DevTools.
3. Find the element's `id` attribute in the HTML panel.
4. Add that ID as a string to the `ELEMENT_IDS_TO_REMOVE` array.
5. Save the script — it takes effect immediately on the next page load.



```javascript
const ELEMENT_IDS_TO_REMOVE = [
  'sda-E2E',
  'promo-banner',   // ← newly added
];
```

> ⚠️  Only `id` attributes are supported in the current version. Class-based or selector-based targeting is planned for a future release.

---

## 🔬 How It Works

The script uses a two-phase removal strategy to handle both static and dynamic content.

### Phase 1 — Immediate Sweep

When the script first runs (`@run-at document-start`), it performs an immediate pass over the current DOM using `document.getElementById()` for each ID in the configuration array.

```javascript
function removeTargetElements() {
  ELEMENT_IDS_TO_REMOVE.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.remove();
      console.debug(`[DOM Cleaner] Removed #${id}`);
    }
  });
}

// Initial sweep
removeTargetElements();
```

### Phase 2 — MutationObserver Watch

A `MutationObserver` is then attached to `document.body`, watching for any new nodes added to the DOM subtree. Each time new nodes are injected — regardless of when or how — the observer fires the removal function again.

```javascript
const observer = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
    if (mutation.addedNodes.length > 0) {
      removeTargetElements();
    }
  });
});

observer.observe(document.body, {
  childList: true,   // watch for added/removed child nodes
  subtree: true,     // observe all descendants, not just direct children
});
```

### Flow Diagram

```
Page Load
    │
    ▼
Run removeTargetElements()  ──→  Removes any existing target nodes
    │
    ▼
Attach MutationObserver on <body>
    │
    ▼
New node injected into DOM?
    │
   YES
    │
    ▼
Run removeTargetElements()  ──→  Removes newly injected target nodes
    │
    └──→ Continue watching...
```

---

## 🚀 GitHub Pages Deployment

This repository is configured to serve the raw `.user.js` file via , enabling the one-click install link.

### How It Works

A  workflow automatically deploys the `yahoo-finance-dom-cleaner.user.js` file to the `gh-pages` branch whenever changes are pushed to `main`.

```
Push to main
    │
    ▼
GitHub Actions workflow triggers
    │
    ▼
Copies .user.js to gh-pages branch
    │
    ▼
File served at:
https://<username>.github.io/<repo>/yahoo-finance-dom-cleaner.user.js
```

### Enabling GitHub Pages for Your Fork

1. Go to your repository →  → .
2. Under , select .
3. Choose the  branch and  folder.
4. Click .
5. Wait ~60 seconds, then your install URL will be live.
6. Update the install link in this README with your actual URL:
   ```
   https://<your-github-username>.github.io/<repo-name>/yahoo-finance-dom-cleaner.user.js
   ```

---

## 🤝 Contributing

Contributions are welcome and appreciated! Here's how to get involved:

1.  this repository.
2.  a feature branch:
   ```bash
   git checkout -b feature/my-improvement
   ```
3.  your changes with a clear message:
   ```bash
   git commit -m "feat: add selector-based targeting support"
   ```
4.  to your fork:
   ```bash
   git push origin feature/my-improvement
   ```
5.  against the `main` branch of this repository.

### 💡 Ideas for Contribution

- [ ] Add support for CSS class-based targeting
- [ ] Add support for arbitrary CSS selectors
- [ ] Provide a settings UI via Tampermonkey's `GM_registerMenuCommand`
- [ ] Add a toggle to temporarily disable removal without uninstalling
- [ ] Write automated tests using a DOM testing framework

> Please open an  before starting significant work so we can discuss the approach first.

---

## 📄 License

This project is licensed under the  — you are free to use, modify, and distribute it.

```
MIT License

Copyright (c) 2024 <Your Name>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<div align="center">

Made with ❤️ for a cleaner browsing experience.



</div>