/* Overdriveauto database connector (Supabase).
   Gives the store and the operations site the same small document API
   (doc / collection, get / set / update / delete / onSnapshot) on top of
   the Supabase tables created by supabase/setup.sql. */
(function () {
  'use strict';
  const LIB = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.117.2/dist/umd/supabase.js';
  const cfg = window.OD_CONFIG || {};
  const configured = () => !!(cfg.supabaseUrl && cfg.supabaseKey);
  let clientP = null;

  function loadLib() {
    return new Promise((resolve, reject) => {
      if (window.supabase && window.supabase.createClient) return resolve(window.supabase);
      const s = document.createElement('script');
      s.src = LIB; s.async = true;
      s.onload = () => (window.supabase && window.supabase.createClient) ? resolve(window.supabase) : reject(new Error('Database library failed to load'));
      s.onerror = () => reject(new Error('Database library failed to load'));
      document.head.appendChild(s);
    });
  }
  function client() {
    if (!clientP) clientP = loadLib().then(lib => lib.createClient(cfg.supabaseUrl, cfg.supabaseKey, { auth: { persistSession: true, autoRefreshToken: true } }));
    return clientP;
  }

  // Document paths -> tables
  const TABLES = { orders: 'orders', requests: 'requests', sellers: 'sellers' };
  const KV = { 'shared/stock': 'stock', 'private/costs': 'costs', 'private/settings': 'settings' };
  function locate(path) {
    const parts = String(path).split('/');
    if (parts.length === 2 && TABLES[parts[0]]) return { table: TABLES[parts[0]], id: parts[1] };
    if (KV[path]) return { table: 'kv', id: KV[path] };
    throw new TypeError('Unknown document path: ' + path);
  }
  const clone = v => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)));
  const META = { fromCache: false, hasPendingWrites: false };
  const docSnap = (id, row) => ({ id, exists: !!row, data: () => (row ? clone(row.data) : undefined), metadata: META });
  function dbError(e) {
    const msg = (e && e.message) || 'Database error';
    let code = 'invalid_argument';
    if (e && e.code === '23505') code = 'exists';
    else if (/fetch|network|timeout/i.test(msg) || (e && e.status >= 500)) code = 'unavailable';
    return { code, message: msg };
  }

  function makeDb(sb, opts) {
    opts = opts || {};
    const listeners = {}, channels = {}, timers = {};
    function fire(table) {
      clearTimeout(timers[table]);
      timers[table] = setTimeout(() => (listeners[table] || new Set()).forEach(fn => fn()), 120);
    }
    function watch(table, fn) {
      (listeners[table] = listeners[table] || new Set()).add(fn);
      if (!channels[table] && typeof sb.channel === 'function') {
        try { channels[table] = sb.channel('od-' + table).on('postgres_changes', { event: '*', schema: 'public', table }, () => fire(table)).subscribe(); } catch (e) { /* polling still runs */ }
      }
      const poll = setInterval(fn, opts.anon ? 60000 : 30000);
      return () => { listeners[table].delete(fn); clearInterval(poll); };
    }
    function docRef(path) {
      const { table, id } = locate(path);
      async function getRow() {
        const { data, error } = await sb.from(table).select('id,data').eq('id', id).maybeSingle();
        if (error) throw dbError(error);
        return data;
      }
      return {
        id, path,
        async get() { return docSnap(id, await getRow()); },
        async set(body) {
          const q = opts.anon ? sb.from(table).insert({ id, data: body }) : sb.from(table).upsert({ id, data: body, updated_at: new Date().toISOString() });
          const { error } = await q;
          if (error) throw dbError(error);
          fire(table);
        },
        async update(patch) {
          const row = await getRow();
          if (!row) throw { code: 'invalid_argument', message: 'That record no longer exists.' };
          const { error } = await sb.from(table).update({ data: Object.assign({}, row.data, patch), updated_at: new Date().toISOString() }).eq('id', id);
          if (error) throw dbError(error);
          fire(table);
        },
        async delete() {
          const { error } = await sb.from(table).delete().eq('id', id);
          if (error) throw dbError(error);
          fire(table);
        },
        onSnapshot(next) {
          let alive = true;
          const run = async () => { try { const row = await getRow(); if (alive) next(docSnap(id, row)); } catch (e) { /* retried on the next poll */ } };
          run();
          const stop = watch(table, run);
          return () => { alive = false; stop(); };
        }
      };
    }
    function query(table, orderField, dir, lim) {
      async function run() {
        let q = sb.from(table).select('id,data').order('created_at', { ascending: false });
        if (lim) q = q.limit(lim);
        const { data, error } = await q;
        if (error) throw dbError(error);
        let rows = data || [];
        if (orderField) rows = rows.slice().sort((a, b) => { const x = (a.data || {})[orderField], y = (b.data || {})[orderField]; return (x < y ? -1 : x > y ? 1 : 0) * (dir === 'desc' ? -1 : 1); });
        const docs = rows.map(r => docSnap(r.id, r));
        return { docs, size: docs.length, empty: !docs.length, docChanges: () => [], metadata: META };
      }
      return {
        orderBy: (f, d) => query(table, f, d || 'asc', lim),
        limit: n => query(table, orderField, dir, n),
        where: () => query(table, orderField, dir, lim),
        get: run,
        onSnapshot(next) {
          let alive = true;
          const go = async () => { try { const s = await run(); if (alive) next(s); } catch (e) { /* retried on the next poll */ } };
          go();
          const stop = watch(table, go);
          return () => { alive = false; stop(); };
        }
      };
    }
    function collRef(path) {
      const table = TABLES[path];
      if (!table) throw new TypeError('Unknown collection: ' + path);
      return Object.assign(query(table), { path, doc: id => docRef(path + '/' + id) });
    }
    return { doc: docRef, collection: collRef };
  }

  window.ODA_BACKEND = { configured, client, makeDb };
})();
