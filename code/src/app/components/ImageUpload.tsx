import { open } from "@tauri-apps/plugin-dialog";
import { readFile } from "@tauri-apps/plugin-fs";
import { useEffect, useState, useRef } from "react";
import { useI18nContext } from "@/i18n/i18n-react";

type ImageUploadProps = {
    onImageBytes?: (bytes: Uint8Array<ArrayBuffer>) => void;
    cls?: string;
    value?: string | null;
};

export default function ImageUpload({
    onImageBytes,
    cls = "",
    value = null,
}: ImageUploadProps) {
    const [thumbnail, setThumbnail] = useState<string | null>(value);
    const [isDragging, setIsDragging] = useState(false);
    const createdUrlRef = useRef<string | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const onImageBytesRef = useRef(onImageBytes);
    const { LL } = useI18nContext();

    useEffect(() => {
        onImageBytesRef.current = onImageBytes;
    }, [onImageBytes]);

    useEffect(() => {
        setThumbnail(value);
    }, [value]);

    useEffect(() => {
        return () => {
            if (createdUrlRef.current) {
                URL.revokeObjectURL(createdUrlRef.current);
            }
        };
    }, []);

    const applyBytes = (bytes: Uint8Array<ArrayBuffer>, previewUrl: string) => {
        if (createdUrlRef.current) {
            URL.revokeObjectURL(createdUrlRef.current);
        }
        createdUrlRef.current = previewUrl;
        setThumbnail(previewUrl);
        onImageBytesRef.current?.(bytes);
    };

    // Registered once on mount — dep on onImageBytes would re-register on every render
    useEffect(() => {
        let cleanup: (() => void) | null = null;

        const register = async () => {
            try {
                const { getCurrentWebview } = await import("@tauri-apps/api/webview");
                const unlisten = await getCurrentWebview().onDragDropEvent((event) => {
                    if (!containerRef.current) return;

                    if (event.payload.type === "leave") {
                        setIsDragging((p) => (p ? false : p));
                        return;
                    }

                    const rect = containerRef.current.getBoundingClientRect();
                    const { x, y } = event.payload.position;
                    const isInside = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;

                    if (event.payload.type === "over") {
                        setIsDragging((p) => (p !== isInside ? isInside : p));
                    } else if (event.payload.type === "drop") {
                        setIsDragging(false);
                        if (!isInside || !event.payload.paths.length) return;

                        const filePath = event.payload.paths[0];
                        const lower = filePath.toLowerCase();
                        if (!lower.endsWith(".png") && !lower.endsWith(".jpeg") && !lower.endsWith(".jpg")) return;

                        readFile(filePath)
                            .then((bytes) => {
                                const url = URL.createObjectURL(new Blob([bytes]));
                                applyBytes(bytes, url);
                            })
                            .catch((err) => console.error("Failed to read dropped file:", err));
                    }
                });
                cleanup = unlisten;
            } catch (err) {
                console.error("Failed to register Tauri drag-drop handler:", err);
            }
        };

        register();
        return () => { cleanup?.(); };
    }, []);

    const fileSelector = async () => {
        const selected = await open({ multiple: false, extensions: ["png", "jpeg"] });
        if (!selected) return;
        const bytes = await readFile(selected.toString());
        const url = URL.createObjectURL(new Blob([bytes]));
        applyBytes(bytes, url);
    };

    // Fallback HTML5 handlers for non-Tauri environments
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging((p) => (!p ? true : p));
    };

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (!file?.type.startsWith("image/")) return;
        const bytes = new Uint8Array(await file.arrayBuffer());
        const url = URL.createObjectURL(file);
        applyBytes(bytes, url);
    };

    return (
        <div
            ref={containerRef}
            onDragOver={handleDragOver}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`${cls} relative flex justify-center items-center w-full h-full rounded-2xl border-3 overflow-hidden transition-all duration-300 ${
                isDragging
                    ? "border-talesorang-400 bg-talesorang-50/15 scale-[1.02] shadow-lg shadow-talesorang-100"
                    : "border-foreground/20 bg-foreground/10 hover:border-foreground/30"
            }`}>
            {thumbnail ? (
                <img
                    src={thumbnail}
                    className={`object-cover w-full h-full transition-transform duration-500 ${isDragging ? "scale-95 opacity-80" : ""}`}
                    alt="preview"
                />
            ) : (
                <div className={`text-xs font-medium uppercase tracking-wider transition-colors ${isDragging ? "text-talesorang-500" : "text-gray-400"}`}>
                    {isDragging ? "Drop here!" : LL.IMAGE_NO_IMAGE()}
                </div>
            )}

            {isDragging && (
                <div className="absolute inset-0 flex items-center justify-center bg-talesorang-500/10 pointer-events-none animate-pulse">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-talesorang-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                </div>
            )}

            <button
                className={`absolute text-2xl font-bold bg-white/90 backdrop-blur-sm w-10 h-10 flex items-center justify-center rounded-full hover:cursor-pointer hover:scale-110 active:scale-95 duration-200 ease-in-out hover:shadow-lg border text-talesorang-500 border-talesorang-200 ${
                    isDragging ? "opacity-0 pointer-events-none" : "opacity-100"
                }`}
                type="button"
                onClick={fileSelector}>
                +
            </button>
        </div>
    );
}
