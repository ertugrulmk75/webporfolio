# Fotograf Studio

Real estate photography portfolio — Next.js 15 + Sanity + Vercel.

## Setup
1. `npm install`
2. Copy `.env.local.example` → `.env.local`, fill in Sanity project ID after running `npx sanity init`
3. `npm run dev` → http://localhost:3000 (site), http://localhost:3000/studio (CMS)
4. `npm run seed` to load initial content

## Seed

The seed script (`scripts/seed.ts`) imports the legacy demo content into your
Sanity dataset: site settings, hero, ticker, services, process steps, pricing
tiers, testimonials, before/after pairs, 18 portfolio projects (with 7 flagged
as featured on the homepage), 6 blog posts, plus their categories and authors.
All Unsplash images are downloaded once and uploaded as Sanity assets.

The script uses `createOrReplace` with deterministic `_id` values, so you can
run it multiple times safely — re-runs update existing documents instead of
duplicating them.

### One-time setup

1. **Create a Sanity project.** Sign in at https://sanity.io/manage and create
   a new project (or run `npx sanity init` and pick "Create new project").
2. **Note the project ID and dataset name.** Defaults are `production` for the
   dataset.
3. **Generate a write token.** In https://sanity.io/manage → your project →
   API → Tokens → "Add API token". Choose **Editor** permissions (Editor is
   enough for write access; Deploy Studio is broader). Copy the token — you
   only see it once.
4. **Fill in `.env.local`:**
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_WRITE_TOKEN=skXXXXXXXX...
   ```

### Run

```
npm run seed
```

The npm script uses Node's built-in `--env-file` flag, so no `dotenv`
dependency is required (Node 20+).

## Vercel Deploy

### One-time setup
1. Push this repo to GitHub.
2. Import the repo at https://vercel.com/new — Vercel auto-detects Next.js.
3. In Vercel project settings → Environment Variables, add:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID` (from sanity.io/manage)
   - `NEXT_PUBLIC_SANITY_DATASET` = `production`
   - `NEXT_PUBLIC_SANITY_API_VERSION` = `2025-01-01`
   - `SANITY_API_READ_TOKEN` (Sanity manage → API → Tokens, Viewer scope)
   - `SANITY_API_WRITE_TOKEN` (Editor scope; only needed if you re-run seed from Vercel)
   - `SANITY_REVALIDATE_SECRET` (any random string, e.g. `openssl rand -hex 32`)
4. Deploy. The studio will be live at `https://<your-domain>/studio`.

### Sanity CORS
In sanity.io/manage → API → CORS origins, add:
- `https://<your-domain>` (production)
- `https://*.vercel.app` (preview deploys) — or specific preview URLs

### Webhook for instant updates
In sanity.io/manage → API → Webhooks, create a new webhook:
- URL: `https://<your-domain>/api/revalidate`
- Dataset: `production`
- Trigger on: Create, Update, Delete
- HTTP method: POST
- API version: same as your `apiVersion`
- Projection (JSON):
  ```
  { "_type": _type, "_id": _id, "slug": slug }
  ```
- Secret: same value as `SANITY_REVALIDATE_SECRET`

After this, every CMS change triggers a targeted route revalidation within seconds.

### Free tier limits
- Vercel Hobby: 100 GB bandwidth/mo, 100 build min/day — generous for a portfolio.
- Sanity Free: 100k API CDN requests/mo, 10k documents, 1 user. ISR with `revalidate=60` keeps API hits low.
