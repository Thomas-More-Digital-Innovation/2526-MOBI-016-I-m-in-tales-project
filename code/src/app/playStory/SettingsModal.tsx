import { useState } from "react";
import { fontSize, storySettings } from "./Settings";
import { Modal } from "@components";
import { StorySettings, FontSize } from "@/types";
import { useI18nContext } from "@/i18n/i18n-react";
import { setVolume } from "./AudioPlayer";

interface Props {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    onSettingsChange?: (settings: StorySettings) => void;
}

export default function SettingsModal({
    isOpen,
    setIsOpen,
    onSettingsChange,
}: Props) {
    const [settings, setSettings] = useState<StorySettings>(storySettings);
    const { LL } = useI18nContext();

    const updateSettings = (next: StorySettings) => {
        setSettings(next);
        storySettings.fontSize = next.fontSize;
        setVolume(next.volume);
        storySettings.showStoryOptions = next.showStoryOptions;
        onSettingsChange?.(next);
    };

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} width="520px" height="auto">
            <div className="p-6 flex flex-col gap-6 text-talesblu-800">
                <div className="border-b border-talesblu-100 pb-3">
                    <h2 className="text-2xl font-black text-talesblu-900 tracking-tight">
                        {LL.STORY_SETTINGS() || "Settings"}
                    </h2>
                </div>

                {/* Font Size section */}
                <div className="flex flex-col gap-2">
                    <h3 className="text-xs font-black uppercase tracking-widest text-talesblu-400">
                        {LL.SETTINGS_TEXT_SIZE()}
                    </h3>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                        {Object.entries(fontSize).map(([key, value]) => {
                            const isSelected = key === settings.fontSize;
                            return (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() =>
                                        updateSettings({
                                            ...settings,
                                            fontSize: key as FontSize,
                                        })
                                    }
                                    className={`py-3 px-4 rounded-xl border-2 text-center transition-all active:scale-95 duration-200 cursor-pointer ${
                                        isSelected
                                            ? "bg-talesorang-500 border-talesorang-500 text-white font-bold shadow-md shadow-talesorang-100"
                                            : "bg-white border-talesblu-100 text-talesblu-700 hover:bg-talesblu-50/50 hover:border-talesblu-200"
                                    }`}
                                >
                                    <span style={{ fontSize: `${value - 2}px` }}>{key}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Volume section */}
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xs font-black uppercase tracking-widest text-talesblu-400">
                            {LL.SETTINGS_VOLUME()}
                        </h3>
                        <span className="text-sm font-bold text-talesblu-600">{Math.round(settings.volume * 100)}%</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 bg-talesblu-50/50 border border-talesblu-100/60 p-3 rounded-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-talesblu-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        <input
                            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-talesorang-500 bg-talesblu-200/50"
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={settings.volume}
                            onChange={(e) =>
                                updateSettings({
                                    ...settings,
                                    volume: Number(e.target.value),
                                })
                            }
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-talesblu-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.192-1.229c0-.428-.068-.84-.192-1.229l1.524-1.525C15.759 8.071 16 9.007 16 10zm-3 0c0 .35-.045.688-.13 1.011l-1.472-1.472A1.996 1.996 0 0011 10c0-.366-.098-.709-.27-1.006L12.203 7.52C12.705 8.212 13 9.07 13 10z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>

                {/* Show override choices switch */}
                <div className="pt-4 border-t border-talesblu-100 flex flex-col gap-2">
                    <h3 className="text-xs font-black uppercase tracking-widest text-talesblu-400">
                        {LL.SETTINGS_SHOW_STORY_OPTIONS()}
                    </h3>
                    <div className="flex items-center justify-between mt-1 bg-talesblu-50/50 border border-talesblu-100/60 p-4 rounded-xl">
                        <span className="text-sm font-medium text-talesblu-600 leading-snug pr-4">
                            {LL.SETTINGS_SHOW_STORY_OPTIONS_DESC()}
                        </span>
                        <button
                            onClick={() =>
                                updateSettings({
                                    ...settings,
                                    showStoryOptions: !settings.showStoryOptions,
                                })
                            }
                            type="button"
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                settings.showStoryOptions ? "bg-talesorang-500" : "bg-slate-300"
                            }`}
                        >
                            <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                    settings.showStoryOptions ? "translate-x-5" : "translate-x-0"
                                }`}
                            />
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
