# Essential Tab - Implementation Plan (v5.1.0)

## Project Overview
Add productivity-focused features with "Nothing" brand theming - minimal, monochrome, typography-driven design.

## Features to Implement

### 1. Smart Bookmarks Manager
- **Description**: Organize and manage bookmarks with custom folders
- **Implementation**: Chrome bookmarks API with custom UI overlay
- **Features**:
  - Create/edit/delete bookmark folders
  - Drag & drop bookmark organization
  - Quick search bookmarks
  - Import/Export bookmarks
  - **No API keys required**

### 2. Clipboard Manager
- **Description**: History of clipboard items with pinning
- **Implementation**: Background script tracking clipboard changes
- **Features**:
  - Store text/image history (last 50 items)
  - Pin important clips
  - Quick paste from history
  - Delete items
  - Clear all history

### 3. Quick Notes Hotkey
- **Description**: Instant note capture with Alt+N
- **Implementation**: Keyboard event listener + storage
- **Features**:
  - Alt+N to capture selection as note
  - Auto-save URL context
  - Quick add to default note
  - Notification on save

### 4. Tab Grouping by Activity
- **Description**: Organize tabs into logical groups
- **Implementation**: Tab + session management
- **Features**:
  - Create named groups from open tabs
  - Color-coded group labels
  - Save/Restore groups
  - **No API keys required**

### 5. Calculator Widget
- **Description**: Quick calculation widget
- **Implementation**: CSS + JavaScript calculator
- **Features**:
  - Basic + Scientific modes
  - History of calculations
  - Keyboard shortcuts
  - Copy result button

### 6. Dictionary & Thesaurus
- **Description**: Word lookup and vocabulary
- **Implementation**: Local dictionary data or free API fallback
- **Features**:
  - Word definition lookup
  - Synonyms/antonyms
  - Word of the day (from local list)
  - Save words to vocabulary
  - **No API keys required**

### 7. System Monitor Widget
- **Description**: Display system metrics
- **Implementation**: Native browser APIs
- **Features**:
  - Memory usage (if available)
  - CPU indicators
  - Network status
  - Simple visual bars

### 8. QR Code Generator
- **Description**: Generate QR codes from text/URL
- **Implementation**: JavaScript QR library
- **Features**:
  - Generate from text/URL
  - Generate from current tab URL
  - Save QR as image
  - Camera scanner (if supported)

### 9. Daily Quote Widget
- **Description**: Display motivational quotes
- **Implementation**: Pre-built quotes array
- **Features**:
  - Curated quote database
  - Refresh button
  - Copy quote
  - Share to notes

---

## Design System - "Nothing" Theme

### Typography
- **Titles**: NDOT.otf (uploaded by user)
- **Body Text**: NTYPE.otf (uploaded by user)
- **Code/Mono**: SF Mono / Space Mono

### Color Palette
- **Background**: #000000
- **Surface**: #1a1a1a
- **Surface Hover**: #2a2a2a
- **Border**: #333333
- **Text Primary**: #ffffff
- **Text Secondary**: #888888
- **Accent**: #ffffff (monochrome)
- **Radius**: 12px

### Design Principles
- Minimal monochrome aesthetic
- Heavy focus on typography
- Subtle borders, no shadows
- Smooth transitions
- Keyboard-first interactions

---

## Technical Architecture

### New Files to Create
1. `essential_tab_extension/widgets/bookmarks.html`
2. `essential_tab_extension/widgets/bookmarks.js`
3. `essential_tab_extension/widgets/clipboard.html`
4. `essential_tab_extension/widgets/clipboard.js`
5. `essential_tab_extension/widgets/calculator.html`
6. `essential_tab_extension/widgets/calculator.js`
7. `essential_tab_extension/widgets/dictionary.html`
8. `essential_tab_extension/widgets/dictionary.js`
9. `essential_tab_extension/widgets/system.html`
10. `essential_tab_extension/widgets/system.js`
11. `essential_tab_extension/widgets/qrcode.html`
12. `essential_tab_extension/widgets/qrcode.js`
13. `essential_tab_extension/widgets/quotes.html`
14. `essential_tab_extension/widgets/quotes.js`
15. `essential_tab_extension/widgets/quick-notes.js`

### Updated Files
1. `essential_tab_extension/manifest.json` - Add permissions, commands
2. `essential_tab_extension/content-script.js` - Alt+N handler
3. `essential_tab_extension/popup.html` - Add feature toggles
4. `essential_tab_extension/popup.js` - Handle widget messages
5. `essential_tab_extension/index.html` - Add widgets to drawer
6. `essential_tab_extension/styles.css` - Widget styles + fonts

### Manifest Updates
```json
{
  "permissions": [
    "storage",
    "tabs",
    "bookmarks",
    "clipboardRead",
    "clipboardWrite"
  ],
  "commands": {
    "quick-note": {
      "suggested_key": {
        "default": "Alt+N",
        "mac": "Option+N"
      },
      "description": "Quick note from selection"
    }
  }
}
```

---

## Implementation Priority

### Phase 1 (Core)
1. Calculator Widget
2. Daily Quote Widget
3. Quick Notes Hotkey (Alt+N)
4. Clipboard Manager

### Phase 2 (Data)
5. Dictionary & Thesaurus
6. System Monitor Widget
7. QR Code Generator

### Phase 3 (Organization)
8. Smart Bookmarks
9. Tab Grouping

---

## Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| `Alt+N` | Quick Note from Selection |
| `Ctrl+Shift+C` | Open Clipboard |
| `Alt+D` | Open Dictionary |

---

## Dependencies & Constraints
- ✅ No external API keys required (except optional dictionary API fallback)
- ✅ All features work offline
- ✅ Minimal resource usage
- ✅ Privacy-focused (local storage)
- ✅ Consistent with Nothing brand aesthetic

---

## Testing Checklist
- [ ] Calculator accuracy
- [ ] Clipboard permissions granted
- [ ] Alt+N captures selection
- [ ] Dictionary lookup works
- [ ] System metrics display
- [ ] QR code generation
- [ ] Quote database loading
- [ ] Performance with multiple items

---

*Last Updated: v5.1.0*

