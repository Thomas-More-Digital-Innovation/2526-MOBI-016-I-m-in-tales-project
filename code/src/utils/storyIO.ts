import {
  writeFile,
  readFile,
  BaseDirectory,
  exists,
  mkdir,
  readDir,
} from "@tauri-apps/plugin-fs";
import { join } from "@tauri-apps/api/path";
import JSZip from "jszip";

export interface StoryMetadata {
  id: string;
  name: string;
  description: string;
  chapters?: ChapterMetadata[];
  items?: ItemMetadata[];
}

export interface ChapterMetadata {
  id: string;
  title: string;
  description: string;
  options?: OptionMetadata[];
}

export interface OptionMetadata {
  nextChapter: string;
  item: string | null;
}

export interface ItemMetadata {
  item_id: string;
  linked_to: string;
}

export interface StoryData {
  story: {
    id: string;
    name: string;
    description: string;
    thumbnail?: Uint8Array | number[] | null;
    chapter?: ChapterData[];
  };
  item?: ItemData[];
}

export interface ChapterData {
  id: string;
  title: string;
  description: string;
  image?: Uint8Array | number[] | null;
  audio?: Uint8Array | number[] | null;
  failAudio?: Uint8Array | number[] | null;
  option?: OptionData[];
}

export interface OptionData {
  nextChapter: string;
  audio?: Uint8Array | number[] | null;
  item: string | null;
}

export interface ItemData {
  item_id: string;
  linked_to: string;
}

// ============================================
// Helper Functions
// ============================================

const ensureStoriesDir = async () => {
  const storiesExists = await exists("stories", { baseDir: BaseDirectory.AppData });
  if (!storiesExists) {
    await mkdir("stories", { baseDir: BaseDirectory.AppData, recursive: true });
  }
};

const toUint8Array = (data: Uint8Array | number[] | null | undefined): Uint8Array | null => {
  if (!data) return null;
  return data instanceof Uint8Array ? data : new Uint8Array(data);
};

// ============================================
// Save Story (Create Zip)
// ============================================

export const saveStoryData = async (storyName: string, data: StoryData): Promise<void> => {
  await ensureStoriesDir();

  const zip = new JSZip();

  const metadata: StoryMetadata = {
    id: data.story.id,
    name: data.story.name,
    description: data.story.description,
    chapters: data.story.chapter?.map(ch => ({
      id: ch.id,
      title: ch.title,
      description: ch.description,
      options: ch.option?.map(opt => ({
        nextChapter: opt.nextChapter,
        item: opt.item,
      })),
    })),
    items: data.item,
  };

  zip.file("metadata.json", JSON.stringify(metadata, null, 2));

  const thumbBytes = toUint8Array(data.story.thumbnail);
  if (thumbBytes && thumbBytes.length > 0) {
    zip.file("thumbnail.png", thumbBytes);
  }

  if (data.story.chapter) {
    const imagesFolder = zip.folder("images");
    const audioFolder = zip.folder("audio");

    for (const chapter of data.story.chapter) {
      const imgBytes = toUint8Array(chapter.image);
      if (imgBytes && imgBytes.length > 0) {
        imagesFolder?.file(`${chapter.id}.png`, imgBytes);
      }

      const audBytes = toUint8Array(chapter.audio);
      if (audBytes && audBytes.length > 0) {
        audioFolder?.file(`${chapter.id}.mp3`, audBytes);
      }

      const fAudBytes = toUint8Array(chapter.failAudio);
      if (fAudBytes && fAudBytes.length > 0) {
        audioFolder?.file(`${chapter.id}_fail.mp3`, fAudBytes);
      }

      if (chapter.option) {
        chapter.option.forEach((opt, idx) => {
          const optAudBytes = toUint8Array(opt.audio);
          if (optAudBytes && optAudBytes.length > 0) {
            audioFolder?.file(`${chapter.id}_opt_${idx}.mp3`, optAudBytes);
          }
        });
      }
    }
  }

  const zipContent = await zip.generateAsync({ type: "uint8array" });
  const zipPath = await join("stories", `${storyName}.zip`);
  await writeFile(zipPath, zipContent, { baseDir: BaseDirectory.AppData });
};

// ============================================
// Load Story (Extract Zip)
// ============================================

export const loadStoryData = async (storyName: string): Promise<StoryData> => {
  const zipPath = await join("stories", `${storyName}.zip`);
  const zipContent = await readFile(zipPath, { baseDir: BaseDirectory.AppData });

  const zip = await JSZip.loadAsync(zipContent);

  const metadataFile = zip.file("metadata.json");
  if (!metadataFile) throw new Error("No metadata.json found in story zip");
  const metadataText = await metadataFile.async("string");
  const metadata: StoryMetadata = JSON.parse(metadataText);

  let thumbnail: Uint8Array | null = null;
  const thumbFile = zip.file("thumbnail.png");
  if (thumbFile) {
    thumbnail = await thumbFile.async("uint8array");
  }

  const chapters: ChapterData[] = await Promise.all(
    (metadata.chapters || []).map(async (ch) => {
      let image: Uint8Array | null = null;
      let audio: Uint8Array | null = null;

      const imgFile = zip.file(`images/${ch.id}.png`);
      if (imgFile) {
        image = await imgFile.async("uint8array");
      }

      const audFile = zip.file(`audio/${ch.id}.mp3`);
      if (audFile) {
        audio = await audFile.async("uint8array");
      }

      let failAudio: Uint8Array | null = null;
      const fAudFile = zip.file(`audio/${ch.id}_fail.mp3`);
      if (fAudFile) {
        failAudio = await fAudFile.async("uint8array");
      }

      const options = await Promise.all(
        (ch.options || []).map(async (opt, idx) => {
          let optAudio: Uint8Array | null = null;
          const optAudFile = zip.file(`audio/${ch.id}_opt_${idx}.mp3`);
          if (optAudFile) {
            optAudio = await optAudFile.async("uint8array");
          }
          return {
            nextChapter: opt.nextChapter,
            audio: optAudio,
            item: opt.item,
          };
        })
      );

      return {
        id: ch.id,
        title: ch.title,
        description: ch.description,
        image,
        audio,
        failAudio,
        option: options,
      };
    })
  );

  return {
    story: {
      id: metadata.id,
      name: metadata.name,
      description: metadata.description,
      thumbnail,
      chapter: chapters,
    },
    item: metadata.items || [],
  };
};

// ============================================
// Get Story Previews (Fast Overview)
// ============================================

export interface StoryPreview {
  id: string;
  name: string;
  description: string;
  thumbnailUrl: string;
}

export const getStoriesOverview = async (): Promise<StoryPreview[]> => {
  await ensureStoriesDir();
  const previews: StoryPreview[] = [];

  try {
    const files = await readDir("stories", { baseDir: BaseDirectory.AppData });

    for (const file of files) {
      if (file.name?.endsWith(".zip")) {
        const storyName = file.name.replace(".zip", "");
        try {
          const zipPath = await join("stories", file.name);
          const zipContent = await readFile(zipPath, { baseDir: BaseDirectory.AppData });
          const zip = await JSZip.loadAsync(zipContent);

          const metadataFile = zip.file("metadata.json");
          if (!metadataFile) continue;
          const metadataText = await metadataFile.async("string");
          const metadata: StoryMetadata = JSON.parse(metadataText);

          let thumbnailUrl = "/placeholder.png";
          const thumbFile = zip.file("thumbnail.png");
          if (thumbFile) {
            const thumbBytes = await thumbFile.async("uint8array");
            if (thumbBytes.length > 0) {
              const blob = new Blob([thumbBytes as BufferSource], { type: "image/png" });
              thumbnailUrl = URL.createObjectURL(blob);
            }
          }

          previews.push({
            id: storyName,
            name: metadata.name,
            description: metadata.description,
            thumbnailUrl,
          });
        } catch (e) {
          console.warn(`Could not read story from ${file.name}:`, e);
        }
      }
    }
  } catch (e) {
    console.error("Error reading stories directory:", e);
  }

  return previews;
};

// ============================================
// Legacy compatibility
// ============================================

export const ensureStoryFolder = async (_folderName: string) => {
  await ensureStoriesDir();
};

export const getAllAvailableStories = async (): Promise<string[]> => {
  await ensureStoriesDir();
  try {
    const files = await readDir("stories", { baseDir: BaseDirectory.AppData });
    return files
      .filter(file => file.name?.endsWith(".zip"))
      .map(file => file.name!.replace(".zip", ""));
  } catch (e) {
    console.error("Error reading stories:", e);
    return [];
  }
};

// ============================================
// Image URL Helpers
// ============================================

export const bytesToUrl = (bytes: Uint8Array | number[] | null | undefined): string => {
  if (!bytes) return "/placeholder.png";
  const u8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  if (u8.length === 0) return "/placeholder.png";

  let binary = "";
  for (let i = 0; i < u8.length; i++) {
    binary += String.fromCharCode(u8[i]);
  }
  const base64 = typeof btoa === "function" ? btoa(binary) : "";
  return base64 ? `data:image/png;base64,${base64}` : "/placeholder.png"
};
