'use client';
import { useEffect, useRef, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { emptyState, parseState, StudyState } from './study';
import type { ContestId } from './contests';
export function useStudy(contestId: ContestId) {
  const storageKey = contestId === 'pmerj' ? 'pmerj-study-v1' : 'gmsg-study-v1';
  const [state, setState] = useState<StudyState>(emptyState);
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const lock = useRef(false);
  const currentUser = useRef<string | null>(null);
  useEffect(() => {
    if (!supabase) {
      // Load persisted browser data after hydration.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      try { const saved = localStorage.getItem(storageKey); if (saved) setState(parseState(JSON.parse(saved))); setReady(true); }
      catch { setError('Não foi possível ler o progresso local. Exporte ou preserve os dados do navegador antes de limpar o armazenamento.'); }
      return;
    }
    let alive = true;
    let version = 0;
    const client = supabase;
    const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
      const id = session?.user.id ?? null;
      setUser(session?.user ?? null);
      if (id === currentUser.current && _event !== 'INITIAL_SESSION') return;
      currentUser.current = id;
      const revision = ++version;
      setReady(false); setState(emptyState()); setError('');
      if (!id) { setReady(true); return; }
      // Schedule outside the auth callback to avoid holding the auth lock.
      setTimeout(async () => {
        try {
        const { data, error } = await client.from('study_state').select('data').eq('user_id', id).eq('contest_id', contestId).maybeSingle();
        if (!alive || revision !== version) return;
        if (error) { setError('Não foi possível carregar seus dados. Verifique a conexão e execute a migração do Supabase.'); return; }
        try { setState(data ? parseState(data.data) : emptyState()); setReady(true); }
        catch { setError('Os dados da conta têm um formato inválido.'); }
        } catch { if (alive && revision === version) setError('Não foi possível acessar o Supabase. Confira a conexão e tente novamente.'); }
      }, 0);
    });
    return () => { alive = false; subscription.unsubscribe(); };
  }, [contestId, storageKey]);
  async function save(next: StudyState) {
    if (!ready || lock.current) return false;
    if (supabase && !user) { setError('Entre na sua conta para salvar o progresso.'); return false; }
    lock.current = true; setBusy(true); setError('');
    const owner = user?.id ?? null;
    try {
      parseState(next);
      if (supabase && owner) {
        const { error } = await supabase.from('study_state').upsert({ user_id: owner, contest_id: contestId, data: next, updated_at: new Date().toISOString() }, { onConflict: 'user_id,contest_id' });
        if (error) throw error;
      } else localStorage.setItem(storageKey, JSON.stringify(next));
      if (owner === currentUser.current) setState(next);
      return true;
    } catch { setError('Não foi possível salvar. Seu progresso anterior foi preservado. Verifique a conexão ou o armazenamento e tente novamente.'); return false; }
    finally { lock.current = false; setBusy(false); }
  }
  return { state, user, ready, busy, error, setError, save };
}
