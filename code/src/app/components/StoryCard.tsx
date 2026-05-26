import { ReactNode } from "react";
import { Story } from "@/types/story.type";

interface Props {
  story: Story;
  onClick?: (story: Story) => void;
  actions?: ReactNode;
}

export default function StoryCard({ story, onClick, actions }: Props) {
  return (
    <div
      onClick={onClick ? () => onClick(story) : undefined}
      className={`
            flex flex-col items-center border border-talesblu-400 bg-white ease-in-out duration-300 p-2 rounded-2xl m-2
            w-xs h-96 min-h-0 ${onClick ? 'cursor-pointer hover:bg-talesorang-400 hover:text-white hover:border-white' : ''}`}>
      <img src={story.image} alt="cover" className="w-full h-48 object-cover rounded-lg mb-2" />
      <h3 className="text-2xl text-center font-bold">{story.name}</h3>
      <p className="text-center text-sm flex-1">{story.description}</p>
      {actions && (
        <div className="w-full mt-2" onClick={(e) => e.stopPropagation()}>
          {actions}
        </div>
      )}
    </div>
  );
}
