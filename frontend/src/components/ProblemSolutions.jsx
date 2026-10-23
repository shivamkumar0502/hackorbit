import {useState} from 'react';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {oneDark} from 'react-syntax-highlighter/dist/esm/styles/prism';
import {Copy,Check,BookOpen} from 'lucide-react';
const editorLanguage=language=>({'C++':'cpp',Java:'java',JavaScript:'javascript'}[language]||language.toLowerCase());
export default function ProblemSolutions({problem}) {
 const solutions=problem.referenceSolution||[];
 const [selected,setSelected]=useState(solutions[0]?.language||'C++'),[copied,setCopied]=useState(false),[copyError,setCopyError]=useState('');
 const solution=solutions.find(row=>row.language===selected)||solutions[0];
 if(!solution)return <p>No solutions published yet.</p>;
 const code=solution.solutionCode||solution.completeCode;
 async function copy(){setCopyError('');try{await navigator.clipboard.writeText(code);setCopied(true);}catch{setCopyError('Copy is unavailable. Select and copy the code below.');}}
 return <article className="solution-guide">
  <div className="solution-heading"><BookOpen size={20}/><span>Official solution</span></div>
  <h1>{problem.title}</h1>
  {problem.solutionSteps?.length>0&&<section><h2>Approach &amp; steps</h2><ol>{problem.solutionSteps.map((step,i)=><li key={i}>{step}</li>)}</ol></section>}
  {problem.functionMode&&<div className="solution-contract"><b>Function contract</b><p>Implement <code>{problem.methodName}</code> in <code>class Solution</code>. Return the answer; input parsing and output formatting are handled automatically.</p><p><code>{problem.functionSignature}</code> → <code>{problem.functionReturn}</code><small> Types shown in Java notation; use the signature provided for your language.</small></p></div>}
  <div className="solution-complexity">{solution.timeComplexity&&<span className="solution-time"><b>TIME</b> {solution.timeComplexity}</span>}{solution.spaceComplexity&&<span className="solution-space"><b>SPACE</b> {solution.spaceComplexity}</span>}</div>
  <section className="solution-code-card">
   <div className="solution-language-tabs" role="tablist" aria-label="Solution language">{solutions.map(row=><button key={row.language} role="tab" aria-selected={row.language===solution.language} aria-controls="official-solution-code" onClick={()=>{setSelected(row.language);setCopied(false);setCopyError('');}}>{row.language}</button>)}</div>
   <div className="solution-code-actions"><span>{solution.language} · Reference implementation</span><button onClick={copy}>{copied?<Check size={15}/>:<Copy size={15}/>} {copied?'Copied':'Copy'}</button></div>
   {copyError&&<p role="alert">{copyError}</p>}
   <div id="official-solution-code" role="tabpanel" aria-label={`${solution.language} solution`}><SyntaxHighlighter language={editorLanguage(solution.language)} style={oneDark} showLineNumbers wrapLongLines={false} customStyle={{margin:0,padding:'18px 16px 24px',background:'#202020',fontSize:16,lineHeight:1.8,borderRadius:0}} codeTagProps={{style:{fontFamily:'ui-monospace, SFMono-Regular, Consolas, monospace'}}}>{code}</SyntaxHighlighter></div>
  </section>
 </article>;
}
