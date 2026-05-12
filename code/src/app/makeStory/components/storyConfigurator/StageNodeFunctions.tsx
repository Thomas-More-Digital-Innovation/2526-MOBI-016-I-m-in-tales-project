
export type PositionalNode = {
  x: number;
  y: number;
};
// Clamping limiting zooming in/out
export const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);
// depending on the position of our destination (top left top right bottom left bottom right) we change the arrow to point FROM a particular point on the chapter
// We do the same for the destination chapter.
export const getEdgePoints = (from: PositionalNode, to: PositionalNode) => {
  const NODE_W = 150;
  const NODE_H = 150;

  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const goSideways = Math.abs(dx) >= Math.abs(dy);

  const sourcePoint = goSideways
    ? [from.x + (dx >= 0 ? NODE_W : 0), from.y + NODE_H / 2]
    : [from.x + NODE_W / 2, from.y + (dy >= 0 ? NODE_H : 0)];

  const destPoint = goSideways
    ? [to.x + (dx >= 0 ? 0 : NODE_W), to.y + NODE_H / 2]
    : [to.x + NODE_W / 2, to.y + (dy >= 0 ? 0 : NODE_H)];

  return [...sourcePoint, ...destPoint];
};
