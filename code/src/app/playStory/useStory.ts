import { useState, useEffect, useRef, useCallback } from "react";
import { Story, StoriesData, Chapter, Option } from "@/types";
import { playAudio, preloadChapterAudio } from "./AudioPlayer";
import { loadStoryData, bytesToUrl } from "@/utils/storyIO";

export function useStory(storyId: string | undefined) {
    const [story, setStory] = useState<Story | null>(null);
    const [currentChapter, setCurrentChapter] = useState<Chapter | undefined>(
        undefined
    );
    const currentChapterRef = useRef<Chapter | undefined>(undefined);

    // Keep ref in sync
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

    function loadChapter(chapter: Chapter | undefined) {
        if (!chapter) {
            console.error("Chapter not found");
            return;
        }
        setCurrentChapter(chapter);
        preloadChapterAudio(chapter);
        currentChapterRef.current = chapter;
    }

    const nextChapter = useCallback(
        async (option: Option) => {
            if (option.audio) {
                await playAudio(option.audio);
            }
            const chapter = getChapterById(option.nextChapter);
            loadChapter(chapter);
            if (chapter?.audio) {
                await playAudio(chapter.audio);
            }
        },
        [getChapterById]
    );

    useEffect(() => {
        if (!storyId) return;

        loadStoryData(storyId)
            .then((data) => {
                const loadedStory: Story = {
                    id: data.story.id,
                    name: data.story.name,
                    description: data.story.description,
                    image: bytesToUrl(data.story.thumbnail),
                    chapter: (data.story.chapter || []).map((ch) => ({
                        id: ch.id,
                        title: ch.title,
                        description: ch.description,
                        audio: bytesToUrl(ch.audio),
                        image: bytesToUrl(ch.image),
                        failAudio: bytesToUrl(ch.failAudio),
                        option: (ch.option || []).map((opt) => ({
                            nextChapter: opt.nextChapter,
                            audio: bytesToUrl(opt.audio),
                            item: opt.item,
                        })),
                    })),
                };

                setStory(loadedStory);
                const chapter = loadedStory.chapter[0];
                loadChapter(chapter);
            })
            .catch((err) => console.error("Failed to load story:", err));
    }, [storyId]);

    return {
        story,
        currentChapter,
        currentChapterRef,
        nextChapter,
    };
}
