import { createContext, useContext, type ReactNode } from "react";
import ToolTip from "./ToolTip";

// True while the header "?" is hovered: every HelpTip shows at once
export const ShowAllTipsContext = createContext(false);

// Shows a ToolTip just below the wrapped control (never on top of it, so typing stays visible) after 1s of hover, or while focused
export default function HelpTip({
  text,
  cls = "top-full right-0 mt-1",
  wrapCls = "",
  children,
}: {
  text: string;
  // Tooltip position; must stay outside the control. Override when below would overflow its container
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
