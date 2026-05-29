import { useParams } from "react-router-dom";
import { useState, useEffect, useCallback, useRef } from "react";
import SettingsModal from "./SettingsModal";
import { storySettings } from "./Settings";
import { useStory } from "./useStory";
import { useFullscreen } from "./useFullscreen";
import StoryVisuals from "./components/StoryVisuals";
import StoryOverlay from "./components/StoryOverlay";
import StoryOptions from "./components/StoryOptions";
import StoryHeader from "./components/StoryHeader";
import { resetAudioPlayer } from "./AudioPlayer";
import { StorySettings } from "@/types";
import { Center, LoadingScreen } from "../components";
import { useNfc } from "../components/NfcProvider";
import { loadAllCalibrations, resolveTagForStory } from "@utils/tagMapping";
import { useI18nContext } from "@/i18n/i18n-react";

export default function PlayStory() {
    const { id } = useParams();
    const {
        story,
        currentChapter,
        nextChapter,
        triggerError,
        replayAudio,
        cancelPendingAction,
        currentChapterRef,
    } = useStory(id);
    useFullscreen();

    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [settings, setSettings] = useState<StorySettings>(storySettings);
    const [isLoading, setLoading] = useState(true);
    const [calibrations, setCalibrations] = useState({});
    const { LL } = useI18nContext();

    const { tagUid } = useNfc();
    const lastProcessedTagUid = useRef<string | null>(null);

    useEffect(() => {
        loadAllCalibrations().then(setCalibrations);
    }, []);

    // handle physical board tag scans as discrete single-trigger events
    useEffect(() => {
        if (!tagUid) {
            lastProcessedTagUid.current = null;
            cancelPendingAction();
            return;
        }

        if (tagUid === lastProcessedTagUid.current) {
            return;
        }

        if (!story?.id || !currentChapter) return;
        if (currentChapter.autoAdvance) return;

        lastProcessedTagUid.current = tagUid;

        const allowedItemIds = (currentChapter.option || []).map(o => o.item).filter((item): item is string => !!item);
        const resolvedItemId = resolveTagForStory(tagUid, story.id, calibrations, allowedItemIds);
        const matchingOption = resolvedItemId
            ? currentChapter.option.find(o => o.item === resolvedItemId)
            : undefined;

        if (matchingOption) {
            nextChapter(matchingOption);
        } else {
            triggerError(currentChapter.failAudio);
        }
    }, [tagUid, story?.id, currentChapter, calibrations, nextChapter, triggerError, cancelPendingAction]);

    const closeStory = useCallback(() => {
        resetAudioPlayer();
        window.history.back();
    }, []);

    useEffect(() => {
        function handleKeyPressed(e: KeyboardEvent) {
            if (showSettingsModal) return;

            if (
                e.key === "Escape" ||
                currentChapterRef.current?.option.length === 0
            ) {
                e.preventDefault();
                e.stopPropagation();
                closeStory();
            }
        }
        window.addEventListener("keydown", handleKeyPressed);
        return () => window.removeEventListener("keydown", handleKeyPressed);
    }, [currentChapterRef, showSettingsModal, closeStory]);

    useEffect(() => {
        if (story) {
            setLoading(false);
        }
    }, [story]);

    if (isLoading) {
        return (
            <LoadingScreen
                title={LL.PLAY_LOADING_TITLE()}
                description={LL.PLAY_LOADING_DESC()}
                imageSrc="/PlayStory.svg"
            />
        );
    } else if (!currentChapter && !story) {
        return <Center>
            <p className="text-2xl">{LL.PLAY_NOT_FOUND()}</p>
        </Center>;
    }

    return (
        <main className="bg-white min-h-screen">
            <StoryHeader
                fontSizeSetting={settings.fontSize}
                onSettingsClick={() => setShowSettingsModal(true)}
                onCloseClick={closeStory}
                onReplayAudioClick={replayAudio}
            />

            {currentChapter ? (
                <div className="relative h-screen w-screen">
                    <StoryVisuals image={currentChapter.image} />
                    <StoryOverlay
                        title={currentChapter.title}
                        description={currentChapter.description}
                        fontSizeSetting={settings.fontSize}
                        options={currentChapter.option}
                    />
                </div>
            ) : (
                <p>{LL.PLAY_LOADING()}</p>
            )}

            <StoryOptions
                options={currentChapter?.option}
                onOptionClick={nextChapter}
                onErrorClick={() => triggerError(currentChapter?.failAudio)}
            />

            <SettingsModal
                isOpen={showSettingsModal}
                setIsOpen={setShowSettingsModal}
                onSettingsChange={setSettings}
            />
        </main>
    );
}
