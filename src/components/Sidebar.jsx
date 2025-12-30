import React, { useState } from "react";
import { FileText, Plus, Trash2, Edit2, Check, X } from "lucide-react";

const Sidebar = ({
  files,
  activeFileId,
  onSelectFile,
  onNewFile,
  onRenameFile,
  onDeleteFile,
}) => {
  const [editingFileId, setEditingFileId] = useState(null);
  const [editName, setEditName] = useState("");

  const handleStartRename = (e, file) => {
    e.stopPropagation();
    setEditingFileId(file.id);
    setEditName(file.name);
  };

  const handleSaveRename = (e) => {
    e.stopPropagation();
    if (editName.trim()) {
      onRenameFile(editingFileId, editName.trim());
    }
    setEditingFileId(null);
    setEditName("");
  };

  const handleCancelRename = (e) => {
    e.stopPropagation();
    setEditingFileId(null);
    setEditName("");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>NOTE</h1>
        <button
          onClick={onNewFile}
          className="new-file-btn"
          aria-label="New File"
        >
          <Plus size={20} />
        </button>
      </div>

      <ul className="file-list">
        {files.map((file) => (
          <li
            key={file.id}
            className={`file-item ${file.id === activeFileId ? "active" : ""}`}
            onClick={() => onSelectFile(file.id)}
          >
            <div className="file-icon">
              <FileText size={16} />
            </div>

            {editingFileId === file.id ? (
              <div
                className="rename-input-wrapper"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveRename(e);
                    if (e.key === "Escape") handleCancelRename(e);
                  }}
                />
                <button onClick={handleSaveRename} className="action-btn save">
                  <Check size={14} />
                </button>
                <button
                  onClick={handleCancelRename}
                  className="action-btn cancel"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="file-info">
                <span className="file-name">{file.name}</span>
                <div className="file-actions">
                  <button
                    onClick={(e) => handleStartRename(e, file)}
                    className="action-btn rename"
                    aria-label="Rename"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteFile(file.id);
                    }}
                    className="action-btn delete"
                    aria-label="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      <style>{`
        .sidebar {
          width: 250px;
          height: 100vh;
          border-right: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
          background-color: var(--color-bg);
          font-family: var(--font-sans);
        }
        .sidebar-header {
          padding: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--color-border);
        }
        .sidebar-header h1 {
          font-size: 1.25rem;
          font-weight: 700;
          letter-spacing: -0.05em;
        }
        .new-file-btn {
          border: 1px solid var(--color-border);
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s;
        }
        .new-file-btn:hover {
          background-color: var(--color-text);
          color: var(--color-bg);
        }
        .file-list {
          flex: 1;
          list-style: none;
          overflow-y: auto;
          padding: 1rem 0;
        }
        .file-item {
          padding: 0.75rem 1.5rem;
          display: flex;
          align-items: center;
          cursor: pointer;
          transition: background-color 0.1s;
          border-left: 3px solid transparent;
        }
        .file-item:hover {
          background-color: var(--color-hover);
        }
        .file-item.active {
          background-color: var(--color-hover);
          border-left-color: var(--color-text);
          font-weight: 500;
        }
        .file-icon {
          margin-right: 0.75rem;
          display: flex;
          align-items: center;
        }
        .file-info {
          flex: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
          overflow: hidden;
        }
        .file-name {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .file-actions {
          display: flex;
          gap: 4px;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .file-item:hover .file-actions {
          opacity: 1;
        }
        .action-btn {
          padding: 4px;
          border-radius: 4px;
        }
        .action-btn:hover {
          background-color: #e0e0e0;
        }
        .action-btn.delete:hover {
          color: #d00;
          background-color: transparent;
        }
        .rename-input-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .rename-input-wrapper input {
          width: 100%;
          border: 1px solid var(--color-border);
          padding: 2px 4px;
          font-size: 0.9rem;
          font-family: inherit;
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
