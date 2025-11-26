import Image from "next/image";
export default function Home() {
  return(
    <div className="flex flex-col justify-between items-center h-screen bg-white text-black">
      <div className="flex w-screen">
        <div className="w-3/4 justify-end flex px-10">
          <Image src="/LargeLogo.svg" alt="Main logo" priority width={800} height={500} />
        </div>
        <div className="w-1/4 flex justify-end items-start">
        {/* Maybe make components for buttons? */}
          <a href="" className="p-5 rounded-2xl m-5 text-3xl border-2 border-talesblu-400 text-talesblu-400 hover:bg-talesorang-400 hover:text-white hover:border-white ease-in-out duration-300">?</a>
        </div>
      </div>
      <div className="w-1/2 justify-between flex">
        <a href="#" className="hover:shadow-2xl p-20 border-2 rounded-2xl border-talesblu-400 hover:bg-talesorang-400 hover:text-white hover:border-white ease-in-out duration-300">
          {/* Place Image Icon */}
          Play a story
        </a>
        <a href="#" className="hover:shadow-2xl p-20 border-2 rounded-2xl border-talesblu-400 hover:bg-talesorang-400 hover:text-white hover:border-white ease-in-out duration-300">
          {/* Place Image Icon */}
          Manage Stories
        </a>
        <a href="/makeStory" className="hover:shadow-2xl p-20 border-2 rounded-2xl border-talesblu-400 hover:bg-talesorang-400 hover:text-white hover:border-white ease-in-out duration-300">
          {/* Place Image Icon */}
          Make a story
        </a>
      </div>
      <div className="w-screen flex justify-end">
        <a href="#" className="hover:shadow-2xl p-5 m-5 border-2 rounded border-talesblu-400 hover:bg-talesorang-400 hover:text-white hover:border-white ease-in-out duration-300">Test Board</a>
      </div>
    </div>
  );
}
