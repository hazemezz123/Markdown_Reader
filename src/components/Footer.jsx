import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <p>
        &copy; {currentYear} — Built by Hazem ezz •{" "}
        <a
          href="https://github.com/hazemezz123"
          target="_blank"
          rel="noopener noreferrer"
          title="View source on GitHub"
        >
          GitHub
        </a>
      </p>
      <style>{`
        .app-footer {
          padding: 1rem;
          text-align: center;
          font-size: 0.8rem;
          color: var(--color-text);
          opacity: 0.5;
          transition: opacity 0.2s;
          border-top: 1px solid var(--color-border);
        }
        .app-footer:hover {
          opacity: 1;
        }
        .app-footer a {
          color: inherit;
          text-decoration: none;
          border-bottom: 1px dotted currentColor;
        }
        .app-footer a:hover {
          border-bottom-style: solid;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
