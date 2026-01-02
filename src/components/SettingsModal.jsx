import React, { useEffect } from "react";
import {
  X,
  Sun,
  Moon,
  Github,
  Ghost,
  Sunrise,
  Sunset,
  Type,
  AlignLeft,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

const THEMES = [
  { id: "light", name: "Light", Icon: Sun },
  { id: "dark", name: "Dark", Icon: Moon },
  { id: "github", name: "GitHub", Icon: Github },
  { id: "dracula", name: "Dracula", Icon: Ghost },
  { id: "solarized-light", name: "Solarized Light", Icon: Sunrise },
  { id: "solarized-dark", name: "Solarized Dark", Icon: Sunset },
];

const FONTS = [
  { id: "sans", name: "Sans-Serif" },
  { id: "serif", name: "Serif" },
  { id: "mono", name: "Monospace" },
];

const LINE_HEIGHTS = [
  { id: "1.4", name: "Compact" },
  { id: "1.7", name: "Normal" },
  { id: "2.0", name: "Relaxed" },
];

const SettingsModal = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  currentTheme,
  onThemeChange,
}) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Settings</h2>
          <button className="close-btn" onClick={onClose} title="Close">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* --- Theme Section --- */}
          <section className="settings-section">
            <h3>Appearance</h3>
            <div className="theme-grid">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  className={`theme-btn ${
                    currentTheme === theme.id ? "active" : ""
                  }`}
                  onClick={() => onThemeChange(theme.id)}
                >
                  <theme.Icon size={18} />
                  <span>{theme.name}</span>
                </button>
              ))}
            </div>
          </section>

          {/* --- Typography Section --- */}
          <section className="settings-section">
            <h3>Typography</h3>

            <div className="setting-row">
              <label>Font Size ({settings.fontSize}px)</label>
              <div className="control-group">
                <button
                  onClick={() =>
                    onUpdateSettings(
                      "fontSize",
                      Math.max(12, settings.fontSize - 1)
                    )
                  }
                  className="size-btn"
                >
                  -
                </button>
                <input
                  type="range"
                  min="12"
                  max="24"
                  value={settings.fontSize}
                  onChange={(e) =>
                    onUpdateSettings("fontSize", parseInt(e.target.value))
                  }
                />
                <button
                  onClick={() =>
                    onUpdateSettings(
                      "fontSize",
                      Math.min(24, settings.fontSize + 1)
                    )
                  }
                  className="size-btn"
                >
                  +
                </button>
              </div>
            </div>

            <div className="setting-row">
              <label>Font Family</label>
              <div className="select-wrapper">
                <select
                  value={settings.fontFamily}
                  onChange={(e) =>
                    onUpdateSettings("fontFamily", e.target.value)
                  }
                >
                  {FONTS.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="setting-row">
              <label>Line Height</label>
              <div className="select-wrapper">
                <select
                  value={settings.lineHeight}
                  onChange={(e) =>
                    onUpdateSettings("lineHeight", e.target.value)
                  }
                >
                  {LINE_HEIGHTS.map((lh) => (
                    <option key={lh.id} value={lh.id}>
                      {lh.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* --- Toggles Section --- */}
          <section className="settings-section">
            <h3>Interface</h3>

            <div
              className="toggle-row"
              onClick={() => onUpdateSettings("autoSave", !settings.autoSave)}
            >
              <span>Auto-save</span>
              {settings.autoSave ? (
                <ToggleRight className="toggle-on" />
              ) : (
                <ToggleLeft className="toggle-off" />
              )}
            </div>

            <div
              className="toggle-row"
              onClick={() =>
                onUpdateSettings("smoothAnimations", !settings.smoothAnimations)
              }
            >
              <span>Smooth Animations</span>
              {settings.smoothAnimations ? (
                <ToggleRight className="toggle-on" />
              ) : (
                <ToggleLeft className="toggle-off" />
              )}
            </div>

            <div
              className="toggle-row"
              onClick={() =>
                onUpdateSettings("showFooter", !settings.showFooter)
              }
            >
              <span>Show Footer Credit</span>
              {settings.showFooter ? (
                <ToggleRight className="toggle-on" />
              ) : (
                <ToggleLeft className="toggle-off" />
              )}
            </div>
          </section>
        </div>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center; /* Center on screen */
          z-index: 1000;
          animation: fadeOverlay 0.2s ease-out;
        }
        
        @keyframes fadeOverlay {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .modal-content {
          background-color: var(--color-bg);
          border: 1px solid var(--color-border);
          border-radius: 8px;
          width: 400px;
          max-width: 90%;
          max-height: 85vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          animation: slideUp 0.25s ease-out;
          color: var(--color-text);
        }

        @keyframes slideUp {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--color-border);
        }

        .modal-header h2 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .close-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--color-text);
          opacity: 0.6;
          transition: opacity 0.2s;
          padding: 4px;
        }
        .close-btn:hover { opacity: 1; }

        .modal-body {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
        }

        .settings-section {
          margin-bottom: 2rem;
        }

        .settings-section h3 {
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--color-text);
          opacity: 0.5;
          margin-bottom: 1rem;
          font-weight: 600;
        }

        .theme-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.5rem;
        }
        .theme-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem;
          border: 1px solid var(--color-border);
          background: transparent;
          color: var(--color-text);
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s;
        }
        .theme-btn:hover { background-color: var(--color-hover); }
        .theme-btn.active {
          background-color: var(--color-hover);
          border-color: var(--color-text);
          font-weight: 500;
        }

        .setting-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          font-size: 0.95rem;
        }
        
        .control-group {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .size-btn {
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid var(--color-border);
            border-radius: 4px;
            background: transparent;
            color: var(--color-text);
            cursor: pointer;
        }
        .size-btn:hover { background-color: var(--color-hover); }

        .select-wrapper {
            position: relative;
        }
        select {
            appearance: none;
            background-color: transparent;
            border: 1px solid var(--color-border);
            color: var(--color-text);
            padding: 0.4rem 2rem 0.4rem 0.8rem;
            border-radius: 4px;
            font-size: 0.9rem;
            cursor: pointer;
        }
        select:hover { background-color: var(--color-hover); }

        .toggle-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.5rem 0;
            cursor: pointer;
            font-size: 0.95rem;
        }
        .toggle-on { color: var(--color-text); transform: scale(1.2); }
        .toggle-off { color: var(--color-border); transform: scale(1.2); }
      `}</style>
    </div>
  );
};

export default SettingsModal;
