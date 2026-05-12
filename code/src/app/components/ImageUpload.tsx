import { open } from "@tauri-apps/plugin-dialog";
import { readFile } from "@tauri-apps/plugin-fs";
import { useEffect, useState, useRef } from "react";

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
    const createdUrlRef = useRef<string | null>(null);

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

    const fileSelector = async () => {
        const selectedThumbnail = await open({
            multiple: false,
            extensions: ["png", "jpeg"],
        });
        if (!selectedThumbnail) return;

        const bytes = await readFile(selectedThumbnail.toString());
        const blob = new Blob([bytes]);
        const url = URL.createObjectURL(blob);

        if (createdUrlRef.current) {
            URL.revokeObjectURL(createdUrlRef.current);
        }
        createdUrlRef.current = url;

        setThumbnail(url);
        onImageBytes?.(bytes);
    };

    return (
        <div
            className={`${cls} relative flex justify-center items-center w-full h-full bg-foreground/10 rounded-2xl border-3 border-foreground/20 overflow-hidden`}>
            {thumbnail ? (
                <img
                    src={thumbnail}
                    className="object-cover w-full h-full"
                    alt="preview"
                />
            ) : (
                <div className="text-gray-400 text-xs font-medium uppercase tracking-wider">No Image</div>
            )}
            <button
                className="absolute text-2xl font-bold bg-white/80 backdrop-blur-sm w-10 h-10 flex items-center justify-center rounded-full hover:cursor-pointer hover:scale-110 duration-200 ease-in-out hover:shadow-lg text-talesorang-500 border border-talesorang-200"
                type="button"
                onClick={fileSelector}>
                +
            </button>
        </div>
    );
}
