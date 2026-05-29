import { Chapter, Option } from "@/types/story.type";
import { storySettings } from "./Settings";

let audioRecord: Record<string, HTMLAudioElement> = {};
let activeAudio: HTMLAudioElement | null = null;
let activeAudioCleanup: (() => void) | null = null;

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

        const handleEnded = () => cleanup();
        const handleError = (e: any) => {
            console.error("Audio playback failed", e);
            cleanup();
        };

        const cleanup = () => {
            audio.removeEventListener("ended", handleEnded);
            audio.removeEventListener("error", handleError);
            if (activeAudio === audio) {
                activeAudio = null;
                activeAudioCleanup = null;
            }
            resolve();
        };

        activeAudioCleanup = cleanup;
        audio.addEventListener("ended", handleEnded);
        audio.addEventListener("error", handleError);

        audio.volume = storySettings.volume;
        audio.play().catch((err) => {
            console.error("Playback start failed", err);
            cleanup();
        });
    });
}

export function stopAudio() {
    if (activeAudio) {
        activeAudio.pause();
        activeAudio.currentTime = 0;
    }
    if (activeAudioCleanup) {
        activeAudioCleanup();
    }
}

export function resetAudioPlayer() {
    stopAudio();
    for (const path in audioRecord) {
        audioRecord[path].pause();
        audioRecord[path].src = "";
        audioRecord[path].load();
    }
    audioRecord = {};
}

export function loadAudio(audioPath: string): HTMLAudioElement {
    const isFullUrl =
        audioPath.startsWith("blob:") ||
        audioPath.startsWith("data:") ||
        audioPath.startsWith("http:") ||
        audioPath.startsWith("https:");
    const src = isFullUrl ? audioPath : (audioPath.startsWith("/") ? audioPath : `/${audioPath}`);

    const audio = new Audio(src);
    audio.load();
    return audio;
}

export function preloadAudios(audioPaths: string[]) {
    const newRecord: Record<string, HTMLAudioElement> = {};
    audioPaths.forEach((path) => {
        if (!path) return;
        if (audioRecord[path]) {
            newRecord[path] = audioRecord[path];
        } else {
            newRecord[path] = loadAudio(path);
        }
    });

    for (const path in audioRecord) {
        if (!newRecord[path]) {
            audioRecord[path].pause();
            audioRecord[path].src = "";
        }
    }
    audioRecord = newRecord;
}

export function preloadChapterAudio(chapter: Chapter) {
    const paths: string[] = [];
    chapter.option.forEach((option: Option) => {
        if (option.audio) paths.push(option.audio);
    });
    if (chapter.audio) paths.push(chapter.audio);
    if (chapter.failAudio) paths.push(chapter.failAudio);
    preloadAudios(paths);
}
