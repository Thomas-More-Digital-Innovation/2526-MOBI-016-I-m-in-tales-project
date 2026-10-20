import type { ReactNode } from "react";
import { ToolTip } from "@components";

// Shows a ToolTip while the wrapped control is hovered or keyboard-focused
export default function HelpTip({
  text,
  cls = "top-full right-0 mt-2",
  children,
}: {
  text: string;
  cls?: string;
  children: ReactNode;
}) {
  return (
    <div className="relative group">
      {children}
      <div role="tooltip" className={`absolute ${cls} w-60 z-50 hidden group-hover:block group-focus-within:block pointer-events-none`}>
        <ToolTip text={text} cls="text-xs font-medium normal-case tracking-normal" />
      </div>
    </div>
  );
}
