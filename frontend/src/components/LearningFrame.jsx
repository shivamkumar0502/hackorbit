import { useSelector } from 'react-redux';
import PlatformNav from './PlatformNav';
import MemberPrompt from './MemberPrompt';
import '../pages/Platform.css';
import '../pages/Workspace.css';
import '../pages/Learning.css';
export default function LearningFrame({ title, intro, destination, children }) {
  const user = useSelector(state => state.auth.user);
  return <main className="hub-page"><PlatformNav />{user ? <><header className="workspace-heading"><span className="hub-eyebrow">BUILD YOUR NEXT SKILL</span><h1>{title}</h1><p>{intro}</p></header>{children}</> : <MemberPrompt title={title} destination={destination}>{intro}</MemberPrompt>}</main>;
}
export function ResourceState({ resource }) {
  return resource.error ? <p role="alert" className="hub-error">{resource.error} <button onClick={resource.reload}>Retry</button></p> : resource.loading ? <p role="status">Loading…</p> : null;
}
