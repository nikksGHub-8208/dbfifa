# Netlify Drag-and-Drop Deploy

Drag this entire **deploy** folder to:

https://app.netlify.com/drop

## After deploy

- Public results: `https://your-site.netlify.app/`
- Admin: `https://your-site.netlify.app/admin.html`

## Important — data storage

This drag-and-drop build is **static only** (no server API).

| Page | Data source |
|------|-------------|
| Public results | `data/contest-data.json` bundled in this folder |
| Admin | Browser **localStorage** on the device you use |

Admin **Save** stores data in your browser only — other users/devices will **not** see admin changes unless you update `data/contest-data.json` and re-deploy.

## Shared live data (recommended)

For saves that sync to all visitors, deploy from Git instead:

1. Push the full project repo to GitHub
2. Connect the repo in Netlify (not drag-and-drop)
3. Build command: `npm install`
4. Publish directory: `site`
5. Set env var `CONTEST_ADMIN_SECRET`

See the main README in the project root.

## Rebuild this folder

From the project root:

```bash
npm run build:deploy
```
