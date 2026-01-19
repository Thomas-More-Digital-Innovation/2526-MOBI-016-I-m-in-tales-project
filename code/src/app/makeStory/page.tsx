import { Header, StoryForm, ToolTip } from "@components";
import { useEffect, useState } from "react";
import { ensureStoryFolder } from "@/utils/storyIO";

export default function makeStory() {
  const [showToolTip, setShowToolTip] = useState(false);
  useEffect(() => {
    ensureStoryFolder("temp");
  }, []);
  return (
    <main className="h-screen">
      <Header onHelpHover={setShowToolTip} />
      <div className="h-screen flex justify-center items-center">
        <StoryForm showToolTipState={showToolTip} />
      </div>
    </main>
  );
}
