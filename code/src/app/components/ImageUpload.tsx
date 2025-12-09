import { open } from '@tauri-apps/plugin-dialog';
import { BaseDirectory, copyFile } from '@tauri-apps/plugin-fs';
import { useState } from 'react';

export default function ImageUpload() {
    
    const file_selector = async () => {
        const selectedThumbnail = await open({
            multiple: true,
            extensions: ['png', 'jpeg']
        });
        if (!selectedThumbnail) return;
        await copyFile(selectedThumbnail.toString(), 'temp/thumbnail.png', {
            toPathBaseDir: BaseDirectory.Temp,
        })
    }

    return (
        <div>
            <button onClick={file_selector} type="button">+</button>
        </div>
    )
}