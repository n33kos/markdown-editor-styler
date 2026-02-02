# Markdown Header Styler

A Visual Studio Code extension that enhances the readability of markdown files by displaying headers with different font sizes in edit mode.

## Features

- **Visual Header Hierarchy**: Headers are displayed with progressively larger font sizes (H1 largest, H6 smallest)
- **Configurable Font Sizes**: Customize the font size for each header level
- **Optional Header Coloring**: Set a custom color for all headers
- **Toggle On/Off**: Enable or disable styling with a command
- **Real-time Updates**: Styling updates as you type

## Configuration

The extension provides several configuration options:

- `markdownHeaderStyler.h1FontSize`: Font size for H1 headers (default: "1.8em")
- `markdownHeaderStyler.h2FontSize`: Font size for H2 headers (default: "1.5em")
- `markdownHeaderStyler.h3FontSize`: Font size for H3 headers (default: "1.3em")
- `markdownHeaderStyler.h4FontSize`: Font size for H4 headers (default: "1.2em")
- `markdownHeaderStyler.h5FontSize`: Font size for H5 headers (default: "1.1em")
- `markdownHeaderStyler.h6FontSize`: Font size for H6 headers (default: "1.05em")
- `markdownHeaderStyler.headerColor`: Optional color for headers (e.g., "#3366cc")
- `markdownHeaderStyler.enabled`: Enable/disable header styling (default: true)

## Commands

- **Toggle Markdown Header Styling**: Enable/disable the extension's header styling

## Installation

1. Open VS Code
2. Go to Extensions view (Ctrl+Shift+X / Cmd+Shift+X)
3. Search for "Markdown Header Styler"
4. Click Install

## Usage

1. Open any markdown file in VS Code
2. Headers (lines starting with #, ##, ###, etc.) will automatically be styled with larger fonts
3. Use the Command Palette (Ctrl+Shift+P) and search for "Toggle Markdown Header Styling" to enable/disable
4. Customize font sizes and colors through VS Code settings

## Examples

The extension will style markdown like this:

```markdown
# This is H1 - Largest
## This is H2 - Large  
### This is H3 - Medium
#### This is H4 - Small
##### This is H5 - Smaller
###### This is H6 - Smallest
```

## Requirements

- Visual Studio Code 1.74.0 or higher

## Release Notes

### 1.0.0

- Initial release
- Configurable font sizes for all header levels
- Optional header coloring
- Toggle command
- Real-time styling updates