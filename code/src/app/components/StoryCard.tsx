import { useState } from "react";
import { Story } from "@/types/story.type";

interface Props {
  story: Story;
  onClick?: (story: Story) => void;
  onDelete?: (story: Story) => void;
  onExport?: (story: Story) => void;
}

export default function StoryCard({ story, onClick, onDelete, onExport }: Props) {
  const [showConfirm, setShowConfirm] = useState(false);

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
            onClick={(e) => { e.stopPropagation(); setShowConfirm(true); }}
            className="p-2 rounded-lg cursor-pointer transition-all duration-150
                       hover:scale-110 hover:border hover:border-gray-300 hover:bg-white/90 hover:shadow-sm"
            title="Delete story"
          >
            <img src="/trash.svg" alt="delete" width={18} height={18} />
          </button>
        )}
      </div>

      {showConfirm && (
        <div
          className="absolute inset-0 bg-talesblu-500/95 rounded-2xl flex flex-col items-center justify-center gap-3 z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <img src="/trash.svg" alt="" width={28} height={28} style={{ filter: "brightness(0) invert(1)" }} />
          <p className="text-white text-center font-semibold px-4 text-lg">
            Verhaal verwijderen?
          </p>
          <p className="text-talesblu-100 text-sm text-center px-6">
            "{story.name}" wordt permanent verwijderd.
          </p>
          <div className="flex gap-2 mt-1">
            <button
              onClick={(e) => { e.stopPropagation(); setShowConfirm(false); }}
              className="px-4 py-2 rounded-xl bg-talesblu-400 hover:bg-talesblu-300 text-white text-sm font-medium transition-colors duration-150"
            >
              Annuleren
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete!(story); setShowConfirm(false); }}
              className="px-4 py-2 rounded-xl bg-talesorang-400 hover:bg-talesorang-500 text-white text-sm font-medium transition-colors duration-150"
            >
              Verwijderen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
