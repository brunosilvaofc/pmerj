'use client';
import { ThemeSelector } from './theme-selector';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';
import { Shield, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
export function AuthPage({register=false}:{register?:boolean}) {
 const router=useRouter();
 const [mode,setMode]=useState(register?'register':'login');
 const [busy,setBusy]=useState(false),[message,setMessage]=useState('');
 const [checkingSession,setCheckingSession]=useState(!!supabase);
 useEffect(()=>{
  if(!supabase)return;
  let recovering=false;
  const {data}=supabase.auth.onAuthStateChange((event,session)=>{
   if(event==='PASSWORD_RECOVERY'){
    recovering=true;
    setMode('update');
    setCheckingSession(false);
    return;
   }
   // INITIAL_SESSION includes an existing persisted session on page entry.
   // Keep recovery open even if token refresh emits another auth event.
   if(session && !recovering){
    setCheckingSession(true);
    router.replace('/');
   }else{
    setCheckingSession(false);
   }
  });
  return()=>data.subscription.unsubscribe();
 },[router]);
 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault();if(!supabase||busy)return;
  const form=new FormData(e.currentTarget),email=String(form.get('email')??''),password=String(form.get('password')??'');
  if(mode==='register' && password!==form.get('confirm')){setMessage('As senhas precisam ser iguais.');return;}
  setBusy(true);setMessage('');
  try {
   if(mode==='reset'){const {error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:`${location.origin}/login`});if(error)throw error;setMessage('Se houver uma conta com esse e-mail, você receberá o link de recuperação.');}
   else if(mode==='update'){const {error}=await supabase.auth.updateUser({password});if(error)throw error;router.replace('/');}
   else if(mode==='register'){const {data,error}=await supabase.auth.signUp({email,password,options:{data:{name:String(form.get('name')??'')},emailRedirectTo:location.origin}});if(error)throw error;if(data.session)router.replace('/');else setMessage('Confira seu e-mail para confirmar o cadastro. Depois, entre na sua conta.');}
   else {const {error}=await supabase.auth.signInWithPassword({email,password});if(error)throw error;router.replace('/');}
  }catch{setMessage('Não foi possível concluir. Confira os dados, a confirmação do e-mail e sua conexão.');}finally{setBusy(false);}
 }
 if(checkingSession)return <main className="auth-page"><section className="panel auth-card" role="status" aria-live="polite"><Shield className="green-text"/><h1>Verificando sua sessão…</h1><p>Se você já entrou, vamos abrir seu painel.</p></section></main>;
 return <main className="auth-page"><section className="auth-story"><div className="auth-theme"><ThemeSelector /></div><Link href="/" className="text-button"><Shield/> Rumo à Farda</Link><span className="eyebrow">SUA PREPARAÇÃO COMEÇA AQUI</span><h1>Um passo por dia.<br/>Uma conquista para a vida.</h1><p>Seu plano, cronograma e caderno de estudo em um só lugar. Prepare-se para PMERJ e Guarda Municipal de São Gonçalo.</p></section><section className="panel auth-card"><span className="eyebrow green-text">BEM-VINDO À SUA ROTINA</span><h2>{mode==='register'?'Crie sua conta':mode==='reset'?'Recupere seu acesso':mode==='update'?'Defina uma nova senha':'Entre para continuar'}</h2><p>Guarde seu progresso e retome de onde parou.</p>{!supabase&&<div className="notice">O Supabase ainda precisa ser configurado para ativar login e registro. Enquanto isso, você pode estudar no modo local.</div>}<form onSubmit={submit}>{mode==='register'&&<label className="field">Nome<input name="name" autoComplete="name" maxLength={60} required/></label>}{mode!=='update'&&<label className="field">E-mail<input name="email" type="email" autoComplete="email" required/></label>}{mode!=='reset'&&<label className="field">Senha<input name="password" type="password" minLength={8} autoComplete={mode==='login'?'current-password':'new-password'} required/><small>Pelo menos 8 caracteres.</small></label>}{mode==='register'&&<label className="field">Confirme a senha<input name="confirm" type="password" minLength={8} autoComplete="new-password" required/></label>}{message&&<div className="notice" role="status">{message}</div>}<button disabled={!supabase||busy} className="button dark full">{busy?'Aguarde…':mode==='register'?'Criar conta':mode==='reset'?'Enviar link':mode==='update'?'Salvar senha':'Entrar'}<ArrowRight size={17}/></button></form><div className="auth-links"><Link href={register?'/login':'/registro'}>{register?'Já tenho conta':'Criar uma conta'}</Link><button type="button" onClick={()=>{setMode(mode==='reset'?'login':'reset');setMessage('');}}>{mode==='reset'?'Voltar ao login':'Esqueci minha senha'}</button></div><Link className="text-button" href="/">{supabase?'Voltar ao início':'Continuar no modo local'}</Link></section></main>;
}
