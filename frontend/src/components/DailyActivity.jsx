import { useState } from 'react';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';
export default function DailyActivity({ activity = {} }) {
  const [offset, setOffset] = useState(0);
  const now = new Date();
  const month = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  return <section className="hub-card activity-calendar"><div className="hub-card-heading"><h3><Flame size={17} /> Daily Activity</h3><div><button aria-label="Previous month" onClick={() => setOffset(value => value - 1)}><ChevronLeft size={15} /></button><button aria-label="Next month" disabled={offset === 0} onClick={() => setOffset(value => value + 1)}><ChevronRight size={15} /></button></div></div><p>{month.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</p><div className="calendar-grid">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => <span className="weekday" key={`label-${i}`}>{day}</span>)}{Array.from({ length: month.getDay() }, (_, i) => <span key={`pad-${i}`} />)}{Array.from({ length: days }, (_, i) => { const day = i + 1; const key = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`; const count = activity[key] || 0; return <span key={day} className={`calendar-day ${count ? `level-${Math.min(3, count)}` : ''} ${key === `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}` ? 'today' : ''}`} title={`${key}: ${count} submissions`}>{day}</span>; })}</div><div className="calendar-legend">Less <i /><i /><i /><i /> More</div></section>;
}
