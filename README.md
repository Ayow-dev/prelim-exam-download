# Prelim Exam Download Site

A simple MERN-style app:

- **M**ongoDB — stores a download counter
- **E**xpress-style API — `api/download-count.js` runs as a Vercel serverless function (GET/POST)
- **R**eact — the frontend with the download button (built with Vite)
- **N**ode — runs everything

The exam file itself (`Examination.docx`) is served as a static file from `client/public/`, so downloads are instant and don't depend on the database — the database is only used to track how many times students have clicked the button.

## Project structure

```
prelim-exam-download/
├── api/
│   └── download-count.js   # serverless function: GET/POST counter
├── client/
│   ├── public/
│   │   └── Examination.docx
│   └── src/
│       ├── App.jsx
│       ├── App.css
│       └── main.jsx
├── package.json            # root deps (mongodb) used by /api functions
└── vercel.json
```

## 1. Get a free MongoDB database

1. Go to https://www.mongodb.com/cloud/atlas/register and create a free account.
2. Create a free (M0) cluster.
3. Under **Database Access**, create a user with a password.
4. Under **Network Access**, add `0.0.0.0/0` (allow access from anywhere) so Vercel can connect.
5. Click **Connect > Drivers**, copy the connection string. It looks like:
   `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/`

You'll paste this into Vercel as `MONGODB_URI` in step 3 below.

## 2. Push this project to GitHub

Create a new GitHub repo and push this folder to it (Vercel deploys from a Git repo).

```bash
cd prelim-exam-download
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

## 3. Deploy on Vercel

1. Go to https://vercel.com and sign in (GitHub login is easiest).
2. Click **Add New > Project**, import the repo you just pushed.
3. Vercel will detect `vercel.json` and use it automatically — you don't need to change the build settings.
4. Before deploying, add an environment variable:
   - Key: `MONGODB_URI`
   - Value: the connection string from step 1 (include your db user's password, and you can add a db name at the end, e.g. `.../examDownloads?retryWrites=true&w=majority`)
5. Click **Deploy**.

Once it's done, Vercel gives you a live URL (e.g. `https://your-project.vercel.app`) — share that with your students.

## Updating the exam file later

To swap in a new file, replace `client/public/Examination.docx` with the new file (keep the same filename, or update the filename in `client/src/App.jsx` in two places: the `href` and `download` attributes), commit, and push — Vercel redeploys automatically.

## Running locally (optional)

```bash
cd client
npm install
npm run dev
```

The download button will still work locally even without a working `MONGODB_URI` — the counter will just silently fail to update, per the "best-effort" logic in `App.jsx`.
