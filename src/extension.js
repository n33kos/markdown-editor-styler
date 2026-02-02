const vscode = require("vscode");

class MarkdownEditorStyler {
  constructor() {
    this.decorationTypes = new Map();
    this.enabled = true;
    this.disposables = [];
    this.updateTimeout = null;

    this.createDecorationTypes();
    this.setupEventListeners();
  }

  createDecorationTypes() {
    // Clear existing decorations
    this.decorationTypes.forEach((decoration) => decoration.dispose());
    this.decorationTypes.clear();

    const styles = vscode.workspace
      .getConfiguration()
      .get("markdownEditorStyler");

    // Fallback defaults - simple, non-opinionated styles
    const defaults = {
      h1: "font-size: 2em; font-weight: bold;",
      h2: "font-size: 1.8em; font-weight: bold;",
      h3: "font-size: 1.5em; font-weight: bold;",
      h4: "font-size: 1.3em; font-weight: bold;",
      h5: "font-size: 1.2em; font-weight: bold;",
      h6: "font-size: 1.1em; font-weight: bold;",
      listMarker: "",
      bold: "font-weight: bold;",
      italic: "font-style: italic;",
      hr: "",
    };

    // Create decorations for headers (h1-h6)
    for (let level = 1; level <= 6; level++) {
      const key = `h${level}`;
      const css = styles?.[key] || defaults[key];
      const decoration = vscode.window.createTextEditorDecorationType({
        textDecoration: `none; ${css}`,
      });
      this.decorationTypes.set(level, decoration);
    }

    // Create decoration for list markers
    const listMarkerCSS = styles?.listMarker || defaults.listMarker;
    this.decorationTypes.set(
      "listMarker",
      vscode.window.createTextEditorDecorationType({
        textDecoration: `none; ${listMarkerCSS}`,
      }),
    );

    // Create decoration for bold indicators
    const boldCSS = styles?.bold || defaults.bold;
    this.decorationTypes.set(
      "bold",
      vscode.window.createTextEditorDecorationType({
        textDecoration: `none; ${boldCSS}`,
      }),
    );

    // Create decoration for italic indicators
    const italicCSS = styles?.italic || defaults.italic;
    this.decorationTypes.set(
      "italic",
      vscode.window.createTextEditorDecorationType({
        textDecoration: `none; ${italicCSS}`,
      }),
    );

    // Create decoration for horizontal rules
    const hrCSS = styles?.hr || defaults.hr;
    this.decorationTypes.set(
      "hr",
      vscode.window.createTextEditorDecorationType({
        textDecoration: `none; ${hrCSS}`,
      }),
    );

    // Create decoration types for other markdown elements using theme colors
    this.decorationTypes.set(
      "quote",
      vscode.window.createTextEditorDecorationType({
        backgroundColor: "var(--vscode-textBlockQuote-background)",
        border: "2px solid var(--vscode-textBlockQuote-border)",
        borderRadius: "3px",
      }),
    );

    this.decorationTypes.set(
      "table",
      vscode.window.createTextEditorDecorationType({
        backgroundColor: "var(--vscode-textCodeBlock-background)",
        border: "1px solid var(--vscode-panel-border)",
      }),
    );

    this.decorationTypes.set(
      "indent1",
      vscode.window.createTextEditorDecorationType({
        backgroundColor: "var(--vscode-textCodeBlock-background)",
      }),
    );

    this.decorationTypes.set(
      "indent2",
      vscode.window.createTextEditorDecorationType({
        backgroundColor: "var(--vscode-textCodeBlock-background)",
        opacity: "0.8",
      }),
    );

    this.decorationTypes.set(
      "indent3",
      vscode.window.createTextEditorDecorationType({
        backgroundColor: "var(--vscode-textCodeBlock-background)",
        opacity: "0.6",
      }),
    );
  }

  setupEventListeners() {
    // Listen for active editor changes
    this.disposables.push(
      vscode.window.onDidChangeActiveTextEditor((editor) => {
        if (editor) {
          this.updateDecorations(editor);
        }
      }),
    );

    // Listen for document changes with throttling
    this.disposables.push(
      vscode.workspace.onDidChangeTextDocument((event) => {
        const editor = vscode.window.activeTextEditor;
        if (editor && event.document === editor.document) {
          // Clear existing timeout
          if (this.updateTimeout) {
            clearTimeout(this.updateTimeout);
          }
          // Set new timeout to throttle updates
          this.updateTimeout = setTimeout(() => {
            this.updateDecorations(editor);
          }, 50); // 50ms delay for more responsive updates
        }
      }),
    );

    // Listen for configuration changes
    this.disposables.push(
      vscode.workspace.onDidChangeConfiguration((event) => {
        if (event.affectsConfiguration("markdownEditorStyler")) {
          this.createDecorationTypes();
          const editor = vscode.window.activeTextEditor;
          if (editor) {
            this.updateDecorations(editor);
          }
        }
      }),
    );
  }

  updateDecorations(editor) {
    if (!this.enabled || !editor || editor.document.languageId !== "markdown") {
      return;
    }

    const config = vscode.workspace.getConfiguration("markdownEditorStyler");
    if (!config.get("enabled", true)) {
      this.clearAllDecorations(editor);
      return;
    }

    // Clear all decorations first to ensure clean state
    this.clearAllDecorations(editor);

    const text = editor.document.getText();
    const lines = text.split("\n");

    // Track code block state
    let inFencedCodeBlock = false;
    let codeBlockFence = "";

    // Group ranges by header level and other elements
    const headerRanges = new Map();
    for (let i = 1; i <= 6; i++) {
      headerRanges.set(i, []);
    }

    const listMarkerRanges = [];
    const boldRanges = [];
    const italicRanges = [];
    const hrRanges = [];
    const quoteRanges = [];
    const tableRanges = [];
    const indent1Ranges = [];
    const indent2Ranges = [];
    const indent3Ranges = [];

    lines.forEach((line, lineIndex) => {
      const startPos = new vscode.Position(lineIndex, 0);
      const endPos = new vscode.Position(lineIndex, line.length);
      const range = new vscode.Range(startPos, endPos);

      // Check for fenced code block boundaries (``` or ~~~)
      const fenceMatch = line.match(/^(\s*)(```|~~~)/);
      if (fenceMatch) {
        if (!inFencedCodeBlock) {
          // Starting a fenced code block
          inFencedCodeBlock = true;
          codeBlockFence = fenceMatch[2];
        } else if (fenceMatch[2] === codeBlockFence) {
          // Ending a fenced code block
          inFencedCodeBlock = false;
          codeBlockFence = "";
        }
        return; // Don't process fence lines as headers
      }

      // Check for indented code blocks (4+ spaces at start of line)
      const isIndentedCodeBlock = line.match(/^    /);

      // Skip header processing if we're inside any type of code block
      if (inFencedCodeBlock || isIndentedCodeBlock) {
        return;
      }

      // Check for inline code spans that might contain # at start of line
      if (line.match(/^\s*`[^`]*#[^`]*`/)) {
        return; // Skip lines that start with inline code containing #
      }

      // Headers - only process if not in code blocks
      const headerMatch = line.match(/^(#{1,6})\s+/);
      if (headerMatch) {
        const level = headerMatch[1].length;
        headerRanges.get(level).push(range);
        return;
      }

      // List markers (-, *, +, or numbered lists like 1., 2., etc.)
      const listMatch = line.match(/^(\s*)([-*+]|\d+\.)\s/);
      if (listMatch) {
        const markerStart = listMatch[1].length; // Start after leading whitespace
        const markerEnd = markerStart + listMatch[2].length; // End after the marker
        const markerRange = new vscode.Range(
          new vscode.Position(lineIndex, markerStart),
          new vscode.Position(lineIndex, markerEnd),
        );
        listMarkerRanges.push(markerRange);
      }

      // Horizontal rules (3 or more dashes, underscores, or asterisks)
      if (line.match(/^\s*([-_*])\s*\1\s*\1+\s*$/)) {
        hrRanges.push(range);
        return; // Don't process as other elements
      }

      // Bold text (**text** or __text__) - style entire string including markers
      const boldRegex = /(\*\*|__)(.+?)\1/g;
      let boldMatch;
      while ((boldMatch = boldRegex.exec(line)) !== null) {
        const start = boldMatch.index;
        const end = start + boldMatch[0].length;
        const boldRange = new vscode.Range(
          new vscode.Position(lineIndex, start),
          new vscode.Position(lineIndex, end),
        );
        boldRanges.push(boldRange);
      }

      // Italic text (*text* or _text_, but not ** or __) - style entire string including markers
      const italicRegex =
        /(?<!\*)\*(?!\*)([^*]+?)\*(?!\*)|(?<!_)_(?!_)([^_]+?)_(?!_)/g;
      let italicMatch;
      while ((italicMatch = italicRegex.exec(line)) !== null) {
        const start = italicMatch.index;
        const end = start + italicMatch[0].length;
        const italicRange = new vscode.Range(
          new vscode.Position(lineIndex, start),
          new vscode.Position(lineIndex, end),
        );
        italicRanges.push(italicRange);
      }

      // Quote blocks
      if (line.match(/^\s*>/)) {
        quoteRanges.push(range);
        return;
      }

      // Table rows (simple detection)
      if (line.match(/^\s*\|.*\|\s*$/) || line.match(/^\s*[\|\-\s:]+\s*$/)) {
        tableRanges.push(range);
        return;
      }

      // List indentation (detect nested lists and highlight only the indentation)
      const indentMatch = line.match(/^(\s*)([-*+]|\d+\.)\s/);
      if (indentMatch) {
        const indentSpaces = indentMatch[1];
        const indentLevel = Math.floor(indentSpaces.length / 2);

        if (indentLevel >= 1 && indentSpaces.length > 0) {
          // Create range for just the indentation spaces
          const indentStartPos = new vscode.Position(lineIndex, 0);
          const indentEndPos = new vscode.Position(
            lineIndex,
            indentSpaces.length,
          );
          const indentRange = new vscode.Range(indentStartPos, indentEndPos);

          if (indentLevel === 1) indent1Ranges.push(indentRange);
          else if (indentLevel === 2) indent2Ranges.push(indentRange);
          else if (indentLevel >= 3) indent3Ranges.push(indentRange);
        }
      }
    });

    // Apply decorations for headers - ensure we clear unused levels
    for (let level = 1; level <= 6; level++) {
      const decoration = this.decorationTypes.get(level);
      const ranges = headerRanges.get(level) || [];
      if (decoration) {
        editor.setDecorations(decoration, ranges);
      }
    }

    // Apply decorations for list markers
    const listMarkerDecoration = this.decorationTypes.get("listMarker");
    if (listMarkerDecoration) {
      editor.setDecorations(listMarkerDecoration, listMarkerRanges);
    }

    // Apply decorations for bold indicators
    const boldDecoration = this.decorationTypes.get("bold");
    if (boldDecoration) {
      editor.setDecorations(boldDecoration, boldRanges);
    }

    // Apply decorations for italic indicators
    const italicDecoration = this.decorationTypes.get("italic");
    if (italicDecoration) {
      editor.setDecorations(italicDecoration, italicRanges);
    }

    // Apply decorations for horizontal rules
    const hrDecoration = this.decorationTypes.get("hr");
    if (hrDecoration) {
      editor.setDecorations(hrDecoration, hrRanges);
    }

    // Apply decorations for other elements - always set to ensure clearing
    const quoteDecoration = this.decorationTypes.get("quote");
    if (quoteDecoration) {
      editor.setDecorations(quoteDecoration, quoteRanges);
    }

    const tableDecoration = this.decorationTypes.get("table");
    if (tableDecoration) {
      editor.setDecorations(tableDecoration, tableRanges);
    }

    const indent1Decoration = this.decorationTypes.get("indent1");
    if (indent1Decoration) {
      editor.setDecorations(indent1Decoration, indent1Ranges);
    }

    const indent2Decoration = this.decorationTypes.get("indent2");
    if (indent2Decoration) {
      editor.setDecorations(indent2Decoration, indent2Ranges);
    }

    const indent3Decoration = this.decorationTypes.get("indent3");
    if (indent3Decoration) {
      editor.setDecorations(indent3Decoration, indent3Ranges);
    }
  }

  clearAllDecorations(editor) {
    this.decorationTypes.forEach((decoration) => {
      if (decoration) {
        editor.setDecorations(decoration, []);
      }
    });
  }

  toggle() {
    this.enabled = !this.enabled;
    const editor = vscode.window.activeTextEditor;

    if (editor) {
      if (this.enabled) {
        this.updateDecorations(editor);
        vscode.window.showInformationMessage("Markdown editor styling enabled");
      } else {
        this.clearAllDecorations(editor);
        vscode.window.showInformationMessage(
          "Markdown editor styling disabled",
        );
      }
    }
  }

  dispose() {
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
    }
    this.decorationTypes.forEach((decoration) => decoration.dispose());
    this.disposables.forEach((disposable) => disposable.dispose());
  }
}

let markdownEditorStyler;

function activate(context) {
  markdownEditorStyler = new MarkdownEditorStyler();

  // Register commands
  const toggleCommand = vscode.commands.registerCommand(
    "markdownEditorStyler.toggle",
    () => {
      markdownEditorStyler.toggle();
    },
  );

  const refreshCommand = vscode.commands.registerCommand(
    "markdownEditorStyler.refresh",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        markdownEditorStyler.updateDecorations(editor);
      }
    },
  );

  context.subscriptions.push(toggleCommand);
  context.subscriptions.push(refreshCommand);
  context.subscriptions.push(markdownEditorStyler);

  // Style the currently active editor if it's markdown
  const editor = vscode.window.activeTextEditor;
  if (editor && editor.document.languageId === "markdown") {
    markdownEditorStyler.updateDecorations(editor);
  }
}

function deactivate() {
  if (markdownEditorStyler) {
    markdownEditorStyler.dispose();
  }
}

module.exports = {
  activate,
  deactivate,
};
