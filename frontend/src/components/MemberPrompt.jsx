import { Link } from 'react-router';
export default function MemberPrompt({ destination, title, children }) {
  return <section className="hub-card member-prompt"><span className="hub-eyebrow">YOUR HACKORBIT WORKSPACE</span><h1>{title}</h1><p>{children}</p><Link className="hub-button primary" to="/login" state={{ from: destination }}>Log in to continue</Link><Link className="hub-link" to="/visualizer">Try the DSA visualiser →</Link></section>;
}
