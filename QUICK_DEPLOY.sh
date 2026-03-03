#!/bin/bash
# Quick Deploy Script - Mock Database

echo "🚀 Starting Quick Deploy to Vercel..."

cd /Users/dev/coff-campaign-engine

# Add environment variables via CLI
echo "📝 Adding environment variables..."

echo "GGStHu/mRalq+bDTJtMKdRoMrDNffEhGoKZMHqfEpqo=" | vercel env add NEXTAUTH_SECRET production preview development

vercel env add NEXTAUTH_URL production preview development << EOV
https://coff-campaign-engine.vercel.app
EOV

vercel env add FAL_AI_KEY production preview development << EOV
8032b3eb-a441-42ab-9ab0-1578262d8fbc:ed5717a6db5d5c8983c009f1fa5cf8de
EOV

vercel env add GOOGLE_CLIENT_ID production preview development << EOV
1052642071406-gcfutdscdp8cmf524nkp41p7k0nqiq3g.apps.googleusercontent.com
EOV

vercel env add GOOGLE_CLIENT_SECRET production preview development << EOV
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
EOV

# Mock database URL (app will use mock data)
vercel env add DATABASE_URL production preview development << EOV
postgresql://mock:mock@localhost:5432/mock
EOV

echo "✅ Environment variables added!"
echo ""
echo "🔨 Now deploy with: vercel --prod"
echo "or from dashboard: https://vercel.com/asim-weezboocoms-projects/coff-campaign-engine"
