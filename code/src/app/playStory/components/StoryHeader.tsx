import { Button } from "@components";
import { fontSize } from "../Settings";
import { FontSize } from "@/types";

export interface StoryHeaderProps {
    fontSizeSetting: FontSize;
    onSettingsClick: () => void;
    onCloseClick: () => void;
    onReplayAudioClick: () => void;
}

export default function StoryHeader({
    fontSizeSetting,
    onSettingsClick,
    onCloseClick,
    onReplayAudioClick,
}: StoryHeaderProps) {
    const baseFontSize = fontSize[fontSizeSetting];

    return (
        <>
            <div className="absolute top-3 left-2 z-100 flex gap-2">
                <Button
                    onClick={onSettingsClick}
                    style={{
                        fontSize: baseFontSize + "px",
                    }}>
                    Instellingen
                </Button>
                <Button
                    onClick={onReplayAudioClick}
                    style={{
                        fontSize: baseFontSize + "px",
                    }}>
                    Geluid opnieuw spelen
                </Button>
            </div>
            <Button
                onClick={onCloseClick}
                cls="absolute top-3 right-2 z-100"
                style={{
                    fontSize: baseFontSize + "px",
                }}>
                X
            </Button>
        </>
    );
}
