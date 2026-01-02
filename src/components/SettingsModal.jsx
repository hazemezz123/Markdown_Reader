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
import "../styles/SettingsModal.css";

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
    </div>
  );
};

export default SettingsModal;
