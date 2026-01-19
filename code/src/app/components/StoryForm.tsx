import { InputLabel, TextAreaLabel, ImageUpload, Button, ToolTip } from "@components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveStoryData } from "@/utils/storyIO";

export default function StoryForm({ showToolTipState }: { showToolTipState: boolean }) {
  const [thumbnailBytes, setThumbnailBytes] = useState<Uint8Array | null>(null);
  const navigate = useNavigate();
  const [storyId] = useState(() => crypto.randomUUID());

  const handleSave = async (jsonData: unknown, folderName: string) => {
    await saveStoryData(folderName, jsonData);
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

    await handleSave(JsonData, storyName);
  };

  return (
    <form onSubmit={handleSubmit} className="flex justify-center items-center gap-4">
      <div className="relative">
        {showToolTipState && (
          <ToolTip text="Enter the name of your story" cls="w-fit -top-8 text-[0.75rem]" absolute />
        )}
        <InputLabel
          label="Story Name"
          required={true}
          nameId="StoryName"
          placeholder="My Amazing Story"
        />
        {showToolTipState && (
          <ToolTip text="Provide a brief description of your story" cls="w-fit -bottom-10 text-[0.75rem]" absolute />
        )}
        <TextAreaLabel
          cols={40}
          rows={3}
          nameId="Description"
          label="Description"
          placeholder="Something about the story"
        />
      </div>
      <div className="relative gap-2 flex flex-col justify-center items-start">
        {showToolTipState && (
          <ToolTip text="Upload a thumbnail image for your story" cls="w-fit -top-15 text-[0.75rem]" absolute />
        )}
        <ImageUpload onImageBytes={(bytes) => setThumbnailBytes(bytes)} />
        {showToolTipState && (
          <ToolTip
            text="Click next to proceed to the story configuration"
            cls="w-fit text-[0.75rem] -bottom-20"
            absolute
          />
        )}
        <Button cls="text-sm !px-4 !py-2">Next</Button>
      </div>
    </form>
  );
}
