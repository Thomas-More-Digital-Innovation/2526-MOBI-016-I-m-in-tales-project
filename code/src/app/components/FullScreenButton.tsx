"use client";
import Image from "next/image";
import { getCurrentWindow } from "@tauri-apps/api/window";

export default function FullScreenButton() {
  const toggleFullscreen = async () => {
    const win = getCurrentWindow();
    const isFull = await win.isFullscreen();
    await win.setFullscreen(!isFull);
  };

  return (
        <button className="p-5 rounded-2xl m-5 text-3xl border-2 border-talesblu-400 text-talesblu-400 hover:bg-talesorang-400 hover:text-white hover:border-white ease-in-out duration-300" 
        onClick={toggleFullscreen}>
            <Image src="/maximize-solid-full.svg" width={25} height={25} alt="Fullscreen"/>
        </button>
    )
}
