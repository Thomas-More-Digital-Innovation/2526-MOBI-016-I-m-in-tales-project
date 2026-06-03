export interface StorySettings {
    fontSize: FontSize;
    volume: number;
    showStoryOptions: boolean;
}

export type FontSize =
    | "kleine tekst"
    | "normale tekst"
    | "grote tekst"
    | "extra grote tekst";
