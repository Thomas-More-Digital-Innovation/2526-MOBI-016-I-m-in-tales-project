import { useState } from "react";
import { fontSize, storySettings } from "./Settings";
import { Button, Modal } from "@components";
import { StorySettings, FontSize } from "@/types";
import { useI18nContext } from "@/i18n/i18n-react";

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
        storySettings.volume = next.volume;
        storySettings.showStoryOptions = next.showStoryOptions;
        onSettingsChange?.(next);
    };

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} width="70%" height="70%">
            <div className="p-4 flex flex-col gap-6">
                <div>
                    <h3 className="text-3xl py-2">{LL.SETTINGS_TEXT_SIZE()}</h3>
                    <div className="flex flex-wrap justify-between gap-1">
                        {Object.entries(fontSize).map(([key, value]) => (
                            <Button
                                key={key}
                                onClick={() =>
                                    updateSettings({
                                        ...settings,
                                        fontSize: key as FontSize,
                                    })
                                }
                                cls="flex-1"
                                primary={key === settings.fontSize}>
                                <span
                                    className="flex flex-col"
                                    style={{ fontSize: value + "px" }}>
                                    {key}
                                </span>
                            </Button>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-3xl py-2">{LL.SETTINGS_VOLUME()}</h3>
                    <span className="w-full flex gap-4">
                        <span>{settings.volume * 100}%</span>
                        <input
                            className="w-full accent-talesorang-500"
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={settings.volume}
                            onChange={(e) =>
                                updateSettings({
                                    ...settings,
                                    volume: Number(e.target.value),
                                })
                            }
                        />
                    </span>
                </div>

                <div className="pt-4 border-t border-gray-150">
                    <h3 className="text-3xl py-2">{LL.SETTINGS_SHOW_STORY_OPTIONS()}</h3>
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-gray-500 font-medium">{LL.SETTINGS_SHOW_STORY_OPTIONS_DESC()}</span>
                        <button
                            onClick={() =>
                                updateSettings({
                                    ...settings,
                                    showStoryOptions: !settings.showStoryOptions,
                                })
                            }
                            type="button"
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                settings.showStoryOptions ? "bg-talesorang-500" : "bg-gray-200"
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
