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

export function getFontSize(_fontSize: FontSize) {
    return fontSize[_fontSize];
}