import { useState, useEffect, useRef, useCallback } from "react";

export function useResizable(isPreviewMode) {
  const splitPaneRef = useRef(null);
  const editorPaneRef = useRef(null);
  const previewPaneRef = useRef(null);
  const widthRef = useRef(50); // Store current width to sync on mouseup

  // Resizing state
  const [editorWidth, setEditorWidth] = useState(50); // percentage
  const [isResizing, setIsResizing] = useState(false);

  const startResizing = useCallback(() => {
    setIsResizing(true);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  const stopResizing = useCallback(() => {
    if (isResizing) {
      setIsResizing(false);
      setEditorWidth(widthRef.current); // Sync state on drop
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }
  }, [isResizing]);

  const resize = useCallback(
    (mouseMoveEvent) => {
      if (isResizing && splitPaneRef.current) {
        const paneRect = splitPaneRef.current.getBoundingClientRect();
        const offsetX = mouseMoveEvent.clientX - paneRect.left;
        const newWidth = (offsetX / paneRect.width) * 100;

        if (newWidth >= 20 && newWidth <= 80) {
          widthRef.current = newWidth;
          // Direct DOM update for performance
          if (editorPaneRef.current) {
            editorPaneRef.current.style.width = `${newWidth}%`;
          }
          if (previewPaneRef.current) {
            previewPaneRef.current.style.width = `${100 - newWidth}%`;
          }
        }
      }
    },
    [isResizing]
  );

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);

  // Force sync styles on mode switch to prevent direct DOM conflicts
  useEffect(() => {
    if (editorPaneRef.current && previewPaneRef.current) {
      if (isPreviewMode) {
        editorPaneRef.current.style.width = "0";
        previewPaneRef.current.style.width = "100%";
      } else {
        editorPaneRef.current.style.width = `${editorWidth}%`;
        previewPaneRef.current.style.width = `${100 - editorWidth}%`;
      }
    }
  }, [isPreviewMode, editorWidth]);

  return {
    splitPaneRef,
    editorPaneRef,
    previewPaneRef,
    editorWidth,
    isResizing,
    startResizing,
  };
}
