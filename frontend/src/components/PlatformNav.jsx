import { Link, NavLink } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Code2, ChevronDown } from 'lucide-react';
import { logoutUser } from '../authSlice';
export default function PlatformNav() {
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  return <nav className="hub-nav"><Link to="/" className="hub-brand"><Code2 size={27} />HackOrbit</Link><div className="hub-nav-links"><NavLink to="/practice">Practice</NavLink><NavLink to="/interview">Interviews</NavLink><NavLink to="/profile">Progress</NavLink><NavLink to="/visualizer">DSA Visualiser</NavLink></div>{user ? <details className="hub-account"><summary><span className="hub-avatar">{user.firstName?.charAt(0)}</span><span>{user.firstName}</span><ChevronDown size={14} /></summary><div><Link to="/profile">View profile</Link>{user.role === 'admin' && <Link to="/admin">Admin panel</Link>}<button onClick={() => dispatch(logoutUser())}>Sign out</button></div></details> : <Link to="/login" className="hub-button">Log in</Link>}</nav>;
}
