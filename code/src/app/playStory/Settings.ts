import { StorySettings, FontSize } from "@/types";

export let storySettings: StorySettings = {
    fontSize: "normale tekst",
    volume: 0.5,
};

export let fontSize: Record<FontSize, number> = {
    "kleine tekst": 14,
    "normale tekst": 20,
    "grote tekst": 24,
    "extra grote tekst": 28,
};
