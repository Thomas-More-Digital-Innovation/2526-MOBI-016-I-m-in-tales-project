import { Stage, Layer, Group, Rect, Text, Image, Arrow } from "react-konva";
import type { KonvaEventObject } from "konva/lib/Node";
import { ToolTip } from "@components";
import { getEdgePoints, clamp } from "./StageNodeFunctions";
import { ChapterNode } from "./useStoryState";
import { useState, useRef, useEffect, memo } from "react";

type StoryCanvasProps = {
  nodes: ChapterNode[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onNodeDragMove: (id: string, e: KonvaEventObject<DragEvent>) => void;
  scale: number;
  onScaleChange: (newScale: number) => void;
  showToolTipState?: boolean;
  linking?: boolean;
  linkingRootId?: string | null;
};

// Memoized Chapter Node to avoid unnecessary re-renders of all nodes on selection change
const ChapterNodeView = memo(({
  node,
  isSelected,
  onSelect,
  onDragMove,
  isLinking
}: {
  node: ChapterNode,
  isSelected: boolean,
  onSelect: (id: string) => void,
  onDragMove: (id: string, e: KonvaEventObject<DragEvent>) => void,
  isLinking: boolean
}) => {
  const [hovered, setHovered] = useState(false);
  return (
    <Group
      x={node.x}
      y={node.y}
      draggable={!isLinking}
      onClick={() => onSelect(node.id)}
      onTap={() => onSelect(node.id)}
      onDragMove={(e) => onDragMove(node.id, e)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Rect
        fill={isSelected ? "#ffffff" : "#fdfdfd"}
        stroke={isSelected || (isLinking && hovered) ? "#f97316" : "#e5e7eb"}
        strokeWidth={isSelected ? 3 : (isLinking && hovered ? 2 : 1)}
        dash={isLinking && hovered && !isSelected ? [10, 5] : undefined}
        shadowBlur={isSelected ? 10 : 2}
        shadowColor="rgba(0,0,0,0.1)"
        cornerRadius={20}
        width={150}
        height={150}
      />
      {node.image ? (
        <Image
          image={node.image}
          cornerRadius={16}
          x={2}
          y={2}
          width={146}
          height={110}
          listening={false}
        />
      ) : (
        <Group listening={false}>
          <Rect x={4} y={4} width={142} height={106} cornerRadius={16} fill="#f3f4f6" />
          <Text text="No Image" x={45} y={50} fontSize={10} fill="#9ca3af" fontStyle="bold uppercase" />
        </Group>
      )}
      <Text
        text={node.title}
        x={10}
        y={120}
        width={130}
        fontSize={14}
        fontStyle="bold"
        fill={isSelected ? "#111827" : "#4b5563"}
        align="center"
        listening={false}
      />
    </Group>
  );
});

export default function StoryCanvas({
  nodes,
  selectedId,
  onSelect,
  onNodeDragMove,
  scale,
  onScaleChange,
  showToolTipState = false,
  linking = false,
  linkingRootId = null
}: StoryCanvasProps) {
  const stageContainerRef = useRef<HTMLDivElement | null>(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const linkingRootNode = linkingRootId ? nodes.find(n => n.id === linkingRootId) : null;

  useEffect(() => {
    if (!stageContainerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setStageSize({ width, height: Math.max(height, 300) });
      }
    });

    resizeObserver.observe(stageContainerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (linking && linkingRootNode) {
      setMousePos({ x: linkingRootNode.x + 75, y: linkingRootNode.y + 75 });
    }
  }, [linking, linkingRootId]);

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!linking) return;
    const stage = e.target.getStage();
    if (!stage) return;
    const pos = stage.getRelativePointerPosition();
    if (pos) setMousePos(pos);
  };

  const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const scaleBy = 1.05;
    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const newScale = clamp(scale * (direction > 0 ? scaleBy : 1 / scaleBy), 0.5, 2.5);
    onScaleChange(newScale);
  };

  return (
    <div ref={stageContainerRef} className="p-2 flex-1 min-w-0 flex flex-col items-end relative overflow-hidden">
      {showToolTipState && (
        <ToolTip
          text={`Click + drag to pan \n Click on a chapter to select it \n Scroll to zoom in \n Use the button above to add a new chapter`}
          absolute
          cls="left-4 top-4"
        />
      )}
      <Stage
        width={stageSize.width}
        height={stageSize.height}
        className="border-2 border-gray-100 rounded-3xl bg-gray-50 shadow-inner overflow-hidden"
        draggable={!linking}
        scaleX={scale}
        scaleY={scale}
        onWheel={handleWheel}
        onMouseMove={handleMouseMove}
      >
        <Layer>
          {/* Ghost Arrow for Linking */}
          {linking && linkingRootNode && (
            <Arrow
              points={[
                linkingRootNode.x + 75, // Center X
                linkingRootNode.y + 75, // Center Y
                mousePos.x,
                mousePos.y
              ]}
              stroke="#f97316"
              fill="#f97316"
              strokeWidth={2}
              dash={[5, 5]}
              pointerLength={8}
              pointerWidth={8}
              listening={false}
            />
          )}
          {/* Draw Arrows First */}
          {nodes.map((node) =>
            node.links.map((link) => {
              const destination = nodes.find((n) => n.id === link.targetId);
              if (!destination) return null;
              const pts = getEdgePoints(node, destination);
              const isSourceSelected = selectedId === node.id;
              return (
                <Arrow
                  key={`${node.id}->${link.targetId}`}
                  points={pts}
                  stroke={isSourceSelected ? "#f97316" : "#cbd5e1"}
                  fill={isSourceSelected ? "#f97316" : "#cbd5e1"}
                  strokeWidth={isSourceSelected ? 2 : 1}
                  pointerLength={6}
                  pointerWidth={6}
                  listening={false}
                />
              );
            })
          )}

          {/* Draw Nodes */}
          {nodes.map((node) => (
            <ChapterNodeView
              key={node.id}
              node={node}
              isSelected={selectedId === node.id}
              onSelect={onSelect}
              onDragMove={onNodeDragMove}
              isLinking={linking}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}
