import { FullScreenButton, HeaderButton } from "@components";

interface HeaderProps {
    mainPage?: boolean;
    onHelpHover?: (visible: boolean) => void;
}

export default function Header({ mainPage = false, onHelpHover }: HeaderProps) {
  // for the main page, no point in having a back button
  const backButton = mainPage ? null : <HeaderButton label="<" link="../" />;

  const handleHover = (visible: boolean) => {
    onHelpHover?.(visible);
  }

  const helpHoverHandlers = onHelpHover
        ?   {
              onMouseEnter: () => onHelpHover(true),
              onMouseLeave: () => onHelpHover(false)
            }
        : {};

  return (
    <div className="flex justify-between items-center w-screen">
      <img src="/Logo.svg" alt="Top logo" width={300} height={300} />
      <div className="flex gap-3 p-3">
        {backButton}
        <FullScreenButton />
        <HeaderButton label="?" {...helpHoverHandlers} />
      </div>
    </div>
  );
}
