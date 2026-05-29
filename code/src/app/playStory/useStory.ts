import { useState, useEffect, useRef, useCallback } from "react";
import { Story, StoriesData, Chapter, Option } from "@/types";
import { playAudio, preloadChapterAudio, stopAudio } from "./AudioPlayer";
import { loadStoryData, bytesToUrl } from "@/utils/storyIO";

const getAudioUrl = (bytes: Uint8Array | number[] | null | undefined): string | null => {
    if (!bytes) return null;
    const length = bytes instanceof Uint8Array ? bytes.length : (Array.isArray(bytes) ? bytes.length : 0);
    if (length === 0) return null;
    const url = bytesToUrl(bytes, "audio/mpeg");
    return url === "/placeholder.png" ? null : url;
};

export function useStory(storyId: string | undefined) {
    const [story, setStory] = useState<Story | null>(null);
    const [currentChapter, setCurrentChapter] = useState<Chapter | undefined>(
        undefined
    );
    const currentChapterRef = useRef<Chapter | undefined>(undefined);

    // keep ref in sync
    useEffect(() => {
        currentChapterRef.current = currentChapter;
    }, [currentChapter]);

    const getChapterById = useCallback(
        (chapterId: string | undefined): Chapter | undefined => {
            return story?.chapter.find(
                (chapter: Chapter) => chapter.id === chapterId
            );
        },
        [story]
    );

    const loadChapter = useCallback((chapter: Chapter | undefined) => {
        if (!chapter) {
            console.error("Chapter not found");
            return;
        }
        setCurrentChapter(chapter);
        preloadChapterAudio(chapter);
        currentChapterRef.current = chapter;
    }, []);

    const nextChapter = useCallback(
        async (option: Option) => {
            if (option.audio) {
                await playAudio(option.audio);
            }
            const chapter = getChapterById(option.nextChapter);
            loadChapter(chapter);
            if (chapter?.audio) {
                await playAudio(chapter.audio);
                if (chapter.autoAdvance && chapter.option && chapter.option.length === 1) {
                    nextChapter(chapter.option[0]);
                }
            }
        },
        [getChapterById, loadChapter]
    );

    const nextChapterRef = useRef<typeof nextChapter | null>(null);
    useEffect(() => {
        nextChapterRef.current = nextChapter;
    }, [nextChapter]);

    // load story once and play initial chapter audio
    useEffect(() => {
        if (!storyId) return;

        loadStoryData(storyId)
            .then(async (data) => {
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
                const chapter = loadedStory.chapter[0];
                loadChapter(chapter);

                if (chapter?.audio) {
                    await playAudio(chapter.audio);
                    if (chapter.autoAdvance && chapter.option && chapter.option.length === 1) {
                        nextChapterRef.current?.(chapter.option[0]);
                    }
                }
            })
            .catch((err) => console.error("Failed to load story:", err));
    }, [storyId, loadChapter]);

    // stop audio on unmount to prevent lingering playback
    useEffect(() => {
        return () => {
            stopAudio();
        };
    }, []);

    return {
        story,
        currentChapter,
        currentChapterRef,
        nextChapter,
    };
}
