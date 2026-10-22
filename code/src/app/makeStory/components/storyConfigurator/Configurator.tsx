import { useState, useEffect, useRef } from "react";
import { Button, Header, LoadingScreen, HelpTip, ShowAllTipsContext } from "@components";
import { useNavigate, useBlocker } from "react-router-dom";
import { ask } from "@tauri-apps/plugin-dialog";
import { useStoryState, ChapterNode } from "./useStoryState";
import StoryCanvas from "./StoryCanvas";
import NodeSidebar from "./NodeSidebar";
import AudioSidebar from "./AudioSidebar";
import { useI18nContext } from "@/i18n/i18n-react";

type ConfiguratorProps = {
  folderName?: string;
  showToolTipState?: boolean;
};

export default function Configurator({
  folderName = "",
}: ConfiguratorProps) {
  const [showToolTip, setShowToolTip] = useState(false);
  const [hoveredLinkId, setHoveredLinkId] = useState<string | null>(null);
  const {
    nodes,
    selectedId,
    setSelectedId,
    createNewNode,
    duplicateNode,
    deleteNode,
    updateNode,
    setStartNode,
    saveFile,
    linking,
    linkingRootId,
    toggleLinking,
    storyId,
    calibrations,
    setCalibrations,
    storyMetadata,
    isDirty,
    loading
  } = useStoryState(folderName);

  const navigate = useNavigate();
  const { LL } = useI18nContext();

  const [scale, setScale] = useState(1);
  const [showAudioSidebar, setShowAudioSidebar] = useState(false);
  const lastActiveNodeRef = useRef<ChapterNode | null>(null);

  useEffect(() => {
    if (!selectedId) setShowAudioSidebar(false);
  }, [selectedId]);

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty && currentLocation.pathname !== nextLocation.pathname
  );

  useEffect(() => {
    if (blocker.state === "blocked") {
      const confirmLeave = async () => {
        const confirmed = await ask(
          LL.CONFIG_UNSAVED_MSG(),
          { title: LL.CONFIG_UNSAVED_TITLE(), kind: "warning" }
        );
        if (confirmed) {
          blocker.proceed();
        } else {
          blocker.reset();
        }
      };
      confirmLeave();
    }
  }, [blocker]);

  const confirmDeleteNode = async (id: string) => {
    const node = nodes.find((n) => n.id === id);
    if (!node || nodes.length <= 1) return; // deleteNode keeps at least one chapter, so don't ask for nothing
    const confirmed = await ask(
      LL.MANAGE_CONFIRM_DELETE({ name: node.title }),
      { title: LL.MANAGE_CONFIRM_DELETE_TITLE(), kind: "warning" }
    );
    if (confirmed) deleteNode(id);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key !== "Delete" || !selectedId || linking) return;
      // Don't hijack Delete while editing a text field in the sidebar
      const target = e.target as HTMLElement;
      if (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
      confirmDeleteNode(selectedId);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedId, linking, confirmDeleteNode]);

  if (loading) {
    return (
      <LoadingScreen
        title={LL.CONFIG_LOADING_TITLE()}
        description={LL.CONFIG_LOADING_DESC()}
        imageSrc="/MakeStory.svg"
      />
    );
  }

  const handleSelect = (nodeId: string) => {
    if (linking && linkingRootId) {
      const existingLinks = nodes.find(n => n.id === linkingRootId)?.links || [];
      // No self-links or duplicate links: clicking such a node just cancels linking.
      if (nodeId === linkingRootId || existingLinks.some(l => l.targetId === nodeId)) {
        toggleLinking(null);
        return;
      }
      const newLinks = [
        ...existingLinks,
        {
          targetId: nodeId,
          itemId: crypto.randomUUID(),
          itemLabel: ""
        }
      ];
      updateNode(linkingRootId, { links: newLinks });
      toggleLinking(null);
    } else {
      setSelectedId(nodeId);
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  const selectedNode = selectedId ? (nodes.find((n) => n.id === selectedId) ?? null) : null;
  if (selectedNode) {
    lastActiveNodeRef.current = selectedNode;
  }
  const audioNode = selectedNode || lastActiveNodeRef.current;
  const isAudioOpen = showAudioSidebar && !!selectedNode;

  return (
    <ShowAllTipsContext.Provider value={showToolTip}>
      <div className="flex flex-col w-full h-screen">
        <Header onBack={handleBack} onHelpHover={setShowToolTip} />

        <div className="flex gap-4 w-full h-[calc(100vh-100px)]">
          <div
            className={`flex-none transition-all duration-300 ease-in-out mt-2 mb-2 overflow-hidden ${
              isAudioOpen
                ? "w-100 mr-0 opacity-100 translate-x-0"
                : "w-0 -mr-4 opacity-0 -translate-x-full pointer-events-none"
            }`}
          >
            {audioNode && (
              <div className="w-100 h-full">
                <AudioSidebar
                  selectedNode={audioNode}
                  onUpdate={updateNode}
                  onClose={() => setShowAudioSidebar(false)}
                />
              </div>
            )}
          </div>

          <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${!isAudioOpen ? "pl-4" : "pl-0"}`}>
            <div className="flex justify-between items-center mb-2 px-2">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-black text-talesblu-900 uppercase">{storyMetadata?.name || LL.CONFIG_NEW_STORY()}</h2>
                <div className="h-6 w-px bg-gray-200" />
                <p className="text-gray-400 text-sm font-medium">
                  {nodes.length} {nodes.length !== 1 ? LL.CONFIG_CHAPTER_PLURAL() : LL.CONFIG_CHAPTER_SINGULAR()}
                </p>
              </div>
              <HelpTip text={LL.TIP_SAVE()}>
                <Button onClick={saveFile} cls={`text-[12px] !px-8 !py-2 !rounded-full shadow-lg transition-all flex items-center gap-2 ${isDirty ? 'shadow-talesorang-200 ring-2 ring-talesorang-100' : 'shadow-gray-100 opacity-80 hover:opacity-100'}`}>
                  {isDirty && <div className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                  {isDirty ? LL.CONFIG_SAVE() : LL.CONFIG_SAVED()}
                </Button>
              </HelpTip>
            </div>

            <StoryCanvas
              nodes={nodes}
              selectedId={selectedId}
              onSelect={handleSelect}
              onNodeDragEnd={(id, x, y) => {
                updateNode(id, { x, y });
              }}
              scale={scale}
              onScaleChange={setScale}
              showToolTipState={showToolTip}
              linking={linking}
              linkingRootId={linkingRootId}
              onDuplicate={duplicateNode}
              onLink={toggleLinking}
              onDelete={confirmDeleteNode}
              onCreateNode={createNewNode}
              hoveredLinkId={hoveredLinkId}
            />
          </div>

          <div className="w-100 flex-none mt-2 mb-2">
            <NodeSidebar
              selectedNode={selectedNode}
              nodes={nodes}
              onSelectNode={setSelectedId}
              onUpdate={updateNode}
              onSetStart={setStartNode}
              onDelete={confirmDeleteNode}
              onLink={toggleLinking}
              onSave={saveFile}
              linking={linking}
              storyId={storyId}
              calibrations={calibrations}
              onCalibrationsUpdate={setCalibrations}
              showToolTipState={showToolTip}
              onHoverLink={setHoveredLinkId}
              isAudioOpen={isAudioOpen}
              onToggleAudio={() => setShowAudioSidebar((prev) => !prev)}
            />
          </div>
        </div>
      </div>
    </ShowAllTipsContext.Provider>
  );
}
