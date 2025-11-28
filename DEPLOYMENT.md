# Deployment & Environment Configuration Guide

## Overview

This document provides comprehensive instructions for deploying and configuring the Zr3i Carbon Sequestration platform across different environments (development, staging, production).

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    GitHub Repository                         │
│         (Walidnasrhub/zr3i-carbon-sequestration)            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Push to main branch
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Vercel CI/CD                              │
│              (Automatic Deployment)                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   Vercel Deployment                          │
│         (dpl_AqZidrBB8TjEK9WjWHchYqm9N9cz)                 │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    zr3i.com Domain                           │
│              (Production Website)                            │
└─────────────────────────────────────────────────────────────┘
```

---

## Environment Variables

### Development Environment

Create a `.env.local` file in the project root:

```env
# Application
VITE_APP_ID=zr3i-dev
VITE_APP_TITLE=Zr3i Carbon Sequestration
VITE_APP_LOGO=/logo.svg

# Analytics
VITE_ANALYTICS_ENDPOINT=http://localhost:3000
VITE_ANALYTICS_WEBSITE_ID=dev-website-id

# OAuth
VITE_OAUTH_PORTAL_URL=http://localhost:3000/oauth

# Backend
JWT_SECRET=dev-secret-key-change-in-production
OAUTH_SERVER_URL=http://localhost:3000/oauth
```

### Production Environment (Vercel)

Set these variables in Vercel Project Settings → Environment Variables:

```
VITE_APP_ID=zr3i-prod
VITE_APP_TITLE=Zr3i Carbon Sequestration
VITE_APP_LOGO=https://zr3i.com/logo.svg
VITE_ANALYTICS_ENDPOINT=https://analytics.zr3i.com
VITE_ANALYTICS_WEBSITE_ID=prod-website-id
VITE_OAUTH_PORTAL_URL=https://oauth.zr3i.com
JWT_SECRET=[SECURE_RANDOM_STRING]
OAUTH_SERVER_URL=https://oauth.zr3i.com
```

**⚠️ Security Note:** Never commit `.env` files to version control. Use Vercel's secure environment variable management.

---

## Vercel Configuration

### vercel.json

```json
{
  "buildCommand": "pnpm build",
  "installCommand": "pnpm install",
  "outputDirectory": "dist/public",
  "cleanUrls": true
}
```

**Configuration Explanation:**
- `buildCommand`: Runs Vite build + esbuild for server
- `installCommand`: Uses pnpm for dependency installation
- `outputDirectory`: Serves static files from `dist/public`
- `cleanUrls`: Removes `.html` extensions from URLs

### Project Settings

**Build & Development:**
- Framework: None (Custom)
- Build Command: `pnpm build`
- Output Directory: `dist/public`
- Install Command: `pnpm install`

**Domains:**
- Primary: zr3i.com
- Auto-generated: zr3i-carbon-sequestration.vercel.app

**Environment:**
- Node.js Version: 20.x (recommended)
- Environment Variables: Set in Vercel dashboard

---

## Deployment Process

### Automatic Deployment (Recommended)

1. **Push to main branch:**
```bash
git add .
git commit -m "feat: add new feature"
git push origin main
```

2. **Vercel automatically:**
   - Detects the push
   - Runs build command
   - Deploys to preview URL
   - Promotes to production if on main branch

3. **Monitor deployment:**
   - Visit Vercel dashboard: https://vercel.com/walidnasrhubs-projects/zr3i-carbon-sequestration
   - Check deployment status and logs

### Manual Deployment via API

If automatic deployment fails, manually trigger with:

```bash
#!/bin/bash

# Set variables
VERCEL_TOKEN="YOUR_VERCEL_TOKEN"
TEAM_ID="team_7lKpqu5TJXXn6lHg9orhCZLx"
REPO_ID="1105787464"
COMMIT_SHA=$(git rev-parse HEAD)

# Create deployment
DEPLOYMENT=$(curl -s -X POST "https://api.vercel.com/v13/deployments?teamId=$TEAM_ID" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"zr3i-carbon-sequestration\",
    \"gitSource\": {
      \"ref\": \"$COMMIT_SHA\",
      \"type\": \"github\",
      \"repo\": \"Walidnasrhub/zr3i-carbon-sequestration\",
      \"repoId\": \"$REPO_ID\"
    }
  }")

DEPLOYMENT_ID=$(echo $DEPLOYMENT | jq -r '.id')
echo "Deployment created: $DEPLOYMENT_ID"

# Wait for deployment to complete
sleep 60

# Assign to domain
curl -s -X POST "https://api.vercel.com/v13/deployments/$DEPLOYMENT_ID/aliases?teamId=$TEAM_ID" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"alias": "zr3i.com"}'

echo "Deployment assigned to zr3i.com"
```

### Rollback to Previous Deployment

If issues occur after deployment:

1. **Via Vercel Dashboard:**
   - Go to Deployments tab
   - Find the previous stable deployment
   - Click "Promote to Production"

2. **Via API:**
```bash
curl -X POST "https://api.vercel.com/v13/deployments/PREVIOUS_DEPLOYMENT_ID/aliases?teamId=TEAM_ID" \
  -H "Authorization: Bearer YOUR_VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"alias": "zr3i.com"}'
```

---

## Build Process

### Local Build

```bash
# Install dependencies
pnpm install

# Build for production
pnpm build

# Output structure
dist/
├── public/                 # Static files (served by Vercel)
│   ├── index.html
│   ├── assets/
│   │   ├── index-*.css
│   │   └── index-*.js
│   └── *.png              # Hero images
└── index.js               # Server entry point (not used in static deployment)
```

### Build Optimization

**Current Bundle Size:**
- HTML: 367.67 KB (gzipped: 105.52 KB)
- CSS: 131.04 KB (gzipped: 19.75 KB)
- JavaScript: 1,170.19 KB (gzipped: 333.66 KB)

**Optimization Recommendations:**

1. **Code Splitting:**
```typescript
// Use dynamic imports for large components
const CarbonCalculator = lazy(() => import('./components/CarbonCalculator'));
```

2. **Image Optimization:**
   - Use WebP format with fallbacks
   - Compress images before deployment
   - Consider CDN for image delivery

3. **Bundle Analysis:**
```bash
# Analyze bundle size
pnpm build --analyze
```

---

## Database Configuration

### Local Development

Database configuration uses Drizzle ORM with SQLite by default:

```typescript
// server/db.ts
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';

const db = new Database('dev.db');
export const database = drizzle(db);
```

### Production Database

For production, configure a remote database:

1. **PostgreSQL (Recommended):**
```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const client = postgres(process.env.DATABASE_URL);
export const database = drizzle(client);
```

2. **Set environment variable in Vercel:**
```
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

---

## Domain Configuration

### DNS Settings for zr3i.com

Configure your domain registrar with these DNS records:

| Type | Name | Value |
|------|------|-------|
| CNAME | @ | cname.vercel-dns.com |
| CNAME | www | cname.vercel-dns.com |
| TXT | _vercel | verification-token |

### SSL/TLS

Vercel automatically provides free SSL certificates via Let's Encrypt. No manual configuration needed.

### Subdomain Configuration

For subdomains (e.g., api.zr3i.com):

1. Create CNAME record pointing to Vercel
2. Add domain in Vercel project settings
3. Configure environment variables for subdomain

---

## Monitoring & Analytics

### Vercel Analytics

Monitor deployment performance:

1. **Visit Vercel Dashboard:** https://vercel.com/walidnasrhubs-projects/zr3i-carbon-sequestration
2. **Check metrics:**
   - Build time
   - Deployment status
   - Function invocations
   - Edge requests

### Application Analytics

Umami analytics is configured in `client/index.html`:

```html
<script defer src="https://manus-analytics.com/umami" 
  data-website-id="bd612675-cc97-4247-8ee4-7f05cfde0455"></script>
```

**Access Analytics Dashboard:**
- URL: https://analytics.example.com
- Track: Page views, user interactions, conversions

### Error Tracking

Implement error tracking for production:

```typescript
// Add to App.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

---

## Performance Optimization

### Caching Strategy

Vercel automatically caches:
- Static assets (images, CSS, JS)
- HTML with `Cache-Control: public, max-age=0, must-revalidate`

**Custom caching headers:**

```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### CDN Configuration

For faster global delivery:

1. **Image CDN:** Use Cloudinary or Imgix
2. **Static CDN:** Vercel Edge Network (automatic)
3. **API CDN:** Vercel Edge Functions (optional)

---

## Troubleshooting

### Deployment Fails

**Check logs:**
```bash
# View Vercel deployment logs
vercel logs --follow
```

**Common issues:**
- Missing environment variables
- Build command errors
- Node version incompatibility
- Insufficient disk space

**Solution:**
1. Check `.env` file configuration
2. Run `pnpm build` locally to reproduce
3. Review Vercel build logs
4. Check Node version compatibility

### Website Shows Old Content

**Clear cache:**
1. Vercel dashboard → Deployments → Redeploy
2. Browser cache: Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)
3. CDN cache: Purge in Vercel settings

### Contact Form Not Working

**Debug steps:**
1. Check browser console for errors
2. Verify tRPC endpoint is accessible
3. Check server logs: `vercel logs --follow`
4. Verify environment variables are set
5. Test with curl: `curl -X POST https://zr3i.com/api/trpc/contact.submit`

---

## Security Checklist

- [ ] Environment variables set in Vercel (not in code)
- [ ] JWT_SECRET is strong and unique
- [ ] CORS headers configured correctly
- [ ] Input validation on client and server
- [ ] HTTPS enforced (automatic on Vercel)
- [ ] Rate limiting configured (if needed)
- [ ] Security headers set (CSP, X-Frame-Options, etc.)
- [ ] Dependencies updated regularly
- [ ] Secrets rotated periodically

---

## Backup & Recovery

### Code Backup

GitHub is the primary backup:
```bash
# Clone backup
git clone https://github.com/Walidnasrhub/zr3i-carbon-sequestration.git backup/
```

### Database Backup

For production database:

```bash
# PostgreSQL backup
pg_dump -U user -h host dbname > backup.sql

# Restore
psql -U user -h host dbname < backup.sql
```

### Deployment Rollback

Vercel keeps deployment history. To rollback:

1. Go to Vercel dashboard
2. Find previous stable deployment
3. Click "Promote to Production"

---

## Maintenance Schedule

| Task | Frequency | Owner |
|------|-----------|-------|
| Update dependencies | Monthly | Dev Team |
| Security audit | Quarterly | Security Team |
| Performance review | Monthly | Dev Team |
| Database backup | Daily | DevOps |
| Log review | Weekly | Ops Team |
| Certificate renewal | Automatic | Vercel |

---

## Support & Escalation

**For deployment issues:**
1. Check Vercel dashboard and logs
2. Review this documentation
3. Contact Vercel support: https://vercel.com/support
4. Contact Zr3i team: info@zr3i.com

---

**Last Updated:** November 28, 2025
**Maintained By:** Manus AI
**Version:** 1.0.0
