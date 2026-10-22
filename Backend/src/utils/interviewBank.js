const companies = {
  Google: { focus: 'algorithmic reasoning, edge cases and clear trade-offs', scenario: 'a large-scale search product' },
  Amazon: { focus: 'customer impact, ownership and reliable systems', scenario: 'an e-commerce checkout service' },
  Microsoft: { focus: 'collaboration, accessibility and maintainable design', scenario: 'a collaborative productivity app' },
  Meta: { focus: 'fast iteration, product impact and scalable data access', scenario: 'a social feed product' },
  Uber: { focus: 'real-time decisions, reliability and geospatial scale', scenario: 'a ride-matching service' },
  General: { focus: 'fundamentals, communication and practical engineering', scenario: 'a customer-facing web application' },
};
const roles = ['Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer'];
const rounds = ['DSA', 'System Design', 'Behavioral', 'Role Fundamentals'];
const difficulties = ['easy', 'medium', 'hard'];
function validateConfig(body = {}) {
  const config = { company: body.company || 'General', role: body.role || 'Software Engineer', round: body.round || 'DSA', difficulty: body.difficulty || 'medium', experience: body.experience || 'Entry level' };
  if (!Object.hasOwn(companies, config.company) || !roles.includes(config.role) || !rounds.includes(config.round) || !difficulties.includes(config.difficulty) || !['Student', 'Entry level', 'Experienced'].includes(config.experience)) throw Object.assign(new Error('Choose a supported company, role, round, difficulty and experience level.'), { statusCode: 400 });
  return config;
}
function guidedQuestions(config) {
  const { scenario, focus } = companies[config.company];
  const scale = config.difficulty === 'easy' ? 'Start with a small input and explain a simple working approach.' : config.difficulty === 'hard' ? 'Cover concurrency or scale constraints, failure modes and alternative approaches.' : 'Explain trade-offs, edge cases and how you would test your approach.';
  const bank = {
    DSA: [
      ['Duplicate event detection', `In ${scenario}, events have an ID and timestamp. Detect duplicate IDs within a sliding time window. Explain your data structures and complexity.`, ['Clarify window boundaries and ordering', 'Explain time and space complexity', 'Test duplicate and expired events']],
      ['Top K items', `Find the K most frequently requested items in ${scenario}. Compare sorting with a heap and discuss ties.`, ['Define ties and K edge cases', 'Compare heap and sorting complexity', 'Discuss memory usage']],
      ['Dependency ordering', `Features in ${scenario} have dependencies. Produce a valid execution order or detect a cycle.`, ['Represent the directed graph', 'Explain topological order and cycle detection', 'Handle disconnected components']],
      ['Merge ordered streams', `Merge sorted event streams from several services in ${scenario}. Describe a solution without loading everything into memory.`, ['Use a bounded data structure', 'State assumptions about stream ordering', 'Discuss complexity and empty streams']],
      ['Follow-up challenge', `Choose one of your previous approaches. How would you adapt it if memory were limited and inputs arrived continuously?`, ['Explain what state is retained', 'Consider approximation versus exactness', 'Describe backpressure and testing']],
    ],
    'System Design': [
      ['Requirements', `Design ${scenario}. Clarify functional requirements, latency, scale and availability before proposing components.`, ['Ask concrete clarifying questions', 'Estimate load with explicit assumptions', 'Prioritize requirements']],
      ['API and storage', `Define the core APIs and data model for ${scenario}. Explain your database choice and access patterns.`, ['Show request and response contracts', 'Choose keys and indexes', 'Explain consistency trade-offs']],
      ['Reliability', `A dependency of ${scenario} becomes slow. How do you prevent cascading failures while keeping the user experience useful?`, ['Set timeouts and bounded retries', 'Describe degradation and idempotency', 'Identify observability signals']],
      ['Scaling', `Traffic to ${scenario} grows tenfold. Identify the bottleneck, then explain caching, queues or partitioning choices.`, ['Measure before scaling', 'Address invalidation and hot keys', 'Discuss capacity and cost']],
      ['Design review', `Review the security, deployment and recovery plan for ${scenario}. What would you ship first and how would you validate it?`, ['Address auth and sensitive data', 'Describe rollout and rollback', 'Define recovery and testing']],
    ],
    Behavioral: [
      ['Ownership', `Tell me about a time you took ownership of an ambiguous engineering problem. Connect your example to ${focus}.`, ['Describe situation and responsibility', 'Explain your own actions', 'Share an honest outcome and learning']],
      ['Trade-offs', 'Describe a time you chose between delivery speed and engineering quality. How did you communicate the trade-off?', ['State constraints', 'Explain decision and alternatives', 'Describe follow-through']],
      ['Collaboration', 'Tell me about a technical disagreement with a teammate. How did you reach a decision?', ['Represent both viewpoints fairly', 'Explain evidence and communication', 'Share what changed']],
      ['Failure and learning', 'Describe a mistake or unsuccessful project. How did you respond and prevent recurrence?', ['Own your part', 'Explain recovery steps', 'Give a concrete learning']],
      ['Customer impact', `If you joined a team building ${scenario}, how would you learn what users need and prioritize your first month?`, ['Ask about users and success measures', 'Seek context from teammates', 'Propose a realistic learning plan']],
    ],
    'Role Fundamentals': config.role === 'Frontend Developer' ? [
      ['Rendering', `Build a responsive interface for ${scenario}. Explain component boundaries, state ownership and rendering performance.`, ['Separate state by ownership', 'Discuss memoization with evidence', 'Cover loading and empty states']],
      ['Async state', 'A search box fires requests while the user types. Responses arrive out of order. Design a reliable implementation.', ['Debounce where useful', 'Cancel or ignore stale responses', 'Handle errors and accessibility']],
      ['Browser fundamentals', 'Explain the JavaScript event loop, microtasks and rendering using a concrete example.', ['Distinguish stack and queues', 'Explain promise ordering', 'Discuss UI responsiveness']],
      ['Accessibility', `How would you make the core flow of ${scenario} usable with keyboard navigation and a screen reader?`, ['Use semantic controls', 'Manage focus and labels', 'Test contrast and keyboard use']],
      ['Testing', 'Design tests for a form with validation and an API request. What belongs in unit, integration and browser tests?', ['Test behavior and failure paths', 'Cover validation and async states', 'Avoid implementation-only assertions']],
    ] : [
      ['API design', `Design an API endpoint for ${scenario}. Explain validation, authorization and error responses.`, ['Define contract and validation', 'Separate authentication and authorization', 'Use clear status codes']],
      ['Data consistency', 'Two requests update the same record simultaneously. Explain how you would prevent lost updates.', ['Describe the race condition', 'Use transactions or optimistic locking', 'Test concurrency']],
      ['Async work', `A slow operation in ${scenario} should run asynchronously. Explain queues, retries and idempotency.`, ['Keep retries bounded', 'Handle duplicate deliveries', 'Monitor failed jobs']],
      ['Debugging', 'An endpoint is slow in production but fast locally. Describe your investigation, in order.', ['Inspect traces and latency breakdown', 'Check database and dependency behavior', 'Validate a fix with measurements']],
      ['Testing and delivery', `How would you safely release a change to ${scenario} that modifies a database schema?`, ['Plan compatible migrations', 'Test rollback and rollout', 'Monitor meaningful signals']],
    ],
  };
  return bank[config.round].map(([title, prompt, checklist]) => ({ title, prompt: `${prompt} ${scale} Tailor your answer to a ${config.experience.toLowerCase()} ${config.role.toLowerCase()} role.`, checklist }));
}
module.exports = { companies, roles, rounds, difficulties, validateConfig, guidedQuestions };
