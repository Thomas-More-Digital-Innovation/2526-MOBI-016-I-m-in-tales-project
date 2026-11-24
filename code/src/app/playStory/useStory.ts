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
    return url === "/placeholder.jpeg" ? null : url;
};

export function useStory(storyId: string | undefined, autoPlayObjectSounds = false) {
    const [story, setStory] = useState<Story | null>(null);
    const [currentChapter, setCurrentChapter] = useState<Chapter | undefined>(undefined);
    const currentChapterRef = useRef<Chapter | undefined>(undefined);

    const [isInitialPlaying, setIsInitialPlaying] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const isTransitioningRef = useRef(false);
    const [activeAudioType, setActiveAudioType] = useState<AudioType>("none");
    const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
    /** Index of the object cell whose sound is playing (highlighted in the player). */
    const [activeObject, setActiveObject] = useState<number | null>(null);
    // Ref so toggling the setting mid-chapter doesn't restart the narration effect
    const autoPlayObjectSoundsRef = useRef(autoPlayObjectSounds);
    autoPlayObjectSoundsRef.current = autoPlayObjectSounds;

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
            if (isTransitioningRef.current) return;
            isTransitioningRef.current = true;
            setIsTransitioning(true);

            try {
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
            } finally {
                isTransitioningRef.current = false;
                setIsTransitioning(false);
            }
        },
        [getChapterById]
    );

    const handleSelectOption = useCallback(
        async (option: Option) => {
            if (isTransitioningRef.current) return;
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
            if (isTransitioningRef.current) return;
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
        if (isTransitioningRef.current || !currentChapter?.audio) return;
        stopAudio();
        setIsInitialPlaying(false);
        setActiveAudioType("narration");
        await playAudio(currentChapter.audio);
        setActiveAudioType("none");
    }, [currentChapter]);

    /** Hover on an object cell. Ignored while narration or a transition plays, so it never cuts the story audio. */
    const playObjectSound = useCallback(
        async (idx: number) => {
            const sound = currentChapter?.option[idx]?.objectSound;
            if (!sound || isInitialPlaying || isTransitioningRef.current) return;
            setActiveObject(idx);
            await playAudio(sound);
            // Another cell may have taken over meanwhile; only clear our own highlight
            setActiveObject((cur) => (cur === idx ? null : cur));
        },
        [currentChapter, isInitialPlaying]
    );

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
            if (opt.objectSound) pathsToPreload.push(opt.objectSound);
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
            setIsInitialPlaying(true);
            setActiveAudioType("narration");

            if (currentChapter.audio) {
                await playAudio(currentChapter.audio);
                if (!active) return;
            } else if (currentChapter.autoAdvance) {
                await new Promise((resolve) => setTimeout(resolve, 500));
                if (!active) return;
            }

            // Tags placed meanwhile stay queued: isInitialPlaying is still true here
            if (autoPlayObjectSoundsRef.current && !currentChapter.autoAdvance) {
                for (const [idx, opt] of currentChapter.option.entries()) {
                    if (!opt.objectSound) continue;
                    setActiveObject(idx);
                    await playAudio(opt.objectSound);
                    if (!active) return;
                }
                setActiveObject(null);
            }

            setIsInitialPlaying(false);
            setActiveAudioType("none");

            if (
                currentChapter.autoAdvance &&
                currentChapter.option &&
                currentChapter.option.length === 1
            ) {
                transitionTo(currentChapter.option[0]);
            }
        }

        startNarration();

        return () => {
            active = false;
            setActiveObject(null);
        };
    }, [currentChapter, getChapterById, transitionTo]);

    // process pending actions queued by user during narration
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
        }
    }, [isInitialPlaying, pendingAction, transitionTo, handleTriggerError]);

    // load story structure
    useEffect(() => {
        if (!storyId) return;

        loadStoryData(storyId)
            .then((data) => {
                const loadedStory: Story = {
                    id: data.story.id,
                    name: data.story.name,
                    description: data.story.description,
                    image: bytesToUrl(data.story.thumbnail, "image/jpeg"),
                    chapter: (data.story.chapter || []).map((ch) => ({
                        id: ch.id,
                        title: ch.title,
                        description: ch.description,
                        audio: getAudioUrl(ch.audio) ?? "",
                        image: bytesToUrl(ch.image, "image/jpeg"),
                        text: ch.text,
                        failAudio: getAudioUrl(ch.failAudio),
                        autoAdvance: ch.autoAdvance ?? false,
                        option: (ch.option || []).map((opt) => {
                            const itemData = data.items?.find((i) => i.itemId === opt.item);
                            return {
                                nextChapter: opt.nextChapter,
                                audio: getAudioUrl(opt.audio) ?? "",
                                objectImage: opt.objectImage && opt.objectImage.length > 0 ? bytesToUrl(opt.objectImage, "image/jpeg") : undefined,
                                objectSound: getAudioUrl(opt.objectSound),
                                item: opt.item,
                                itemLabel: itemData?.label || opt.item || undefined,
                            };
                        }),
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
        isTransitioning,
        activeObject,
        playObjectSound,
        nextChapter: handleSelectOption,
        triggerError: handleTriggerError,
        replayAudio: handleReplayAudio,
        cancelPendingAction,
    };
}
