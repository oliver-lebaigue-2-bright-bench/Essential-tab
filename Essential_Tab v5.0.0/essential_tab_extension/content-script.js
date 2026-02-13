(function() {
    'use strict';

    // State management
    const state = {
        commandPaletteOpen: false,
        darkModeEnabled: false,
        readingModeEnabled: false,
        brightness: 100,
        contrast: 100,
        fontSize: 18,
        lineHeight: 1.8,
        fontFamily: 'Georgia, serif',
        excludedDomains: [],
        customThemes: {}
    };

    // Load saved state
    chrome.storage.sync.get(
        ['et_darkModeEnabled', 'et_readingModeEnabled', 'et_brightness', 'et_contrast',
         'et_fontSize', 'et_lineHeight', 'et_fontFamily', 'et_excludedDomains', 'et_customThemes'],
        (result) => {
            state.darkModeEnabled = result.et_darkModeEnabled || false;
            state.readingModeEnabled = result.et_readingModeEnabled || false;
            state.brightness = result.et_brightness || 100;
            state.contrast = result.et_contrast || 100;
            state.fontSize = result.et_fontSize || 18;
            state.lineHeight = result.et_lineHeight || 1.8;
            state.fontFamily = result.et_fontFamily || 'Georgia, serif';
            state.excludedDomains = result.et_excludedDomains || [];
            state.customThemes = result.et_customThemes || {};

            // Apply initial state
            if (state.darkModeEnabled && !isExcluded()) {
                applyDarkMode(true);
            }
            if (state.readingModeEnabled) {
                applyReadingMode(true);
            }
            applyCustomTheme();
        }
    );

    // Check if current site is excluded
    function isExcluded() {
        const hostname = window.location.hostname.replace('www.', '');
        return state.excludedDomains.some(domain => 
            hostname.includes(domain.replace('www.', ''))
        );
    }

    // ==================== DARK MODE ====================
    function applyDarkMode(enable) {
        const existingStyle = document.getElementById('et-dark-mode-styles');
        if (existingStyle) existingStyle.remove();

        if (enable && !isExcluded()) {
            const brightnessFactor = state.brightness / 100;
            const contrastFactor = state.contrast / 100;

            const style = document.createElement('style');
            style.id = 'et-dark-mode-styles';
            style.textContent = `
                .et-dark-mode-active {
                    --dm-brightness: ${brightnessFactor};
                    --dm-contrast: ${contrastFactor};
                }
                
                .et-dark-mode-active,
                .et-dark-mode-active body {
                    background-color: #000000 !important;
                    color: #ffffff !important;
                }
                
                .et-dark-mode-active * {
                    background-color: #000000 !important;
                    color: #ffffff !important;
                    border-color: #333333 !important;
                }
                
                .et-dark-mode-active img:not([src*="logo"]):not([src*="icon"]):not([src*="favicon"]) {
                    filter: brightness(${brightnessFactor}) contrast(${contrastFactor}) !important;
                }
                
                .et-dark-mode-active video {
                    filter: brightness(${brightnessFactor}) contrast(${contrastFactor}) !important;
                }
                
                .et-dark-mode-active a {
                    color: #ffffff !important;
                    text-decoration: underline;
                }
                
                .et-dark-mode-active input,
                .et-dark-mode-active textarea,
                .et-dark-mode-active select {
                    background-color: #1a1a1a !important;
                    color: #ffffff !important;
                    border: 1px solid #333333 !important;
                }
                
                .et-dark-mode-active ::placeholder {
                    color: #666666 !important;
                }
                
                .et-dark-mode-active iframe {
                    filter: invert(1) hue-rotate(180deg);
                }
                
                .et-dark-mode-active,
                .et-dark-mode-active * {
                    transition: all 0.2s ease !important;
                }
            `;
            document.head.appendChild(style);
            document.documentElement.classList.add('et-dark-mode-active');
        }
    }

    function toggleDarkMode() {
        state.darkModeEnabled = !state.darkModeEnabled;
        applyDarkMode(state.darkModeEnabled);
        chrome.storage.sync.set({ et_darkModeEnabled: state.darkModeEnabled });
        showNotification(state.darkModeEnabled ? 'Dark mode on' : 'Dark mode off');
    }

    function updateBrightness(value) {
        state.brightness = value;
        chrome.storage.sync.set({ et_brightness: state.brightness });
        if (state.darkModeEnabled) {
            applyDarkMode(true);
        }
    }

    function updateContrast(value) {
        state.contrast = value;
        chrome.storage.sync.set({ et_contrast: state.contrast });
        if (state.darkModeEnabled) {
            applyDarkMode(true);
        }
    }

    // ==================== READING MODE ====================
    function applyReadingMode(enable) {
        const existingStyle = document.getElementById('et-reading-mode-styles');
        if (existingStyle) existingStyle.remove();

        if (enable) {
            const style = document.createElement('style');
            style.id = 'et-reading-mode-styles';
            style.textContent = `
                .et-reading-mode {
                    --rm-font-size: ${state.fontSize}px;
                    --rm-line-height: ${state.lineHeight};
                    --rm-font-family: ${state.fontFamily};
                }
                
                .et-reading-mode body {
                    max-width: 680px !important;
                    margin: 0 auto !important;
                    padding: 48px 24px !important;
                    font-size: var(--rm-font-size) !important;
                    line-height: var(--rm-line-height) !important;
                    font-family: var(--rm-font-family) !important;
                    background: #ffffff !important;
                    color: #000000 !important;
                }
                
                .et-reading-mode body > * {
                    max-width: 100% !important;
                }
                
                .et-reading-mode p {
                    margin-bottom: 1.5em !important;
                }
                
                .et-reading-mode body > *:not(script):not(style):not(nav):not(header):not(footer):not(.advertisement):not(.ads):not(.sidebar) {
                    display: block !important;
                    visibility: visible !important;
                }
                
                .et-reading-mode nav,
                .et-reading-mode header,
                .et-reading-mode footer,
                .et-reading-mode .advertisement,
                .et-reading-mode .ads,
                .et-reading-mode .sidebar,
                .et-reading-mode .social-share,
                .et-reading-mode .comments {
                    display: none !important;
                }
                
                .et-reading-mode a {
                    color: #000000 !important;
                    text-decoration: underline;
                }
                
                .et-reading-mode img {
                    max-width: 100% !important;
                    height: auto !important;
                }
                
                .et-reading-mode code,
                .et-reading-mode pre {
                    background: #f5f5f5 !important;
                    color: #000000 !important;
                    font-family: 'SF Mono', Monaco, monospace !important;
                }
                
                .et-reading-mode blockquote {
                    border-left: 3px solid #000000 !important;
                    margin: 1.5em 0 !important;
                    padding-left: 1em !important;
                    font-style: italic;
                }
                
                .et-reading-mode h1,
                .et-reading-mode h2,
                .et-reading-mode h3,
                .et-reading-mode h4 {
                    color: #000000 !important;
                    margin-top: 1.5em !important;
                }
                
                .et-reading-mode body {
                    transition: all 0.2s ease !important;
                }
            `;
            document.head.appendChild(style);
            document.documentElement.classList.add('et-reading-mode');
        } else {
            document.documentElement.classList.remove('et-reading-mode');
        }
    }

    function toggleReadingMode() {
        state.readingModeEnabled = !state.readingModeEnabled;
        applyReadingMode(state.readingModeEnabled);
        chrome.storage.sync.set({ et_readingModeEnabled: state.readingModeEnabled });
        showNotification(state.readingModeEnabled ? 'Reading mode on' : 'Reading mode off');
    }

    function updateFontSize(value) {
        state.fontSize = value;
        chrome.storage.sync.set({ et_fontSize: state.fontSize });
        if (state.readingModeEnabled) {
            applyReadingMode(true);
        }
    }

    function updateLineHeight(value) {
        state.lineHeight = value;
        chrome.storage.sync.set({ et_lineHeight: state.lineHeight });
        if (state.readingModeEnabled) {
            applyReadingMode(true);
        }
    }

    function updateFontFamily(value) {
        state.fontFamily = value;
        chrome.storage.sync.set({ et_fontFamily: state.fontFamily });
        if (state.readingModeEnabled) {
            applyReadingMode(true);
        }
    }

    // ==================== CUSTOM THEMES ====================
    function applyCustomTheme() {
        const hostname = window.location.hostname;
        document.querySelectorAll('style[data-et-custom-theme]').forEach(el => el.remove());
        
        const theme = state.customThemes[hostname] || state.customThemes[hostname.replace('www.', '')];
        
        if (theme && theme.css) {
            const style = document.createElement('style');
            style.setAttribute('data-et-custom-theme', 'true');
            style.textContent = theme.css;
            document.head.appendChild(style);
        }
    }

    // ==================== QUICK NOTE (Alt+N) ====================
    function quickNote() {
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();
        const noteContent = selectedText || document.title;
        const url = window.location.href;

        chrome.storage.sync.get(['et_notes_v2'], (result) => {
            let notes = result.et_notes_v2 || [];
            
            notes.unshift({
                id: 'note_' + Date.now(),
                title: 'Quick Note',
                content: noteContent,
                date: Date.now(),
                url: url
            });

            if (notes.length > 50) {
                notes = notes.slice(0, 50);
            }

            chrome.storage.sync.set({ et_notes_v2: notes }, () => {
                showNotification('Saved to Notes');
            });
        });
    }

    // ==================== COMMAND PALETTE ====================
    let commandPaletteElement = null;

    function createCommandPalette() {
        if (commandPaletteElement) return commandPaletteElement;

        const palette = document.createElement('div');
        palette.id = 'et-command-palette';
        palette.innerHTML = `
            <div class="et-palette-overlay"></div>
            <div class="et-palette-container">
                <div class="et-palette-search">
                    <input type="text" id="et-palette-input" placeholder="Type a command..." autocomplete="off">
                </div>
                <div class="et-palette-results" id="et-palette-results"></div>
                <div class="et-palette-footer">
                    <span class="et-palette-hint">↑↓ Navigate</span>
                    <span class="et-palette-hint">↵ Select</span>
                    <span class="et-palette-hint">ESC Close</span>
                </div>
            </div>
        `;

        // Add styles - Nothing design
        if (!document.getElementById('et-palette-styles')) {
            const styles = document.createElement('style');
            styles.id = 'et-palette-styles';
            styles.textContent = `
                #et-command-palette {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    z-index: 2147483647; display: none; align-items: flex-start; justify-content: center;
                    padding-top: 15vh; font-family: 'SF Mono', Monaco, Consolas, monospace;
                    background: rgba(0, 0, 0, 0.85);
                    backdrop-filter: blur(20px);
                }
                #et-command-palette.active { display: flex; }
                .et-palette-overlay {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                }
                .et-palette-container {
                    position: relative; width: 520px; max-width: 90vw;
                    background: #000000; border-radius: 12px;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
                    border: 1px solid #333;
                    overflow: hidden;
                }
                .et-palette-search {
                    padding: 16px 20px; border-bottom: 1px solid #333;
                }
                .et-palette-search input {
                    width: 100%; background: transparent; border: none;
                    font-size: 15px; color: #fff; outline: none;
                    font-family: 'SF Mono', Monaco, monospace;
                }
                .et-palette-search input::placeholder { color: #666; }
                .et-palette-results {
                    max-height: 360px; overflow-y: auto; padding: 8px;
                }
                .et-palette-item {
                    padding: 12px 20px; border-radius: 8px; cursor: pointer;
                    display: flex; align-items: center; gap: 14px;
                    color: #fff; transition: background 0.15s;
                    font-family: 'SF Mono', Monaco, monospace;
                    font-size: 13px;
                }
                .et-palette-item:hover, .et-palette-item.selected {
                    background: #1a1a1a;
                }
                .et-palette-item-icon {
                    width: 22px; height: 22px; display: flex; align-items: center; justify-content: center;
                    font-size: 14px; opacity: 0.7;
                }
                .et-palette-item-text { flex: 1; }
                .et-palette-item-title { font-weight: 500; }
                .et-palette-item-subtitle { font-size: 11px; color: #666; margin-top: 2px; }
                .et-palette-footer {
                    padding: 12px 20px; border-top: 1px solid #333;
                    display: flex; gap: 20px;
                }
                .et-palette-hint {
                    font-size: 10px; color: #666; text-transform: uppercase;
                    font-family: 'SF Mono', Monaco, monospace;
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(palette);
        commandPaletteElement = palette;

        // Event listeners
        const input = palette.querySelector('#et-palette-input');
        const results = palette.querySelector('#et-palette-results');
        const overlay = palette.querySelector('.et-palette-overlay');

        overlay.addEventListener('click', closeCommandPalette);
        input.addEventListener('input', () => updateResults(input.value));
        input.addEventListener('keydown', handleKeydown);

        // Initial results
        updateResults('');

        return palette;
    }

    function getCommands() {
        return [
            // Navigation
            { id: 'nav-home', title: 'Go to Home', icon: '◎', subtitle: 'Open new tab', action: () => chrome.tabs.update({ url: 'chrome://newtab' }) },
            { id: 'nav-bookmarks', title: 'Bookmarks', icon: '⊡', subtitle: 'Open bookmarks', action: () => chrome.tabs.update({ url: 'chrome://bookmarks' }) },
            { id: 'nav-history', title: 'History', icon: '⊟', subtitle: 'View history', action: () => chrome.tabs.update({ url: 'chrome://history' }) },
            { id: 'nav-downloads', title: 'Downloads', icon: '↓', subtitle: 'View downloads', action: () => chrome.tabs.update({ url: 'chrome://downloads' }) },
            { id: 'nav-settings', title: 'Settings', icon: '⚙', subtitle: 'Open settings', action: () => chrome.tabs.update({ url: 'chrome://settings' }) },

            // Tabs
            { id: 'tab-manager', title: 'Tab Manager', icon: '⊞', subtitle: 'Manage tabs', action: () => chrome.runtime.sendMessage({ action: 'openTabManager' }) },
            { id: 'tab-close', title: 'Close Tab', icon: '×', subtitle: 'Close current tab', action: () => chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => chrome.tabs.remove(tab.id)) },
            { id: 'tab-reopen', title: 'Reopen Tab', icon: '↺', subtitle: 'Restore closed tab', action: () => chrome.sessions.restore() },
            { id: 'tab-pin', title: 'Pin Tab', icon: '◉', subtitle: 'Pin this tab', action: () => chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => chrome.tabs.update(tab.id, { pinned: true })) },
            { id: 'tab-duplicate', title: 'Duplicate', icon: '⊕', subtitle: 'Clone this tab', action: () => chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => chrome.tabs.duplicate(tab.id)) },

            // Quick Actions
            { id: 'quick-note', title: 'Quick Note', icon: '⊟', subtitle: 'Save selection to notes', action: quickNote },

            // Modes
            { id: 'mode-dark', title: 'Dark Mode', icon: state.darkModeEnabled ? '◐' : '○', subtitle: state.darkModeEnabled ? 'Disable' : 'Enable', action: toggleDarkMode },
            { id: 'mode-reading', title: 'Reading Mode', icon: state.readingModeEnabled ? '◑' : '○', subtitle: state.readingModeEnabled ? 'Exit' : 'Enter', action: toggleReadingMode },
            { id: 'mode-full', title: 'Fullscreen', icon: '⛶', subtitle: 'Toggle fullscreen', action: () => { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen(); } },

            // Sessions
            { id: 'session-save', title: 'Save Session', icon: '⊕', subtitle: 'Save current', action: () => chrome.runtime.sendMessage({ action: 'openSessions' }) },

            // Actions
            { id: 'act-copy-url', title: 'Copy URL', icon: '⊛', subtitle: 'Copy page URL', action: () => navigator.clipboard.writeText(window.location.href) },
            { id: 'act-print', title: 'Print', icon: '⎀', subtitle: 'Print page', action: () => window.print() },
            { id: 'act-scroll-top', title: 'Scroll Top', icon: '↑', subtitle: 'Go to top', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
            { id: 'act-scroll-bottom', title: 'Scroll Bottom', icon: '↓', subtitle: 'Go to bottom', action: () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }) },
        ];
    }

    function updateResults(query) {
        const results = commandPaletteElement.querySelector('#et-palette-results');
        const commands = getCommands();
        
        let filtered = commands;
        if (query.trim()) {
            const q = query.toLowerCase();
            filtered = commands.filter(cmd => 
                cmd.title.toLowerCase().includes(q) || 
                cmd.subtitle.toLowerCase().includes(q)
            );
        }

        results.innerHTML = filtered.map((cmd, i) => `
            <div class="et-palette-item${i === 0 ? ' selected' : ''}" data-id="${cmd.id}">
                <div class="et-palette-item-icon">${cmd.icon}</div>
                <div class="et-palette-item-text">
                    <div class="et-palette-item-title">${cmd.title}</div>
                    <div class="et-palette-item-subtitle">${cmd.subtitle}</div>
                </div>
            </div>
        `).join('');

        results.querySelectorAll('.et-palette-item').forEach(item => {
            item.addEventListener('click', () => {
                const cmd = commands.find(c => c.id === item.dataset.id);
                if (cmd) {
                    cmd.action();
                    closeCommandPalette();
                }
            });
        });
    }

    let selectedIndex = 0;

    function handleKeydown(e) {
        const items = commandPaletteElement.querySelectorAll('.et-palette-item');
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedIndex = (selectedIndex + 1) % items.length;
            updateSelection(items);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedIndex = (selectedIndex - 1 + items.length) % items.length;
            updateSelection(items);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const cmd = getCommands().find(c => c.id === items[selectedIndex]?.dataset.id);
            if (cmd) {
                cmd.action();
                closeCommandPalette();
            }
        }
    }

    function updateSelection(items) {
        items.forEach((item, i) => {
            item.classList.toggle('selected', i === selectedIndex);
            if (i === selectedIndex) {
                item.scrollIntoView({ block: 'nearest' });
            }
        });
    }

    function openCommandPalette() {
        if (state.commandPaletteOpen) return;
        
        const palette = createCommandPalette();
        palette.classList.add('active');
        state.commandPaletteOpen = true;
        selectedIndex = 0;
        
        const input = palette.querySelector('#et-palette-input');
        setTimeout(() => input.focus(), 50);
        updateResults('');
    }

    function closeCommandPalette() {
        if (!commandPaletteElement) return;
        commandPaletteElement.classList.remove('active');
        state.commandPaletteOpen = false;
        
        const input = commandPaletteElement.querySelector('#et-palette-input');
        input.value = '';
    }

    // ==================== NOTIFICATIONS ====================
    function showNotification(message) {
        const existing = document.querySelector('.et-notification');
        if (existing) existing.remove();

        const notif = document.createElement('div');
        notif.className = 'et-notification';
        notif.textContent = message;
        notif.style.cssText = `
            position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
            background: #000; color: #fff; padding: 12px 24px;
            border-radius: 8px; font-size: 13px; z-index: 2147483647;
            font-family: 'SF Mono', Monaco, monospace;
            border: 1px solid #333;
            backdrop-filter: blur(10px);
        `;

        document.body.appendChild(notif);
        setTimeout(() => notif.remove(), 1800);
    }

    // ==================== MESSAGE LISTENER ====================
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        switch (message.action) {
            case 'toggleCommandPalette':
                if (state.commandPaletteOpen) {
                    closeCommandPalette();
                } else {
                    openCommandPalette();
                }
                break;
            case 'toggleDarkMode':
                toggleDarkMode();
                break;
            case 'toggleReadingMode':
                toggleReadingMode();
                break;
            case 'updateBrightness':
                updateBrightness(message.value);
                break;
            case 'updateContrast':
                updateContrast(message.value);
                break;
            case 'updateFontSize':
                updateFontSize(message.value);
                break;
            case 'updateLineHeight':
                updateLineHeight(message.value);
                break;
            case 'updateFontFamily':
                updateFontFamily(message.value);
                break;
            case 'openTabManager':
                chrome.runtime.sendMessage({ action: 'openTabManager' });
                break;
            case 'openSessions':
                chrome.runtime.sendMessage({ action: 'openSessions' });
                break;
        }
        sendResponse({ success: true });
    });

    // ==================== KEYBOARD SHORTCUTS ====================
    document.addEventListener('keydown', (e) => {
        // Shift+K: Command Palette
        if (e.shiftKey && e.key === 'K') {
            e.preventDefault();
            openCommandPalette();
        }
        // Shift+D: Dark Mode
        if (e.shiftKey && e.key === 'D') {
            e.preventDefault();
            toggleDarkMode();
        }
        // Shift+R: Reading Mode
        if (e.shiftKey && e.key === 'R') {
            e.preventDefault();
            toggleReadingMode();
        }
        // Shift+T: Tab Manager
        if (e.shiftKey && e.key === 'T') {
            e.preventDefault();
            chrome.runtime.sendMessage({ action: 'openTabManager' });
        }
    });

    // Alt+N: Quick Note
    document.addEventListener('keydown', (e) => {
        if (e.altKey && e.key === 'n') {
            e.preventDefault();
            quickNote();
        }
    });

})();
