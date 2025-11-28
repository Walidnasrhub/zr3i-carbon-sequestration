# Maintenance & Troubleshooting Guide

## Overview

This guide provides operational procedures for maintaining the Zr3i platform in production, including common issues, solutions, and preventive measures.

---

## Daily Operations

### Health Checks

**Every morning, verify:**

1. **Website Accessibility**
```bash
curl -I https://zr3i.com
# Should return HTTP 200
```

2. **Contact Form Functionality**
   - Visit https://zr3i.com
   - Test contact form submission
   - Verify email notification received

3. **Carbon Calculator**
   - Test with sample values (10 hectares, 5 years)
   - Verify calculations are accurate
   - Check chart rendering

4. **Language Toggle**
   - Click English/العربية toggle
   - Verify all text switches correctly
   - Check RTL layout for Arabic

### Monitoring Dashboard

Access Vercel monitoring:
- **URL:** https://vercel.com/walidnasrhubs-projects/zr3i-carbon-sequestration
- **Check:** Deployment status, build times, error rates

---

## Common Issues & Solutions

### Issue 1: Website Returns 500 Error

**Symptoms:**
- "A server error has occurred" message
- Error ID: FUNCTION_INVOCATION_FAILED

**Root Causes:**
- Missing environment variables
- Database connection failure
- Corrupted deployment

**Solution:**

```bash
# Step 1: Check environment variables in Vercel
# Go to: Project Settings → Environment Variables
# Verify all required variables are set

# Step 2: Check deployment logs
vercel logs --follow

# Step 3: Redeploy current version
vercel deploy --prod

# Step 4: If still failing, rollback to previous deployment
# Via Vercel dashboard: Deployments → Previous version → Promote
```

### Issue 2: Contact Form Not Submitting

**Symptoms:**
- Form appears to submit but no confirmation
- No error message shown
- Network request fails

**Root Causes:**
- tRPC endpoint not responding
- Validation error on server
- Network connectivity issue

**Solution:**

```bash
# Step 1: Check browser console
# Open DevTools (F12) → Console tab
# Look for error messages

# Step 2: Check network request
# DevTools → Network tab
# Look for POST request to /api/trpc/contact.submit
# Check response status and body

# Step 3: Verify server is running
curl -X POST https://zr3i.com/api/trpc/contact.submit \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","phone":"1234567890","message":"Test message"}'

# Step 4: Check server logs
vercel logs --follow | grep -i "contact\|error"

# Step 5: Restart server
vercel deploy --prod
```

### Issue 3: Images Not Loading

**Symptoms:**
- Hero images show as broken
- Alt text visible instead of image
- Console shows 404 errors

**Root Causes:**
- Image files missing from deployment
- Incorrect image paths
- CDN caching issue

**Solution:**

```bash
# Step 1: Verify images exist in source
ls -la client/public/*.png

# Step 2: Check image paths in code
grep -r "hero-carbon-flow\|date-palm-impact" client/src/

# Step 3: Clear Vercel cache
# Via dashboard: Settings → Caches → Clear All

# Step 4: Rebuild and redeploy
pnpm build
vercel deploy --prod

# Step 5: Clear browser cache
# Ctrl+Shift+Delete (Windows/Linux) or Cmd+Shift+Delete (Mac)
```

### Issue 4: Language Toggle Not Working

**Symptoms:**
- Clicking toggle doesn't change language
- Text remains in original language
- Console shows errors

**Root Causes:**
- Language context not initialized
- localStorage corrupted
- JavaScript error in toggle component

**Solution:**

```bash
# Step 1: Clear browser storage
# DevTools → Application → Storage → Clear Site Data

# Step 2: Hard refresh browser
# Ctrl+F5 (Windows/Linux) or Cmd+Shift+R (Mac)

# Step 3: Check console for errors
# DevTools → Console tab
# Look for React or JavaScript errors

# Step 4: Verify LanguageContext is exported
grep -n "export.*LanguageContext" client/src/contexts/LanguageContext.tsx

# Step 5: Rebuild if needed
pnpm build && vercel deploy --prod
```

### Issue 5: Calculator Showing Incorrect Values

**Symptoms:**
- CO₂ calculations are wrong
- Income projections don't match formula
- Chart displays incorrect data

**Root Causes:**
- Formula error in component
- Input validation issue
- Floating-point precision error

**Solution:**

```bash
# Step 1: Verify calculation formula
# Open: client/src/components/CarbonCalculator.tsx
# Check: CO2_PER_HECTARE_PER_YEAR constant
# Check: PRICE_PER_TON_CO2 constant

# Step 2: Test with known values
# Farm size: 10 hectares
# Tree age: 5 years
# Expected CO2: 10 * 2.5 * 5 = 125 tons

# Step 3: Check for input validation errors
# Verify inputs accept decimal values
# Verify min/max constraints

# Step 4: Test in browser DevTools console
const farmSize = 10;
const treeAge = 5;
const co2 = farmSize * 2.5 * treeAge;
console.log(co2); // Should be 125

# Step 5: If formula is wrong, update and redeploy
# Edit CarbonCalculator.tsx
# Run: pnpm build && vercel deploy --prod
```

---

## Performance Optimization

### Monitor Performance Metrics

**Key metrics to track:**

| Metric | Target | How to Check |
|--------|--------|-------------|
| Page Load Time | < 3s | Vercel Analytics |
| First Contentful Paint | < 1.5s | Google PageSpeed |
| Largest Contentful Paint | < 2.5s | Google PageSpeed |
| Cumulative Layout Shift | < 0.1 | Google PageSpeed |
| Time to Interactive | < 3.5s | Vercel Analytics |

**Check performance:**
```bash
# Google PageSpeed Insights
# Visit: https://pagespeed.web.dev/?url=https://zr3i.com

# Vercel Analytics
# Visit: https://vercel.com/walidnasrhubs-projects/zr3i-carbon-sequestration/analytics
```

### Optimize Images

```bash
# Compress PNG images
pngquant --quality=65-80 client/public/*.png

# Convert to WebP
cwebp client/public/*.png -o client/public/%.webp

# Verify file sizes
ls -lh client/public/*.png client/public/*.webp
```

### Optimize JavaScript Bundle

```bash
# Analyze bundle size
pnpm build --analyze

# Identify large dependencies
# Look for opportunities to:
# - Remove unused dependencies
# - Replace with lighter alternatives
# - Implement code splitting
```

### Enable Caching

Update `vercel.json`:
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
    },
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    }
  ]
}
```

---

## Security Maintenance

### Regular Security Checks

**Weekly:**
```bash
# Check for vulnerable dependencies
pnpm audit

# Fix vulnerabilities
pnpm audit --fix
```

**Monthly:**
```bash
# Update dependencies
pnpm update

# Check for outdated packages
pnpm outdated

# Run security scan
npm audit --audit-level=moderate
```

### Rotate Secrets

**Quarterly rotation schedule:**

1. **JWT_SECRET**
   - Generate new secret: `openssl rand -base64 32`
   - Update in Vercel environment variables
   - Redeploy: `vercel deploy --prod`

2. **API Keys**
   - Rotate OAuth tokens
   - Update database credentials
   - Update third-party service keys

### Monitor Access Logs

```bash
# View recent deployments
vercel list

# Check deployment logs for errors
vercel logs --follow

# Search for specific errors
vercel logs --follow | grep -i "error\|warning\|failed"
```

---

## Database Maintenance

### Backup Schedule

**Daily backups:**
```bash
# PostgreSQL backup
pg_dump -U $DB_USER -h $DB_HOST $DB_NAME > backup-$(date +%Y%m%d).sql

# Compress backup
gzip backup-*.sql

# Upload to secure storage
aws s3 cp backup-*.sql.gz s3://zr3i-backups/
```

**Retention policy:**
- Daily backups: Keep 7 days
- Weekly backups: Keep 4 weeks
- Monthly backups: Keep 12 months

### Database Optimization

```bash
# Analyze query performance
EXPLAIN ANALYZE SELECT * FROM contact_submissions;

# Rebuild indexes
REINDEX DATABASE zr3i;

# Vacuum database
VACUUM ANALYZE;
```

### Monitor Database Health

```bash
# Check connection count
SELECT count(*) FROM pg_stat_activity;

# Monitor slow queries
SELECT query, mean_time FROM pg_stat_statements 
WHERE mean_time > 1000 ORDER BY mean_time DESC;

# Check disk usage
SELECT pg_size_pretty(pg_database_size('zr3i'));
```

---

## Deployment Procedures

### Safe Deployment Checklist

Before deploying to production:

- [ ] All tests passing locally: `pnpm test`
- [ ] Build succeeds: `pnpm build`
- [ ] No TypeScript errors: `pnpm check`
- [ ] Code reviewed and approved
- [ ] Changes documented in CHANGELOG
- [ ] Environment variables verified
- [ ] Database migrations tested
- [ ] Rollback plan documented

### Deployment Steps

```bash
# 1. Create feature branch
git checkout -b feature/your-feature

# 2. Make changes and test
pnpm dev
pnpm test
pnpm build

# 3. Commit with descriptive message
git add .
git commit -m "feat: describe your changes"

# 4. Push to GitHub
git push origin feature/your-feature

# 5. Create Pull Request
# Via GitHub: https://github.com/Walidnasrhub/zr3i-carbon-sequestration/pulls

# 6. Wait for CI/CD to pass
# Check: Build status, test results

# 7. Merge to main
# Via GitHub: Merge pull request

# 8. Vercel automatically deploys
# Monitor: https://vercel.com/walidnasrhubs-projects/zr3i-carbon-sequestration

# 9. Verify production
# Test: https://zr3i.com
```

### Rollback Procedure

If deployment causes issues:

```bash
# Option 1: Via Vercel Dashboard
# 1. Go to Deployments tab
# 2. Find previous stable deployment
# 3. Click "Promote to Production"

# Option 2: Via Git
# 1. Identify last good commit
git log --oneline | head -10

# 2. Revert to previous commit
git revert HEAD

# 3. Push changes
git push origin main

# 4. Vercel automatically redeploys
```

---

## Incident Response

### Critical Issue Response

**If production is down:**

1. **Immediate Actions (0-5 min)**
   - Check Vercel status page
   - Check website status: `curl https://zr3i.com`
   - Check error logs: `vercel logs --follow`

2. **Diagnosis (5-15 min)**
   - Identify root cause
   - Check recent deployments
   - Review error messages

3. **Mitigation (15-30 min)**
   - Rollback to previous version if needed
   - Restart services
   - Clear caches

4. **Communication (Ongoing)**
   - Update status page
   - Notify stakeholders
   - Document incident

5. **Post-Incident (After Resolution)**
   - Root cause analysis
   - Implement preventive measures
   - Update documentation

### Incident Log Template

```markdown
## Incident Report

**Date:** YYYY-MM-DD HH:MM UTC
**Duration:** X minutes
**Severity:** Critical/High/Medium/Low

### Timeline
- HH:MM - Issue detected
- HH:MM - Root cause identified
- HH:MM - Fix deployed
- HH:MM - Verified resolved

### Root Cause
[Description of what went wrong]

### Impact
- Users affected: X
- Revenue impact: $X
- Data loss: None/Yes

### Resolution
[What was done to fix it]

### Prevention
[How to prevent in future]
```

---

## Documentation Updates

### Keep Documentation Current

**After each deployment:**
1. Update CHANGELOG.md
2. Update README.md if needed
3. Update DEPLOYMENT.md if config changed
4. Update this MAINTENANCE.md if procedures changed

### Documentation Template

```markdown
## [Feature Name]

### Description
[What was added/changed]

### Files Modified
- client/src/components/NewComponent.tsx
- server/routers.ts
- README.md

### Testing
[How to test the feature]

### Deployment Notes
[Any special deployment considerations]

### Rollback Plan
[How to rollback if needed]
```

---

## Monitoring & Alerting

### Set Up Alerts

**Email alerts for:**
- Deployment failures
- High error rates (> 5%)
- Performance degradation
- Security issues

**Configure in Vercel:**
1. Project Settings → Notifications
2. Add email addresses
3. Select alert types

### Monitoring Tools

| Tool | Purpose | URL |
|------|---------|-----|
| Vercel Dashboard | Deployment monitoring | https://vercel.com |
| Google Analytics | User analytics | https://analytics.google.com |
| Umami Analytics | Custom analytics | https://analytics.example.com |
| Error Tracking | Error monitoring | Configure Sentry |

---

## Support Contacts

**For issues, contact:**

| Issue Type | Contact | Response Time |
|-----------|---------|----------------|
| Website Down | info@zr3i.com | 15 minutes |
| Bug Report | GitHub Issues | 24 hours |
| Feature Request | info@zr3i.com | 48 hours |
| Security Issue | security@zr3i.com | 1 hour |
| Vercel Issues | Vercel Support | 2 hours |

---

## Maintenance Checklist

### Weekly
- [ ] Check website accessibility
- [ ] Review error logs
- [ ] Test contact form
- [ ] Monitor performance metrics
- [ ] Check security alerts

### Monthly
- [ ] Update dependencies: `pnpm update`
- [ ] Run security audit: `pnpm audit`
- [ ] Review analytics
- [ ] Backup database
- [ ] Update documentation

### Quarterly
- [ ] Rotate secrets
- [ ] Security audit
- [ ] Performance optimization
- [ ] Dependency updates
- [ ] Disaster recovery drill

### Annually
- [ ] Full security assessment
- [ ] Architecture review
- [ ] Capacity planning
- [ ] Disaster recovery test
- [ ] Compliance audit

---

**Last Updated:** November 28, 2025
**Maintained By:** Manus AI
**Version:** 1.0.0
