// GET  /api/media  -> current slot config (JSON). Public.
// POST /api/media  -> merge a patch into the config. Needs header x-admin-token = ADMIN_PASSWORD.
//                     Body {ping:true} just checks the password.
// Config is stored in Vercel Blob at media.json (falls back to {} when Blob isn't set up yet).
import { put, list } from '@vercel/blob';

const KEY = 'media.json';

async function readConfig() {
  try {
    const { blobs } = await list({ prefix: KEY, limit: 1 });
    const b = blobs.find((x) => x.pathname === KEY);
    if (!b) return {};
    const r = await fetch(b.url, { cache: 'no-store' });
    return r.ok ? await r.json() : {};
  } catch {
    return {};
  }
}

export default async function handler(req, res) {
  res.setHeader('cache-control', 'no-store');
  if (req.method === 'GET') return res.status(200).json(await readConfig());
  if (req.method !== 'POST') return res.status(405).end();

  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return res.status(500).json({ error: 'ADMIN_PASSWORD is not set in Vercel env vars' });
  if (req.headers['x-admin-token'] !== pw) return res.status(401).json({ error: 'unauthorized' });

  const patch = req.body && typeof req.body === 'object' ? req.body : {};
  const cfg = await readConfig();
  if (patch.ping) return res.status(200).json(cfg);

  for (const [slot, val] of Object.entries(patch)) {
    if (!/^[a-z0-9_-]{1,32}$/.test(slot)) continue;
    if (val === null) delete cfg[slot];
    else if (typeof val === 'object') {
      const clean = {};
      for (const k of ['title', 'cap', 'file', 'url', 'poster']) if (typeof val[k] === 'string') clean[k] = val[k].slice(0, 300);
      cfg[slot] = clean;
    }
  }
  await put(KEY, JSON.stringify(cfg), { access: 'public', addRandomSuffix: false, contentType: 'application/json' });
  return res.status(200).json(cfg);
}
