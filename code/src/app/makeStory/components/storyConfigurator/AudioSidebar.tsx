import { useI18nContext } from "@/i18n/i18n-react";
import { ChapterNode } from "./useStoryState";
import AudioDropCard from "./AudioDropCard";

interface AudioSidebarProps {
  selectedNode: ChapterNode;
  onUpdate: (id: string, updates: Partial<ChapterNode>) => void;
  onClose: () => void;
}

export default function AudioSidebar({
  selectedNode,
  onUpdate,
  onClose,
}: AudioSidebarProps) {
  const { LL } = useI18nContext();

  const handleNarrationBytes = (bytes: Uint8Array) => {
    const blob = new Blob([bytes as any]);
    const url = URL.createObjectURL(blob);
    onUpdate(selectedNode.id, { audioBytes: bytes, audioSrc: url });
  };

  const handleClearNarration = () => {
    onUpdate(selectedNode.id, { audioBytes: null, audioSrc: null });
  };

  const handleFailBytes = (bytes: Uint8Array) => {
    const blob = new Blob([bytes as any]);
    const url = URL.createObjectURL(blob);
    onUpdate(selectedNode.id, { failAudioBytes: bytes, failAudioSrc: url });
  };

  const handleClearFail = () => {
    onUpdate(selectedNode.id, { failAudioBytes: null, failAudioSrc: null });
  };

  return (
    <div className="flex flex-col h-full min-w-[320px] border-2 border-gray-100 rounded-r-3xl p-4 space-y-4 overflow-y-auto shadow-sm bg-white">
      {/* Sidebar header */}
      <div className="flex justify-between items-center border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2 min-w-0">
          <h3 className="text-talesblu-900 text-lg font-black uppercase tracking-tight truncate">
            {LL.AUDIO_SETUP()}
          </h3>
          <span
            className="text-[10px] font-black uppercase text-talesorang-500 bg-talesorang-50 px-2 py-0.5 rounded-md truncate max-w-30"
            title={selectedNode.title}
          >
            {selectedNode.title}
          </span>
        </div>

        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-xl transition-colors cursor-pointer"
          aria-label="Close audio sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Card 1: Narration audio */}
      <AudioDropCard
        title={LL.AUDIO_NARRATION_TITLE()}
        description={LL.AUDIO_NARRATION_DESC()}
        audioSrc={selectedNode.audioSrc}
        onAudioBytes={handleNarrationBytes}
        onClear={handleClearNarration}
        isOptional={false}
        LL={LL}
      />

      {/* Card 2: Feedback / Error audio */}
      <AudioDropCard
        title={LL.AUDIO_FAIL_TITLE()}
        description={LL.AUDIO_FAIL_DESC()}
        audioSrc={selectedNode.failAudioSrc}
        onAudioBytes={handleFailBytes}
        onClear={handleFailFailAudioFallback(handleClearFail)}
        isOptional={true}
        LL={LL}
      />
    </div>
  );
}

function handleFailFailAudioFallback(fn: () => void) {
  return fn;
}
