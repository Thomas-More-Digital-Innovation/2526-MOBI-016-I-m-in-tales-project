import type { ReactNode } from "react";
import FullScreenButton from "./FullScreenButton";
import HeaderButton from "./HeaderLink";
import { NfcBadge } from "./NfcBadge";

interface HeaderProps {
  showPreviousButton?: boolean;
  onBack?: () => void;
  onHelpHover?: (visible: boolean) => void;
  rightExtra?: ReactNode;
  title?: string;
}

export default function Header({ showPreviousButton = true, onBack, onHelpHover, title, rightExtra }: HeaderProps) {

  // for the main page, no point in having a back button
  const backIcon = <img src="/back.svg" alt="back" width={36} height={36} style={{ filter: "brightness(0) invert(1)" }} />;

  const backButton = onBack ? (
    <HeaderButton label={backIcon} onClick={onBack} />
  ) : (showPreviousButton ? <HeaderButton label={backIcon} link="../" /> : null);

  const helpHoverHandlers = onHelpHover
    ? {
      onMouseEnter: () => onHelpHover(true),
      onMouseLeave: () => onHelpHover(false)
    }
    : {};

  return (
    <div className="flex justify-between items-center relative w-screen">
      <div className="flex items-center gap-3 p-3">
        <img src="/Logo.svg" alt="Top logo" width={300} height={300} />
        <NfcBadge />
      </div>
      <h1 className="text-4xl text-talesblu-700 min-w-fit font-extrabold text-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {title}
      </h1>
      <div className="flex items-center gap-3 p-3">
        {/* NFC Status Indicator */}
        {backButton}
        {rightExtra}
        <FullScreenButton />
        <HeaderButton label="?" {...helpHoverHandlers} />
      </div>
    </div>
  );
}
