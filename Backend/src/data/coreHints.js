module.exports={
'core-v1-array-total':['Every value contributes once, including negatives and zero.','Maintain a running total; a 64-bit integer is needed in C++ and Java for large totals.'],
'core-v1-first-target':['Scan from the beginning because the first occurrence is required.','Return immediately when a value matches; use -1 only after all positions are checked.'],
'core-v1-largest-segment':['For each ending index, either extend the previous segment or start a new one.','Maintain the best sum ending here and the best sum overall. Initialize from a real element to handle all-negative input.'],
'core-v1-rotate-right':['A full rotation of n positions changes nothing, so reduce k modulo n.','The last k values become the prefix, followed by the original first n-k values.'],
'core-v1-components':['An isolated vertex is also a connected component.','Start a new DFS or BFS from each unseen vertex and count those starts.'],
'core-v1-shortest-hops':['All edges have equal cost, so explore vertices in increasing hop distance.','Run BFS from start; the first discovery of a vertex gives its shortest distance.'],
'core-v1-stair-routes':['The last move is either one step or two steps.','ways[n]=ways[n-1]+ways[n-2], with ways[0]=ways[1]=1.'],
'core-v1-nonadjacent':['At each position choose between skipping it and taking it with a compatible earlier solution.','Keep the best totals up to the previous and second-previous positions; allow the empty choice.']};
