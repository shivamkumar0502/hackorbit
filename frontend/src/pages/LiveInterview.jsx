import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { ArrowLeft, ArrowRight, Mic, MicOff, Volume2, Clock, CheckCircle2, Send, Building2, Flag } from 'lucide-react';
import { useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import './Platform.css';
import './Interview.css';
const errorMessage = error => error.response?.data?.message || 'Request failed. Please try again.';
export default function LiveInterview() {
  const { sessionId } = useParams();
  const userId = useSelector(state => state.auth.user?._id);
  const [session, setSession] = useState(null), [index, setIndex] = useState(0), [answer, setAnswer] = useState(''), [feedback, setFeedback] = useState(null), [error, setError] = useState(''), [busy, setBusy] = useState(false), [listening, setListening] = useState(false), [timeLeft, setTimeLeft] = useState(300), [retry, setRetry] = useState(0);
  const recognition = useRef(null), processing = useRef(false), savedResponses = useRef({});
  const navigate = useNavigate();
  const draftKey = `hackorbit:interview:${userId}:${sessionId}:${index}`;
  useEffect(() => {
    if (!sessionId) return;
    const controller = new AbortController();
    axiosClient.get(`/interview/sessions/${sessionId}`, { signal: controller.signal }).then(res => { savedResponses.current = Object.fromEntries((res.data.answers || []).filter(Boolean).map(item => [item.index, item])); setSession(res.data); const firstUnanswered = res.data.questions.findIndex((_, i) => !savedResponses.current[i]); setIndex(firstUnanswered < 0 ? 0 : firstUnanswered); setError(''); }).catch(err => { if (!controller.signal.aborted) setError(errorMessage(err)); });
    return () => controller.abort();
  }, [sessionId, retry]);
  useEffect(() => {
    if (!session) return;
    const saved = savedResponses.current[index];
    let draft;
    try { draft = localStorage.getItem(draftKey); } catch { /* Browser storage is optional. */ }
    setAnswer(draft ?? saved?.answer ?? ''); setFeedback(saved || null); setTimeLeft(300); setError('');
    return () => { recognition.current?.stop(); recognition.current = null; window.speechSynthesis?.cancel(); };
  }, [index, session, draftKey]);
  useEffect(() => { const timer = setInterval(() => setTimeLeft(value => Math.max(0, value - 1)), 1000); return () => clearInterval(timer); }, []);
  function edit(value) { setAnswer(value); setFeedback(null); try { localStorage.setItem(draftKey, value); } catch { /* Editing remains available. */ } }
  function stopVoice() { recognition.current?.stop(); setListening(false); }
  function startVoice() {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) { setError('Voice input is not supported in this browser. You can type your answer.'); return; }
    const instance = new Recognition(); recognition.current = instance;
    instance.continuous = true; instance.interimResults = false; instance.lang = 'en-IN';
    const initial = answer;
    instance.onresult = event => { let spoken = ''; for (let i = 0; i < event.results.length; i++) if (event.results[i].isFinal) spoken += `${event.results[i][0].transcript} `; edit(`${initial} ${spoken}`.trim()); };
    instance.onerror = event => { setError(event.error === 'not-allowed' ? 'Microphone permission was denied. Type your answer or enable it in your browser.' : 'Voice input stopped. You can continue by typing.'); setListening(false); };
    instance.onend = () => setListening(false);
    try { instance.start(); setListening(true); setError(''); } catch { setError('Unable to start voice input. Try again or type your answer.'); }
  }
  async function saveAnswer() {
    if (processing.current || !answer.trim()) return;
    stopVoice(); processing.current = true; setBusy(true); setError('');
    try {
      const response = await axiosClient.post('/interview/evaluate', { sessionId, index, answer }, { timeout: 35000 });
      savedResponses.current[index] = response.data;
      setFeedback(response.data);
      // Keep the current draft visible; save response data without reinitializing the session.
    } catch (err) { setError(errorMessage(err)); }
    finally { processing.current = false; setBusy(false); }
  }
  async function finish() {
    if (processing.current) return;
    if (!window.confirm('Finish this interview? Save your current answer first if you want it in the report.')) return;
    stopVoice(); processing.current = true; setBusy(true); setError('');
    try { await axiosClient.post('/interview/report', { sessionId }); navigate(`/interview-result/${sessionId}`); }
    catch (err) { setError(errorMessage(err)); processing.current = false; setBusy(false); }
  }
  if (!sessionId) return <div className="hub-state"><h2>Choose your company and round first.</h2><Link to="/interview">Set up an interview →</Link></div>;
  if (!session) return <div className="hub-state">{error ? <><p role="alert">{error}</p><button onClick={() => setRetry(value => value + 1)}>Retry</button></> : 'Loading your interview…'}<Link to="/interview">Back to interviews</Link></div>;
  if (session.status === 'completed') return <div className="hub-state"><h2>This interview is complete.</h2><Link to={`/interview-result/${sessionId}`}>View your report →</Link></div>;
  const question = session.questions[index];
  const next = direction => { stopVoice(); setIndex(value => value + direction); };
  return <main className="hub-page interview-room"><header className="room-header"><Link to="/interview"><ArrowLeft size={16} /> All interviews</Link><span><Building2 size={17} />{session.config.company} · {session.config.round}</span><button className="hub-button secondary" disabled={busy} onClick={finish}><Flag size={15} /> Finish interview</button></header><div className="hub-notice">{session.notice}</div><div className="room-progress">{session.questions.map((item, i) => <button disabled={busy} className={i === index ? 'current' : ''} aria-label={`Question ${i + 1}: ${item.title}`} key={i} onClick={() => { stopVoice(); setIndex(i); }}><span>{i + 1}</span>{item.title}</button>)}</div><div className="room-layout"><section className="hub-card question-card"><div className="question-meta"><span>QUESTION {index + 1} OF {session.questions.length}</span><span><Clock size={14} />{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</span></div><h1>{question.title}</h1><p className="interview-question">{question.prompt}</p><div className="question-context"><p>{session.config.role}</p><span>{session.config.difficulty} · {session.config.experience}</span></div><button className="read-question" onClick={() => { if ('speechSynthesis' in window) { window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance(question.prompt)); } }}><Volume2 size={16} /> Read question aloud</button>{timeLeft === 0 && <p className="timer-notice">Five minutes are up. Take more time if needed; your answer will not be submitted automatically.</p>}<div className="answer-guidance"><h3>A strong answer</h3><ol><li>Clarify assumptions and requirements.</li><li>Explain your reasoning step by step.</li><li>Discuss trade-offs and test your approach.</li></ol></div></section><section className="hub-card answer-card"><div className="answer-heading"><h2>Your answer</h2><span>Draft saved in this browser</span></div><textarea aria-label="Your interview answer" maxLength={12000} placeholder="Think aloud in writing. Include your approach, code or pseudocode, complexity and edge cases where relevant…" value={answer} disabled={busy || listening} onChange={event => edit(event.target.value)} /><div className="answer-toolbar"><button className={`hub-button secondary ${listening ? 'is-listening' : ''}`} disabled={busy} onClick={listening ? stopVoice : startVoice}>{listening ? <MicOff size={16} /> : <Mic size={16} />}{listening ? 'Stop voice input' : 'Use voice input'}</button><span>{answer.length}/12000</span><button className="hub-button primary" disabled={busy || !answer.trim()} onClick={saveAnswer}><Send size={15} />{busy ? 'Saving…' : 'Save & review'}</button></div>{error && <div className="hub-error" role="alert">{error}</div>}{feedback && <article className="answer-feedback" aria-live="polite"><h3><CheckCircle2 size={17} />Answer saved · {feedback.feedback.source === 'ai' ? 'AI feedback' : 'Self-review'}</h3><p>{feedback.feedback.feedback}</p>{feedback.feedback.source === 'ai' && <div className="feedback-scores">{['technical', 'clarity', 'problemSolving'].map(key => <span key={key}>{key === 'problemSolving' ? 'Reasoning' : key} <b>{feedback.feedback[key]}/10</b></span>)}</div>}<ul>{(feedback.feedback.improvements || []).map((point, i) => <li key={i}>{point}</li>)}</ul><div className="followup-question"><b>Go deeper</b><p>{feedback.followup}</p><small>Expand your answer above and save it again to incorporate the follow-up.</small></div></article>}<div className="question-navigation"><button className="hub-button secondary" disabled={busy || index === 0} onClick={() => next(-1)}><ArrowLeft size={14} />Previous</button><span>You can return to any question.</span>{index < session.questions.length - 1 ? <button className="hub-button secondary" disabled={busy} onClick={() => next(1)}>Next question<ArrowRight size={14} /></button> : <button className="hub-button secondary" disabled={busy} onClick={finish}>Finish & view report<ArrowRight size={14} /></button>}</div></section></div></main>;
}
