// Storage Utility
// Namespace for storage logic

const StorageUtils = {
    DEFAULT_PREFS: {
        x: 'unset', // default to css-based positioning (bottom-right)
        y: 'unset',
        width: 320,
        height: 640,
        collapsed: false,
        hidden: false
    },

    getDomainKey(domain) {
        return `overlay:${domain}`;
    },

    async getPrefs(domain) {
        return new Promise((resolve) => {
            const key = this.getDomainKey(domain);
            const globalKey = "overlay:global";

            chrome.storage.local.get([key, globalKey], (result) => {
                // Merge strategies: Domain Specific > Global User Prefs > Defaults
                const domainPrefs = result[key] || {};
                const globalPrefs = result[globalKey] || {};
                
                // If domain has never been set, use global. If global never set, use defaults.
                // We merge carefully: if a specific key is missing in domain, fallback.
                
                const final = {
                    ...this.DEFAULT_PREFS,
                    ...globalPrefs,
                    ...domainPrefs
                };
                resolve(final);
            });
        });
    },

    async setPrefs(domain, newPrefs) {
        const key = this.getDomainKey(domain);
        const globalKey = "overlay:global";

        // Get current partial prefs first to merge? Or assume full overwrite?
        // Let's assume the caller passes the full updated state or we get connection.
        // For simplicity, we save the full object provided as usage.
        
        const updates = {};
        updates[key] = newPrefs;
        
        // Also update global so next visited site uses latest size/position preference
        // Position on one site might not fit another, but user generally wants sizing consistent.
        // We'll save position too for now as per requirement "fallback".
        updates[globalKey] = newPrefs;

        return chrome.storage.local.set(updates);
    }
};

// Expose globally for subsequent scripts
window.StorageUtils = StorageUtils;
