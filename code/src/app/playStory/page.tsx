import { useParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import SettingsModal from "./SettingsModal";
import { storySettings } from "./Settings";
import { useStory } from "./useStory";
import { useFullscreen } from "./useFullscreen";
import StoryVisuals from "./components/StoryVisuals";
import StoryOverlay from "./components/StoryOverlay";
import StoryOptions from "./components/StoryOptions";
import StoryHeader from "./components/StoryHeader";
import { playAudio, stopAudio } from "./AudioPlayer";
import { StorySettings } from "@/types";

export default function PlayStory() {
    const { id } = useParams();
    const { story, currentChapter, nextChapter, currentChapterRef } =
        useStory(id);
    useFullscreen();

    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [settings, setSettings] = useState<StorySettings>(storySettings);

    const closeStory = useCallback(() => {
        stopAudio();
        window.history.back();
    }, []);

    // Keyboard handling
    useEffect(() => {
        function handleKeyPressed(e: KeyboardEvent) {
            if (showSettingsModal) return;

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
    }, [currentChapterRef, showSettingsModal, closeStory]);

    if (!currentChapter && !story) {
        return <p>Story not found</p>; // Can improve this state
    }

    return (
        <main className="bg-white min-h-screen">
            <StoryHeader
                fontSizeSetting={settings.fontSize}
                onSettingsClick={() => setShowSettingsModal(true)}
                onCloseClick={closeStory}
                onReplayAudioClick={() => {
                    if (!currentChapter?.audio) return;
                    playAudio(currentChapter.audio);
                }}
            />

            {currentChapter ? (
                <div className="relative h-screen w-screen">
                    <StoryVisuals image={currentChapter.image} />
                    <StoryOverlay
                        title={currentChapter.title}
                        description={currentChapter.description}
                        fontSizeSetting={settings.fontSize}
                        options={currentChapter.option}
                    />
                </div>
            ) : (
                <p>Loading...</p>
            )}

            <StoryOptions
                options={currentChapter?.option}
                onOptionClick={nextChapter}
                onErrorClick={() => {
                    if (!currentChapter?.failAudio) return;
                    playAudio(currentChapter.failAudio);
                }}
            />

            <SettingsModal
                isOpen={showSettingsModal}
                setIsOpen={setShowSettingsModal}
                onSettingsChange={setSettings}
            />
        </main>
    );
}
