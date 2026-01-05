import { Header } from "@components";
import { useState, useEffect } from "react";
import { Story, StoriesData } from "../../types/story.type";
import StoryCard from "../components/StoryCard";
import Modal from "../components/Modal";
import { ToolTip } from "@components";
import PlayStoryButton from "./PlayStoryButton";

type Mode = "view" | "edit";

export default function StoryOverview({ mode = "view" }: { mode: Mode }) {
  const [stories, setStories] = useState<Story[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [showToolTip, setShowToolTip] = useState(false);


  useEffect(() => {
    // Use absolute path so it works regardless of the current route.
    fetch("/stories.json")
      .then((res) => res.json())
      .then((data: StoriesData) => {
        setStories(data.story || []);
      })
      .catch((error) => console.error("Error fetching stories:", error));
  }, []);

  return (
    <main className="bg-white h-screen">
      <Header onHelpHover={setShowToolTip} />
      {showToolTip && (<ToolTip text="Select a story to play" cls="top-20 right-4" absolute />)}
      <div className="h-80 flex justify-center items-center flex-wrap">
        {stories.map((element) => (
          <StoryCard
            key={element.id}
            story={element}
            onClick={(story) => {
              setSelectedStory(story);
              setIsOpen(true);
            }}
          />
        ))}
      </div>

      <Modal
        isOpen={isOpen}
        width="70%"
        height="70%"
        setIsOpen={setIsOpen}
        onClose={() => setSelectedStory(null)}>
        {selectedStory ? StoryModal(selectedStory, mode) : null}
      </Modal>
    </main>
  );
}

function StoryModal(selectedStory: Story, mode: Mode) {
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
        {mode == "view" ? <PlayStoryButton id={selectedStory.id} /> : <h1>edit</h1>}{" "}
        {/* TODO add edit button */}
      </div>
    </div>
  );
}
