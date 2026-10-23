import { createElement, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router';
import { Trophy, Flame, Activity, Camera, Lock, History, Code2, ArrowLeft, X } from 'lucide-react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import axiosClient from '../utils/axiosClient';
import PlatformNav from '../components/PlatformNav';
import './Platform.css';
import './Profile.css';

const message = error => error.response?.data?.message || 'Request failed. Please retry.';
function ProgressRing({ label, value, total, color }) {
  const percent = total ? Math.min(100, value / total * 100) : 0;
  return <div className="progress-ring-item"><div className="progress-ring" style={{ '--ring-color': color, '--progress': `${percent}%` }}><span>{percent.toFixed(1)}%</span></div><b style={{ color }}>{label}</b><small>{value}/{total}</small></div>;
}
export default function Profile() {
  const user = useSelector(state => state.auth.user);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [retry, setRetry] = useState(0);
  const [passwordModal, setPasswordModal] = useState(false);
  const [busy, setBusy] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [yearOffset, setYearOffset] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    axiosClient.get('/user/profile', { signal: controller.signal }).then(res => { setData(res.data); setError(''); }).catch(err => { if (!controller.signal.aborted) setError(message(err)); });
    return () => controller.abort();
  }, [retry]);
  async function upload(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (file.size > 2 * 1024 * 1024 || !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) { setNotice('Choose a JPEG, PNG or WebP under 2 MB.'); return; }
    const form = new FormData(); form.append('image', file);
    setBusy(true); setNotice('');
    try { const response = await axiosClient.post('/user/upload-profile', form); setData(prev => ({ ...prev, profileImage: response.data.imageUrl })); setNotice('Profile photo updated.'); } catch (err) { setNotice(message(err)); } finally { setBusy(false); }
  }
  async function updatePassword(event) {
    event.preventDefault(); const form = new FormData(event.currentTarget);
    if (form.get('newPassword') !== form.get('confirmPassword')) { setPasswordError('New passwords do not match.'); return; }
    setBusy(true); setPasswordError('');
    try { await axiosClient.post('/user/change-password', { oldPassword: form.get('oldPassword'), newPassword: form.get('newPassword') }); setPasswordModal(false); setNotice('Password updated successfully.'); } catch (err) { setPasswordError(message(err)); } finally { setBusy(false); }
  }
  if (!user) return <div className="profile-state"><Link to="/login">Log in to view your profile</Link></div>;
  if (!data) return <div className="profile-state">{error ? <><p role="alert">{error}</p><button onClick={() => setRetry(value => value + 1)}>Retry</button></> : 'Loading your progress…'}</div>;
  const name = data.name || user.firstName || 'Coder';
  const totals = data.problemTotals || {};
  const total = Object.values(totals).reduce((sum, count) => sum + count, 0);
  const end = new Date(); end.setFullYear(end.getFullYear() - yearOffset);
  const start = new Date(end); start.setDate(start.getDate() - 364);
  const startKey = start.toISOString().slice(0, 10), endKey = end.toISOString().slice(0, 10);
  const heatmap = Object.entries(data.activity || {}).filter(([date]) => date >= startKey && date <= endKey).map(([date, count]) => ({ date, count }));
  const activityTotal = heatmap.reduce((sum, day) => sum + day.count, 0);
  const overall = total ? Math.min(100, data.totalSolved / total * 100) : 0;
  return <main className="profile-page">
    <PlatformNav /><div className="learning-actions" style={{justifyContent:"center",padding:16}}><Link className="hub-button secondary" to="/analytics">Submission analytics</Link><Link className="hub-button secondary" to="/profile/share">Public profile settings</Link></div>
    <div className="profile-layout">
      <aside className="profile-sidebar profile-card">
        <div className="profile-identity"><div className="profile-avatar">{data.profileImage ? <img src={data.profileImage} alt={`${name}'s profile`} /> : <span>{name.charAt(0).toUpperCase()}</span>}<label className="avatar-upload" title="Change profile photo"><Camera size={20} /><input aria-label="Upload profile photo" type="file" accept="image/png,image/jpeg,image/webp" disabled={busy} onChange={upload} /></label></div><h1>{name}</h1><p>{data.email || user.emailId}</p><button className="password-button" onClick={() => { setPasswordError(''); setPasswordModal(true); }}><Lock size={17} /> Change Password</button>{notice && <p className="profile-notice" role="status">{notice}</p>}</div>
        <section className="profile-progress"><h2>Problem Solving Progress</h2><div className="progress-rings"><ProgressRing label="Easy" value={data.easySolved} total={totals.easy || 0} color="#24cd68" /><ProgressRing label="Medium" value={data.mediumSolved} total={totals.medium || 0} color="#f5bf16" /><ProgressRing label="Hard" value={data.hardSolved} total={totals.hard || 0} color="#f05262" /></div><div className="overall-label"><span>Overall Progress</span><span>{data.totalSolved}/{total}</span></div><div className="overall-track"><div style={{ width: `${overall}%` }} /></div><p className="overall-percent">{overall.toFixed(1)}% Complete</p></section>
      </aside>
      <div className="profile-main"><header className="profile-heading"><h2>Performance Overview</h2><p>Track your progress and achievements</p></header><div className="profile-stats">{[[Trophy, data.totalSolved, 'Total Solved'], [Flame, data.currentStreak, 'Current Streak'], [Activity, data.maxStreak, 'Max Streak']].map(([Icon, count, label]) => <article className="profile-card stat-card" key={label}><span className="stat-icon">{createElement(Icon, { size: 25 })}</span><div><strong>{count}</strong><p>{label}</p></div></article>)}</div>
        <section className="profile-card activity-card"><div className="activity-heading"><h2><strong>{activityTotal}</strong> submissions in {yearOffset ? `${start.getFullYear()}–${end.getFullYear()}` : 'the past year'}</h2><div><button aria-label="Previous year" onClick={() => setYearOffset(value => value + 1)}>‹</button><button aria-label="Next year" disabled={!yearOffset} onClick={() => setYearOffset(value => value - 1)}>›</button></div></div><div className="activity-scroll"><CalendarHeatmap startDate={start} endDate={end} values={heatmap} gutterSize={4} classForValue={value => !value?.count ? 'activity-empty' : `activity-level-${Math.min(4, value.count)}`} titleForValue={value => value?.date ? `${value.count || 0} submissions on ${value.date}` : 'No submissions'} /></div><div className="activity-footer"><div className="heatmap-legend">Less {[0, 1, 2, 3, 4].map(level => <i key={level} className={level ? `activity-level-${level}` : 'activity-empty'} />)} More</div><span>Total active days: <b>{heatmap.length}</b> · Max streak: <b>{data.maxStreak}</b></span></div></section>
        <section className="profile-card recent-card"><header><History size={23} /><div><h2>Recent Submissions</h2><p>Latest 10 attempts</p></div></header><div className="recent-scroll"><table><thead><tr><th>Status</th><th>Problem</th><th>Language</th><th>Time</th></tr></thead><tbody>{data.recentSubmissions.map((item, index) => <tr key={item.id || index}><td><span className={`submission-status ${item.status}`}>{item.status === 'accepted' ? '✓ Accepted' : item.status === 'wrong' ? 'Wrong Answer' : item.status === 'error' ? 'Error' : 'Pending'}</span></td><td>{item.problemId ? <Link to={`/problem/${item.problemId}`}>{item.problem}</Link> : item.problem}</td><td>{({ 'c++': 'C++', java: 'Java', javascript: 'JavaScript' })[item.language] || item.language}</td><td>{new Date(item.time).toLocaleString()}</td></tr>)}</tbody></table>{!data.recentSubmissions.length && <div className="profile-empty"><Code2 size={28} /><p>Your coding journey starts here.</p><Link to="/home">Solve your first problem →</Link></div>}</div></section><Link className="back-to-practice" to="/home"><ArrowLeft size={15} /> Back to practice</Link>
      </div>
    </div>
    {passwordModal && <div className="profile-modal-backdrop"><form className="profile-card profile-modal" role="dialog" aria-modal="true" aria-labelledby="password-title" onSubmit={updatePassword}><button type="button" className="modal-close" aria-label="Close" disabled={busy} onClick={() => setPasswordModal(false)}><X size={20} /></button><h2 id="password-title">Change Password</h2><label>Current password<input required type="password" name="oldPassword" autoComplete="current-password" /></label><label>New password<input required type="password" name="newPassword" minLength={8} autoComplete="new-password" /></label><small>Use uppercase, lowercase, a number and a symbol.</small><label>Confirm new password<input required type="password" name="confirmPassword" autoComplete="new-password" /></label>{passwordError && <p role="alert" className="profile-error">{passwordError}</p>}<button className="password-button" disabled={busy}>{busy ? 'Updating…' : 'Update password'}</button></form></div>}
  </main>;
}
