import { InputLabel, TextAreaLabel, ImageUpload, Button, ToolTip } from "@components";
import { ChapterNode, StoryLink } from "./useStoryState";
import { useNfc } from "@components/NfcProvider";
import { addCalibration, getStoryCalibration } from "@utils/tagMapping";
import { useI18nContext } from "@/i18n/i18n-react";
import type { TranslationFunctions } from "@/i18n/i18n-types";
import { createCanvasThumbnail } from "./StageNodeFunctions";

type NodeSidebarProps = {
  selectedNode: ChapterNode | null;
  nodes: ChapterNode[];
  onSelectNode: (id: string) => void;
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

import { memo, useState } from "react";
import AudioSettingsModal from "./AudioSettingsModal";
import HelpTip from "./HelpTip";
import LinkItem from "./LinkItem";

const NodeSidebar = memo(({
  selectedNode,
  nodes,
  onSelectNode,
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
  const [showAudioModal, setShowAudioModal] = useState(false);

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

  const isAddLinkDisabled = !linking && !!selectedNode.autoAdvance && selectedNode.links.length >= 1;
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

  const getAddLinkTip = () => {
    if (isAddLinkDisabled) {
      return LL.NODE_AUTO_ADVANCE_LIMIT_REACHED() || "Turn off auto-advance to add more choices";
    }
    return LL.TIP_ADD_LINK() || "Press this, then click another chapter on the canvas to connect it.";
  };

  return (
    <div className="flex flex-col h-full min-w-[320px] border-2 border-gray-100 rounded-3xl m-3 p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-120px)] shadow-sm">
      <div className="flex justify-between items-center border-b border-gray-100 pb-4">
        <h3 className="text-talesblu-900 text-xl font-black uppercase tracking-tight">{LL.NODE_EDIT_CHAPTER()}</h3>
        {selectedNode.title !== "Intro" && (
          <HelpTip text={LL.TIP_DELETE_CHAPTER()}>
            <button
              onClick={() => onDelete(selectedNode.id)}
              className="text-red-400 hover:text-red-600 transition-colors cursor-pointer"
              aria-label={LL.NODE_DELETE_CHAPTER()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </HelpTip>
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
          <HelpTip text={LL.TIP_ILLUSTRATION()} cls="top-full left-0 mt-1">
            <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest cursor-help">{LL.NODE_ILLUSTRATION()}</p>
          </HelpTip>
          <div className="h-32">
            <ImageUpload
              onImageBytes={(b) => handleMediaBytes('imageBytes', b)}
              value={selectedNode.imageSrc}
            />
          </div>
        </div>

        <div className="space-y-2 flex flex-col justify-between h-32">
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{LL.AUDIO_SETUP()}</p>
            <div className="bg-gray-50/80 rounded-2xl border border-gray-150 p-2.5 mt-2 space-y-1.5 text-[10px] font-bold">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">{LL.NODE_NARRATION()}</span>
                {selectedNode.audioSrc ? (
                  <span className="text-green-600 flex items-center gap-0.5 font-extrabold">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    {LL.AUDIO_READY()}
                  </span>
                ) : (
                  <span className="text-red-400 font-extrabold">{LL.AUDIO_MISSING()}</span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">{LL.AUDIO_FAIL_TITLE().split(' ')[0]}</span>
                {selectedNode.failAudioSrc ? (
                  <span className="text-talesorang-500 flex items-center gap-0.5 font-extrabold">
                    <span className="w-1.5 h-1.5 rounded-full bg-talesorang-500 animate-pulse" />
                    {LL.AUDIO_READY()}
                  </span>
                ) : (
                  <span className="text-gray-400 font-medium italic">{LL.AUDIO_OPTIONAL()}</span>
                )}
              </div>
            </div>
          </div>
          <HelpTip text={LL.TIP_MANAGE_AUDIO()}>
            <Button
              onClick={() => setShowAudioModal(true)}
              cls="text-[10px] !px-3 !py-1.5 w-full shadow-sm"
            >
              {LL.AUDIO_MANAGE_BUTTON()}
            </Button>
          </HelpTip>
        </div>
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
              const newVal = !selectedNode.autoAdvance;
              onUpdate(selectedNode.id, { autoAdvance: newVal });
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
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${selectedNode.autoAdvance ? "translate-x-4" : "translate-x-0"
                }`}
            />
          </button>
        </HelpTip>
      </div>

      <div className="pt-6 border-t border-gray-50 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{LL.NODE_LINKS()}</p>
            {selectedNode.autoAdvance && (
              <span className={`text-[9px] font-bold italic mt-0.5 ${selectedNode.links.length > 1 ? "text-red-500" : "text-talesorang-500"}`}>
                {selectedNode.links.length > 1
                  ? (LL.NODE_AUTO_ADVANCE_MULTIPLE_WARNING() || "* Auto-advance only works with 1 link (multiple links will pause playback)")
                  : (LL.NODE_AUTO_ADVANCE_DISABLED() || "* NFC tags ignored due to Auto-Advance")}
              </span>
            )}
          </div>
          <HelpTip text={getAddLinkTip()}>
            <Button
              onClick={() => onLink(selectedNode.id)}
              disabled={isAddLinkDisabled}
              cls={`text-[10px] !px-3 !py-1 ${linking ? 'bg-talesorang-600' : ''}`}
            >
              {linking ? LL.NODE_LINKING() : LL.NODE_ADD_LINK()}
            </Button>
          </HelpTip>
        </div>

        <ul className="space-y-3">
          {selectedNode.links.map((link) => {
            const targetNode = nodes.find((n) => n.id === link.targetId);
            const targetTitle = targetNode ? targetNode.title : "Unknown Chapter";
            return (
              <LinkItem
                key={link.itemId}
                link={link}
                targetTitle={targetTitle}
                calibratedTag={calibrations[link.itemId]}
                onSelectTarget={() => onSelectNode(link.targetId)}
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
                autoAdvance={selectedNode.autoAdvance}
              />
            );
          })}
        </ul>
      </div>

      <AudioSettingsModal
        isOpen={showAudioModal}
        setIsOpen={setShowAudioModal}
        selectedNode={selectedNode}
        onUpdate={onUpdate}
      />
    </div>
  );
});

export default NodeSidebar;
