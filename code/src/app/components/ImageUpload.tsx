import { open } from "@tauri-apps/plugin-dialog";
import { readFile } from "@tauri-apps/plugin-fs";
import { useEffect, useState } from "react";

type ImageUploadProps = {
  onImageBytes?: (bytes: Uint8Array<ArrayBuffer>) => void;
  cls?: string;
  value?: string | null;
};

export default function ImageUpload({ onImageBytes, cls = "", value = null }: ImageUploadProps) {
  const [thumbnail, setThumbnail] = useState<string | null>(value);

  useEffect(() => {
    setThumbnail(value);
  }, [value]);

  const file_selector = async () => {
    const selectedThumbnail = await open({
      multiple: false,
      extensions: ["png", "jpeg"],
    });
    if (!selectedThumbnail) return;

    const bytes = await readFile(selectedThumbnail.toString());
    const blob = new Blob([bytes]);
    const url = URL.createObjectURL(blob);

    setThumbnail(url);
    onImageBytes?.(bytes);
  };

  return (
    <div className={`${cls} flex justify-center items-center w-[10vw] h-[10vw] bg-foreground/10 rounded-2xl border-3 border-foreground/20`}>
      {thumbnail ? (
        <img src={thumbnail} className="object-cover rounded-2xl w-full h-full" alt="no image found"/>
      ) : (
        ""
      )}
      <button className="absolute text-2xl font-bold bg-white px-2 rounded-full hover:cursor-pointer hover:scale-125 duration-200 ease-in-out hover:shadow" type="button" onClick={file_selector}>
        +
      </button>
    </div>
  );
}
