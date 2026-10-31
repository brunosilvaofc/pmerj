'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowDownToLine, ArrowRight, ArrowUpRight, BookOpen, CalendarDays, Check, CheckCheck, ChevronDown, ChevronRight, CircleHelp, Clock3, Cloud, Compass, FileText, Flag, Flame, GraduationCap, LayoutDashboard, ListChecks, LogIn, LogOut, Menu, Mountain, Pause, Play, Plus, RotateCcw, Search, Settings2, Shield, Sparkles, Target, Timer, TrendingUp, Trophy, Upload, X, type LucideIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { type Subject } from './lib/curriculum';
import { contests, guardSections, gradeGuard, type ContestId } from './lib/contests';
import { localDate, parseState, percent } from './lib/study';
import { supabase } from './lib/supabase';
import { useStudy } from './lib/use-study';
import { StudySchedule } from './components/study-schedule';
import { GuardResources } from './components/guard-resources';

type View = 'dashboard' | 'schedule' | 'roadmap' | 'focus' | 'exams' | 'settings';
const navigation: { id: View; label: string; icon: LucideIcon }[] = [
  { id: 'dashboard', label: 'Visão geral', icon: LayoutDashboard },
  { id: 'roadmap', label: 'Meu plano de estudos', icon: BookOpen },
  { id: 'schedule', label: 'Meu cronograma', icon: CalendarDays },
  { id: 'focus', label: 'Sessão de foco', icon: Timer },
  { id: 'exams', label: 'Simulados', icon: ListChecks },
];
const pmerjIcons = ['Aa', '∑', '§', '⚖', '¶', '✎', '+'];


function Progress({ value }: { value: number }) { return <div className="progress" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${value}%` }} /></div>; }
function Modal({ title, close, children }: { title: string; close: () => void; children: React.ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { const el = ref.current; el?.showModal(); return () => el?.close(); }, []);
  return <dialog ref={ref} className="modal" onCancel={close} onClick={e => { if (e.target === e.currentTarget) close(); }}><div className="modal-title"><h2>{title}</h2><button className="icon-button" aria-label="Fechar janela" onClick={close}><X size={20} /></button></div>{children}</dialog>;
}

export default function Home() {
  const [contestId, setContestId] = useState<ContestId>('pmerj');
  useEffect(() => {
  // Hydrate browser-only state after the server render.
  // eslint-disable-next-line react-hooks/set-state-in-effect
    try { const saved = localStorage.getItem('rumo-active-contest'); if (saved === 'pmerj' || saved === 'gmsg') setContestId(saved); } catch { /* The study hook reports unavailable storage. */ }
  }, []);
  function changeContest(id: ContestId) {
    try { localStorage.setItem('rumo-active-contest', id); } catch { /* Navigation remains available without storage. */ }
    setContestId(id);
  }
  return <StudyApp key={contestId} contestId={contestId} changeContest={changeContest} />;
}

function StudyApp({ contestId, changeContest }: { contestId: ContestId; changeContest: (id: ContestId) => void }) {
  const router=useRouter();
  const contest = contests[contestId];
  const isGuard = contestId === 'gmsg';
  const subjects = contest.subjects;
  const subjectIcons = isGuard ? ['Aa', '⚖', '§', '◇', '⌘'] : pmerjIcons;
  const mainTopics = subjects.slice(0, contest.mainSubjectCount).flatMap(s => s.groups.flatMap(g => g.topics));
  const { state, user, ready, busy, error, setError, save } = useStudy(contestId);
  const [examTemplate, setExamTemplate] = useState<'gmsg-2026' | 'practice'>(isGuard ? 'gmsg-2026' : 'practice');
  const [view, setView] = useState<View>('dashboard');
  const [selected, setSelected] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [filter, setFilter] = useState('');
  const [onlyPending, setOnlyPending] = useState(false);
  const [auth, setAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'reset' | 'update'>('login');
  const [authMessage, setAuthMessage] = useState('');
  const [authBusy, setAuthBusy] = useState(false);

  const [examModal, setExamModal] = useState(false);
  const [manualSession, setManualSession] = useState(false);
  const [toast, setToast] = useState('');
  const [today, setToday] = useState('');
  const [duration, setDuration] = useState(25);
  const [remaining, setRemaining] = useState(25 * 60);
  const [deadline, setDeadline] = useState<number | null>(null);
  const [timerSubject, setTimerSubject] = useState('1');
  const timerOwner = useRef<string | null>(null);
  const [timerFinished, setTimerFinished] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const active = subjects.find(s => s.id === selected);
  const done = mainTopics.filter(t => state.completed[t.id]).length;
  const overall = percent(done, mainTopics.length);
  const nextSubject = subjects.find(s => s.groups.some(g => g.topics.some(t => !state.completed[t.id]))) ?? subjects[0];
  const nextTopic = nextSubject.groups.flatMap(g => g.topics).find(t => !state.completed[t.id]);
  const todayMinutes = state.sessions.filter(s => s.date.slice(0, 10) === today).reduce((n, s) => n + s.minutes, 0);
  const totalMinutes = state.sessions.reduce((n, s) => n + s.minutes, 0);
  const totalCorrect = state.exams.reduce((n,e) => n+e.correct,0);
  const totalQuestions = state.exams.reduce((n,e) => n+e.total,0);
  const canEdit = ready && !busy && (!supabase || !!user);
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = today ? new Date(`${today}T12:00:00`) : new Date('2026-01-01T12:00:00'); d.setDate(d.getDate() - 6 + i);
    const date = localDate(d); return { date, label: d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', ''), minutes: state.sessions.filter(s => s.date.slice(0, 10) === date).reduce((n, s) => n+s.minutes,0) };
  });
  let streak = 0;
  if (today) {
    const dates = new Set(state.sessions.map(s => s.date.slice(0, 10)));
    const d = new Date(`${today}T12:00:00`);
    if (!dates.has(localDate(d))) d.setDate(d.getDate()-1);
    while (dates.has(localDate(d))) { streak++; d.setDate(d.getDate()-1); }
  }
  // Hydrate browser-only state after the server render.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setToday(localDate()); const id = setInterval(() => setToday(localDate()), 30000); return () => clearInterval(id); }, []);
  useEffect(() => { if (!toast) return; const id = setTimeout(() => setToast(''), 4500); return () => clearTimeout(id); }, [toast]);
  useEffect(() => {
    if (deadline === null) return;
    const tick = () => { const value = Math.max(0, Math.ceil((deadline - Date.now()) / 1000)); setRemaining(value); if (value === 0) { setDeadline(null); setTimerFinished(true); } };
    tick(); const id = setInterval(tick, 250); return () => clearInterval(id);
  }, [deadline]);
  useEffect(() => {
    const owner = user?.id ?? null;
    if (timerOwner.current !== owner) { setDeadline(null); setRemaining(25*60); setDuration(25); setTimerFinished(false); timerOwner.current = owner; }
  }, [user?.id]);
  useEffect(() => {
    if (!supabase) return;
    const { data } = supabase.auth.onAuthStateChange(event => { if (event === 'PASSWORD_RECOVERY') { setAuthMode('update'); setAuth(true); } });
    return () => data.subscription.unsubscribe();
  }, []);
  // Hydrate browser-only state after the server render.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { const id=new URLSearchParams(location.search).get('plano'); if(id){setSelected(id);setView('roadmap');} }, []);
  useEffect(() => { if(auth && !user && authMode !== 'update') router.push('/login'); }, [auth,user,authMode,router]);
  function openAccount() {
    setAuthMessage('');
    setAuthMode('login');
    setMobile(false);
    if (supabase && !user) { router.push('/login'); return; }
    setAuth(true);
  }
  async function signOutAccount() {
    if (!supabase || authBusy || busy) return;
    setAuthBusy(true); setAuthMessage('');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setAuth(false); router.replace('/login');
    } catch { setAuthMessage('Não foi possível sair. Tente novamente.'); }
    finally { setAuthBusy(false); }
  }
  function navigate(next: View) { setView(next); setSelected(null); setFilter(''); setMobile(false); }
  function openSubject(subject: Subject) { setSelected(subject.id); setView('roadmap'); setFilter(''); setOnlyPending(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  async function toggleTopic(id: string) {
    const completed = { ...state.completed };
    if (completed[id]) delete completed[id]; else completed[id] = new Date().toISOString();
    await save({ ...state, completed });
  }
  async function submitAuth(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); if (!supabase || authBusy) return;
    const data = new FormData(e.currentTarget); setAuthBusy(true); setAuthMessage('');
    const email = String(data.get('email') ?? ''); const password = String(data.get('password') ?? '');
    try {
      if (authMode === 'reset') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
        if (error) throw error; setAuthMessage('Se o e-mail estiver cadastrado, você receberá um link de recuperação.');
      } else if (authMode === 'update') {
        const { error } = await supabase.auth.updateUser({ password }); if (error) throw error; setAuth(false); setToast('Senha atualizada.');
      } else if (authMode === 'signup') {
        const { error, data: result } = await supabase.auth.signUp({ email, password, options: { data: { name: String(data.get('name') ?? '') }, emailRedirectTo: window.location.origin } });
        if (error) throw error;
        if (result.session) setAuth(false); else setAuthMessage('Confira seu e-mail para confirmar o cadastro e depois entre na conta.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password }); if (error) throw error; setAuth(false);
      }
    } catch { setAuthMessage('Não foi possível concluir. Confira seus dados, a conexão e a configuração de autenticação.'); }
    finally { setAuthBusy(false); }
  }
  async function registerSession(minutes: number, subject = timerSubject) {
    const success = await save({ ...state, sessions: [...state.sessions, { id: crypto.randomUUID(), date: `${localDate()}T${new Date().toTimeString().slice(0,8)}`, minutes, subject }] });
    if (success) { setToast('Sessão registrada. Mais um passo na sua preparação!'); setManualSession(false); }
    return success;
  }
  async function finishTimer() {
    if (await registerSession(duration)) { setTimerFinished(false); setRemaining(duration*60); }
  }
  function exportData() {
    const url = URL.createObjectURL(new Blob([JSON.stringify({ version: 2, contestId, data: state }, null, 2)], { type: 'application/json' }));
    const a = document.createElement('a'); a.href = url; a.download = `rumo-a-farda-${contestId}-${localDate()}.json`; a.click(); URL.revokeObjectURL(url);
  }
  function subjectCard(s: Subject, index: number) {
    const topics = s.groups.flatMap(g => g.topics); const count = topics.filter(t => state.completed[t.id]).length; const p = percent(count, topics.length);
    return <button className={`subject-card subject-${s.id}`} key={s.id} onClick={() => openSubject(s)}>
      <div className="card-top"><span className="subject-symbol">{subjectIcons[index]}</span><span className={`pill ${p === 100 ? 'green' : count ? 'blue' : ''}`}>{p === 100 ? 'Concluída' : count ? 'Em andamento' : 'Não iniciada'}</span></div>
      <span className="eyebrow">ETAPA {s.id.padStart(2,'0')}</span><h3>{s.title}</h3><p>{s.description}</p>
      <div className="course-progress"><span>{count} de {topics.length} tópicos</span><b>{p}%</b></div><Progress value={p} />
      <div className="card-bottom"><span>{isGuard ? <Target size={13} /> : <Clock3 size={13} />} {s.duration}</span><ArrowUpRight size={18} /></div>
    </button>;
  }
  return <div className="app-shell">
    {mobile && <button className="sidebar-overlay" aria-label="Fechar menu" onClick={() => setMobile(false)} />}
    <aside className={`sidebar ${mobile ? 'open' : ''}`}>
      <a className="brand" href="#" onClick={e => { e.preventDefault(); navigate('dashboard'); }}><span className="brand-mark"><Shield size={25} strokeWidth={1.7} /><span /></span><span>rumo à <b>farda</b><small>SEU CAMINHO ATÉ A FARDA</small></span></a>
      <label className="workspace-label contest-selector"><span className="workspace-icon"><GraduationCap size={20} /></span><span><small>CONCURSO ATUAL</small><select aria-label="Selecionar concurso" value={contestId} disabled={busy || deadline !== null || timerFinished || remaining !== duration*60} onChange={e=>changeContest(e.target.value as ContestId)}><option value="pmerj">Soldado PMERJ</option><option value="gmsg">Guarda de São Gonçalo</option></select></span><ChevronDown size={15} /></label>
      <span className="nav-label">ÁREA DE ESTUDOS</span>
      <nav aria-label="Navegação principal">{navigation.map(n => <button key={n.id} className={view === n.id ? 'nav-item active' : 'nav-item'} onClick={() => navigate(n.id)}><n.icon size={19} /><span>{n.label}</span>{n.id === 'focus' && deadline !== null && <span className="live-dot" />}</button>)}</nav>
      <div className="sidebar-bottom"><div className="journey-card"><div className="journey-icon"><Mountain size={23} /></div><b>A constância te leva lá.</b><p>Um tópico de cada vez.<br />Uma conquista a cada dia.</p><div className="journey-dots"><span /><span /><span /><i /></div></div>
      <button className={`nav-item ${view === 'settings' ? 'active' : ''}`} onClick={() => navigate('settings')}><Settings2 size={19} />Configurações</button>
      <button className="profile" onClick={openAccount}><span className="avatar">{user?.email?.slice(0,1).toUpperCase() || 'E'}</span><span>{user?.user_metadata?.name || 'Estudante'}<small>{user ? 'Minha conta' : 'Modo local · neste navegador'}</small></span><ChevronRight size={16} /></button></div>
    </aside>
    <div className="main-shell">
      <header className="topbar"><div className="topbar-left"><button className="icon-button mobile-menu" aria-label="Abrir menu" onClick={() => setMobile(true)}><Menu /></button><span className="breadcrumb">{contest.shortName} <ChevronRight size={14} /><b>{navigation.find(n=>n.id===view)?.label || 'Configurações'}</b></span></div><div className="header-right"><span className="save-status"><span className={user ? 'status-dot cloud' : 'status-dot'} />{busy ? 'Salvando…' : user ? 'Conta conectada' : 'Progresso local'}</span><button className="avatar small" aria-label="Abrir conta" onClick={openAccount}>{user?.email?.slice(0,1).toUpperCase() || 'E'}</button></div></header>
      <main id="main-content">
        {error && <div className="notice error" role="alert">{error}<button className="text-button" onClick={() => window.location.reload()}>Tentar novamente</button></div>}
        {supabase && !user && ready && <div className="notice">Entre na sua conta para acompanhar e salvar seus estudos.<button className="text-button" onClick={openAccount}>Entrar <ArrowRight size={16} /></button></div>}
        {!ready && !error && <div className="notice" role="status">Carregando seu progresso…</div>}
        {view === 'dashboard' && <>
          <div className="page-heading"><div><div className="eyebrow green-text"><span className="tiny-line" /> SEU FUTURO COMEÇA AQUI</div><h1>Vamos dar o próximo passo<span className="green-text">?</span></h1><p>Disciplina hoje. Farda amanhã. Cada pequeno avanço conta.</p></div><span className="date-chip"><CalendarDays size={16} />{today ? new Date(`${today}T12:00:00`).toLocaleDateString('pt-BR', { day:'numeric', month:'long' }) : 'Sua jornada'}</span></div>
          <section className="hero"><div className="hero-copy"><span className="hero-kicker"><span /> MISSÃO: {isGuard ? 'GUARDA MUNICIPAL DE SÃO GONÇALO' : 'SOLDADO PMERJ'}</span><h2>O seu objetivo é grande.<br />O próximo passo é simples.</h2><p>{nextTopic ? <>Continue por <strong>{nextSubject.title}</strong>.<br />Construa uma base sólida, um assunto de cada vez.</> : 'Você concluiu o roteiro. Hora de revisar e consolidar seu conhecimento.'}</p><button className="button mint" onClick={() => openSubject(nextSubject)}><Play size={16} fill="currentColor" />{done ? 'Continuar meus estudos' : 'Começar minha jornada'}<ArrowRight size={17} /></button><span className="hero-footnote"><CheckCheck size={15} />Do básico ao avançado, no seu ritmo</span></div><div className="hero-art" aria-hidden="true"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit orbit-three" /><div className="art-star star-one">✦</div><div className="art-star star-two">✧</div><svg viewBox="0 0 360 250" className="mountain-art"><path d="M10 230 132 82 194 151 235 107 355 230" fill="#193d45" stroke="#3b6b6d" strokeWidth="1"/><path d="m58 230 118-188 141 188" fill="#254d50" stroke="#56877d" strokeWidth="1"/><path d="m176 42-34 54 26-11 18 17 16-16z" fill="#a6d5c0"/><path d="M142 230c-42-47 87-47 48-85s-28-39-14-103" fill="none" stroke="#d6e8b5" strokeWidth="2" strokeDasharray="5 6"/><path d="M176 42V11m0 1h36l-8 10 8 9h-36" fill="#b7e6bc" stroke="#b7e6bc" strokeWidth="2"/></svg><div className="art-badge"><Shield size={19} /><span>FOCO NO OBJETIVO<b>Uma nova trajetória.</b></span></div></div></section>
          <section className="stats-grid" aria-label="Resumo do progresso"><div className="stat-card"><span className="stat-icon green"><TrendingUp size={20} /></span><span>Progresso geral</span><div><strong>{overall}<small>%</small></strong><span className="stat-tag">{done}/{mainTopics.length} tópicos</span></div><Progress value={overall} /></div><div className="stat-card"><span className="stat-icon purple"><Clock3 size={20} /></span><span>Tempo de estudo</span><div><strong>{Math.floor(totalMinutes/60)}<small>h {totalMinutes%60}min</small></strong></div><p>{state.sessions.length} sessões de dedicação</p></div><div className="stat-card"><span className="stat-icon orange"><Flame size={20} /></span><span>Sua constância</span><div><strong>{streak}<small>{streak === 1 ? 'dia' : 'dias'}</small></strong></div><p>{streak ? 'Continue mantendo o ritmo!' : 'Hoje pode ser o primeiro dia'}</p></div><div className="stat-card"><span className="stat-icon blue"><Target size={20} /></span><span>Acertos nos simulados</span><div><strong>{totalQuestions ? percent(totalCorrect,totalQuestions) : '—'}<small>{totalQuestions ? '%' : ''}</small></strong><span className="stat-tag">Meta: 80%</span></div><p>{state.exams.length} simulados{isGuard ? ' · acertos sem pesos' : ' registrados'}</p></div></section>
          <div className="dashboard-columns"><div><div className="section-heading"><div><h2>Seu caminho até a farda</h2><p>Uma sequência pensada para você evoluir.</p></div><button className="text-button" onClick={() => navigate('roadmap')}>Ver plano completo <ArrowRight size={16} /></button></div><div className="subjects-grid">{subjects.slice(0,contest.mainSubjectCount).map(subjectCard)}</div><div className="info-strip"><CircleHelp size={19} /><p>{contest.sourceNote}</p></div></div><aside className="right-column"><section className="panel goal-panel"><div className="panel-heading"><h3>Sua meta de hoje</h3><Target size={18} /></div><div className="goal-ring" style={{ '--progress': `${Math.min(100,percent(todayMinutes,state.goal))}%` } as React.CSSProperties}><div><strong>{todayMinutes}<span> / {state.goal}</span></strong><small>minutos de estudo</small></div></div><p>{todayMinutes >= state.goal ? 'Meta alcançada. Excelente trabalho!' : 'Reserve um tempo para o seu futuro.'}</p><button className="button dark full" onClick={() => navigate('focus')}><Play size={15} />Iniciar sessão de foco</button></section><section className="panel activity-panel"><div className="panel-heading"><h3>Seu ritmo de estudo</h3><TrendingUp size={18} /></div><p>Últimos 7 dias <b>{week.reduce((n,d)=>n+d.minutes,0)} min</b></p><div className="week-chart">{week.map((day,i)=><div className={i===6?'today':''} key={day.date}><div className="bar-track"><span title={`${day.minutes} minutos`} style={{height: `${day.minutes ? Math.max(5, day.minutes/Math.max(state.goal,...week.map(d=>d.minutes))*100):0}%`}} /></div><small>{day.label}</small></div>)}</div><span className="chart-legend"><i />Tempo registrado por dia</span></section><section className="tip-card"><Sparkles size={20} /><span>DICA DE PREPARAÇÃO</span><h3>Aprenda. Pratique. Revise.</h3><p>Marque um tópico quando conseguir explicá-lo e resolver exercícios sem consultar a resposta.</p></section></aside></div>
        </>}
        {view === 'schedule' && today && ready && <StudySchedule key={`${contestId}-${user?.id ?? 'local'}`} contestId={contestId} state={state} today={today} canEdit={canEdit} save={save} openSubject={id=>openSubject(subjects.find(s=>s.id===id)!)} />}
        {view === 'roadmap' && <>
          <div className="page-heading"><div><div className="eyebrow green-text">DO BÁSICO AO AVANÇADO</div><h1>{active ? active.title : 'Meu plano de estudos'}</h1><p>{active ? active.description : `${subjects.length + 1} etapas, uma direção. Construa sua preparação com clareza.`}</p></div>{active && <button className="button secondary" onClick={() => setSelected(null)}>Todas as disciplinas</button>}</div>
          {!active ? <><div className="roadmap-summary panel"><div><Flag className="green-text" /><div><b>Sua jornada está em movimento</b><p>{done} de {mainTopics.length} tópicos principais concluídos</p></div></div><div><strong>{overall}%</strong><Progress value={overall} /></div></div><div className="subjects-grid roadmap-grid">{subjects.map(subjectCard)}<button className="subject-card review-card" onClick={() => navigate('exams')}><Trophy size={30} /><span className="eyebrow">ETAPA {String(subjects.length + 1).padStart(2, '0')}</span><h3>Revisões e simulados</h3><p>Corrija os erros, treine o tempo e consolide seu domínio da prova.</p><span className="text-button">Registrar meu desempenho <ArrowRight size={16} /></span><span className="card-bottom">{isGuard ? 'Revisão contínua' : '2–3 semanas'}</span></button></div>{isGuard && <GuardResources />}<div className="panel method"><h2>Como estudar cada assunto</h2><div>{['Aprender a teoria','Praticar o fundamento','Resolver provas anteriores','Corrigir os erros','Validar o domínio'].map((t,i)=><div key={t}><span>0{i+1}</span><b>{t}</b></div>)}</div><p>{isGuard ? 'Priorize a legislação específica: 20 questões valem 40 pontos. Distribua as revisões entre as cinco disciplinas e não deixe nenhuma sem estudo.' : 'A estimativa inicial é de 5 a 7 meses, ajustável ao seu ritmo. A meta de 80% de acertos é pedagógica, não uma nota de corte.'}</p></div></> : <>
            <div className="subject-overview panel"><span className={`subject-symbol subject-${active.id}`}>{subjectIcons[Number(active.id)-1]}</span><div><b>Etapa {active.id} · {active.duration}</b><p>{active.groups.flatMap(g=>g.topics).filter(t=>state.completed[t.id]).length} de {active.groups.flatMap(g=>g.topics).length} tópicos concluídos</p></div><span className="pill green">{isGuard ? 'Edital 001/PMSG/2026' : active.id === '7' ? 'Complementar · 2014' : active.id === '6' ? 'Prova escrita' : 'Referência · 2024'}</span></div>
            {isGuard && <GuardResources subjectId={active.id} />}<div className="filter-row"><label className="search-field"><Search size={18} /><input value={filter} onChange={e=>setFilter(e.target.value)} placeholder="Buscar um assunto nesta disciplina…" aria-label="Buscar assunto" /></label><label className="pending-filter"><input type="checkbox" checked={onlyPending} onChange={e=>setOnlyPending(e.target.checked)} />Somente pendentes</label></div>
            {active.groups.map(g=>{const topics=g.topics.filter(t=>(!onlyPending||!state.completed[t.id])&&t.title.toLocaleLowerCase('pt-BR').includes(filter.toLocaleLowerCase('pt-BR'))); return topics.length>0 && <details className="topic-group" key={g.id} open><summary><span className="group-number">{g.id}</span><h3>{g.title}</h3><span>{g.topics.filter(t=>state.completed[t.id]).length}/{g.topics.length}</span><ChevronDown size={18}/></summary><div>{topics.map(t=><div className={`topic-row ${state.completed[t.id]?'completed':''}`} key={t.id}><label><input type="checkbox" checked={!!state.completed[t.id]} disabled={!canEdit} onChange={()=>toggleTopic(t.id)} /><span>{t.title}</span></label><button className={`icon-button ${state.notes[t.id] ? 'has-note' : ''}`} aria-label={`Estudar tema e abrir caderno: ${t.title}`} title="Explicação do tema e meu caderno" onClick={()=>router.push(`/estudar?concurso=${contestId}&tema=${encodeURIComponent(t.id)}`)}><FileText size={17}/></button></div>)}</div></details>;})}
            {!active.groups.some(g=>g.topics.some(t=>(!onlyPending||!state.completed[t.id])&&t.title.toLowerCase().includes(filter.toLowerCase())))&&<div className="empty-state"><Search/><h3>Nenhum assunto encontrado</h3><p>Ajuste a busca ou desmarque o filtro de pendentes.</p></div>}
            <div className="info-strip"><CheckCheck size={20}/><p>Conclua o tópico quando conseguir explicar a teoria e resolver exercícios sozinho. Use as anotações para guardar dúvidas e pontos de revisão.</p></div>
          </>}
        </>}
        {view === 'focus' && <><div className="page-heading"><div><div className="eyebrow green-text">UM PASSO DE CADA VEZ</div><h1>Hora de focar.</h1><p>Escolha uma disciplina, diminua as distrações e comece.</p></div><button className="button secondary" onClick={()=>setManualSession(true)} disabled={!canEdit}><Plus size={17}/>Registrar estudo</button></div><div className="focus-layout"><section className="panel focus-panel"><span className="pill green"><span className="status-dot"/>{deadline ? 'Sessão em andamento' : timerFinished ? 'Sessão concluída' : 'Seu momento de concentração'}</span><label className="field">Disciplina<select disabled={deadline!==null || remaining!==duration*60} value={timerSubject} onChange={e=>setTimerSubject(e.target.value)}>{subjects.map(s=><option key={s.id} value={s.id}>{s.title}</option>)}</select></label><div className="timer-display" role="timer" aria-label={`${Math.floor(remaining/60)} minutos e ${remaining%60} segundos`}>{String(Math.floor(remaining/60)).padStart(2,'0')}<span>:</span>{String(remaining%60).padStart(2,'0')}</div><p>{timerFinished?'Muito bem! Salve esta sessão no seu histórico.':'O esforço de agora constrói a sua conquista.'}</p><div className="duration-options">{[25,45,60].map(n=><button key={n} className={duration===n?'selected':''} disabled={deadline!==null||remaining!==duration*60} onClick={()=>{setDuration(n);setRemaining(n*60);}}>{n} min</button>)}</div><div className="timer-controls">{timerFinished ? <button disabled={!canEdit} className="button dark" onClick={finishTimer}><Check size={18}/>Salvar sessão de {duration} min</button> : <button disabled={!canEdit} className="button dark" onClick={()=>{if(deadline) {setRemaining(Math.max(0,Math.ceil((deadline-Date.now())/1000)));setDeadline(null);} else setDeadline(Date.now()+remaining*1000);}}>{deadline?<Pause size={18}/>:<Play size={18}/>} {deadline?'Pausar':remaining===duration*60?'Começar a sessão':'Retomar sessão'}</button>}<button className="icon-button reset-timer" aria-label="Reiniciar cronômetro" onClick={()=>{setDeadline(null);setRemaining(duration*60);setTimerFinished(false);}}><RotateCcw size={20}/></button></div></section><aside><section className="tip-card focus-tip"><Compass size={24}/><h3>Uma boa sessão começa com uma intenção.</h3><p>1. Escolha um assunto do seu plano.</p><p>2. Estude a teoria e faça exercícios.</p><p>3. Anote o que precisa revisar.</p><p>Depois, faça uma pausa. Constância também precisa de descanso.</p></section><div className="panel focus-total"><Clock3 size={22}/><div><strong>{todayMinutes} minutos</strong><p>estudados hoje · meta de {state.goal} min</p></div></div></aside></div><section className="panel history"><div className="section-heading"><h2>Sessões recentes</h2><span>{state.sessions.length} no total</span></div>{state.sessions.length ? <div className="history-list">{state.sessions.slice(-10).reverse().map(s=><div key={s.id}><span className="stat-icon green"><BookOpen size={18}/></span><div><b>{subjects.find(x=>x.id===s.subject)?.title||'Estudo livre'}</b><small>{new Date(s.date).toLocaleDateString('pt-BR')}</small></div><strong>{s.minutes} min</strong></div>)}</div> : <div className="empty-state compact"><Timer size={28}/><h3>Seu tempo merece ser reconhecido</h3><p>Conclua uma sessão de foco ou registre um estudo já realizado.</p></div>}</section></>}
        {view === 'exams' && <><div className="page-heading"><div><div className="eyebrow green-text">PRATIQUE, AVALIE, EVOLUA</div><h1>Cada simulado, um aprendizado.</h1><p>Registre seus resultados e transforme os erros em próximos passos.</p></div><button className="button dark" onClick={()=>setExamModal(true)} disabled={!canEdit}><Plus size={18}/>Novo resultado</button></div><div className="exam-reference"><div><span className="pill">REFERÊNCIA · {contest.reference}</span><h2>Treine para o dia da prova.</h2><p>Pratique no banco de questões comentadas ou registre o resultado de uma prova anterior.</p></div><div><strong>{contest.questionCount}</strong><small>questões objetivas</small></div><div><strong>4h</strong><small>tempo de referência</small></div><div><strong>80<em>%</em></strong><small>meta pessoal de acertos</small></div></div>{isGuard && <GuardResources />}<div className="section-heading"><h2>Histórico de simulados</h2><button className="button dark" onClick={()=>router.push(`/questoes?concurso=${contestId}`)}>Resolver questões comentadas</button><span>{state.exams.length} registros</span></div>{state.exams.length ? <div className="exam-list">{[...state.exams].reverse().map(e=><article className="panel exam-result" key={e.id}><div className={`exam-score ${percent(e.correct,e.total)>=80?'passed':''}`}>{percent(e.correct,e.total)}<small>%</small></div><div><h3>{e.title}</h3><p>{e.correct} de {e.total} questões · {new Date(e.date+'T12:00:00').toLocaleDateString('pt-BR')}</p>{e.template === 'gmsg-2026' && e.scores && <div className="weighted-result"><b>{e.points}/100 pontos ponderados</b><p>{gradeGuard(e.scores).meetsMinimum ? 'Mínimo da objetiva atingido neste treino; não garante classificação.' : gradeGuard(e.scores).zeroSubject ? 'Atenção: há disciplina zerada. O mínimo do edital não foi atingido.' : 'Atenção: pontuação abaixo dos 50 pontos mínimos.'}</p><p>{guardSections.map(s=>`${s.title}: ${e.scores![s.id]}/${s.questions}`).join(' · ')}</p></div>}{e.errors&&<p className="exam-notes">{e.errors}</p>}</div><span className={`pill ${percent(e.correct,e.total)>=80?'green':''}`}>{percent(e.correct,e.total)>=80?'80% de acertos':'Continue praticando'}</span></article>)}</div> : <div className="empty-state panel"><span className="empty-icon"><ListChecks size={32}/></span><h2>Seu primeiro resultado começa aqui.</h2><p>Fez uma prova anterior ou uma lista de questões?<br/>Registre os acertos e os assuntos que precisam de atenção.</p><button className="button dark" disabled={!canEdit} onClick={()=>setExamModal(true)}><Plus size={17}/>Registrar primeiro simulado</button></div>}<div className="info-strip"><CircleHelp size={20}/><p>{isGuard ? 'O edital enviado exige pelo menos 50 de 100 pontos e nenhuma disciplina zerada. A meta pessoal de 80% é apenas de treino; alcançar o mínimo não garante classificação. Simulados livres mostram acertos, sem aplicar pesos.' : '80% é uma meta de treino, não uma nota de corte oficial. Pratique e avalie a redação separadamente. As questões do banco são autorais e os treinos não reproduzem a distribuição oficial da prova.'}</p></div></>}
        {view === 'settings' && <><div className="page-heading"><div><div className="eyebrow green-text">DO SEU JEITO</div><h1>Uma rotina que funciona para você.</h1><p>Ajuste a meta e cuide do seu histórico de preparação.</p></div></div><div className="settings-grid"><section className="panel"><Target className="green-text"/><h2>Meta diária</h2><p>Defina um objetivo realista. O importante é voltar amanhã.</p><form onSubmit={async e=>{e.preventDefault();const data=new FormData(e.currentTarget);if(await save({...state,goal:Number(data.get('goal'))}))setToast('Meta diária atualizada.');}}><label className="field">Minutos de estudo por dia<input key={state.goal} name="goal" type="number" min="10" max="480" step="5" defaultValue={state.goal} required/></label><button disabled={!canEdit} className="button dark">Salvar meta</button></form></section><section className="panel"><Cloud className="green-text"/><h2>{user?'Sua conta está conectada':'Sua preparação, sempre com você'}</h2><p>{supabase ? user?.email || 'Entre para salvar seus dados no Supabase.' : 'O modo local está ativo. Os dados ficam apenas neste navegador. A sincronização estará disponível após configurar o Supabase.'}</p>{user?<button className="button secondary" disabled={busy} onClick={async()=>{const result=await supabase?.auth.signOut();if(result?.error)setError('Não foi possível sair. Tente novamente.');else setToast('Você saiu da conta.');}}><LogOut size={17}/>Sair da conta</button>:<button className="button secondary" onClick={openAccount}><LogIn size={17}/> {supabase?'Entrar ou criar conta':'Ver configuração'}</button>}</section><section className="panel"><ArrowDownToLine className="green-text"/><h2>Backup do progresso</h2><p>Exporte tópicos, anotações, sessões e resultados em um arquivo JSON. Guarde uma cópia antes de trocar de navegador.</p><button disabled={!ready} className="button secondary" onClick={exportData}><ArrowDownToLine size={17}/>Exportar meus dados</button><hr/><p>Importar um backup substitui apenas o progresso de {contest.name}. Também permite levar seus dados locais para uma conta após entrar.</p><button disabled={!canEdit} className="button secondary" onClick={()=>fileRef.current?.click()}><Upload size={17}/>Importar e substituir progresso</button><input hidden ref={fileRef} type="file" accept=".json,application/json" onChange={async e=>{const file=e.target.files?.[0];if(!file)return;try {if(file.size>5_000_000)throw new Error();const raw=JSON.parse(await file.text());if(raw.version===2 ? raw.contestId!==contestId : isGuard) {setError('Este backup pertence a outro concurso. Troque de concurso antes de importar.');return;}const data=parseState(raw.version===2?raw.data:raw);if(await save(data))setToast('Backup importado com sucesso.');}catch{setError('Arquivo inválido. Escolha um backup JSON exportado pelo sistema (até 5 MB).');}e.target.value='';}}/></section><section className="panel"><BookOpen className="green-text"/><h2>Sobre seu roteiro</h2><p>{mainTopics.length} tópicos principais{isGuard ? ' organizados a partir do Anexo III do edital enviado, com acesso à prova anterior para prática.' : ', 32 complementares e uma etapa de revisões e simulados. Conteúdo organizado a partir do plano fornecido.'}</p><p>Priorize uma disciplina por vez. Quando houver novo edital, ele deve prevalecer sobre o histórico das provas.</p><span className="pill green">Rumo à Farda · versão 1.0</span></section></div></>}
        <footer><span><Shield size={14}/> Rumo à Farda</span><p>Seu esforço de hoje faz parte da sua história de amanhã.</p><span>{contest.label}</span></footer>
      </main>
    </div>
    {toast&&<div className="toast" role="status"><Check size={18}/>{toast}<button aria-label="Fechar aviso" onClick={()=>setToast('')}><X size={16}/></button></div>}
    {auth&&<Modal title={user && authMode!=='update'?'Minha conta':!supabase?'Tudo pronto para conectar':authMode==='signup'?'Comece sua jornada':authMode==='reset'?'Recuperar acesso':authMode==='update'?'Definir nova senha':'Bom ter você por aqui'} close={()=>setAuth(false)}>{user && authMode!=='update'?<><div className="setup-icon"><Shield size={30}/></div><h3>{user.user_metadata?.name || 'Estudante'}</h3><p style={{overflowWrap:'anywhere'}}>{user.email}</p><span className="pill green">Conta conectada</span><p>Seu progresso é salvo nesta conta e separado por concurso.</p>{authMessage&&<div className="notice" role="alert">{authMessage}</div>}<div className="auth-links"><button type="button" onClick={()=>{setAuth(false);navigate('settings');}}>Configurações da conta</button></div><button className="button secondary full" disabled={authBusy||busy} onClick={signOutAccount}><LogOut size={17}/>{authBusy?'Saindo…':'Sair da conta'}</button></>:!supabase?<><div className="setup-icon"><Cloud size={30}/></div><p>Você está no modo local. Seu progresso é salvo neste navegador.</p><p>Para ativar contas e sincronização, configure as variáveis públicas do Supabase em <code>.env.local</code> e execute a migração SQL incluída no projeto.</p><div className="notice">As instruções completas estão no README do frontend.</div><button className="button dark full" onClick={()=>setAuth(false)}>Continuar estudando</button></>:<form onSubmit={submitAuth}>{authMode==='signup'&&<label className="field">Seu nome<input name="name" autoComplete="name" required maxLength={60}/></label>}{authMode!=='update'&&<label className="field">E-mail<input name="email" type="email" autoComplete="email" placeholder="voce@exemplo.com" required/></label>}{authMode!=='reset'&&<label className="field">Senha<input name="password" type="password" autoComplete={authMode==='login'?'current-password':'new-password'} minLength={8} placeholder="Pelo menos 8 caracteres" required/></label>}{authMessage&&<div className="notice" role="status">{authMessage}</div>}<button className="button dark full" disabled={authBusy}>{authBusy?'Aguarde…':authMode==='signup'?'Criar minha conta':authMode==='reset'?'Enviar link de recuperação':authMode==='update'?'Atualizar senha':'Entrar na minha conta'}<ArrowRight size={17}/></button><div className="auth-links"><button type="button" onClick={()=>{setAuthMode(authMode==='login'?'signup':'login');setAuthMessage('');}}>{authMode==='login'?'Ainda não tenho conta':'Já tenho conta'}</button>{authMode==='login'&&<button type="button" onClick={()=>{setAuthMode('reset');setAuthMessage('');}}>Esqueci minha senha</button>}</div></form>}</Modal>}

    {manualSession&&<Modal title="Registrar tempo de estudo" close={()=>setManualSession(false)}><form onSubmit={async e=>{e.preventDefault();const data=new FormData(e.currentTarget);await registerSession(Number(data.get('minutes')),String(data.get('subject')));}}><label className="field">Disciplina<select name="subject" defaultValue={timerSubject}>{subjects.map(s=><option key={s.id} value={s.id}>{s.title}</option>)}</select></label><label className="field">Minutos estudados hoje<input type="number" name="minutes" min="1" max="720" defaultValue="30" required/></label><button disabled={!canEdit} className="button dark full">Salvar sessão <Check size={17}/></button></form></Modal>}
    {examModal&&<Modal title="Registrar simulado" close={()=>setExamModal(false)}><form onSubmit={async e=>{
      e.preventDefault(); const data=new FormData(e.currentTarget);
      let correct=Number(data.get('correct')), total=Number(data.get('total'));
      let extra = {};
      if (isGuard && examTemplate === 'gmsg-2026') {
        const scores = Object.fromEntries(guardSections.map(s=>[s.id, Number(data.get(`score-${s.id}`))]));
        const result = gradeGuard(scores); correct=result.correct; total=80;
        extra={scores,points:result.points,template:'gmsg-2026'};
      }
      if(correct>total){setToast('Os acertos não podem superar o total de questões.');return;}
      if(await save({...state,exams:[...state.exams,{id:crypto.randomUUID(),date:String(data.get('date')),title:String(data.get('title')),correct,total,errors:String(data.get('errors')),...extra}]})){setExamModal(false);setToast('Resultado registrado. Continue evoluindo!');}
    }}>
      {isGuard && <label className="field">Tipo de registro<select value={examTemplate} onChange={e=>setExamTemplate(e.target.value as 'gmsg-2026'|'practice')}><option value="gmsg-2026">Modelo edital 2026 · 80 questões / 100 pontos</option><option value="practice">Treino livre ou prova anterior · sem pesos</option></select></label>}
      <label className="field">Nome do simulado<input name="title" placeholder={isGuard?'Ex.: Treino Guarda SG · Selecon':'Ex.: PMERJ 2024 · FGV'} maxLength={120} required/></label>
      <label className="field">Data<input name="date" type="date" defaultValue={today} max={today} required/></label>
      {isGuard && examTemplate === 'gmsg-2026' ? <><div className="notice">Informe os acertos por disciplina. Conhecimentos Específicos vale 2 pontos por questão.</div>{guardSections.map(section=><label className="field score-field" key={section.id}><span>{section.title}<small>{section.questions} questões · peso {section.weight}</small></span><input aria-label={`Acertos em ${section.title}`} name={`score-${section.id}`} type="number" min="0" max={section.questions} required/></label>)}</> : <div className="form-row"><label className="field">Total de questões<input name="total" type="number" min="1" max="500" defaultValue={contest.questionCount} required/></label><label className="field">Acertos<input name="correct" type="number" min="0" max="500" required/></label></div>}
      <label className="field">O que precisa de revisão?<textarea name="errors" rows={3} maxLength={3000} placeholder="Assuntos, erros de interpretação, cálculos…"/></label><button disabled={!canEdit} className="button dark full">Salvar resultado <Check size={17}/></button></form></Modal>}
  </div>;
}
