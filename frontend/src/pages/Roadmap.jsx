import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router';
import LearningFrame,{ ResourceState } from '../components/LearningFrame';
import useResource from '../hooks/useResource';
import axiosClient from '../utils/axiosClient';
export default function Roadmap(){
 const user=useSelector(state=>state.auth.user),resource=useResource('/learn/roadmap',Boolean(user));
 const [busy,setBusy]=useState(''),[error,setError]=useState('');
 async function toggle(unit){setBusy(unit.id);setError('');try{await axiosClient.put(`/learn/roadmap/${unit.id}`,{read:!unit.read});resource.reload();}catch{setError('Could not save progress. Retry.');}finally{setBusy('');}}
 const units=resource.data||[];
 return <LearningFrame title="DSA Roadmap" intro="Read the concept, check your understanding and practice from the real problem bank." destination="/roadmap"><Link className="hub-link" to="/learn">← Learning hub</Link><ResourceState resource={resource}/>{error&&<p role="alert" className="hub-error">{error}</p>}{units.length>0&&<p className="hub-notice">{units.filter(u=>u.read).length}/{units.length} concepts reviewed. Problem progress counts accepted submissions separately.</p>}<div className="roadmap-path">{units.map((unit,index)=><article className="hub-card workspace-panel" key={unit.id}><div className="workspace-row"><h2><span className="roadmap-number">{index+1}</span>{unit.title}</h2><span>{unit.problems.filter(p=>p.solved).length}/{unit.problems.length} solved</span></div><p>{unit.concept}</p><ul>{unit.checklist.map(point=><li key={point}>{point}</li>)}</ul><div className="learning-actions"><button className={`hub-button ${unit.read?'secondary':'primary'}`} disabled={Boolean(busy)} onClick={()=>toggle(unit)}>{unit.read?'✓ Concept reviewed · undo':'Mark concept reviewed'}</button>{unit.visualizer&&<Link className="hub-link" to={`/visualizer?algorithm=${unit.visualizer}`}>See it visually →</Link>}</div><details><summary>Practice problems ({unit.problems.length})</summary>{unit.problems.length?<ul className="workspace-list">{unit.problems.map(problem=><li key={problem._id}><Link to={`/problem/${problem._id}`}>{problem.title}</Link><span>{problem.solved?'✓ Accepted':problem.difficulty}</span></li>)}</ul>:<p className="hub-muted">No matching problems are published yet. Review the concept now and check back for practice problems.</p>}</details></article>)}</div></LearningFrame>;
}
