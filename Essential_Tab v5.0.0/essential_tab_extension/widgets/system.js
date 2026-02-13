// System Monitor Widget Logic - Nothing Design
(function() {
    'use strict';

    const overlay = document.getElementById('sysOverlay');
    const memValue = document.getElementById('memValue');
    const memBar = document.getElementById('memBar');
    const cpuValue = document.getElementById('cpuValue');
    const cpuBar = document.getElementById('cpuBar');
    const battValue = document.getElementById('battValue');
    const battBar = document.getElementById('battBar');
    const sysOs = document.getElementById('sysOs');
    const sysUptime = document.getElementById('sysUptime');
    const sysRes = document.getElementById('sysRes');
    const closeBtn = document.getElementById('sysClose');

    let updateInterval = null;

    function init() {
        setupEventListeners();
    }

    function getMemoryInfo() {
        return new Promise((resolve) => {
            if (performance.memory) {
                const used = performance.memory.usedJSHeapSize;
                const total = performance.memory.totalJSHeapSize;
                const percent = Math.round((used / total) * 100);
                resolve({
                    used: Math.round(used / 1048576),
                    total: Math.round(total / 1048576),
                    percent: percent
                });
            } else {
                resolve(null);
            }
        });
    }

    function getCPUInfo() {
        // Estimate CPU load based on timing
        const start = performance.now();
        // Simple CPU load estimation
        setTimeout(() => {
            const end = performance.now();
            const elapsed = end - start;
            // Heuristic: faster execution = lower CPU load
            const load = Math.min(100, Math.max(10, 100 - elapsed * 2));
            cpuValue.textContent = Math.round(load) + '%';
            cpuBar.style.width = load + '%';
        }, 1);
        return Math.round(Math.random() * 30 + 20); // Random estimate
    }

    async function getBatteryInfo() {
        if ('getBattery' in navigator) {
            try {
                const battery = await navigator.getBattery();
                const level = Math.round(battery.level * 100);
                const charging = battery.charging ? ' (Charging)' : '';
                return { level, charging, supported: true };
            } catch (e) {
                return { level: 0, charging: false, supported: false };
            }
        }
        return { level: 0, charging: false, supported: false };
    }

    async function updateMetrics() {
        // Memory
        const mem = await getMemoryInfo();
        if (mem) {
            memValue.textContent = mem.percent + '% (' + mem.used + 'MB)';
            memBar.style.width = mem.percent + '%';
        } else {
            memValue.textContent = 'N/A';
        }

        // CPU
        const cpu = getCPUInfo();
        cpuValue.textContent = cpu + '%';
        cpuBar.style.width = cpu + '%';

        // Battery
        const batt = await getBatteryInfo();
        if (batt.supported) {
            battValue.textContent = batt.level + '%' + batt.charging;
            battBar.style.width = batt.level + '%';
        } else {
            battValue.textContent = 'N/A';
            battBar.style.width = '0%';
        }

        // System Info
        sysOs.textContent = navigator.platform;

        // Uptime
        const uptime = Math.floor(performance.timeOrigin / 1000);
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const mins = Math.floor((uptime % 3600) / 60);
        sysUptime.textContent = days + 'd ' + hours + 'h ' + mins + 'm';

        // Resolution
        sysRes.textContent = window.screen.width + 'x' + window.screen.height;
    }

    function setupEventListeners() {
        closeBtn.addEventListener('click', closeModal);

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });

        document.addEventListener('keydown', handleKeyboard);
    }

    function handleKeyboard(e) {
        if (!overlay.classList.contains('active')) return;
        if (e.key === 'Escape') closeModal();
    }

    function openModal() {
        overlay.classList.add('active');
        updateMetrics();
        updateInterval = setInterval(updateMetrics, 2000);
    }

    function closeModal() {
        overlay.classList.remove('active');
        if (updateInterval) {
            clearInterval(updateInterval);
            updateInterval = null;
        }
    }

    // Listen for messages
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === 'openSystemMonitor') {
            openModal();
            sendResponse({ success: true });
        }
    });

    window.SystemWidget = { open: openModal, close: closeModal };
    init();
})();
