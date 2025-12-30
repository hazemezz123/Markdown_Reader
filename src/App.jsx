import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Eye, EyeOff } from "lucide-react";
import Sidebar from "./components/Sidebar";
import MarkdownEditor from "./components/MarkdownEditor";
import MarkdownPreview from "./components/MarkdownPreview";
import Footer from "./components/Footer";
import ThemeSelector from "./components/ThemeSelector";

const INITIAL_FILE = {
  id: uuidv4(),
  name: "Welcome.md",
  content:
    "# Welcome to Markdown Reader\n\n- Create new files using the sidebar.\n- Toggle **Preview Mode** to focus on reading.\n- Switch themes using the palette icon.\n\nEnjoy minimal reading.",
};

function App() {
  // --- STATE ---
  const [theme, setTheme] = useState(
    () => localStorage.getItem("markdown-reader-theme") || "light"
  );
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const [files, setFiles] = useState(() => {
    const saved = localStorage.getItem("markdown-reader-files");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [INITIAL_FILE];
  });

  const [activeFileId, setActiveFileId] = useState(() => {
    return localStorage.getItem("markdown-reader-active-id") || null;
  });

  // --- EFFECTS ---

  // Theme application
  useEffect(() => {
    // Remove class based theme if any
    document.body.className = "";
    // Apply data-theme
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("markdown-reader-theme", theme);
  }, [theme]);

  // Files persistence
  useEffect(() => {
    localStorage.setItem("markdown-reader-files", JSON.stringify(files));
  }, [files]);

  useEffect(() => {
    if (activeFileId)
      localStorage.setItem("markdown-reader-active-id", activeFileId);
  }, [activeFileId]);

  // Ensure active file
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
  }, [files, activeFileId]);

  // --- HANDLERS ---
  const togglePreview = () => setIsPreviewMode((prev) => !prev);

  const handleNewFile = () => {
    const newFile = { id: uuidv4(), name: "Untitled.md", content: "" };
    setFiles([...files, newFile]);
    setActiveFileId(newFile.id);
    // If in preview mode, switch back to edit mode to type name?
    // Usually standard behavior, let's keep user there unless they want to edit immediately.
    // Actually better to exit preview mode to edit.
    if (isPreviewMode) setIsPreviewMode(false);
  };

  const handleDeleteFile = (id) => {
    const newFiles = files.filter((f) => f.id !== id);
    setFiles(newFiles);
    if (activeFileId === id) setActiveFileId(null); // Effect will pick next
  };

  const handleRenameFile = (id, n) =>
    setFiles(files.map((f) => (f.id === id ? { ...f, name: n } : f)));
  const handleUpdateContent = (c) =>
    setFiles(
      files.map((f) => (f.id === activeFileId ? { ...f, content: c } : f))
    );

  const activeFile = files.find((f) => f.id === activeFileId);

  return (
    <div className={`app-container ${isPreviewMode ? "preview-mode" : ""}`}>
      <div className="sidebar-wrapper">
        <Sidebar
          files={files}
          activeFileId={activeFileId}
          onSelectFile={(id) => {
            setActiveFileId(id);
          }}
          onNewFile={handleNewFile}
          onRenameFile={handleRenameFile}
          onDeleteFile={handleDeleteFile}
        />
      </div>

      <main className="main-content">
        <header className="main-header">
          <div className="header-title">
            {/* Show title only in preview mode maybe? Or always? */}
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
            <ThemeSelector currentTheme={theme} onThemeChange={setTheme} />
          </div>
        </header>

        {activeFile ? (
          <div className="split-view">
            <div className="pane editor-pane">
              <MarkdownEditor
                content={activeFile.content}
                onChange={handleUpdateContent}
              />
            </div>
            <div className="pane preview-pane">
              <MarkdownPreview content={activeFile.content} />
            </div>
          </div>
        ) : (
          <div className="no-file-selected">No File Selected</div>
        )}

        <Footer />
      </main>

      <style>{`
        .app-container {
          display: flex;
          height: 100vh;
          width: 100vw;
          overflow: hidden;
          background-color: var(--color-bg);
          color: var(--color-text);
        }

        /* Sidebar Transition */
        .sidebar-wrapper {
          width: 250px;
          height: 100%;
          flex-shrink: 0;
          transition: margin-left 0.3s ease-in-out;
          border-right: 1px solid var(--color-border);
          background-color: var(--sidebar-bg);
        }

        .app-container.preview-mode .sidebar-wrapper {
          margin-left: -250px;
        }

        /* Main Content */
        .main-content {
          flex: 1;
          height: 100%;
          min-width: 0;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        /* Header / Toolbar */
        .main-header {
          position: absolute; /* Keep absolute to float over? Or sticky? */
          /* Let's make it part of flow if possible to avoid overlap issues with large content, 
             but specs say "Header/Toolbar" usually stays up. 
             If we make it static, it pushes content down.
             Current css has margin-top: 40px on panes to account for absolute header.
          */
          position: absolute;
          top: 0;
          right: 0;
          left: 0;
          height: 50px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 1rem;
          z-index: 10;
          pointer-events: none; /* Let clicks pass through if needed, but buttons need pointer-events auto */
        }
        .header-actions {
          pointer-events: auto;
          display: flex;
          gap: 0.5rem;
          margin-left: auto; /* Push to right */
        }
        .header-title {
          pointer-events: auto;
          font-weight: 600;
          opacity: 0;

          /* Add background to title so it's readable over text? 
             Actually in preview mode header overlays content?
             If header overlays, we need to ensure content has padding-top.
             The .pane has margin-top: 40px. 
          */
          transition: opacity 0.3s;
        }
        .app-container.preview-mode .header-title {
          opacity: 1;
        }

        .icon-btn {
          padding: 8px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s;
          color: var(--color-text);
          opacity: 0.6;
        }
        .icon-btn:hover {
          background-color: var(--color-hover);
          opacity: 1;
        }

        /* Split View & Transitions */
        .split-view {
          display: flex;
          flex: 1;
          height: 100%; /* Fill available space */
          margin-top: 50px; /* Header space */
          overflow: hidden; /* Scroll inside panes */
        }
        
        .pane {
          transition: all 0.3s ease-in-out;
          height: 100%;
          display: flex;
          flex-direction: column; 
          /* Ensure child takes height */
        }
        
        /* Make direct children of pane (Editor/Preview) scroll themselves */
        
        .editor-pane {
          flex: 1;
          min-width: 0;
          border-right: 1px solid var(--color-border);
          opacity: 1;
        }

        .preview-pane {
          flex: 1;
          min-width: 0;
        }
        
        /* Preview Mode Styles */
        .app-container.preview-mode .editor-pane {
          flex: 0;
          min-width: 0;
          width: 0;
          border-right: none;
          opacity: 0;
          padding: 0;
          margin: 0; 
          overflow: hidden;
        }
        
        .app-container.preview-mode .preview-pane {
          /* Centered reading experience in preview mode */
          max-width: 900px; /* Optional constraint for readability */
          margin: 0 auto;
          flex: 1;
          border-left: none; /* Remove border if present */
        }

        /* Mobile Adjustments */
        @media (max-width: 768px) {
           .app-container { flex-direction: column; }
           .sidebar-wrapper { 
             width: 100%; 
             height: auto; 
             margin-left: 0; /* No side scroll */
             max-height: 300px;
           }
           /* Hide sidebar completely in preview mode on mobile */
           .app-container.preview-mode .sidebar-wrapper {
             display: none; 
             margin-left: 0;
           }
           .split-view { flex-direction: column; margin-top: 50px; } /* header still needs space */
           .pane { flex: 1; }
           .main-header { position: absolute; height: 50px; justify-content: flex-end; }
           
           .app-container.preview-mode .editor-pane {
             display: none;
           }
        }
      `}</style>
    </div>
  );
}

export default App;
