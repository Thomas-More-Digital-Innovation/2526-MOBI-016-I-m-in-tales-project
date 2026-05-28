import { InputLabel, TextAreaLabel, ImageUpload, AudioUpload, Button, ToolTip } from "@components";
import { ChapterNode, StoryLink } from "./useStoryState";
import { useNfc } from "../../../components/NfcProvider";
import { addCalibration, getStoryCalibration } from "@utils/tagMapping";
import { useI18nContext } from "@/i18n/i18n-react";
import type { TranslationFunctions } from "@/i18n/i18n-types";
import { createCanvasThumbnail } from "./StageNodeFunctions";

type NodeSidebarProps = {
  selectedNode: ChapterNode | null;
  onUpdate: (id: string, updates: Partial<ChapterNode>) => void;
  onDelete: (id: string) => void;
  onLink: (id: string) => void;
  onSave: () => void;
  linking: boolean;
  storyId: string | null;
  calibrations: Record<string, string>;
  onCalibrationsUpdate: (calibrations: Record<string, string>) => void;
  showToolTipState?: boolean;
};

import { memo } from "react";

const NodeSidebar = memo(({
  selectedNode,
  onUpdate,
  onDelete,
  onLink,
  onSave,
  linking,
  storyId,
  calibrations,
  onCalibrationsUpdate,
  showToolTipState = false
}: NodeSidebarProps) => {
  const { tagUid, status } = useNfc();
  const { LL } = useI18nContext();

  if (!selectedNode) {
    return (
      <div className="flex-1 min-w-[320px] border-2 border-gray-100 rounded-3xl m-3 p-8 flex flex-col justify-center items-center text-gray-400">
        <p className="text-lg font-medium italic">{LL.NODE_SELECT_HINT()}</p>
      </div>
    );
  }

  const handleQuickLink = async (itemId: string) => {
    if (!storyId || !tagUid) return;
    await addCalibration(storyId, itemId, tagUid);
    const updated = await getStoryCalibration(storyId);
    onCalibrationsUpdate(updated);
  };

  const handleMediaBytes = async (field: keyof ChapterNode, bytes: Uint8Array) => {
    const blob = new Blob([bytes as any]);
    const url = URL.createObjectURL(blob);
    const updates: Partial<ChapterNode> = { [field]: bytes };

    if (field === 'imageBytes') {
      // createCanvasThumbnail uses createImageBitmap which decodes off the main thread
      const canvas = await createCanvasThumbnail(blob);
      onUpdate(selectedNode.id, { ...updates, image: canvas, imageSrc: url });
    } else if (field === 'audioBytes') {
      onUpdate(selectedNode.id, { ...updates, audioSrc: url });
    } else if (field === 'failAudioBytes') {
      onUpdate(selectedNode.id, { ...updates, failAudioSrc: url });
    }
  };

  return (
    <div className="flex flex-col h-full min-w-[320px] border-2 border-gray-100 rounded-3xl m-3 p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-120px)] shadow-sm">
      <div className="flex justify-between items-center border-b border-gray-100 pb-4">
        <h3 className="text-talesblu-900 text-xl font-black uppercase tracking-tight">{LL.NODE_EDIT_CHAPTER()}</h3>
        {selectedNode.title !== "Intro" && (
          <button
            onClick={() => onDelete(selectedNode.id)}
            className="text-red-400 hover:text-red-600 transition-colors cursor-pointer"
            title={LL.NODE_DELETE_CHAPTER()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{LL.NODE_CHAPTER_TITLE_LABEL()}</p>
          <input
            value={selectedNode.title}
            onChange={(e) => onUpdate(selectedNode.id, { title: e.target.value })}
            className="w-full text-lg font-bold border-2 border-dashed border-gray-200 focus:border-talesorang-500 bg-gray-50/50 rounded-xl px-4 py-2 outline-none transition-all focus:ring-0 text-talesblu-800 placeholder:text-gray-300"
            placeholder={LL.NODE_CHAPTER_TITLE_PH()}
          />
        </div>

        <TextAreaLabel
          label={LL.NODE_DESC_LABEL()}
          rows={3}
          onChangeText={(e) => onUpdate(selectedNode.id, { description: e.target.value })}
          value={selectedNode.description}
          placeholder={LL.NODE_DESC_PH()}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
        <div className="space-y-2">
          <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{LL.NODE_ILLUSTRATION()}</p>
          <div className="h-32">
            <ImageUpload
              onImageBytes={(b) => handleMediaBytes('imageBytes', b)}
              value={selectedNode.imageSrc}
            />
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{LL.NODE_NARRATION()}</p>
          <div className="h-32">
            <AudioUpload
              onAudioBytes={(b) => handleMediaBytes('audioBytes', b)}
              value={selectedNode.audioSrc}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2 pt-4 border-t border-gray-50">
        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{LL.NODE_FAIL_AUDIO()}</p>
        <AudioUpload
          onAudioBytes={(b) => handleMediaBytes('failAudioBytes', b)}
          value={selectedNode.failAudioSrc}
        />
      </div>

      <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
        <div className="flex flex-col pr-2">
          <p className="text-xs font-bold text-talesblu-800">{LL.NODE_AUTO_ADVANCE()}</p>
          <p className="text-[10px] text-gray-400">{LL.NODE_AUTO_ADVANCE_DESC()}</p>
        </div>
        <button
          onClick={() => {
            const newVal = !selectedNode.autoAdvance;
            onUpdate(selectedNode.id, { autoAdvance: newVal });
          }}
          type="button"
          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${selectedNode.autoAdvance ? "bg-talesorang-500" : "bg-gray-200"
            }`}
        >
          <span
            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${selectedNode.autoAdvance ? "translate-x-4" : "translate-x-0"
              }`}
          />
        </button>
      </div>

      <div className={`pt-6 border-t border-gray-50 space-y-4 ${selectedNode.autoAdvance ? 'opacity-40 pointer-events-none select-none' : ''}`}>
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{LL.NODE_LINKS()}</p>
            {selectedNode.autoAdvance && (
              <span className="text-[9px] text-talesorang-500 font-bold italic mt-0.5">
                {LL.NODE_AUTO_ADVANCE_DISABLED()}
              </span>
            )}
          </div>
          <Button
            onClick={() => onLink(selectedNode.id)}
            cls={`text-[10px] !px-3 !py-1 ${linking ? 'bg-talesorang-600' : ''}`}
            disabled={selectedNode.autoAdvance}
          >
            {linking ? LL.NODE_LINKING() : LL.NODE_ADD_LINK()}
          </Button>
        </div>

        <ul className="space-y-3">
          {selectedNode.links.map((link) => (
            <LinkItem
              key={link.itemId}
              link={link}
              calibratedTag={calibrations[link.itemId]}
              onUpdateLabel={(label: string) => {
                const newLinks = selectedNode.links.map(l => l.itemId === link.itemId ? { ...l, itemLabel: label } : l);
                onUpdate(selectedNode.id, { links: newLinks });
              }}
              onDelete={() => {
                const newLinks = selectedNode.links.filter(l => l.itemId !== link.itemId);
                onUpdate(selectedNode.id, { links: newLinks });
              }}
              onLinkTag={() => handleQuickLink(link.itemId)}
              tagUid={tagUid}
              nfcStatus={status}
              LL={LL}
            />
          ))}
        </ul>
      </div>
    </div>
  );
});

function LinkItem({ link, calibratedTag, onUpdateLabel, onDelete, onLinkTag, tagUid, nfcStatus, LL }: any) {
  const isLabelEmpty = !link.itemLabel.trim();

  return (
    <li className="bg-gray-50 p-3 rounded-2xl border border-gray-100 space-y-2 transition-all hover:border-talesorang-200">
      <div className="flex justify-between items-center">
        <div className="flex-1 flex flex-col min-w-0">
          <input
            className={`w-full text-sm font-bold placeholder:italic border-2 border-dashed rounded-xl px-3 py-1.5 outline-none transition-all focus:ring-0 text-talesblu-800 placeholder:text-gray-400 mr-2 ${isLabelEmpty
              ? "border-red-300 focus:border-red-500 bg-red-50/20"
              : "border-gray-200 focus:border-talesorang-500 focus:bg-white bg-white/60 hover:bg-white hover:border-gray-300"
              }`}
            value={link.itemLabel}
            onChange={(e) => onUpdateLabel(e.target.value)}
            placeholder={LL.NODE_INTERACTION_PH()}
          />
          {isLabelEmpty && (
            <span className="text-[10px] text-red-500 font-semibold mt-1 block">
              {LL.NODE_INTERACTION_REQUIRED()}
            </span>
          )}
        </div>
        <button onClick={onDelete} className="text-gray-300 hover:text-red-400 transition-colors ml-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${calibratedTag ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-gray-300'}`} />
          <span className={`text-[9px] font-mono uppercase tracking-tighter ${calibratedTag ? 'text-green-600 font-bold' : 'text-gray-400'}`}>
            {calibratedTag ? `Tag: ${calibratedTag.slice(0, 8)}` : LL.NODE_TAG_NOT_LINKED()}
          </span>
        </div>
        {nfcStatus === "Active" ? (
          tagUid ? (
            <Button onClick={onLinkTag} cls={`text-[8px] px-2! py-1! rounded-full font-black uppercase tracking-widest shadow-sm transition-all ${calibratedTag ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-talesorang-500 text-white'}`}>
              {calibratedTag ? LL.NODE_UPDATE() : LL.NODE_LINK_TAG()}
            </Button>
          ) : (
            <span className="text-[8px] text-amber-500 font-bold italic animate-pulse">{LL.NODE_WAIT_TAG()}</span>
          )
        ) : (
          <span className="text-[8px] text-gray-300 font-bold italic">{LL.NODE_OFFLINE()}</span>
        )}
      </div>
    </li>
  )
}

export default NodeSidebar;
