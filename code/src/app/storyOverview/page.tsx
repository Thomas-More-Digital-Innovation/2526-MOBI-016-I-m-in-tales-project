import { Center, Header, LargerButton } from "@components";
import HeaderButton from "../components/HeaderLink";
import { useState, useEffect, useCallback } from "react";
import StoryCard from "../components/StoryCard";
import Modal from "../components/Modal";
import { ToolTip } from "@components";
import PlayStoryButton from "./PlayStoryButton";
import { getStoriesOverview, StoryPreview, deleteStory, exportStory, importStory } from "@/utils/storyIO";
import CalibrationModal from "../components/CalibrationModal";

type Mode = "view" | "edit";

interface StoryCardData {
  id: string; // filename
  internalId: string; // internal UUID
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

  useEffect(() => { fetchStories(); }, [fetchStories]);

  const handleDelete = useCallback((story: any) => {
    deleteStory(story.id).then(fetchStories).catch((e) => console.error("Delete failed:", e));
  }, [fetchStories]);

  const handleExport = useCallback((story: any) => {
    exportStory(story.id).catch((e) => console.error("Export failed:", e));
  }, []);

  const handleImport = useCallback(() => {
    importStory()
      .then((name) => { if (name) fetchStories(); })
      .catch((e) => console.error("Import failed:", e));
  }, [fetchStories]);

  const importButton = (
    <HeaderButton
      onClick={handleImport}
      cls="px-3"
      label={<img src="/import.svg" alt="import" width={36} height={36} style={{ filter: "brightness(0) invert(1)" }} />}
    />
  );

  return (
    <main className="bg-white h-screen">
      <Header onHelpHover={setShowToolTip} title="My Stories" rightExtra={importButton} />
      {showToolTip && (<ToolTip text="Select a story to play" cls="top-20 right-4" absolute />)}
      <div className="h-80 flex justify-center items-center flex-wrap">
        {isLoading ? <Center>
          <p className="text-2xl">Verhalen aan het laden...</p>
        </Center> : stories.length > 0 ? stories.map((element) => (
          <StoryCard
            key={element.id}
            story={element as any}
            onClick={(story) => {
              setSelectedStory(story as any);
              setIsOpen(true);
            }}
            onDelete={handleDelete}
            onExport={handleExport}
          />
        )) : <Center>
          <p className="text-2xl py-4">Geen verhalen gevonden</p>
          <LargerButton label="Maak je eerste verhaal" link="/makeStory" imageLink="/MakeStory.svg" />

        </Center>}
      </div>

      <Modal
        isOpen={isOpen}
        width="70%"
        height="70%"
        setIsOpen={setIsOpen}
        onClose={() => setSelectedStory(null)}>
        {selectedStory ? StoryModal(selectedStory, mode, () => setIsCalibrationOpen(true)) : null}
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

function StoryModal(selectedStory: StoryCardData, mode: Mode, onCalibrate: () => void) {
  return (
    <div className="relative h-full">
      <img
        width={"100%"}
        height={"100%"}
        src={selectedStory.image}
        className="h-full w-full object-cover rounded-2xl"
        alt="verhaal afbeelding niet gevonden"
      />
      <div className="p-4 absolute bottom-0 w-full bg-black/70 rounded-b-2xl">
        <div className="py-2">
          <h1 className="text-2xl text-white">{selectedStory.name}</h1>
          <p className="text-white">{selectedStory.description}</p>
        </div>
        <div className="flex items-center gap-3">
          {mode == "view" ? <PlayStoryButton id={selectedStory.id} /> : <h3 className="text-white">Edit story</h3>}
          <button
            onClick={onCalibrate}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-colors backdrop-blur-sm border border-white/30"
          >
            Calibrate Tags
          </button>
        </div>
      </div>
    </div>
  );
}
