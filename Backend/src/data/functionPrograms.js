const contracts = require('./functionContracts');
const cppTypes={I:'int',L:'long long',S:'string',A:'vector<int>',M:'vector<vector<int>>',W:'vector<string>',V:'vector<long long>'};
const javaTypes={I:'int',L:'long',S:'String',A:'int[]',M:'int[][]',W:'String[]',V:'long[]'};
const javascript={
 'second-distinct':`const values = [...new Set(nums)].sort((a,b) => b-a);\nreturn values.length < 2 ? 'NONE' : String(values[1]);`,
 'move-zeros':`let write = 0;\nfor (const value of nums) if (value !== 0) nums[write++] = value;\nwhile (write < nums.length) nums[write++] = 0;\nreturn nums;`,
 equilibrium:`let right = nums.reduce((sum,value) => sum+value,0), left = 0;\nfor (let i=0; i<nums.length; ++i) { right-=nums[i]; if(left===right) return i; left+=nums[i]; }\nreturn -1;`,
 rainwater:`let left=0, right=heights.length-1, leftMax=0, rightMax=0, water=0;\nwhile(left<=right) {\n    if(leftMax<=rightMax) { leftMax=Math.max(leftMax,heights[left]); water+=leftMax-heights[left++]; }\n    else { rightMax=Math.max(rightMax,heights[right]); water+=rightMax-heights[right--]; }\n}\nreturn water;`,
 'pair-total':`const count=new Map(); let pairs=0;\nfor(const value of nums) { pairs+=count.get(target-value)||0; count.set(value,(count.get(value)||0)+1); }\nreturn pairs;`,
 'longest-unique':`const last=new Map(); let left=0,best=0;\nfor(let right=0;right<word.length;++right) {\n    const c=word[right]; left=Math.max(left,(last.get(c)??-1)+1); last.set(c,right);\n    best=Math.max(best,right-left+1);\n}\nreturn best;`,
 'fixed-window':`let sum=0; for(let i=0;i<k;++i) sum+=nums[i]; let best=sum;\nfor(let i=k;i<nums.length;++i) { sum+=nums[i]-nums[i-k]; best=Math.max(best,sum); }\nreturn best;`,
 'prefix-queries':`const prefix=[0];\nfor(const value of nums) prefix.push(prefix[prefix.length-1]+value);\nreturn queries.map(([left,right])=>prefix[right+1]-prefix[left]);`,
 anagram:`if(first.length!==second.length) return 'NO';\nconst count=Array(26).fill(0);\nfor(const c of first) ++count[c.charCodeAt(0)-97];\nfor(const c of second) --count[c.charCodeAt(0)-97];\nreturn count.every(value=>value===0) ? 'YES' : 'NO';`,
 palindrome:`for(let left=0,right=word.length-1;left<right;++left,--right) if(word[left]!==word[right]) return 'NO';\nreturn 'YES';`,
 'run-length':`const runs=[];\nfor(let i=0;i<word.length;) { let end=i+1; while(end<word.length&&word[end]===word[i]) ++end; runs.push(word[i]+(end-i)); i=end; }\nreturn runs.join('');`,
 'first-single':`const count=new Map();\nfor(const c of word) count.set(c,(count.get(c)||0)+1);\nfor(let i=0;i<word.length;++i) if(count.get(word[i])===1) return i;\nreturn -1;`,
 'subsequence-check':`let matched=0;\nfor(const c of text) if(matched<pattern.length&&pattern[matched]===c) ++matched;\nreturn matched===pattern.length ? 'YES' : 'NO';`,
 'lower-bound':`let left=0,right=nums.length;\nwhile(left<right) { const mid=Math.floor((left+right)/2); if(nums[mid]<target) left=mid+1; else right=mid; }\nreturn left;`,
 'integer-root':`let left=0,right=1000001;\nwhile(left+1<right) { const mid=Math.floor((left+right)/2); if(mid*mid<=value) left=mid; else right=mid; }\nreturn left;`,
 'rotated-min':`let left=0,right=nums.length-1;\nwhile(left<right) { const mid=Math.floor((left+right)/2); if(nums[mid]>nums[right]) left=mid+1; else right=mid; }\nreturn nums[left];`,
 'merge-intervals':`intervals.sort((a,b)=>a[0]-b[0]); const merged=[];\nfor(const interval of intervals) { const last=merged.at(-1); if(!last||interval[0]>last[1]) merged.push([...interval]); else last[1]=Math.max(last[1],interval[1]); }\nreturn merged;`,
 inversions:`let count=0;\nfunction mergeSort(values) {\n    if(values.length<2) return values;\n    const mid=values.length>>1, left=mergeSort(values.slice(0,mid)), right=mergeSort(values.slice(mid)), merged=[];\n    let i=0,j=0;\n    while(i<left.length&&j<right.length) { if(left[i]<=right[j]) merged.push(left[i++]); else { count+=left.length-i; merged.push(right[j++]); } }\n    return merged.concat(left.slice(i),right.slice(j));\n}\nmergeSort(nums); return count;`,
 'balanced-brackets':`const stack=[],pairs={')':'(',']':'[','}':'{'};\nfor(const c of brackets) { if('([{'.includes(c)) stack.push(c); else if(stack.pop()!==pairs[c]) return 'NO'; }\nreturn stack.length ? 'NO' : 'YES';`,
 'next-greater':`const answers=Array(nums.length).fill(-1),stack=[];\nfor(let i=0;i<nums.length;++i) { while(stack.length&&nums[stack.at(-1)]<nums[i]) answers[stack.pop()]=nums[i]; stack.push(i); }\nreturn answers;`,
 histogram:`const stack=[]; let best=0;\nfor(let i=0;i<=heights.length;++i) {\n    const height=i===heights.length ? 0 : heights[i];\n    while(stack.length&&heights[stack.at(-1)]>height) { const h=heights[stack.pop()], left=stack.length ? stack.at(-1) : -1; best=Math.max(best,h*(i-left-1)); }\n    stack.push(i);\n}\nreturn best;`,
 'window-max':`const candidates=[],answers=[]; let head=0;\nfor(let i=0;i<nums.length;++i) {\n    while(head<candidates.length&&candidates[head]<=i-k) ++head;\n    while(candidates.length>head&&nums[candidates.at(-1)]<=nums[i]) candidates.pop();\n    candidates.push(i); if(i>=k-1) answers.push(nums[candidates[head]]);\n}\nreturn answers;`,
 'queue-simulation':`const values=[],answers=[]; let head=0;\nfor(const command of commands) {\n    if(command.startsWith('PUSH ')) values.push(command.slice(5));\n    else if(head===values.length) answers.push('EMPTY');\n    else answers.push(command==='POP' ? values[head++] : values[head]);\n}\nreturn answers.length ? answers : ['NONE'];`,
 'list-reverse':`const reversed=[];\nfor(let node=head;node!==-1;node=next[node]) reversed.push(values[node]);\nreturn reversed.reverse();`,
 'list-cycle':`let slow=head,fast=head;\nwhile(fast!==-1&&next[fast]!==-1) { slow=next[slow]; fast=next[next[fast]]; if(slow===fast) return 'YES'; }\nreturn 'NO';`,
 'list-middle':`let slow=head,fast=head;\nwhile(fast!==-1&&next[fast]!==-1) { slow=next[slow]; fast=next[next[fast]]; }\nreturn values[slow];`,
 'tree-height':`const depth=Array(parent.length).fill(0); let height=0;\nfor(let i=1;i<parent.length;++i) { depth[i]=depth[parent[i]]+1; height=Math.max(height,depth[i]); }\nreturn height;`,
 'tree-leaves':`const hasChild=Array(parent.length).fill(false);\nfor(let i=1;i<parent.length;++i) hasChild[parent[i]]=true;\nreturn hasChild.filter(value=>!value).length;`,
 'bst-inorder':`return values.sort((a,b)=>a-b);`,
 'tree-subtree':`const sizes=Array(parent.length).fill(1);\nfor(let i=parent.length-1;i>0;--i) sizes[parent[i]]+=sizes[i];\nreturn sizes;`,
 bipartite:`const graph=Array.from({length:n},()=>[]),color=Array(n).fill(-1);\nfor(const [u,v] of edges) { graph[u].push(v); graph[v].push(u); }\nfor(let start=0;start<n;++start) if(color[start]===-1) {\n    const queue=[start]; color[start]=0;\n    for(let i=0;i<queue.length;++i) for(const v of graph[queue[i]]) {\n        if(color[v]===color[queue[i]]) return 'NO';\n        if(color[v]===-1) { color[v]=1-color[queue[i]]; queue.push(v); }\n    }\n}\nreturn 'YES';`,
 'directed-cycle':`const graph=Array.from({length:n},()=>[]),indegree=Array(n).fill(0);\nfor(const [u,v] of edges) { graph[u].push(v); ++indegree[v]; }\nconst queue=[]; for(let i=0;i<n;++i) if(!indegree[i]) queue.push(i);\nfor(let i=0;i<queue.length;++i) for(const v of graph[queue[i]]) if(--indegree[v]===0) queue.push(v);\nreturn queue.length===n ? 'NO' : 'YES';`,
 islands:`const cells=grid.map(row=>row.split('')),rows=grid.length,cols=grid[0].length; let count=0;\nfor(let i=0;i<rows;++i) for(let j=0;j<cols;++j) if(cells[i][j]==='1') {\n    ++count; const pending=[[i,j]]; cells[i][j]='0';\n    while(pending.length) { const [x,y]=pending.pop();\n        for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]) { const u=x+dx,v=y+dy;\n            if(u>=0&&u<rows&&v>=0&&v<cols&&cells[u][v]==='1') { cells[u][v]='0'; pending.push([u,v]); }\n        }\n    }\n}\nreturn count;`,
 'weighted-path':`const graph=Array.from({length:n},()=>[]),distance=Array(n).fill(Infinity),used=Array(n).fill(false);\nfor(const [u,v,weight] of edges) graph[u].push([v,weight]); distance[start]=0;\nfor(let step=0;step<n;++step) {\n    let u=-1; for(let v=0;v<n;++v) if(!used[v]&&(u===-1||distance[v]<distance[u])) u=v;\n    if(u===-1||!Number.isFinite(distance[u])) break;\n    used[u]=true; for(const [v,weight] of graph[u]) distance[v]=Math.min(distance[v],distance[u]+weight);\n}\nreturn Number.isFinite(distance[target]) ? distance[target] : -1;`,
 dsu:`const parent=Array.from({length:n},(_,i)=>i),size=Array(n).fill(1),answers=[]; let components=n;\nfunction root(x) { while(x!==parent[x]) { parent[x]=parent[parent[x]]; x=parent[x]; } return x; }\nfor(const [u,v] of edges) { let a=root(u),b=root(v); if(a!==b) { if(size[a]<size[b]) [a,b]=[b,a]; parent[b]=a; size[a]+=size[b]; --components; } answers.push(components); }\nreturn answers;`,
 'coin-min':`const dp=Array(target+1).fill(Infinity); dp[0]=0;\nfor(let amount=1;amount<=target;++amount) for(const coin of coins) if(coin<=amount) dp[amount]=Math.min(dp[amount],dp[amount-coin]+1);\nreturn Number.isFinite(dp[target]) ? dp[target] : -1;`,
 lis:`const tails=[];\nfor(const value of nums) { let left=0,right=tails.length; while(left<right) { const mid=(left+right)>>1; if(tails[mid]<value) left=mid+1; else right=mid; } tails[left]=value; }\nreturn tails.length;`,
 knapsack:`const dp=Array(capacity+1).fill(0);\nfor(const [weight,value] of items) for(let c=capacity;c>=weight;--c) dp[c]=Math.max(dp[c],dp[c-weight]+value);\nreturn dp[capacity];`,
 'grid-routes':`const cols=grid[0].length,dp=Array(cols).fill(0); dp[0]=1;\nfor(const row of grid) for(let j=0;j<cols;++j) dp[j]=row[j]==='#' ? 0 : (dp[j]+(j ? dp[j-1] : 0))%1000000007;\nreturn dp[cols-1];`,
 'edit-distance':`let dp=Array.from({length:second.length+1},(_,j)=>j);\nfor(let i=1;i<=first.length;++i) {\n    const row=[i];\n    for(let j=1;j<=second.length;++j) row[j]=Math.min(dp[j]+1,row[j-1]+1,dp[j-1]+(first[i-1]===second[j-1]?0:1));\n    dp=row;\n}\nreturn dp[second.length];`,
 lcs:`let dp=Array(second.length+1).fill(0);\nfor(const c of first) { const row=[0]; for(let j=1;j<=second.length;++j) row[j]=c===second[j-1] ? dp[j-1]+1 : Math.max(dp[j],row[j-1]); dp=row; }\nreturn dp[second.length];`,
 'activity-selection':`meetings.sort((a,b)=>a[1]-b[1]); let end=-1,count=0;\nfor(const [start,finish] of meetings) if(start>=end) { ++count; end=finish; }\nreturn count;`,
 'minimum-jumps':`let end=0,farthest=0,jumps=0;\nfor(let i=0;i<nums.length-1;++i) { farthest=Math.max(farthest,i+nums[i]); if(i===end) { if(farthest<=i) return -1; ++jumps; end=farthest; } }\nreturn jumps;`,
 'k-largest':`return nums.sort((a,b)=>b-a).slice(0,k);`,
 'merge-sorted':`return streams.flat().sort((a,b)=>a-b);`,
 'single-xor':`return nums.reduce((answer,value)=>answer^value,0);`,
 'set-bits':`let count=0; while(value) { value&=value-1; ++count; } return count;`,
 gcd:`while(second) [first,second]=[second,first%second]; return first;`,
 'prime-count':`const composite=new Uint8Array(n+1);\nfor(let p=2;p*p<=n;++p) if(!composite[p]) for(let multiple=p*p;multiple<=n;multiple+=p) composite[multiple]=1;\nlet count=0; for(let i=2;i<=n;++i) if(!composite[i]) ++count; return count;`,
 'subset-count':`function search(index,sum) { if(index===nums.length) return sum===target ? 1 : 0; return search(index+1,sum)+search(index+1,sum+nums[index]); }\nreturn search(0,0);`,
};
const methodName=key=>key.replace(/-([a-z])/g,(_,c)=>c.toUpperCase());
const indent=(text,n=8)=>text.split('\n').map(line=>' '.repeat(n)+line).join('\n');
function snippet(s,language,body){
 const name=methodName(s.key),args=s.params.map(([type,name])=>language==='cpp'?`${cppTypes[type]}${['A','M','W'].includes(type)?'&':''} ${name}`:language==='java'?`${javaTypes[type]} ${name}`:name).join(', ');
 const signature=language==='javascript'?`${name}(${args})`:`${language==='java'?'public ':''}${(language==='cpp'?cppTypes:javaTypes)[s.ret]} ${name}(${args})`;
 return `class Solution {\n${language==='cpp'?'public:\n':''}    ${signature} {\n${indent(body)}\n    }\n}${language==='cpp'?';':''}\n`;
}
function empty(s,language){
 if(language==='javascript')return '// Your function should return the answer. Input/output is handled for you.\n'+snippet(s,language,'// Write your code here\nthrow new Error("Not implemented");');
 return '// Return the answer; do not read input or print output.\n'+snippet(s,language,'// Write your code here\n'+(language==='cpp'?'throw logic_error("Not implemented");':'throw new UnsupportedOperationException("Not implemented");'));
}
// Build a language-neutral input plan. Size tokens are consumed by the driver.
function plan(s){
 const names=s.params.map(p=>p[1]),op=[];
 const scalar=(name,type='I')=>op.push({kind:'scalar',name,type});
 const array=(name,count)=>op.push({kind:'array',name,count});
 const matrix=(name,count,width=2)=>op.push({kind:'matrix',name,count,width});
 switch(s.read){
 case 'nA':scalar('n');array(names[0],'n');break;
 case 'nKA':scalar('n');scalar(names[1]);array(names[0],'n');break;
 case 'nqAM':scalar('n');scalar('q');array(names[0],'n');matrix(names[1],'q');break;
 case 'nM':scalar('n');matrix(names[0],'n');break;
 case 'nKM':scalar('n');scalar(names[1]);matrix(names[0],'n');break;
 case 'graph':scalar('n');scalar('m');matrix('edges','m');break;
 case 'weighted':scalar('n');scalar('m');scalar('start');scalar('target');matrix('edges','m',3);break;
 case 'list':scalar('n');scalar('head');array('values','n');array('next','n');break;
 case 'cycle':scalar('n');scalar('head');array('next','n');break;
 case 'grid':scalar('rows');scalar('cols');op.push({kind:'words',name:'grid',count:'rows'});break;
 case 'streams':scalar('k');op.push({kind:'streams',name:'streams',count:'k'});break;
 case 'commands':scalar('q');op.push({kind:'commands',name:'commands',count:'q'});break;
 default:for(const [type,name]of s.params)scalar(name,type);
 }
 return op;
}
function inputCode(s,language){return plan(s).map(o=>{
 const {name,count,width,type}=o;
 if(language==='cpp'){
  if(o.kind==='scalar')return `${cppTypes[type]} ${name}; cin >> ${name};`;
  if(o.kind==='array')return `vector<int> ${name}(${count}); for(auto& v:${name}) cin>>v;`;
  if(o.kind==='matrix')return `vector<vector<int>> ${name}(${count},vector<int>(${width})); for(auto& row:${name}) for(auto& v:row) cin>>v;`;
  if(o.kind==='words')return `vector<string> ${name}(${count}); for(auto& row:${name}) cin>>row;`;
  if(o.kind==='streams')return `vector<vector<int>> ${name}(${count}); for(auto& row:${name}) { int length; cin>>length; row.resize(length); for(auto& v:row) cin>>v; }`;
  return `vector<string> commands(q); for(auto& command:commands) { cin>>command; if(command=="PUSH") { string value; cin>>value; command+=" "+value; } }`;
 }
 if(language==='java'){
  if(o.kind==='scalar')return `${javaTypes[type]} ${name}=in.${type==='S'?'next()':type==='L'?'nextLong()':'nextInt()'};`;
  if(o.kind==='array')return `int[] ${name}=new int[${count}]; for(int i=0;i<${count};++i) ${name}[i]=in.nextInt();`;
  if(o.kind==='matrix')return `int[][] ${name}=new int[${count}][${width}]; for(int[] row:${name}) for(int j=0;j<${width};++j) row[j]=in.nextInt();`;
  if(o.kind==='words')return `String[] ${name}=new String[${count}]; for(int i=0;i<${count};++i) ${name}[i]=in.next();`;
  if(o.kind==='streams')return `int[][] ${name}=new int[${count}][]; for(int i=0;i<${count};++i) { int length=in.nextInt(); ${name}[i]=new int[length]; for(int j=0;j<length;++j) ${name}[i][j]=in.nextInt(); }`;
  return `String[] commands=new String[q]; for(int i=0;i<q;++i) { commands[i]=in.next(); if(commands[i].equals("PUSH")) commands[i]+=" "+in.next(); }`;
 }
 if(o.kind==='scalar')return `const ${name}=${type==='S'?'tokens[position++]':'Number(tokens[position++])'};`;
 if(o.kind==='array')return `const ${name}=Array.from({length:${count}},()=>Number(tokens[position++]));`;
 if(o.kind==='matrix')return `const ${name}=Array.from({length:${count}},()=>Array.from({length:${width}},()=>Number(tokens[position++])));`;
 if(o.kind==='words')return `const ${name}=Array.from({length:${count}},()=>tokens[position++]);`;
 if(o.kind==='streams')return `const ${name}=Array.from({length:${count}},()=>{const length=Number(tokens[position++]);return Array.from({length},()=>Number(tokens[position++]));});`;
 return `const commands=Array.from({length:q},()=>{const command=tokens[position++];return command==='PUSH'?command+' '+tokens[position++]:command;});`;
}).join('\n');}
function outputCode(s,language){
 const emptyList=s.key==='list-reverse',line=s.key==='prefix-queries'||s.key==='dsu'||s.ret==='W',separator=line?'\\n':' ';
 if(language==='cpp'){
  if(s.ret==='M')return `cout<<answer.size()<<'\\n'; for(const auto& row:answer) cout<<row[0]<<' '<<row[1]<<'\\n';`;
  if(['A','V','W'].includes(s.ret))return `${emptyList?'if(answer.empty()) cout<<"EMPTY"; ':''}for(size_t i=0;i<answer.size();++i) { if(i) cout<<"${separator}"; cout<<answer[i]; } cout<<'\\n';`;
  return `cout<<answer<<'\\n';`;
 }
 if(language==='java'){
  if(s.ret==='M')return `StringBuilder out=new StringBuilder(); out.append(answer.length).append('\\n'); for(int[] row:answer) out.append(row[0]).append(' ').append(row[1]).append('\\n'); System.out.print(out);`;
  if(['A','V','W'].includes(s.ret))return `StringBuilder out=new StringBuilder(); ${emptyList?'if(answer.length==0) out.append("EMPTY");':''} for(int i=0;i<answer.length;++i) { if(i>0) out.append("${separator}"); out.append(answer[i]); } System.out.println(out);`;
  return 'System.out.println(answer);';
 }
 if(s.ret==='M')return `console.log([answer.length,...answer.map(row=>row.join(' '))].join('\\n'));`;
 if(['A','V','W'].includes(s.ret))return `console.log(${emptyList?"answer.length ? answer.join(' ') : 'EMPTY'":`answer.join('${separator}')`});`;
 return 'console.log(answer);';
}
const javaScanner=`static class FastScanner {\n    private final java.io.InputStream in=System.in;\n    private final byte[] buffer=new byte[65536]; private int pointer=0,length=0;\n    int read() throws java.io.IOException { if(pointer>=length) { length=in.read(buffer); pointer=0; if(length<=0) return -1; } return buffer[pointer++]; }\n    String next() throws java.io.IOException { StringBuilder s=new StringBuilder(); int c; do { c=read(); } while(c<=32 && c!=-1); while(c>32 && c!=-1) { s.append((char)c); c=read(); } return s.toString(); }\n    int nextInt() throws java.io.IOException { return Integer.parseInt(next()); }\n    long nextLong() throws java.io.IOException { return Long.parseLong(next()); }\n}`;
function driver(s,language){
 const args=s.params.map(p=>p[1]).join(', '),call=`new Solution().${methodName(s.key)}(${args})`;
 const body=inputCode(s,language)+'\n'+(language==='cpp'?`auto answer=Solution().${methodName(s.key)}(${args});`:language==='java'?`${javaTypes[s.ret]} answer=${call};`:`const answer=${call};`)+'\n'+outputCode(s,language);
 if(language==='cpp')return '#include <bits/stdc++.h>\nusing namespace std;\n__HACKORBIT_SOLUTION__\nint main() { ios::sync_with_stdio(false); cin.tie(nullptr);\n'+indent(body,4)+'\n}\n';
 if(language==='java')return 'import java.util.*;\nimport java.io.*;\n__HACKORBIT_SOLUTION__\npublic class Main {\n'+indent(javaScanner,4)+'\n    public static void main(String[] args) throws Exception {\n        FastScanner in=new FastScanner();\n'+indent(body)+'\n    }\n}\n';
 return "__HACKORBIT_SOLUTION__\nconst fs=require('fs');\nconst rawInput=fs.readFileSync(0,'utf8').trim();\nconst tokens=rawInput ? rawInput.split(/\\s+/) : []; let position=0;\n"+body+'\n';
}
function formattedInput(s,input){
 const tokens=input.trim().split(/\s+/); let position=0; const values={};
 for(const op of plan(s)) {
  const length=values[op.count];
  if(op.kind==='scalar') values[op.name]=op.type==='S'?tokens[position++]:Number(tokens[position++]);
  else if(op.kind==='array') values[op.name]=Array.from({length},()=>Number(tokens[position++]));
  else if(op.kind==='matrix') values[op.name]=Array.from({length},()=>Array.from({length:op.width},()=>Number(tokens[position++])));
  else if(op.kind==='words') values[op.name]=Array.from({length},()=>tokens[position++]);
  else if(op.kind==='streams') values[op.name]=Array.from({length},()=>{const count=Number(tokens[position++]); return Array.from({length:count},()=>Number(tokens[position++]));});
  else values[op.name]=Array.from({length},()=>{const command=tokens[position++];return command==='PUSH'?command+' '+tokens[position++]:command;});
 }
 return s.params.map(([,name])=>name+' = '+JSON.stringify(values[name])).join('\n');
}
const byKey=new Map(contracts.map(s=>[s.key,s]));
function enhance(problem){
 const key=problem.seedKey.replace('expanded-v2-',''),s=byKey.get(key);
 if(!s||!javascript[key])throw Error('Missing function contract: '+key);
 const labels={cpp:'C++',java:'Java',javascript:'JavaScript'};
 const drivers={};
 const referenceSolution=Object.entries(labels).map(([language,label])=>{
  const solutionCode=snippet(s,language,language==='javascript'?javascript[key]:s[language]);
  drivers[language]=driver(s,language);
  const time=key==='subset-count'?(language==='java'?'O(n × 2^n)':'O(2^n)'):language==='javascript'&&key==='k-largest'?'O(n log n)':language==='javascript'&&key==='merge-sorted'?'O(total log total)':s.time;
  const space=key==='subset-count'?(language==='java'?'O(1)':'O(n)'):language==='javascript'&&['window-max','k-largest'].includes(key)?'O(n)':language==='javascript'&&key==='merge-sorted'?'O(total)':s.space;
  return {language:label,solutionCode,completeCode:drivers[language].replace('__HACKORBIT_SOLUTION__',()=>solutionCode),timeComplexity:time,spaceComplexity:space};
 });
 return {...problem,visibleTestCases:problem.visibleTestCases.map(test=>({...test,displayInput:formattedInput(s,test.input)})),codeVersion:3,functionMode:true,driverCode:drivers,functionSignature:s.params.map(([type,name])=>`${name}: ${javaTypes[type]}`).join(', '),functionReturn:javaTypes[s.ret],methodName:methodName(key),solutionSteps:key==='inversions'?['JavaScript counts cross-half inversions during merge sort. C++ and Java compress values to ranks and use a Fenwick tree.','Scan right to left and query counts of strictly smaller ranks; duplicates must not count as inversions.','Accumulate the pair count in a 64-bit integer (or JavaScript Number within the stated bounds).']:problem.hints,referenceSolution,startCode:Object.entries(labels).map(([language,label])=>({language:label,initialCode:empty(s,language)}))};
}
module.exports={enhance,contracts,driver,snippet,formatExample:(method,input)=>{const spec=contracts.find(s=>methodName(s.key)===method);return spec?formattedInput(spec,input):input;}};
