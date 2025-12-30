import React from "react";
import ReactMarkdown from "react-markdown";

const MarkdownPreview = ({ content }) => {
  return (
    <div className="preview-container">
      <div className="markdown-content">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
      <style>{`
        .preview-container {
          height: 100%;
          padding: 2rem;
          overflow-y: auto;
          border-left: 1px solid var(--color-border);
        }
        .markdown-content {
          font-family: var(--font-sans);
          line-height: 1.7;
          max-width: 800px;
          margin: 0 auto;
        }
        .markdown-content h1,
        .markdown-content h2,
        .markdown-content h3,
        .markdown-content h4,
        .markdown-content h5,
        .markdown-content h6 {
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
          letter-spacing: -0.025em;
        }
        .markdown-content h1 { font-size: 2.25rem; border-bottom: 1px solid #eee; padding-bottom: 0.5rem; }
        .markdown-content h2 { font-size: 1.75rem; }
        .markdown-content h3 { font-size: 1.5rem; }
        .markdown-content p {
          margin-bottom: 1.5rem;
        }
        .markdown-content ul, .markdown-content ol {
          margin-bottom: 1.5rem;
          padding-left: 1.5rem;
        }
        .markdown-content li {
          margin-bottom: 0.5rem;
        }
        .markdown-content blockquote {
          border-left: 4px solid var(--color-border);
          padding-left: 1rem;
          margin-left: 0;
          margin-bottom: 1.5rem;
          font-style: italic;
          color: #555;
        }
        .markdown-content pre {
          background-color: #f7f7f7;
          padding: 1rem;
          border-radius: 4px;
          overflow-x: auto;
          margin-bottom: 1.5rem;
          border: 1px solid #eee;
        }
        .markdown-content code {
          font-family: var(--font-mono);
          font-size: 0.9em;
          background-color: #f7f7f7;
          padding: 0.2rem 0.4rem;
          border-radius: 3px;
        }
        .markdown-content pre code {
          background-color: transparent;
          padding: 0;
        }
        .markdown-content a {
          color: inherit;
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .markdown-content a:hover {
          background-color: var(--color-text);
          color: var(--color-bg);
          text-decoration: none;
        }
        .markdown-content hr {
          margin: 2rem 0;
          border: 0;
          border-top: 1px solid var(--color-border);
        }
        .markdown-content img {
            max-width: 100%;
            border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default MarkdownPreview;
