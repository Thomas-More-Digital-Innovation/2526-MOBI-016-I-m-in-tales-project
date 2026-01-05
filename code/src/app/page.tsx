import { Header, HeaderButton, LargerButton, ToolTip } from "@components";
import { useState } from "react";
export default function Home() {
  const [showToolTip, setShowToolTip] = useState(false);
  return (
    <div className="flex flex-col justify-between items-center h-screen">
      <Header mainPage={true} onHelpHover={setShowToolTip} />
      <div className="gap-3 justify-between flex">
        <div className="relative">
          {showToolTip && <ToolTip text="Play stories made by you or others!" absolute cls="max-w-[250px]"/>}
          <LargerButton label="Play a story" link="/storyOverview" imageLink="/PlayStory.svg" />
        </div>
        <div className="relative">
          {showToolTip && <ToolTip text="Click here to edit stories!" absolute />}
          <LargerButton label="Manage story" link="/manageStory" imageLink="/ManageStory.svg" />
        </div>
        <div className="relative">
          {showToolTip && <ToolTip text="Click here to make a new story!" absolute />}
          <LargerButton label="Make a story" link="/makeStory" imageLink="/MakeStory.svg" />
        </div>
      </div>
      <div className="w-screen p-5 flex flex-col gap-2 items-end relative">
        {showToolTip && <ToolTip text="Test the connection to the board!" absolute cls="-top-5 right-20" />}
        <HeaderButton link="/testBoard" label="test connection" />
      </div>
    </div>
  );
}
