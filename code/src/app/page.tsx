import { Header, HeaderButton, LargerButton, ToolTip } from "@components";
import { useState } from "react";
import { useI18nContext } from "@/i18n/i18n-react";

export default function Home() {
  const [showToolTip, setShowToolTip] = useState(false);
  const { LL } = useI18nContext();

  return (
    <div className="flex flex-col justify-between items-center h-screen">
      <Header showPreviousButton={false} onHelpHover={setShowToolTip} />
      <div className="gap-3 justify-between flex">
        <div className="relative">
          {showToolTip && <ToolTip text={LL.HOME_TOOLTIP_PLAY()} absolute cls="max-w-[250px]" />}
          <LargerButton label={LL.HOME_PLAY_STORY()} link="/storyOverview" imageLink="/PlayStory.svg" />
        </div>
        <div className="relative">
          {showToolTip && <ToolTip text={LL.HOME_TOOLTIP_MANAGE()} absolute />}
          <LargerButton label={LL.HOME_MANAGE_STORY()} link="/manageStory" imageLink="/ManageStory.svg" />
        </div>
        <div className="relative">
          {showToolTip && <ToolTip text={LL.HOME_TOOLTIP_MAKE()} absolute />}
          <LargerButton label={LL.HOME_MAKE_STORY()} link="/makeStory" imageLink="/MakeStory.svg" />
        </div>
      </div>
      <div className="w-screen p-5 flex flex-col gap-2 items-end relative">
        {showToolTip && <ToolTip text={LL.HOME_TOOLTIP_TEST_CONNECTION()} absolute cls="-top-5 right-20" />}
        <HeaderButton link="/testBoard" label={LL.HOME_TEST_CONNECTION()} />
      </div>
    </div>
  );
}
