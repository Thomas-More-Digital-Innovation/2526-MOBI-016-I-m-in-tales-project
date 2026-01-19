
export type PositionalNode = {
  x: number;
  y: number;
};
// Clamping limiting zooming in/out
export const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);
// depending on the position of our destination (top left top right bottom left bottom right) we change the arrow to point FROM a particular point on the container
// We do the same for the destination container.
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
