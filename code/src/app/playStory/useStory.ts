import { useState, useEffect, useRef, useCallback } from "react";
import { Story, Chapter, Option } from "@/types";
import { playAudio, preloadAudios, stopAudio, resetAudioPlayer } from "./AudioPlayer";
import { loadStoryData, bytesToUrl } from "@/utils/storyIO";

type AudioType = "none" | "narration" | "option" | "error";

interface PendingAction {
    type: "next" | "error";
    option?: Option;
    failAudioUrl?: string | null;
}

const getAudioUrl = (bytes: Uint8Array | number[] | null | undefined): string | null => {
    if (!bytes) return null;
    const length = bytes instanceof Uint8Array ? bytes.length : (Array.isArray(bytes) ? bytes.length : 0);
    if (length === 0) return null;
    const url = bytesToUrl(bytes, "audio/mpeg");
    return url === "/placeholder.png" ? null : url;
};

export function useStory(storyId: string | undefined) {
    const [story, setStory] = useState<Story | null>(null);
    const [currentChapter, setCurrentChapter] = useState<Chapter | undefined>(undefined);
    const currentChapterRef = useRef<Chapter | undefined>(undefined);

    const [isInitialPlaying, setIsInitialPlaying] = useState(false);
    const [activeAudioType, setActiveAudioType] = useState<AudioType>("none");
    const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);

    useEffect(() => {
        currentChapterRef.current = currentChapter;
    }, [currentChapter]);

    const getChapterById = useCallback(
        (chapterId: string | undefined): Chapter | undefined => {
            return story?.chapter.find((ch: Chapter) => ch.id === chapterId);
        },
        [story]
    );

    const transitionTo = useCallback(
        async (option: Option) => {
            stopAudio();
            setActiveAudioType("option");
            setIsInitialPlaying(false);
            setPendingAction(null);

            if (option.audio) {
                await playAudio(option.audio);
            }

            const chapter = getChapterById(option.nextChapter);
            if (chapter) {
                setCurrentChapter(chapter);
            } else {
                setActiveAudioType("none");
            }
        },
        [getChapterById]
    );

    const handleSelectOption = useCallback(
        async (option: Option) => {
            if (isInitialPlaying) {
                setPendingAction({ type: "next", option });
            } else {
                await transitionTo(option);
            }
        },
        [isInitialPlaying, transitionTo]
    );

    const handleTriggerError = useCallback(
        async (failAudioUrl: string | null | undefined) => {
            if (isInitialPlaying) {
                setPendingAction({ type: "error", failAudioUrl });
            } else {
                stopAudio();
                if (failAudioUrl) {
                    setActiveAudioType("error");
                    setIsInitialPlaying(false);
                    await playAudio(failAudioUrl);
                    setActiveAudioType("none");
                }
            }
        },
        [isInitialPlaying]
    );

    const handleReplayAudio = useCallback(async () => {
        if (!currentChapter?.audio) return;
        stopAudio();
        setIsInitialPlaying(false);
        setActiveAudioType("narration");
        await playAudio(currentChapter.audio);
        setActiveAudioType("none");
    }, [currentChapter]);

    const cancelPendingAction = useCallback(() => {
        setPendingAction(null);
    }, []);

    // smart pre-buffering and initial playback cycle on chapter change
    useEffect(() => {
        if (!currentChapter) return;

        let active = true;

        // collect all audios for preloading
        const pathsToPreload: string[] = [];
        if (currentChapter.audio) pathsToPreload.push(currentChapter.audio);
        if (currentChapter.failAudio) pathsToPreload.push(currentChapter.failAudio);
        currentChapter.option.forEach((opt) => {
            if (opt.audio) pathsToPreload.push(opt.audio);
        });

        // preload next possible chapters' audio assets to pre-buffer
        currentChapter.option.forEach((opt) => {
            const nextCh = getChapterById(opt.nextChapter);
            if (nextCh) {
                if (nextCh.audio) pathsToPreload.push(nextCh.audio);
                if (nextCh.failAudio) pathsToPreload.push(nextCh.failAudio);
                nextCh.option.forEach((nextOpt) => {
                    if (nextOpt.audio) pathsToPreload.push(nextOpt.audio);
                });
            }
        });

        preloadAudios(pathsToPreload);

        async function startNarration() {
            if (!currentChapter) return;
            if (currentChapter.audio) {
                setIsInitialPlaying(true);
                setActiveAudioType("narration");
                await playAudio(currentChapter.audio);
                if (!active) return;
            }
            setIsInitialPlaying(false);
            setActiveAudioType("none");
        }

        startNarration();

        return () => {
            active = false;
        };
    }, [currentChapter, getChapterById]);

    // process pending actions or auto advance when initial narration finishes
    useEffect(() => {
        if (isInitialPlaying) return;

        if (pendingAction) {
            const action = pendingAction;
            setPendingAction(null);
            if (action.type === "next" && action.option) {
                transitionTo(action.option);
            } else if (action.type === "error") {
                handleTriggerError(action.failAudioUrl ?? null);
            }
        } else {
            if (
                currentChapter?.autoAdvance &&
                currentChapter.option &&
                currentChapter.option.length === 1
            ) {
                transitionTo(currentChapter.option[0]);
            }
        }
    }, [isInitialPlaying, pendingAction, currentChapter, transitionTo, handleTriggerError]);

    // load story structure
    useEffect(() => {
        if (!storyId) return;

        loadStoryData(storyId)
            .then((data) => {
                const loadedStory: Story = {
                    id: data.story.id,
                    name: data.story.name,
                    description: data.story.description,
                    image: bytesToUrl(data.story.thumbnail, "image/png"),
                    chapter: (data.story.chapter || []).map((ch) => ({
                        id: ch.id,
                        title: ch.title,
                        description: ch.description,
                        audio: getAudioUrl(ch.audio) ?? "",
                        image: bytesToUrl(ch.image, "image/png"),
                        failAudio: getAudioUrl(ch.failAudio),
                        autoAdvance: ch.autoAdvance ?? false,
                        option: (ch.option || []).map((opt) => ({
                            nextChapter: opt.nextChapter,
                            audio: getAudioUrl(opt.audio) ?? "",
                            item: opt.item,
                        })),
                    })),
                };

                setStory(loadedStory);
                const firstChapter = loadedStory.chapter[0];
                if (firstChapter) {
                    setCurrentChapter(firstChapter);
                }
            })
            .catch((err) => console.error("Failed to load story:", err));
    }, [storyId]);

    // fully clear media session and buffers on component unmount
    useEffect(() => {
        return () => {
            resetAudioPlayer();
        };
    }, []);

    return {
        story,
        currentChapter,
        currentChapterRef,
        nextChapter: handleSelectOption,
        triggerError: handleTriggerError,
        replayAudio: handleReplayAudio,
        cancelPendingAction,
    };
}
