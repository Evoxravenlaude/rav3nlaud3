# Rav3n — One of One

Scroll-story portfolio. Static page + two small API routes for the owner-only admin.

```
public/index.html      the whole site (single file, pfp embedded)
public/videos/*.mp4    clips for each story page (the library)
public/posters/*.jpg   poster frames
public/favicon.png
api/media.js           GET config / POST save (password-protected)
api/upload.js          POST a clip to Vercel Blob (password-protected)
```

## Deploy on Vercel

1. Push this folder to a GitHub repo (or `vercel` from the CLI).
2. Import the repo in Vercel. Framework preset: **Other**. No build command. Output directory: leave default.
3. **Storage → Create → Blob**, then connect it to the project. This adds `BLOB_READ_WRITE_TOKEN` for you.
4. **Settings → Environment Variables → add `ADMIN_PASSWORD`** (any strong string). Redeploy.

That's it. The site works without steps 3–4 (it just plays the library clips); the admin page needs them.

## Admin

Open `https://your-site/#admin`, enter the password. For each of the seven video slots you can:

- edit title and caption
- pick a clip from the library (`public/videos`)
- upload a new mp4/webm (up to ~100 MB) — it's stored in Blob and goes live immediately
- reset to the library default

Config lives in Blob as `media.json`; nothing needs a redeploy.

## Adding library clips permanently

Drop an mp4 into `public/videos/` and a poster into `public/posters/`, then add an entry to the `LIB` object in `index.html` (search for `var LIB=`). Slots: `reel yeks floda guard poly gateway motion`.

## Local preview

```
npm i -g vercel
vercel dev
```
Or just open `public/index.html` in a browser — everything except the admin works from a file.
