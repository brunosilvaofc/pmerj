'use client';
import {Suspense,useEffect,useState} from 'react';
import {useSearchParams} from 'next/navigation';
import Link from 'next/link';
import {BookOpen,Check,ArrowLeft} from 'lucide-react';
import {contests,type ContestId} from '../lib/contests';
import {lessonFor} from '../lib/lessons';
import {LessonContent} from '../components/lesson-content';
import {useStudy} from '../lib/use-study';
import {supabase} from '../lib/supabase';
export default function Page(){return <Suspense fallback={<main className="lesson-page">Carregando tema…</main>}><LessonRoute/></Suspense>;}
function LessonRoute(){
 const params=useSearchParams(),contest=params.get('concurso')==='gmsg'?'gmsg':'pmerj',topic=params.get('tema')??'';
 return <Lesson key={`${contest}-${topic}`} contest={contest} topic={topic}/>;
}
function Lesson({contest,topic}:{contest:ContestId;topic:string}){
 const {state,user,ready,busy,error,save}=useStudy(contest);
 const [draft,setDraft]=useState<string|null>(null),[message,setMessage]=useState('');
 const subject=contests[contest].subjects.find(s=>s.groups.some(g=>g.topics.some(t=>t.id===topic)));
 const group=subject?.groups.find(g=>g.topics.some(t=>t.id===topic)),item=group?.topics.find(t=>t.id===topic);
 const value=draft??state.notes[topic]??'';
 const dirty=draft!==null&&draft!==(state.notes[topic]??'');
 useEffect(()=>{const handler=(e:BeforeUnloadEvent)=>{if(dirty){e.preventDefault();}};window.addEventListener('beforeunload',handler);return()=>window.removeEventListener('beforeunload',handler);},[dirty]);
 if(!subject||!group||!item)return <main className="lesson-page"><h1>Tema não encontrado</h1><Link href="/">Voltar ao plano</Link></main>;
 const lesson=lessonFor(contest,subject.id,item.id,item.title),canEdit=ready&&!busy&&(!supabase||!!user);
 return <main className="lesson-page"><Link className="button secondary" href={`/?plano=${subject.id}`} onClick={e=>{if(dirty&&!window.confirm('Sua anotação ainda não foi salva. Sair mesmo assim?'))e.preventDefault();}}><ArrowLeft size={16}/>Voltar aos assuntos</Link><header className="page-heading"><div><span className="eyebrow green-text">{contests[contest].name} · {subject.title}</span><h1>{item.title}</h1><p>{group.title}</p></div></header><div className="lesson-layout"><article className="panel lesson-content"><p className="notice">{contests[contest].sourceNote} <a href={contest==='pmerj'?'/materials/pmerj-edital-2023-retificado-2025.pdf':'/materials/gmsg-edital-2026.pdf'} target="_blank" rel="noreferrer">Consultar edital</a></p>{lesson?<LessonContent lesson={lesson}/>:<><h2>Conteúdo aguardando revisão da fonte</h2><p>Este tema está no plano, mas sua aula detalhada ainda não está disponível. Consulte o texto oficial indicado no edital e registre suas dúvidas no caderno. Para as leis municipais 1.416/2022 e 1.625/2026, falta conferir o texto integral atualizado.</p></>}<Link className="button secondary" href={`/questoes?concurso=${contest}`}>Abrir banco de questões comentadas</Link></article><aside className="panel lesson-notebook"><BookOpen className="green-text"/><h2>Meu caderno de estudo</h2><p>Anotações exclusivas deste tema. Escreva com suas palavras o que entendeu e o que precisa revisar.</p>{error&&<div role="alert" className="notice">{error}</div>}{supabase&&!user&&ready&&<Link className="text-button" href="/login">Entre para salvar suas anotações</Link>}<label className="field">Resumo, exemplos e dúvidas<textarea rows={14} maxLength={10000} disabled={!ready} value={value} onChange={e=>{setDraft(e.target.value);setMessage('');}} placeholder="1. O que aprendi…&#10;2. Um exemplo meu…&#10;3. O que preciso revisar…"/></label><small>{value.length}/10000 caracteres · {dirty?'Alterações não salvas':'Anotações carregadas'}</small><button className="button dark full" disabled={!canEdit} onClick={async()=>{if(await save({...state,notes:{...state.notes,[topic]:value}})){setDraft(null);setMessage('Anotação salva.');}}}><Check size={16}/>{busy?'Salvando…':'Salvar anotação'}</button>{message&&<p role="status">{message}</p>}</aside></div></main>;
}
