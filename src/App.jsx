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
import { useScrollSync } from "./hooks/useScrollSync";
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
  textDirection: "auto",
  autoSave: true,
  smoothAnimations: true,
  showFooter: true,
  showLineNumbers: true,
  scrollSync: true,
};

const RTL_CHAR_REGEX =
  /[\u0590-\u05FF\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFF]/;

const getEffectiveDirection = (content = "", preference = "auto") => {
  if (preference === "rtl") return "rtl";
  if (preference === "ltr") return "ltr";
  return RTL_CHAR_REGEX.test(content) ? "rtl" : "ltr";
};

function App() {
  // --- STATE ---
  const [theme, setTheme] = useLocalStorage("markdown-reader-theme", "light");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useLocalStorage(
    "markdown-reader-settings",
    DEFAULT_SETTINGS,
  );
  const [files, setFiles] = useLocalStorage("markdown-reader-files", [
    INITIAL_FILE,
  ]);
  const [activeFileId, setActiveFileId] = useLocalStorage(
    "markdown-reader-active-id",
    null,
  );

  const activeFile = files.find((f) => f.id === activeFileId);
  const effectiveDirection = getEffectiveDirection(
    activeFile?.content,
    settings.textDirection,
  );

  // --- RESIZING HOOK ---
  const {
    splitPaneRef,
    editorPaneRef,
    previewPaneRef,
    editorWidth,
    isResizing,
    startResizing,
  } = useResizable(isPreviewMode, effectiveDirection);

  // --- EFFECTS ---
  // --- REFS ---
  const editorRef = React.useRef(null);
  const previewRef = React.useRef(null);

  useScrollSync(editorRef, previewRef, settings.scrollSync);

  // Theme application
  useEffect(() => {
    document.body.className = "";
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  // Direction application
  useEffect(() => {
    document.documentElement.setAttribute("dir", effectiveDirection);
    document.body.setAttribute("dir", effectiveDirection);
  }, [effectiveDirection]);

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

  const handleDownloadFile = (id) => {
    const file = files.find((f) => f.id === id);
    if (!file) return;

    const blob = new Blob([file.content ?? ""], {
      type: "text/markdown;charset=utf-8",
    });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    const fileName = file.name.endsWith(".md") ? file.name : `${file.name}.md`;

    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(url);
  };

  const handleRenameFile = (id, n) =>
    setFiles(files.map((f) => (f.id === id ? { ...f, name: n } : f)));
  const handleUpdateContent = (c) =>
    setFiles(
      files.map((f) => (f.id === activeFileId ? { ...f, content: c } : f)),
    );

  const updateSettings = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div
      className={`app-container ${isPreviewMode ? "preview-mode" : ""} dir-${effectiveDirection}`}
      dir={effectiveDirection}
    >
      <div className="sidebar-wrapper">
        <Sidebar
          files={files}
          activeFileId={activeFileId}
          onSelectFile={setActiveFileId} // Direct setter usage
          onNewFile={handleNewFile}
          onRenameFile={handleRenameFile}
          onDeleteFile={handleDeleteFile}
          onDownloadFile={handleDownloadFile}
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
              direction={effectiveDirection}
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
                ref={editorRef}
                content={activeFile.content}
                onChange={handleUpdateContent}
                theme={theme}
                settings={settings}
                direction={effectiveDirection}
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
                ref={previewRef}
                content={activeFile.content}
                settings={settings}
                direction={effectiveDirection}
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
