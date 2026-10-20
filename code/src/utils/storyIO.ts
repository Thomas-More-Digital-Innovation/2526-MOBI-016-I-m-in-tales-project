import {
  writeFile,
  readFile,
  BaseDirectory,
  exists,
  mkdir,
  readDir,
  remove,
} from "@tauri-apps/plugin-fs";
import { join } from "@tauri-apps/api/path";
import JSZip from "jszip";
import { downscaleImageBytes } from "../app/makeStory/components/storyConfigurator/StageNodeFunctions";
import { detectLocale, i18nObject } from "@/i18n/i18n-util";
import { loadLocale } from "@/i18n/i18n-util.sync";
import { localStorageDetector } from "typesafe-i18n/detectors";

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
  autoAdvance?: boolean;
  x?: number;
  y?: number;
  options?: OptionMetadata[];
}

export interface OptionMetadata {
  nextChapter: string;
  item: string | null;
}

export interface ItemMetadata {
  itemId: string;
  linkedTo: string;
  label?: string;
}

export interface StoryData {
  story: {
    id: string;
    name: string;
    description: string;
    thumbnail?: Uint8Array | number[] | null;
    chapter?: ChapterData[];
  };
  items?: ItemData[];
}

export interface ChapterData {
  id: string;
  title: string;
  description: string;
  image?: Uint8Array | number[] | null;
  audio?: Uint8Array | number[] | null;
  failAudio?: Uint8Array | number[] | null;
  autoAdvance?: boolean;
  x?: number;
  y?: number;
  option?: OptionData[];
}

export interface OptionData {
  nextChapter: string;
  audio?: Uint8Array | number[] | null;
  item: string | null;
}

export interface ItemData {
  itemId: string;
  linkedTo: string;
  label?: string;
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

const getTranslations = () => {
  const currentLocale = detectLocale(localStorageDetector);
  loadLocale(currentLocale);
  return i18nObject(currentLocale);
};

export const sanitizeStoryName = (name: string): string => {
  if (!name) return `story_${Date.now()}`;

  let sanitized = name
    .trim()
    .toLowerCase()
    .replace(/\.zip$/i, "")
    .replace(/[\x00-\x1f\x7f]/g, "")
    .replace(/[/\\]/g, "")
    .replace(/[<>:"|?*~#&{}]/g, "")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_");

  while (sanitized.includes("..")) {
    sanitized = sanitized.replace(/\.\./g, "");
  }

  sanitized = sanitized.replace(/^[.\s_]+|[.\s_]+$/g, "").trim();

  // prevent collision with windows device names
  const isWindowsReserved = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(\..*)?$/i.test(sanitized);
  if (isWindowsReserved) {
    sanitized = `story_${sanitized}`;
  }

  if (
    !sanitized ||
    sanitized.includes("/") ||
    sanitized.includes("\\") ||
    sanitized.includes("..")
  ) {
    return `story_${Date.now()}`;
  }

  return sanitized.slice(0, 100);
};

export const normalizeStoryName = (name: string): string => {
  const sanitized = sanitizeStoryName(name);
  const cleaned = name
    .trim()
    .toLowerCase()
    .replace(/[/\\?%*:|"<>~#&{}\x00-\x1f\x7f-\x9f]/g, "")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^[\._]+|[\._]+$/g, "");
  if (!cleaned) return "";
  return sanitized;
};

export const getStoryZipPath = async (storyName: string): Promise<string> => {
  const safeName = sanitizeStoryName(storyName);
  return join("stories", `${safeName}.zip`);
};

export const storyExists = async (slug: string): Promise<boolean> => {
  try {
    const zipPath = await getStoryZipPath(slug);
    return await exists(zipPath, { baseDir: BaseDirectory.AppData });
  } catch {
    return false;
  }
};

export const renameStory = async (
  oldSlug: string,
  newSlug: string,
  updates?: { name?: string; description?: string; thumbnail?: Uint8Array | null }
): Promise<void> => {
  await ensureStoriesDir();
  let oldZipPath = await getStoryZipPath(oldSlug);
  if (!(await exists(oldZipPath, { baseDir: BaseDirectory.AppData }))) {
    const rawOldPath = await join("stories", `${oldSlug}.zip`);
    if (await exists(rawOldPath, { baseDir: BaseDirectory.AppData })) {
      oldZipPath = rawOldPath;
    }
  }

  const oldZipContent = await readFile(oldZipPath, { baseDir: BaseDirectory.AppData });
  const zip = await JSZip.loadAsync(oldZipContent);

  const metadataFile = zip.file("metadata.json");
  if (!metadataFile) throw new Error(`No metadata.json found in story zip: ${oldSlug}`);
  const metadataText = await metadataFile.async("string");
  const metadata: StoryMetadata = JSON.parse(metadataText);

  if (updates?.name !== undefined) metadata.name = updates.name;
  if (updates?.description !== undefined) metadata.description = updates.description;
  zip.file("metadata.json", JSON.stringify(metadata, null, 2));

  if (updates?.thumbnail !== undefined) {
    if (updates.thumbnail && updates.thumbnail.length > 0) {
      const downscaledThumb = await downscaleImageBytes(updates.thumbnail, 1920, 1080);
      zip.file("thumbnail.png", downscaledThumb);
    } else {
      zip.remove("thumbnail.png");
    }
  }

  const safeNewSlug = sanitizeStoryName(newSlug);
  const safeOldSlug = sanitizeStoryName(oldSlug);
  const newZipContent = await zip.generateAsync({ type: "uint8array" });
  const newZipPath = await getStoryZipPath(safeNewSlug);
  await writeFile(newZipPath, newZipContent, { baseDir: BaseDirectory.AppData });

  if (safeOldSlug !== safeNewSlug || oldZipPath !== newZipPath) {
    await remove(oldZipPath, { baseDir: BaseDirectory.AppData });
  }
};

// ============================================
// Save Story (Create Zip)
// ============================================

export const saveStoryData = async (storyName: string, data: StoryData): Promise<void> => {
  await ensureStoriesDir();

  const slug = normalizeStoryName(storyName) || storyName;
  const zip = new JSZip();

  const metadata: StoryMetadata = {
    id: data.story.id,
    name: data.story.name,
    description: data.story.description,
    chapters: data.story.chapter?.map((ch) => ({
      id: ch.id,
      title: ch.title,
      description: ch.description,
      autoAdvance: ch.autoAdvance ?? false,
      x: ch.x,
      y: ch.y,
      options: ch.option?.map((opt) => ({
        nextChapter: opt.nextChapter,
        item: opt.item,
      })),
    })),
    items: data.items,
  };

  zip.file("metadata.json", JSON.stringify(metadata, null, 2));

  const thumbBytes = toUint8Array(data.story.thumbnail);
  if (thumbBytes && thumbBytes.length > 0) {
    const downscaledThumb = await downscaleImageBytes(thumbBytes, 1920, 1080);
    zip.file("thumbnail.jpeg", downscaledThumb);
  }

  if (data.story.chapter) {
    const imagesFolder = zip.folder("images");
    const audioFolder = zip.folder("audio");

    for (const chapter of data.story.chapter) {
      const imgBytes = toUint8Array(chapter.image);
      if (imgBytes && imgBytes.length > 0) {
        const downscaledImg = await downscaleImageBytes(imgBytes, 1920, 1080);
        imagesFolder?.file(`${chapter.id}.jpeg`, downscaledImg);
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
  const zipPath = await getStoryZipPath(slug);
  await writeFile(zipPath, zipContent, { baseDir: BaseDirectory.AppData });
};

// ============================================
// Load Story (Extract Zip)
// ============================================

export const loadStoryData = async (storyName: string): Promise<StoryData> => {
  let zipPath = await getStoryZipPath(storyName);
  const zipExists = await exists(zipPath, { baseDir: BaseDirectory.AppData });
  if (!zipExists) {
    const rawPath = await join("stories", `${storyName}.zip`);
    if (await exists(rawPath, { baseDir: BaseDirectory.AppData })) {
      zipPath = rawPath;
    }
  }

  const zipContent = await readFile(zipPath, { baseDir: BaseDirectory.AppData });

  const zip = await JSZip.loadAsync(zipContent);

  const metadataFile = zip.file("metadata.json");
  if (!metadataFile) throw new Error(`No metadata.json found in story zip: ${storyName}`);
  const metadataText = await metadataFile.async("string");
  const metadata: StoryMetadata = JSON.parse(metadataText);

  let thumbnail: Uint8Array | null = null;
  const thumbFile = zip.file("thumbnail.jpeg");
  if (thumbFile) {
    thumbnail = await thumbFile.async("uint8array");
  }

  const chapters: ChapterData[] = await Promise.all(
    (metadata.chapters || []).map(async (ch) => {
      let image: Uint8Array | null = null;
      let audio: Uint8Array | null = null;

      const imgFile = zip.file(`images/${ch.id}.jpeg`);
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
        autoAdvance: ch.autoAdvance ?? false,
        x: ch.x,
        y: ch.y,
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
    items: metadata.items || [],
  };
};

// ============================================
// Get Story Previews (Fast Overview)
// ============================================

export interface StoryPreview {
  id: string; // filename
  internalId: string; // internal UUID
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

          let thumbnailUrl = "/placeholder.jpeg";
          const thumbFile = zip.file("thumbnail.jpeg");
          if (thumbFile) {
            const thumbBytes = await thumbFile.async("uint8array");
            if (thumbBytes.length > 0) {
              thumbnailUrl = bytesToUrl(thumbBytes, "image/jpeg");
            }
          }

          previews.push({
            id: storyName,
            internalId: metadata.id,
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
      .filter((file) => file.name?.endsWith(".zip"))
      .map((file) => file.name!.replace(".zip", ""));
  } catch (e) {
    console.error("Error reading stories:", e);
    return [];
  }
};

// ============================================
// Export / Import Story
// ============================================

export const deleteStory = async (storyId: string): Promise<void> => {
  await removeStoryData(storyId);
};

export const exportStory = async (storyId: string): Promise<void> => {
  const safeName = sanitizeStoryName(storyId);
  const { save } = await import("@tauri-apps/plugin-dialog");
  const savePath = await save({
    defaultPath: `${safeName}.zip`,
    filters: [{ name: "Story", extensions: ["zip"] }],
  });
  if (!savePath) return;

  let zipPath = await getStoryZipPath(safeName);
  const zipExists = await exists(zipPath, { baseDir: BaseDirectory.AppData });
  if (!zipExists) {
    const rawPath = await join("stories", `${storyId}.zip`);
    if (await exists(rawPath, { baseDir: BaseDirectory.AppData })) {
      zipPath = rawPath;
    }
  }

  const zipContent = await readFile(zipPath, { baseDir: BaseDirectory.AppData });
  await writeFile(savePath, zipContent);
};

export interface ImportStoryOptions {
  confirmOverwrite?: (storyName: string) => Promise<boolean>;
}

export const importStory = async (options?: ImportStoryOptions): Promise<string | null> => {
  const { open, ask, message } = await import("@tauri-apps/plugin-dialog");
  const filePath = await open({
    multiple: false,
    filters: [{ name: "Story", extensions: ["zip"] }],
  });
  if (!filePath || Array.isArray(filePath)) return null;

  const zipContent = await readFile(filePath as string);
  const zip = await JSZip.loadAsync(zipContent);

  const metadataFile = zip.file("metadata.json");
  if (!metadataFile) throw new Error("Invalid story file: no metadata.json");
  const metadataText = await metadataFile.async("string");
  const metadata: StoryMetadata = JSON.parse(metadataText);

  await ensureStoriesDir();
  const slug = normalizeStoryName(metadata.name);
  if (!slug) {
    const LL = getTranslations();
    await message(LL.STORY_INVALID_NAME_MSG(), {
      title: LL.STORY_INVALID_NAME_TITLE(),
      kind: "error",
    });
    return null;
  }

  const destPath = await getStoryZipPath(slug);
  const fileExists = await exists(destPath, { baseDir: BaseDirectory.AppData });
  if (fileExists) {
    let proceed: boolean;
    if (options?.confirmOverwrite) {
      proceed = await options.confirmOverwrite(metadata.name);
    } else {
      const LL = getTranslations();
      proceed = await ask(LL.IMPORT_OVERWRITE_CONFIRM({ name: metadata.name }), {
        title: LL.IMPORT_OVERWRITE_TITLE(),
        kind: "warning",
      });
    }
    if (!proceed) return null;
  }

  await writeFile(destPath, zipContent, { baseDir: BaseDirectory.AppData });

  return slug;
};

// ============================================
// Image URL Helpers
// ============================================

export const bytesToUrl = (
  bytes: Uint8Array | number[] | null | undefined,
  mimeType: string
): string => {
  if (!bytes) return "/placeholder.jpeg";
  const u8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  if (u8.length === 0) return "/placeholder.jpeg";

  let binary = "";
  for (let i = 0; i < u8.length; i++) {
    binary += String.fromCharCode(u8[i]);
  }
  const base64 = typeof btoa === "function" ? btoa(binary) : "";
  return base64 ? `data:${mimeType};base64,${base64}` : "/placeholder.jpeg"
};

// ============================================
// Delete Story
// ============================================

export const removeStoryData = async (storyName: string): Promise<void> => {
  const zipPath = await getStoryZipPath(storyName);
  const fileExists = await exists(zipPath, { baseDir: BaseDirectory.AppData });
  if (fileExists) {
    await remove(zipPath, { baseDir: BaseDirectory.AppData });
    return;
  }
  const rawPath = await join("stories", `${storyName}.zip`);
  if (await exists(rawPath, { baseDir: BaseDirectory.AppData })) {
    await remove(rawPath, { baseDir: BaseDirectory.AppData });
  }
};
