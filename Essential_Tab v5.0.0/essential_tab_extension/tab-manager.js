// Tab Manager Logic - Nothing Design
(function() {
    'use strict';

    const overlay = document.getElementById('tmOverlay');
    const searchInput = document.getElementById('tmSearchInput');
    const content = document.getElementById('tmContent');
    const closeBtn = document.getElementById('tmClose');
    const newWindowBtn = document.getElementById('tmNewWindow');
    const closeAllBtn = document.getElementById('tmCloseAll');
    const collapseBtn = document.getElementById('tmCollapse');

    let tabsData = [];
    let windowGroups = {};
    let isExpanded = {};

    // Initialize
    function init() {
        loadTabs();
        setupEventListeners();
    }

    // Load all tabs from all windows
    async function loadTabs() {
        try {
            const windows = await chrome.windows.getAll({ populate: true });
            tabsData = [];
            windowGroups = {};
            
            let windowIndex = 0;
            
            for (const win of windows) {
                const windowId = win.id;
                windowGroups[windowId] = {
                    window: win,
                    tabs: []
                };
                
                for (const tab of win.tabs) {
                    const tabData = {
                        id: tab.id,
                        windowId: tab.windowId,
                        title: tab.title || 'Untitled',
                        url: tab.url || '',
                        favicon: tab.favIconUrl || '',
                        active: tab.active,
                        pinned: tab.pinned,
                        incognito: win.incognito,
                        windowIndex: windowIndex
                    };
                    
                    tabsData.push(tabData);
                    windowGroups[windowId].tabs.push(tabData);
                }
                windowIndex++;
            }
            
            renderTabs();
            updateStats();
        } catch (error) {
            console.error('Error loading tabs:', error);
        }
    }

    // Render tabs in the modal
    function renderTabs(filter = '') {
        content.innerHTML = '';
        const query = filter.toLowerCase().trim();
        
        // Get visible windows based on filter
        const visibleWindows = {};
        
        for (const [windowId, group] of Object.entries(windowGroups)) {
            const visibleTabs = query 
                ? group.tabs.filter(tab => 
                    (tab.title && tab.title.toLowerCase().includes(query)) ||
                    (tab.url && tab.url.toLowerCase().includes(query))
                )
                : group.tabs;
            
            if (visibleTabs.length > 0) {
                visibleWindows[windowId] = {
                    ...group,
                    tabs: visibleTabs
                };
            }
        }
        
        if (Object.keys(visibleWindows).length === 0) {
            content.innerHTML = `
                <div class="tm-empty">
                    <div class="tm-empty-icon">⊡</div>
                    <div>No tabs found</div>
                </div>
            `;
            return;
        }
        
        // Render each window group
        for (const [windowId, group] of Object.entries(visibleWindows)) {
            const windowEl = createWindowGroup(windowId, group, query);
            content.appendChild(windowEl);
        }
    }

    // Create window group element
    function createWindowGroup(windowId, group, query) {
        const container = document.createElement('div');
        container.className = 'tm-window-group';
        
        const windowName = `Window ${group.windowIndex + 1}`;
            
        const header = document.createElement('div');
        header.className = 'tm-window-header';
        header.innerHTML = `
            <span>${windowName}</span>
            <span class="tm-window-count">${group.tabs.length}</span>
        `;
        header.onclick = () => toggleWindowExpand(windowId);
        
        container.appendChild(header);
        
        const list = document.createElement('div');
        list.className = 'tm-tab-list';
        list.id = `tm-tabs-${windowId}`;
        
        if (isExpanded[windowId] !== false || query) {
            for (const tab of group.tabs) {
                list.appendChild(createTabElement(tab));
            }
        } else {
            // Show only active tab when collapsed
            if (group.tabs.length > 0) {
                list.appendChild(createTabElement(group.tabs.find(t => t.active) || group.tabs[0]));
            }
        }
        
        container.appendChild(list);
        return container;
    }

    // Create tab element
    function createTabElement(tab) {
        const el = document.createElement('div');
        el.className = `tm-tab${tab.active ? ' active' : ''}`;
        el.dataset.tabId = tab.id;
        
        let faviconHtml = tab.favicon 
            ? `<img src="${tab.favicon}" alt="">`
            : `<span style="color:#666;font-size:12px;">⊡</span>`;
        
        // Clean URL for display
        let displayUrl = tab.url;
        try {
            const url = new URL(tab.url);
            displayUrl = url.hostname;
        } catch (e) {}
        
        el.innerHTML = `
            <div class="tm-tab-icon">${faviconHtml}</div>
            <div class="tm-tab-info">
                <div class="tm-tab-title">${escapeHtml(tab.title)}</div>
                <div class="tm-tab-url">${escapeHtml(displayUrl)}</div>
            </div>
            <div class="tm-tab-actions">
                <button class="tm-action-btn" data-action="pin" title="Pin">◉</button>
                <button class="tm-action-btn" data-action="duplicate" title="Clone">⊕</button>
                <button class="tm-action-btn" data-action="close" title="Close">×</button>
            </div>
        `;
        
        // Click to activate
        el.onclick = (e) => {
            if (!e.target.closest('.tm-action-btn')) {
                activateTab(tab.id);
            }
        };
        
        // Action buttons
        el.querySelectorAll('.tm-action-btn').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                const action = btn.dataset.action;
                handleAction(action, tab);
            };
        });
        
        return el;
    }

    // Handle tab actions
    function handleAction(action, tab) {
        switch (action) {
            case 'pin':
                chrome.tabs.update(tab.id, { pinned: !tab.pinned });
                break;
            case 'duplicate':
                chrome.tabs.duplicate(tab.id);
                break;
            case 'close':
                chrome.tabs.remove(tab.id);
                break;
        }
        setTimeout(loadTabs, 100);
    }

    // Activate a tab
    function activateTab(tabId) {
        chrome.tabs.update(tabId, { active: true });
        chrome.windows.getCurrent((win) => {
            chrome.windows.update(win.id, { focused: true });
        });
        closeModal();
    }

    // Toggle window expansion
    function toggleWindowExpand(windowId) {
        isExpanded[windowId] = !isExpanded[windowId];
        renderTabs(searchInput.value);
    }

    // Update stats
    function updateStats() {
        const windows = Object.keys(windowGroups).length;
        const totalTabs = tabsData.length;
        const activeTabs = tabsData.filter(t => t.active).length;
        
        document.getElementById('tmWindowCount').textContent = windows;
        document.getElementById('tmTabCount').textContent = totalTabs;
        document.getElementById('tmActiveCount').textContent = activeTabs;
    }

    // Setup event listeners
    function setupEventListeners() {
        closeBtn.onclick = closeModal;
        
        overlay.onclick = (e) => {
            if (e.target === overlay) closeModal();
        };
        
        let searchTimeout;
        searchInput.oninput = () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                renderTabs(searchInput.value);
            }, 150);
        };
        
        newWindowBtn.onclick = () => {
            chrome.windows.create({ url: 'chrome://newtab' });
            closeModal();
        };
        
        closeAllBtn.onclick = async () => {
            if (confirm('Close all tabs?')) {
                const tabsToClose = tabsData.map(t => t.id);
                await chrome.tabs.remove(tabsToClose);
                closeModal();
            }
        };
        
        collapseBtn.onclick = () => {
            isExpanded = {};
            renderTabs(searchInput.value);
        };
        
        document.onkeydown = (e) => {
            if (!overlay.classList.contains('active')) return;
            
            if (e.key === 'Escape') {
                closeModal();
            }
        };
    }

    // Escape HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Open modal
    function openModal() {
        overlay.classList.add('active');
        searchInput.value = '';
        isExpanded = {};
        loadTabs();
        searchInput.focus();
    }

    // Close modal
    function closeModal() {
        overlay.classList.remove('active');
    }

    // Listen for messages
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === 'openTabManager') {
            openModal();
            sendResponse({ success: true });
        }
    });

    window.TabManager = { open: openModal, close: closeModal };
    init();
})();

