import type { ReactNode } from "react";
import FullScreenButton from "./FullScreenButton";
import HeaderButton from "./HeaderLink";
import { NfcBadge } from "./NfcBadge";

interface HeaderProps {
  showPreviousButton?: boolean;
  onBack?: () => void;
  onHelpHover?: (visible: boolean) => void;
  rightExtra?: ReactNode;
}

export default function Header({ showPreviousButton = true, onBack, onHelpHover, rightExtra }: HeaderProps) {

  // for the main page, no point in having a back button
  const backButton = onBack ? (
    <HeaderButton label="<" onClick={onBack} />
  ) : (showPreviousButton ? <HeaderButton label="<" link="../" /> : null);

  const helpHoverHandlers = onHelpHover
    ? {
      onMouseEnter: () => onHelpHover(true),
      onMouseLeave: () => onHelpHover(false)
    }
    : {};

  return (
    <div className="flex justify-between items-center w-screen">
      <div className="flex items-center gap-3 p-3">
        <img src="/Logo.svg" alt="Top logo" width={300} height={300} />
        <NfcBadge />
      </div>
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
