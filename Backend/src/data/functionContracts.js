// Native function contracts and reference algorithms for the expanded library.
// I=int, L=64-bit integer, S=string, A=int array, M=int matrix, W=string array.
const specs=[];
function add(key,ret,params,read,cpp,java,time,space){specs.push({key,ret,params,read,cpp,java,time,space});}
add('second-distinct','S',[['A','nums']], 'nA',
`set<int> values(nums.begin(), nums.end());
if (values.size() < 2) return "NONE";
return to_string(*next(values.rbegin()));`,
`TreeSet<Integer> values = new TreeSet<>();
for (int value : nums) values.add(value);
if (values.size() < 2) return "NONE";
values.pollLast();
return String.valueOf(values.last());`, 'O(n log n)','O(n)');
add('move-zeros','A',[['A','nums']], 'nA',
`int write = 0;
for (int value : nums) if (value != 0) nums[write++] = value;
while (write < (int)nums.size()) nums[write++] = 0;
return nums;`,
`int write = 0;
for (int value : nums) if (value != 0) nums[write++] = value;
while (write < nums.length) nums[write++] = 0;
return nums;`, 'O(n)','O(1) auxiliary');
add('equilibrium','I',[['A','nums']], 'nA',
`long long right = accumulate(nums.begin(), nums.end(), 0LL), left = 0;
for (int i = 0; i < (int)nums.size(); ++i) {
    right -= nums[i];
    if (left == right) return i;
    left += nums[i];
}
return -1;`,
`long right = 0, left = 0;
for (int value : nums) right += value;
for (int i = 0; i < nums.length; ++i) {
    right -= nums[i];
    if (left == right) return i;
    left += nums[i];
}
return -1;`, 'O(n)','O(1)');
add('rainwater','L',[['A','heights']], 'nA',
`int left = 0, right = (int)heights.size() - 1, leftMax = 0, rightMax = 0;
long long water = 0;
while (left <= right) {
    if (leftMax <= rightMax) {
        leftMax = max(leftMax, heights[left]);
        water += leftMax - heights[left++];
    } else {
        rightMax = max(rightMax, heights[right]);
        water += rightMax - heights[right--];
    }
}
return water;`,
`int left = 0, right = heights.length - 1, leftMax = 0, rightMax = 0;
long water = 0;
while (left <= right) {
    if (leftMax <= rightMax) {
        leftMax = Math.max(leftMax, heights[left]);
        water += leftMax - heights[left++];
    } else {
        rightMax = Math.max(rightMax, heights[right]);
        water += rightMax - heights[right--];
    }
}
return water;`, 'O(n)','O(1)');
add('pair-total','L',[['A','nums'],['I','target']], 'nKA',
`unordered_map<int, long long> count;
long long pairs = 0;
for (int value : nums) { pairs += count[target - value]; ++count[value]; }
return pairs;`,
`Map<Integer, Long> count = new HashMap<>();
long pairs = 0;
for (int value : nums) {
    pairs += count.getOrDefault(target - value, 0L);
    count.put(value, count.getOrDefault(value, 0L) + 1);
}
return pairs;`, 'O(n) expected','O(n)');
add('longest-unique','I',[['S','word']], 'S',
`vector<int> last(26, -1);
int left = 0, best = 0;
for (int right = 0; right < (int)word.size(); ++right) {
    int c = word[right] - 'a';
    left = max(left, last[c] + 1); last[c] = right;
    best = max(best, right - left + 1);
}
return best;`,
`int[] last = new int[26]; Arrays.fill(last, -1);
int left = 0, best = 0;
for (int right = 0; right < word.length(); ++right) {
    int c = word.charAt(right) - 'a';
    left = Math.max(left, last[c] + 1); last[c] = right;
    best = Math.max(best, right - left + 1);
}
return best;`, 'O(n)','O(1)');
add('fixed-window','L',[['A','nums'],['I','k']], 'nKA',
`long long sum = accumulate(nums.begin(), nums.begin() + k, 0LL), best = sum;
for (int i = k; i < (int)nums.size(); ++i) { sum += nums[i] - nums[i-k]; best = max(best, sum); }
return best;`,
`long sum = 0;
for (int i = 0; i < k; ++i) sum += nums[i];
long best = sum;
for (int i = k; i < nums.length; ++i) { sum += nums[i] - nums[i-k]; best = Math.max(best, sum); }
return best;`, 'O(n)','O(1)');
add('prefix-queries','V',[['A','nums'],['M','queries']], 'nqAM',
`vector<long long> prefix(nums.size()+1), answers;
for (int i = 0; i < (int)nums.size(); ++i) prefix[i+1] = prefix[i] + nums[i];
for (const auto& query : queries) answers.push_back(prefix[query[1]+1] - prefix[query[0]]);
return answers;`,
`long[] prefix = new long[nums.length+1], answers = new long[queries.length];
for (int i = 0; i < nums.length; ++i) prefix[i+1] = prefix[i] + nums[i];
for (int i = 0; i < queries.length; ++i) answers[i] = prefix[queries[i][1]+1] - prefix[queries[i][0]];
return answers;`, 'O(n + q)','O(n + q)');
add('anagram','S',[['S','first'],['S','second']], 'SS',
`if (first.size() != second.size()) return "NO";
vector<int> count(26);
for (char c : first) ++count[c-'a'];
for (char c : second) --count[c-'a'];
for (int value : count) if (value) return "NO";
return "YES";`,
`if (first.length() != second.length()) return "NO";
int[] count = new int[26];
for (char c : first.toCharArray()) ++count[c-'a'];
for (char c : second.toCharArray()) --count[c-'a'];
for (int value : count) if (value != 0) return "NO";
return "YES";`, 'O(n + m)','O(1)');
add('palindrome','S',[['S','word']], 'S',
`for (int left = 0, right = (int)word.size()-1; left < right; ++left, --right)
    if (word[left] != word[right]) return "NO";
return "YES";`,
`for (int left = 0, right = word.length()-1; left < right; ++left, --right)
    if (word.charAt(left) != word.charAt(right)) return "NO";
return "YES";`, 'O(n)','O(1)');
add('run-length','S',[['S','word']], 'S',
`string encoded;
for (int i = 0; i < (int)word.size();) {
    int end = i + 1;
    while (end < (int)word.size() && word[end] == word[i]) ++end;
    encoded += word[i]; encoded += to_string(end-i); i = end;
}
return encoded;`,
`StringBuilder encoded = new StringBuilder();
for (int i = 0; i < word.length();) {
    int end = i + 1;
    while (end < word.length() && word.charAt(end) == word.charAt(i)) ++end;
    encoded.append(word.charAt(i)).append(end-i); i = end;
}
return encoded.toString();`, 'O(n)','O(n) output');
add('first-single','I',[['S','word']], 'S',
`vector<int> count(26);
for (char c : word) ++count[c-'a'];
for (int i = 0; i < (int)word.size(); ++i) if (count[word[i]-'a'] == 1) return i;
return -1;`,
`int[] count = new int[26];
for (char c : word.toCharArray()) ++count[c-'a'];
for (int i = 0; i < word.length(); ++i) if (count[word.charAt(i)-'a'] == 1) return i;
return -1;`, 'O(n)','O(1)');
add('subsequence-check','S',[['S','pattern'],['S','text']], 'SS',
`int matched = 0;
for (char c : text) if (matched < (int)pattern.size() && pattern[matched] == c) ++matched;
return matched == (int)pattern.size() ? "YES" : "NO";`,
`int matched = 0;
for (char c : text.toCharArray()) if (matched < pattern.length() && pattern.charAt(matched) == c) ++matched;
return matched == pattern.length() ? "YES" : "NO";`, 'O(n + m)','O(1)');
add('lower-bound','I',[['A','nums'],['I','target']], 'nKA',
`return lower_bound(nums.begin(), nums.end(), target) - nums.begin();`,
`int left = 0, right = nums.length;
while (left < right) {
    int mid = left + (right-left)/2;
    if (nums[mid] < target) left = mid+1; else right = mid;
}
return left;`, 'O(log n)','O(1)');
add('integer-root','L',[['L','value']], 'L',
`long long left = 0, right = 1000001;
while (left+1 < right) {
    long long mid = (left+right)/2;
    if (mid*mid <= value) left = mid; else right = mid;
}
return left;`,
`long left = 0, right = 1000001;
while (left+1 < right) {
    long mid = (left+right)/2;
    if (mid*mid <= value) left = mid; else right = mid;
}
return left;`, 'O(log value)','O(1)');
add('rotated-min','I',[['A','nums']], 'nA',
`int left = 0, right = nums.size()-1;
while (left < right) { int mid = (left+right)/2; if (nums[mid] > nums[right]) left = mid+1; else right = mid; }
return nums[left];`,
`int left = 0, right = nums.length-1;
while (left < right) { int mid = (left+right)/2; if (nums[mid] > nums[right]) left = mid+1; else right = mid; }
return nums[left];`, 'O(log n)','O(1)');
add('merge-intervals','M',[['M','intervals']], 'nM',
`sort(intervals.begin(), intervals.end());
vector<vector<int>> merged;
for (const auto& interval : intervals) {
    if (merged.empty() || interval[0] > merged.back()[1]) merged.push_back(interval);
    else merged.back()[1] = max(merged.back()[1], interval[1]);
}
return merged;`,
`Arrays.sort(intervals, Comparator.comparingInt(a -> a[0]));
List<int[]> merged = new ArrayList<>();
for (int[] interval : intervals) {
    if (merged.isEmpty() || interval[0] > merged.get(merged.size()-1)[1]) merged.add(interval.clone());
    else { int[] last = merged.get(merged.size()-1); last[1] = Math.max(last[1], interval[1]); }
}
return merged.toArray(new int[0][]);`, 'O(n log n)','O(n)');
add('inversions','L',[['A','nums']], 'nA',
`vector<int> sorted = nums; sort(sorted.begin(), sorted.end());
vector<int> bit(nums.size()+1);
long long count = 0;
for (int i = (int)nums.size()-1; i >= 0; --i) {
    int rank = lower_bound(sorted.begin(), sorted.end(), nums[i])-sorted.begin()+1;
    for (int p = rank-1; p > 0; p -= p & -p) count += bit[p];
    for (int p = rank; p < (int)bit.size(); p += p & -p) ++bit[p];
}
return count;`,
`int[] sorted = nums.clone(); Arrays.sort(sorted);
int[] bit = new int[nums.length+1]; long count = 0;
for (int i = nums.length-1; i >= 0; --i) {
    int left = 0, right = sorted.length;
    while (left < right) { int mid = (left+right)/2; if (sorted[mid] < nums[i]) left = mid+1; else right = mid; }
    int rank = left+1;
    for (int p = rank-1; p > 0; p -= p & -p) count += bit[p];
    for (int p = rank; p < bit.length; p += p & -p) ++bit[p];
}
return count;`, 'O(n log n)','O(n)');
add('balanced-brackets','S',[['S','brackets']], 'S',
`string stack;
for (char c : brackets) {
    if (c == '(' || c == '[' || c == '{') stack += c;
    else {
        char expected = c == ')' ? '(' : c == ']' ? '[' : '{';
        if (stack.empty() || stack.back() != expected) return "NO";
        stack.pop_back();
    }
}
return stack.empty() ? "YES" : "NO";`,
`Deque<Character> stack = new ArrayDeque<>();
for (char c : brackets.toCharArray()) {
    if (c == '(' || c == '[' || c == '{') stack.push(c);
    else {
        char expected = c == ')' ? '(' : c == ']' ? '[' : '{';
        if (stack.isEmpty() || stack.pop() != expected) return "NO";
    }
}
return stack.isEmpty() ? "YES" : "NO";`, 'O(n)','O(n)');
add('next-greater','A',[['A','nums']], 'nA',
`vector<int> answers(nums.size(), -1), stack;
for (int i = 0; i < (int)nums.size(); ++i) {
    while (!stack.empty() && nums[stack.back()] < nums[i]) { answers[stack.back()] = nums[i]; stack.pop_back(); }
    stack.push_back(i);
}
return answers;`,
`int[] answers = new int[nums.length]; Arrays.fill(answers, -1);
Deque<Integer> stack = new ArrayDeque<>();
for (int i = 0; i < nums.length; ++i) {
    while (!stack.isEmpty() && nums[stack.peek()] < nums[i]) answers[stack.pop()] = nums[i];
    stack.push(i);
}
return answers;`, 'O(n)','O(n)');
add('histogram','L',[['A','heights']], 'nA',
`vector<int> stack; long long best = 0;
for (int i = 0; i <= (int)heights.size(); ++i) {
    int height = i == (int)heights.size() ? 0 : heights[i];
    while (!stack.empty() && heights[stack.back()] > height) {
        int h = heights[stack.back()]; stack.pop_back();
        int left = stack.empty() ? -1 : stack.back();
        best = max(best, 1LL*h*(i-left-1));
    }
    stack.push_back(i);
}
return best;`,
`Deque<Integer> stack = new ArrayDeque<>(); long best = 0;
for (int i = 0; i <= heights.length; ++i) {
    int height = i == heights.length ? 0 : heights[i];
    while (!stack.isEmpty() && heights[stack.peek()] > height) {
        int h = heights[stack.pop()], left = stack.isEmpty() ? -1 : stack.peek();
        best = Math.max(best, (long)h*(i-left-1));
    }
    stack.push(i);
}
return best;`, 'O(n)','O(n)');
add('window-max','A',[['A','nums'],['I','k']], 'nKA',
`deque<int> candidates; vector<int> answers;
for (int i = 0; i < (int)nums.size(); ++i) {
    while (!candidates.empty() && candidates.front() <= i-k) candidates.pop_front();
    while (!candidates.empty() && nums[candidates.back()] <= nums[i]) candidates.pop_back();
    candidates.push_back(i);
    if (i >= k-1) answers.push_back(nums[candidates.front()]);
}
return answers;`,
`Deque<Integer> candidates = new ArrayDeque<>(); int[] answers = new int[nums.length-k+1];
for (int i = 0; i < nums.length; ++i) {
    while (!candidates.isEmpty() && candidates.peekFirst() <= i-k) candidates.removeFirst();
    while (!candidates.isEmpty() && nums[candidates.peekLast()] <= nums[i]) candidates.removeLast();
    candidates.addLast(i);
    if (i >= k-1) answers[i-k+1] = nums[candidates.peekFirst()];
}
return answers;`, 'O(n)','O(k) auxiliary + output');
add('queue-simulation','W',[['W','commands']], 'commands',
`queue<string> values; vector<string> answers;
for (const string& command : commands) {
    if (command.rfind("PUSH ", 0) == 0) values.push(command.substr(5));
    else if (values.empty()) answers.push_back("EMPTY");
    else { answers.push_back(values.front()); if (command == "POP") values.pop(); }
}
if (answers.empty()) answers.push_back("NONE");
return answers;`,
`Deque<String> values = new ArrayDeque<>(); List<String> answers = new ArrayList<>();
for (String command : commands) {
    if (command.startsWith("PUSH ")) values.addLast(command.substring(5));
    else if (values.isEmpty()) answers.add("EMPTY");
    else { answers.add(values.peekFirst()); if (command.equals("POP")) values.removeFirst(); }
}
if (answers.isEmpty()) answers.add("NONE");
return answers.toArray(new String[0]);`, 'O(q)','O(q)');
add('list-reverse','A',[['I','head'],['A','values'],['A','next']], 'list',
`vector<int> reversed;
for (int node = head; node != -1; node = next[node]) reversed.push_back(values[node]);
reverse(reversed.begin(), reversed.end()); return reversed;`,
`int[] reversed = new int[values.length]; int count = 0;
for (int node = head; node != -1; node = next[node]) reversed[count++] = values[node];
for (int i = 0; i < count/2; ++i) { int temp = reversed[i]; reversed[i] = reversed[count-1-i]; reversed[count-1-i] = temp; }
return reversed;`, 'O(n)','O(n) output');
add('list-cycle','S',[['I','head'],['A','next']], 'cycle',
`int slow = head, fast = head;
while (fast != -1 && next[fast] != -1) {
    slow = next[slow]; fast = next[next[fast]];
    if (slow == fast) return "YES";
}
return "NO";`,
`int slow = head, fast = head;
while (fast != -1 && next[fast] != -1) {
    slow = next[slow]; fast = next[next[fast]];
    if (slow == fast) return "YES";
}
return "NO";`, 'O(n)','O(1)');
add('list-middle','I',[['I','head'],['A','values'],['A','next']], 'list',
`int slow = head, fast = head;
while (fast != -1 && next[fast] != -1) { slow = next[slow]; fast = next[next[fast]]; }
return values[slow];`,
`int slow = head, fast = head;
while (fast != -1 && next[fast] != -1) { slow = next[slow]; fast = next[next[fast]]; }
return values[slow];`, 'O(n)','O(1)');
add('tree-height','I',[['A','parent']], 'nA',
`vector<int> depth(parent.size()); int height = 0;
for (int i = 1; i < (int)parent.size(); ++i) { depth[i] = depth[parent[i]]+1; height = max(height, depth[i]); }
return height;`,
`int[] depth = new int[parent.length]; int height = 0;
for (int i = 1; i < parent.length; ++i) { depth[i] = depth[parent[i]]+1; height = Math.max(height, depth[i]); }
return height;`, 'O(n)','O(n)');
add('tree-leaves','I',[['A','parent']], 'nA',
`vector<bool> hasChild(parent.size());
for (int i = 1; i < (int)parent.size(); ++i) hasChild[parent[i]] = true;
return count(hasChild.begin(), hasChild.end(), false);`,
`boolean[] hasChild = new boolean[parent.length];
for (int i = 1; i < parent.length; ++i) hasChild[parent[i]] = true;
int leaves = 0; for (boolean value : hasChild) if (!value) ++leaves;
return leaves;`, 'O(n)','O(n)');
add('bst-inorder','A',[['A','values']], 'nA',
`sort(values.begin(), values.end()); return values;`,
`Arrays.sort(values); return values;`, 'O(n log n)','O(n) conservative including sorting workspace');
add('tree-subtree','A',[['A','parent']], 'nA',
`vector<int> sizes(parent.size(), 1);
for (int i = (int)parent.size()-1; i > 0; --i) sizes[parent[i]] += sizes[i];
return sizes;`,
`int[] sizes = new int[parent.length]; Arrays.fill(sizes, 1);
for (int i = parent.length-1; i > 0; --i) sizes[parent[i]] += sizes[i];
return sizes;`, 'O(n)','O(n) output');
add('bipartite','S',[['I','n'],['M','edges']], 'graph',
`vector<vector<int>> graph(n); vector<int> color(n, -1);
for (const auto& edge : edges) { graph[edge[0]].push_back(edge[1]); graph[edge[1]].push_back(edge[0]); }
for (int start = 0; start < n; ++start) if (color[start] == -1) {
    queue<int> pending; pending.push(start); color[start] = 0;
    while (!pending.empty()) {
        int u = pending.front(); pending.pop();
        for (int v : graph[u]) {
            if (color[v] == color[u]) return "NO";
            if (color[v] == -1) { color[v] = 1-color[u]; pending.push(v); }
        }
    }
}
return "YES";`,
`List<List<Integer>> graph = new ArrayList<>(); for (int i = 0; i < n; ++i) graph.add(new ArrayList<>());
int[] color = new int[n]; Arrays.fill(color, -1);
for (int[] edge : edges) { graph.get(edge[0]).add(edge[1]); graph.get(edge[1]).add(edge[0]); }
for (int start = 0; start < n; ++start) if (color[start] == -1) {
    Deque<Integer> pending = new ArrayDeque<>(); pending.add(start); color[start] = 0;
    while (!pending.isEmpty()) {
        int u = pending.removeFirst();
        for (int v : graph.get(u)) {
            if (color[v] == color[u]) return "NO";
            if (color[v] == -1) { color[v] = 1-color[u]; pending.addLast(v); }
        }
    }
}
return "YES";`, 'O(n + m)','O(n + m)');
add('directed-cycle','S',[['I','n'],['M','edges']], 'graph',
`vector<vector<int>> graph(n); vector<int> indegree(n);
for (const auto& edge : edges) { graph[edge[0]].push_back(edge[1]); ++indegree[edge[1]]; }
queue<int> pending; for (int i = 0; i < n; ++i) if (!indegree[i]) pending.push(i);
int removed = 0;
while (!pending.empty()) { int u = pending.front(); pending.pop(); ++removed; for (int v : graph[u]) if (--indegree[v] == 0) pending.push(v); }
return removed == n ? "NO" : "YES";`,
`List<List<Integer>> graph = new ArrayList<>(); for (int i = 0; i < n; ++i) graph.add(new ArrayList<>());
int[] indegree = new int[n]; for (int[] edge : edges) { graph.get(edge[0]).add(edge[1]); ++indegree[edge[1]]; }
Deque<Integer> pending = new ArrayDeque<>(); for (int i = 0; i < n; ++i) if (indegree[i] == 0) pending.add(i);
int removed = 0;
while (!pending.isEmpty()) { int u = pending.removeFirst(); ++removed; for (int v : graph.get(u)) if (--indegree[v] == 0) pending.addLast(v); }
return removed == n ? "NO" : "YES";`, 'O(n + m)','O(n + m)');
add('islands','I',[['W','grid']], 'grid',
`int rows = grid.size(), cols = grid[0].size(), islands = 0;
int dx[] = {1,-1,0,0}, dy[] = {0,0,1,-1};
for (int i = 0; i < rows; ++i) for (int j = 0; j < cols; ++j) if (grid[i][j] == '1') {
    ++islands; vector<pair<int,int>> pending{{i,j}}; grid[i][j] = '0';
    while (!pending.empty()) {
        auto [x,y] = pending.back(); pending.pop_back();
        for (int d = 0; d < 4; ++d) { int u=x+dx[d], v=y+dy[d];
            if (u>=0 && u<rows && v>=0 && v<cols && grid[u][v]=='1') { grid[u][v]='0'; pending.push_back({u,v}); }
        }
    }
}
return islands;`,
`int rows = grid.length, cols = grid[0].length(), islands = 0;
char[][] cells = new char[rows][]; for (int i=0; i<rows; ++i) cells[i]=grid[i].toCharArray();
int[] dx={1,-1,0,0}, dy={0,0,1,-1};
for (int i=0; i<rows; ++i) for (int j=0; j<cols; ++j) if (cells[i][j]=='1') {
    ++islands; Deque<int[]> pending=new ArrayDeque<>(); pending.push(new int[]{i,j}); cells[i][j]='0';
    while (!pending.isEmpty()) {
        int[] cell=pending.pop();
        for (int d=0; d<4; ++d) { int u=cell[0]+dx[d], v=cell[1]+dy[d];
            if(u>=0 && u<rows && v>=0 && v<cols && cells[u][v]=='1') { cells[u][v]='0'; pending.push(new int[]{u,v}); }
        }
    }
}
return islands;`, 'O(rows × cols)','O(rows × cols)');
add('weighted-path','L',[['I','n'],['M','edges'],['I','start'],['I','target']], 'weighted',
`const long long INF = 1LL<<60;
vector<vector<pair<int,int>>> graph(n); for (const auto& edge : edges) graph[edge[0]].push_back({edge[1],edge[2]});
vector<long long> distance(n, INF); vector<bool> used(n); distance[start]=0;
for (int step=0; step<n; ++step) {
    int u=-1; for(int v=0; v<n; ++v) if(!used[v] && (u==-1 || distance[v]<distance[u])) u=v;
    if(u==-1 || distance[u]==INF) break;
    used[u]=true; for(auto [v,weight] : graph[u]) distance[v]=min(distance[v],distance[u]+weight);
}
return distance[target]==INF ? -1 : distance[target];`,
`long inf=Long.MAX_VALUE/4;
List<List<int[]>> graph=new ArrayList<>(); for(int i=0;i<n;++i) graph.add(new ArrayList<>());
for(int[] edge:edges) graph.get(edge[0]).add(new int[]{edge[1],edge[2]});
long[] distance=new long[n]; Arrays.fill(distance,inf); boolean[] used=new boolean[n]; distance[start]=0;
for(int step=0;step<n;++step) {
    int u=-1; for(int v=0;v<n;++v) if(!used[v] && (u==-1 || distance[v]<distance[u])) u=v;
    if(u==-1 || distance[u]==inf) break;
    used[u]=true; for(int[] edge:graph.get(u)) distance[edge[0]]=Math.min(distance[edge[0]],distance[u]+edge[1]);
}
return distance[target]==inf ? -1 : distance[target];`, 'O(n² + m)','O(n + m)');
add('dsu','A',[['I','n'],['M','edges']], 'graph',
`vector<int> parent(n), size(n,1), answers; iota(parent.begin(),parent.end(),0);
auto root = [&](int x) { while(x!=parent[x]) { parent[x]=parent[parent[x]]; x=parent[x]; } return x; };
int components=n;
for(const auto& edge:edges) {
    int a=root(edge[0]), b=root(edge[1]);
    if(a!=b) { if(size[a]<size[b]) swap(a,b); parent[b]=a; size[a]+=size[b]; --components; }
    answers.push_back(components);
}
return answers;`,
`int[] parent=new int[n], size=new int[n], answers=new int[edges.length];
for(int i=0;i<n;++i) { parent[i]=i; size[i]=1; }
int components=n;
for(int i=0;i<edges.length;++i) {
    int a=edges[i][0], b=edges[i][1];
    while(a!=parent[a]) { parent[a]=parent[parent[a]]; a=parent[a]; }
    while(b!=parent[b]) { parent[b]=parent[parent[b]]; b=parent[b]; }
    if(a!=b) { if(size[a]<size[b]) { int temp=a; a=b; b=temp; } parent[b]=a; size[a]+=size[b]; --components; }
    answers[i]=components;
}
return answers;`, 'O((n + q) α(n))','O(n + q)');
add('coin-min','I',[['A','coins'],['I','target']], 'nKA',
`vector<int> dp(target+1, target+1); dp[0]=0;
for(int amount=1;amount<=target;++amount) for(int coin:coins) if(coin<=amount) dp[amount]=min(dp[amount],dp[amount-coin]+1);
return dp[target]>target ? -1 : dp[target];`,
`int[] dp=new int[target+1]; Arrays.fill(dp,target+1); dp[0]=0;
for(int amount=1;amount<=target;++amount) for(int coin:coins) if(coin<=amount) dp[amount]=Math.min(dp[amount],dp[amount-coin]+1);
return dp[target]>target ? -1 : dp[target];`, 'O(n × target)','O(target)');
add('lis','I',[['A','nums']], 'nA',
`vector<int> tails;
for(int value:nums) { auto position=lower_bound(tails.begin(),tails.end(),value); if(position==tails.end()) tails.push_back(value); else *position=value; }
return tails.size();`,
`int[] tails=new int[nums.length]; int length=0;
for(int value:nums) {
    int left=0,right=length;
    while(left<right) { int mid=(left+right)/2; if(tails[mid]<value) left=mid+1; else right=mid; }
    tails[left]=value; if(left==length) ++length;
}
return length;`, 'O(n log n)','O(n)');
add('knapsack','L',[['M','items'],['I','capacity']], 'nKM',
`vector<long long> dp(capacity+1);
for(const auto& item:items) for(int c=capacity;c>=item[0];--c) dp[c]=max(dp[c],dp[c-item[0]]+item[1]);
return dp[capacity];`,
`long[] dp=new long[capacity+1];
for(int[] item:items) for(int c=capacity;c>=item[0];--c) dp[c]=Math.max(dp[c],dp[c-item[0]]+item[1]);
return dp[capacity];`, 'O(n × capacity)','O(capacity)');
add('grid-routes','I',[['W','grid']], 'grid',
`int rows=grid.size(), cols=grid[0].size(); vector<int> dp(cols); dp[0]=1;
for(int i=0;i<rows;++i) for(int j=0;j<cols;++j) dp[j]=grid[i][j]=='#' ? 0 : (dp[j]+(j ? dp[j-1] : 0))%1000000007;
return dp.back();`,
`int rows=grid.length, cols=grid[0].length(); int[] dp=new int[cols]; dp[0]=1;
for(int i=0;i<rows;++i) for(int j=0;j<cols;++j) dp[j]=grid[i].charAt(j)=='#' ? 0 : (dp[j]+(j>0 ? dp[j-1] : 0))%1000000007;
return dp[cols-1];`, 'O(rows × cols)','O(cols)');
add('edit-distance','I',[['S','first'],['S','second']], 'SS',
`vector<int> dp(second.size()+1); iota(dp.begin(),dp.end(),0);
for(int i=1;i<=(int)first.size();++i) {
    vector<int> row(second.size()+1); row[0]=i;
    for(int j=1;j<=(int)second.size();++j) row[j]=min({dp[j]+1,row[j-1]+1,dp[j-1]+(first[i-1]!=second[j-1])});
    dp=move(row);
}
return dp.back();`,
`int[] dp=new int[second.length()+1]; for(int j=0;j<dp.length;++j) dp[j]=j;
for(int i=1;i<=first.length();++i) {
    int[] row=new int[second.length()+1]; row[0]=i;
    for(int j=1;j<=second.length();++j) row[j]=Math.min(Math.min(dp[j]+1,row[j-1]+1),dp[j-1]+(first.charAt(i-1)==second.charAt(j-1)?0:1));
    dp=row;
}
return dp[second.length()];`, 'O(n × m)','O(m)');
add('lcs','I',[['S','first'],['S','second']], 'SS',
`vector<int> dp(second.size()+1);
for(char c:first) {
    vector<int> row(second.size()+1);
    for(int j=1;j<=(int)second.size();++j) row[j]=c==second[j-1] ? dp[j-1]+1 : max(dp[j],row[j-1]);
    dp=move(row);
}
return dp.back();`,
`int[] dp=new int[second.length()+1];
for(char c:first.toCharArray()) {
    int[] row=new int[second.length()+1];
    for(int j=1;j<=second.length();++j) row[j]=c==second.charAt(j-1) ? dp[j-1]+1 : Math.max(dp[j],row[j-1]);
    dp=row;
}
return dp[second.length()];`, 'O(n × m)','O(m)');
add('activity-selection','I',[['M','meetings']], 'nM',
`sort(meetings.begin(),meetings.end(),[](const auto& a,const auto& b){return a[1]<b[1];});
int end=-1,count=0;
for(const auto& meeting:meetings) if(meeting[0]>=end) { ++count; end=meeting[1]; }
return count;`,
`Arrays.sort(meetings,Comparator.comparingInt(a -> a[1])); int end=-1,count=0;
for(int[] meeting:meetings) if(meeting[0]>=end) { ++count; end=meeting[1]; }
return count;`, 'O(n log n)','O(n) conservative including sorting workspace');
add('minimum-jumps','I',[['A','nums']], 'nA',
`int end=0,farthest=0,jumps=0;
for(int i=0;i<(int)nums.size()-1;++i) {
    farthest=max(farthest,i+nums[i]);
    if(i==end) { if(farthest<=i) return -1; ++jumps; end=farthest; }
}
return jumps;`,
`int end=0,farthest=0,jumps=0;
for(int i=0;i<nums.length-1;++i) {
    farthest=Math.max(farthest,i+nums[i]);
    if(i==end) { if(farthest<=i) return -1; ++jumps; end=farthest; }
}
return jumps;`, 'O(n)','O(1)');
add('k-largest','A',[['A','nums'],['I','k']], 'nKA',
`priority_queue<int,vector<int>,greater<int>> heap;
for(int value:nums) { heap.push(value); if((int)heap.size()>k) heap.pop(); }
vector<int> answer(k); for(int i=k-1;i>=0;--i) { answer[i]=heap.top(); heap.pop(); }
return answer;`,
`PriorityQueue<Integer> heap=new PriorityQueue<>();
for(int value:nums) { heap.add(value); if(heap.size()>k) heap.poll(); }
int[] answer=new int[k]; for(int i=k-1;i>=0;--i) answer[i]=heap.poll();
return answer;`, 'O(n log(k + 1))','O(k)');
add('merge-sorted','A',[['M','streams']], 'streams',
`using Entry=tuple<int,int,int>;
priority_queue<Entry,vector<Entry>,greater<Entry>> heap;
for(int i=0;i<(int)streams.size();++i) if(!streams[i].empty()) heap.push({streams[i][0],i,0});
vector<int> answer;
while(!heap.empty()) {
    auto [value,stream,index]=heap.top(); heap.pop(); answer.push_back(value);
    if(index+1<(int)streams[stream].size()) heap.push({streams[stream][index+1],stream,index+1});
}
return answer;`,
`PriorityQueue<int[]> heap=new PriorityQueue<>(Comparator.comparingInt(a -> a[0])); int total=0;
for(int i=0;i<streams.length;++i) { total+=streams[i].length; if(streams[i].length>0) heap.add(new int[]{streams[i][0],i,0}); }
int[] answer=new int[total]; int write=0;
while(!heap.isEmpty()) {
    int[] entry=heap.poll(); int value=entry[0],stream=entry[1],index=entry[2]; answer[write++]=value;
    if(index+1<streams[stream].length) heap.add(new int[]{streams[stream][index+1],stream,index+1});
}
return answer;`, 'O(total × log(k + 1))','O(k) auxiliary + output');
add('single-xor','I',[['A','nums']], 'nA',
`int answer=0; for(int value:nums) answer^=value; return answer;`,
`int answer=0; for(int value:nums) answer^=value; return answer;`, 'O(n)','O(1)');
add('set-bits','I',[['I','value']], 'I',
`int count=0; while(value) { value&=value-1; ++count; } return count;`,
`int count=0; while(value!=0) { value&=value-1; ++count; } return count;`, 'O(number of set bits)','O(1)');
add('gcd','L',[['L','first'],['L','second']], 'LL',
`while(second) { long long remainder=first%second; first=second; second=remainder; } return first;`,
`while(second!=0) { long remainder=first%second; first=second; second=remainder; } return first;`, 'O(log(max(a,b)))','O(1)');
add('prime-count','I',[['I','n']], 'I',
`vector<bool> composite(n+1);
for(int p=2;p*p<=n;++p) if(!composite[p]) for(int multiple=p*p;multiple<=n;multiple+=p) composite[multiple]=true;
int count=0; for(int i=2;i<=n;++i) if(!composite[i]) ++count; return count;`,
`boolean[] composite=new boolean[n+1];
for(int p=2;p*p<=n;++p) if(!composite[p]) for(int multiple=p*p;multiple<=n;multiple+=p) composite[multiple]=true;
int count=0; for(int i=2;i<=n;++i) if(!composite[i]) ++count; return count;`, 'O(n log log n)','O(n)');
add('subset-count','I',[['A','nums'],['I','target']], 'nKA',
`function<int(int,int)> search = [&](int index,int sum) {
    if(index==(int)nums.size()) return sum==target ? 1 : 0;
    return search(index+1,sum)+search(index+1,sum+nums[index]);
};
return search(0,0);`,
`int count=0;
for(int mask=0;mask<(1<<nums.length);++mask) {
    int sum=0; for(int i=0;i<nums.length;++i) if((mask & (1<<i))!=0) sum+=nums[i];
    if(sum==target) ++count;
}
return count;`, 'C++: O(2^n); Java: O(n × 2^n)','C++: O(n); Java: O(1)');
module.exports=specs;
