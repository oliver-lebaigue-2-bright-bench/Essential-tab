// Session Manager Logic - Nothing Design
(function() {
    'use strict';

    const overlay = document.getElementById('smOverlay');
    const sessionNameInput = document.getElementById('smSessionName');
    const saveBtn = document.getElementById('smSaveBtn');
    const sessionList = document.getElementById('smSessionList');
    const closeBtn = document.getElementById('smClose');
    const autoSaveToggle = document.getElementById('smAutoSaveToggle');
    const deleteAllBtn = document.getElementById('smDeleteAllBtn');
    const currentSessionBtn = document.getElementById('smCurrentSessionBtn');

    const STORAGE_KEY = 'et_sessions';
    const AUTO_SAVE_KEY = 'et_auto_save_enabled';
    const LAST_AUTO_SAVE_KEY = 'et_last_auto_save';

    let sessions = [];
    let autoSaveInterval = null;

    function init() {
        loadSessions();
        loadAutoSaveState();
        setupEventListeners();
    }

    function loadSessions() {
        chrome.storage.sync.get([STORAGE_KEY], (result) => {
            sessions = result[STORAGE_KEY] || [];
            renderSessions();
        });
    }

    function loadAutoSaveState() {
        chrome.storage.sync.get([AUTO_SAVE_KEY], (result) => {
            const enabled = result[AUTO_SAVE_KEY] || false;
            autoSaveToggle.classList.toggle('active', enabled);
            if (enabled) startAutoSave();
        });
    }

    function saveSessions() {
        chrome.storage.sync.set({ [STORAGE_KEY]: sessions });
    }

    function renderSessions() {
        if (sessions.length === 0) {
            sessionList.innerHTML = `
                <div class="sm-empty">
                    <div class="sm-empty-icon">⊞</div>
                    <div>No saved sessions</div>
                </div>
            `;
            return;
        }

        sessions.sort((a, b) => b.timestamp - a.timestamp);

        sessionList.innerHTML = sessions.map((session, index) => `
            <div class="sm-session-item" data-id="${session.id}">
                <div class="sm-session-icon">⊟</div>
                <div class="sm-session-info">
                    <div class="sm-session-name">${escapeHtml(session.name)}</div>
                    <div class="sm-session-meta">
                        ${session.windows.length}w · ${countTabs(session)}t · ${formatDate(session.timestamp)}
                    </div>
                </div>
                <div class="sm-session-actions">
                    <button class="sm-action-btn restore" data-action="restore" data-index="${index}">Restore</button>
                    <button class="sm-action-btn" data-action="delete" data-index="${index}">Delete</button>
                </div>
            </div>
        `).join('');

        sessionList.querySelectorAll('.sm-action-btn').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                const action = btn.dataset.action;
                const index = parseInt(btn.dataset.index);
                handleAction(action, index);
            };
        });
    }

    function countTabs(session) {
        return session.windows.reduce((total, win) => total + win.tabs.length, 0);
    }

    function formatDate(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;

        if (diff < 60000) return 'just now';
        if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
        if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
        if (diff < 604800000) return Math.floor(diff / 86400000) + 'd ago';

        return date.toLocaleDateString();
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function handleAction(action, index) {
        switch (action) {
            case 'restore':
                restoreSession(index);
                break;
            case 'delete':
                if (confirm('Delete this session?')) {
                    sessions.splice(index, 1);
                    saveSessions();
                    renderSessions();
                }
                break;
        }
    }

    async function saveCurrentSession(name = null) {
        const sessionName = name || sessionNameInput.value.trim();

        if (!sessionName) {
            showNotification('Enter a name');
            return;
        }

        try {
            const windows = await chrome.windows.getAll({ populate: true });

            const sessionData = {
                id: 'session_' + Date.now(),
                name: sessionName,
                timestamp: Date.now(),
                windows: windows.map(win => ({
                    type: win.type,
                    state: win.state,
                    tabs: win.tabs.map(tab => ({
                        url: tab.url,
                        title: tab.title,
                        favIconUrl: tab.favIconUrl,
                        pinned: tab.pinned
                    }))
                }))
            };

            sessions.push(sessionData);
            saveSessions();
            renderSessions();
            sessionNameInput.value = '';
            showNotification('Session saved');
        } catch (error) {
            console.error('Error saving session:', error);
            showNotification('Error saving');
        }
    }

    async function restoreSession(index) {
        const session = sessions[index];
        if (!session) return;

        try {
            for (const winData of session.windows) {
                const tabUrls = winData.tabs.map(tab => tab.url);
                if (tabUrls.length > 0) {
                    await chrome.windows.create({
                        type: winData.type,
                        state: winData.state,
                        url: tabUrls
                    });
                }
            }
            closeModal();
            showNotification('Session restored');
        } catch (error) {
            console.error('Error restoring session:', error);
            showNotification('Error restoring');
        }
    }

    function startAutoSave() {
        if (autoSaveInterval) clearInterval(autoSaveInterval);

        autoSaveInterval = setInterval(async () => {
            const lastSave = await new Promise(resolve => {
                chrome.storage.sync.get([LAST_AUTO_SAVE_KEY], result => resolve(result[LAST_AUTO_SAVE_KEY] || 0));
            });

            if (Date.now() - lastSave > 300000) {
                await saveCurrentSession('Auto-save ' + new Date().toLocaleString());
                chrome.storage.sync.set({ [LAST_AUTO_SAVE_KEY]: Date.now() });
            }
        }, 60000);
    }

    function stopAutoSave() {
        if (autoSaveInterval) {
            clearInterval(autoSaveInterval);
            autoSaveInterval = null;
        }
    }

    function showNotification(message) {
        const existing = document.querySelector('.sm-notification');
        if (existing) existing.remove();

        const notif = document.createElement('div');
        notif.className = 'sm-notification';
        notif.textContent = message;
        notif.style.cssText = `
            position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
            background: #000; color: #fff; padding: 12px 24px;
            border-radius: 8px; font-size: 13px; z-index: 2147483647;
            font-family: 'SF Mono', Monaco, monospace;
            border: 1px solid #333;
        `;

        document.body.appendChild(notif);
        setTimeout(() => notif.remove(), 1800);
    }

    function setupEventListeners() {
        closeBtn.onclick = closeModal;

        overlay.onclick = (e) => {
            if (e.target === overlay) closeModal();
        };

        saveBtn.onclick = () => saveCurrentSession();

        currentSessionBtn.onclick = async () => {
            const now = new Date();
            const name = 'Session ' + now.toLocaleDateString() + ' ' + 
                        now.getHours().toString().padStart(2, '0') + ':' + 
                        now.getMinutes().toString().padStart(2, '0');
            await saveCurrentSession(name);
        };

        autoSaveToggle.onclick = () => {
            const enabled = autoSaveToggle.classList.toggle('active');
            chrome.storage.sync.set({ [AUTO_SAVE_KEY]: enabled });

            if (enabled) {
                startAutoSave();
                showNotification('Auto-save on');
            } else {
                stopAutoSave();
                showNotification('Auto-save off');
            }
        };

        deleteAllBtn.onclick = () => {
            if (confirm('Delete all sessions?')) {
                sessions = [];
                saveSessions();
                renderSessions();
                showNotification('All deleted');
            }
        };

        document.onkeydown = (e) => {
            if (!overlay.classList.contains('active')) return;
            if (e.key === 'Escape') closeModal();
        };
    }

    function openModal() {
        overlay.classList.add('active');
        loadSessions();
        sessionNameInput.focus();
    }

    function closeModal() {
        overlay.classList.remove('active');
    }

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === 'openSessions') {
            openModal();
            sendResponse({ success: true });
        }
    });

    window.SessionManager = { open: openModal, close: closeModal, save: saveCurrentSession };
    init();
})();

