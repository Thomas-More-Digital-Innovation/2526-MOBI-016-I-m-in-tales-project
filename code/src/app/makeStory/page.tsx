import { Header } from "@components";
import { useState } from "react";
import { useParams } from "react-router-dom";
import MakeStoryCard from "./components/MakeStoryCard";

export default function makeStory() {
  const [showToolTip, setShowToolTip] = useState(false);
  const { folderName } = useParams();

  return (
    <main className="h-screen bg-gray-50">
      <Header onHelpHover={setShowToolTip} />
      <div className="h-[calc(100vh-80px)] flex flex-col justify-center items-center gap-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black text-talesblu-900 uppercase tracking-tight">
            {folderName ? "Edit Your Story" : "Create a New Story"}
          </h1>
          <p className="text-gray-500 font-medium">
            {folderName ? "Update the foundation of your tale" : "Set the foundation for your interactive tale"}
          </p>
        </div>
        <MakeStoryCard folderName={folderName} />
      </div>
    </main>
  );
}
