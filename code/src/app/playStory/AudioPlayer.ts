import { Chapter, Option } from "@/types/story.type";
import { storySettings } from "./Settings";

let audioRecord: Record<string, HTMLAudioElement> = {};
let activeAudio: HTMLAudioElement | null = null;

export function playAudio(audioPath: string): Promise<void> {
    return new Promise((resolve) => {
        const audio = audioRecord[audioPath];
        if (!audio) {
            console.warn(`Audio ${audioPath} not found in preload record`);
            resolve();
            return;
        }
        stopAudio();
        activeAudio = audio;

        const onCleanUp = () => {
            audio.removeEventListener("ended", handleEnded);
            audio.removeEventListener("error", handleError);
            activeAudio = null;
            resolve();
        };

        const handleEnded = () => {
            onCleanUp();
        };

        const handleError = () => {
            console.error("Audio playback failed");
            onCleanUp();
        };

        audio.addEventListener("ended", handleEnded);
        audio.addEventListener("error", handleError);

        audio.volume = storySettings.volume;
        audio.play().catch(handleError);
    });
}

export function stopAudio() {
    if (activeAudio) {
        activeAudio.pause();
        activeAudio.currentTime = 0;
    }
}

export function loadAudio(audioPath: string): HTMLAudioElement {
    const src = audioPath.startsWith("/") ? audioPath : `/${audioPath}`;
    const audio = new Audio(src);
    audio.load();
    return audio;
}

export function preloadChapterAudio(chapter: Chapter) {
    audioRecord = {};
    chapter.option.forEach((option: Option) => {
        if (option.audio) {
            audioRecord[option.audio] = loadAudio(option.audio);
        }
    });
    if (chapter.audio) {
        audioRecord[chapter.audio] = loadAudio(chapter.audio);
    }
    if (chapter.failAudio) {
        audioRecord[chapter.failAudio] = loadAudio(chapter.failAudio);
    }
}
