const topics=['array','linkedList','graph','dp','string','hash','twoPointers','slidingWindow','prefix','binarySearch','sorting','stack','queue','tree','bst','dsu','greedy','heap','bit','math','backtracking'];
function practicePlan(problems,submissions){
 const solved=new Set(submissions.filter(s=>s.status==='accepted').map(s=>String(s.problemId)));
 const stats=topics.map(topic=>{const set=problems.filter(p=>p.tags===topic),ids=new Set(set.map(p=>String(p._id))),attempts=submissions.filter(s=>ids.has(String(s.problemId))),done=set.filter(p=>solved.has(String(p._id))).length,wrong=attempts.filter(s=>s.status==='wrong').length;return {topic,total:set.length,solved:done,wrong,priority:wrong*2+(set.length?1-done/set.length:0)};}).filter(t=>t.total);
 const ranked=[...stats].sort((a,b)=>b.priority-a.priority||a.topic.localeCompare(b.topic));
 const picks=[];for(const topic of ranked){const available=problems.filter(p=>p.tags===topic.topic&&!solved.has(String(p._id))).sort((a,b)=>({easy:0,medium:1,hard:2}[a.difficulty]-{easy:0,medium:1,hard:2}[b.difficulty])||a.title.localeCompare(b.title));if(available[0])picks.push({...available[0],reason:topic.wrong?`${topic.wrong} incorrect submissions in ${topic.topic}; strengthen this pattern.`:`Build coverage in ${topic.topic}: ${topic.solved}/${topic.total} accepted.`});}
 return {topics:stats,next:picks.slice(0,7),solved:solved.size,method:'Based on your accepted and incorrect submissions; execution errors do not count as weak-topic evidence.'};
}
const sheets=[
 {id:'google',company:'Google',role:'Software engineer',topics:['graph','tree','binarySearch','dp','dsu'],intro:'Practice modeling, traversal and explaining correctness.'},
 {id:'amazon',company:'Amazon',role:'Software engineer',topics:['array','hash','heap','tree','greedy'],intro:'Practice data structures, trade-offs and concise explanations.'},
 {id:'microsoft',company:'Microsoft',role:'Software engineer',topics:['linkedList','string','tree','bst','dp'],intro:'Practice pointer reasoning, recursion and robust edge cases.'},
 {id:'meta',company:'Meta',role:'Software engineer',topics:['array','twoPointers','slidingWindow','graph','stack'],intro:'Practice clear invariants and efficient implementation.'},
 {id:'uber',company:'Uber',role:'Software engineer',topics:['graph','heap','sorting','prefix','queue'],intro:'Practice routing, streams and interval reasoning.'},
];
module.exports={topics,practicePlan,sheets};
