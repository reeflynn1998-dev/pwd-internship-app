# PWD Internship x AgencyCRM

A Vite + React landing page for the PWD Talent Pool & AI Internship Program.
Applications are collected through an embedded Google Form, which writes
straight into a linked Google Sheet — no custom backend to run or maintain.

## What's inside

- `src/App.jsx` — the whole site: landing page, curriculum summary, and the
  embedded application form
- `public/agencycrm-internship-curriculum.pdf` — the downloadable curriculum guide

## Application form & applicant data

- The `/apply` section embeds a Google Form directly on the page (see
  `GOOGLE_FORM_ID` near the top of `App.jsx`).
- Every submission lands in the linked Google Sheet. The footer's
  "view applicants" link opens that sheet directly — anyone with edit access
  to the Google account that owns the form can see submissions there in
  real time, no login flow on this site required.
- To change the form (add/remove questions) or who can see the sheet, edit
  them directly in Google Forms/Sheets — nothing on this site needs to change
  unless the form's URL changes, in which case update `GOOGLE_FORM_ID` in
  `src/App.jsx`.

## Run it locally

```bash
npm install
npm run dev
```

Visit the local URL it prints.

## Deploy it (Vercel)

1. Push this folder to a GitHub repository.
2. Go to [vercel.com](https://vercel.com) → **New Project** → import that repo.
   Vercel auto-detects Vite; no environment variables or config needed.
3. Deploy. You'll get a live `yourproject.vercel.app` URL.

(Netlify works the same way — "npm run build", publish directory `dist`.)

## Notes on what's real vs. simplified

- **Applications are stored for real**, in the linked Google Sheet, the
  moment someone submits the form.
- There's no admin login on this site anymore — viewing applicants means
  opening the Google Sheet (footer link), which relies on Google's own
  sharing/access controls.
- **Status tracking, interview scheduling, certificates, mentor assignment,
  attendance, graduation tracking** aren't built into this site — track
  those directly in the Google Sheet (extra columns) or a separate tool for now.
- This is JavaScript, not TypeScript. Converting is mostly mechanical
  (renaming files to `.tsx`, adding prop/interface types) if you want that
  later.
