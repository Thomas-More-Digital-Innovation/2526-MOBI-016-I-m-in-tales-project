import { useState, useEffect, useRef, useCallback } from "react";
import { Story, StoriesData, Chapter, Option } from "../../types/story.type";
import { playAudio } from "./AudioPlayer";

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
            return story?.chapter.find((chapter) => chapter.id === chapterId);
        },
        [story]
    );

    const nextChapter = useCallback(
        async (option: Option) => {
            if (option.audio) {
                console.log(option.audio);
                await playAudio(option.audio);
            }
            const chapter = getChapterById(option.nextChapter);
            setCurrentChapter(chapter);
            currentChapterRef.current = chapter;

            if (chapter?.audio) {
                console.log(chapter.audio);
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
                    (data.story || []).find((s) => s.id === storyId) || null;
                setStory(found);
                const chapter = found?.chapter[0];
                setCurrentChapter(chapter);
                currentChapterRef.current = chapter;
            })
            .catch((err) => console.error(err));
    }, [storyId]);

    return {
        story,
        currentChapter,
        currentChapterRef,
        nextChapter,
    };
}
