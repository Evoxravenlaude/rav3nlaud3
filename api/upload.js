// Client-side uploads straight to Vercel Blob (no 4.5 MB function body limit).
// The admin page calls @vercel/blob/client upload() with handleUploadUrl=/api/upload and
// clientPayload = the admin password; this route checks it before issuing an upload token.
import { handleUpload } from '@vercel/blob/client';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return res.status(500).json({ error: 'ADMIN_PASSWORD is not set' });
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const json = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        if (clientPayload !== pw) throw new Error('unauthorized');
        if (!/^clips\/[a-z0-9_.-]+$/i.test(pathname)) throw new Error('bad path');
        return {
          allowedContentTypes: ['video/mp4', 'video/webm'],
          maximumSizeInBytes: 200 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {},
    });
    return res.status(200).json(json);
  } catch (e) {
    return res.status(e.message === 'unauthorized' ? 401 : 400).json({ error: e.message });
  }
}
