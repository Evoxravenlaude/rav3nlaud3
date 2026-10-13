# Rav3n — One of One

Scroll-story portfolio + work index. A static page plus two small API routes for the owner-only admin.

```
public/index.html      the whole site (single file, pfp embedded)
public/videos/*.mp4    clips for each story chapter (the library)
public/posters/*.jpg   poster frames
public/favicon.png
api/media.js           GET slot config / POST save (password-protected)
api/upload.js          issues upload tokens so the admin page uploads clips straight to Vercel Blob
```

## Deploy on Vercel

1. Push this folder to a GitHub repo (or run `vercel` from the CLI inside it).
2. Import the repo in Vercel. Framework preset: **Other**. No build command. Leave the output directory as default.
3. **Storage → Create → Blob**, then connect it to the project. This adds `BLOB_READ_WRITE_TOKEN` for you.
4. **Settings → Environment Variables → add `ADMIN_PASSWORD`** (any strong string). Redeploy.

The site works without steps 3–4 (it plays the library clips); the admin page needs them.

## Admin

Open `https://your-site/#admin` (or the Admin link in the header once you're signed in) and enter the password. For each of the eight video slots you can:

- edit the title and caption
- pick a clip from the library (`public/videos`)
- upload a new mp4/webm, up to 200 MB. It goes from your browser straight to Blob (no serverless size limit) and is live as soon as it finishes.
- reset to the library default

Slot config is stored in Blob as `media.json`; nothing needs a redeploy. Slots: `reel yeks floda guard afterhours poly gateway motion`.

## Adding to the work index

Projects in the Work grid live in the `WORK` array inside `index.html` (search `var WORK=`). Each entry has a title, category (`bots`, `hack`, `products`, `motion`, `words`), year, status, one-line summary, a terminal command + tags, and the longer description shown in the detail sheet. Add `story:"<chapter id>"` to link a card to its story chapter.

## Local preview

```
npm i -g vercel
vercel dev
```
Or open `public/index.html` in a browser: everything except the admin works from a file.
