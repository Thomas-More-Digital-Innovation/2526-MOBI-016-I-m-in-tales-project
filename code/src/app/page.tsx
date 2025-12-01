import Image from "next/image";
import { HeaderButton, LargerButton } from "@components";
export default function Home() {
  return(
    <div className="flex flex-col justify-between items-center h-screen">
      <div className="flex w-screen">
        <div className="w-3/4 justify-end flex px-10">
          <Image src="LargeLogo.svg" alt="Main Logo" priority width={500} height={500} />
        </div>
        <div className="w-1/4 flex justify-end items-start">
          <HeaderButton label="?" />
        </div>
      </div>
      <div className="w-1/2 justify-between flex">
        <LargerButton label="Play a story" link="#" imageLink="/file.svg"/>
        <LargerButton label="Manage story" link="#" imageLink="/file.svg"/>
        <LargerButton label="Make a story" link="/makeStory" imageLink="/file.svg"/>
      </div>
      <div className="w-screen flex justify-end">
        <a href="#" className="hover:shadow-2xl p-5 m-5 border-2 rounded border-talesblu-400 hover:bg-talesorang-400 hover:text-white hover:border-white ease-in-out duration-300">Test Board</a>
      </div>
    </div>
  );
}
