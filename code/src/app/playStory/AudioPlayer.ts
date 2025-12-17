const globalAudio = new Audio();

export function playAudio(source: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const src = source.startsWith("/") ? source : `/${source}`;
        globalAudio.src = src;

        const handleEnded = () => {
            globalAudio.removeEventListener("ended", handleEnded);
            globalAudio.removeEventListener("error", handleError);
            resolve();
        };

        const handleError = (e: Event) => {
            globalAudio.removeEventListener("ended", handleEnded);
            globalAudio.removeEventListener("error", handleError);
            reject(new Error("Audio playback failed"));
        };

        globalAudio.addEventListener("ended", handleEnded);
        globalAudio.addEventListener("error", handleError);

        globalAudio.load();
        globalAudio.play().catch(handleError);
    });
}
