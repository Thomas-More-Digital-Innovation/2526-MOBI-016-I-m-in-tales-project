import { Stage, Layer, Arrow } from "react-konva";
import type { KonvaEventObject } from "konva/lib/Node";
import { ToolTip } from "@components";
import { getEdgePoints, clamp, getNodeHeight } from "./StageNodeFunctions";
import { ChapterNode } from "./useStoryState";
import ContextMenu from "./ContextMenu";
import { useState, useRef, useEffect, useCallback } from "react";
import { useI18nContext } from "@/i18n/i18n-react";
import CanvasControls from "./CanvasControls";
import { ChapterNodeView } from "./ChapterNodeView";

type StoryCanvasProps = {
  nodes: ChapterNode[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onNodeDragEnd: (id: string, x: number, y: number) => void;
  scale: number;
  onScaleChange: (newScale: number) => void;
  showToolTipState?: boolean;
  linking?: boolean;
  linkingRootId?: string | null;
  onDuplicate: (id: string) => void;
  onLink: (id: string) => void;
  onDelete: (id: string) => void;
  onCreateNode: () => void;
  hoveredLinkId?: string | null;
};

export default function StoryCanvas({
  nodes,
  selectedId,
  onSelect,
  onNodeDragEnd,
  scale,
  onScaleChange,
  showToolTipState = false,
  linking = false,
  linkingRootId = null,
  onDuplicate,
  onLink,
  onDelete,
  onCreateNode,
  hoveredLinkId = null
}: StoryCanvasProps) {
  const stageContainerRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<any>(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [localPositions, setLocalPositions] = useState<Record<string, { x: number, y: number }>>({});
  const [menu, setMenu] = useState<{ nodeId: string; x: number; y: number } | null>(null);
  const { LL } = useI18nContext();
  const closeMenu = useCallback(() => setMenu(null), []);

  const handleNodeContextMenu = (nodeId: string, clientX: number, clientY: number) => {
    if (linking) return;
    const rect = stageContainerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMenu({ nodeId, x: clientX - rect.left, y: clientY - rect.top });
  };

  const handleLocalDragMove = (id: string, x: number, y: number) => {
    setLocalPositions((prev) => ({
      ...prev,
      [id]: { x, y }
    }));
  };

  const handleDragEnd = (id: string, x: number, y: number) => {
    setLocalPositions((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    onNodeDragEnd(id, x, y);
  };

  const handleRecenter = () => {
    const stage = stageRef.current;
    if (stage) {
      onScaleChange(1);
      stage.position({ x: 0, y: 0 });
      stage.batchDraw();
    }
  };

  const effectiveNodes = nodes.map((node) => {
    const local = localPositions[node.id];
    if (local) {
      return { ...node, x: local.x, y: local.y };
    }
    return node;
  });

  const linkingRootNode = linkingRootId ? effectiveNodes.find(n => n.id === linkingRootId) : null;

  // Every node reachable from the selected one; their outgoing links get highlighted.
  const downstreamIds = new Set<string>();
  if (selectedId) {
    const queue = [selectedId];
    while (queue.length) {
      const id = queue.shift()!;
      if (downstreamIds.has(id)) continue;
      downstreamIds.add(id);
      nodes.find((n) => n.id === id)?.links.forEach((l) => queue.push(l.targetId));
    }
  }

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
          text={LL.CANVAS_HINT()}
          absolute
          cls="left-4 top-4"
        />
      )}
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        className="border-2 border-gray-100 rounded-3xl bg-gray-50 shadow-inner overflow-hidden"
        draggable={!linking}
        scaleX={scale}
        scaleY={scale}
        onWheel={handleWheel}
        onMouseMove={handleMouseMove}
        onContextMenu={(e) => e.evt.preventDefault()}
      >
        <Layer>
          {linking && linkingRootNode && (
            <Arrow
              points={[
                linkingRootNode.x + 75,
                linkingRootNode.y + getNodeHeight(linkingRootNode.title) / 2,
                mousePos.x,
                mousePos.y
              ]}
              stroke="#f97316"
              fill="#f97316"
              strokeWidth={3}
              dash={[8, 6]}
              pointerLength={12}
              pointerWidth={12}
              listening={false}
            />
          )}
          {effectiveNodes.map((node) =>
            node.links.map((link) => {
              const destination = effectiveNodes.find((n) => n.id === link.targetId);
              if (!destination) return null;
              const fromHeight = getNodeHeight(node.title);
              const toHeight = getNodeHeight(destination.title);
              const pts = getEdgePoints(node, destination, fromHeight, toHeight);
              const isSourceSelected = selectedId === node.id;
              const isDownstream = !isSourceSelected && downstreamIds.has(node.id);
              const isHovered = hoveredLinkId === link.itemId;
              const isDimmed = !!hoveredLinkId && !isHovered;
              const isHighlighted = isHovered || isSourceSelected || isDownstream;
              const color = isHovered || isSourceSelected ? "#f97316" : isDownstream ? "#facc15" : "#94a3b8";
              return (
                <Arrow
                  key={`${node.id}->${link.targetId}`}
                  points={pts}
                  stroke={color}
                  fill={color}
                  strokeWidth={isHovered ? 6 : isHighlighted ? 4 : 3}
                  opacity={isDimmed ? 0.25 : 1}
                  pointerLength={12}
                  pointerWidth={12}
                  shadowColor={color}
                  shadowBlur={isHovered ? 16 : isHighlighted && !isDimmed ? 10 : 0}
                  listening={false}
                />
              );
            })
          )}
          {effectiveNodes.map((node) => (
            <ChapterNodeView
              key={node.id}
              node={node}
              isSelected={selectedId === node.id}
              onSelect={onSelect}
              onDragMove={handleLocalDragMove}
              onDragEnd={handleDragEnd}
              onContextMenu={handleNodeContextMenu}
              isLinking={linking}
            />
          ))}
        </Layer>
      </Stage>

      {menu && (
        <ContextMenu
          x={menu.x}
          y={menu.y}
          onClose={closeMenu}
          items={[
            { label: LL.CANVAS_MENU_DUPLICATE(), onClick: () => onDuplicate(menu.nodeId) },
            { label: LL.CANVAS_MENU_ADD_LINK(), onClick: () => onLink(menu.nodeId) },
            { label: LL.CANVAS_MENU_REMOVE(), onClick: () => onDelete(menu.nodeId) },
          ]}
        />
      )}

      <CanvasControls onRecenter={handleRecenter} onCreateNode={onCreateNode} />
    </div>
  );
}
