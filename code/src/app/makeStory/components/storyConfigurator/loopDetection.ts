import { ChapterNode } from "./useStoryState";

export interface InescapableLoopResult {
  trappedNodeIds: Set<string>;
  trappedEdgeKeys: Set<string>;
}

export function detectInescapableLoops(nodes: ChapterNode[]): InescapableLoopResult {
  const trappedNodeIds = new Set<string>();
  const trappedEdgeKeys = new Set<string>();

  if (!nodes || nodes.length === 0) {
    return { trappedNodeIds, trappedEdgeKeys };
  }

  const nodeMap = new Map<string, ChapterNode>();
  for (const node of nodes) {
    nodeMap.set(node.id, node);
  }

  const adj = new Map<string, string[]>();
  const revAdj = new Map<string, string[]>();

  for (const node of nodes) {
    adj.set(node.id, []);
    revAdj.set(node.id, []);
  }

  for (const node of nodes) {
    for (const link of node.links) {
      if (nodeMap.has(link.targetId)) {
        adj.get(node.id)!.push(link.targetId);
        revAdj.get(link.targetId)!.push(node.id);
      }
    }
  }

  const terminalNodes: string[] = [];
  for (const node of nodes) {
    if (adj.get(node.id)!.length === 0) {
      terminalNodes.push(node.id);
    }
  }

  const canReachTerminal = new Set<string>();
  const queue: string[] = [...terminalNodes];
  for (const id of terminalNodes) {
    canReachTerminal.add(id);
  }

  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const predecessor of revAdj.get(current) || []) {
      if (!canReachTerminal.has(predecessor)) {
        canReachTerminal.add(predecessor);
        queue.push(predecessor);
      }
    }
  }

  const candidateIds = new Set(nodes.filter((n) => !canReachTerminal.has(n.id)).map((n) => n.id));

  if (candidateIds.size === 0) {
    return { trappedNodeIds, trappedEdgeKeys };
  }

  for (const u of candidateIds) {
    for (const v of adj.get(u) || []) {
      if (!candidateIds.has(v)) continue;

      if (isReachable(v, u, adj, candidateIds)) {
        trappedEdgeKeys.add(`${u}->${v}`);
        trappedNodeIds.add(u);
        trappedNodeIds.add(v);
      }
    }
  }

  return { trappedNodeIds, trappedEdgeKeys };
}

function isReachable(
  startId: string,
  targetId: string,
  adj: Map<string, string[]>,
  allowedNodes: Set<string>
): boolean {
  if (startId === targetId) return true;
  const visited = new Set<string>([startId]);
  const queue = [startId];

  while (queue.length > 0) {
    const curr = queue.shift()!;
    for (const next of adj.get(curr) || []) {
      if (!allowedNodes.has(next)) continue;
      if (next === targetId) return true;
      if (!visited.has(next)) {
        visited.add(next);
        queue.push(next);
      }
    }
  }

  return false;
}
