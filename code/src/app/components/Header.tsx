import FullScreenButton from "./FullScreenButton";
import HeaderButton from "./HeaderLink";
import { NfcBadge } from "./NfcBadge";

interface HeaderProps {
  mainPage?: boolean;
  onHelpHover?: (visible: boolean) => void;
}

export default function Header({ mainPage = false, onHelpHover }: HeaderProps) {

  // for the main page, no point in having a back button
  const backButton = mainPage ? null : <HeaderButton label="<" link="../" />;

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
        <FullScreenButton />
        <HeaderButton label="?" {...helpHoverHandlers} />
      </div>
    </div>
  );
}
