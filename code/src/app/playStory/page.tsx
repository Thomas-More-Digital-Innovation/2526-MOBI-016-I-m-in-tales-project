import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback, useRef } from "react";
import { storySettings, saveStorySettings } from "./Settings";
import { useStory } from "./useStory";
import { useFullscreen } from "./useFullscreen";
import StoryVisuals from "./components/StoryVisuals";
import StoryOverlay from "./components/StoryOverlay";
import StoryOptions, { StoryOptionsReveal } from "./components/StoryOptions";
import StoryHeader from "./components/StoryHeader";
import { resetAudioPlayer } from "./AudioPlayer";
import { StorySettings } from "@/types";
import { Center, LoadingScreen } from "../components";
import { useNfc } from "@components/NfcProvider";
import { loadAllCalibrations, resolveTagForStory } from "@utils/tagMapping";
import ObjectCells from "./components/ObjectCells";
import { useI18nContext } from "@/i18n/i18n-react";

export default function PlayStory() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [settings, setSettings] = useState<StorySettings>(storySettings);
    const {
        story,
        currentChapter,
        nextChapter,
        triggerError,
        replayAudio,
        cancelPendingAction,
        currentChapterRef,
        isTransitioning,
        activeObject,
        playObjectSound,
    } = useStory(id, settings.autoPlayObjectSounds);
    useFullscreen();

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

        lastProcessedTagUid.current = tagUid;

        if (isTransitioning) {
            return;
        }

        if (!story?.id || !currentChapter) return;
        if (currentChapter.autoAdvance) return;

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
    }, [tagUid, story?.id, currentChapter, calibrations, nextChapter, triggerError, cancelPendingAction, isTransitioning]);

    const closeStory = useCallback(() => {
        resetAudioPlayer();
        navigate(-1);
    }, [navigate]);

    useEffect(() => {
        function handleKeyPressed(e: KeyboardEvent) {
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
    }, [currentChapterRef, closeStory]);

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
        <main className="bg-black min-h-screen overflow-hidden">
            <StoryHeader
                fontSizeSetting={settings.fontSize}
                onCloseClick={closeStory}
                onReplayAudioClick={replayAudio}
                isTransitioning={isTransitioning}
            />

            {currentChapter ? (
                <div className="h-screen w-screen">
                    <StoryOverlay
                        title={settings.showTitle ? currentChapter.title : undefined}
                        description={settings.showDescription ? currentChapter.description : undefined}
                        fontSizeSetting={settings.fontSize}
                        options={currentChapter.option}
                    >
                        <div className="relative w-full h-full">
                            <StoryVisuals image={currentChapter.image} text={currentChapter.text} fontSizeSetting={settings.fontSize} />
                            {!currentChapter.autoAdvance && (
                                <ObjectCells
                                    options={currentChapter.option}
                                    activeIndex={activeObject}
                                    onHover={playObjectSound}
                                    fontSizeSetting={settings.fontSize}
                                />
                            )}
                        </div>
                    </StoryOverlay>
                </div>
            ) : (
                <p>{LL.PLAY_LOADING()}</p>
            )}

            {settings.showStoryOptions ? (
                <StoryOptions
                    options={currentChapter?.option}
                    onOptionClick={nextChapter}
                    fontSizeSetting={settings.fontSize}
                    isTransitioning={isTransitioning}
                    onErrorClick={() => triggerError(currentChapter?.failAudio)}
                    onDisable={() => {
                        const next = { ...settings, showStoryOptions: false };
                        Object.assign(storySettings, next);
                        saveStorySettings(next);
                        setSettings(next);
                    }}
                />
            ) : (
                <StoryOptionsReveal
                    onEnable={() => {
                        const next = { ...settings, showStoryOptions: true };
                        Object.assign(storySettings, next);
                        saveStorySettings(next);
                        setSettings(next);
                    }}
                />
            )}
        </main>
    );
}
