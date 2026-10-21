import { createContext, useContext, type ReactNode } from "react";
import { ToolTip } from "@components";

// True while the header "?" is hovered: every HelpTip shows at once
export const ShowAllTipsContext = createContext(false);

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
  const showAll = useContext(ShowAllTipsContext);

  if (!text || !text.trim()) {
    return <>{children}</>;
  }

  return (
    <div className="relative group">
      {children}
      <div role="tooltip" className={`absolute ${cls} w-60 z-50 ${showAll ? "block" : "hidden"} group-hover:block group-focus-within:block pointer-events-none`}>
        <ToolTip text={text} cls="text-xs font-medium normal-case tracking-normal" />
      </div>
    </div>
  );
}
