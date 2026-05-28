import { Center, Header, LargerButton, ToolTip, ImportButton, LoadingScreen, NoStoriesCTA } from "@components";
import { useState, useEffect, useCallback } from "react";
import StoryCard from "../components/StoryCard";
import Modal from "../components/Modal";
import PlayStoryButton from "./PlayStoryButton";
import CalibrationModal from "../components/CalibrationModal";
import { getStoriesOverview, StoryPreview } from "@/utils/storyIO";
import { useI18nContext } from "@/i18n/i18n-react";
import type { TranslationFunctions } from "@/i18n/i18n-types";

type Mode = "view" | "edit";

interface StoryCardData {
  id: string;
  internalId: string;
  name: string;
  description: string;
  image: string;
}

export default function StoryOverview({ mode = "view" }: { mode: Mode }) {
  const [stories, setStories] = useState<StoryCardData[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState<StoryCardData | null>(null);
  const [showToolTip, setShowToolTip] = useState(false);
  const [isCalibrationOpen, setIsCalibrationOpen] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const { LL } = useI18nContext();

  const fetchStories = useCallback(() => {
    getStoriesOverview()
      .then((previews: StoryPreview[]) => {
        const storyCards = previews.map((preview) => ({
          id: preview.id,
          internalId: preview.internalId,
          name: preview.name,
          description: preview.description,
          image: preview.thumbnailUrl,
        }));
        setStories(storyCards);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching stories:", error))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  return (
    <main className="bg-white h-screen">
      <Header onHelpHover={setShowToolTip} title={LL.OVERVIEW_TITLE()} />
      {showToolTip && (<ToolTip text={LL.OVERVIEW_TOOLTIP()} cls="top-20 right-4" absolute />)}
      <div className="h-80 flex justify-center items-center flex-wrap">
        {isLoading ? (
          <LoadingScreen
            title={LL.OVERVIEW_LOADING_TITLE()}
            description={LL.OVERVIEW_LOADING_DESC()}
            imageSrc="/PlayStory.svg"
          />
        ) : stories.length > 0 ? stories.map((element) => (
          <StoryCard
            key={element.id}
            story={element as any}
            onClick={(story) => {
              setSelectedStory(story as any);
              setIsOpen(true);
            }}
          />
        )) : (
          <NoStoriesCTA />
        )}
      </div>

      <Modal
        isOpen={isOpen}
        width="70%"
        height="70%"
        setIsOpen={setIsOpen}
        onClose={() => setSelectedStory(null)}
      >
        {selectedStory ? StoryModal(selectedStory, mode, () => setIsCalibrationOpen(true), LL) : null}
      </Modal>

      {selectedStory && (
        <CalibrationModal
          isOpen={isCalibrationOpen}
          setIsOpen={setIsCalibrationOpen}
          storyId={selectedStory.internalId}
          storyName={selectedStory.id}
        />
      )}
    </main>
  );
}

function StoryModal(
  selectedStory: StoryCardData,
  mode: Mode,
  onCalibrate: () => void,
  LL: TranslationFunctions,
) {
  return (
    <div className="relative h-full">
      <img
        width={"100%"}
        height={"100%"}
        src={selectedStory.image}
        className="h-full w-full object-cover rounded-2xl"
        alt={LL.OVERVIEW_IMAGE_ALT()}
      />
      <div className="p-4 absolute bottom-0 w-full bg-black/70 rounded-b-2xl">
        <div className="py-2">
          <h1 className="text-2xl text-white">{selectedStory.name}</h1>
          <p className="text-white">{selectedStory.description}</p>
        </div>
        <div className="flex items-center gap-3">
          {mode === "view" ? <PlayStoryButton id={selectedStory.id} /> : <h3 className="text-white">{LL.OVERVIEW_EDIT_STORY()}</h3>}
          <button
            onClick={onCalibrate}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-colors backdrop-blur-sm border border-white/30"
          >
            {LL.OVERVIEW_CALIBRATE()}
          </button>
        </div>
      </div>
    </div>
  );
}
