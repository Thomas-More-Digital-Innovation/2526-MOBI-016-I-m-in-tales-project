export interface StorySettings {
    fontSize: FontSize;
    volume: number;
}

export type FontSize =
    | "kleine tekst"
    | "normale tekst"
    | "grote tekst"
    | "extra grote tekst";
