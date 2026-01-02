import React from "react";
import ReactMarkdown from "react-markdown";
import "../styles/MarkdownPreview.css";

const MarkdownPreview = ({ content, settings = {} }) => {
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
    <div className="preview-container">
      <div className="markdown-content">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
};

export default React.memo(MarkdownPreview);
