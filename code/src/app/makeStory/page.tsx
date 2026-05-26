import { Header } from "@components";
import { useState } from "react";
import { useParams } from "react-router-dom";
import MakeStoryCard from "./components/MakeStoryCard";

export default function makeStory() {
  const [showToolTip, setShowToolTip] = useState(false);
  const { folderName } = useParams();

  return (
    <main className="h-screen bg-gray-50">
      <Header onHelpHover={setShowToolTip} title={folderName ? 'Edit Your Story' : 'Create A New Story'} />
      <div className="h-[calc(100vh-80px)] flex flex-col justify-center items-center gap-8">
        <MakeStoryCard folderName={folderName} />
      </div>
    </main>
  );
}
