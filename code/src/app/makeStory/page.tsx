import { Header, StoryForm, ToolTip } from "@components";
import { useEffect, useState } from "react";
import { exists, BaseDirectory, mkdir } from "@tauri-apps/plugin-fs";
export default function makeStory() {
  const [showToolTip, setShowToolTip] = useState(false);
  const checkDirectory = async () => {
    const tempFolderExists = await exists("temp", {
      baseDir: BaseDirectory.AppData,
    });
    if (!tempFolderExists) {
      await mkdir("temp", {
        baseDir: BaseDirectory.AppData,
        recursive: true,
      });
    }
  };
  useEffect(() => {
    checkDirectory();
  }, []);
  return (
    <main className="h-screen">
      <Header onHelpHover={setShowToolTip} />
      <div className="h-screen flex justify-center items-center">
        <StoryForm showToolTipState={showToolTip} />
      </div>
    </main>
  );
}
