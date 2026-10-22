import {useEffect,useState} from 'react';
import {Link} from 'react-router';
import axiosClient from '../utils/axiosClient';
import PlatformNav from './PlatformNav';
import '../pages/Platform.css';
import '../pages/Workspace.css';
export default function AdminVideo(){
 const [problems,setProblems]=useState(null),[error,setError]=useState(''),[revision,setRevision]=useState(0),[busy,setBusy]=useState(false),[notice,setNotice]=useState('');
 useEffect(()=>{const controller=new AbortController();axiosClient.get('/problem/getAllProblem',{signal:controller.signal}).then(res=>{setProblems(res.data);setError('');}).catch(()=>{if(!controller.signal.aborted)setError('Unable to load the problem list. Retry.');});return()=>controller.abort();},[revision]);
 async function remove(id){if(!window.confirm('Delete the latest editorial video for this problem? The problem itself will remain.'))return;setBusy(true);try{const {data}=await axiosClient.delete(`/video/delete/${id}`);setNotice(data.message);setError('');}catch(err){setError(err.response?.data?.message||'Unable to delete video. Retry.');}finally{setBusy(false);}}
 async function install(){setBusy(true);setError('');try{const {data}=await axiosClient.post('/problem/install-core');setNotice(`${data.added} new problems added; ${data.total} core problems available.`);setRevision(value=>value+1);}catch(err){setError(err.response?.data?.message||'Could not add practice problems.');}finally{setBusy(false);}}
 return <main className="hub-page"><PlatformNav/><header className="workspace-heading"><h1>Problem videos</h1><p>Upload or remove editorial videos without deleting a coding problem.</p></header><div className="workspace-row"><Link className="hub-link" to="/admin">← Admin panel</Link><button className="hub-button secondary" disabled={busy} onClick={install}>Install core practice problems</button></div>{error&&<p className="hub-error" role="alert">{error} <button onClick={()=>setRevision(value=>value+1)}>Retry list</button></p>}<p role="status">{notice}</p>{!problems&&!error?<p>Loading problems…</p>:<ul className="workspace-list">{(problems||[]).map(problem=><li key={problem._id}><div>{problem.title}<small>{problem.difficulty}</small></div><div className="workspace-row"><Link className="hub-button primary" to={`/admin/upload/${problem._id}`}>Upload video</Link><button className="hub-button secondary" disabled={busy} onClick={()=>remove(problem._id)}>Delete video</button></div></li>)}</ul>}</main>;
}
