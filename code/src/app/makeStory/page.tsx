import { Header, StoryForm } from "@components";
import { useEffect } from "react";
import { exists, BaseDirectory, mkdir } from "@tauri-apps/plugin-fs";
export default function makeStory() {
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
      <Header />
      <div className="h-screen flex justify-center items-center">
        <StoryForm />
      </div>
    </main>
  );
}
