// Popup Script - Nothing Design
(function() {
    'use strict';

    const toggleDarkModeBtn = document.getElementById('toggleDarkMode');
    const toggleReadingModeBtn = document.getElementById('toggleReadingMode');
    const toggleCommandPaletteBtn = document.getElementById('toggleCommandPalette');
    const toggleTabManagerBtn = document.getElementById('toggleTabManager');
    const brightnessSlider = document.getElementById('brightnessSlider');
    const brightnessValue = document.getElementById('brightnessValue');
    const contrastSlider = document.getElementById('contrastSlider');
    const contrastValue = document.getElementById('contrastValue');
    const fontSizeSlider = document.getElementById('fontSizeSlider');
    const fontSizeValue = document.getElementById('fontSizeValue');
    const lineHeightSlider = document.getElementById('lineHeightSlider');
    const lineHeightValue = document.getElementById('lineHeightValue');
    const fontFamilySelect = document.getElementById('fontFamilySelect');
    const openSessionsBtn = document.getElementById('openSessions');
    const openDashboardBtn = document.getElementById('openDashboard');
    const tabCountEl = document.getElementById('tabCount');
    const windowCountEl = document.getElementById('windowCount');

    let state = {
        darkModeEnabled: false,
        readingModeEnabled: false,
        brightness: 100,
        contrast: 100,
        fontSize: 18,
        lineHeight: 1.8,
        fontFamily: 'Georgia, serif'
    };

    async function init() {
        await loadState();
        updateUI();
        updateStats();
        setupEventListeners();
    }

    async function loadState() {
        const result = await new Promise(resolve => {
            chrome.storage.sync.get([
                'et_darkModeEnabled', 'et_readingModeEnabled', 'et_brightness', 'et_contrast',
                'et_fontSize', 'et_lineHeight', 'et_fontFamily'
            ], resolve);
        });

        state.darkModeEnabled = result.et_darkModeEnabled || false;
        state.readingModeEnabled = result.et_readingModeEnabled || false;
        state.brightness = result.et_brightness || 100;
        state.contrast = result.et_contrast || 100;
        state.fontSize = result.et_fontSize || 18;
        state.lineHeight = result.et_lineHeight || 1.8;
        state.fontFamily = result.et_fontFamily || 'Georgia, serif';
    }

    function saveState() {
        chrome.storage.sync.set({
            et_darkModeEnabled: state.darkModeEnabled,
            et_readingModeEnabled: state.readingModeEnabled,
            et_brightness: state.brightness,
            et_contrast: state.contrast,
            et_fontSize: state.fontSize,
            et_lineHeight: state.lineHeight,
            et_fontFamily: state.fontFamily
        });
    }

    function updateUI() {
        toggleDarkModeBtn.classList.toggle('active', state.darkModeEnabled);
        toggleReadingModeBtn.classList.toggle('active', state.readingModeEnabled);

        brightnessSlider.value = state.brightness;
        brightnessValue.textContent = state.brightness + '%';

        contrastSlider.value = state.contrast;
        contrastValue.textContent = state.contrast + '%';

        fontSizeSlider.value = state.fontSize;
        fontSizeValue.textContent = state.fontSize + 'px';

        lineHeightSlider.value = state.lineHeight;
        lineHeightValue.textContent = state.lineHeight;

        fontFamilySelect.value = state.fontFamily;
    }

    async function updateStats() {
        try {
            const tabs = await chrome.tabs.query({});
            const windows = await chrome.windows.getAll({});
            tabCountEl.textContent = tabs.length;
            windowCountEl.textContent = windows.length;
        } catch (error) {
            console.error('Error getting stats:', error);
        }
    }

    function setupEventListeners() {
        toggleDarkModeBtn.onclick = () => {
            state.darkModeEnabled = !state.darkModeEnabled;
            saveState();
            updateUI();
            sendMessage({ action: 'toggleDarkMode' });
        };

        toggleReadingModeBtn.onclick = () => {
            state.readingModeEnabled = !state.readingModeEnabled;
            saveState();
            updateUI();
            sendMessage({ action: 'toggleReadingMode' });
        };

        toggleCommandPaletteBtn.onclick = () => {
            sendMessage({ action: 'toggleCommandPalette' });
            window.close();
        };

        toggleTabManagerBtn.onclick = () => {
            sendMessage({ action: 'openTabManager' });
            window.close();
        };

        brightnessSlider.oninput = () => {
            state.brightness = parseInt(brightnessSlider.value);
            brightnessValue.textContent = state.brightness + '%';
            saveState();
            sendMessage({ action: 'updateBrightness', value: state.brightness });
        };

        contrastSlider.oninput = () => {
            state.contrast = parseInt(contrastSlider.value);
            contrastValue.textContent = state.contrast + '%';
            saveState();
            sendMessage({ action: 'updateContrast', value: state.contrast });
        };

        fontSizeSlider.oninput = () => {
            state.fontSize = parseInt(fontSizeSlider.value);
            fontSizeValue.textContent = state.fontSize + 'px';
            saveState();
            sendMessage({ action: 'updateFontSize', value: state.fontSize });
        };

        lineHeightSlider.oninput = () => {
            state.lineHeight = parseFloat(lineHeightSlider.value);
            lineHeightValue.textContent = state.lineHeight;
            saveState();
            sendMessage({ action: 'updateLineHeight', value: state.lineHeight });
        };

        fontFamilySelect.onchange = () => {
            state.fontFamily = fontFamilySelect.value;
            saveState();
            sendMessage({ action: 'updateFontFamily', value: state.fontFamily });
        };

        openSessionsBtn.onclick = () => {
            sendMessage({ action: 'openSessions' });
            window.close();
        };

        openDashboardBtn.onclick = () => {
            chrome.tabs.create({ url: 'chrome://newtab' });
            window.close();
        };
    }

    function sendMessage(message) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, message);
            }
        });
    }

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === 'updateState') {
            state = { ...state, ...message.state };
            updateUI();
        }
        sendResponse({ success: true });
    });

    init();
})();

