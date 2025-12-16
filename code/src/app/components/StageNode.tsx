import { useMemo, useState } from "react";
import { Stage, Layer, Group, Rect, Text, Image, Arrow } from "react-konva";
import type { KonvaEventObject } from "konva/lib/Node";
import { Button, TextAreaLabel, InputLabel, ImageUpload } from "@components";
import { readTextFile, BaseDirectory, writeTextFile} from "@tauri-apps/plugin-fs";
import { join } from "@tauri-apps/api/path";
import { useNavigate } from "react-router-dom";

// Defining how we store each node
type StoryNode = {
  id: string;
  title: string;
  description: string;
  audio: string | null;
  // Here we store the image object created from the blob containing the image bytes
  image: CanvasImageSource | null;
  // Here we store the url of the created object in order to pass it to imageupload
  imageSrc?: string | null;
  // Here we store the image bytes which are going to be stored in the JSON
  imageBytes?: Uint8Array | null;
  x: number;
  y: number;
  linkedNodes?: string[];
};

type StageNodeProps = {
  folderName?: string;
};

// Clamp helper function for zooming in/out
const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

export default function StageNode({ folderName = "" }: StageNodeProps) {
  const [scale, setScale] = useState(1);
  const navigate = useNavigate();
  // Where we store the nodes, using intro to initialize
  const [nodes, setNodes] = useState<StoryNode[]>([
    { id: crypto.randomUUID(), title: "Intro", description: "Intro Scene", image: null, audio: null, x: 200, y: 200 },
  ]);
  // The Id of the selected node (that will be shown on the forms)
  const [selectedId, setSelectedId] = useState<string | null>(nodes[0]?.id ?? null);
  // Helper for getting the size of our canvas, will only recalculate when it changes (aka when we fullscreen)
  const stageSize = useMemo(
    () => ({ width: window.innerWidth / 2, height: window.innerHeight * 0.8 }),
    []
  );
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
  const selectedNode = selectedId ? nodes.find((n) => n.id === selectedId) ?? null : null;

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
    const blob = new Blob([bytes]);
    const url = URL.createObjectURL(blob);
    const reader = new FileReader();

    reader.onloadend = () => {
      const dataUrl = typeof reader.result === "string" ? reader.result : null;
      // had to do it this way only because of canvas, for normal HTML check the component way of loading an image
      const img = new window.Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        setNodes(prev =>
          prev.map(n =>
            n.id === selectedId ? { ...n, image: img, imageBytes: bytes, imageSrc: dataUrl } : n
          )
        );
      };
      img.src = url;
    };

    reader.readAsDataURL(blob);
  }
  // this runs every time a container is clicked but depending on the state of linking it changes it functionality
  const linkStage = (nodeId: string) => {
    if (linking && linkingRootId) {
      // if linking is true we change our linkingroots array to include the nodeId passed in this function
      setNodes((prev) =>
        prev.map((n) =>
          n.id === linkingRootId ? { ...n, linkedNodes: [ ...(n.linkedNodes ?? []), nodeId ] } : n
        )
      );
      setLinking(false);
      setLinkingRootId(null);
    } else {
      // just set it to selected so we can use the forms for the clicked container
      setSelectedId(nodeId);
    }
  };
  // depending on the position of our destination (top left top right bottom left bottom right) we change the arrow to point FROM a particular point on the container
  // We do the same for the destination container.
  const getEdgePoints = (from: StoryNode, to: StoryNode) => {
    const NODE_W = 150;
    const NODE_H = 150;
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const horizontal = Math.abs(dx) >= Math.abs(dy);

    const src = horizontal
      // mathematics one love <3
      ? (dx >= 0 ? [NODE_W, NODE_H / 2] : [0, NODE_H / 2])
      : (dy >= 0 ? [NODE_W / 2, NODE_H] : [NODE_W / 2, 0]);

    const dest = horizontal
      ? (dx >= 0
          ? [dx + 0, dy + NODE_H / 2]
          : [dx + NODE_W, dy + NODE_H / 2])
      : (dy >= 0
          ? [dx + NODE_W / 2, dy + 0]
          : [dx + NODE_W / 2, dy + NODE_H]);
    return [...src, ...dest];
  };

  const saveStory = async (jsonData: unknown, folderName: string) => {
      const storyFilePath = await join(folderName, "StoryData.json");
      await writeTextFile(storyFilePath, JSON.stringify(jsonData), {
          baseDir: BaseDirectory.AppData
      });
      navigate("/");
  };
  // Saving the file by getting the json that was saved in the previous page
  // appending each node as a chapter, in options we put the linkednodes
  const saveFile = async () => {
    const existingPath = await join(folderName, 'StoryData.json');
    const baseJSON = await readTextFile(existingPath, {
      baseDir: BaseDirectory.AppData
    });
    let NewJSON = JSON.parse(baseJSON);
    const items: { item_id: string; linked_to: string }[] = [];

    const chapter = nodes.map((node) => {
      const option = (node.linkedNodes ?? []).map((linkedNode) => {
        const pseudoItemId = crypto.randomUUID();
        items.push({ item_id: pseudoItemId, linked_to: linkedNode });
        return {
          nextChapter: linkedNode,
          audio: null,
          item: pseudoItemId
        };
      });

      return {
        id: node.id,
        title: node.title,
        description: node.description,
        audio: node.audio,
        image: node.imageBytes ? Array.from(node.imageBytes) : null,
        failAudio: null,
        option
      };
    });

    NewJSON = {
      ...NewJSON,
      story: { ...(NewJSON.story ?? {}), chapter },
      item: items
    };

    await saveStory(NewJSON, folderName);
  }

  return (
    <div className="flex gap-3 w-auto">
      <div className="p-2 w-1/2 flex flex-col items-end">
        <Button onClick={createNewNode} cls="mb-2">Add new class</Button>
        {/* This is the canvas for the konva library which makes stuff draggable */}
        <Stage width={stageSize.width} height={stageSize.height - 8} className="border rounded-2xl" draggable scaleX={scale} scaleY={scale} onWheel={handleWheel}>
          <Layer>
            {nodes.map((node) => (
              <Group key={node.id} draggable x={node.x} y={node.y} onClick={() => linkStage(node.id)} onTap={() => linkStage(node.id)} onDragMove={(e) => handleNodeDragMove(node.id, e)}>
                <Rect fill={selectedId === node.id ? "#dbeafe" : "#f4f5f7"} stroke={selectedId === node.id ? "#3b82f6" : "#6b7280"} cornerRadius={16} width={150} height={150} />
                {node.image ? (
                  <Image image={node.image} cornerRadius={16} x={1} y={1} width={148} height={120}/>
                ) : (
                  <Group>
                    <Rect x={2} y={2} width={146} height= {110} cornerRadius={12} fill="#e5e7eb" />
                    <Text text="no image" x={50} y={60} fontSize={12} fill="#6b7280" />
                  </Group>
                )}
                <Text text={node.title} x={10} y={120} fontSize={16} fill="black" />
                {(node.linkedNodes ?? []).map((destinationId) => {
                  const destination = nodes.find((n) => n.id === destinationId);
                  if (!destination) return null;
                  const pts = getEdgePoints(node, destination);
                  return (
                    <Arrow
                      key={`${node.id}->${destinationId}`}
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
      <div className="w-1/2 border rounded-2xl m-3 p-2 space-y-3">
        <h3 className="text-talesorang-500 text-2xl font-bold">Selected Node</h3>
        {selectedNode ? (
          <div>
            <InputLabel label="Title" value={selectedNode.title} onChangeText={(e) => updateField("title", e.target.value)} />
            <TextAreaLabel label="Description" rows={3} onChangeText={(e) => updateField("description", e.target.value)} value={selectedNode.description} />
            <ImageUpload cls="mt-5" onImageBytes={handleImageBytes} value={selectedNode.imageSrc ?? null} />
            {linking ? (
              <div className="flex items-center mt-4">
                <Button onClick={() => toggleLinking(null)} cls="bg-talesblu-500/50 me-4 hover:bg-talesorang-300">Link Stage</Button>
                <p>Select a node to link</p>
              </div>
            ) : (
              <Button onClick={() => toggleLinking(selectedNode.id)} cls="mt-4">Link Stage</Button>
            )}
            <ul>
              {(selectedNode.linkedNodes ?? []).map((linkedNodeId) => {
                const linkedNode = nodes.find((n) => n.id === linkedNodeId);
                if (!linkedNode) return null;
                return(
                  <li key={linkedNode.id} className="border p-3 rounded-2xl border-gray-400 m-2">
                    <p>Title: {linkedNode.title}</p>
                    <p className="text-gray-400/80 text-sm">id: {linkedNode.id}</p>
                    <div>
                      <Button cls="bg-transparent border border-talesblu-400 !text-talesblu-400 text-sm hover:!text-white">Add Item</Button>
                      <Button cls="m-2 text-sm bg-transparent border border-talesorang-400 !text-talesorang-400 hover:!text-white" primary>Add Audio</Button>
                    </div>
                  </li>
                )
              })}
            </ul>
            <Button onClick={() => saveFile()}>Save</Button>
          </div>
        ) : (
          <h3 className="text-sm text-gray-500">Click a node to edit.</h3>
        )}
      </div>
    </div>
  );
}
