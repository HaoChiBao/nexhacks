# Prismlines Overlay (Chrome Extension)

A Manifest V3 Chrome Extension that overlays the Prism Lines portfolio (https://prismlines.com/funds) on any webpage.

## Features
- **Global Overlay**: Inject an iframe portfolio widget on any site.
- **Draggable & Resizable**: Position the widget anywhere.
- **Persistent**: Remembers position, size, and collapsed state per domain (with global fallbacks).
- **Toggle**: Use `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac) or click the extension icon to show/hide.
- **Zero-Conflict**: Uses Shadow DOM to isolate styles from the host page.

## Installation

1.  **Open Chrome Extensions**
    -   Go to `chrome://extensions/`
    -   Enable **Developer mode** (top right toggle).

2.  **Load Unpacked**
    -   Click **Load unpacked**.
    -   Select the `chrome-extension` folder inside this repository.

3.  **Test**
    -   Go to any website (e.g., `google.com`).
    -   You should see the "PrintMoney" widget in the bottom right, or press `Ctrl+Shift+P` to toggle it.

## Build Information
This extension uses Vanilla JavaScript and required no compilation step. It uses strict Content Security Policy (CSP) compliance by loading scripts sequentially via the manifest.
