import { Button } from "@components";
import HelpTip from "./HelpTip";
import type { StoryLink } from "./useStoryState";
import type { TranslationFunctions } from "@/i18n/i18n-types";

interface LinkItemProps {
  link: StoryLink;
  targetTitle: string;
  calibratedTag?: string;
  onSelectTarget: () => void;
  onUpdateLabel: (label: string) => void;
  onDelete: () => void;
  onLinkTag: () => void;
  tagUid: string | null;
  nfcStatus: string;
  LL: TranslationFunctions;
  autoAdvance?: boolean;
}

export default function LinkItem({
  link,
  targetTitle,
  calibratedTag,
  onSelectTarget,
  onUpdateLabel,
  onDelete,
  onLinkTag,
  tagUid,
  nfcStatus,
  LL,
  autoAdvance,
}: LinkItemProps) {
  const showLabelError = !link.itemLabel.trim();

  return (
    <li className="bg-gray-50 p-3 rounded-2xl border border-gray-100 space-y-2 transition-all hover:border-talesorang-200">
      <HelpTip text={LL.NODE_LINK_SELECT_HINT()} cls="top-full left-0 mt-1">
        <button
          onClick={onSelectTarget}
          type="button"
          className="flex items-center gap-1.5 mb-1 bg-white hover:bg-talesorang-50 hover:border-talesorang-200 cursor-pointer transition-all duration-200 py-1 px-2.5 rounded-xl border border-gray-200/60 w-fit active:scale-95 select-none"
        >
          <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-widest">{LL.NODE_LINK_TO()}</span>
          <span className="text-[10px] text-talesblu-800 font-black flex items-center gap-1">
            {targetTitle}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-talesorang-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </span>
        </button>
      </HelpTip>
      <div className="flex justify-end items-center gap-1">
        {!autoAdvance && (
          <div className="flex-1 flex flex-col min-w-0">
            <HelpTip text={LL.TIP_LINK_LABEL()} cls="top-full left-0 mt-1">
              <input
                className={`w-full text-sm font-bold placeholder:italic border-2 border-dashed rounded-xl px-3 py-1.5 outline-none transition-all focus:ring-0 text-talesblu-800 placeholder:text-gray-400 mr-2 ${showLabelError
                  ? "border-red-300 focus:border-red-500 bg-red-50/20"
                  : "border-gray-200 focus:border-talesorang-500 focus:bg-white bg-white/60 hover:bg-white hover:border-gray-300"
                  }`}
                value={link.itemLabel}
                onChange={(e) => onUpdateLabel(e.target.value)}
                placeholder={LL.NODE_INTERACTION_PH()}
              />
            </HelpTip>
            {showLabelError && (
              <span className="text-[10px] text-red-500 font-semibold mt-1 block">
                {LL.NODE_INTERACTION_REQUIRED()}
              </span>
            )}
          </div>
        )}
        <HelpTip text={LL.TIP_DELETE_LINK()}>
          <button onClick={onDelete} aria-label={LL.TIP_DELETE_LINK()} className="text-gray-300 hover:text-red-400 transition-colors cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </HelpTip>
      </div>
      {!autoAdvance && (
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${calibratedTag ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-gray-300'}`} />
            <span className={`text-[9px] font-mono uppercase tracking-tighter ${calibratedTag ? 'text-green-600 font-bold' : 'text-gray-400'}`}>
              {calibratedTag ? `Tag: ${calibratedTag.slice(0, 8)}` : LL.NODE_TAG_NOT_LINKED()}
            </span>
          </div>
          <HelpTip text={LL.TIP_LINK_TAG()}>
            {nfcStatus === "Active" ? (
              tagUid ? (
                <Button onClick={onLinkTag} cls={`text-[8px] px-2! py-1! rounded-full font-black uppercase tracking-widest shadow-sm transition-all ${calibratedTag ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-talesorang-500 text-white'}`}>
                  {calibratedTag ? LL.NODE_UPDATE() : LL.NODE_LINK_TAG()}
                </Button>
              ) : (
                <span className="text-[8px] text-amber-500 font-bold italic animate-pulse cursor-help">{LL.NODE_WAIT_TAG()}</span>
              )
            ) : (
              <span className="text-[8px] text-gray-300 font-bold italic cursor-help">{LL.NODE_OFFLINE()}</span>
            )}
          </HelpTip>
        </div>
      )}
    </li>
  );
}
