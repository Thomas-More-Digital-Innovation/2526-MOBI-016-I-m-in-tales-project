import { getCurrentWindow } from "@tauri-apps/api/window";

export default function FullScreenButton() {
    const toggleFullscreen = async () => {
        const win = getCurrentWindow();
        const isFullScreen = await win.isFullscreen();
        await win.setFullscreen(!isFullScreen);
    };

    return (
        <button
            className="text-3xl cursor-pointer font-semibold duration-150 ease-in-out py-3 px-8 h-fit shadow-[0px_1px_2px_1px_#cfcfcf] bg-[#f0f0f0] hover:scale-85 hover:drop-shadow-none text-[#242424] rounded"
            onClick={toggleFullscreen}>
            <img
                src="/maximize-solid-full.svg"
                width={36}
                height={1}
                alt="Fullscreen"
            />
        </button>
    );
}
