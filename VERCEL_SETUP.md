# Vercel Dashboard Setup Instructions

## 1. Project Settings

**URL:** https://vercel.com/asim-weezboocoms-projects/coff-campaign-engine/settings

### General Tab:
- **Root Directory:** `apps/web`
- ☑ **Include source files outside of the Root Directory in the Build Step**
- Click **Save**

### Build & Development Settings:
- **Framework Preset:** Next.js (should auto-detect)
- **Build Command:** Leave empty (auto-detect)
- **Output Directory:** Leave empty (auto-detect)
- **Install Command:** Leave empty (auto-detect)

## 2. Environment Variables

**URL:** https://vercel.com/asim-weezboocoms-projects/coff-campaign-engine/settings/environment-variables

Add these variables for **Production**, **Preview**, and **Development**:

### Required:
```bash
DATABASE_URL=postgresql://user:pass@host:5432/db
NEXTAUTH_SECRET=<generate-new-secret>
NEXTAUTH_URL=https://coff-campaign-engine.vercel.app
```

Generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

### Optional (already have):
```bash
FAL_AI_KEY=8032b3eb-a441-42ab-9ab0-1578262d8fbc:ed5717a6db5d5c8983c009f1fa5cf8de
GOOGLE_CLIENT_ID=1052642071406-gcfutdscdp8cmf524nkp41p7k0nqiq3g.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
ENABLE_AUTOPILOT=true
ENABLE_AGENCY_MODE=true
```

## 3. Deploy

**Option A: From Dashboard**
1. Go to: https://vercel.com/asim-weezboocoms-projects/coff-campaign-engine
2. Click "Deployments" tab
3. Find latest deployment
4. Click ⋯ (three dots) → "Redeploy"

**Option B: From CLI**
```bash
cd /Users/dev/coff-campaign-engine
vercel --prod
```

## 4. Database Setup (Quick Option)

For testing without external database, we can use Vercel Postgres:

```bash
# Create Vercel Postgres database
vercel postgres create coff-campaign-engine-db

# Get connection string
vercel postgres show coff-campaign-engine-db

# Add to environment variables
vercel env add DATABASE_URL
```

Or use external provider:
- Supabase: https://supabase.com (Free tier available)
- Neon: https://neon.tech (Serverless Postgres)
- PlanetScale: https://planetscale.com (MySQL)

## 5. Post-Deploy Checks

After deployment:
- Visit deployment URL
- Check build logs
- Test login flow
- Verify API endpoints

---

**Current Status:**
- ✅ Vercel CLI authenticated
- ✅ Project linked
- ⏳ Awaiting dashboard configuration
- ⏳ Need environment variables
- ⏳ Need database setup
