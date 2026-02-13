# Essential Tab - Feature Implementation Plan

## Project Overview
Add browser-wide features and theming capabilities that work across all tabs, not just the new tab page.

## Features to Implement

### 1. 🌙 Browser-Wide Dark Mode
- **Description**: Toggle dark mode on any website
- **Implementation**: Chrome content script that inverts colors/styles
- **Features**:
  - Toggle on/off with keyboard shortcut
  - Adjustable brightness slider
  - Exclude list for specific sites
  - Smooth transitions between light/dark

### 2. ⌨️ Global Command Palette
- **Description**: Searchable command menu accessible from any tab
- **Implementation**: Overlay injected via content script
- **Features**:
  - Navigate to bookmarks
  - Search history
  - Open closed tabs
  - Quick actions (clear cache, screenshot, etc.)
  - Custom keyboard shortcut to activate

### 3. 📑 Tab Manager
- **Description**: View and manage all tabs across all windows
- **Implementation**: New modal window from new tab or popup
- **Features**:
  - List all tabs with favicons and titles
  - Search tabs by title or URL
  - Group tabs by window
  - Close multiple tabs at once
  - Pin/Unpin tabs
  - Duplicate tabs
  - Move tabs between windows

### 4. 💾 Session Manager
- **Description**: Save and restore tab groups
- **Implementation**: Chrome storage API with named sessions
- **Features**:
  - Save current window as named session
  - Restore saved sessions
  - List all saved sessions
  - Delete sessions
  - Auto-save sessions periodically

### 5. 📖 Focus Reading Mode
- **Description**: Clean up cluttered articles for reading
- **Implementation**: Content script that extracts main content
- **Features**:
  - Toggle reading mode on any page
  - Adjustable font size
  - Font family selection
  - Line spacing adjustment
  - Save reading preferences per site

### 6. 🎨 Custom Theme Injection
- **Description**: Inject custom CSS into any website
- **Implementation**: Chrome content scripts with user-defined CSS
- **Features**:
  - Create custom themes per domain
  - Built-in theme presets
  - CSS editor with syntax highlighting
  - Import/Export themes

---

## Technical Architecture

### Manifest Updates (manifest.json)
```json
{
  "permissions": [
    "storage",
    "tabs",
    "activeTab",
    "scripting",
    "sessions",
    "tabGroups"
  ],
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content-script.js"],
      "css": ["content-styles.css"],
      "run_at": "document_idle"
    }
  ],
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icon16.png",
      "48": "icon48.png",
      "128": "icon128.png"
    }
  }
}
```

### New Files to Create
1. `essential_tab_extension/popup.html` - Extension popup UI
2. `essential_tab_extension/popup.js` - Popup functionality
3. `essential_tab_extension/popup.css` - Popup styles
4. `essential_tab_extension/content-script.js` - Global content scripts
5. `essential_tab_extension/content-styles.css` - Content script styles
6. `essential_tab_extension/tab-manager.html` - Tab manager modal
7. `essential_tab_extension/tab-manager.js` - Tab manager logic
8. `essential_tab_extension/sessions.html` - Session manager modal
9. `essential_tab_extension/sessions.js` - Session manager logic

### Settings Integration
- Add new sections to existing Settings modal
- Keyboard shortcuts configuration
- Theme exclusions list
- Reading mode preferences

---

## Implementation Priority

### Phase 1 (High Priority)
1. Global Command Palette
2. Browser-Wide Dark Mode
3. Tab Manager

### Phase 2 (Medium Priority)
4. Session Manager
5. Reading Mode

### Phase 3 (Lower Priority)
6. Custom Theme Injection

---

## Keyboard Shortcuts Plan
| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+K` | Open Command Palette |
| `Ctrl+Shift+D` | Toggle Dark Mode |
| `Ctrl+Shift+T` | Open Tab Manager |
| `Ctrl+Shift+R` | Toggle Reading Mode |

---

## Dependencies & Constraints
- ✅ No external API keys required
- ✅ No voice commands
- ✅ Works browser-wide
- ✅ Minimal resource usage
- ✅ Offline functionality

