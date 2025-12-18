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
  linked_to: string;
}

export interface StoriesData {
  story: Story[];
  item: Item[];
}
