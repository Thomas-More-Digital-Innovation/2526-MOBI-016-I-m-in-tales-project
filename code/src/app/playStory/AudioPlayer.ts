const globalAudio = new Audio();

export function playAudio(source: string): Promise<void> {
    return new Promise((resolve, reject) => {
        // 1. Set the source
        const src = source.startsWith("/") ? source : `/${source}`;
        globalAudio.src = src;

        // 2. Define what happens when it finishes
        const handleEnded = () => {
            globalAudio.removeEventListener("ended", handleEnded);
            globalAudio.removeEventListener("error", handleError);
            resolve();
        };

        // 3. Define what happens if it fails (e.g., file not found)
        const handleError = (e: Event) => {
            globalAudio.removeEventListener("ended", handleEnded);
            globalAudio.removeEventListener("error", handleError);
            reject(new Error("Audio playback failed"));
        };

        globalAudio.addEventListener("ended", handleEnded);
        globalAudio.addEventListener("error", handleError);

        // 4. Start playing
        globalAudio.load();
        globalAudio.play().catch(handleError);
    });
}
