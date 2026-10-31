'use client';
import { useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, CalendarDays, Check, Clock3, Lightbulb, RotateCcw, Target } from 'lucide-react';
import { contests, type ContestId } from '../lib/contests';
import { createSchedule, defaultSchedule, suggestedEnd, timeBlocks, type ScheduleConfig } from '../lib/schedule';
import Link from 'next/link';
import {GuidedExample} from './guided-walkthrough';
import { lessonFor } from '../lib/lessons';
import type { StudyState } from '../lib/study';
const dayLabels = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
const formatDate=(date:string)=>new Date(`${date}T12:00:00Z`).toLocaleDateString('pt-BR',{day:'2-digit',month:'short',timeZone:'UTC'});
const weekKey=(date:string)=>{const d=new Date(`${date}T12:00:00Z`);d.setUTCDate(d.getUTCDate()-((d.getUTCDay()+6)%7));return d.toISOString().slice(0,10);};
export function StudySchedule({ contestId, state, today, canEdit, save, openSubject }: { contestId:ContestId;state:StudyState;today:string;canEdit:boolean;save:(state:StudyState)=>Promise<boolean>;openSubject:(id:string)=>void }) {
 const current=state.schedule ?? {...defaultSchedule(today),end:suggestedEnd(today)};
 const [draft,setDraft]=useState<ScheduleConfig>({...current,end:current.end??suggestedEnd(current.start)});
 const [weekIndex,setWeekIndex]=useState(0);
 const [selected,setSelected]=useState('');
 const [message,setMessage]=useState('');
 const days=createSchedule(contestId,current);
 const weeks=[...new Set(days.map(d=>weekKey(d.date)))];
 const safeWeek=Math.min(weekIndex,weeks.length-1);
 const week=weeks[safeWeek];
 const visible=days.filter(d=>weekKey(d.date)===week);
 const active=visible.find(d=>d.date===selected) ?? visible[0];
 const allTasks=days.flatMap(d=>d.tasks);
 const completed=allTasks.filter(t=>current.done.includes(t.id)).length;
 const blocks=timeBlocks(active.minutes);
 const contest=contests[contestId];
 let preview:ReturnType<typeof createSchedule>=[]; let previewError='';
 try { preview=createSchedule(contestId,draft); } catch(error) { previewError=error instanceof Error?error.message:'Revise o período.'; }
 const average=Math.ceil(days.reduce((n,d)=>n+d.minutes,0)/days.length);
 async function completeDay() {
  const ids=active.tasks.map(t=>t.id),done=new Set(current.done);
  if(ids.every(id=>done.has(id))) ids.forEach(id=>done.delete(id)); else ids.forEach(id=>done.add(id));
  if(await save({...state,schedule:{...current,done:[...done]}})) setMessage('Sessão do cronograma atualizada.');
 }
 return <>
  <div className="page-heading"><div><span className="eyebrow green-text">CLAREZA PARA COMEÇAR. ROTINA PARA CONTINUAR.</span><h1>Seu cronograma, passo a passo.</h1><p>{contest.name} · Saiba o que estudar, como praticar e quando revisar.</p></div></div>
  <section className="schedule-intro panel"><CalendarDays className="green-text" size={25}/><div><h2>Comece pequeno. Entenda antes de avançar.</h2><p>O roteiro abaixo percorre os assuntos na ordem do seu plano e inclui uma revisão após cada bloco. Os exemplos ensinam como começar; aprofunde o tópico com seu material de teoria e a legislação exigida no edital.</p></div></section>
  <details className="schedule-settings panel" open={!state.schedule}><summary><h3>Personalizar minha rotina</h3><span>{state.schedule?'Alterar preferências':'Configure e salve para começar'}</span></summary><form onSubmit={async e=>{e.preventDefault();if(previewError){setMessage(previewError);return;}if(!draft.weekdays.length){setMessage('Selecione pelo menos um dia da semana.');return;}if(await save({...state,schedule:{...draft,done:current.done}})){setWeekIndex(0);setSelected('');setMessage('Cronograma salvo. Suas sessões concluídas foram preservadas.');}}}>
   <div className="schedule-fields"><label className="field">Data de início<input type="date" required value={draft.start} onChange={e=>setDraft({...draft,start:e.target.value})}/></label><label className="field">Data de fim<input type="date" required min={draft.start} value={draft.end??''} onChange={e=>setDraft({...draft,end:e.target.value})}/></label><label className="field">Exercícios sugeridos por dia<input type="number" min={1} max={50} required value={draft.exercises} onChange={e=>setDraft({...draft,exercises:Number(e.target.value)})}/></label></div>
   <div className="notice" role="status">{previewError || `Carga estimada: ${Math.ceil(preview.reduce((n,d)=>n+d.minutes,0)/Math.max(1,preview.length))} min por sessão, em ${preview.length} dias. Calculamos 60 min por tópico e 30 min por revisão, incluindo leitura, exercícios e correção. A duração exata aparece em cada dia; períodos longos deixam dias livres.`}</div><fieldset className="weekdays"><legend>Dias disponíveis para estudar</legend>{[1,2,3,4,5,6,0].map(day=><label key={day}><input type="checkbox" checked={draft.weekdays.includes(day)} onChange={e=>setDraft({...draft,weekdays:e.target.checked?[...draft.weekdays,day]:draft.weekdays.filter(d=>d!==day)})}/><span>{dayLabels[day]}</span></label>)}</fieldset>
   {contestId==='pmerj'&&<label className="extra-topics"><input type="checkbox" checked={draft.includeExtra} onChange={e=>setDraft({...draft,includeExtra:e.target.checked})}/> Incluir matérias complementares de 2014 após o conteúdo principal</label>}
   <div className="schedule-save"><p>A quantidade de exercícios é uma meta de prática com seu material; não inicia uma prova automaticamente. Se o assunto for difícil, repita a sessão antes de avançar.</p><button className="button dark" disabled={!canEdit}><Check size={16}/>Salvar cronograma</button></div>
  </form></details>
  {message&&<div className="notice" role="status">{message}</div>}
  {!state.schedule&&<div className="notice">Prévia da rotina padrão. Salve suas preferências ou conclua uma sessão para guardar este cronograma.</div>}
  <div className="schedule-metrics"><div><CalendarDays size={18}/><strong>{days.length}</strong><span>sessões planejadas</span></div><div><Check size={18}/><strong>{completed}/{allTasks.length}</strong><span>tarefas realizadas</span></div><div><Clock3 size={18}/><strong>{average} min</strong><span>média por dia com sessão</span></div><div><Target size={18}/><strong>{formatDate(current.end??days.at(-1)!.date)}</strong><span>prazo final · {(current.end??days.at(-1)!.date).slice(0,4)}</span></div></div>
  <div className="week-heading"><div><h2>Semana {safeWeek+1} de {weeks.length}</h2><p>A partir de {formatDate(week)} · {week.slice(0,4)}</p></div><div><button className="button secondary" onClick={()=>{const near=days.find(d=>d.date>=today)??days.at(-1)!;setWeekIndex(weeks.indexOf(weekKey(near.date)));setSelected(near.date);}}>Ir para hoje</button><button className="icon-button" aria-label="Semana anterior" disabled={safeWeek===0} onClick={()=>{setWeekIndex(safeWeek-1);setSelected('');}}><ArrowLeft size={18}/></button><button className="icon-button" aria-label="Próxima semana" disabled={safeWeek===weeks.length-1} onClick={()=>{setWeekIndex(safeWeek+1);setSelected('');}}><ArrowRight size={18}/></button></div></div>
  <div className="schedule-layout"><section className="agenda-days" aria-label="Agenda semanal">{Array.from({length:7},(_,i)=>{const d=new Date(`${week}T12:00:00Z`);d.setUTCDate(d.getUTCDate()+i);const date=d.toISOString().slice(0,10),day=visible.find(x=>x.date===date);return day?<button key={date} className={`agenda-day ${active.date===date?'selected':''} ${day.tasks.every(t=>current.done.includes(t.id))?'finished':''}`} onClick={()=>setSelected(date)}><span className="agenda-date">{dayLabels[d.getUTCDay()]}<b>{d.getUTCDate()}</b></span><span><small>{day.tasks[0].kind==='review'?'REVISÃO':'ESTUDO'}{date===today?' · HOJE':''}</small><b>{day.tasks[0].subject}</b><p>{day.tasks.map(t=>t.title).join(' + ')}</p></span>{day.tasks.every(t=>current.done.includes(t.id))?<Check size={17}/>:<ArrowRight size={17}/>}</button>:<div key={date} className="agenda-rest"><span>{dayLabels[d.getUTCDay()]} · {d.getUTCDate()}</span><span>{date<current.start?'Antes do início':date>days.at(-1)!.date?'Plano concluído':'Dia livre · descanso ou reforço'}</span></div>;})}</section>
   <section className="panel session-guide" aria-label="Roteiro da sessão"><div className="session-heading"><span className="pill green">{formatDate(active.date)} · {active.minutes} min</span><span className="pill">{active.tasks[0].kind==='review'?'Consolidar o aprendizado':'Aprender com calma'}</span></div><h2>{active.tasks.map(t=>t.title).join(' + ')}</h2><p>{active.tasks[0].subject} → {active.tasks[0].group}</p>
    <ol className="learning-steps">{[
     {title:'Relembre sem consultar',time:blocks[0],text:'Pegue uma folha e escreva o que lembra da última sessão. Se for seu primeiro dia, anote o que já sabe e as palavras que ainda não entende. Não precisa acertar: isso mostra por onde começar.'},
     {title:active.tasks[0].kind==='review'?'Reconstrua as ideias principais':'Entenda a teoria',time:blocks[1],text:active.tasks[0].kind==='review'?'Explique cada assunto do bloco em voz alta, como se ensinasse alguém. Depois consulte suas anotações e corrija o que faltou. Dê atenção especial aos erros das sessões anteriores.':`Abra o material sobre ${active.tasks.map(t=>t.title).join(' e ')}. Leia um trecho curto, anote os termos novos e traduza a regra para suas palavras. Se houver mais de um assunto, divida este tempo entre eles.`},
     {title:'Veja um exemplo e pratique',time:blocks[2],text:`Acompanhe o exemplo em “Vamos fazer juntos”, explicando cada etapa antes de avançar. Depois resolva ${current.exercises} exercício${current.exercises===1?'':'s'} do assunto do dia, no seu material. Comece pelos fáceis. Tente antes de olhar o gabarito; distribua a meta entre os assuntos se houver mais de um.`},
     {title:'Corrija e registre a dúvida',time:blocks[3],text:'Confira cada resposta e escreva por que errou: conceito, leitura ou cálculo? Refaça pelo menos um erro sem consultar. Termine anotando uma ideia aprendida e uma dúvida para revisar.'},
    ].map((step,i)=><li key={step.title}><span>{i+1}</span><div><h3>{step.title}<small>{step.time} min</small></h3><p>{step.text}</p></div></li>)}</ol>
    {active.tasks.map(task=>{const topic=contest.subjects.find(s=>s.id===task.subjectId)?.groups.flatMap(g=>g.topics).find(t=>t.id===task.topicIds[0]);const lesson=topic?lessonFor(contestId,task.subjectId,topic.id,topic.title):undefined;const example=lesson?.examples[0];return <div className="worked-example" key={task.id}><div className="example-title"><Lightbulb size={19}/><h3>{task.title}</h3></div>{example?<GuidedExample example={example}/>:<p>Consulte a fonte do edital e registre suas dúvidas enquanto a aula detalhada deste assunto é revisada.</p>}<Link className="button secondary" href={`/estudar?concurso=${contestId}&tema=${encodeURIComponent(task.topicIds[0])}`}>Abrir explicação e caderno</Link><Link className="text-button" href={`/questoes?concurso=${contestId}`}>Praticar questões comentadas</Link></div>;})}
    <div className="session-actions"><button className="button dark" disabled={!canEdit} onClick={completeDay}>{active.tasks.every(t=>current.done.includes(t.id))?<RotateCcw size={16}/>:<Check size={16}/>} {active.tasks.every(t=>current.done.includes(t.id))?'Reabrir sessão':'Concluir sessão do cronograma'}</button><button className="button secondary" onClick={()=>openSubject(active.tasks[0].subjectId)}><BookOpen size={16}/>Abrir assuntos e anotações</button></div><p className="schedule-footnote">Concluir a sessão registra a rotina, sem marcar automaticamente o domínio do assunto ou somar minutos ao histórico. Marque o tópico no plano somente quando conseguir explicá-lo e resolver exercícios sozinho.</p>
   </section></div>
 </>;
}
