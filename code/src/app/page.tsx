import { Header, HeaderButton, LargerButton } from "@components";
export default function Home() {
  return (
    <div className="flex flex-col justify-between items-center h-screen">
      <Header mainPage={true} />
      <div className="w-1/2 justify-between flex">
        <LargerButton label="Play a story" link="/storyOverview" imageLink="/PlayStory.svg" />
        <LargerButton label="Manage story" link="/manageStory" imageLink="/ManageStory.svg" />
        <LargerButton label="Make a story" link="/makeStory" imageLink="/MakeStory.svg" />
      </div>
      <div className="w-screen p-5 flex justify-end">
        <HeaderButton link="/testBoard" label="test connection" />
      </div>
    </div>
  );
}
