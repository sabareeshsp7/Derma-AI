# AWS Migration Setup Status

**Last Updated:** March 2, 2026  
**Status:** Database & Cognito Configured ✅ | Testing Required ⚠️

---

## ✅ Completed Configuration

### 1. AWS RDS PostgreSQL Database

**Status:** ✅ Configured  
**Instance:** `derma-ai.cpacw8wwgbkg.ap-south-1.rds.amazonaws.com`

**Configuration:**
- Host: `derma-ai.cpacw8wwgbkg.ap-south-1.rds.amazonaws.com`
- Port: `5432`
- Database: `postgres`
- User: `postgres`
- Region: `ap-south-1`
- SSL: ✅ Enabled

**Files:**
- ✅ [lib/aws-database.ts](lib/aws-database.ts) - PostgreSQL connection pool
- ✅ [scripts/test-db-connection.js](scripts/test-db-connection.js) - Connection test script
- ✅ [DATABASE_SETUP.md](DATABASE_SETUP.md) - Complete setup guide

**Next Steps:**
```bash
# 1. Set your database password in .env.local
# 2. Test connection
npm run test:db

# 3. Apply database schema
psql "postgresql://postgres:YOUR_PASSWORD@derma-ai.cpacw8wwgbkg.ap-south-1.rds.amazonaws.com:5432/postgres?sslmode=require" -f database/schema.sql
```

---

### 2. AWS Cognito Authentication

**Status:** ✅ Configured  
**User Pool:** `ap-south-1_CFm2XusjU`

**Configuration:**
- User Pool ID: `ap-south-1_CFm2XusjU`
- Client ID: `5ptdi3da8v8ah0q61na4satqsa`
- Region: `ap-south-1`
- Redirect URI (dev): `http://localhost:3000/api/auth/callback`
- Redirect URI (prod): `https://d84l1y8p4kdic.cloudfront.net/api/auth/callback`

**Authentication Methods:**
- ✅ Direct login (email/password)
- ✅ AWS Cognito Hosted UI (OAuth 2.0)

**Files:**
- ✅ [lib/aws-cognito.ts](lib/aws-cognito.ts) - Authentication functions
- ✅ [app/api/auth/login/route.ts](app/api/auth/login/route.ts) - Login endpoint
- ✅ [app/api/auth/register/route.ts](app/api/auth/register/route.ts) - Registration endpoint
- ✅ [app/api/auth/callback/route.ts](app/api/auth/callback/route.ts) - OAuth callback
- ✅ [middleware.ts](middleware.ts) - JWT token validation
- ✅ [COGNITO_VERIFICATION.md](COGNITO_VERIFICATION.md) - Setup guide

**⚠️ Required AWS Console Action:**
1. Go to: AWS Console → Cognito → User Pools → App Integration → Domain
2. Create a domain (e.g., `dermasense-ai.auth.ap-south-1.amazoncognito.com`)
3. Update `.env.local`:
   ```env
   NEXT_PUBLIC_COGNITO_DOMAIN=https://dermasense-ai.auth.ap-south-1.amazoncognito.com
   ```
4. Configure callback URLs in App Client settings

---

### 3. AWS S3 Storage

**Status:** ✅ Code Ready | ⚠️ Bucket Not Created

**Configuration:**
- Bucket Name: `dermasense-storage`
- Region: `ap-south-1`

**Files:**
- ✅ [lib/aws-s3.ts](lib/aws-s3.ts) - S3 upload/download functions

**Functions:**
- `uploadAvatar(userId, file)` - User profile pictures
- `uploadAnalysisImage(userId, file)` - Skin lesion analysis images
- `uploadReport(userId, file)` - PDF medical reports
- `getSignedDownloadUrl(key)` - Generate temporary download URLs
- `deleteFile(key)` - Delete S3 objects

**Required Actions:**
1. Create S3 bucket in AWS Console
2. Configure CORS
3. Set up IAM user with S3 permissions
4. Update `.env.local` with credentials

---

### 4. Code Migration Status

**Supabase → AWS Migration:** ✅ Complete

| Component | Status | File |
|-----------|--------|------|
| Authentication | ✅ Migrated | app/api/auth/*.ts |
| Database Queries | ✅ Migrated | lib/aws-database.ts |
| File Storage | ✅ Implemented | lib/aws-s3.ts |
| Middleware | ✅ Updated | middleware.ts |
| User Components | ✅ Updated | components/auth/*.tsx |
| Dashboard | ✅ Updated | app/dashboard/layout.tsx |
| Login Page | ✅ Updated | app/login/page.tsx |
| Register Page | ✅ Updated | app/register/page.tsx |

**Removed Dependencies:**
- ❌ @supabase/supabase-js
- ❌ @supabase/auth-helpers-nextjs

**Added Dependencies:**
- ✅ pg (PostgreSQL client)
- ✅ @types/pg
- ✅ amazon-cognito-identity-js
- ✅ @aws-sdk/client-s3
- ✅ @aws-sdk/s3-request-presigner
- ✅ aws-sdk

---

## ⚠️ Pending Configuration

### 1. Environment Variables

**Action Required:** Update `.env.local` with actual values

```env
# Database - ADD YOUR PASSWORD
DB_PASSWORD=<YOUR_ACTUAL_RDS_PASSWORD>

# Cognito - ADD YOUR DOMAIN
NEXT_PUBLIC_COGNITO_DOMAIN=https://<YOUR_DOMAIN>.auth.ap-south-1.amazoncognito.com

# S3 - ADD YOUR CREDENTIALS
AWS_ACCESS_KEY_ID=<YOUR_ACCESS_KEY>
AWS_SECRET_ACCESS_KEY=<YOUR_SECRET_KEY>
```

### 2. AWS Cognito Domain Setup

**Required Steps:**
1. AWS Console → Cognito → User Pools → ap-south-1_CFm2XusjU
2. App Integration → Domain → Create domain
3. Configure OAuth callback URLs
4. Update `.env.local` with domain

**Status:** ⚠️ Not configured yet

### 3. S3 Bucket Creation

**Required Steps:**
1. AWS Console → S3 → Create bucket
2. Name: `dermasense-storage`
3. Region: `ap-south-1`
4. Enable versioning (optional)
5. Configure CORS:
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
       "AllowedOrigins": ["http://localhost:3000", "https://d84l1y8p4kdic.cloudfront.net"],
       "ExposeHeaders": ["ETag"]
     }
   ]
   ```

**Status:** ⚠️ Bucket not created

### 4. Database Schema Application

**Required Steps:**
```bash
# Option 1: Using psql
psql "postgresql://postgres:YOUR_PASSWORD@derma-ai.cpacw8wwgbkg.ap-south-1.rds.amazonaws.com:5432/postgres?sslmode=require" -f database/schema.sql

# Option 2: Using pgAdmin
# Connect to database and execute schema.sql
```

**Status:** ⚠️ Schema not applied

---

## 🧪 Testing Checklist

### Database Testing
```bash
# 1. Set password in .env.local
# 2. Run connection test
npm run test:db

# Expected: ✅ Connection successful + PostgreSQL version
```

### Authentication Testing
```bash
# 1. Start dev server
npm run dev

# 2. Test registration
# Navigate to: http://localhost:3000/register
# Fill form and submit

# 3. Test direct login
# Navigate to: http://localhost:3000/login
# Enter credentials and click "Login"

# 4. Test Hosted UI login (after domain setup)
# Click "Sign in with AWS Cognito"
# Should redirect to Cognito login page
```

### Integration Testing
- [ ] Register new user
- [ ] Verify user created in Cognito
- [ ] Verify profile created in RDS
- [ ] Login with credentials
- [ ] Access dashboard
- [ ] Test logout
- [ ] Upload avatar (after S3 setup)
- [ ] Save medical history
- [ ] Fetch medical history

---

## 📊 Cost Estimate (AWS Free Tier)

**Valid Period:** July 15, 2026 - July 14, 2027

| Service | Free Tier | Estimated Usage | Cost |
|---------|-----------|-----------------|------|
| RDS (db.t3.micro) | 750h/month | 720h/month | $0 |
| Cognito | 50K MAU | < 50K users | $0 |
| S3 Storage | 5GB | 2GB | $0 |
| S3 Requests | 20K GET, 2K PUT | 10K/month | $0 |
| Lambda | 1M requests/month | 100K/month | $0 |
| Data Transfer | 100GB/month | 50GB/month | $0 |

**Total Monthly Cost:** ~$0 (within Free Tier)

---

## 🚀 Next Actions (Priority Order)

### High Priority (Required for Testing)

1. **Set Database Password** (2 min)
   - Update `DB_PASSWORD` in `.env.local`
   - Test connection: `npm run test:db`

2. **Apply Database Schema** (5 min)
   ```bash
   psql "postgresql://postgres:YOUR_PASSWORD@derma-ai.cpacw8wwgbkg.ap-south-1.rds.amazonaws.com:5432/postgres?sslmode=require" -f database/schema.sql
   ```

3. **Configure Cognito Domain** (10 min)
   - Create domain in AWS Console
   - Update `.env.local`
   - Configure callback URLs

4. **Test Authentication** (15 min)
   - Start dev server: `npm run dev`
   - Test registration
   - Test login (both methods)
   - Verify dashboard access

### Medium Priority (Required for Full Functionality)

5. **Create S3 Bucket** (15 min)
   - Create bucket in AWS Console
   - Configure CORS
   - Set up IAM permissions
   - Update credentials in `.env.local`

6. **Test File Uploads** (10 min)
   - Upload avatar
   - Upload analysis image
   - Verify S3 storage

### Low Priority (Production Readiness)

7. **Security Hardening**
   - Configure MFA in Cognito
   - Set up AWS Secrets Manager for passwords
   - Enable CloudWatch logging
   - Configure backup retention

8. **Performance Optimization**
   - Set up RDS read replicas
   - Enable CloudFront CDN
   - Configure API Gateway caching

9. **Monitoring Setup**
   - Configure CloudWatch alarms
   - Set up billing alerts
   - Enable performance insights

---

## 📚 Documentation

- [DATABASE_SETUP.md](DATABASE_SETUP.md) - Complete database configuration guide
- [COGNITO_VERIFICATION.md](COGNITO_VERIFICATION.md) - Cognito setup and verification
- [database/schema.sql](database/schema.sql) - Database schema
- [package.json](package.json) - Dependencies and scripts

---

## 🆘 Support

**Common Issues:**

1. **Database connection timeout**
   - Check security group rules
   - Verify RDS is publicly accessible
   - Confirm correct password

2. **Cognito redirect error**
   - Verify callback URLs match exactly
   - Check domain configuration
   - Ensure OAuth flows enabled

3. **S3 upload fails**
   - Verify IAM permissions
   - Check CORS configuration
   - Confirm credentials in .env.local

**Resources:**
- [AWS RDS Documentation](https://docs.aws.amazon.com/rds/)
- [AWS Cognito Documentation](https://docs.aws.amazon.com/cognito/)
- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)

---

**Status Legend:**
- ✅ Complete and tested
- ⚠️ Configured but untested
- ❌ Not started
- 🚧 In progress
