// Main Content Script
// Entry point for the extension on any page

(async function init() {
    // 1. Singleton Check
    if (document.getElementById('pm-overlay-root')) return;

    // 2. Load Prefs
    // StorageUtils should be loaded by manifest chain
    if (!window.StorageUtils || !window.PrismOverlay) {
        console.error("Prism Lines: Dependencies not loaded.");
        return;
    }

    const host = window.location.hostname;
    const prefs = await window.StorageUtils.getPrefs(host);

    // 3. Create Shadow Host
    const shadowHost = document.createElement('div');
    shadowHost.id = "pm-overlay-root";
    shadowHost.style.all = "initial"; // Reset external CSS influence on the host itself
    document.body.appendChild(shadowHost);

    const shadowRoot = shadowHost.attachShadow({ mode: "open" });

    // 4. Inject CSS
    // Using link tag to load from extension resources
    const styleLink = document.createElement('link');
    styleLink.rel = "stylesheet";
    styleLink.href = chrome.runtime.getURL("src/injected/overlay.css");
    shadowRoot.appendChild(styleLink);

    // 5. Initialize Overlay
    const overlay = new window.PrismOverlay(prefs);
    overlay.init(shadowRoot);

    // 6. Message Listener
    // Note: We need to handle toggle requests that come from background
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.type === "PM_OVERLAY_TOGGLE") {
            overlay.toggleVisibility();
            sendResponse({ success: true });
        }
    });

    console.log("Prism Lines Overlay Injected.");

})();
