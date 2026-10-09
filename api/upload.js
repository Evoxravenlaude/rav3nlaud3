// POST /api/upload?slot=yeks&name=clip.mp4  (raw video body, header x-admin-token = ADMIN_PASSWORD)
// Stores the clip in Vercel Blob and returns {url}. Up to ~100 MB.
import { put } from '@vercel/blob';

export const config = { api: { bodyParser: false, sizeLimit: '100mb' } };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return res.status(500).json({ error: 'ADMIN_PASSWORD is not set' });
  if (req.headers['x-admin-token'] !== pw) return res.status(401).json({ error: 'unauthorized' });

  const slot = String(req.query.slot || 'clip').replace(/[^a-z0-9_-]/gi, '').slice(0, 32) || 'clip';
  const name = String(req.query.name || 'clip.mp4').replace(/[^a-z0-9._-]/gi, '_').slice(0, 80);
  const type = (req.headers['content-type'] || 'video/mp4').split(';')[0];
  if (!/^video\/(mp4|webm)$/.test(type)) return res.status(415).json({ error: 'mp4 or webm only' });

  const blob = await put(`clips/${slot}-${Date.now()}-${name}`, req, { access: 'public', contentType: type });
  return res.status(200).json({ url: blob.url });
}
