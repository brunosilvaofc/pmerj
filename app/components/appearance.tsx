'use client';

import { useEffect, useSyncExternalStore, type CSSProperties, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { createAppearanceStore, defaultAppearance, initialAppearanceState, parseAppearance, type Appearance } from '../lib/appearance-store';

const storageKey = (owner: string | null) => `rumo-a-farda-appearance:${owner ?? 'guest'}`;
function apply(preferences: Appearance) {
  document.documentElement.dataset.theme = preferences.theme === 'system'
    ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : preferences.theme;
  // The pre-paint script uses this cache; the account remains the source of truth.
  try { localStorage.setItem('rumo-a-farda-theme', preferences.theme); } catch { /* Storage can be disabled. */ }
}
const store = createAppearanceStore({
  local(owner) {
    try {
      const cached = localStorage.getItem(storageKey(owner));
      if (cached) return parseAppearance(JSON.parse(cached));
      if (!owner) return parseAppearance({ theme: localStorage.getItem('rumo-a-farda-theme') });
    } catch { /* Keep controls usable when storage is disabled. */ }
    return defaultAppearance;
  },
  cache(owner, preferences) {
    try { localStorage.setItem(storageKey(owner), JSON.stringify(preferences)); } catch { /* Cloud saving remains available. */ }
  },
  apply,
  async load(owner) {
    if (!supabase) return null;
    const { data, error } = await supabase.from('user_preferences').select('theme, font_scale').eq('user_id', owner).maybeSingle();
    if (error) throw error;
    return data ? parseAppearance({ theme: data.theme, fontScale: data.font_scale }) : null;
  },
  async save(owner, preferences) {
    if (!supabase) return;
    const { error } = await supabase.from('user_preferences').upsert({
      user_id: owner, theme: preferences.theme, font_scale: preferences.fontScale,
    }, { onConflict: 'user_id' });
    if (error) throw error;
  },
});
const serverSnapshot = () => initialAppearanceState;
export function useAppearance() {
  return { ...useSyncExternalStore(store.subscribe, store.getSnapshot, serverSnapshot), change: store.change, retry: store.retry };
}
export function AppearanceSync() {
  useEffect(() => {
    const media = matchMedia('(prefers-color-scheme: dark)');
    const update = () => apply(store.getSnapshot().preferences);
    media.addEventListener('change', update);
    let alive = true;
    const client = supabase;
    const subscription = client?.auth.onAuthStateChange((_event, session) => {
      // Supabase requests run after its authentication lock has been released.
      setTimeout(() => { if (alive) void store.connect(session?.user.id ?? null); }, 0);
    }).data.subscription;
    if (!client) void store.connect(null);
    return () => {
      alive = false;
      subscription?.unsubscribe();
      media.removeEventListener('change', update);
      store.disconnect();
    };
  }, []);
  return null;
}
export function AppearanceStatus() {
  const { status, ready, retry } = useAppearance();
  if (status === 'error') return <div className="appearance-error" role="alert">
    <span>{ready ? 'A mudança está neste aparelho, mas não foi salva na conta.' : 'Não foi possível carregar suas preferências. Confira a conexão e a configuração do Supabase.'}</span>
    <button type="button" className="text-button" onClick={retry}>Tentar novamente</button>
  </div>;
  return <span className="appearance-status" role="status">{status === 'loading' ? 'Carregando preferências…' : status === 'saving' ? 'Salvando na conta…' : status === 'saved' ? 'Preferências salvas na conta' : 'Preferências neste navegador'}</span>;
}
export function ReadingArea({ children }: { children: ReactNode }) {
  const { preferences, ready, change } = useAppearance();
  const size = preferences.fontScale;
  return <>
    <div className="reading-toolbar" role="group" aria-label="Tamanho da fonte da aula">
      <strong>Tamanho da fonte</strong>
      <div className="reading-actions">
        <button type="button" className="button secondary" aria-label="Diminuir fonte da aula" disabled={!ready || size <= 100} onClick={() => change({ fontScale: size - 10 })}>A−</button>
        <output aria-live="polite" aria-label="Tamanho atual da fonte">{size}%</output>
        <button type="button" className="button secondary" aria-label="Aumentar fonte da aula" disabled={!ready || size >= 200} onClick={() => change({ fontScale: size + 10 })}>A+</button>
        <button type="button" className="text-button" disabled={!ready || size === 100} onClick={() => change({ fontScale: 100 })}>Restaurar padrão</button>
      </div>
      <AppearanceStatus />
    </div>
    <div className="reading-content" style={{ '--reading-scale': size / 100 } as CSSProperties}>{children}</div>
  </>;
}
