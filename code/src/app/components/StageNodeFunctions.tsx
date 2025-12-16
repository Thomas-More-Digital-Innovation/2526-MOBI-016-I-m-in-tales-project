import { join } from "@tauri-apps/api/path";
import { BaseDirectory, writeTextFile } from "@tauri-apps/plugin-fs";

export type PositionalNode = {
  x: number;
  y: number;
};

export const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

export const getEdgePoints = (from: PositionalNode, to: PositionalNode) => {
  const NODE_W = 150;
  const NODE_H = 150;

  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const goSideways = Math.abs(dx) >= Math.abs(dy);

  const sourcePoint = goSideways
    ? [dx >= 0 ? NODE_W : 0, NODE_H / 2]
    : [NODE_W / 2, dy >= 0 ? NODE_H : 0];

  const destPoint = goSideways
    ? [dx >= 0 ? dx : dx + NODE_W, dy + NODE_H / 2]
    : [dx + NODE_W / 2, dy >= 0 ? dy : dy + NODE_H];

  return [...sourcePoint, ...destPoint];
};

export const persistStory = async (jsonData: unknown, folderName: string) => {
  const storyFilePath = await join(folderName, "StoryData.json");
  await writeTextFile(storyFilePath, JSON.stringify(jsonData), {
    baseDir: BaseDirectory.AppData
  });
};
