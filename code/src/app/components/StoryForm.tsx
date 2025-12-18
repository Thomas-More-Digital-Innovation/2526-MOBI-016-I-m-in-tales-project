import { InputLabel, TextAreaLabel, ImageUpload, Button } from "@components";
import { useState } from "react";
import { writeTextFile, BaseDirectory, exists, mkdir } from "@tauri-apps/plugin-fs";
import { join } from "@tauri-apps/api/path";
import { useNavigate } from "react-router-dom";

export default function StoryForm() {
  const [thumbnailBytes, setThumbnailBytes] = useState<Uint8Array | null>(null);
  const navigate = useNavigate();
  const [storyId] = useState(() => crypto.randomUUID());

  const ensureStoryFolder = async (folderName: string) => {
    const storyFolderExists = await exists(folderName, {
      baseDir: BaseDirectory.AppData,
    });
    if (!storyFolderExists) {
      await mkdir(folderName, {
        baseDir: BaseDirectory.AppData,
        recursive: true,
      });
    }
  };

  const saveStory = async (jsonData: unknown, folderName: string) => {
    await ensureStoryFolder(folderName);

    const storyFilePath = await join(folderName, "StoryData.json");
    await writeTextFile(storyFilePath, JSON.stringify(jsonData), {
      baseDir: BaseDirectory.AppData,
    });
    navigate("/makeStory/storyConfigurator/" + folderName);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const storyName = formData.get("StoryName")?.toString().trim() || "story";
    const description = formData.get("Description")?.toString().trim() || "";

    const JsonData = {
      story: {
        id: storyId,
        name: storyName,
        description,
        thumbnail: thumbnailBytes ? Array.from(thumbnailBytes) : null,
      },
    };

    await saveStory(JsonData, storyName);
  };

  return (
    <form onSubmit={handleSubmit} className="flex justify-center items-center gap-4">
      <div>
        <InputLabel
          label="Story Name"
          required={true}
          nameId="StoryName"
          placeholder="My Amazing Story"
        />
        <TextAreaLabel
          cols={40}
          rows={3}
          nameId="Description"
          label="Description"
          placeholder="Something about the story"
        />
      </div>
      <div className="gap-2 flex flex-col justify-center items-start">
        <ImageUpload onImageBytes={(bytes) => setThumbnailBytes(bytes)} />
        <Button cls="text-sm !px-4 !py-2">Next</Button>
      </div>
    </form>
  );
}
