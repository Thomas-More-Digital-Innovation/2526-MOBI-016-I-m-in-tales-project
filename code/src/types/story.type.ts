export interface Option {
  nextChapter: string;
  audio: string;
  item: string | null;
  itemLabel?: string;
  /** Object cell shown during the chapter (one per link). */
  objectImage?: string;
  objectSound?: string | null;
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  audio: string;
  image: string;
  /** Set = text chapter: shown instead of the image. */
  text?: string;
  failAudio: string | null;
  autoAdvance?: boolean;
  x?: number;
  y?: number;
  option: Option[];
}

export interface Story {
  id: string;
  name: string;
  description: string;
  image: string;
  chapter: Chapter[];
}

export interface Item {
  item_id: string;
  linkedTo: string;
  label?: string;
}

export interface StoriesData {
  story: Story[];
  item: Item[];
}

export interface TagMatch {
  storyName: string;
  label: string;
}