import React, { useState } from "react";
import { FileText, Plus, Trash2, Edit2, Check, X } from "lucide-react";
import "../styles/Sidebar.css";

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
    </aside>
  );
};

export default Sidebar;
