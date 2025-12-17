import { useEffect, useRef } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";

export function useFullscreen() {
    const wasFullscreen = useRef(false);

    useEffect(() => {
        const win = getCurrentWindow();
        win.isFullscreen().then((isFullscreen) => {
            wasFullscreen.current = Boolean(isFullscreen);
            if (!isFullscreen) {
                win.setFullscreen(true);
            }
        });

        // Restore fullscreen state on unmount (also when we navigate away)
        return () => {
            if (!wasFullscreen.current) {
                const win = getCurrentWindow();
                win.setFullscreen(false);
            }
        };
    }, []);
}
