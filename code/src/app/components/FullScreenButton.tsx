"use client";

import { getCurrentWindow } from "@tauri-apps/api/window";

export default function FullScreenButton() {
  const toggleFullscreen = async () => {
    const win = getCurrentWindow();
    const isFull = await win.isFullscreen();
    await win.setFullscreen(!isFull);
  };

  return <button onClick={toggleFullscreen}>Toggle fullscreen</button>;
}
