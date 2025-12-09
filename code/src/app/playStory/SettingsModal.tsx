import { useState } from "react";
import Modal from "../components/Modal";
import { fontSize, storySettings } from "./Settings";
import { Button } from "@components";

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
            </div>
        </Modal>
    );
}
