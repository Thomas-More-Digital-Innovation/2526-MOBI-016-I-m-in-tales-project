import { Button, Header } from "@components";
import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Story, StoriesData, Chapter, Option } from "../../types/story.type";
import Modal from "../components/Modal";
import SettingsModal from "./SettingsModal";
import { getFontSize, storySettings } from "./Settings";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { playAudio } from "./AudioPlayer";

export default function PlayStory() {
    const { id } = useParams();
    const [story, setStory] = useState<Story | null>(null);
    const wasFullscreen = useRef(false); // if the user was already using fullscreen before opening the story
    const [currentChapter, setCurrentChapter] = useState<Chapter | undefined>(
        undefined
    );
    const currentChapterRef = useRef<Chapter | undefined>(undefined);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [settings, setSettings] = useState<StorySettings>(storySettings);

    async function nextChapter(option: Option) {
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
    }

    function handleKeyPressed(e: KeyboardEvent) {
        console.log(e.key);
        console.log(currentChapterRef.current?.option.length);

        if (
            e.key === "Escape" ||
            currentChapterRef.current?.option.length === 0
        ) {
            e.preventDefault();
            e.stopPropagation();
            closeStory();
        }
    }

    function closeStory() {
        if (!wasFullscreen.current) {
            const win = getCurrentWindow();
            win.setFullscreen(false);
        }
        window.history.back();
    }

    function getChapterById(id: string | undefined): Chapter | undefined {
        return story?.chapter.find((chapter) => chapter.id === id);
    }

    useEffect(() => {
        if (!id) return;

        const win = getCurrentWindow();
        win.isFullscreen().then((isFullscreen) => {
            wasFullscreen.current = Boolean(isFullscreen);
            if (!isFullscreen) {
                win.setFullscreen(true);
            }
        });
        window.addEventListener("keydown", handleKeyPressed);

        fetch("/stories.json")
            .then((res) => res.json())
            .then((data: StoriesData) => {
                const found =
                    (data.story || []).find((s) => s.id === id) || null;
                setStory(found);
                const chapter = found?.chapter[0];
                setCurrentChapter(chapter);
                currentChapterRef.current = chapter;
            })
            .catch((err) => console.error(err));

        return () => {
            window.removeEventListener("keydown", handleKeyPressed);
        };
    }, [id]);

    useEffect(() => {
        currentChapterRef.current = currentChapter;
    }, [currentChapter]);

    return (
        <main className="bg-white min-h-screen">
            <Button
                onClick={() => {
                    setShowSettingsModal(true);
                }}
                cls="absolute top-3 left-2 z-100">
                Instellingen
            </Button>
            <Button onClick={closeStory} cls="absolute top-3 right-2 z-100">
                X
            </Button>

            {currentChapter ? (
                <div className="relative">
                    <img
                        src={currentChapter!.image}
                        className="w-screen h-screen object-cover"
                        alt=""
                    />
                    <h1
                        className="absolute top-0 left-0 text-center py-4 w-screen text-white bg-black/50"
                        style={{
                            fontSize: getFontSize(settings.fontSize) * 2 + "px",
                        }}>
                        {currentChapter!.title}
                    </h1>
                    <p
                        className="absolute bottom-0 left-0 text-center py-4 w-screen text-white bg-black/50"
                        style={{
                            fontSize: getFontSize(settings.fontSize) + "px",
                        }}>
                        {currentChapter!.description}
                    </p>
                </div>
            ) : (
                <p>Story not found</p>
            )}

            {/* temp for testing, change for "verhaal speler interface" */}
            <div className="absolute flex flex-col bottom-4 right-4 z-100">
                {currentChapter?.option.map((option) => (
                    <Button
                        key={option.nextChapter}
                        onClick={() => nextChapter(option)}
                        cls="m-2">
                        {option.item ?? "null"}
                        <br />
                        {option.audio ?? "null"}
                    </Button>
                ))}
            </div>

            {currentChapter?.option.length === 0 && (
                <div className="absolute bottom-4 left-4 z-100 max-w-1/4 text-white bg-talesorang-500 p-4 rounded-lg">
                    Dit is het einde van het verhaal. Druk op een toets om het
                    verhaal af te sluiten.
                </div>
            )}

            <SettingsModal
                isOpen={showSettingsModal}
                setIsOpen={setShowSettingsModal}
            />
        </main>
    );
}
