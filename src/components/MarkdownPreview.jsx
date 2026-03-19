import React from "react";
import ReactMarkdown from "react-markdown";
import "../styles/MarkdownPreview.css";

const MarkdownPreview = React.forwardRef(
  ({ content, settings = {}, direction = "ltr" }, ref) => {
    const { fontSize = 16, lineHeight = "1.7", fontFamily = "sans" } = settings;

    const getFontFamily = (f) => {
      switch (f) {
        case "serif":
          return "serif";
        case "mono":
          return "monospace";
        default:
          return "var(--font-sans)";
      }
    };

    return (
      <div className="preview-container" ref={ref} dir={direction}>
        <div
          className="markdown-content"
          style={{
            fontSize: `${fontSize}px`,
            lineHeight,
            fontFamily: getFontFamily(fontFamily),
          }}
        >
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    );
  },
);

export default React.memo(MarkdownPreview);
