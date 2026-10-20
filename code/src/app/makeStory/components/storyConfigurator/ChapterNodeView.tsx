import { useState, memo } from "react";
import { Group, Rect, Text, Image } from "react-konva";
import { useI18nContext } from "@/i18n/i18n-react";
import { getNodeHeight } from "./StageNodeFunctions";
import { ChapterNode } from "./useStoryState";

interface ChapterNodeViewProps {
  node: ChapterNode;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDragMove: (id: string, x: number, y: number) => void;
  onDragEnd: (id: string, x: number, y: number) => void;
  onContextMenu: (id: string, clientX: number, clientY: number) => void;
  isLinking: boolean;
}

export const ChapterNodeView = memo(({
  node,
  isSelected,
  onSelect,
  onDragMove,
  onDragEnd,
  onContextMenu,
  isLinking
}: ChapterNodeViewProps) => {
  const [hovered, setHovered] = useState(false);
  const { LL } = useI18nContext();
  const cardHeight = getNodeHeight(node.title);

  return (
    <Group
      x={node.x}
      y={node.y}
      draggable={!isLinking}
      onClick={() => onSelect(node.id)}
      onTap={() => onSelect(node.id)}
      onContextMenu={(e) => onContextMenu(node.id, e.evt.clientX, e.evt.clientY)}
      onDragMove={(e) => {
        const { x, y } = e.target.position();
        onDragMove(node.id, x, y);
      }}
      onDragEnd={(e) => {
        const { x, y } = e.target.position();
        onDragEnd(node.id, x, y);
      }}
      onMouseEnter={(e) => {
        setHovered(true);
        const container = e.target.getStage()?.container();
        if (container) {
          container.style.cursor = isLinking ? "crosshair" : "grab";
        }
      }}
      onMouseLeave={(e) => {
        setHovered(false);
        const container = e.target.getStage()?.container();
        if (container) {
          container.style.cursor = "default";
        }
      }}
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
        height={cardHeight}
      />
      {node.image && (
        (node.image instanceof HTMLImageElement && node.image.complete && node.image.naturalWidth > 0) ||
        (node.image instanceof HTMLCanvasElement && node.image.width > 0)
      ) ? (
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
          <Text text={LL.CANVAS_NO_IMAGE()} x={45} y={50} fontSize={10} fill="#9ca3af" fontStyle="bold uppercase" />
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
