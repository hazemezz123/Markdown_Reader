import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { githubLight, githubDark } from "@uiw/codemirror-theme-github";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { solarizedLight, solarizedDark } from "@uiw/codemirror-theme-solarized";

const MarkdownEditor = React.forwardRef(
  ({ content, onChange, theme, settings }, ref) => {
    const {
      fontSize = 16,
      fontFamily = "mono",
      showLineNumbers = true,
    } = settings || {};

    // Map app themes to CodeMirror themes
    const getThemeExtension = (themeId) => {
      switch (themeId) {
        case "dark":
          return githubDark;
        case "dracula":
          return dracula;
        case "solarized-light":
          return solarizedLight;
        case "solarized-dark":
          return solarizedDark;
        case "light":
        default:
          return githubLight;
      }
    };

    const getFontFamily = (f) => {
      switch (f) {
        case "serif":
          return "serif";
        case "sans":
          return "sans-serif";
        case "mono":
        default:
          return "'Fira Code', 'Menlo', 'Monaco', 'Courier New', monospace";
      }
    };

    return (
      <div className="editor-container" ref={ref}>
        <CodeMirror
          value={content}
          theme={getThemeExtension(theme)}
          extensions={[
            markdown({ base: markdownLanguage, codeLanguages: languages }),
          ]}
          onChange={(value) => onChange(value)}
          basicSetup={{
            lineNumbers: showLineNumbers,
            foldGutter: false,
            highlightActiveLine: true,
            autocompletion: true,
          }}
          style={{
            fontSize: `${fontSize}px`,
            fontFamily: getFontFamily(fontFamily),
            height: "100%",
          }}
          className="codemirror-wrapper"
        />
        <style>{`
        .editor-container {
          height: 100%;
          overflow: hidden; /* CodeMirror handles scrolling */
          background-color: var(--color-bg);
        }
        .codemirror-wrapper {
            height: 100%;
        }
        .cm-theme {
            height: 100%;
        }
        .cm-editor {
            height: 100%;
        }
        .cm-scroller {
            overflow: auto !important;
            padding: 2rem 0; /* Add top/bottom padding for comfort */
        }
        .cm-content {
             padding: 0 2rem; /* Add side padding */
             max-width: 900px;
             margin: 0 auto;
        }
        .cm-lineNumbers {
            padding-left: 1rem;
        }
      `}</style>
      </div>
    );
  }
);

export default React.memo(MarkdownEditor);
