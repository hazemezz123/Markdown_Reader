import { useEffect, useRef } from "react";

export const useScrollSync = (sourceRef, targetRef, enabled = true) => {
  const isScrollingRaw = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    const source = sourceRef.current;
    const target = targetRef.current; // CodeMirror's scroll element might be nested

    // Helper to find the actual scrollable element if a wrapper is passed
    const getScrollElement = (ref) => {
      if (!ref) return null;
      // Check if ref is the scrollable element itself
      if (
        ref.scrollHeight > ref.clientHeight ||
        getComputedStyle(ref).overflowY === "auto" ||
        getComputedStyle(ref).overflowY === "scroll"
      ) {
        return ref;
      }
      // If not, try to find a scrollable child (specific to CodeMirror structure usually .cm-scroller)
      return ref.querySelector(".cm-scroller") || ref;
    };

    const sourceEl = getScrollElement(source);
    const targetEl = getScrollElement(target);

    if (!sourceEl || !targetEl) return;

    const handleScroll = (e) => {
      if (isScrollingRaw.current) return;
      isScrollingRaw.current = true;

      const el = e.target;
      const otherEl = el === sourceEl ? targetEl : sourceEl;

      const percentage = el.scrollTop / (el.scrollHeight - el.clientHeight);

      // Calculate other element's scroll position
      const otherScrollTop =
        percentage * (otherEl.scrollHeight - otherEl.clientHeight);

      otherEl.scrollTop = otherScrollTop;

      // Small timeout to prevent infinite loops but feel responsive
      requestAnimationFrame(() => {
        isScrollingRaw.current = false;
      });
    };

    sourceEl.addEventListener("scroll", handleScroll, { passive: true });
    targetEl.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      sourceEl.removeEventListener("scroll", handleScroll);
      targetEl.removeEventListener("scroll", handleScroll);
    };
  }, [sourceRef, targetRef, enabled]);
};
