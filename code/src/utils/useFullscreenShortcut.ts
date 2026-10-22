import { useEffect } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";

export function useFullscreenShortcut() {
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if (e.key === "F11") {
        e.preventDefault();
        try {
          const win = getCurrentWindow();
          const isFullscreen = await win.isFullscreen();
          await win.setFullscreen(!isFullscreen);
        } catch (error) {
          console.error("failed to toggle fullscreen:", error);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
}
