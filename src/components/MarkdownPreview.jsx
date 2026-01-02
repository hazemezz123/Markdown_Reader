import React from "react";
import ReactMarkdown from "react-markdown";
import "../styles/MarkdownPreview.css";

const MarkdownPreview = React.forwardRef(({ content, settings = {} }, ref) => {
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
    <div className="preview-container" ref={ref}>
      <div className="markdown-content">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
});

export default React.memo(MarkdownPreview);
