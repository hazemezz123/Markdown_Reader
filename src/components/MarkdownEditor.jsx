import React from "react";

const MarkdownEditor = ({ content, onChange }) => {
  return (
    <div className="editor-container">
      <textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder="# Type your markdown here..."
        className="markdown-textarea"
        spellCheck="false"
      />
      <style>{`
        .editor-container {
          height: 100%;
          padding: 2rem;
        }
        .markdown-textarea {
          width: 100%;
          height: 100%;
          border: none;
          resize: none;
          outline: none;
          font-family: var(--font-mono);
          font-size: 14px;
          line-height: 1.6;
          color: var(--color-text);
          background: transparent;
        }
      `}</style>
    </div>
  );
};

export default React.memo(MarkdownEditor);
