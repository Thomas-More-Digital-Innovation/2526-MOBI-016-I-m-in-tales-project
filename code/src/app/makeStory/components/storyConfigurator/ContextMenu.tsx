import { useEffect } from "react";

type ContextMenuProps = {
  x: number;
  y: number;
  items: { label: string; onClick: () => void }[];
  onClose: () => void;
};

export default function ContextMenu({ x, y, items, onClose }: ContextMenuProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("pointerdown", onClose);
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("pointerdown", onClose);
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  return (
    <div
      role="menu"
      style={{ left: x, top: y }}
      className="absolute z-20 flex flex-col min-w-36 bg-white border border-gray-200 rounded-2xl shadow-lg p-1"
      // Keep clicks inside the menu from triggering the outside-click close before onClick fires
      onPointerDown={(e) => e.stopPropagation()}
      onContextMenu={(e) => e.preventDefault()}
    >
      {items.map((item) => (
        <button
          key={item.label}
          type="button"
          role="menuitem"
          onClick={() => {
            item.onClick();
            onClose();
          }}
          className="text-left text-sm font-bold text-talesblu-800 hover:bg-talesorang-50 hover:text-talesorang-600 rounded-xl px-3 py-2 cursor-pointer transition-colors"
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
