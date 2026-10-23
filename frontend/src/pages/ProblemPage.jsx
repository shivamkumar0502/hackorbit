import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router';
import { useSelector } from 'react-redux';
import Editor from '@monaco-editor/react';
import confetti from 'canvas-confetti';
import { Play, Send, RotateCcw, Code2, ChevronLeft } from 'lucide-react';
import axiosClient from '../utils/axiosClient';
import SubmissionHistory from '../components/SubmissionHistory';
import ChatAi from '../components/ChatAi';
import RevisionEditor from '../components/RevisionEditor';
import Editorial from '../components/Editorial';
import ProblemHints from '../components/ProblemHints';
import ProblemDiscussion from '../components/ProblemDiscussion';
import './ProblemPage.css';

const languages = { javascript: 'JavaScript', java: 'Java', cpp: 'C++' };
const errorText = error => typeof error.response?.data === 'string' ? error.response.data : error.response?.data?.message || error.message;
const starter = (problem, language) => problem.startCode?.find(item => item.language?.toLowerCase() === languages[language].toLowerCase())?.initialCode || '';

export default function ProblemPage() {
  const { problemId } = useParams();
  const userId = useSelector(state => state.auth.user?._id);
  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState('javascript');
  const [drafts, setDrafts] = useState({});
  const [tab, setTab] = useState('description');
  const [resultTab, setResultTab] = useState('testcases');
  const [caseIndex, setCaseIndex] = useState(0);
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(null);
  const [celebrating, setCelebrating] = useState(false);
  const celebrationTimer = useRef(null);
  useEffect(() => () => clearTimeout(celebrationTimer.current), []);
  const [error, setError] = useState('');
  const [fetchError, setFetchError] = useState('');
  const [reload, setReload] = useState(0);
  const [historyVersion, setHistoryVersion] = useState(0);
  const running = useRef(false);
  const generation = useRef(0);
  const storageKey = `hackorbit:drafts:${userId}:${problemId}`;
  const code = drafts[language] ?? (problem ? starter(problem, language) : '');

  useEffect(() => {
    const controller = new AbortController();
    generation.current += 1;
    setCelebrating(false); clearTimeout(celebrationTimer.current);
    setProblem(null); setFetchError(''); setResult(null); setError(''); setCaseIndex(0);
    setTab('description'); setResultTab('testcases');
    try { setDrafts(JSON.parse(localStorage.getItem(storageKey) || '{}') || {}); } catch { setDrafts({}); }
    axiosClient.get(`/problem/problemById/${problemId}`, { signal: controller.signal })
      .then(response => setProblem(response.data))
      .catch(err => { if (!controller.signal.aborted) setFetchError(errorText(err)); });
    return () => controller.abort();
  }, [problemId, storageKey, reload]);

  function changeCode(value) {
    const next = { ...drafts, [language]: value || '' };
    setDrafts(next);
    try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* Editing remains available without browser storage. */ }
  }

  async function execute(mode) {
    if (running.current || !problem || !code.trim()) return;
    running.current = true;
    const current = generation.current;
    setBusy(mode); setError(''); setResult(null); setResultTab('result'); setCaseIndex(0);
    try {
      const response = await axiosClient.post(`/submission/${mode}/${problemId}`, { code, language });
      if (current !== generation.current) return;
      setResult({ ...response.data, mode });
      if (mode === 'submit' && response.data.accepted === true) {
        setCelebrating(true);
        clearTimeout(celebrationTimer.current);
        celebrationTimer.current = setTimeout(() => setCelebrating(false), 4500);
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          for (const x of [0.12, 0.5, 0.88]) confetti({ particleCount: 90, spread: 100, origin: { x, y: 0.65 }, colors: ['#ffa116', '#45ce9a', '#60a5fa', '#f472b6'], disableForReducedMotion: true });
        }
      }
      if (mode === 'submit') setHistoryVersion(value => value + 1);
    } catch (err) { if (current === generation.current) setError(errorText(err)); }
    finally { running.current = false; setBusy(null); }
  }

  if (!problem) return <div className="workspace-state">{fetchError ? <><p role="alert">{fetchError}</p><button onClick={() => setReload(value => value + 1)}>Retry</button><Link to="/home">Back to problems</Link></> : <p role="status">Loading problem…</p>}</div>;
  const cases = problem.visibleTestCases || [];
  const test = result?.testCases?.[caseIndex];
  const example = cases[caseIndex];
  const accepted = result?.accepted === true || result?.success === true;
  return <main className="coding-workspace">
    {celebrating && <div role="status" className="accepted-celebration"><button aria-label="Dismiss congratulations" onClick={() => setCelebrating(false)}>×</button><span>🏆</span><h2>Congratulations!</h2><p>All testcases passed. Problem solved!</p></div>}
    <header className="workspace-header">
      <Link to="/home" className="workspace-brand"><Code2 size={23} /> HackOrbit</Link>
      <Link to="/home" className="problem-list-link"><ChevronLeft size={16} /> Problem List</Link>
      <div className="workspace-actions">
        <button disabled={!!busy || !code.trim()} onClick={() => execute('run')}><Play size={15} />{busy === 'run' ? 'Running…' : 'Run'}</button>
        <button className="submit-code" disabled={!!busy || !code.trim()} onClick={() => execute('submit')}><Send size={15} />{busy === 'submit' ? 'Judging…' : 'Submit'}</button>
      </div>
    </header>
    <div className="workspace-panels">
      <section className="statement-panel workspace-card">
        <nav className="workspace-tabs" aria-label="Problem information">
          {['description', 'editorial', 'solutions', 'submissions', 'assistant', 'hints', 'discussion', 'notes'].map(name => <button key={name} aria-pressed={tab === name} className={tab === name ? 'selected' : ''} onClick={() => setTab(name)}>{name}</button>)}
        </nav>
        <div className="statement-content">
          {tab === 'description' && <><h1>{problem.title}</h1><div className="problem-meta"><span className={`difficulty ${problem.difficulty?.toLowerCase()}`}>{problem.difficulty}</span>{(Array.isArray(problem.tags) ? problem.tags : [problem.tags]).filter(Boolean).map(tag => <span key={tag}>{tag}</span>)}</div><div className="problem-description">{problem.description}</div>{cases.map((item, i) => <article className="example" key={i}><h3>Example {i + 1}</h3><div><p><b>Input: </b><code>{item.input}</code></p><p><b>Output: </b><code>{item.output}</code></p>{item.explanation && <p><b>Explanation: </b>{item.explanation}</p>}</div></article>)}</>}
          {tab === 'editorial' && <Editorial secureUrl={problem.secureUrl} thumbnailUrl={problem.thumbnailUrl} duration={problem.duration} />}
          {tab === 'solutions' && (problem.referenceSolution?.length ? problem.referenceSolution.map((solution, i) => <article key={i}><h3>{solution.language}</h3><pre>{solution.completeCode}</pre></article>) : <p>No solutions published yet.</p>)}
          {tab === 'submissions' && <SubmissionHistory key={historyVersion} problemId={problemId} />}
          {tab === 'hints' && <ProblemHints key={problemId} problemId={problemId}/>}
          {tab === 'discussion' && <ProblemDiscussion key={problemId} problemId={problemId}/>}
          {tab === 'notes' && <RevisionEditor key={problemId} problemId={problemId} />}
          {tab === 'assistant' && <ChatAi key={problemId} problem={problem} editorCode={code} />}
        </div>
      </section>
      <div className="editor-column">
        <section className="editor-panel workspace-card">
          <div className="editor-title"><span><Code2 size={16} /> Code</span><span className="draft-label">Local draft</span></div>
          <div className="editor-toolbar"><select aria-label="Programming language" value={language} disabled={!!busy} onChange={event => setLanguage(event.target.value)}>{Object.entries(languages).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><button title="Reset current language to starter code" aria-label="Reset current language to starter code" onClick={() => { if (window.confirm('Replace this language draft with starter code?')) changeCode(starter(problem, language)); }}><RotateCcw size={15} /></button></div>
          <div className="monaco-container"><Editor path={`${problemId}/${language}`} language={language} value={code} onChange={changeCode} theme="vs-dark" options={{ minimap: { enabled: false }, fontSize: 14, padding: { top: 18 }, scrollBeyondLastLine: false, automaticLayout: true, readOnly: !!busy }} /></div>
        </section>
        <section className="test-panel workspace-card">
          <nav className="workspace-tabs" aria-label="Execution panel"><button className={resultTab === 'testcases' ? 'selected' : ''} onClick={() => setResultTab('testcases')}>Testcases</button><button className={resultTab === 'result' ? 'selected' : ''} onClick={() => setResultTab('result')}>Test Result</button></nav>
          <div className="test-content" aria-live="polite">
            {resultTab === 'testcases' ? <><div className="case-tabs">{cases.map((_, i) => <button key={i} className={caseIndex === i ? 'selected' : ''} onClick={() => setCaseIndex(i)}>Case {i + 1}</button>)}</div>{example ? <><label>Input</label><pre>{example.input}</pre><label>Expected output</label><pre>{example.output}</pre></> : <p>No sample testcases available.</p>}</> : busy ? <p>Executing code. Please wait…</p> : error ? <p role="alert" className="verdict failed">{error}</p> : !result ? <p>Run your code to see the test results here.</p> : <><h2 className={`verdict ${accepted ? 'passed' : 'failed'}`}>{accepted ? (result.mode === 'submit' ? 'Accepted' : 'All sample tests passed') : result.status === 'error' ? 'Execution Error' : 'Tests failed'}</h2><p>Runtime: {result.runtime ?? '—'} sec · Memory: {result.memory ?? '—'} KB</p>{result.mode === 'submit' && <p>{result.passedTestCases} / {result.totalTestCases} testcases passed</p>}{result.errorMessage && <pre>{result.errorMessage}</pre>}{result.testCases && <><div className="case-tabs">{result.testCases.map((item, i) => <button key={i} className={caseIndex === i ? 'selected' : ''} onClick={() => setCaseIndex(i)}><span className={Number(item.status_id ?? item.status?.id) === 3 ? 'passed' : 'failed'}>●</span> Case {i + 1}</button>)}</div>{test && <><p>{test.status?.description || (Number(test.status_id) === 3 ? 'Accepted' : 'Failed')}</p><label>Input</label><pre>{cases[caseIndex]?.input ?? test.stdin}</pre><label>Output</label><pre>{test.stdout ?? '(no output)'}</pre><label>Expected output</label><pre>{cases[caseIndex]?.output}</pre>{(test.stderr || test.compile_output) && <pre className="failed">{test.stderr || test.compile_output}</pre>}</>}</>}</>}
          </div>
        </section>
      </div>
    </div>
  </main>;
}
