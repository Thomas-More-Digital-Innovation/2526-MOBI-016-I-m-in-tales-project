import { writeTextFile, BaseDirectory, exists, mkdir, readTextFile, readDir } from "@tauri-apps/plugin-fs";
import { join } from "@tauri-apps/api/path";

/**
 * Ensures that the story folder exists in the AppData directory.
 * @param folderName The name of the story folder.
 */
export const ensureStoryFolder = async (folderName: string) => {
  const storyFolderExists = await exists(folderName, {
    baseDir: BaseDirectory.AppData,
  });
  if (!storyFolderExists) {
    await mkdir(folderName, {
      baseDir: BaseDirectory.AppData,
      recursive: true,
    });
  }
};

/**
 * Saves story data to a JSON file in the story folder.
 * @param folderName The name of the story folder.
 * @param jsonData The data to be saved.
 */
export const saveStoryData = async (folderName: string, jsonData: unknown) => {
  await ensureStoryFolder(folderName);
  const storyFilePath = await join(folderName, "StoryData.json");
  await writeTextFile(storyFilePath, JSON.stringify(jsonData, null, 2), {
    baseDir: BaseDirectory.AppData,
  });
};

/**
 * Loads story data from a JSON file in the story folder.
 * @param folderName The name of the story folder.
 * @returns The parsed JSON data.
 */
export const loadStoryData = async (folderName: string) => {
  const storyFilePath = await join(folderName, "StoryData.json");
  const content = await readTextFile(storyFilePath, {
    baseDir: BaseDirectory.AppData,
  });
  return JSON.parse(content);
};

