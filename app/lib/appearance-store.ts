export type Theme = 'light' | 'dark' | 'system';
export type Appearance = { theme: Theme; fontScale: number };
export const defaultAppearance: Appearance = { theme: 'system', fontScale: 100 };
export function parseAppearance(value: unknown): Appearance {
  const item = value as Partial<Appearance> | null;
  return {
    theme: item?.theme === 'light' || item?.theme === 'dark' ? item.theme : 'system',
    fontScale: typeof item?.fontScale === 'number' && Number.isInteger(item.fontScale) && item.fontScale >= 100 && item.fontScale <= 200 && item.fontScale % 10 === 0 ? item.fontScale : 100,
  };
}
export type AppearanceState = {
  preferences: Appearance;
  status: 'loading' | 'local' | 'saved' | 'saving' | 'error';
  ready: boolean;
};
export const initialAppearanceState: AppearanceState = { preferences: defaultAppearance, status: 'loading', ready: false };

type Dependencies = {
  local: (owner: string | null) => Appearance;
  cache: (owner: string | null, value: Appearance) => void;
  apply: (value: Appearance) => void;
  load: (owner: string) => Promise<Appearance | null>;
  save: (owner: string, value: Appearance) => Promise<void>;
};

/** One queue per account session: old requests never update a new account's UI. */
export function createAppearanceStore(deps: Dependencies) {
  let state = initialAppearanceState;
  let owner: string | null | undefined;
  let generation = 0;
  let revision = 0;
  let saving = false;
  const listeners = new Set<() => void>();
  const publish = (next: AppearanceState) => {
    state = next;
    deps.apply(next.preferences);
    listeners.forEach(listener => listener());
  };
  async function connect(nextOwner: string | null, force = false) {
    if (owner === nextOwner && !force) return;
    owner = nextOwner;
    const version = ++generation;
    saving = false;
    revision = 0;
    const cached = parseAppearance(deps.local(owner));
    publish({ preferences: cached, status: owner ? 'loading' : 'local', ready: !owner });
    if (!owner) return;
    try {
      const remote = await deps.load(owner);
      if (version !== generation) return;
      const preferences = remote ? parseAppearance(remote) : cached;
      deps.cache(owner, preferences);
      publish({ preferences, status: remote ? 'saved' : 'local', ready: true });
    } catch {
      if (version === generation) publish({ ...state, status: 'error', ready: false });
    }
  }
  async function flush() {
    if (!owner || !state.ready || saving) return;
    const account = owner, version = generation;
    saving = true;
    publish({ ...state, status: 'saving' });
    try {
      let written: number;
      do {
        written = revision;
        await deps.save(account, { ...state.preferences });
        if (version !== generation) return;
      } while (written !== revision);
      publish({ ...state, status: 'saved' });
    } catch {
      if (version === generation) publish({ ...state, status: 'error' });
    } finally {
      if (version === generation) saving = false;
    }
  }
  return {
    getSnapshot: () => state,
    subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
    connect,
    disconnect() { generation++; owner = undefined; saving = false; },
    change(patch: Partial<Appearance>) {
      if (!state.ready || owner === undefined) return;
      const preferences = parseAppearance({ ...state.preferences, ...patch });
      revision++;
      deps.cache(owner, preferences);
      publish({ preferences, status: owner ? 'saving' : 'local', ready: true });
      void flush();
    },
    retry() {
      if (owner === undefined) return;
      if (!state.ready) void connect(owner, true);
      else void flush();
    },
  };
}
