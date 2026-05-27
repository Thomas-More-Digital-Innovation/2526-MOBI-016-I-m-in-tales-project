import { useState, useEffect, useMemo } from "react";
import { ImageUpload, Button } from "@components";
import { useNavigate } from "react-router-dom";
import { loadStoryData, bytesToUrl } from "@utils/storyIO";
import { useI18nContext } from "@/i18n/i18n-react";

export default function MakeStoryCard({ folderName }: { folderName?: string }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailBytes, setThumbnailBytes] = useState<Uint8Array | null>(null);
  const [existingStory, setExistingStory] = useState<any>(null);
  const navigate = useNavigate();
  const { LL } = useI18nContext();

  const thumbnailUrl = useMemo(() => {
    if (thumbnailBytes) {
      return bytesToUrl(thumbnailBytes, "image/png");
    }
    return null;
  }, [thumbnailBytes]);

  useEffect(() => {
    if (folderName) {
      loadStoryData(folderName).then((data) => {
        setName(data.story.name);
        setDescription(data.story.description);
        setThumbnailBytes(data.story.thumbnail as Uint8Array | null);
        setExistingStory(data.story);
      });
    }
  }, [folderName]);

  const handleNext = () => {
    if (!name.trim()) {
      alert(LL.MAKE_CARD_NAME_REQUIRED());
      return;
    }

    const finalFolderName = name.trim().replace(/\s+/g, "_").toLowerCase();
    
    // If folderName changed (name changed), we might need to handle renaming, 
    // but for now let's just pass the data. 
    // The Configurator will use the finalFolderName to save.

    navigate(`/makeStory/storyConfigurator/${finalFolderName}`, {
      state: {
        story: {
          ...existingStory,
          id: existingStory?.id || crypto.randomUUID(),
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
          value={thumbnailUrl}
        />
      </div>

      <div className="w-full space-y-4 px-2">
        <div className="flex flex-col space-y-1">
          <label className="text-[10px] text-center text-gray-400 uppercase font-black tracking-widest mt-1">{LL.MAKE_CARD_NAME_LABEL()}</label>
          <input
            type="text"
            placeholder={LL.MAKE_CARD_NAME_PLACEHOLDER()}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-2xl font-bold text-center w-full outline-none border-2 border-dashed border-gray-100 focus:border-talesorang-400 bg-gray-50/30 rounded-2xl px-4 py-2 transition-all placeholder:text-gray-300 text-talesblu-800"
          />
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-[10px] text-center text-gray-400 uppercase font-black tracking-widest mt-1">{LL.MAKE_CARD_DESC_LABEL()}</label>
          <textarea
            placeholder={LL.MAKE_CARD_DESC_PLACEHOLDER()}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="text-sm text-center w-full outline-none resize-none border-2 border-dashed border-gray-100 focus:border-talesorang-400 bg-gray-50/30 rounded-2xl px-4 py-3 transition-all placeholder:text-gray-300 italic text-gray-600 leading-relaxed"
          />
        </div>
      </div>

      <div className="mt-auto w-full pt-4">
        <Button onClick={handleNext} cls="w-full !rounded-2xl !py-4 shadow-lg shadow-talesorang-100 hover:scale-[1.02] active:scale-[0.98] transition-transform">
          {folderName ? LL.MAKE_CARD_UPDATE() : LL.MAKE_CARD_START()}
        </Button>
      </div>
    </div>
  );
}
