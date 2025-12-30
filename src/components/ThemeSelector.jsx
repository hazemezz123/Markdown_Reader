import React, { useState, useRef, useEffect } from "react";
import {
  Palette,
  Check,
  Sun,
  Moon,
  Github,
  Ghost,
  Sunrise,
  Sunset,
} from "lucide-react";

const THEMES = [
  { id: "light", name: "Light", Icon: Sun, color: "#ffffff" },
  { id: "dark", name: "Dark", Icon: Moon, color: "#000000" },
  { id: "github", name: "GitHub", Icon: Github, color: "#f6f8fa" },
  { id: "dracula", name: "Dracula", Icon: Ghost, color: "#282a36" },
  {
    id: "solarized-light",
    name: "Solarized Light",
    Icon: Sunrise,
    color: "#fdf6e3",
  },
  {
    id: "solarized-dark",
    name: "Solarized Dark",
    Icon: Sunset,
    color: "#002b36",
  },
];

const ThemeSelector = ({ currentTheme, onThemeChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  return (
    <div className="theme-selector" ref={dropdownRef}>
      <button
        className="icon-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="Change Theme"
      >
        <Palette size={20} />
      </button>

      {isOpen && (
        <div className="theme-dropdown">
          <div className="dropdown-header">Select Theme</div>
          <ul className="theme-list">
            {THEMES.map((theme) => (
              <li
                key={theme.id}
                className={`theme-option ${
                  currentTheme === theme.id ? "active" : ""
                }`}
                onClick={() => {
                  onThemeChange(theme.id);
                  setIsOpen(false);
                }}
              >
                <div className="theme-icon-wrapper">
                  <theme.Icon size={16} />
                </div>
                <span className="theme-name">{theme.name}</span>
                {currentTheme === theme.id && (
                  <Check size={14} className="check-icon" />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <style>{`
        .theme-selector {
          position: relative;
        }
        .theme-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 0.5rem;
          background-color: var(--color-bg);
          border: 1px solid var(--color-border);
          border-radius: 6px;
          width: 180px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          z-index: 100;
          overflow: hidden;
          animation: fadeIn 0.15s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dropdown-header {
          padding: 0.5rem 1rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--color-text);
          opacity: 0.6;
          border-bottom: 1px solid var(--color-border);
          background-color: var(--sidebar-bg);
        }
        .theme-list {
          list-style: none;
          padding: 0;
          max-height: 300px;
          overflow-y: auto;
        }
        .theme-option {
          display: flex;
          align-items: center;
          padding: 0.5rem 1rem;
          font-size: 0.9rem;
          cursor: pointer;
          transition: background-color 0.1s;
          color: var(--color-text);
        }
        .theme-option:hover {
          background-color: var(--color-hover);
        }
        .theme-option.active {
          font-weight: 500;
          background-color: var(--color-hover);
        }
        .theme-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 0.75rem;
          color: var(--color-text);
          opacity: 0.8;
        }
        .theme-name {
          flex: 1;
        }
        .check-icon {
          opacity: 0.7;
        }
      `}</style>
    </div>
  );
};

export default ThemeSelector;
