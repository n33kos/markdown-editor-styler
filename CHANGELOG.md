# Change Log

All notable changes to the "Markdown Editor Styler" extension will be documented in this file.

## [2.0.0] - 2026-02-01

### Added
- Custom CSS support for complete styling control
- Simple nested object configuration where each key maps to a CSS string
- List marker styling for bullets (`-`, `*`, `+`) and numbered lists
- Bold text styling (entire `**text**` including markers and content)
- Italic text styling (entire `*text*` including markers and content)
- Horizontal rule styling for `---`, `___`, and `***`
- Rainbow gradient defaults for vibrant, fun styling out of the box
- Comprehensive styled examples showing different themes

### Changed
- Rebranded from "Markdown Header Styler" to "Markdown Editor Styler"
- Configuration namespace changed from `markdownHeaderStyler` to `markdownEditorStyler`
- Command names updated to reflect broader functionality
- Simplified configuration structure to single-level nested object
- Each element (h1-h6, listMarker, bold, italic, hr) is a direct CSS string
- Bold and italic now style the entire formatted string, not just markers
- Enhanced README with multiple themed configuration examples
- More intuitive and flexible styling system

## [1.0.0] - 2026-02-01

### Added
- Initial release of Markdown Header Styler
- Configurable font sizes for all header levels (H1-H6)
- Optional custom header coloring
- Toggle command to enable/disable header styling
- Refresh command to manually update styling
- Real-time styling updates as you type
- Configuration option to enable/disable the extension

### Features
- Visual hierarchy for markdown headers in edit mode
- Default progressive font sizes (H1: 1.8em, H2: 1.5em, H3: 1.3em, H4: 1.2em, H5: 1.1em, H6: 1.05em)
- Fully customizable through VS Code settings
- Lightweight and performant
