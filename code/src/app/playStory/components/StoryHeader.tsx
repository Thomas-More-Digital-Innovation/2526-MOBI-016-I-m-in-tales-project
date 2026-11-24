import { FontSize } from "@/types";
import { useI18nContext } from "@/i18n/i18n-react";
import TeacherIconButton from "./TeacherIconButton";

export interface StoryHeaderProps {
    fontSizeSetting: FontSize;
    onCloseClick: () => void;
    onReplayAudioClick: () => void;
    isTransitioning?: boolean;
}

export default function StoryHeader({
    fontSizeSetting,
    onCloseClick,
    onReplayAudioClick,
    isTransitioning = false,
}: StoryHeaderProps) {
    const { LL } = useI18nContext();

    return (
        <>
            <TeacherIconButton
                icon="replay"
                label={LL.STORY_REPLAY_AUDIO()}
                onClick={onReplayAudioClick}
                disabled={isTransitioning}
                size={fontSizeSetting}
                cls="absolute top-3 left-2 z-100"
            />
            <TeacherIconButton
                icon="close"
                label={LL.STORY_CLOSE()}
                onClick={onCloseClick}
                size={fontSizeSetting}
                cls="absolute top-3 right-2 z-100"
            />
        </>
    );
}
