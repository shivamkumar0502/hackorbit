import { test } from 'node:test';
import assert from 'node:assert/strict';
import { arrayFrames, parseArray, parseGraph, graphFrames } from '../src/utils/visualizer.js';
import { feedbackLinks } from '../src/utils/feedbackLinks.js';
test('sorts negative values and duplicates without mutating input or earlier frames', () => {
  for (const algorithm of ['bubble', 'selection', 'insertion']) {
    for (const input of [[3, -2, 3, 0, -9], [1], [4, 3, 2, 1], [1, 2, 3]]) {
      const original = [...input], frames = arrayFrames(algorithm, input);
      assert.deepEqual(frames.at(-1).values, [...input].sort((a,b) => a-b));
      assert.deepEqual(input, original); assert.deepEqual(frames[0].values, original);
      assert.ok(frames.at(-1).done);
    }
  }
});
test('searches report real indices, including sorted indices for binary search', () => {
  assert.equal(arrayFrames('linear', [5, 2, 5], 5).at(-1).found, 0);
  for (const algorithm of ['linear', 'binary']) assert.equal(arrayFrames(algorithm, [5, -3, 2], 9).at(-1).found, -1);
  const frames = arrayFrames('binary', [5, -3, 2], -3);
  assert.deepEqual(frames[0].values, [-3, 2, 5]); assert.equal(frames.at(-1).found, 0);
});
test('cyclic graph traversal visits reachable nodes once and preserves snapshots', () => {
  const graph = parseGraph('0-1,0-2,1-2,1-3,4-5', 0);
  for (const algorithm of ['bfs', 'dfs']) {
    const frames = graphFrames(algorithm, graph, 0);
    assert.deepEqual(frames.at(-1).visited.slice().sort(), [0,1,2,3]);
    assert.deepEqual(frames[0].visited, []); assert.deepEqual(frames.at(-1).frontier, []);
  }
  assert.deepEqual(graphFrames('bfs', graph, 0).at(-1).visited, [0,1,2,3]);
});
test('rejects malformed and oversized visualizer input', () => {
  assert.deepEqual(parseArray('3, -1 2'), [3,-1,2]);
  for (const input of ['', '1.5,2', '1000', Array(19).fill('1').join(',')]) assert.throws(() => parseArray(input));
  for (const input of ['0-0', '0-9', 'bad']) assert.throws(() => parseGraph(input, 0));
  assert.throws(() => parseGraph('0-1', 2));
});
test('feedback links address the owner and safely encode user text', () => {
  const links = feedbackLinks('A & B', 'a@example.com', 'Hello? & #feedback');
  assert.ok(links.email.startsWith('mailto:shivamkumartek123@gmail.com?'));
  assert.ok(links.whatsapp.startsWith('https://wa.me/919955950777?text='));
  assert.ok(decodeURIComponent(links.whatsapp.split('text=')[1]).includes('Hello? & #feedback'));
});
