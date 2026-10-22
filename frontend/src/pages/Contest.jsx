import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router';
import { ContestTabs } from './Events';
import PlatformNav from '../components/PlatformNav';
import MemberPrompt from '../components/MemberPrompt';
import axiosClient from '../utils/axiosClient';
import './Platform.css';
import './Workspace.css';
const formatTime = seconds => `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
export default function Contest() {
  const user = useSelector(state => state.auth.user);
  const [sessions, setSessions] = useState([]), [minutes, setMinutes] = useState(60), [loading, setLoading] = useState(Boolean(user)), [busy, setBusy] = useState(false), [error, setError] = useState(''), [clock, setClock] = useState(Date.now()), [offset, setOffset] = useState(0), [retry, setRetry] = useState(0), [confirm, setConfirm] = useState(false);
  useEffect(() => {
    if (!user) return;
    let canceled = false;
    async function load() {
      try { const { data } = await axiosClient.get('/contest'); if (!canceled) { setSessions(data); setOffset(data[0] ? +new Date(data[0].serverNow) - Date.now() : 0); setError(''); } }
      catch (err) { if (!canceled) setError(err.response?.data?.message || 'Unable to load contests. Please retry.'); }
      finally { if (!canceled) setLoading(false); }
    }
    load(); const timer = setInterval(load, 20000); const focus = () => load(); window.addEventListener('focus', focus);
    return () => { canceled = true; clearInterval(timer); window.removeEventListener('focus', focus); };
  }, [user, retry]);
  useEffect(() => { const timer = setInterval(() => setClock(Date.now()), 1000); return () => clearInterval(timer); }, []);
  const active = sessions.find(item => item.status === 'active' && +new Date(item.endsAt) > clock + offset);
  const current = active || sessions[0];
  const seconds = active ? Math.max(0, Math.ceil((+new Date(active.endsAt) - clock - offset) / 1000)) : 0;
  async function action(path, body = {}) {
    setBusy(true); setError('');
    try { const { data } = await axiosClient.post(path, body); setSessions(items => [data, ...items.filter(item => item.id !== data.id)]); setOffset(+new Date(data.serverNow) - Date.now()); setClock(Date.now()); setConfirm(false); }
    catch (err) { setError(err.response?.data?.message || 'Unable to update challenge. Please retry.'); }
    finally { setBusy(false); }
  }
  return <main className="hub-page"><PlatformNav />{!user ? <MemberPrompt destination="/contest" title="Put your practice on the clock">Start a personal timed contest, solve real platform problems and review your accepted submissions.</MemberPrompt> : <><header className="workspace-heading"><span className="hub-eyebrow">FOCUS. SOLVE. REPEAT.</span><h1>Contest arena</h1><p>Personal timed practice with problems from the HackOrbit bank.</p></header><ContestTabs /><p className="hub-notice">These are individual practice rounds. Your timer is saved on the server; accepted submissions within the round count toward progress.</p>{error && <p role="alert" className="hub-error">{error} <button onClick={() => setRetry(value => value + 1)}>Retry</button></p>}{loading ? <p role="status">Loading challenges…</p> : <><section className="hub-card workspace-panel contest-launch"><div><h2>{active ? 'Challenge in progress' : 'Start your next challenge'}</h2><p>Up to 3 problems, with a mix of available difficulty levels. Submit solutions from each problem’s coding workspace.</p></div>{active ? <div className="contest-clock"><span>Time remaining</span><strong aria-label="Time remaining">{formatTime(seconds)}</strong></div> : <div className="contest-start"><label>Round duration<select value={minutes} onChange={event => setMinutes(Number(event.target.value))}><option value={30}>30 minutes</option><option value={60}>60 minutes</option><option value={90}>90 minutes</option></select></label><button className="hub-button primary" disabled={busy || Boolean(error)} onClick={() => action('/contest/start', { minutes })}>{busy ? 'Starting…' : 'Start challenge'}</button></div>}</section>{current && <section className="hub-card workspace-panel"><div className="workspace-row"><h2>{active ? 'Your problem set' : 'Last round results'}</h2><span>{current.solved.length} / {current.problems.length} solved</span></div><ul className="workspace-list">{current.problems.map((problem, index) => <li key={problem.id}><div><b>{index + 1}. {problem.title}</b><small>{problem.difficulty}</small></div><div className="contest-problem-actions">{current.solved.includes(problem.id) && <span className="submission-outcome accepted">Accepted</span>}<Link className="hub-button secondary" to={`/problem/${problem.id}`}>{active ? 'Solve' : 'Practice again'} →</Link></div></li>)}</ul><div className="workspace-row"><small>Only accepted submissions made during this round count. Refresh to update progress.</small><button className="hub-button secondary" disabled={busy} onClick={() => setRetry(value => value + 1)}>Refresh progress</button></div>{active && <div className="contest-finish">{confirm ? <><p>Finish this round now? Its timer and result will be closed.</p><button className="hub-button" disabled={busy} onClick={() => action(`/contest/${active.id}/finish`)}>Finish round</button><button className="hub-button secondary" disabled={busy} onClick={() => setConfirm(false)}>Keep coding</button></> : <button className="hub-button secondary" onClick={() => setConfirm(true)}>End round early</button>}</div>}</section>}{sessions.length > 1 && <section className="hub-card workspace-panel"><h2>Recent rounds</h2><ul className="workspace-list">{sessions.slice(1).map(session => <li key={session.id}><span>{new Date(session.startedAt).toLocaleString('en-IN')}</span><span>{session.solved.length}/{session.problems.length} solved</span></li>)}</ul></section>}</>}</>}</main>;
}
