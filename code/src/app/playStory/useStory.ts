import { useState, useEffect, useRef, useCallback } from "react";
import { Story, StoriesData, Chapter, Option } from "@/types";
import { playAudio, preloadChapterAudio } from "./AudioPlayer";

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

        fetch("/stories.json")
            .then((res) => res.json())
            .then((data: StoriesData) => {
                const found =
                    (data.story || []).find((s: Story) => s.id === storyId) ||
                    null;
                setStory(found);
                const chapter = found?.chapter[0];
                loadChapter(chapter);
            })
            .catch((err) => console.error(err));
    }, [storyId]);

    return {
        story,
        currentChapter,
        currentChapterRef,
        nextChapter,
    };

    function loadChapter(chapter: Chapter | undefined) {
        if (!chapter) {
            console.error("Chapter not found");
            return;
        }
        setCurrentChapter(chapter);
        preloadChapterAudio(chapter);
        currentChapterRef.current = chapter;
    }
}
