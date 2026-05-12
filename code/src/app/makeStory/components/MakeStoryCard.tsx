import { useState } from "react";
import { ImageUpload, Button } from "@components";
import { useNavigate } from "react-router-dom";

export default function MakeStoryCard() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailBytes, setThumbnailBytes] = useState<Uint8Array | null>(null);
  const navigate = useNavigate();

  const handleNext = () => {
    if (!name.trim()) {
      alert("Please enter a story name");
      return;
    }

    // Generate a temporary folder name (based on story name)
    const folderName = name.trim().replace(/\s+/g, "_").toLowerCase();

    navigate(`/makeStory/storyConfigurator/${folderName}`, {
      state: {
        story: {
          id: crypto.randomUUID(),
          name: name.trim(),
          description: description.trim(),
          thumbnail: thumbnailBytes ? Array.from(thumbnailBytes) : null,
        }
      }
    });
  };

  return (
    <div className="flex flex-col items-center border border-talesblu-400 bg-white p-4 rounded-3xl shadow-xl w-xl h-125 transition-all hover:shadow-2xl">
      <div className="w-full h-48 mb-6 overflow-hidden rounded-2xl">
        <ImageUpload
          onImageBytes={(bytes) => setThumbnailBytes(bytes)}
        />
      </div>

      <div className="w-full space-y-4 px-2">
        <div className="flex flex-col space-y-1">
          <label className="text-[10px] text-center text-gray-400 uppercase font-black tracking-widest mt-1">Story Name</label>
          <input
            type="text"
            placeholder="Story Title"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-2xl font-bold text-center w-full outline-none border-2 border-dashed border-gray-100 focus:border-talesorang-400 bg-gray-50/30 rounded-2xl px-4 py-2 transition-all placeholder:text-gray-300 text-talesblu-800"
          />
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-[10px] text-center text-gray-400 uppercase font-black tracking-widest mt-1">Description</label>
          <textarea
            placeholder="Tell a bit about your story..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="text-sm text-center w-full outline-none resize-none border-2 border-dashed border-gray-100 focus:border-talesorang-400 bg-gray-50/30 rounded-2xl px-4 py-3 transition-all placeholder:text-gray-300 italic text-gray-600 leading-relaxed"
          />
        </div>
      </div>

      <div className="mt-auto w-full pt-4">
        <Button onClick={handleNext} cls="w-full !rounded-2xl !py-4 shadow-lg shadow-talesorang-100 hover:scale-[1.02] active:scale-[0.98] transition-transform">
          Start Telling Your Story
        </Button>
      </div>
    </div>
  );
}
