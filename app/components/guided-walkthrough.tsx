'use client';
import {useState} from 'react';
import type {WorkedExample} from '../lib/lessons';

/** Local reading controls only: moving forward never marks mastery or saves progress. */
export function GuidedSteps({steps}:{steps:string[]}) {
 const [current,setCurrent]=useState(0),[showAll,setShowAll]=useState(false);
 const index=Math.min(current,steps.length-1);
 if(!steps.length)return null;
 return <div className="guided-steps">
  <div className="guided-toolbar"><span>{showAll?`${steps.length} etapas explicadas`:`Etapa ${index+1} de ${steps.length}`}</span><button type="button" className="text-button" aria-pressed={showAll} onClick={()=>setShowAll(!showAll)}>{showAll?'Ler uma etapa por vez':'Ver a resolução inteira'}</button></div>
  <ol className="guided-step-list" start={showAll?1:index+1} aria-live={showAll?'off':'polite'} aria-atomic="true">{(showAll?steps:[steps[index]]).map((step,i)=><li key={showAll?i:index}><span className="guided-step-number" aria-hidden="true">{showAll?i+1:index+1}</span><p>{step}</p></li>)}</ol>
  {!showAll&&<div className="guided-controls"><button type="button" className="button secondary" disabled={index===0} onClick={()=>setCurrent(index-1)}>← Voltar uma etapa</button>{index<steps.length-1?<button type="button" className="button dark" onClick={()=>setCurrent(index+1)}>Continuar juntos →</button>:<button type="button" className="button secondary" onClick={()=>setCurrent(0)}>Recomeçar a explicação</button>}</div>}
  {!showAll&&index===steps.length-1&&<p className="guided-end">Chegamos ao resultado. Refaça a resolução no caderno, usando suas palavras para explicar cada escolha.</p>}
 </div>;
}
export function GuidedExample({example,number}:{example:WorkedExample;number?:number}){
 return <section className="guided-example"><header><span className="eyebrow green-text">VAMOS FAZER JUNTOS{number?` · EXEMPLO ${number}`:''}</span><h3>{example.question}</h3></header><div className="guided-preparation"><div><h4>O que vamos descobrir?</h4><p>{example.goal}</p></div><div><h4>Antes de começar</h4><p>{example.start}</p></div></div><GuidedSteps steps={example.steps}/><div className="guided-check"><h4>Vamos conferir se ficou claro?</h4><p>{example.checkpoint.prompt}</p><details><summary>Comparar com a explicação</summary><p>{example.checkpoint.answer}</p></details></div></section>;
}
