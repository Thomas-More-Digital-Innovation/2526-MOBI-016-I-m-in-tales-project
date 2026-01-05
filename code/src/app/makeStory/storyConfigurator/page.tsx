import { Header, StageNode } from "@components";
import { useState } from "react";
import { useParams } from "react-router-dom";
export default function storyConfigurator() {
  const { folderName } = useParams();
  const [ showToolTip, setShowToolTip ] = useState(false);

  return (
    <main className="flex flex-col">
      <Header onHelpHover={setShowToolTip} />
      <StageNode folderName={folderName} showToolTipState={showToolTip} />
    </main>
  );
}
