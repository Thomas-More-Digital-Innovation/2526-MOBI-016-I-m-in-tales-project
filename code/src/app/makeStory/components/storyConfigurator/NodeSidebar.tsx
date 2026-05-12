import { InputLabel, TextAreaLabel, ImageUpload, AudioUpload, Button, ToolTip } from "@components";
import { ChapterNode, StoryLink } from "./useStoryState";
import { useNfc } from "../../../components/NfcProvider";
import { addCalibration, getStoryCalibration } from "@utils/tagMapping";

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

  if (!selectedNode) {
    return (
      <div className="flex-1 min-w-[320px] border-2 border-gray-100 rounded-3xl m-3 p-8 flex flex-col justify-center items-center text-gray-400">
        <p className="text-lg font-medium italic">Select a chapter to start editing</p>
      </div>
    );
  }

  const handleQuickLink = async (itemId: string) => {
    if (!storyId || !tagUid) return;
    await addCalibration(storyId, itemId, tagUid);
    const updated = await getStoryCalibration(storyId);
    onCalibrationsUpdate(updated);
  };

  const handleMediaBytes = (field: keyof ChapterNode, bytes: Uint8Array) => {
    const blob = new Blob([bytes as any]);
    const url = URL.createObjectURL(blob);

    const updates: Partial<ChapterNode> = { [field]: bytes };
    if (field === 'imageBytes') {
      const img = new window.Image();
      img.onload = () => onUpdate(selectedNode.id, { ...updates, image: img, imageSrc: url });
      img.src = url;
    } else if (field === 'audioBytes') {
      onUpdate(selectedNode.id, { ...updates, audioSrc: url });
    } else if (field === 'failAudioBytes') {
      onUpdate(selectedNode.id, { ...updates, failAudioSrc: url });
    }
  };

  return (
    <div className="flex flex-col h-full min-w-[320px] border-2 border-gray-100 rounded-3xl m-3 p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-120px)] shadow-sm">
      <div className="flex justify-between items-center border-b border-gray-100 pb-4">
        <h3 className="text-talesblu-900 text-xl font-black uppercase tracking-tight">Edit Chapter</h3>
        {selectedNode.title !== "Intro" && (
          <button
            onClick={() => onDelete(selectedNode.id)}
            className="text-red-400 hover:text-red-600 transition-colors"
            title="Delete Chapter"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Chapter Title</p>
          <input
            value={selectedNode.title}
            onChange={(e) => onUpdate(selectedNode.id, { title: e.target.value })}
            className="w-full text-lg font-bold border-2 border-dashed border-gray-200 focus:border-talesorang-500 bg-gray-50/50 rounded-xl px-4 py-2 outline-none transition-all focus:ring-0 text-talesblu-800 placeholder:text-gray-300"
            placeholder="Name your chapter..."
          />
        </div>

        <TextAreaLabel
          label="Description"
          rows={3}
          onChangeText={(e) => onUpdate(selectedNode.id, { description: e.target.value })}
          value={selectedNode.description}
          placeholder="What happens in this chapter?"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
        <div className="space-y-2">
          <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Illustration</p>
          <div className="h-32">
            <ImageUpload
              onImageBytes={(b) => handleMediaBytes('imageBytes', b)}
              value={selectedNode.imageSrc}
            />
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Narration</p>
          <div className="h-32">
            <AudioUpload
              onAudioBytes={(b) => handleMediaBytes('audioBytes', b)}
              value={selectedNode.audioSrc}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2 pt-4 border-t border-gray-50">
        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Fail Audio (Optional)</p>
        <AudioUpload
          onAudioBytes={(b) => handleMediaBytes('failAudioBytes', b)}
          value={selectedNode.failAudioSrc}
        />
      </div>

      <div className="pt-6 border-t border-gray-50 space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Links & Interactions</p>
          <Button
            onClick={() => onLink(selectedNode.id)}
            cls={`text-[10px] !px-3 !py-1 ${linking ? 'bg-talesorang-600' : ''}`}
          >
            {linking ? 'Linking...' : '+ Add Link'}
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
            />
          ))}
        </ul>
      </div>
    </div>
  );
});

function LinkItem({ link, calibratedTag, onUpdateLabel, onDelete, onLinkTag, tagUid, nfcStatus }: any) {
  return (
    <li className="bg-gray-50 p-3 rounded-2xl border border-gray-100 space-y-2 transition-all hover:border-talesorang-200">
      <div className="flex justify-between items-center">
        <input
          className="bg-transparent border-none outline-none text-sm font-bold text-talesblu-700 w-full"
          value={link.itemLabel}
          onChange={(e) => onUpdateLabel(e.target.value)}
        />
        <button onClick={onDelete} className="text-gray-300 hover:text-red-400 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${calibratedTag ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-gray-300'}`} />
          <span className={`text-[9px] font-mono uppercase tracking-tighter ${calibratedTag ? 'text-green-600 font-bold' : 'text-gray-400'}`}>
            {calibratedTag ? `Tag: ${calibratedTag.slice(0, 8)}` : 'Tag: Not Linked'}
          </span>
        </div>
        {nfcStatus === "Active" ? (
          tagUid ? (
            <Button onClick={onLinkTag} cls={`text-[8px] px-2! py-1! rounded-full font-black uppercase tracking-widest shadow-sm transition-all ${calibratedTag ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-talesorang-500 text-white'}`}>
              {calibratedTag ? 'Update' : 'Link Tag'}
            </Button>
          ) : (
            <span className="text-[8px] text-amber-500 font-bold italic animate-pulse">Wait Tag...</span>
          )
        ) : (
          <span className="text-[8px] text-gray-300 font-bold italic">Offline</span>
        )}
      </div>
    </li>
  )
}

export default NodeSidebar;
