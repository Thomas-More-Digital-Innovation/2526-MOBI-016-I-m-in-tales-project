import { Story } from "@/types/story.type";

interface Props {
  story: Story;
  onClick?: (story: Story) => void;
  onDelete?: (story: Story) => void;
  onExport?: (story: Story) => void;
}

export default function StoryCard({ story, onClick, onDelete, onExport }: Props) {
  return (
    <div
      onClick={onClick ? () => onClick(story) : undefined}
      className="
            relative flex flex-col items-center border border-talesblu-400 hover:bg-talesorang-400
            hover:text-white hover:border-white ease-in-out duration-300 p-2 rounded-2xl m-2
            w-xs h-96 min-h-0 cursor-pointer">
      <img src={story.image} alt="cover" className="w-full h-48 object-cover rounded-lg mb-2" />
      <h3 className="text-2xl text-center">{story.name}</h3>
      <p className="text-center text-sm">{story.description}</p>
      <div className="absolute bottom-3 right-3 flex gap-1">
        {onExport && (
          <button
            onClick={(e) => { e.stopPropagation(); onExport(story); }}
            className="p-2 rounded-lg cursor-pointer transition-all duration-150
                       hover:scale-110 hover:border hover:border-gray-300 hover:bg-white/90 hover:shadow-sm"
            title="Export story"
          >
            <img src="/export.svg" alt="export" width={18} height={18} />
          </button>
        )}
        {onDelete && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(story); }}
            className="p-2 rounded-lg cursor-pointer transition-all duration-150
                       hover:scale-110 hover:border hover:border-gray-300 hover:bg-white/90 hover:shadow-sm"
            title="Delete story"
          >
            <img src="/trash.svg" alt="delete" width={18} height={18} />
          </button>
        )}
      </div>
    </div>
  );
}
