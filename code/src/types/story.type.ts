export interface Option {
  nextChapter: string;
  audio: string;
  item: string | null;
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  audio: string;
  image: string;
  failAudio: string | null;
  autoAdvance?: boolean;
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