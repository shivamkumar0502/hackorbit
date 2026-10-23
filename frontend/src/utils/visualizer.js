export const ALGORITHMS = {
  bubble: { title: 'Bubble Sort', category: 'Sorting', time: 'O(n²)', space: 'O(1)', code: ['for each pass:', '  compare adjacent values', '  swap if left > right', '  mark the last value sorted'] },
  insertion: { title: 'Insertion Sort', category: 'Sorting', time: 'O(n²)', space: 'O(1)', code: ['for each value after the first:', '  save the current key', '  shift larger values right', '  insert the key in its position'] },
  selection: { title: 'Selection Sort', category: 'Sorting', time: 'O(n²)', space: 'O(1)', code: ['for each unsorted position:', '  find the smallest remaining value', '  swap it into the current position', '  mark this position sorted'] },
  linear: { title: 'Linear Search', category: 'Searching', time: 'O(n)', space: 'O(1)', code: ['for each index:', '  compare value with target', '  if equal: return index', 'return not found'] },
  binary: { title: 'Binary Search', category: 'Searching', time: 'O(log n) search', space: 'O(1) search', code: ['start with a sorted array and bounds', 'mid = floor((left + right) / 2)', 'if value == target: return mid', 'shrink bounds toward the target'] },
  bfs: { title: 'Breadth-First Search', category: 'Graphs', time: 'O(V + E)', space: 'O(V)', code: ['put the start node in a queue', 'remove the front node and visit it', 'enqueue its undiscovered neighbors', 'repeat until the queue is empty'] },
  dfs: { title: 'Depth-First Search', category: 'Graphs', time: 'O(V + E)', space: 'O(V)', code: ['put the start node on a stack', 'pop a node and visit it', 'push its undiscovered neighbors', 'repeat until the stack is empty'] },
};
export function parseArray(text) {
  const parts = text.trim().split(/[\s,]+/).filter(Boolean);
  if (!parts.length || parts.length > 18 || parts.some(value => !/^-?\d+$/.test(value) || Math.abs(Number(value)) > 999)) throw new Error('Enter 1–18 integers from −999 to 999, separated by commas.');
  return parts.map(Number);
}
export function parseGraph(text, start) {
  const pairs = text.split(',').map(value => value.trim()).filter(Boolean);
  if (!pairs.length || pairs.length > 24 || pairs.some(pair => !/^[0-7]\s*-\s*[0-7]$/.test(pair))) throw new Error('Use edges such as 0-1, 0-2. Node numbers must be 0–7; maximum 24 edges.');
  const edges = [...new Map(pairs.map(pair => { const edge = pair.split('-').map(value => Number(value.trim())).sort((a, b) => a - b); if (edge[0] === edge[1]) throw new Error('Connect two different nodes for each edge.'); return [edge.join('-'), edge]; })).values()];
  const nodes = [...new Set(edges.flat())].sort((a, b) => a - b);
  if (!nodes.includes(Number(start))) throw new Error('The start node must appear in your graph.');
  return { nodes, edges };
}
export function arrayFrames(algorithm, source, target = 0) {
  if (!['bubble', 'insertion', 'selection', 'linear', 'binary'].includes(algorithm)) throw new Error('Unknown array algorithm.');
  const values = algorithm === 'binary' ? [...source].sort((a, b) => a - b) : [...source];
  const frames = []; let comparisons = 0, updates = 0;
  const push = (message, active = [], sorted = [], line = 0, extra = {}) => frames.push({ values: [...values], message, active: [...active], sorted: [...sorted], comparisons, updates, line, ...extra });
  push(algorithm === 'binary' ? 'A sorted working copy is prepared. Search indices refer to this sorted copy.' : 'Ready. Step through the algorithm or press Play.');
  if (algorithm === 'linear' || algorithm === 'binary') {
    let found = -1;
    if (algorithm === 'linear') {
      for (let i = 0; i < values.length; i++) { comparisons++; push(`Compare ${values[i]} with target ${target}.`, [i], [], 1); if (values[i] === target) { found = i; break; } }
    } else {
      let left = 0, right = values.length - 1;
      while (left <= right) {
        const mid = Math.floor((left + right) / 2); comparisons++;
        push(`Bounds [${left}, ${right}]. Compare middle value ${values[mid]} with ${target}.`, [mid], [], 1, { left, right });
        if (values[mid] === target) { found = mid; break; }
        if (values[mid] < target) left = mid + 1; else right = mid - 1;
        push(`Narrow the range to [${left}, ${right}].`, [], [], 3, { left, right });
      }
    }
    push(found < 0 ? `${target} was not found.` : `Found ${target} at index ${found}.`, found < 0 ? [] : [found], [], found < 0 ? 3 : 2, { done: true, found });
    return frames;
  }
  if (algorithm === 'bubble') {
    for (let end = values.length - 1; end > 0; end--) {
      let changed = false;
      for (let i = 0; i < end; i++) { comparisons++; push(`Compare adjacent values ${values[i]} and ${values[i + 1]}.`, [i, i + 1], values.map((_, j) => j).filter(j => j > end), 1); if (values[i] > values[i + 1]) { [values[i], values[i + 1]] = [values[i + 1], values[i]]; updates++; changed = true; push('Swap the pair into ascending order.', [i, i + 1], [], 2); } }
      push(`Position ${end} is now sorted.`, [], values.map((_, j) => j).filter(j => j >= end), 3);
      if (!changed) break;
    }
  } else if (algorithm === 'selection') {
    for (let i = 0; i < values.length - 1; i++) {
      let min = i;
      for (let j = i + 1; j < values.length; j++) { comparisons++; push(`Compare candidate ${values[j]} with current minimum ${values[min]}.`, [min, j], Array.from({ length: i }, (_, k) => k), 1); if (values[j] < values[min]) min = j; }
      if (min !== i) { [values[i], values[min]] = [values[min], values[i]]; updates++; }
      push(`Place the minimum at index ${i}.`, [i], Array.from({ length: i + 1 }, (_, k) => k), 2);
    }
  } else {
    for (let i = 1; i < values.length; i++) {
      const key = values[i]; let j = i - 1;
      push(`Hold key ${key} from index ${i}.`, [i], [], 1, { key });
      while (j >= 0) {
        comparisons++; push(`Compare ${values[j]} with key ${key}.`, [j], [], 2, { key });
        if (values[j] <= key) break;
        values[j + 1] = values[j]; updates++; push(`Shift ${values[j]} one position to the right.`, [j, j + 1], [], 2, { key }); j--;
      }
      values[j + 1] = key; updates++;
      push(`Insert key ${key} at index ${j + 1}.`, [j + 1], Array.from({ length: i + 1 }, (_, k) => k), 3);
    }
  }
  push('Complete. Every value is in ascending order.', [], values.map((_, index) => index), 3, { done: true });
  return frames;
}
export function graphFrames(algorithm, graph, start) {
  if (!['bfs', 'dfs'].includes(algorithm)) throw new Error('Unknown graph algorithm.');
  const adjacency = Object.fromEntries(graph.nodes.map(node => [node, []]));
  graph.edges.forEach(([a, b]) => { adjacency[a].push(b); adjacency[b].push(a); });
  Object.values(adjacency).forEach(neighbors => neighbors.sort((a, b) => a - b));
  const frontier = [Number(start)], discovered = new Set(frontier), visited = [], frames = [];
  const push = (message, active = null, line = 0, done = false) => frames.push({ message, active, line, done, frontier: [...frontier], visited: [...visited], graph });
  push(`Start at node ${start}. This graph is undirected.`);
  while (frontier.length) {
    const node = algorithm === 'bfs' ? frontier.shift() : frontier.pop(); visited.push(node);
    push(`Visit node ${node}.`, node, 1);
    const neighbors = algorithm === 'bfs' ? adjacency[node] : [...adjacency[node]].reverse();
    for (const neighbor of neighbors) if (!discovered.has(neighbor)) { discovered.add(neighbor); frontier.push(neighbor); }
    push(`Add undiscovered neighbors of ${node} to the ${algorithm === 'bfs' ? 'queue' : 'stack'}.`, node, 2);
  }
  push(`Complete. Reached ${visited.length} of ${graph.nodes.length} nodes. Order: ${visited.join(' → ')}.`, null, 3, true);
  return frames;
}
