# Markdown Editor Styler

A Visual Studio Code extension that enhances the readability of markdown files by displaying headers with different font sizes in edit mode.

## Features

- **Visual Header Hierarchy**: Headers are displayed with progressively larger font sizes (H1 largest, H6 smallest)
- **Custom CSS Control**: Apply custom CSS to any markdown element using simple key-value pairs
- **List Marker Styling**: Style bullet points and numbered list markers
- **Bold Indicator Styling**: Style the `**` or `__` characters that create bold text
- **Italic Indicator Styling**: Style the `*` or `_` characters that create italic text
- **Toggle On/Off**: Enable or disable styling with a command
- **Real-time Updates**: Styling updates as you type

## Configuration

The extension uses a simple nested object where each key maps directly to a CSS string.

### Settings

The extension works out of the box with simple, non-opinionated defaults (just larger font sizes for headers). Customize to your liking:

```json
{
  "markdownEditorStyler": {
    "h1": "font-size: 2em; font-weight: bold;",
    "h2": "font-size: 1.8em; font-weight: bold;",
    "h3": "font-size: 1.5em; font-weight: bold;",
    "h4": "font-size: 1.3em; font-weight: bold;",
    "h5": "font-size: 1.2em; font-weight: bold;",
    "h6": "font-size: 1.1em; font-weight: bold;",
    "listMarker": "",
    "bold": "font-weight: bold;",
    "italic": "font-style: italic;",
    "hr": ""
  },
  "markdownEditorStyler.enabled": true
}
```

### Available Keys

- **`h1` - `h6`**: Header levels 1-6
- **`listMarker`**: Bullet points (`-`, `*`, `+`) and numbered list markers (`1.`, `2.`, etc.)
- **`bold`**: Bold text (entire `**text**` or `__text__` including markers and content)
- **`italic`**: Italic text (entire `*text*` or `_text_` including markers and content)
- **`hr`**: Horizontal rules (`---`, `___`, `***`)

## Commands

- **Toggle Markdown Header Styling**: Enable/disable the extension's header styling

## Installation

1. Open VS Code
2. Go to Extensions view (Ctrl+Shift+X / Cmd+Shift+X)
3. Search for "Markdown Editor Styler"
4. Click Install

## Usage

1. Open any markdown file in VS Code
2. Headers (lines starting with #, ##, ###, etc.) will automatically be styled with larger fonts
3. Use the Command Palette (Ctrl+Shift+P) and search for "Toggle Markdown Editor Styling" to enable/disable
4. Customize font sizes and colors through VS Code settings

## Examples

Here are some example configurations and how they'll style your markdown:

### Sized Headers (Default)

**Configuration:**

```json
{
  "markdownEditorStyler": {
    "h1": "font-size: 2em; font-weight: bold;",
    "h2": "font-size: 1.8em; font-weight: bold;",
    "h3": "font-size: 1.5em; font-weight: bold;",
    "h4": "font-size: 1.3em; font-weight: bold;",
    "h5": "font-size: 1.2em; font-weight: bold;",
    "h6": "font-size: 1.1em; font-weight: bold;",
    "listMarker": "",
    "bold": "font-weight: bold;",
    "italic": "font-style: italic;",
    "hr": ""
  }
}
```

**Result:** Headers with default color but sized header fonts from H1 to H6.

### Rainbow Gradient Headers

**Configuration:**

```json
{
  "markdownEditorStyler": {
    "h1": "font-size: 2em; font-weight: bold; background: linear-gradient(90deg,rgba(176, 11, 11, 1) 1%, rgba(255, 162, 0, 1) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;",
    "h2": "font-size: 1.8em; font-weight: bold; background: linear-gradient(90deg,rgba(237, 163, 83, 1) 0%, rgba(237, 216, 83, 1) 100%);-webkit-background-clip: text; -webkit-text-fill-color: transparent;",
    "h3": "font-size: 1.5em; font-weight: bold; background: linear-gradient(90deg,rgba(237, 216, 83, 1) 0%, rgba(51, 191, 38, 1) 100%);-webkit-background-clip: text; -webkit-text-fill-color: transparent;",
    "h4": "font-size: 1.3em; font-weight: bold; background: linear-gradient(90deg,rgba(51, 191, 38, 1) 0%, rgba(38, 142, 222, 1) 100%);-webkit-background-clip: text; -webkit-text-fill-color: transparent;",
    "h5": "font-size: 1.2em; font-weight: bold; background: linear-gradient(90deg,rgba(38, 142, 222, 1) 0%, rgba(140, 0, 255, 1) 100%);-webkit-background-clip: text; -webkit-text-fill-color: transparent;",
    "h6": "font-size: 1.1em; font-weight: bold; background: linear-gradient(90deg,rgba(140, 0, 255, 1) 0%, rgba(255, 0, 153, 1) 100%);-webkit-background-clip: text; -webkit-text-fill-color: transparent;",
    "listMarker": "background: linear-gradient(90deg,rgba(11, 140, 176, 1) 0%, rgba(47, 255, 0, 1) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;",
    "bold": "font-weight: bold; background: linear-gradient(90deg,rgba(155, 58, 224, 1) 0%, rgba(59, 152, 235, 1) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;",
    "italic": "font-style: italic; background: linear-gradient(90deg,rgba(176, 11, 77, 1) 0%, rgba(179, 0, 255, 1) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"
  }
}
```

**Result:** Headers with vibrant rainbow gradients - H1 in red-to-orange, H2 in orange-to-yellow, etc.

---

### Dark Theme with Subtle Colors

**Configuration:**

```json
{
  "markdownEditorStyler": {
    "h1": "font-size: 2em; color: #61dafb; font-weight: 900;",
    "h2": "font-size: 1.7em; color: #98c379; font-weight: 700;",
    "listMarker": "color: #e06c75;",
    "bold": "color: #d19a66; font-weight: bold;",
    "italic": "color: #c678dd; font-style: italic;"
  }
}
```

**Result:** Clean, developer-friendly colors - cyan headers, green subheaders, colored list markers and formatting.

---

### Monospace Minimalist

**Configuration:**

```json
{
  "markdownEditorStyler": {
    "h1": "font-family: 'Courier New'; font-size: 1.5em; text-transform: uppercase; letter-spacing: 2px;",
    "h2": "font-family: 'Courier New'; font-size: 1.3em; font-style: italic;",
    "listMarker": "color: #666;",
    "bold": "background-color: #333; padding: 2px 4px;",
    "hr": "color: #444; font-weight: bold;"
  }
}
```

**Result:** Monospace headers with uppercase H1s, subtle list markers, highlighted bold text.

---

### Playful & Colorful

**Configuration:**

```json
{
  "markdownEditorStyler": {
    "h1": "font-size: 2.5em; color: #ff006e; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);",
    "listMarker": "color: #06ffa5; font-size: 1.2em;",
    "bold": "color: #ffd60a; font-weight: 900; text-decoration: underline;",
    "italic": "color: #8338ec; font-style: italic; font-size: 1.1em;"
  }
}
```

**Result:** Fun, vibrant colors with emphasized formatting - perfect for creative writing or brainstorming.

## Requirements

- Visual Studio Code 1.74.0 or higher

## Release Notes

### 2.0.0

- Custom CSS support for complete styling control
- Simple nested object configuration where each key maps to a CSS string
- List marker styling for bullets (`-`, `*`, `+`) and numbered lists
- Bold text styling (entire `**text**` including markers and content)
- Italic text styling (entire `*text*` including markers and content)
- Horizontal rule styling for `---`, `___`, and `***`
- Rainbow gradient defaults for vibrant, fun styling out of the box
- Comprehensive styled examples showing different themes

### 1.0.0

- Initial release
- Configurable font sizes for all header levels
- Optional header coloring
- Toggle command
- Real-time styling updates
