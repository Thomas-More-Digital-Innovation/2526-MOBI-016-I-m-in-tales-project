import { Header } from "@components";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Story, StoriesData, Chapter } from "../../types/story.type";
import Button from "../components/Button";

export default function PlayStory() {
    const { id } = useParams();
    const [story, setStory] = useState<Story | null>(null);
    const [currentChapter, setCurrentChapter] = useState<Chapter | undefined>(
        undefined
    );

    function getChapterById(id: string | undefined): Chapter | undefined {
        return story?.chapter.find((chapter) => chapter.id === id);
    }

    useEffect(() => {
        if (!id) return;
        fetch("/stories.json")
            .then((res) => res.json())
            .then((data: StoriesData) => {
                const found =
                    (data.story || []).find((s) => s.id === id) || null;
                setStory(found);
                setCurrentChapter(found?.chapter[0]);
            })
            .catch((err) => console.error(err));
    }, [id]);

    return (
        <main className="bg-white min-h-screen">
            <Button
                onClick={() => window.history.back()}
                cls="absolute top-3 right-2 z-100">
                X
            </Button>

            {currentChapter ? (
                <div className="relative">
                    <img
                        src={currentChapter!.image}
                        className="w-screen h-screen object-cover"
                        alt=""
                    />
                    <h1 className="absolute top-0 left-0 text-center py-4 w-screen text-3xl text-white bg-black/50">{currentChapter!.title}</h1>
                    <p className="absolute bottom-0 left-0 text-center py-4 w-screen text-white bg-black/50">{currentChapter!.description}</p>
                    {/* {story.chapter.map((chapter) => (
                            <div key={chapter.id}>
                                <h2 className="text-2xl font-bold mb-2">
                                    {chapter.title}
                                </h2>
                                <p>{chapter.description}</p>
                            </div>
                        ))} */}
                </div>
            ) : (
                <p>Story not found</p>
            )}
        </main>
    );
}
