import { InputLabel, TextAreaLabel, ImageUpload } from "@components";
import { useState } from "react";
import { writeTextFile, BaseDirectory, exists, mkdir, copyFile, remove } from "@tauri-apps/plugin-fs";
import { join } from "@tauri-apps/api/path";
import { useNavigate } from "react-router-dom";

export default function StoryForm() {
    const navigate = useNavigate();
    const [storyId] = useState(() => crypto.randomUUID());

    const ensureStoryFolder = async (folderName: string) => {
        const storyFolderExists = await exists(folderName, { 
            baseDir: BaseDirectory.AppData
        });
        if (!storyFolderExists) {
            await mkdir(folderName, {
                baseDir: BaseDirectory.AppData,
                recursive: true
            });
        }
    };

    const saveStory = async (jsonData: unknown, folderName: string) => {
        await ensureStoryFolder(folderName);

        const storyFilePath = await join(folderName, "StoryData.json");
        await writeTextFile(storyFilePath, JSON.stringify(jsonData, null, 2), {
            baseDir: BaseDirectory.AppData
        });
        const tempImagePath = await join("temp", "storyThumbnail.png");
        const imageExists = await exists(tempImagePath, {
            baseDir: BaseDirectory.AppData,
        });
        const destImagePath = await join(folderName, "storyThumbnail.png");
        if (imageExists) {
            await copyFile(tempImagePath, destImagePath, {
                fromPathBaseDir: BaseDirectory.AppData,
                toPathBaseDir: BaseDirectory.AppData
            });
        }
        await remove("temp", {
            baseDir: BaseDirectory.AppData,
            recursive: true
        });
        navigate("/makeStory/storyConfigurator/" + folderName);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const storyName = formData.get("StoryName")?.toString().trim() || "story";
        const description = formData.get("Description")?.toString().trim() || "";

        const JsonData = {
            story: [
                {
                    id: storyId,
                    name: storyName,
                    description
                }
            ]
        };

        await saveStory(JsonData, storyName);
    };

    return(
        <form onSubmit={handleSubmit} className="flex">
            <div className="min-h-full p-4">
                <div>
                    <InputLabel label="Story Name" required={true} nameId="StoryName" placeholder="My Amazing Story"/>
                </div>

                <div>
                    <TextAreaLabel cols={40} rows={3} nameId="Description" label="Description" placeholder="Something about the story" />
                </div>
            </div>
            <div>
                <ImageUpload />
                <button type="submit">Next</button>
            </div>
        </form>
    )
}
