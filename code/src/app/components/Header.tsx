import FullScreenButton from "./FullScreenButton";
import HeaderButton from "./HeaderLink";
import { NfcBadge } from "./NfcBadge";

interface HeaderProps {
  showPreviousButton?: boolean;
  onBack?: () => void;
  onHelpHover?: (visible: boolean) => void;
}

export default function Header({ showPreviousButton = true, onBack, onHelpHover }: HeaderProps) {

  // for the main page, no point in having a back button
  const backButton = onBack ? (
    <button
      onClick={onBack}
      className="text-3xl cursor-pointer font-semibold duration-150 text-white ease-in-out py-3 px-8 h-fit hover:scale-85 hover:drop-shadow-none rounded bg-[#f6745e] shadow-[0px_1px_2px_1px_#faac9e]"
    >
      &lt;
    </button>
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
        <FullScreenButton />
        <HeaderButton label="?" {...helpHoverHandlers} />
      </div>
    </div>
  );
}
