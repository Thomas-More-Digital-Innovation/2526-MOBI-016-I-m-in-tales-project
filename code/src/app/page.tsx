import { Header, HeaderButton, LargerButton } from "@components";
export default function Home() {
  return(
    <div className="flex flex-col justify-between items-center h-screen">
      <Header mainPage={true}/>
      <div className="w-1/2 justify-between flex">
        <LargerButton label="Play a story" link="/playStory" imageLink="/file.svg"/>
        <LargerButton label="Manage story" link="/manageStory" imageLink="/file.svg"/>
        <LargerButton label="Make a story" link="/makeStory" imageLink="/file.svg"/>
      </div>
      <div className="w-screen flex justify-end">
        <HeaderButton link="/testBoard" label="test connection"/>
      </div>
    </div>
  );
}
