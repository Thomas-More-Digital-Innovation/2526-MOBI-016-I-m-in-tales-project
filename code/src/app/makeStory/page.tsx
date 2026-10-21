import { Header, ShowAllTipsContext } from "@components";
import { useState } from "react";
import { useParams } from "react-router-dom";
import MakeStoryCard from "./components/MakeStoryCard";
import { useI18nContext } from "@/i18n/i18n-react";

export default function MakeStory() {
  const [showToolTip, setShowToolTip] = useState(false);
  const { folderName } = useParams();
  const { LL } = useI18nContext();

  return (
    <ShowAllTipsContext.Provider value={showToolTip}>
    <main className="h-screen flex flex-col bg-gray-50">
      <Header
        onHelpHover={setShowToolTip}
        title={folderName ? LL.MAKE_TITLE_EDIT() : LL.MAKE_TITLE_NEW()}
      />
      <div className="flex-1 min-h-0 flex flex-col justify-center items-center gap-8">
        <MakeStoryCard folderName={folderName} />
      </div>
    </main>
    </ShowAllTipsContext.Provider>
  );
}
