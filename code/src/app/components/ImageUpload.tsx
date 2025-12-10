import { open } from '@tauri-apps/plugin-dialog';
import { join, appDataDir } from '@tauri-apps/api/path';
import { BaseDirectory, copyFile, readFile } from '@tauri-apps/plugin-fs';
import { useState } from 'react';
import { convertFileSrc } from '@tauri-apps/api/core';

export default function ImageUpload() {
    
    const [thumbnail, setThumbnail] = useState<string | null>(null);

    const file_selector = async () => {
        const selectedThumbnail = await open({
            multiple: true,
            extensions: ['png', 'jpeg']
        });
        if (!selectedThumbnail) return;
        const destPathTemp = await join('temp', 'storyThumbnail.png');
        await copyFile(selectedThumbnail.toString(), destPathTemp, {
            toPathBaseDir: BaseDirectory.AppData,
        })
        const bytes = await readFile(destPathTemp, {
            baseDir: BaseDirectory.AppData
        });
        const blob = new Blob([bytes])
        const url = URL.createObjectURL(blob);
        setThumbnail(url);
    }

    return (
        <div className='flex justify-center items-center w-[10vw] h-[10vw] bg-foreground/10 rounded-2xl border-3 border-foreground/20'>
            {thumbnail
                ? (<img src={thumbnail} className='object-cover rounded-2xl w-full h-full' alt="no image found" />)
                : ("")
            }
            <button className='absolute text-2xl font-bold bg-white px-2 rounded-full hover:cursor-pointer hover:scale-125 duration-200 ease-in-out hover:shadow' type="button" onClick={file_selector}>+</button>
        </div>
    )
}