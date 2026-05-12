import { useState } from "react";
import { Button, Header } from "@components";
import { useNavigate, useBlocker } from "react-router-dom";
import { ask } from "@tauri-apps/plugin-dialog";
import { useEffect } from "react";
import { useStoryState } from "./useStoryState";
import StoryCanvas from "./StoryCanvas";
import NodeSidebar from "./NodeSidebar";

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
    deleteNode,
    updateNode,
    saveFile,
    linking,
    linkingRootId,
    toggleLinking,
    storyId,
    calibrations,
    setCalibrations,
    storyMetadata,
    isDirty
  } = useStoryState(folderName);

  const navigate = useNavigate();

  const [scale, setScale] = useState(1);

  const handleSelect = (nodeId: string) => {
    if (linking && linkingRootId) {
      const newLinks = [
        ...(nodes.find(n => n.id === linkingRootId)?.links || []),
        {
          targetId: nodeId,
          itemId: crypto.randomUUID(),
          itemLabel: "New Interaction"
        }
      ];
      updateNode(linkingRootId, { links: newLinks });
      toggleLinking(null);
    } else {
      setSelectedId(nodeId);
    }
  };

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty && currentLocation.pathname !== nextLocation.pathname
  );

  useEffect(() => {
    if (blocker.state === "blocked") {
      const confirmLeave = async () => {
        const confirmed = await ask(
          "Are you sure you want to leave? Unsaved changes will not be saved.",
          { title: "Unsaved Changes", kind: "warning" }
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

  const handleBack = () => {
    navigate("/");
  };

  const selectedNode = selectedId ? (nodes.find((n) => n.id === selectedId) ?? null) : null;

  return (
    <div className="flex flex-col w-full h-screen">
      <Header onBack={handleBack} onHelpHover={setShowToolTip} />

      <div className="flex gap-4 w-full h-[calc(100vh-100px)] px-4 mt-2">
        <div className="flex-[2.5] flex flex-col min-w-0">
          <div className="flex justify-between items-center mb-2 px-2">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-black text-talesblu-900 uppercase">{storyMetadata?.name || 'New Story'}</h2>
              <div className="h-6 w-px bg-gray-200" />
              <p className="text-gray-400 text-sm font-medium">{nodes.length} Chapter{nodes.length !== 1 ? 's' : ''}</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={createNewNode} cls="text-[12px] !px-6 !py-2 !rounded-full shadow-md hover:shadow-lg transition-all bg-white !text-talesblu-800 border-2 border-gray-100">
                + Add New Chapter
              </Button>
              <Button onClick={saveFile} cls={`text-[12px] !px-8 !py-2 !rounded-full shadow-lg transition-all flex items-center gap-2 ${isDirty ? 'shadow-talesorang-200 ring-2 ring-talesorang-100' : 'shadow-gray-100 opacity-80 hover:opacity-100'}`}>
                {isDirty && <div className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                {isDirty ? 'Save Changes' : 'Saved'}
              </Button>
            </div>
          </div>

          <StoryCanvas
            nodes={nodes}
            selectedId={selectedId}
            onSelect={handleSelect}
            onNodeDragMove={(id, e) => {
              const { x, y } = e.target.position();
              updateNode(id, { x, y });
            }}
            scale={scale}
            onScaleChange={setScale}
            showToolTipState={showToolTip}
            linking={linking}
            linkingRootId={linkingRootId}
          />
        </div>

        <div className="w-100 flex-none">
          <NodeSidebar
            selectedNode={selectedNode}
            onUpdate={updateNode}
            onDelete={deleteNode}
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
