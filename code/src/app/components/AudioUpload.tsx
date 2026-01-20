import { open } from "@tauri-apps/plugin-dialog";
import { readFile } from "@tauri-apps/plugin-fs";
import { useEffect, useState } from "react";
import { Button } from "@components";

type AudioUploadProps = {
    onAudioBytes?: (bytes: Uint8Array<ArrayBuffer>) => void;
    cls?: string;
    value?: string | null; // This will now be a URL string (blob url)
};

export default function AudioUpload({
    onAudioBytes,
    cls = "",
    value = null,
}: AudioUploadProps) {
    const [audioSrc, setAudioSrc] = useState<string | null>(value);

    useEffect(() => {
        setAudioSrc(value);
    }, [value]);

    const file_selector = async () => {
        const selectedAudio = await open({
            multiple: false,
            extensions: ["mp3", "wav"],
        });
        if (!selectedAudio) return;

        const path = selectedAudio.toString();
        const bytes = await readFile(path);
        const blob = new Blob([bytes]);
        const url = URL.createObjectURL(blob);

        setAudioSrc(url);
        onAudioBytes?.(bytes);
    };

    return (
        <div className={`${cls} flex flex-col gap-2`}>
            {audioSrc && (
                <audio controls src={audioSrc} className="w-full h-10" />
            )}
            <Button
                onClick={file_selector}
                cls="text-sm !px-4 !py-2 w-full"
            >
                {audioSrc ? "Change Audio" : "Upload Audio"}
            </Button>
        </div>
    );
}
