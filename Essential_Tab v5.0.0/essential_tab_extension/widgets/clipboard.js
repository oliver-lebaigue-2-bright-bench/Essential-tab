// Clipboard Manager Logic - Nothing Design
(function() {
    'use strict';

    const overlay = document.getElementById('clipOverlay');
    const clipList = document.getElementById('clipList');
    const clipCount = document.getElementById('clipCount');
    const clipSearch = document.getElementById('clipSearch');
    const closeBtn = document.getElementById('clipClose');
    const clearBtn = document.getElementById('clipClear');

    let clips = [];
    const MAX_CLIPS = 50;
    const STORAGE_KEY = 'et_clipboard_history';

    function init() {
        loadClips();
        setupEventListeners();
        startClipboardListener();
    }

    function loadClips() {
        chrome.storage.sync.get([STORAGE_KEY], (result) => {
            clips = result[STORAGE_KEY] || [];
            renderClips();
        });
    }

    function saveClips() {
        chrome.storage.sync.set({ [STORAGE_KEY]: clips });
    }

    function addClip(text, isPinned = false) {
        if (!text || text.trim().length === 0) return;
        if (text.length > 5000) text = text.substring(0, 5000) + '...';

        // Remove duplicate
        const existing = clips.findIndex(c => c.text === text);
        if (existing !== -1) {
            clips.splice(existing, 1);
        }

        // Add new clip
        clips.unshift({
            id: Date.now(),
            text: text,
            timestamp: Date.now(),
            pinned: isPinned
        });

        // Move pinned items to top
        clips.sort((a, b) => {
            if (a.pinned && !b.pinned) return -1;
            if (!a.pinned && b.pinned) return 1;
            return b.timestamp - a.timestamp;
        });

        // Limit size
        const pinned = clips.filter(c => c.pinned);
        const unpinned = clips.filter(c => !c.pinned).slice(0, MAX_CLIPS - pinned.length);
        clips = [...pinned, ...unpinned];

        saveClips();
        renderClips();
    }

    function togglePin(id) {
        const clip = clips.find(c => c.id === id);
        if (clip) {
            clip.pinned = !clip.pinned;
            // Re-sort
            clips.sort((a, b) => {
                if (a.pinned && !b.pinned) return -1;
                if (!a.pinned && b.pinned) return 1;
                return b.timestamp - a.timestamp;
            });
            saveClips();
            renderClips();
        }
    }

    function deleteClip(id) {
        clips = clips.filter(c => c.id !== id);
        saveClips();
        renderClips();
    }

    function clearAll() {
        if (confirm('Clear all clipboard history?')) {
            clips = [];
            saveClips();
            renderClips();
        }
    }

    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            showNotification('Copied');
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    }

    function renderClips(filter = '') {
        const query = filter.toLowerCase().trim();
        const filtered = query 
            ? clips.filter(c => c.text.toLowerCase().includes(query))
            : clips;

        clipCount.textContent = `${clips.length} items`;

        if (filtered.length === 0) {
            clipList.innerHTML = `
                <div class="clip-empty">
                    ${query ? 'No matches found' : 'No clipboard history yet'}
                </div>
            `;
            return;
        }

        clipList.innerHTML = filtered.map(clip => `
            <div class="clip-item ${clip.pinned ? 'pinned' : ''}" data-id="${clip.id}">
                <div class="clip-content">
                    <div class="clip-text">${escapeHtml(clip.text)}</div>
                    <div class="clip-meta">${formatTime(clip.timestamp)}${clip.pinned ? ' · Pinned' : ''}</div>
                </div>
                <div class="clip-actions">
                    <button class="clip-btn pin" data-action="pin" title="Pin">📌</button>
                    <button class="clip-btn" data-action="copy" title="Copy">⊛</button>
                    <button class="clip-btn delete" data-action="delete" title="Delete">×</button>
                </div>
            </div>
        `).join('');

        // Add event listeners
        clipList.querySelectorAll('.clip-item').forEach(item => {
            const id = parseInt(item.dataset.id);
            
            item.querySelector('.clip-content').addEventListener('click', () => {
                const clip = clips.find(c => c.id === id);
                if (clip) copyToClipboard(clip.text);
            });

            item.querySelectorAll('.clip-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const action = btn.dataset.action;
                    switch (action) {
                        case 'pin':
                            togglePin(id);
                            break;
                        case 'copy':
                            const clip = clips.find(c => c.id === id);
                            if (clip) copyToClipboard(clip.text);
                            break;
                        case 'delete':
                            deleteClip(id);
                            break;
                    }
                });
            });
        });
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;

        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
        if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
        return date.toLocaleDateString();
    }

    function showNotification(message) {
        const existing = document.querySelector('.clip-notification');
        if (existing) existing.remove();

        const notif = document.createElement('div');
        notif.className = 'clip-notification';
        notif.textContent = message;
        notif.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: #000;
            color: #fff;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 13px;
            z-index: 2147483647;
            font-family: 'SF Mono', Monaco, monospace;
            border: 1px solid #333;
        `;

        document.body.appendChild(notif);
        setTimeout(() => notif.remove(), 1800);
    }

    function startClipboardListener() {
        // Listen for clipboard changes
        setInterval(async () => {
            try {
                const text = await navigator.clipboard.readText();
                if (text && text !== clips[0]?.text) {
                    addClip(text);
                }
            } catch (err) {
                // Clipboard read might fail due to permissions
            }
        }, 2000);
    }

    function setupEventListeners() {
        closeBtn.addEventListener('click', closeModal);
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });

        clearBtn.addEventListener('click', clearAll);

        let searchTimeout;
        clipSearch.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                renderClips(clipSearch.value);
            }, 150);
        });

        document.addEventListener('keydown', handleKeyboard);
    }

    function handleKeyboard(e) {
        if (!overlay.classList.contains('active')) return;

        if (e.key === 'Escape') {
            closeModal();
        }
    }

    function openModal() {
        overlay.classList.add('active');
        clipSearch.value = '';
        renderClips();
        clipSearch.focus();
    }

    function closeModal() {
        overlay.classList.remove('active');
    }

    // Listen for messages
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === 'openClipboard') {
            openModal();
            sendResponse({ success: true });
        }
    });

    window.ClipboardWidget = { open: openModal, close: closeModal };
    init();
})();
