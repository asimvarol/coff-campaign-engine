#!/bin/bash

# Lighthouse audit script
# Run against local dev server

echo "🔍 Running Lighthouse audit..."

if ! command -v lighthouse &> /dev/null; then
    echo "❌ Lighthouse not found. Installing..."
    npm install -g lighthouse
fi

# Check if dev server is running
if ! curl -s http://localhost:3001 > /dev/null; then
    echo "⚠️  Dev server not running on :3001"
    echo "Start it with: bun run dev"
    exit 1
fi

# Run Lighthouse
lighthouse http://localhost:3001 \
    --output=html \
    --output=json \
    --output-path=./lighthouse-report \
    --chrome-flags="--headless" \
    --only-categories=performance,accessibility,best-practices,seo

echo ""
echo "✅ Audit complete!"
echo "📊 Reports:"
echo "  - lighthouse-report.html"
echo "  - lighthouse-report.json"
echo ""
echo "Open report: open lighthouse-report.html"
