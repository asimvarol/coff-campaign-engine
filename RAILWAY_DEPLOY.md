# 🚂 Railway Deployment Guide

Railway monorepo'lar için optimize edilmiş ve çok kolay!

## Step 1: Create Account & Connect GitHub

1. Go to: **https://railway.app**
2. Click **"Login with GitHub"**
3. Authorize Railway to access your repositories

## Step 2: Create New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose: **`asimvarol/coff-campaign-engine`**
4. Railway will auto-detect it's a monorepo

## Step 3: Configure Service

Railway should auto-detect Next.js. If asked:

**Root Directory:** `apps/web`
**Build Command:** `cd ../.. && bun run build --filter=@repo/web`
**Start Command:** `cd apps/web && bun start`

## Step 4: Add Environment Variables

Click on your service → **Variables** tab:

```bash
DATABASE_URL=postgresql://mock:mock@localhost:5432/mock
NEXTAUTH_SECRET=GGStHu/mRalq+bDTJtMKdRoMrDNffEhGoKZMHqfEpqo=
NEXTAUTH_URL=https://your-app.up.railway.app
FAL_AI_KEY=8032b3eb-a441-42ab-9ab0-1578262d8fbc:ed5717a6db5d5c8983c009f1fa5cf8de
GOOGLE_CLIENT_ID=1052642071406-gcfutdscdp8cmf524nkp41p7k0nqiq3g.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
ENABLE_AUTOPILOT=true
ENABLE_AGENCY_MODE=true
NODE_ENV=production
```

**Note:** Update `NEXTAUTH_URL` after deployment with your actual Railway URL

## Step 5: Deploy

1. Railway will automatically deploy
2. Wait for build to complete (~2-3 minutes)
3. Click **"View Logs"** to monitor progress
4. Once done, click the **generated URL** (e.g., `your-app.up.railway.app`)

## Step 6: Post-Deployment

1. Copy your Railway URL
2. Go back to **Variables** tab
3. Update `NEXTAUTH_URL` with the real URL
4. Railway will auto-redeploy

## Optional: Custom Domain

1. Click **Settings** → **Networking**
2. Click **"Generate Domain"** or **"Custom Domain"**
3. Follow instructions to add DNS records

## Troubleshooting

**If build fails:**
1. Check logs in Railway dashboard
2. Ensure all environment variables are set
3. Verify GitHub repo is public or Railway has access

**If 404 errors:**
1. Check Start Command is correct
2. Verify Root Directory is `apps/web`
3. Check build output in logs

## Free Tier Limits

Railway Free:
- $5 credit per month
- ~500 hours execution time
- Enough for testing/MVP

Upgrade to Pro ($20/mo) for production use.

---

## Quick Start (TL;DR)

1. https://railway.app → Login with GitHub
2. New Project → Deploy from GitHub repo → Select coff-campaign-engine
3. Add environment variables (copy from above)
4. Wait for deploy
5. Visit generated URL

That's it! 🎉

---

**Status:** Ready to deploy
**Estimated Time:** 5-10 minutes
**Cost:** Free tier available
