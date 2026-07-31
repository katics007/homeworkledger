# Homework Ledger — Supabase + Vercel deployment

## What changed from the original file
- `src/HomeworkLedger.jsx` — same UI/logic, but the storage layer now reads/writes
  a Supabase Postgres table (`app_state`) instead of the artifact's `window.storage`.
- `src/supabaseClient.js` — creates the Supabase connection from environment variables.
- A Realtime subscription was added so changes made on one device (e.g. a teacher
  posting homework) push live to every other open device (students) without a refresh.
- Everything else — all 8 pages, translations, styling — is untouched.

---

## Step 1 — Create the Supabase project
1. Go to https://supabase.com → sign up (free, no card needed) → **New project**.
2. Pick any name/region, set a database password (save it somewhere), wait ~2 min for it to spin up.

## Step 2 — Create the table
1. In your Supabase project, open **SQL Editor** → **New query**.
2. Paste the entire contents of `supabase-setup.sql` (included in this folder) and click **Run**.
   This creates the `app_state` table, secures it, and turns on live sync.

## Step 3 — Get your API keys
1. In Supabase, go to **Project Settings** → **API**.
2. Copy the **Project URL** and the **anon public** key (not the `service_role` one).

## Step 4 — Run it locally first (recommended)
```bash
npm install
cp .env.example .env
# open .env and paste in your Project URL + anon key
npm run dev
```
Open the printed localhost URL, sign in with the demo teacher (`teacher1` / `teacher123`)
or student (`stu1` / `student123`) and confirm it loads and saves without errors.

## Step 5 — Push to GitHub
```bash
git init
git add .
git commit -m "Homework ledger with Supabase backend"
```
Create a new empty repo on https://github.com/new, then:
```bash
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git branch -M main
git push -u origin main
```

## Step 6 — Deploy on Vercel
1. Go to https://vercel.com → sign up with your GitHub account (free).
2. **Add New → Project** → import the repo you just pushed.
3. Vercel auto-detects Vite — leave build settings as default (`npm run build`, output `dist`).
4. Before clicking Deploy, open **Environment Variables** and add:
   - `VITE_SUPABASE_URL` = your Project URL
   - `VITE_SUPABASE_ANON_KEY` = your anon public key
5. Click **Deploy**. In ~1 minute you'll get a live URL like `homework-ledger.vercel.app`.

## Step 7 — Test the "live" part
Open the Vercel URL on two different devices (or two browser windows) — sign in as
teacher on one, student on the other. Post homework as the teacher and watch it
appear on the student's screen without them refreshing.

---

## Updating it later
Change the code → `git push` → Vercel redeploys automatically. No need to touch
Supabase again unless you're changing the data structure.

## Notes / limitations
- **Security**: logins are still checked in the browser (same as the original file),
  and the Supabase table is open to anyone holding the public anon key, matching the
  original "shared register" behavior. Don't put sensitive personal data in this app.
  If you want real access control later, that means moving to Supabase Auth.
- **Free tier pause**: if the Supabase project gets zero requests for 7 days
  (e.g. over a school holiday), it auto-pauses. Just click "unpause" in the
  Supabase dashboard when you're back — no data is lost.
- **Notes/videos uploads**: if the "Notes" feature stores files as base64 inside
  the JSON blob, very large PDFs/photos could get slow. If you run into that,
  say so and this can be switched to Supabase Storage (a proper file bucket).
