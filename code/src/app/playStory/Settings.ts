import { StorySettings, FontSize } from "@/types";

export const MIN_FONT_SIZE = 20;
export const MAX_FONT_SIZE = 38;
export const DEFAULT_FONT_SIZE = 26;
export const FONT_PRESET_COUNT = 4;

const STORAGE_KEY = "story_settings";

export function getFontSizePresets(
  min = MIN_FONT_SIZE,
  max = MAX_FONT_SIZE,
  count = FONT_PRESET_COUNT
): number[] {
  const step = (max - min) / (count - 1);
  return Array.from({ length: count }, (_, i) => Math.round(min + i * step));
}

const defaultStorySettings: StorySettings = {
  fontSize: DEFAULT_FONT_SIZE,
  volume: 0.5,
  showStoryOptions: false,
  showTitle: true,
  showDescription: true,
};

export function loadStorySettings(): StorySettings {
  if (typeof window === "undefined") {
    return { ...defaultStorySettings };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultStorySettings };

    const parsed = JSON.parse(raw);
    const parsedFontSize = Number(parsed.fontSize);

    return {
      ...defaultStorySettings,
      ...parsed,
      fontSize: Number.isFinite(parsedFontSize)
        ? Math.min(Math.max(parsedFontSize, MIN_FONT_SIZE), MAX_FONT_SIZE)
        : DEFAULT_FONT_SIZE,
    };
  } catch {
    return { ...defaultStorySettings };
  }
}

export function saveStorySettings(settings: StorySettings): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // ignore storage write errors
  }
}

export let storySettings: StorySettings = loadStorySettings();

export function getFontSize(_fontSize: FontSize): number {
  return typeof _fontSize === "number" ? _fontSize : DEFAULT_FONT_SIZE;
}