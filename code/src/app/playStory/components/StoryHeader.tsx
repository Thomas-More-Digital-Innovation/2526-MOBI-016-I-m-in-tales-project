import { Button } from "@components";
import { fontSize } from "../Settings";
import { FontSize } from "@/types";

export interface StoryHeaderProps {
    fontSizeSetting: FontSize;
    onSettingsClick: () => void;
    onCloseClick: () => void;
}

export default function StoryHeader({
    fontSizeSetting,
    onSettingsClick,
    onCloseClick,
}: StoryHeaderProps) {
    const baseFontSize = fontSize[fontSizeSetting];

    return (
        <>
            <Button
                onClick={onSettingsClick}
                cls="absolute top-3 left-2 z-100"
                style={{
                    fontSize: baseFontSize + "px",
                }}>
                Instellingen
            </Button>
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
