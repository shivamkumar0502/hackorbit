const { createHash } = require('node:crypto');
const dayKey = date => new Date(+new Date(date) + 19800000).toISOString().slice(0,10);
const dayStart = day => new Date(`${day}T00:00:00+05:30`);
function chooseDaily(problems, day) {
  if (!problems.length) return null;
  const sorted = [...problems].sort((a,b) => String(a._id).localeCompare(String(b._id)));
  return sorted[createHash('sha256').update(day).digest().readUInt32BE(0) % sorted.length];
}
function streaks(days, today) {
  const sorted = [...new Set(days)].sort(); let longest = 0, run = 0;
  sorted.forEach((day,i) => { run = i && +dayStart(day) - +dayStart(sorted[i-1]) === 86400000 ? run+1 : 1; longest = Math.max(longest,run); });
  const completed = new Set(sorted); let cursor = +dayStart(today), current = 0;
  if (!completed.has(today)) cursor -= 86400000;
  while (completed.has(dayKey(new Date(cursor)))) { current++; cursor -= 86400000; }
  return { current, longest, completedDays: sorted.length };
}
const units = [
  { id: 'arrays', title: 'Arrays & two pointers', tags: ['array'], match: /array|two sum|two pointer|sliding window/i, concept: 'Use indices to track a window or two ends of a sequence. State the invariant before moving either pointer.', checklist: ['Trace indices on a small array.', 'Handle empty input and duplicates.', 'Compare a nested loop with a linear scan.'], visualizer: 'linear' },
  { id: 'search', title: 'Searching & sorting', tags: [], match: /search|sort|binary/i, concept: 'Binary search needs a monotonic decision on sorted data. Sorting can reveal useful order, but include its cost.', checklist: ['Write the search interval convention.', 'Prove that every update shrinks the interval.', 'Compare stable and unstable sorting.'], visualizer: 'binary' },
  { id: 'strings', title: 'Strings & hash maps', tags: ['string','hash'], match: /string|anagram|substring|character|hash/i, concept: 'Use a frequency map to summarize a prefix or window. Define exactly what the map counts.', checklist: ['Consider repeated characters.', 'Discuss character encoding assumptions.', 'State the extra-space bound.'] },
  { id: 'linked', title: 'Linked lists', tags: ['linkedList'], match: /linked|list cycle|reverse list/i, concept: 'Save the next pointer before changing a link. Slow and fast pointers can reveal cycles without extra storage.', checklist: ['Draw the pointer changes.', 'Test an empty and single-node list.', 'Explain head replacement.'] },
  { id: 'stacks', title: 'Stacks & queues', tags: ['stack','queue'], match: /stack|queue|parenthes|next greater/i, concept: 'Stacks keep the most recent unfinished work; queues preserve arrival order. A monotonic stack discards candidates that can never be useful again.', checklist: ['Define what each stored item means.', 'Check empty removal.', 'Explain amortized pushes and pops.'], visualizer: 'bfs' },
  { id: 'trees', title: 'Trees & recursion', tags: ['tree','bst'], match: /tree|bst|traversal/i, concept: 'Define what a recursive call returns for one subtree, then combine the children. Always state the empty-tree base case.', checklist: ['Trace a leaf and a skewed tree.', 'Account for recursion-stack space.', 'Choose preorder, inorder or postorder deliberately.'] },
  { id: 'graphs', title: 'Graphs & traversal', tags: ['graph'], match: /graph|path|island|bfs|dfs/i, concept: 'Model vertices and edges first. Mark discovery consistently so cycles do not create repeated work.', checklist: ['Test disconnected components.', 'Distinguish BFS shortest paths from DFS exploration.', 'Count vertices and edges in the complexity.'], visualizer: 'dfs' },
  { id: 'dp', title: 'Dynamic programming', tags: ['dp'], match: /dynamic|knapsack|subsequence|coin change|climbing/i, concept: 'Define a state in a sentence. Derive a recurrence, initial states and a computation order before writing the table.', checklist: ['Explain overlapping subproblems.', 'Validate the base cases by hand.', 'Optimize space only after the recurrence works.'] },
];
const unitProblems = (unit, problems) => problems.filter(p => (Array.isArray(p.tags) ? p.tags : [p.tags]).some(tag => unit.tags.includes(tag)) || unit.match.test(p.title));
function leaderboard(event, entries, submissions, now = new Date()) {
  const cutoff = Math.min(+now,+event.endsAt);
  const rows = entries.map(entry => {
    const eligible = submissions.filter(s => String(s.userId) === String(entry.userId) && +new Date(s.createdAt) >= Math.max(+event.startsAt,+entry.joinedAt) && +new Date(s.createdAt) <= cutoff);
    let score = 0, penalty = 0, solved = 0;
    for (const problem of event.problems) {
      const attempts = eligible.filter(s => String(s.problemId) === String(problem.problemId)).sort((a,b) => +new Date(a.createdAt)-+new Date(b.createdAt));
      const first = attempts.find(s => s.status === 'accepted');
      if (first) { solved++; score += problem.points; penalty += Math.floor((+new Date(first.createdAt)-+event.startsAt)/60000) + attempts.filter(s => s.status === 'wrong' && +new Date(s.createdAt) < +new Date(first.createdAt)).length*5; }
    }
    return { userId: String(entry.userId), name: entry.displayName || 'Coder', score, solved, penalty };
  }).sort((a,b) => b.score-a.score || a.penalty-b.penalty || a.userId.localeCompare(b.userId));
  return rows.map((row,index) => ({...row, rank: index && row.score === rows[index-1].score && row.penalty === rows[index-1].penalty ? rows.slice(0,index).findIndex(item => item.score === row.score && item.penalty === row.penalty)+1 : index+1}));
}
module.exports = { dayKey, dayStart, chooseDaily, streaks, units, unitProblems, leaderboard };
