# ProofPulse — Deployment & Submission Checklist

**Status:** Ready for deployment and ThunderHacks submission
**Date:** Mar 14, 2026
**Deadline:** Mar 15, 12:30pm EDT (≈12 hours)
**Time Required:** ~45 minutes (deployment) + 10 min (screenshots) + 10 min (submission)

---

## ✅ PRE-DEPLOYMENT VERIFICATION

All systems are ready:

| Component | Status |
|-----------|--------|
| Dark mode (Tailwind v4) | ✅ Complete (200+ dark: variants) |
| Backend tests | ✅ 102 passing, 83% coverage |
| E2E tests | ✅ 36 passing (text, URL, scenarios, a11y) |
| TypeScript | ✅ 0 errors |
| ESLint | ✅ 0 warnings |
| Railway config | ✅ railway.json + nixpacks.toml |
| Vercel config | ✅ vercel.json with security headers |
| README | ✅ Badges, architecture, deployment instructions |
| GitHub push | ✅ Latest commit: `7606b4e` |

---

## 📋 DEPLOYMENT STEPS

### Step 1: Deploy Backend to Railway (10 minutes)

**Location:** https://railway.app

```
1. New Project → Deploy from GitHub → aaravjj2/ProofPulse
2. Root directory: apps/api
3. Add environment variables:
   - OPENAI_API_KEY = sk-...
   - CORS_ORIGINS = https://proofpulse.vercel.app (will change in step 3)
   - DATABASE_URL = sqlite+aiosqlite:///./proofpulse.db
4. Click Deploy
5. Wait for build (~3-4 min)
6. Settings → Networking → Generate Domain → copy URL
7. Test: curl https://YOUR_RAILWAY_URL/api/v1/health
```

**Expected:** Health check returns `{"status":"ok","db_ok":true}`

### Step 2: Deploy Frontend to Vercel (5 minutes)

**Location:** https://vercel.com/new

```
1. Import Git Repository → aaravjj2/ProofPulse
2. Root Directory: apps/web
3. Framework: Next.js (auto-detected)
4. Deploy
5. Wait for build (~2 min)
6. Add environment variable:
   - NEXT_PUBLIC_API_URL = https://YOUR_RAILWAY_URL
7. Vercel auto-redeploys (~1 min)
```

**Expected:** Vercel domain assigned, looks like `https://proofpulse-xxxx.vercel.app`

### Step 3: Update CORS and Smoke Test (5 minutes)

```
1. Railway dashboard → your service → Variables
2. Update CORS_ORIGINS: https://YOUR_VERCEL_DOMAIN.vercel.app
3. Railway auto-redeploys (~1 min)
4. Open Vercel URL in browser → home page loads
5. Go to /analyze → paste scam text → GET CRITICAL result
6. Go to /history → see the analysis saved
7. Toggle dark mode → refresh → persists ✓
```

**After Step 3, you have a fully deployed, working app.**

---

## 📸 TAKE SCREENSHOTS (10 minutes)

Screenshots go in `docs/screenshots/`:

| # | Filename | What to capture |
|---|----------|---|
| 1 | `01-home.png` | Home page (dark mode) |
| 2 | `02-critical-result.png` | CRITICAL result card with evidence |
| 3 | `03-evidence.png` | All evidence items (color-coded) |
| 4 | `04-history.png` | History page with multiple analyses |
| 5 | `05-safe-result.png` | SAFE result (optional) |

**Quick paste-and-screenshot flow:**
1. /analyze → Paste IRS scam text → Analyze → Screenshot
2. /history → Screenshot
3. /analyze → Paste safe message → Analyze → Screenshot

Then:
```bash
git add docs/screenshots/
git commit -m "docs: add app screenshots"
git push
```

---

## 🎯 THUNDERHACKS SUBMISSION (5 minutes)

**Deadline: Mar 15, 12:30pm EDT**
**Link:** https://thunderhacks.devpost.com

### Fill in Devpost form:

| Field | Copy from |
|-------|---|
| **Project Name** | `ProofPulse — Verify Before You Trust` |
| **Tagline** | `docs/DEVPOST_SUBMISSION.md` → Tagline section |
| **Description** | `docs/DEVPOST_SUBMISSION.md` → What it does + How we built it |
| **Secret Sauce** | `docs/DEVPOST_SUBMISSION.md` → Secret Sauce section |
| **Built With** | Python, FastAPI, Next.js, TypeScript, Tailwind CSS, OpenAI, Railway, Vercel |
| **Website** | https://YOUR_VERCEL_DOMAIN.vercel.app |
| **GitHub** | https://github.com/aaravjj2/ProofPulse |

### Upload 4-5 screenshots

Drag and drop from `docs/screenshots/` into the media upload area.

### Click "Submit Project"

✅ **DONE.** You've submitted to ThunderHacks.

---

## 🎥 DEMO VIDEO (can be after submission, before Mar 24)

Record a 2:20 video showing:
- 0:00–0:30 — Home page + paste scam message + analyze
- 0:30–1:10 — CRITICAL result with evidence explanation
- 1:10–1:40 — URL analysis demo
- 1:40–1:55 — History page
- 1:55–2:10 — Dark mode toggle + tech stack
- 2:10–2:20 — "ProofPulse — verify before you trust"

Upload to YouTube (Unlisted) and add the link to Devpost.

---

## 📊 ALL DEADLINES

| Hackathon | Deadline | Status |
|-----------|----------|--------|
| **ThunderHacks** | Mar 15, 12:30pm EDT | 🔴 DO THIS TONIGHT |
| NextDev | Mar 24, 12:00am EDT | 🟡 (after video) |
| Develop the Next | Mar 25, 12:00am EDT | 🟡 (after video) |

---

## 🐛 COMMON ISSUES & FIXES

### "Tesseract not found" on Railway build
**Fix:** Check `apps/api/nixpacks.toml` has `aptPkgs = ["tesseract-ocr", ...]`
Railway dashboard → Redeploy

### "CORS error" in browser
**Fix:** Check `CORS_ORIGINS` on Railway exactly matches Vercel URL
Wait 1 min for Railway redeploy, try again

### "Failed to fetch from API"
**Fix:** Make sure `NEXT_PUBLIC_API_URL` on Vercel is set correctly
Vercel should auto-redeploy, otherwise redeploy manually

### Can't paste text in /analyze
**Fix:** Page needs to be fully loaded. Wait 2-3 seconds after navigation.

---

## ✨ KEY FILES & LINKS

| File | Purpose |
|------|---------|
| `docs/DEPLOYMENT.md` | Detailed step-by-step deployment guide |
| `docs/DEVPOST_SUBMISSION.md` | Copy-paste submission text |
| `docs/screenshots/` | 4-5 screenshots for Devpost |
| `apps/api/railway.json` | Railway deployment config |
| `apps/api/nixpacks.toml` | Tesseract dependencies for Railway |
| `apps/web/vercel.json` | Vercel config + security headers |
| `README.md` | Updated with badges + deployment section |

---

## 🚀 SUCCESS CRITERIA

✅ All of the following must be true:

1. **Backend:** `curl https://YOUR_RAILWAY_URL/api/v1/health` returns `{"status":"ok"}`
2. **Frontend:** `https://YOUR_VERCEL_DOMAIN.vercel.app` loads in browser
3. **E2E:** Can paste a scam message in /analyze and GET a CRITICAL result
4. **Dark Mode:** Toggle works in navbar, persists across refresh
5. **Screenshots:** 4+ images uploaded to Devpost
6. **Devpost:** Submitted to ThunderHacks before 12:30pm EDT tonight
7. **Video:** Recorded after submission (before Mar 24)

---

## 📝 EXACT TIMELINE (if rushing)

| Time | Task | Duration |
|------|------|----------|
| Now | Deploy to Railway | 10 min |
| +10 min | Deploy to Vercel | 5 min |
| +15 min | Update CORS & smoke test | 5 min |
| +20 min | Take 5 screenshots | 10 min |
| +30 min | Commit and push | 2 min |
| +32 min | Fill Devpost form | 5 min |
| +37 min | Submit to ThunderHacks ✅ | 1 min |
| **Total** | **~40 minutes** | |

---

## 💡 TIPS

- **Test as you go.** Don't wait until the end to test. After each deployment, run the smoke tests.
- **Screenshots in dark mode.** They look better and showcase the dark mode feature.
- **CORS_ORIGINS must be exact.** `https://domain.vercel.app` (no trailing slash, no http).
- **Don't panic if Railway/Vercel takes 30 seconds to redeploy.** It's normal.
- **Devpost accepts edits.** You can submit basic info now, record video later, update submission.
- **Video can be simple.** Phone recording with screen share (Loom) works great.

---

## 🎉 YOU'VE GOT THIS

ProofPulse is built, tested, and ready. All the infra is configured. It's literally:

1. Click deploy on Railway ✓
2. Click deploy on Vercel ✓
3. Add 2 environment variables ✓
4. Take 5 screenshots ✓
5. Copy-paste from `docs/DEVPOST_SUBMISSION.md` into Devpost ✓
6. Hit submit ✓

**45 minutes and you're done. You can submit by 11pm tonight and sleep well.**

Good luck! 🚀

---

**Questions?** Check `docs/DEPLOYMENT.md` for detailed step-by-step instructions with troubleshooting.
