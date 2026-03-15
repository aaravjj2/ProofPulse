# ProofPulse Deployment Guide

This guide covers deploying ProofPulse to Railway (backend) and Vercel (frontend).

**Timeline:** 30-45 minutes total
**Deadline:** Mar 15, 12:30pm EDT for ThunderHacks

---

## Pre-Deployment Checklist

✅ All config files created:
- `apps/api/railway.json` — Railway deployment config
- `apps/api/nixpacks.toml` — Tesseract + dependencies
- `apps/api/Procfile` — Heroku-compatible start command
- `apps/web/vercel.json` — Vercel config with security headers

✅ Code committed:
- `git push` completed
- GitHub repo is up to date

✅ Tests passing locally:
- Backend: 102 tests ✓
- Frontend: 36 E2E tests ✓
- TypeScript: 0 errors ✓
- ESLint: 0 warnings ✓

---

## PART 1: RAILWAY DEPLOYMENT (Backend API)

### Step 1.1: Create Railway Project

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Authorize GitHub (if needed)
5. Search for and select `aaravjj2/ProofPulse`
6. When prompted for root directory: type `apps/api` and confirm

### Step 1.2: Add Environment Variables

Before deploying, click the "Variables" tab and add:

```
OPENAI_API_KEY        = sk-...your-actual-key...
ENVIRONMENT           = production
LOG_LEVEL             = INFO
CORS_ORIGINS          = https://proofpulse.vercel.app
MAX_IMAGE_SIZE_MB     = 10
RATE_LIMIT_PER_MINUTE = 60
DATABASE_URL          = sqlite+aiosqlite:///./proofpulse.db
```

**Important:** The `CORS_ORIGINS` must exactly match your Vercel URL (will be assigned in Part 2).

### Step 1.3: Deploy

Click "Deploy" and watch the build log:
- ✓ Nixpacks detects Python project
- ✓ Installs apt packages (tesseract-ocr, etc.)
- ✓ Pip installs requirements.txt
- ✓ Uvicorn starts on port assigned by Railway
- ✓ Health check passes

Expected build time: 3-4 minutes

### Step 1.4: Generate Custom Domain (Optional)

1. Once deployed, go to Settings → Networking
2. Click "Generate Domain" to get a permanent URL
3. Copy the URL: `https://proofpulse-api-xxxx.up.railway.app`

Record this URL — you'll need it in Part 2.

### Step 1.5: Smoke Test Railway

Open a terminal and test the live API:

```bash
RAIL="https://YOUR_RAILWAY_URL_HERE"

# Test 1: Health check
curl -s "$RAIL/api/v1/health" | python3 -m json.tool
# Expected: {"status":"ok","db_ok":true, ...}

# Test 2: Text analysis (real scam detection)
curl -s -X POST "$RAIL/api/v1/analyze/text" \
  -H "Content-Type: application/json" \
  -d '{"text":"URGENT: Your Amazon account is locked. Verify at amaz0n-verify.ru within 24 hours or lose access.","input_type":"text"}' \
  | python3 -c "
import sys, json
r = json.load(sys.stdin)
score = r.get('risk_score', 0)
level = r.get('risk_level', 'UNKNOWN')
print(f'Score: {score}/100')
print(f'Level: {level}')
assert score >= 70, f'FAIL: score too low'
assert level in ('HIGH', 'CRITICAL'), f'FAIL: level should be HIGH or CRITICAL'
print('✓ PASS: Scam correctly detected')
"

# Test 3: History endpoint
curl -s "$RAIL/api/v1/history" | python3 -m json.tool | head -10
# Should see: {"items":[...], "total":1, ...}
```

If any test fails:
- Railway dashboard → your service → Deployments → view the latest deployment's logs
- Most common: Tesseract not found → check nixpacks.toml has apt packages
- Second: CORS error → check CORS_ORIGINS matches exactly

**Do not proceed to Part 2 until all smoke tests pass.**

---

## PART 2: VERCEL DEPLOYMENT (Frontend)

### Step 2.1: Create Vercel Project

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Search for `ProofPulse` and select the repo
4. Configure:
   - **Root Directory:** `apps/web`
   - **Framework:** Next.js (auto-detected)

Click "Deploy"

Wait for the build to complete (~2 minutes):
- ✓ Next.js build succeeds
- ✓ `npm run build` outputs `.next` folder
- ✓ Deployment URL assigned

### Step 2.2: Add Environment Variables

Before the deployment goes live:

1. In Vercel project settings, click "Environment Variables"
2. Add:
   ```
   NEXT_PUBLIC_API_URL = https://YOUR_RAILWAY_URL_FROM_PART_1
   ```

3. Vercel will automatically redeploy with this environment variable

**Wait for the redeploy to complete** (1-2 minutes)

Note: The Railway URL needs to be the full domain from Step 1.4, like `https://proofpulse-api-xxxx.up.railway.app`

### Step 2.3: Update CORS on Railway

Now that you have the Vercel URL, update Railway's CORS to match:

1. Railway dashboard → your service → Variables
2. Change `CORS_ORIGINS` from the placeholder to:
   ```
   https://your-vercel-domain.vercel.app
   ```

3. Click "Apply Variable"
4. Railway auto-redeploys with the new CORS setting (~1 minute)

### Step 2.4: Smoke Test Vercel

Open a browser and test:

```bash
VERCEL="https://YOUR_VERCEL_DOMAIN.vercel.app"

# In browser:
# 1. Open $VERCEL, see home page
# 2. Go to /analyze
# 3. Paste a scam message, click Analyze
# 4. Verify you see a CRITICAL or HIGH result (not an error)
# 5. Go to /history, see the analysis saved
# 6. Toggle dark mode, refresh, verify it persists
```

If you see an error like "Failed to fetch from API":
- Check that CORS_ORIGINS on Railway matches the Vercel URL exactly
- Wait 1 minute for Railway's redeploy
- Try again

**Both Part 1 and Part 2 smoke tests must pass before proceeding.**

---

## PART 3: TAKE SCREENSHOTS

Visit your live Vercel app at https://YOUR_VERCEL_DOMAIN.vercel.app

**Enable dark mode in the UI toggle (navbar).**

### Screenshot 1: Home Page

- Full home page screenshot (above the fold)
- Should show hero, stats, features
- Dark mode enabled

**Save as:** `docs/screenshots/01-home.png`

### Screenshot 2: Critical Risk Result

1. Go to /analyze
2. Paste this text:
   ```
   URGENT: IRS FINAL NOTICE — you owe $3,847 in back taxes.
   Failure to pay via wire transfer within 24 hours will result
   in ARREST. Settle now: irs-tax-payments.xyz/pay
   ```
3. Click Analyze
4. Wait for result
5. Take a full screenshot of the result card (donut + CRITICAL badge + verdict + evidence)

This is your hero screenshot — the dramatic one showing the AI's power.

**Save as:** `docs/screenshots/02-critical-result.png`

### Screenshot 3: Evidence Section

Scroll down on the previous result to show all evidence items with their color-coded left borders (red/yellow/green).

**Save as:** `docs/screenshots/03-evidence.png`

### Screenshot 4: History Page

1. Go to /history
2. Should show multiple analyses (the critical one you just did + any others)
3. Take a screenshot of the list with different risk badges

**Save as:** `docs/screenshots/04-history.png`

### Screenshot 5: Safe Message (Optional but nice)

1. Go back to /analyze
2. Paste:
   ```
   Hey! Great meeting you at the conference.
   I'll send you the slides this afternoon.
   Let me know if you have questions!
   ```
3. Analyze
4. Show the SAFE result with green evidence

**Save as:** `docs/screenshots/05-safe-result.png`

---

## PART 4: COMMIT SCREENSHOTS AND SUBMISSION DOCS

```bash
cd /path/to/ProofPulse
git add docs/
git commit -m "docs: add Devpost submission copy and screenshots"
git push
```

Verify on GitHub that the screenshots are visible in `docs/screenshots/`.

---

## PART 5: DEVPOST SUBMISSION (THUNDERHACKS)

**⏰ DEADLINE: Tonight (Mar 15) at 12:30pm EDT**

Go to https://thunderhacks.devpost.com and click "Submit a Project" (or "Create New Submission").

Fill in every field:

| Field | Value |
|-------|-------|
| **Project Name** | ProofPulse — Verify Before You Trust |
| **Tagline** | AI-powered scam detection that analyzes messages, screenshots, and URLs |
| **Elevator Pitch** | Copy from `docs/DEVPOST_SUBMISSION.md` → "What it does" section |
| **Description/Details** | Copy "How we built it" + "Challenges" + "Accomplishments" sections |
| **The Secret Sauce** | Copy "Secret Sauce" section from the doc |
| **Inspiration** | "Every day, millions receive scams. We wanted to give anyone a fraud analyst's reasoning." |
| **Built With** | Python, FastAPI, OpenAI GPT-4o, Next.js, TypeScript, Tailwind CSS, Playwright, SQLite, Railway, Vercel |
| **Website** | https://YOUR_VERCEL_DOMAIN.vercel.app |
| **GitHub Repo** | https://github.com/aaravjj2/ProofPulse |
| **Demo Video** | [skip for now, add after recording] |
| **Team Size** | 1 |
| **Submission Type** | Prototype |

### Upload Screenshots

Drag and drop all screenshots from `docs/screenshots/`:
- `01-home.png`
- `02-critical-result.png`
- `03-evidence.png`
- `04-history.png`
- `05-safe-result.png` (optional)

### Click "Submit Project"

✅ THUNDERHACKS DONE (after recording video, come back and edit to add video link)

---

## PART 6: RECORD DEMO VIDEO (can be after submission)

**Setup:**
- Dark mode enabled
- Browser zoom: 100%
- Screen resolution: 1920x1080 or higher
- All other tabs closed
- Notifications disabled

**Record with this script (~2 min 20 sec):**

| Time | Action | What to Say |
|------|--------|-----------|
| 0:00–0:18 | Show home page | "Every day, millions of people receive suspicious messages and can't tell if they're real. ProofPulse gives you an instant, evidence-based second opinion." |
| 0:18–0:28 | Navigate to /analyze page | "I'll paste a fake IRS notice." |
| 0:28–0:30 | Paste the IRS scam text (from Screenshot 2) | [silence, let pasting happen] |
| 0:30–0:35 | Click Analyze button | [silence, loading state] |
| 0:35–1:00 | Result animates in, zoom slowly on evidence | "CRITICAL — 96 out of 100. Notice it's not saying 'this looks suspicious.' It's citing specific text — the .xyz domain, the threat of arrest, the wire transfer request. This is how a fraud analyst thinks." |
| 1:00–1:10 | Scroll to Next Steps section | "Concrete next steps, not generic advice." |
| 1:10–1:25 | Switch to URL tab, paste `https://amaz0n-account-verify.ru/login`, analyze | "URL analysis catches the homoglyph attack — the letter O replaced with zero — and the foreign TLD, even without loading the page." |
| 1:25–1:40 | Paste safe message, analyze, show SAFE result | "For comparison, a legitimate message comes back SAFE, 3 out of 100, with green evidence flags." |
| 1:40–1:55 | Navigate to /history, show populated list | "Every analysis is saved with full evidence. Filter by risk level, export as CSV." |
| 1:55–2:10 | Toggle dark/light mode in navbar | "Dark mode, built with Next.js and FastAPI. 36 E2E tests, 102 backend tests." |
| 2:10–2:20 | Back to home page | "ProofPulse — verify before you trust. Live demo and source code in the description." |

**After recording:**

Upload to YouTube as **Unlisted** (not Private, not Public):
1. Go https://youtube.com/upload
2. Select your video file
3. Title: `ProofPulse — AI Scam Detection Demo`
4. Description: "ThunderHacks 2026 submission. GitHub: https://github.com/aaravjj2/ProofPulse"
5. Set visibility to "Unlisted"
6. Publish
7. Copy the share URL

---

## PART 7: ADD VIDEO TO DEVPOST AND SUBMIT TO OTHER HACKATHONS

### Update Devpost with Video

1. Go back to your ThunderHacks submission
2. Find "Demo Video" field
3. Paste the YouTube URL
4. Click "Update"

### Submit to NextDev (Mar 24 deadline)

Go to https://nextdev-hackathon.devpost.com → "Submit a Project" and fill in the same info + video link → Submit

### Submit to Develop the Next (Mar 25 deadline)

Go to https://developnext.devpost.com → "Submit a Project" → Submit

---

## FINAL CHECKLIST

- [ ] Railway deployed and smoke-tested
- [ ] Vercel deployed and smoke-tested
- [ ] Screenshots taken and committed to repo
- [ ] `docs/DEVPOST_SUBMISSION.md` committed to repo
- [ ] ThunderHacks submitted (Mar 15, 12:30pm EDT deadline)
- [ ] Demo video recorded and uploaded
- [ ] Devpost updated with video link
- [ ] NextDev submitted (Mar 24 deadline)
- [ ] Develop the Next submitted (Mar 25 deadline)

---

## TROUBLESHOOTING

### Railway build fails

**Error:** `tesseract: not found`
- **Fix:** Make sure `nixpacks.toml` has `aptPkgs = ["tesseract-ocr", ...]`
- Redeploy: Railway dashboard → your service → click "Redeploy"

**Error:** `env: python: No such file...`
- **Fix:** Nixpacks should auto-detect Python. Make sure `pyproject.toml` or `requirements.txt` exists
- Check the nixpacks.toml has a build phase

### Vercel build fails

**Error:** `TypeError: Cannot find module...`
- **Fix:** Run `npm install` locally and check for missing dependencies
- Push the updated `package-lock.json` to GitHub
- Vercel will redeploy automatically

### API connection fails in browser

**Error:** `Failed to fetch from API` or CORS error
- **Fix:** Check `CORS_ORIGINS` on Railway exactly matches the Vercel URL
- Wait 1 minute for Railway auto-redeploy
- Open browser dev tools (F12) → Network tab → see what URL the fetch is trying to reach
- Verify that URL is in `CORS_ORIGINS` on Railway

### Screenshots don't upload to Devpost

**Fix:** Devpost sometimes has issues with drag-and-drop. Try:
1. Right-click the upload area
2. Select "Upload files"
3. Navigate to `docs/screenshots/` and select all images

---

## SUPPORT

If you hit issues:
1. Check the troubleshooting section above
2. Review the Railway/Vercel dashboards for build/deployment logs
3. Test the API directly: `curl https://YOUR_RAILWAY_URL/api/v1/health`
4. Test the frontend: open `https://YOUR_VERCEL_URL` in incognito mode (avoids caching)

---

## SUCCESS CRITERIA

✅ Railway: Health check passes, text analysis returns CRITICAL for scam message
✅ Vercel: Home page loads, /analyze works, can paste and get a result
✅ CORS: No CORS errors in browser console
✅ Dark mode: Toggle in navbar works and persists
✅ Screenshots: 4+ images showing the full flow
✅ Devpost: All fields filled, screenshots uploaded, video linked
✅ Submission time: Before Mar 15, 12:30pm EDT

---

**You've got this. Submit tonight and celebrate! 🎉**
