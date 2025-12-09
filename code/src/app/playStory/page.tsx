import { Button, Header } from "@components";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Story, StoriesData, Chapter, Option } from "../../types/story.type";
import Modal from "../components/Modal";
import SettingsModal from "./SettingsModal";
import { getFontSize, storySettings } from "./Settings";
import { getCurrentWindow } from "@tauri-apps/api/window";

export default function PlayStory() {
    const { id } = useParams();
    const [story, setStory] = useState<Story | null>(null);
    const [wasFullscreen, setWasFullscreen] = useState(false); // if the user was already using fullscreen before opening the story
    const [currentChapter, setCurrentChapter] = useState<Chapter | undefined>(
        undefined
    );
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [settings, setSettings] = useState<StorySettings>(storySettings);

    function nextChapter(option: Option) {
        setCurrentChapter(getChapterById(option.nextChapter));
    }

    function closeStory() {
        if (!wasFullscreen) {
            const win = getCurrentWindow();
            win.setFullscreen(false);
        }
        window.history.back();
    }

    function getChapterById(id: string | undefined): Chapter | undefined {
        return story?.chapter.find((chapter) => chapter.id === id);
    }

    useEffect(() => {
        const win = getCurrentWindow();
        win.isFullscreen().then((isFullscreen) => {
            setWasFullscreen(isFullscreen);
            if (!isFullscreen) {
                win.setFullscreen(true);
            }
        });
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

            <SettingsModal
                isOpen={showSettingsModal}
                setIsOpen={setShowSettingsModal}
            />
        </main>
    );
}
