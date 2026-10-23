import {useState} from 'react';
import {Link} from 'react-router';
import useResource from '../hooks/useResource';
import {ResourceState} from './LearningFrame';
export default function ProblemHints({problemId}){const hints=useResource(`/practice/hints/${problemId}`),[count,setCount]=useState(0);return <section><h2>Hints, one step at a time</h2><p>Try each idea before revealing the next. Open Solutions only when you want the full answer.</p><ResourceState resource={hints}/>{hints.data&&<>{!hints.data.tailored&&<p>General problem-solving prompts; no authored hints are available for this problem yet.</p>}<ol>{hints.data.hints.slice(0,count).map((h,i)=><li key={i} style={{marginBottom:18}}>{h}</li>)}</ol><button className="hub-button primary" disabled={count>=hints.data.hints.length} onClick={()=>setCount(c=>c+1)}>{count>=hints.data.hints.length?'All hints revealed':`Reveal hint ${count+1}`}</button><p><Link to="/plan">See your personal practice plan →</Link></p></>}</section>;}
