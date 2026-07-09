# PWD Internship x AgencyCRM

A Vite + React landing page with a multi-step application form and an
authenticated admin dashboard, backed by a real Supabase (Postgres) database.

## What's inside

- `src/App.jsx` — the whole site: landing page, application form, admin dashboard
- `src/lib/supabaseClient.js` — Supabase client setup
- `src/lib/api.js` — functions to submit/read/delete applications
- `supabase/schema.sql` — the database table + security policies
- `.env.example` — the two environment variables you need to fill in

## 1. Set up Supabase (free tier is enough)

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Open **SQL Editor** in the left sidebar → **New query**.
3. Paste the contents of `supabase/schema.sql` and click **Run**.
   This creates the `applications` table and locks it down so:
   - anyone can submit an application (public insert)
   - only a signed-in admin can view or delete applications
4. Create your admin account: **Authentication → Users → Add user**.
   Use your own email and a password — this is what you'll use to log into
   `/` → the "admin" link → the dashboard. (Don't use the public sign-up flow;
   there isn't one in this app on purpose, so random visitors can't create
   admin accounts.)
5. Get your keys: **Settings → API**. Copy the **Project URL** and the
   **anon public** key.

## 2. Configure the app

```bash
cp .env.example .env
```

Open `.env` and paste in your Project URL and anon key:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

## 3. Run it locally

```bash
npm install
npm run dev
```

Visit the local URL it prints. Submit a test application, then click
"admin" in the footer and sign in with the account you created in step 1.4
to see it on the dashboard.

## 4. Deploy it (Vercel)

1. Push this folder to a new GitHub repository.
2. Go to [vercel.com](https://vercel.com) → **New Project** → import that repo.
   Vercel auto-detects Vite; no config needed.
3. Before deploying, add your two environment variables under
   **Settings → Environment Variables**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy. You'll get a live `yourproject.vercel.app` URL.

(Netlify works the same way — same env vars, "npm run build", publish
directory `dist`.)

## Notes on what's real vs. simplified

- **Applications are stored for real** in Postgres via Supabase, and the
  dashboard reads live from that same table.
- **Admin auth is real** — Supabase email/password login, gated by row-level
  security so only a signed-in user can read or delete applicant data.
- **Resume upload only captures the file name**, not the actual file. Wiring
  up real file storage is straightforward with Supabase Storage if you want
  it — ask and I can add it.
- **Status tracking, interview scheduling, certificates, mentor assignment,
  attendance, graduation tracking** (the "future features" from the original
  brief) aren't built yet — the dashboard has placeholder cards for
  Accepted / Active / Graduates / Hired ready for when that data exists.
- This is JavaScript, not TypeScript. Converting is mostly mechanical
  (renaming files to `.tsx`, adding prop/interface types) if you want that
  later.
