import { HelpTip } from "@components";
import { ChapterNode } from "./useStoryState";

interface ChapterTogglesProps {
  selectedNode: ChapterNode;
  isStart: boolean;
  onSetStart: (id: string) => void;
  onUpdate: (id: string, updates: Partial<ChapterNode>) => void;
  LL: any;
}

export default function ChapterToggles({
  selectedNode,
  isStart,
  onSetStart,
  onUpdate,
  LL,
}: ChapterTogglesProps) {
  const cannotEnableAutoAdvance = !selectedNode.autoAdvance && selectedNode.links.length !== 1;

  const getAutoAdvanceTip = () => {
    if (!selectedNode.autoAdvance) {
      if (selectedNode.links.length === 0) {
        return LL.NODE_AUTO_ADVANCE_NEED_LINK() || "Add a link to another chapter before enabling auto-advance";
      }
      if (selectedNode.links.length > 1) {
        return LL.NODE_AUTO_ADVANCE_MULTIPLE_WARNING() || "Auto-advance only works with exactly 1 link. Remove extra links to enable";
      }
    }
    return LL.TIP_AUTO_ADVANCE() || "When on, the story moves on by itself as soon as the narration ends; no tag scan needed.";
  };

  return (
    <>
      <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
        <div className="flex flex-col pr-2">
          <p className="text-xs font-bold text-talesblu-800">{LL.NODE_START_CHAPTER()}</p>
          <p className="text-[10px] text-gray-400">{LL.NODE_START_CHAPTER_DESC()}</p>
        </div>
        <button
          onClick={() => onSetStart(selectedNode.id)}
          disabled={isStart}
          type="button"
          role="switch"
          aria-checked={isStart}
          aria-label={LL.NODE_START_CHAPTER()}
          className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            isStart ? "bg-talesorang-500 cursor-default" : "bg-gray-200 cursor-pointer"
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              isStart ? "translate-x-4" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
        <div className="flex flex-col pr-2">
          <p className="text-xs font-bold text-talesblu-800">{LL.NODE_AUTO_ADVANCE()}</p>
          <p className="text-[10px] text-gray-400">{LL.NODE_AUTO_ADVANCE_DESC()}</p>
        </div>
        <HelpTip text={getAutoAdvanceTip()}>
          <button
            onClick={() => {
              if (cannotEnableAutoAdvance) return;
              onUpdate(selectedNode.id, { autoAdvance: !selectedNode.autoAdvance });
            }}
            disabled={cannotEnableAutoAdvance}
            type="button"
            role="switch"
            aria-checked={!!selectedNode.autoAdvance}
            aria-disabled={cannotEnableAutoAdvance}
            aria-label={LL.NODE_AUTO_ADVANCE()}
            className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              cannotEnableAutoAdvance
                ? "opacity-50 cursor-not-allowed bg-gray-200"
                : selectedNode.autoAdvance
                ? "cursor-pointer bg-talesorang-500"
                : "cursor-pointer bg-gray-200"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                selectedNode.autoAdvance ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
        </HelpTip>
      </div>
    </>
  );
}
