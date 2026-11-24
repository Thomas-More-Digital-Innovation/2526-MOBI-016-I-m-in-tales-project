export type FontSize = number;

export interface StorySettings {
    fontSize: FontSize;
    volume: number;
    showStoryOptions: boolean;
    showTitle: boolean;
    showDescription: boolean;
    /** Play every object cell's sound right after the chapter audio. */
    autoPlayObjectSounds: boolean;
}
