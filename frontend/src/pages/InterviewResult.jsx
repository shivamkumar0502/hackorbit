import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { CheckCircle2, ArrowRight, FileText, Target } from 'lucide-react';
import PlatformNav from '../components/PlatformNav';
import axiosClient from '../utils/axiosClient';
import './Platform.css';
import './Interview.css';
export default function InterviewResult() {
  const { sessionId } = useParams();
  const [report, setReport] = useState(null), [error, setError] = useState(''), [retry, setRetry] = useState(0);
  useEffect(() => {
    if (!sessionId) return;
    const controller = new AbortController();
    axiosClient.get(`/interview/sessions/${sessionId}/report`, { signal: controller.signal }).then(res => { setReport(res.data.report); setError(''); }).catch(err => { if (!controller.signal.aborted) setError(err.response?.data?.message || 'Unable to load report.'); });
    return () => controller.abort();
  }, [sessionId, retry]);
  if (!sessionId) return <div className="hub-state"><h2>No interview report selected.</h2><Link to="/interview">Choose an interview →</Link></div>;
  if (!report) return <div className="hub-state">{error ? <><p role="alert">{error}</p><button onClick={() => setRetry(value => value + 1)}>Retry</button></> : 'Loading your report…'}</div>;
  return <main className="hub-page"><PlatformNav /><header className="report-heading"><span className="hub-eyebrow">YOUR PRACTICE REPORT</span><h1>{report.config.company} · {report.config.round}</h1><p>{report.config.role} · {report.config.difficulty} · {report.config.experience}</p></header><div className="report-summary"><section className="hub-card report-total"><CheckCircle2 size={24} /><strong>{report.answeredCount}<span> / {report.totalQuestions}</span></strong><p>Questions answered</p></section><section className="hub-card report-total"><Target size={24} /><strong>{report.evaluatedCount}</strong><p>Answers evaluated by AI</p></section><section className="hub-card report-total"><FileText size={24} /><strong>{report.scores.overall === null ? '—' : `${report.scores.overall}/10`}</strong><p>{report.scores.overall === null ? 'Self-review session · no AI score' : 'Average practice score'}</p></section></div><div className="hub-notice">{report.notice}</div>{report.scores.overall !== null && <div className="report-score-breakdown">{[['technical', 'Technical'], ['clarity', 'Clarity'], ['problemSolving', 'Reasoning']].map(([key, label]) => <span key={key}>{label}<b>{report.scores[key]}/10</b></span>)}</div>}<div className="report-answers">{report.questions.map((question, i) => <article key={i} className="hub-card report-answer"><div className="question-meta"><span>QUESTION {i + 1}</span><span>{question.response ? 'Answered' : 'Not answered'}</span></div><h2>{question.title}</h2><p>{question.prompt}</p>{question.response ? <><h3>Your answer</h3><pre>{question.response.answer}</pre><h3>{question.response.feedback?.source === 'ai' ? 'AI feedback' : 'Self-review checklist'}</h3><p>{question.response.feedback?.feedback}</p><ul>{(question.response.feedback?.improvements || question.checklist).map((point, index) => <li key={index}>{point}</li>)}</ul></> : <p className="hub-muted">This question has no saved answer.</p>}<details><summary>Review points</summary><ul>{question.checklist.map((point, index) => <li key={index}>{point}</li>)}</ul></details></article>)}</div><div className="report-actions"><Link className="hub-button primary" to={`/interview?company=${report.config.company}`}>Practice another round<ArrowRight size={16} /></Link><Link to="/practice" className="hub-link">Back to coding practice</Link></div></main>;
}
