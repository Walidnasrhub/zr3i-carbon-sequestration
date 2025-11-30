# Deployment & Backup Guide

## Table of Contents
1. [Deployment Overview](#deployment-overview)
2. [Vercel Deployment](#vercel-deployment)
3. [Environment Variables](#environment-variables)
4. [Custom Domain Setup](#custom-domain-setup)
5. [Backup Procedures](#backup-procedures)
6. [Recovery Procedures](#recovery-procedures)
7. [Monitoring & Troubleshooting](#monitoring--troubleshooting)

---

## Deployment Overview

### Current Architecture
```
┌─────────────────────────────────────────────────────────┐
│                    www.zr3i.com                         │
├─────────────────────────────────────────────────────────┤
│                  Vercel CDN (Global)                    │
├─────────────────────────────────────────────────────────┤
│  Frontend (React)      │     Backend (Serverless)       │
│  - dist/public/*       │     - /api/satellite           │
│  - index.html          │     - /api/carbon              │
│  - assets/*            │     - /api/health              │
└─────────────────────────────────────────────────────────┘
           │                          │
           └──────────────────────────┘
                      │
           ┌──────────────────────┐
           │  External Services   │
           ├──────────────────────┤
           │ - Sentinel Hub API   │
           │ - MySQL Database     │
           │ - OAuth Server       │
           └──────────────────────┘
```

---

## Vercel Deployment

### Prerequisites
- Vercel account (https://vercel.com)
- GitHub account with repository access
- Vercel CLI installed: `npm i -g vercel`
- Vercel API token

### Automatic Deployment

The project is configured for automatic deployment on every push to the `main` branch.

**How it works:**
1. Push code to GitHub: `git push origin main`
2. GitHub webhook triggers Vercel build
3. Vercel builds and deploys automatically
4. Site updates at https://www.zr3i.com

**Deployment Status:**
- Check Vercel Dashboard: https://vercel.com/dashboard
- View deployment logs: https://vercel.com/walidnasrhubs-projects/zr3i-carbon-sequestration

### Manual Deployment

```bash
# Deploy to production
vercel deploy --prod --token <VERCEL_TOKEN>

# Deploy to staging (preview)
vercel deploy --token <VERCEL_TOKEN>

# List recent deployments
vercel ls --token <VERCEL_TOKEN>

# Inspect specific deployment
vercel inspect <deployment-url> --token <VERCEL_TOKEN>
```

### Build Configuration

**vercel.json:**
```json
{
  "buildCommand": "pnpm build",
  "installCommand": "pnpm install",
  "outputDirectory": "dist/public",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    },
    {
      "source": "/:path*",
      "destination": "/index.html"
    }
  ]
}
```

**Key Settings:**
- **Build Command:** `pnpm build` - Builds frontend and backend
- **Output Directory:** `dist/public` - Static frontend files
- **Rewrites:** Routes API calls to serverless functions

---

## Environment Variables

### Setting Environment Variables in Vercel

1. Go to Vercel Dashboard
2. Select project: `zr3i-carbon-sequestration`
3. Settings → Environment Variables
4. Add each variable with its value
5. Select environments: Production, Preview, Development
6. Save and redeploy

### Required Environment Variables

#### Sentinel Hub Integration
```
SENTINEL_HUB_CLIENT_ID=a003816a-444e-4e13-ae24-2a8b07c32863
SENTINEL_HUB_API_KEY=PLAKbf22e59cc55846d5beeb8c8d17b50a0c
```

#### Authentication
```
JWT_SECRET=<generate-secure-random-string>
OAUTH_SERVER_URL=https://oauth.manus.im
```

#### Database
```
DATABASE_URL=mysql://user:password@host:3306/database
```

#### Frontend Configuration
```
VITE_APP_TITLE=Zr3i Carbon Sequestration
VITE_APP_LOGO=/logo.svg
VITE_ANALYTICS_ENDPOINT=https://analytics.example.com
VITE_ANALYTICS_WEBSITE_ID=<website-id>
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im
```

### Generating JWT_SECRET

```bash
# Generate secure random string
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use OpenSSL
openssl rand -hex 32
```

---

## Custom Domain Setup

### Adding www.zr3i.com

1. **In Vercel Dashboard:**
   - Go to Settings → Domains
   - Add domain: `www.zr3i.com`
   - Vercel provides DNS records

2. **Update DNS Provider:**
   - Go to your domain registrar (e.g., GoDaddy, Namecheap)
   - Add CNAME record:
     ```
     Host: www
     Type: CNAME
     Value: cname.vercel-dns.com
     ```

3. **Verify Domain:**
   - Wait for DNS propagation (5-30 minutes)
   - Vercel automatically verifies ownership
   - SSL certificate issued automatically

4. **Redirect Root Domain:**
   - Add redirect from `zr3i.com` to `www.zr3i.com`
   - Or add `zr3i.com` as alias in Vercel

### SSL/TLS Certificate

- Automatically provisioned by Vercel
- Auto-renewal enabled
- HTTPS enforced on all connections

---

## Backup Procedures

### 1. Code Backup

#### GitHub Backup
```bash
# Code is automatically backed up on GitHub
# Create release for important versions

git tag -a v1.0.0 -m "Production Release - November 30, 2025"
git push origin v1.0.0

# List all tags
git tag -l

# View release
git show v1.0.0
```

#### Local Backup
```bash
# Clone entire repository locally
git clone https://github.com/Walidnasrhub/zr3i-carbon-sequestration.git zr3i-backup-$(date +%Y%m%d)

# Create compressed archive
tar -czf zr3i-backup-$(date +%Y%m%d).tar.gz zr3i-carbon-sequestration/
```

### 2. Database Backup

#### MySQL Backup
```bash
# Full database backup
mysqldump -u <username> -p <database_name> > backup-$(date +%Y%m%d-%H%M%S).sql

# Backup specific tables
mysqldump -u <username> -p <database_name> users farms > backup-users-farms.sql

# Compressed backup
mysqldump -u <username> -p <database_name> | gzip > backup-$(date +%Y%m%d).sql.gz
```

#### Cloud Database Backup
- Most cloud providers (AWS RDS, DigitalOcean, etc.) offer automated backups
- Configure retention policy (e.g., 30-day retention)
- Enable point-in-time recovery

### 3. Vercel Deployment Backup

```bash
# List all deployments
vercel ls --token <VERCEL_TOKEN> --limit 100

# Export deployment information
vercel ls --token <VERCEL_TOKEN> > deployments-$(date +%Y%m%d).txt

# Inspect specific deployment
vercel inspect <deployment-url> --token <VERCEL_TOKEN> > deployment-details.json
```

### 4. Environment Variables Backup

```bash
# Export environment variables (CAUTION: contains secrets!)
# Only do this for secure backup storage

# Via Vercel CLI (not directly available, manual process)
# 1. Go to Vercel Dashboard
# 2. Settings → Environment Variables
# 3. Screenshot or document each variable (without values for security)
```

### Backup Schedule

| Item | Frequency | Retention |
|------|-----------|-----------|
| GitHub Code | Real-time | Indefinite |
| Database | Daily | 30 days |
| Vercel Deployments | Per release | 30 days |
| Environment Config | Manual | As needed |

---

## Recovery Procedures

### 1. Frontend Recovery

#### If Latest Deployment is Broken

```bash
# List recent deployments
vercel ls --token <VERCEL_TOKEN>

# Rollback to previous deployment
vercel rollback <deployment-id> --token <VERCEL_TOKEN>

# Or redeploy from GitHub
git push origin main  # Triggers automatic redeploy
```

#### If Code is Corrupted

```bash
# Revert to previous commit
git log --oneline  # Find commit hash
git reset --hard <commit-hash>
git push origin main --force

# Or restore from backup
git clone zr3i-backup-<date>.tar.gz
cd zr3i-carbon-sequestration
git push origin main
```

### 2. Backend API Recovery

#### If API Endpoints are Down

```bash
# Check API health
curl https://www.zr3i.com/api/health

# If down, check Vercel function logs
vercel logs <deployment-url> --token <VERCEL_TOKEN>

# Redeploy backend
vercel deploy --prod --token <VERCEL_TOKEN>
```

#### If Environment Variables are Missing

1. Go to Vercel Dashboard
2. Settings → Environment Variables
3. Re-add missing variables
4. Redeploy: `vercel deploy --prod --token <VERCEL_TOKEN>`

### 3. Database Recovery

#### From MySQL Backup

```bash
# Restore from backup
mysql -u <username> -p <database_name> < backup-20251130.sql

# Restore from compressed backup
gunzip < backup-20251130.sql.gz | mysql -u <username> -p <database_name>

# Restore specific tables
mysql -u <username> -p <database_name> < backup-users-farms.sql
```

#### Verify Data Integrity

```bash
# Check table structure
mysql -u <username> -p <database_name> -e "SHOW TABLES;"

# Verify row counts
mysql -u <username> -p <database_name> -e "SELECT TABLE_NAME, TABLE_ROWS FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='<database_name>';"
```

### 4. Complete Site Recovery

**Scenario:** Entire site is down

```bash
# Step 1: Restore code from GitHub
git clone https://github.com/Walidnasrhub/zr3i-carbon-sequestration.git
cd zr3i-carbon-sequestration

# Step 2: Restore database
mysql -u <username> -p <database_name> < latest-backup.sql

# Step 3: Restore environment variables in Vercel
# (Manual: Go to Vercel Dashboard → Settings → Environment Variables)

# Step 4: Redeploy
vercel deploy --prod --token <VERCEL_TOKEN>

# Step 5: Verify
curl https://www.zr3i.com/api/health
```

---

## Monitoring & Troubleshooting

### Health Checks

```bash
# Frontend health
curl -I https://www.zr3i.com/

# API health
curl https://www.zr3i.com/api/health

# Satellite API
curl "https://www.zr3i.com/api/satellite?lat=30.0444&lng=31.2357"

# Carbon API
curl -X POST https://www.zr3i.com/api/carbon \
  -H "Content-Type: application/json" \
  -d '{"farmSize":10,"treeAge":5}'
```

### Common Issues & Solutions

#### Issue: 404 Not Found
```
Solution:
1. Check URL is correct
2. Verify Vercel deployment is complete
3. Clear browser cache: Ctrl+Shift+Del
4. Check vercel.json rewrites configuration
```

#### Issue: 500 Internal Server Error
```
Solution:
1. Check Vercel function logs
2. Verify environment variables are set
3. Check database connection
4. Review error message in logs
```

#### Issue: Slow Performance
```
Solution:
1. Check Vercel Analytics dashboard
2. Optimize images and assets
3. Enable caching headers
4. Review database query performance
5. Consider upgrading Vercel plan
```

#### Issue: API Timeout
```
Solution:
1. Check Sentinel Hub API status
2. Verify network connectivity
3. Increase timeout in code
4. Check rate limiting
5. Review Vercel function logs
```

### Monitoring Tools

**Vercel Analytics:**
- Dashboard: https://vercel.com/dashboard
- Real-time metrics
- Performance insights
- Error tracking

**Database Monitoring:**
- Check connection pool usage
- Monitor query performance
- Review slow query logs
- Check disk space

**Uptime Monitoring:**
- Use Uptime Robot (https://uptimerobot.com)
- Monitor https://www.zr3i.com
- Get alerts on downtime
- Track response times

### Logs

**Vercel Function Logs:**
```bash
vercel logs <deployment-url> --token <VERCEL_TOKEN>
vercel logs --follow --token <VERCEL_TOKEN>  # Real-time logs
```

**Database Logs:**
```bash
# MySQL error log
tail -f /var/log/mysql/error.log

# Slow query log
tail -f /var/log/mysql/slow.log
```

---

## Deployment Checklist

Before deploying to production:

- [ ] All tests passing: `pnpm test`
- [ ] Build successful: `pnpm build`
- [ ] No console errors or warnings
- [ ] Environment variables configured in Vercel
- [ ] Database migrations applied
- [ ] API endpoints tested
- [ ] Frontend functionality verified
- [ ] Backup created
- [ ] Deployment plan documented
- [ ] Team notified

---

## Rollback Procedure

If deployment causes issues:

```bash
# Option 1: Rollback via Vercel CLI
vercel rollback --token <VERCEL_TOKEN>

# Option 2: Revert code and redeploy
git revert <commit-hash>
git push origin main

# Option 3: Restore from backup
git reset --hard <backup-commit>
git push origin main --force
```

---

## Post-Deployment Verification

After deployment, verify:

1. **Frontend:**
   - [ ] Homepage loads
   - [ ] Navigation works
   - [ ] Forms submit
   - [ ] Images load

2. **Backend APIs:**
   - [ ] Health check: `GET /api/health`
   - [ ] Satellite data: `GET /api/satellite?lat=30&lng=31`
   - [ ] Carbon calc: `POST /api/carbon`

3. **Database:**
   - [ ] Can connect to database
   - [ ] Can read data
   - [ ] Can write data

4. **External Services:**
   - [ ] Sentinel Hub API working
   - [ ] OAuth server accessible
   - [ ] Email notifications sending

---

**Last Updated:** November 30, 2025  
**Version:** 1.0.0  
**Status:** Production Ready ✅
