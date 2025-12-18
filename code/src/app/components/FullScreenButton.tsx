import { getCurrentWindow } from "@tauri-apps/api/window";
import type { CSSProperties } from "react";

interface FullScreenButtonProps {
  cls?: string;
  primary?: boolean;
  style?: CSSProperties;
}

export default function FullScreenButton({
  cls = "",
  primary = false,
  style,
}: FullScreenButtonProps) {
  const toggleFullscreen = async () => {
    const win = getCurrentWindow();
    const isFullScreen = await win.isFullscreen();
    await win.setFullscreen(!isFullScreen);
  };

  const variantClass = primary
    ? "bg-[#0d4254] shadow-[0px_1px_2px_1px_#6e8e98]"
    : "bg-[#f6745e] shadow-[0px_1px_2px_1px_#faac9e]";

  return (
    <button
      className={`text-3xl cursor-pointer font-semibold duration-150 text-white ease-in-out py-3 px-8 h-fit hover:scale-85 hover:drop-shadow-none rounded ${cls} ${variantClass}`}
      style={style}
      onClick={toggleFullscreen}>
      <img src="/maximize-solid-full.svg" width={36} height={1} alt="Fullscreen" />
    </button>
  );
}
