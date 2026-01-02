import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Eye, EyeOff, Settings } from "lucide-react";
import Sidebar from "./components/Sidebar";
import MarkdownEditor from "./components/MarkdownEditor";
import MarkdownPreview from "./components/MarkdownPreview";
import Footer from "./components/Footer";
import SettingsModal from "./components/SettingsModal";
import useLocalStorage from "./hooks/useLocalStorage";
import { useResizable } from "./hooks/useResizable";
import "./styles/App.css";

const INITIAL_FILE = {
  id: uuidv4(),
  name: "Welcome.md",
  content:
    "# Welcome to Markdown Reader\n\n- Create new files using the sidebar.\n- Toggle **Preview Mode** to focus on reading.\n- Switch themes using the palette icon.\n\nEnjoy minimal reading.",
};

const DEFAULT_SETTINGS = {
  fontSize: 16,
  lineHeight: "1.7",
  fontFamily: "sans",
  autoSave: true,
  smoothAnimations: true,
  showFooter: true,
};

function App() {
  // --- STATE ---
  const [theme, setTheme] = useLocalStorage("markdown-reader-theme", "light");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useLocalStorage(
    "markdown-reader-settings",
    DEFAULT_SETTINGS
  );
  const [files, setFiles] = useLocalStorage("markdown-reader-files", [
    INITIAL_FILE,
  ]);
  const [activeFileId, setActiveFileId] = useLocalStorage(
    "markdown-reader-active-id",
    null
  );

  // --- RESIZING HOOK ---
  const {
    splitPaneRef,
    editorPaneRef,
    previewPaneRef,
    editorWidth,
    isResizing,
    startResizing,
  } = useResizable(isPreviewMode);

  // --- EFFECTS ---

  // Theme application
  useEffect(() => {
    document.body.className = "";
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  // Ensure active file logic
  useEffect(() => {
    if (files.length === 0) {
      const newFile = { ...INITIAL_FILE, id: uuidv4() };
      setFiles([newFile]);
      setActiveFileId(newFile.id);
    } else if (activeFileId && !files.find((f) => f.id === activeFileId)) {
      setActiveFileId(files[0].id);
    } else if (!activeFileId && files.length > 0) {
      setActiveFileId(files[0].id);
    }
  }, [files, activeFileId, setFiles, setActiveFileId]);

  // --- HANDLERS ---
  const togglePreview = () => setIsPreviewMode((prev) => !prev);

  const handleNewFile = () => {
    const newFile = { id: uuidv4(), name: "Untitled.md", content: "" };
    setFiles([...files, newFile]);
    setActiveFileId(newFile.id);
    if (isPreviewMode) setIsPreviewMode(false);
  };

  const handleDeleteFile = (id) => {
    const newFiles = files.filter((f) => f.id !== id);
    setFiles(newFiles);
    if (activeFileId === id) setActiveFileId(null);
  };

  const handleRenameFile = (id, n) =>
    setFiles(files.map((f) => (f.id === id ? { ...f, name: n } : f)));
  const handleUpdateContent = (c) =>
    setFiles(
      files.map((f) => (f.id === activeFileId ? { ...f, content: c } : f))
    );

  const activeFile = files.find((f) => f.id === activeFileId);

  const updateSettings = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className={`app-container ${isPreviewMode ? "preview-mode" : ""}`}>
      <div className="sidebar-wrapper">
        <Sidebar
          files={files}
          activeFileId={activeFileId}
          onSelectFile={setActiveFileId} // Direct setter usage
          onNewFile={handleNewFile}
          onRenameFile={handleRenameFile}
          onDeleteFile={handleDeleteFile}
        />
      </div>

      <main className="main-content">
        <header className="main-header">
          <div className="header-title">
            {isPreviewMode && activeFile && (
              <span className="file-title">{activeFile.name}</span>
            )}
          </div>
          <div className="header-actions">
            <button
              onClick={togglePreview}
              className="icon-btn"
              title={isPreviewMode ? "Edit Mode" : "Preview Mode"}
            >
              {isPreviewMode ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="icon-btn"
              title="Settings"
            >
              <Settings size={20} />
            </button>
            <SettingsModal
              isOpen={isSettingsOpen}
              onClose={() => setIsSettingsOpen(false)}
              settings={settings}
              onUpdateSettings={updateSettings}
              currentTheme={theme}
              onThemeChange={setTheme}
            />
          </div>
        </header>

        {activeFile ? (
          <div
            className={`split-view ${isResizing ? "is-resizing" : ""}`}
            ref={splitPaneRef}
          >
            <div
              className="pane editor-pane"
              ref={editorPaneRef}
              style={{
                width: isPreviewMode ? "0" : `${editorWidth}%`,
                flex: isPreviewMode ? "0 0 0" : "none",
              }}
            >
              <MarkdownEditor
                content={activeFile.content}
                onChange={handleUpdateContent}
              />
            </div>

            {!isPreviewMode && (
              <div className="resizer" onMouseDown={startResizing} />
            )}

            <div
              className="pane preview-pane"
              ref={previewPaneRef}
              style={{
                width: isPreviewMode ? "100%" : `${100 - editorWidth}%`,
                flex: isPreviewMode ? "1" : "none",
              }}
            >
              <MarkdownPreview
                content={activeFile.content}
                settings={settings}
              />
            </div>
          </div>
        ) : (
          <div className="no-file-selected">No File Selected</div>
        )}

        {settings.showFooter && <Footer />}
      </main>
    </div>
  );
}

export default App;
