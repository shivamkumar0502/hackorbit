const {test}=require('node:test');
const assert=require('node:assert/strict');
const {dayKey,dayStart,chooseDaily,streaks,unitProblems,units,leaderboard}=require('../src/utils/learning');
test('daily boundaries use IST midnight, including leap day',()=>{
 assert.equal(dayKey('2026-10-22T18:29:59Z'),'2026-10-22');assert.equal(dayKey('2026-10-22T18:30:00Z'),'2026-10-23');
 assert.equal(dayStart('2024-02-29').toISOString(),'2024-02-28T18:30:00.000Z');
 assert.deepEqual(streaks(['2024-02-28','2024-02-29','2024-03-01','2024-03-01'],'2024-03-02'),{current:3,longest:3,completedDays:3});
 assert.equal(streaks(['2024-02-29'],'2024-03-02').current,0);
 assert.deepEqual(streaks([],'2026-10-22'),{current:0,longest:0,completedDays:0});
});
test('daily selection is stable regardless of database result order and handles an empty bank',()=>{
 const pool=[{_id:'3'},{_id:'1'},{_id:'2'}];assert.equal(chooseDaily(pool,'2026-10-22')._id,chooseDaily([...pool].reverse(),'2026-10-22')._id);assert.equal(chooseDaily([],'2026-10-22'),null);
});
test('roadmap topics match real bank tags and titles without inventing solved problems',()=>{
 assert.deepEqual(unitProblems(units.find(u=>u.id==='graphs'),[{title:'Islands',tags:'graph'},{title:'Sum',tags:'array'}]).map(p=>p.title),['Islands']);
 assert.equal(unitProblems(units.find(u=>u.id==='trees'),[{title:'Array sum',tags:'array'}]).length,0);
});
test('event scores deduplicate accepts, exclude other windows/users, apply only wrong-before-accept penalties and share ties',()=>{
 const start=new Date('2026-10-22T10:00:00Z'),at=m=>new Date(+start+m*60000);
 const event={startsAt:start,endsAt:at(60),problems:[{problemId:'p1',points:100},{problemId:'p2',points:200}]};
 const entries=[{userId:'a',joinedAt:start,displayName:'A'},{userId:'b',joinedAt:at(5),displayName:'B'},{userId:'c',joinedAt:start,displayName:'C'}];
 const s=(userId,problemId,status,m)=>({userId,problemId,status,createdAt:at(m)});
 const submissions=[s('a','p1','wrong',1),s('a','p1','error',2),s('a','p1','accepted',10),s('a','p1','accepted',20),s('a','p1','wrong',21),s('a','p2','accepted',61),s('b','p2','accepted',3),s('b','p1','accepted',15),s('outsider','p2','accepted',4)];
 const rows=leaderboard(event,entries,submissions,at(70));
 assert.deepEqual(rows.map(r=>[r.userId,r.score,r.solved,r.penalty,r.rank]),[['a',100,1,15,1],['b',100,1,15,1],['c',0,0,0,3]]);
 assert.equal(leaderboard(event,entries,submissions,at(9))[0].score,0);
});
