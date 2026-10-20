import { useState } from "react";
import { Button, Header, LoadingScreen } from "@components";
import { useNavigate, useBlocker } from "react-router-dom";
import { ask } from "@tauri-apps/plugin-dialog";
import { useEffect } from "react";
import { useStoryState } from "./useStoryState";
import StoryCanvas from "./StoryCanvas";
import NodeSidebar from "./NodeSidebar";
import { useI18nContext } from "@/i18n/i18n-react";

type ConfiguratorProps = {
  folderName?: string;
  showToolTipState?: boolean;
};

export default function Configurator({
  folderName = "",
}: ConfiguratorProps) {
  const [showToolTip, setShowToolTip] = useState(false);
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
      const newLinks = [
        ...(nodes.find(n => n.id === linkingRootId)?.links || []),
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

  return (
    <div className="flex flex-col w-full h-screen">
      <Header onBack={handleBack} onHelpHover={setShowToolTip} />

      <div className="flex gap-4 w-full h-[calc(100vh-100px)] px-4">
        <div className="flex-[2.5] flex flex-col min-w-0">
          <div className="flex justify-between items-center mb-2 px-2">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-black text-talesblu-900 uppercase">{storyMetadata?.name || LL.CONFIG_NEW_STORY()}</h2>
              <div className="h-6 w-px bg-gray-200" />
              <p className="text-gray-400 text-sm font-medium">
                {nodes.length} {nodes.length !== 1 ? LL.CONFIG_CHAPTER_PLURAL() : LL.CONFIG_CHAPTER_SINGULAR()}
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={saveFile} cls={`text-[12px] !px-8 !py-2 !rounded-full shadow-lg transition-all flex items-center gap-2 ${isDirty ? 'shadow-talesorang-200 ring-2 ring-talesorang-100' : 'shadow-gray-100 opacity-80 hover:opacity-100'}`}>
                {isDirty && <div className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                {isDirty ? LL.CONFIG_SAVE() : LL.CONFIG_SAVED()}
              </Button>
            </div>
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
          />
        </div>

        <div className="w-100 flex-none">
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
          />
        </div>
      </div>
    </div>
  );
}
