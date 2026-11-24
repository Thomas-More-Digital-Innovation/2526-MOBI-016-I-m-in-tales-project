import { ChapterNode } from "./useStoryState";

export interface InescapableLoopResult {
  trappedNodeIds: Set<string>;
  trappedEdgeKeys: Set<string>;
}

/**
 * Finds cycles made only of auto-advance chapters: once entered, the story plays forever with no tag
 * able to stop it. Loops that pass through a tag-driven chapter (e.g. endings that link back to the
 * start so a tag restarts the story) are intentional and not reported.
 */
export function detectInescapableLoops(nodes: ChapterNode[]): InescapableLoopResult {
  const trappedNodeIds = new Set<string>();
  const trappedEdgeKeys = new Set<string>();
  const byId = new Map(nodes.map((n) => [n.id, n]));
  // Auto-advance follows its single link without user input
  const next = (n: ChapterNode | undefined) =>
    n?.autoAdvance && n.links.length === 1 ? byId.get(n.links[0].targetId) : undefined;

  for (const start of nodes) {
    // Walk the auto-advance chain from each node; revisiting a chain node means a cycle
    const chain: ChapterNode[] = [];
    let cur: ChapterNode | undefined = start;
    while (cur && !chain.includes(cur)) {
      chain.push(cur);
      cur = next(cur);
    }
    if (!cur) continue;
    for (const n of chain.slice(chain.indexOf(cur))) {
      trappedNodeIds.add(n.id);
      trappedEdgeKeys.add(`${n.id}->${n.links[0].targetId}`);
    }
  }

  return { trappedNodeIds, trappedEdgeKeys };
}
