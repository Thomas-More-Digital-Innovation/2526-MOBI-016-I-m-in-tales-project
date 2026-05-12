import { useState, useEffect, useRef } from "react";
import { Stage, Layer, Group, Rect, Text, Image, Arrow } from "react-konva";
import type { KonvaEventObject } from "konva/lib/Node";
import { Button, TextAreaLabel, InputLabel, ImageUpload, AudioUpload, ToolTip } from "@components";
import { useNavigate } from "react-router-dom";
import { getEdgePoints } from "./StageNodeFunctions";
import { loadStoryData, saveStoryData } from "@utils/storyIO";
import { useNfc } from "./NfcProvider";
import { addCalibration, getStoryCalibration } from "@utils/tagMapping";

// Defining how we store each node
type StoryLink = {
  targetId: string;
  itemId: string;
  itemLabel: string;
};

type StoryNode = {
  id: string;
  title: string;
  description: string;
  audio: string | null;
  audioSrc?: string | null;
  audioBytes?: Uint8Array<ArrayBuffer> | null;
  failAudioSrc?: string | null;
  failAudioBytes?: Uint8Array<ArrayBuffer> | null;
  image: CanvasImageSource | null;
  imageSrc?: string | null;
  imageBytes?: Uint8Array<ArrayBuffer> | null;
  x: number;
  y: number;
  links: StoryLink[];
};

type StageNodeProps = {
  folderName?: string;
  showToolTipState?: boolean;
};

// Clamp helper function for zooming in/out
const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

export default function StageNode({ folderName = "", showToolTipState = false }: StageNodeProps) {
  const [scale, setScale] = useState(1);
  const navigate = useNavigate();
  const { tagUid, status } = useNfc();
  const [storyId, setStoryId] = useState<string | null>(null);
  const [calibrations, setCalibrations] = useState<Record<string, string>>({});
  // Where we store the nodes, using intro to initialize
  const [nodes, setNodes] = useState<StoryNode[]>([
    {
      id: crypto.randomUUID(),
      title: "Intro",
      description: "Intro Scene",
      image: null,
      audio: null,
      x: 200,
      y: 200,
      links: [],
    },
  ]);
  // The Id of the selected node (that will be shown on the forms)
  const [selectedId, setSelectedId] = useState<string | null>(nodes[0]?.id ?? null);
  // Track available space for the stage so it stays responsive.
  const stageContainerRef = useRef<HTMLDivElement | null>(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    loadStoryData(folderName).then(async (data) => {
      if (data.story?.id) {
        setStoryId(data.story.id);
        const storyCalibrations = await getStoryCalibration(data.story.id);
        setCalibrations(storyCalibrations);
      }
    });
  }, [folderName]);

  useEffect(() => {
    const updateStageSize = () => {
      const container = stageContainerRef.current;
      const width = container?.clientWidth ?? window.innerWidth / 2;
      const height = window.innerHeight - 160; // leave room for header/buttons
      setStageSize({ width, height: Math.max(height, 300) });
    };

    updateStageSize();
    window.addEventListener("resize", updateStageSize);
    return () => window.removeEventListener("resize", updateStageSize);
  }, []);

  useEffect(() => {
    return () => {
      nodes.forEach((node) => {
        if (node.audioSrc && node.audioSrc.startsWith("blob:")) {
          URL.revokeObjectURL(node.audioSrc);
        }
        if (node.failAudioSrc && node.failAudioSrc.startsWith("blob:")) {
          URL.revokeObjectURL(node.failAudioSrc);
        }
      });
    };
  }, [nodes]);
  // boolean to determine color of the button and what clicking a node does
  const [linking, setLinking] = useState(false);
  // reference for our source when linking
  const [linkingRootId, setLinkingRootId] = useState<string | null>(null);

  const createNewNode = async () => {
    setNodes((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: "New Node",
        description: "New Node Description",
        image: null,
        audio: null,
        x: 0,
        y: 0,
        links: [],
      },
    ]);
  };

  // for zooming in/out
  const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const scaleBy = 1.05;
    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const newScale = clamp(scale * (direction > 0 ? scaleBy : 1 / scaleBy), 0.5, 2.5);
    setScale(newScale);
  };
  // find our selectednode via id
  const selectedNode = selectedId ? (nodes.find((n) => n.id === selectedId) ?? null) : null;

  // real time updating from forms
  const updateField = (field: "title" | "description", value: string) => {
    if (!selectedId) return;
    setNodes((prev) => prev.map((n) => (n.id === selectedId ? { ...n, [field]: value } : n)));
  };
  // update position in real time so that arrow recalculation is smooth.
  const handleNodeDragMove = (nodeId: string, e: KonvaEventObject<DragEvent>) => {
    const { x, y } = e.target.position();
    setNodes((prev) => prev.map((n) => (n.id === nodeId ? { ...n, x, y } : n)));
  };

  const toggleLinking = (nodeId: string | null) => {
    setLinking(!linking);
    setLinkingRootId(nodeId);
  };
  // get the image in bytes from our components
  const handleImageBytes = (bytes: Uint8Array<ArrayBuffer>) => {
    if (!selectedId) return;
    const blob = new Blob([bytes as BufferSource]);
    const url = URL.createObjectURL(blob);
    const reader = new FileReader();

    reader.onloadend = () => {
      const dataUrl = typeof reader.result === "string" ? reader.result : null;
      // had to do it this way only because of canvas, for normal HTML check the component way of loading an image
      const img = new window.Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        setNodes((prev) =>
          prev.map((n) =>
            n.id === selectedId ? { ...n, image: img, imageBytes: bytes, imageSrc: dataUrl } : n
          )
        );
      };
      img.src = url;
    };

    reader.readAsDataURL(blob);
  };

  const handleAudioBytes = (bytes: Uint8Array<ArrayBuffer>) => {
    if (!selectedId) return;
    const blob = new Blob([bytes as BufferSource]);
    const url = URL.createObjectURL(blob);
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === selectedId) {
          if (n.audioSrc && n.audioSrc.startsWith("blob:")) {
            URL.revokeObjectURL(n.audioSrc);
          }
          return { ...n, audioBytes: bytes, audioSrc: url };
        }
        return n;
      })
    );
  };

  const handleFailAudioBytes = (bytes: Uint8Array<ArrayBuffer>) => {
    if (!selectedId) return;
    const blob = new Blob([bytes as BufferSource]);
    const url = URL.createObjectURL(blob);
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === selectedId) {
          if (n.failAudioSrc && n.failAudioSrc.startsWith("blob:")) {
            URL.revokeObjectURL(n.failAudioSrc);
          }
          return { ...n, failAudioBytes: bytes, failAudioSrc: url };
        }
        return n;
      })
    );
  };
  // this runs every time a container is clicked but depending on the state of linking it changes it functionality
  const linkStage = (nodeId: string) => {
    if (linking && linkingRootId) {
      // if linking is true we change our linkingroots array to include the nodeId passed in this function
      setNodes((prev) =>
        prev.map((n) =>
          n.id === linkingRootId
            ? {
              ...n,
              links: [
                ...n.links,
                {
                  targetId: nodeId,
                  itemId: crypto.randomUUID(),
                  itemLabel: "New Item"
                }
              ]
            }
            : n
        )
      );
      setLinking(false);
      setLinkingRootId(null);
    } else {
      // just set it to selected so we can use the forms for the clicked container
      setSelectedId(nodeId);
    }
  };
  const handleQuickLink = async (itemId: string) => {
    if (!storyId || !tagUid) return;
    await addCalibration(storyId, itemId, tagUid);
    const updated = await getStoryCalibration(storyId);
    setCalibrations(updated);
  };

  // Saving the file by getting the json that was saved in the previous page
  // appending each node as a chapter, in options we put the linkednodes
  const saveFile = async () => {
    let NewJSON = await loadStoryData(folderName);
    const items: { itemId: string; linkedTo: string; label: string }[] = [];
    const chapter = nodes.map((node) => {
      const option = node.links.map((link) => {
        items.push({
          itemId: link.itemId,
          linkedTo: link.targetId,
          label: link.itemLabel
        });
        return {
          nextChapter: link.targetId,
          audio: null,
          item: link.itemId,
        };
      });

      return {
        id: node.id,
        title: node.title,
        description: node.description,
        audio: node.audioBytes ?? null,
        image: node.imageBytes ?? null,
        failAudio: node.failAudioBytes ?? null,
        option,
      };
    });

    NewJSON = {
      ...NewJSON,
      story: { ...(NewJSON.story ?? {}), chapter },
      items: items,
    };

    await saveStoryData(folderName, NewJSON);
    navigate("/");
  }

  return (
    <div className="flex gap-3 w-full">
      <div ref={stageContainerRef} className="p-2 flex-1 min-w-[320px] flex flex-col items-end">
        <Button onClick={createNewNode} cls="text-sm !px-4 !py-2 mb-2">
          Add new class
        </Button>
        {/* This is the canvas for the konva library which makes stuff draggable */}
        {showToolTipState && <ToolTip text={`Click + drag to pan \n Click on a node to select it \n Scroll to zoom in \n Click the button on the top right to add a new node`} absolute cls="left-2 top-35" />}
        <Stage
          width={stageSize.width}
          height={stageSize.height}
          className="border rounded-2xl w-full"
          draggable
          scaleX={scale}
          scaleY={scale}
          onWheel={handleWheel}>
          <Layer>
            {nodes.map((node) => (
              <Group
                key={node.id}
                draggable
                x={node.x}
                y={node.y}
                onClick={() => linkStage(node.id)}
                onTap={() => linkStage(node.id)}
                onDragMove={(e) => handleNodeDragMove(node.id, e)}>
                <Rect
                  fill={selectedId === node.id ? "#dbeafe" : "#f4f5f7"}
                  stroke={selectedId === node.id ? "#3b82f6" : "#6b7280"}
                  cornerRadius={16}
                  width={150}
                  height={150}
                />
                {node.image ? (
                  <Image
                    image={node.image}
                    cornerRadius={16}
                    x={1}
                    y={1}
                    width={148}
                    height={120}
                  />
                ) : (
                  <Group>
                    <Rect x={2} y={2} width={146} height={110} cornerRadius={12} fill="#e5e7eb" />
                    <Text text="no image" x={50} y={60} fontSize={12} fill="#6b7280" />
                  </Group>
                )}
                <Text text={node.title} x={10} y={120} fontSize={16} fill="black" />
                {node.links.map((link) => {
                  const destination = nodes.find((n) => n.id === link.targetId);
                  if (!destination) return null;
                  const pts = getEdgePoints(node, destination);
                  return (
                    <Arrow
                      key={`${node.id}->${link.targetId}`}
                      points={pts}
                      stroke="#000"
                      fill="#000"
                      strokeWidth={1}
                    />
                  );
                })}
              </Group>
            ))}
          </Layer>
        </Stage>
      </div>
      <div className="flex-1 min-w-[320px] border rounded-2xl m-3 p-2 space-y-3">
        <h3 className="text-talesorang-500 text-2xl font-bold">Selected Node</h3>
        {selectedNode ? (
          <div>
            {showToolTipState && <ToolTip text="Edit the title of the selected node" cls="w-fit text-[0.75rem] mb-3" />}
            <InputLabel
              label="Title"
              value={selectedNode.title}
              onChangeText={(e) => updateField("title", e.target.value)}
            />
            {showToolTipState && <ToolTip text="Edit the description of the selected node" cls="w-fit text-[0.75rem] my-3" />}
            <TextAreaLabel
              label="Description"
              rows={3}
              onChangeText={(e) => updateField("description", e.target.value)}
              value={selectedNode.description}
            />
            {showToolTipState && <ToolTip text="Upload an image for the selected node" cls="w-fit text-[0.75rem] my-3" />}
            <ImageUpload
              cls="mt-5"
              onImageBytes={handleImageBytes}
              value={selectedNode.imageSrc ?? null}
            />
            {showToolTipState && <ToolTip text="Upload audio for the selected node" cls="w-fit text-[0.75rem] my-3" />}
            <AudioUpload
              cls="mt-5"
              onAudioBytes={handleAudioBytes}
              value={selectedNode.audioSrc ?? null}
            />
            {showToolTipState && <ToolTip text="Upload fail audio for the selected node" cls="w-fit text-[0.75rem] my-3" />}
            <AudioUpload
              cls="mt-5"
              onAudioBytes={handleFailAudioBytes}
              value={selectedNode.failAudioSrc ?? null}
            />
            <div className="my-2 border-t border-gray-300" />
            {showToolTipState && <ToolTip text="Click the button and select a node to link it" cls="w-fit text-[0.75rem] mb-2" />}
            {linking ? (
              <div className="flex items-center mt-4">
                <Button onClick={() => toggleLinking(null)} cls="text-sm !px-4 !py-2">
                  Link Stage
                </Button>
                <p>Select a node to link</p>
              </div>
            ) : (
              <Button onClick={() => toggleLinking(selectedNode.id)} cls="text-sm !px-4 !py-2">
                Link Stage
              </Button>
            )}
            <ul>
              {selectedNode.links.map((link) => {
                const linkedNode = nodes.find((n) => n.id === link.targetId);
                if (!linkedNode) return null;
                return (
                  <li key={link.itemId} className="border p-4 rounded-2xl border-gray-200 bg-white shadow-sm space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-talesblu-800">{linkedNode.title}</p>
                        <p className="text-[10px] text-gray-400 uppercase font-black">Target Node</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-talesblu-400 uppercase tracking-widest">Item Name (Label)</label>
                      <input
                        type="text"
                        value={link.itemLabel}
                        onChange={(e) => {
                          const newLabel = e.target.value;
                          setNodes(prev => prev.map(n =>
                            n.id === selectedId
                              ? { ...n, links: n.links.map(l => l.itemId === link.itemId ? { ...l, itemLabel: newLabel } : l) }
                              : n
                          ));
                        }}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:border-talesorang-500 outline-none transition-colors"
                      />
                    </div>

                    <div className="flex justify-between items-center gap-2">
                      <span className="font-mono text-[10px] text-gray-400">ID: {link.itemId.slice(0, 8)}...</span>
                      <div className="flex items-center gap-2">
                        {calibrations[link.itemId] && (
                          <div className="bg-emerald-100 text-emerald-600 p-1 rounded-full" title={`Linked to: ${calibrations[link.itemId]}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}

                        {status === "Active" ? (
                          tagUid ? (
                            <button
                              onClick={() => handleQuickLink(link.itemId)}
                              className="bg-talesorang-500 hover:bg-talesorang-600 text-white text-[9px] px-2 py-1 rounded font-black uppercase tracking-widest transition-colors shadow-sm"
                            >
                              {calibrations[link.itemId] ? 'Update Link' : 'Link Tag'}
                            </button>
                          ) : (
                            <span className="text-[9px] text-amber-500 font-bold italic uppercase animate-pulse">Waiting for tag...</span>
                          )
                        ) : (
                          <span className="text-[9px] text-gray-300 font-bold italic uppercase">Reader offline</span>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            {showToolTipState && <ToolTip text="Click the save button to save your changes and write to file" cls="w-fit mt-2 text-[0.75rem]" />}
            <Button onClick={() => saveFile()} cls="text-sm !px-4 !py-2 my-3">
              Save
            </Button>
          </div>
        ) : (
          <h3 className="text-sm text-gray-500">Click a node to edit.</h3>
        )}
      </div>
    </div>
  );
}
