// Background Service Worker

// Handle keyboard shortcut
chrome.commands.onCommand.addListener((command) => {
    if (command === "toggle-overlay") {
        toggleOverlay();
    }
});

// Handle toolbar icon click
chrome.action.onClicked.addListener((tab) => {
    toggleOverlay();
});

function toggleOverlay() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0] && tabs[0].id) {
            chrome.tabs.sendMessage(tabs[0].id, { type: "PM_OVERLAY_TOGGLE" })
                .catch(err => {
                    // Content script might not be loaded yet or on chrome:// page
                    console.log("Could not send toggle message (extension context invalid or page restricted):", err);
                });
        }
    });
}
