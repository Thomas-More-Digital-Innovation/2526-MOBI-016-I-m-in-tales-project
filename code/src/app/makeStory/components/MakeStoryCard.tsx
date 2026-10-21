import { useState, useEffect, useMemo } from "react";
import { ImageUpload, Button, HelpTip } from "@components";
import { useNavigate } from "react-router-dom";
import {
  loadStoryData,
  bytesToUrl,
  normalizeStoryName,
  storyExists,
  renameStory,
} from "@utils/storyIO";
import { message } from "@tauri-apps/plugin-dialog";
import { useI18nContext } from "@/i18n/i18n-react";

export default function MakeStoryCard({ folderName }: { folderName?: string }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailBytes, setThumbnailBytes] = useState<Uint8Array | null>(null);
  const [existingStory, setExistingStory] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);
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
      loadStoryData(folderName)
        .then((data) => {
          setName(data.story.name);
          setDescription(data.story.description);
          setThumbnailBytes(data.story.thumbnail as Uint8Array | null);
          setExistingStory(data.story);
        })
        .catch((err) => {
          console.error("Failed to load story for editing:", err);
        });
    }
  }, [folderName]);

  const handleNext = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      await message(LL.MAKE_CARD_NAME_REQUIRED(), {
        title: LL.STORY_INVALID_NAME_TITLE(),
        kind: "error",
      });
      return;
    }

    const finalFolderName = normalizeStoryName(trimmedName);
    if (!finalFolderName) {
      await message(LL.STORY_INVALID_NAME_MSG(), {
        title: LL.STORY_INVALID_NAME_TITLE(),
        kind: "error",
      });
      return;
    }

    setIsUpdating(true);

    try {
      if (folderName && folderName !== finalFolderName) {
        const existsOnDisk = await storyExists(finalFolderName);
        if (existsOnDisk) {
          await message(LL.STORY_EXISTS_MSG({ name: trimmedName }), {
            title: LL.STORY_EXISTS_TITLE(),
            kind: "error",
          });
          setIsUpdating(false);
          return;
        }

        await renameStory(folderName, finalFolderName, {
          name: trimmedName,
          description: description.trim(),
          thumbnail: thumbnailBytes,
        });
      } else if (!folderName) {
        const existsOnDisk = await storyExists(finalFolderName);
        if (existsOnDisk) {
          await message(LL.STORY_EXISTS_MSG({ name: trimmedName }), {
            title: LL.STORY_EXISTS_TITLE(),
            kind: "error",
          });
          setIsUpdating(false);
          return;
        }
      }

      navigate(`/makeStory/storyConfigurator/${finalFolderName}`, {
        state: {
          story: {
            ...existingStory,
            id: existingStory?.id || crypto.randomUUID(),
            name: trimmedName,
            description: description.trim(),
            thumbnail: thumbnailBytes ? Array.from(thumbnailBytes) : null,
          },
        },
      });
    } catch (err) {
      console.error("Failed to process story rename/navigation:", err);
      await message(String(err), { title: "Error", kind: "error" });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex flex-col items-center border border-talesblu-400 bg-white p-4 rounded-3xl shadow-xl w-xl transition-all hover:shadow-2xl">
      <HelpTip text={LL.TIP_STORY_COVER()} wrapCls="w-full mb-6">
        <div className="w-full h-48 overflow-hidden rounded-2xl">
          <ImageUpload
            onImageBytes={(bytes) => setThumbnailBytes(bytes)}
            value={thumbnailUrl}
          />
        </div>
      </HelpTip>

      <div className="w-full space-y-4 px-2">
        <div className="flex flex-col space-y-1">
          <label className="text-[10px] text-center text-gray-400 uppercase font-black tracking-widest mt-1">{LL.MAKE_CARD_NAME_LABEL()}</label>
          <HelpTip text={LL.TIP_STORY_NAME()}>
          <input
            type="text"
            placeholder={LL.MAKE_CARD_NAME_PLACEHOLDER()}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-2xl font-bold text-center w-full outline-none border-2 border-dashed border-gray-100 focus:border-talesorang-400 bg-gray-50/30 rounded-2xl px-4 py-2 transition-all placeholder:text-gray-300 text-talesblu-800"
          />
          </HelpTip>
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-[10px] text-center text-gray-400 uppercase font-black tracking-widest mt-1">{LL.MAKE_CARD_DESC_LABEL()}</label>
          <HelpTip text={LL.TIP_STORY_DESC()}>
          <textarea
            placeholder={LL.MAKE_CARD_DESC_PLACEHOLDER()}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="text-sm text-center w-full outline-none resize-none border-2 border-dashed border-gray-100 focus:border-talesorang-400 bg-gray-50/30 rounded-2xl px-4 py-3 transition-all placeholder:text-gray-300 italic text-gray-600 leading-relaxed"
          />
          </HelpTip>
        </div>
      </div>

      <HelpTip text={LL.TIP_STORY_START()} wrapCls="mt-auto w-full pt-4">
        <Button
          onClick={handleNext}
          disabled={isUpdating}
          cls={`w-full !rounded-2xl !py-4 shadow-lg shadow-talesorang-100 transition-transform ${
            isUpdating ? "opacity-75 cursor-not-allowed" : "hover:scale-[1.02] active:scale-[0.98]"
          }`}
        >
          {isUpdating
            ? LL.MAKE_CARD_RENAMING()
            : folderName
            ? LL.MAKE_CARD_UPDATE()
            : LL.MAKE_CARD_START()}
        </Button>
      </HelpTip>
    </div>
  );
}
