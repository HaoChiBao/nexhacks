// Overlay Logic
// Assumes StorageUtils is loaded

class PrismOverlay {
    constructor(prefs) {
        this.prefs = prefs;
        this.root = null;
        this.container = null;
        this.host = window.location.hostname;
        
        // State
        this.isDragging = false;
        this.isResizing = false;
        this.dragOffset = { x: 0, y: 0 };
        this.resizeStart = { w: 0, h: 0, x: 0, y: 0 }; // x,y needed to calc delta
    }

    init(shadowRoot) {
        this.root = shadowRoot;
        this.render();
        this.attatchListeners();
        this.applyPrefs();
    }

    render() {
        // SVG Icons
        const ICON_MINIMIZE = `<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>`;
        const ICON_MAXIMIZE = `<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>`;
        const ICON_EXTERNAL = `<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>`;
        const ICON_CLOSE = `<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;

        const html = `
            <div id="pm-container" class="${this.prefs.collapsed ? 'collapsed' : ''} ${this.prefs.hidden ? 'hidden' : ''}">
                <div id="pm-header">
                    <div class="pm-logo">
                        <span style="color:#10b981;">◆</span> Prismlines
                    </div>
                    <div class="pm-controls">
                        <button id="btn-collapse" class="pm-btn" title="Toggle Size">
                            ${this.prefs.collapsed ? ICON_MAXIMIZE : ICON_MINIMIZE}
                        </button>
                        <button id="btn-external" class="pm-btn" title="Open in New Tab">
                            ${ICON_EXTERNAL}
                        </button>
                        <button id="btn-close" class="pm-btn" title="Hide Overlay (Ctrl+Shift+P)">
                            ${ICON_CLOSE}
                        </button>
                    </div>
                </div>
                <iframe src="https://prismlines.com/funds" allow="clipboard-read; clipboard-write"></iframe>
                <div id="pm-resize-handle"></div>
            </div>
        `;

        // Inject HTML
        const wrapper = document.createElement('div');
        wrapper.innerHTML = html;
        this.root.appendChild(wrapper.firstElementChild);
        this.container = this.root.getElementById('pm-container');
    }

    applyPrefs() {
        const { x, y, width, height, collapsed, hidden } = this.prefs;
        
        if (x !== 'unset' && y !== 'unset') {
            this.container.style.left = x + 'px';
            this.container.style.top = y + 'px';
            this.container.style.right = 'auto';
            this.container.style.bottom = 'auto'; // Disable default bottom-right
        }

        this.container.style.width = width + 'px';
        this.container.style.height = height + 'px'; // Even if collapsed, set height prop for when expanding

        if (collapsed) this.container.classList.add('collapsed');
        if (hidden) this.container.classList.add('hidden');
    }

    save() {
        // Read current state
        const rect = this.container.getBoundingClientRect();
        const style = window.getComputedStyle(this.container);
        
        // If hidden/collapsed, we still want to save the expanded dimensions if we can,
        // but getBoundingClientRect returns current (small if collapsed).
        // Since we only change width/height via resize when expanded, we can trust inline style for "expanded" dims
        // UNLESS we just dragged.
        
        const newPrefs = {
            ...this.prefs,
            x: rect.left,
            y: rect.top,
            collapsed: this.container.classList.contains('collapsed'),
            hidden: this.container.classList.contains('hidden')
        };
        
        // Logic for width/height conservation involves separating "current visual" from "preferred expanded"
        if (!newPrefs.collapsed) {
             newPrefs.width = parseInt(this.container.style.width) || rect.width;
             newPrefs.height = parseInt(this.container.style.height) || rect.height;
        }

        this.prefs = newPrefs;
        StorageUtils.setPrefs(this.host, newPrefs);
    }

    toggleVisibility() {
        this.container.classList.toggle('hidden');
        this.save();
    }

    toggleCollapse() {
        this.container.classList.toggle('collapsed');
        // Update icon
        const btn = this.root.getElementById('btn-collapse');
        const isCollapsed = this.container.classList.contains('collapsed');
        const ICON_MINIMIZE = `<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>`;
        const ICON_MAXIMIZE = `<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>`;
        btn.innerHTML = isCollapsed ? ICON_MAXIMIZE : ICON_MINIMIZE;
        this.save();
    }

    attatchListeners() {
        const header = this.root.getElementById('pm-header');
        const resizeHandle = this.root.getElementById('pm-resize-handle');
        
        // Buttons
        this.root.getElementById('btn-close').addEventListener('click', () => this.toggleVisibility());
        this.root.getElementById('btn-collapse').addEventListener('click', () => this.toggleCollapse());
        this.root.getElementById('btn-external').addEventListener('click', () => window.open('https://prismlines.com/funds', '_blank'));

        // Dragging
        header.addEventListener('mousedown', (e) => {
            if (e.target.closest('button')) return; // Ignore button clicks
            this.isDragging = true;
            this.dragOffset.x = e.clientX - this.container.getBoundingClientRect().left;
            this.dragOffset.y = e.clientY - this.container.getBoundingClientRect().top;
            this.container.classList.add('dragging');
            
            // Disable iframe pointer events to prevent eating mouse
            this.root.querySelector('iframe').style.pointerEvents = 'none';
        });

        // Resizing
        resizeHandle.addEventListener('mousedown', (e) => {
            if (this.container.classList.contains('collapsed')) return;
            this.isResizing = true;
            this.resizeStart.w = this.container.offsetWidth;
            this.resizeStart.h = this.container.offsetHeight;
            this.resizeStart.x = e.clientX;
            this.resizeStart.y = e.clientY;
            this.container.classList.add('resizing');
            this.root.querySelector('iframe').style.pointerEvents = 'none';
            e.stopPropagation(); // prevent drag
        });

        // Global Move/Up (use window)
        window.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                let newX = e.clientX - this.dragOffset.x;
                let newY = e.clientY - this.dragOffset.y;
                
                // Clamp
                const maxW = window.innerWidth - this.container.offsetWidth;
                const maxH = window.innerHeight - this.container.offsetHeight;
                
                newX = Math.max(0, Math.min(newX, window.innerWidth - 50)); // Allow slightly offscreen
                newY = Math.max(0, Math.min(newY, window.innerHeight - 40));

                this.container.style.left = newX + 'px';
                this.container.style.top = newY + 'px';
                this.container.style.right = 'auto'; // Clear defaults
                this.container.style.bottom = 'auto';
            }

            if (this.isResizing) {
                const deltaX = e.clientX - this.resizeStart.x;
                const deltaY = e.clientY - this.resizeStart.y;
                
                let newW = this.resizeStart.w + deltaX;
                let newH = this.resizeStart.h + deltaY;

                // Constraints
                newW = Math.max(250, newW); // Min Width
                newH = Math.max(200, newH); // Min Height

                this.container.style.width = newW + 'px';
                this.container.style.height = newH + 'px';
            }
        });

        window.addEventListener('mouseup', () => {
            if (this.isDragging || this.isResizing) {
                this.isDragging = false;
                this.isResizing = false;
                this.container.classList.remove('dragging', 'resizing');
                this.root.querySelector('iframe').style.pointerEvents = 'all';
                this.save();
            }
        });
    }
}

// Expose
window.PrismOverlay = PrismOverlay;
