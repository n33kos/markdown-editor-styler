const vscode = require("vscode");

class MarkdownHeaderStyler {
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

    const config = vscode.workspace.getConfiguration("markdownHeaderStyler");
    const headerColor = config.get("headerColor");

    const headerLevels = [
      { level: 1, fontSize: config.get("h1FontSize") || "1.8em" },
      { level: 2, fontSize: config.get("h2FontSize") || "1.5em" },
      { level: 3, fontSize: config.get("h3FontSize") || "1.3em" },
      { level: 4, fontSize: config.get("h4FontSize") || "1.2em" },
      { level: 5, fontSize: config.get("h5FontSize") || "1.1em" },
      { level: 6, fontSize: config.get("h6FontSize") || "1.05em" },
    ];

    headerLevels.forEach(({ level, fontSize }) => {
      const decorationOptions = {
        fontWeight: "bold",
        textDecoration: `none; font-size: ${fontSize}`,
      };


      if (headerColor) {
        decorationOptions.color = headerColor;
      }

      const decoration =
        vscode.window.createTextEditorDecorationType(decorationOptions);
      this.decorationTypes.set(level, decoration);
    });

    // Create decoration types for other markdown elements using theme colors
    this.decorationTypes.set(
      "quote",
      vscode.window.createTextEditorDecorationType({
        backgroundColor: "var(--vscode-textBlockQuote-background)",
        border: "2px solid var(--vscode-textBlockQuote-border)",
        borderRadius: "3px"
      })
    );

    this.decorationTypes.set(
      "table",
      vscode.window.createTextEditorDecorationType({
        backgroundColor: "var(--vscode-textCodeBlock-background)",
        border: "1px solid var(--vscode-panel-border)"
      })
    );

    this.decorationTypes.set(
      "indent1",
      vscode.window.createTextEditorDecorationType({
        backgroundColor: "var(--vscode-textCodeBlock-background)"
      })
    );

    this.decorationTypes.set(
      "indent2", 
      vscode.window.createTextEditorDecorationType({
        backgroundColor: "var(--vscode-textCodeBlock-background)",
        opacity: "0.8"
      })
    );

    this.decorationTypes.set(
      "indent3",
      vscode.window.createTextEditorDecorationType({
        backgroundColor: "var(--vscode-textCodeBlock-background)",
        opacity: "0.6"
      })
    );
  }

  setupEventListeners() {
    // Listen for active editor changes
    this.disposables.push(
      vscode.window.onDidChangeActiveTextEditor((editor) => {
        if (editor) {
          this.updateDecorations(editor);
        }
      })
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
      })
    );

    // Listen for configuration changes
    this.disposables.push(
      vscode.workspace.onDidChangeConfiguration((event) => {
        if (event.affectsConfiguration("markdownHeaderStyler")) {
          this.createDecorationTypes();
          const editor = vscode.window.activeTextEditor;
          if (editor) {
            this.updateDecorations(editor);
          }
        }
      })
    );
  }

  updateDecorations(editor) {
    if (!this.enabled || !editor || editor.document.languageId !== "markdown") {
      return;
    }

    const config = vscode.workspace.getConfiguration("markdownHeaderStyler");
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
    let codeBlockFence = '';

    // Group ranges by header level and other elements
    const headerRanges = new Map();
    for (let i = 1; i <= 6; i++) {
      headerRanges.set(i, []);
    }

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
          codeBlockFence = '';
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
          const indentEndPos = new vscode.Position(lineIndex, indentSpaces.length);
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
        vscode.window.showInformationMessage("Markdown header styling enabled");
      } else {
        this.clearAllDecorations(editor);
        vscode.window.showInformationMessage(
          "Markdown header styling disabled"
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

let markdownHeaderStyler;

function activate(context) {
  markdownHeaderStyler = new MarkdownHeaderStyler();

  // Register commands
  const toggleCommand = vscode.commands.registerCommand(
    "markdownHeaderStyler.toggle",
    () => {
      markdownHeaderStyler.toggle();
    }
  );

  const refreshCommand = vscode.commands.registerCommand(
    "markdownHeaderStyler.refresh",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        markdownHeaderStyler.updateDecorations(editor);
      }
    }
  );

  context.subscriptions.push(toggleCommand);
  context.subscriptions.push(refreshCommand);
  context.subscriptions.push(markdownHeaderStyler);

  // Style the currently active editor if it's markdown
  const editor = vscode.window.activeTextEditor;
  if (editor && editor.document.languageId === "markdown") {
    markdownHeaderStyler.updateDecorations(editor);
  }
}

function deactivate() {
  if (markdownHeaderStyler) {
    markdownHeaderStyler.dispose();
  }
}

module.exports = {
  activate,
  deactivate,
};
