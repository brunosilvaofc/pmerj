const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => {
  module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, filename);
};
const { createAppearanceStore, parseAppearance } = require('../app/lib/appearance-store.ts');
const defaults = { theme: 'system', fontScale: 100 };
const tick = () => new Promise(resolve => setImmediate(resolve));
function deferred() { let resolve, reject; const promise = new Promise((a,b) => { resolve=a; reject=b; }); return { promise, resolve, reject }; }
function fixture(overrides = {}) {
  const cache = new Map(), applied = [], writes = [];
  const store = createAppearanceStore({
    local: id => cache.get(id) || defaults,
    cache: (id, value) => cache.set(id, value),
    apply: value => applied.push(value),
    load: async () => null,
    save: async (id, value) => { writes.push({ id, value }); },
    ...overrides,
  });
  return { store, cache, applied, writes };
}
test('appearance validates theme and accessible font scale limits', () => {
  assert.deepEqual(parseAppearance({ theme: 'dark', fontScale: 200 }), { theme: 'dark', fontScale: 200 });
  for (const fontScale of [90, 210, 115, NaN, '150', Infinity]) assert.equal(parseAppearance({ fontScale }).fontScale, 100);
  assert.deepEqual(parseAppearance(null), defaults);
  assert.equal(parseAppearance({ theme: 'unexpected' }).theme, 'system');
});
test('guest preferences persist locally without a backend write', async () => {
  const { store, cache, writes } = fixture();
  await store.connect(null);
  store.change({ fontScale: 160, theme: 'dark' });
  assert.deepEqual(cache.get(null), { fontScale: 160, theme: 'dark' });
  assert.equal(store.getSnapshot().status, 'local');
  assert.equal(writes.length, 0);
});
test('account preferences restore on another browser and override its local values', async () => {
  const remote = { theme: 'dark', fontScale: 170 };
  const { store, cache } = fixture({ load: async () => remote });
  await store.connect('alice');
  assert.deepEqual(store.getSnapshot().preferences, remote);
  assert.deepEqual(cache.get('alice'), remote);
  assert.equal(store.getSnapshot().status, 'saved');
});
test('rapid font and theme changes serialize writes and save the latest combination', async () => {
  const first = deferred(), calls = [];
  const { store } = fixture({ save: async (id,value) => { calls.push({id,value}); if(calls.length === 1) await first.promise; } });
  await store.connect('alice');
  store.change({ fontScale: 110 });
  store.change({ fontScale: 120 });
  store.change({ theme: 'dark' });
  assert.equal(calls.length, 1);
  first.resolve(); await tick();
  assert.equal(calls.length, 2);
  assert.deepEqual(calls[1], { id: 'alice', value: { theme: 'dark', fontScale: 120 } });
  assert.equal(store.getSnapshot().status, 'saved');
});
test('late account load cannot replace a different account or guest', async () => {
  const old = deferred();
  const { store } = fixture({ load: async id => id === 'alice' ? old.promise : { theme: 'light', fontScale: 130 } });
  const pending = store.connect('alice');
  await store.connect('bob');
  old.resolve({ theme: 'dark', fontScale: 200 }); await pending;
  assert.deepEqual(store.getSnapshot().preferences, { theme: 'light', fontScale: 130 });
  await store.connect(null);
  assert.deepEqual(store.getSnapshot().preferences, defaults);
});
test('late save completion cannot change a new account status or preferences', async () => {
  const old = deferred();
  const { store } = fixture({ save: async () => old.promise, load: async id => id === 'bob' ? { theme: 'light', fontScale: 140 } : null });
  await store.connect('alice'); store.change({ theme: 'dark' });
  await store.connect('bob'); const snapshot = store.getSnapshot();
  old.resolve(); await tick();
  assert.deepEqual(store.getSnapshot(), snapshot);
});
test('load failure does not overwrite cloud data and offers retry', async () => {
  let fail = true;
  const { store, writes } = fixture({ load: async () => { if(fail) throw Error('offline'); return { theme: 'dark', fontScale: 150 }; } });
  await store.connect('alice');
  store.change({ theme: 'light' });
  assert.equal(store.getSnapshot().ready, false);
  assert.equal(store.getSnapshot().status, 'error');
  assert.equal(writes.length, 0);
  fail = false; store.retry(); await tick();
  assert.equal(store.getSnapshot().preferences.fontScale, 150);
  assert.equal(store.getSnapshot().ready, true);
});
test('failed save keeps selection and retries the latest preferences', async () => {
  let fail = true; const saved = [];
  const { store } = fixture({ save: async (id, value) => { if(fail) throw Error('offline'); saved.push(value); } });
  await store.connect('alice'); store.change({ fontScale: 180 }); await tick();
  assert.equal(store.getSnapshot().status, 'error');
  assert.equal(store.getSnapshot().preferences.fontScale, 180);
  fail = false; store.retry(); await tick();
  assert.deepEqual(saved, [{ theme: 'system', fontScale: 180 }]);
  assert.equal(store.getSnapshot().status, 'saved');
});
