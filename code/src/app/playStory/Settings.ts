import { StorySettings, FontSize } from "@/types";

export let storySettings: StorySettings = {
  fontSize: "normale tekst",
  volume: 0.5,
  showStoryOptions: false,
};

export let fontSize: Record<FontSize, number> = {
  "kleine tekst": 20,
  "normale tekst": 26,
  "grote tekst": 32,
  "extra grote tekst": 36,
};

export function getFontSize(_fontSize: FontSize) {
  return fontSize[_fontSize];
}