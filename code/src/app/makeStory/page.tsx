import { Header } from "@components";
import { useState } from "react";
import { useParams } from "react-router-dom";
import MakeStoryCard from "./components/MakeStoryCard";
import { useI18nContext } from "@/i18n/i18n-react";

export default function MakeStory() {
  const [showToolTip, setShowToolTip] = useState(false);
  const { folderName } = useParams();
  const { LL } = useI18nContext();

  return (
    <main className="h-screen bg-gray-50">
      <Header
        onHelpHover={setShowToolTip}
        title={folderName ? LL.MAKE_TITLE_EDIT() : LL.MAKE_TITLE_NEW()}
      />
      <div className="h-[calc(100vh-80px)] flex flex-col justify-center items-center gap-8">
        <MakeStoryCard folderName={folderName} />
      </div>
    </main>
  );
}
