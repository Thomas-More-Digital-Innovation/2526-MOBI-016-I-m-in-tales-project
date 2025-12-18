import { useState } from "react";
import { fontSize, storySettings } from "./Settings";
import { Button, Modal } from "@components";
import { StorySettings, FontSize } from "@/types";

interface Props {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function SettingsModal({ isOpen, setIsOpen }: Props) {
    const [settings, setSettings] = useState<StorySettings>(storySettings);
    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} width="70%" height="70%">
            <div className="p-4">
                {/* font size */}
                <h1 className="text-3xl py-2">Tekst Groote</h1>
                <div className="flex flex-wrap justify-between gap-1">
                    {Object.entries(fontSize).map(([key, value]) => (
                        <Button
                            key={key}
                            onClick={() => {
                                setSettings((prev) => {
                                    const next = {
                                        ...prev,
                                        fontSize: key as FontSize,
                                    };
                                    storySettings.fontSize = key as FontSize;
                                    return next;
                                });
                            }}
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
                <div>
                    <h1 className="text-3xl py-2">Volume</h1>
                    <span className="w-full flex gap-4">
                        <span>{settings.volume * 100}%</span>
                        <input
                            className="w-full accent-talesorang-500"
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={settings.volume}
                            onChange={(e) => {
                                setSettings((prev) => {
                                    const next = {
                                        ...prev,
                                        volume: Number(e.target.value),
                                    };
                                    storySettings.volume = Number(
                                        e.target.value
                                    );
                                    return next;
                                });
                            }}
                        />
                    </span>
                </div>
            </div>
        </Modal>
    );
}
