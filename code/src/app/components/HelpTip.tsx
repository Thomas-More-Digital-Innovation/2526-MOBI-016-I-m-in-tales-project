import { createContext, useContext, type ReactNode } from "react";
import ToolTip from "./ToolTip";

// True while the header "?" is hovered: every HelpTip shows at once
export const ShowAllTipsContext = createContext(false);

// Overlays a ToolTip in the wrapped control's top-right corner after 1s of hover, or while keyboard-focused
export default function HelpTip({
  text,
  cls = "top-1 right-1",
  wrapCls = "",
  children,
}: {
  text: string;
  // Tooltip position; override when the corner default would overflow its container
  cls?: string;
  wrapCls?: string;
  children: ReactNode;
}) {
  const showAll = useContext(ShowAllTipsContext);

  if (!text || !text.trim()) {
    return <>{children}</>;
  }

  return (
    <div className={`relative group ${wrapCls}`}>
      {children}
      {/* Delay applies only on hover-in, so leaving hides it right away */}
      <div role="tooltip" className={`absolute ${cls} w-max max-w-60 z-50 pointer-events-none transition-[opacity,visibility] duration-150 ${showAll ? "visible opacity-100" : "invisible opacity-0 group-hover:visible group-hover:opacity-100 group-hover:delay-1000 group-focus-within:visible group-focus-within:opacity-100"}`}>
        <ToolTip text={text} cls="text-xs font-medium normal-case tracking-normal" />
      </div>
    </div>
  );
}
