import { Button } from "@components";
import { fontSize } from "../Settings";
import { FontSize } from "@/types";
import { useI18nContext } from "@/i18n/i18n-react";

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
    const { LL } = useI18nContext();

    return (
        <>
            <div className="absolute top-3 left-2 z-100 flex gap-2">
                <Button
                    onClick={onSettingsClick}
                    style={{
                        fontSize: baseFontSize + "px",
                    }}>
                    {LL.STORY_SETTINGS()}
                </Button>
                <Button
                    onClick={onReplayAudioClick}
                    style={{
                        fontSize: baseFontSize + "px",
                    }}>
                    {LL.STORY_REPLAY_AUDIO()}
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
