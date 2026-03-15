# AWS Setup Quick Checklist for DermaSense AI

## 📌 Prerequisites
- [ ] Valid email address
- [ ] Credit/Debit card (for AWS verification)
- [ ] Phone number for verification
- [ ] GitHub account (for code deployment)

---

## Week 1: Account Setup & Initial Configuration

### Day 1: AWS Account Creation (30 minutes)
- [ ] Create AWS account at aws.amazon.com
- [ ] Verify email
- [ ] Complete phone verification
- [ ] Add payment method
- [ ] Wait for account activation email

### Day 1 (continued): Security Setup (30 minutes)
- [ ] Enable MFA on root account
- [ ] Create IAM admin user
- [ ] Enable MFA on IAM user
- [ ] Sign out from root account
- [ ] Sign in with IAM user

### Day 2: Billing Protection (15 minutes)
- [ ] Set up billing alerts ($5 threshold)
- [ ] Enable free tier usage alerts
- [ ] Create CloudWatch billing alarm
- [ ] Verify alert emails received
- [ ] Select AWS region: `ap-south-1` (Mumbai) or closest

### Day 3: Database Setup - RDS (45 minutes)
- [ ] Create RDS PostgreSQL instance (db.t3.micro, free tier)
- [ ] Name: `dermasense-db`
- [ ] Set master password (SAVE IT!)
- [ ] Enable public access for now
- [ ] Configure security group (port 5432, your IP)
- [ ] Wait for database creation (~10 minutes)
- [ ] Test connection with pgAdmin or psql
- [ ] Note down endpoint address

### Day 4: Database Schema Creation (30 minutes)
- [ ] Connect to RDS via pgAdmin/psql
- [ ] Run schema SQL (from migration plan)
- [ ] Create `profiles` table
- [ ] Create `user_settings` table
- [ ] Create `medical_history` table
- [ ] Create indexes
- [ ] Verify tables created: `\dt` command
- [ ] Test insert and select queries

---

## Week 2: Authentication & Storage

### Day 5: Cognito User Pool Setup (30 minutes)
- [ ] Create Cognito User Pool: `dermasense-users`
- [ ] Configure email sign-in
- [ ] Set password policy
- [ ] Enable optional MFA
- [ ] Create app client: `dermasense-web`
- [ ] No client secret (public app)
- [ ] Set callback URLs (localhost + production)
- [ ] Note User Pool ID
- [ ] Note App Client ID
- [ ] Test with Hosted UI

### Day 6: S3 Storage Setup (20 minutes)
- [ ] Create S3 bucket: `dermasense-storage-[your-unique-id]`
- [ ] Same region as RDS
- [ ] Block public access (use signed URLs)
- [ ] Enable encryption
- [ ] Create folder structure:
  - [ ] avatars/
  - [ ] analysis-images/
  - [ ] reports/
  - [ ] prescriptions/
  - [ ] medical-records/
- [ ] Configure CORS with allowed origins
- [ ] Create IAM user: `s3-upload-user`
- [ ] Attach S3 policy (PutObject, GetObject, DeleteObject)
- [ ] Generate access keys
- [ ] SAVE access key and secret!

---

## Week 3: Backend Deployment

### Day 7-8: Lambda Setup (2 hours)
- [ ] Install AWS CLI: `pip install awscli`
- [ ] Configure AWS CLI: `aws configure`
- [ ] Enter access key, secret key, region
- [ ] Create Lambda function: `dermasense-api`
- [ ] Runtime: Python 3.11
- [ ] Package dependencies into layer
- [ ] Upload code to Lambda
- [ ] Set timeout: 30 seconds
- [ ] Set memory: 512 MB
- [ ] Configure VPC (same as RDS)
- [ ] Add environment variables:
  - [ ] DATABASE_URL
  - [ ] COGNITO_USER_POOL_ID
  - [ ] AWS_S3_BUCKET
- [ ] Test function with sample event

### Day 9: API Gateway Setup (30 minutes)
- [ ] Create HTTP API: `dermasense-api-gateway`
- [ ] Add Lambda integration
- [ ] Configure routes: `/{proxy+}`
- [ ] Create stage: `prod`
- [ ] Enable auto-deploy
- [ ] Configure CORS (allow origin: localhost + production)
- [ ] Note API Gateway URL
- [ ] Test endpoints with curl/Postman

### Day 10: ML Model Deployment (1 hour)
- [ ] Install Docker Desktop
- [ ] Create Dockerfile for ML model
- [ ] Build Docker image locally
- [ ] Create ECR repository: `dermasense-ml-api`
- [ ] Authenticate Docker to ECR
- [ ] Push image to ECR
- [ ] Create Lambda from container image
- [ ] Set memory: 2048 MB
- [ ] Set timeout: 60 seconds
- [ ] Add same environment variables
- [ ] Test ML prediction endpoint

---

## Week 4: Frontend & Integration

### Day 11-12: Code Migration (3 hours)
- [ ] Create new branch: `aws-migration`
- [ ] Install new packages:
  ```bash
  npm install pg @types/pg
  npm install amazon-cognito-identity-js
  npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
  ```
- [ ] Remove Supabase packages:
  ```bash
  npm uninstall @supabase/supabase-js @supabase/auth-helpers-nextjs
  ```
- [ ] Create `lib/aws-database.ts`
- [ ] Create `lib/aws-cognito.ts`
- [ ] Create `lib/aws-s3.ts`
- [ ] Update `app/api/auth/login/route.ts`
- [ ] Update `app/api/auth/register/route.ts`
- [ ] Update `lib/utils.ts`
- [ ] Update all Supabase imports to AWS equivalents
- [ ] Create `.env.local` with AWS credentials
- [ ] Test locally: `npm run dev`

### Day 13: Local Testing (2 hours)
- [ ] Test user registration
- [ ] Test user login
- [ ] Test profile creation in RDS
- [ ] Test medical history save to RDS
- [ ] Test image upload to S3
- [ ] Test ML prediction via API Gateway
- [ ] Check CloudWatch logs for errors
- [ ] Fix any bugs found

### Day 14: Frontend Deployment (1 hour)
**Option A: AWS Amplify**
- [ ] Connect GitHub repo to Amplify
- [ ] Select branch: `aws-migration`
- [ ] Add environment variables in Amplify
- [ ] Start build
- [ ] Wait for deployment (~10 minutes)
- [ ] Test live URL
- [ ] Configure custom domain (optional)

**Option B: Vercel (Easier!)**
- [ ] Connect GitHub repo to Vercel
- [ ] Import project
- [ ] Add environment variables
- [ ] Deploy
- [ ] Test live URL

---

## Week 5: Testing & Optimization

### Day 15-16: End-to-End Testing (2 hours)
- [ ] Test complete user registration flow
- [ ] Test email verification (check spam folder)
- [ ] Test login and session persistence
- [ ] Test profile updates saving to RDS
- [ ] Test skin analysis image upload
- [ ] Test ML prediction accuracy
- [ ] Test medical history display
- [ ] Test appointment booking (if integrated)
- [ ] Test shop cart functionality
- [ ] Test payment flow (if integrated)
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Mobile responsiveness testing

### Day 17: Monitoring Setup (30 minutes)
- [ ] Check CloudWatch Logs
  - [ ] Lambda function logs
  - [ ] API Gateway access logs
- [ ] Create CloudWatch alarms:
  - [ ] Lambda errors > 10
  - [ ] API Gateway 5XX errors
  - [ ] RDS CPU > 80%
  - [ ] RDS storage < 2GB
- [ ] Test alarm notifications
- [ ] Create CloudWatch dashboard
- [ ] Add key metrics widgets

### Day 18: Security Hardening (1 hour)
- [ ] Review RDS security group (remove unnecessary IPs)
- [ ] In production: Make RDS private (no public access)
- [ ] Use Lambda in VPC to access RDS
- [ ] Review S3 bucket policy (no public access)
- [ ] Rotate IAM access keys
- [ ] Enable CloudTrail for audit logs
- [ ] Review IAM policies (principle of least privilege)
- [ ] Enable AWS GuardDuty (threat detection)
- [ ] Set up AWS WAF (optional, for DDoS protection)

### Day 19: Cost Optimization (30 minutes)
- [ ] Check Cost Explorer
- [ ] Verify free tier usage
- [ ] Set up daily cost alerts
- [ ] Review CloudWatch logs retention (reduce to 7 days)
- [ ] Consider RDS auto-stop for dev environment
- [ ] Enable S3 Intelligent-Tiering for old files
- [ ] Review Lambda cold start optimization
- [ ] Check data transfer costs

### Day 20: Documentation & Backup (1 hour)
- [ ] Document all AWS resource IDs
- [ ] Save all connection strings securely (use password manager)
- [ ] Export environment variables list
- [ ] Create RDS snapshot (manual backup)
- [ ] Export Cognito user pool users (if any)
- [ ] Document API endpoints
- [ ] Create runbook for common tasks
- [ ] Update README.md with AWS deployment instructions

---

## Week 6: Production Readiness

### Day 21: Performance Testing (1 hour)
- [ ] Test concurrent users (10+ simultaneous)
- [ ] Load test API endpoints
- [ ] Check Lambda cold start times
- [ ] Monitor RDS connection pool
- [ ] Test S3 upload for large files (>10MB)
- [ ] Check ML prediction latency
- [ ] Optimize slow queries in RDS

### Day 22: Error Handling (1 hour)
- [ ] Test error scenarios:
  - [ ] Wrong credentials
  - [ ] Database connection failure
  - [ ] S3 upload failure
  - [ ] ML model timeout
  - [ ] Network errors
- [ ] Verify error messages are user-friendly
- [ ] Check error logging in CloudWatch
- [ ] Add retry logic for transient failures
- [ ] Implement circuit breaker pattern

### Day 23: Final Production Checks (30 minutes)
- [ ] All environment variables in production
- [ ] HTTPS enforced (no HTTP access)
- [ ] CORS configured correctly
- [ ] No hardcoded secrets in code
- [ ] No console.log of sensitive data
- [ ] Database encrypted at rest
- [ ] S3 objects encrypted
- [ ] All IAM users have MFA
- [ ] CloudWatch alarms working
- [ ] Billing alerts active

### Day 24: Go Live! 🚀
- [ ] Merge `aws-migration` branch to `main`
- [ ] Deploy to production
- [ ] Announce migration to users (if existing users)
- [ ] Monitor CloudWatch closely for 24 hours
- [ ] Check error rates
- [ ] Verify user registrations working
- [ ] Test payment processing (if applicable)
- [ ] Celebrate! 🎉

---

## Post-Launch Maintenance (Ongoing)

### Weekly Tasks
- [ ] Check AWS billing dashboard
- [ ] Review CloudWatch alarms
- [ ] Check error logs
- [ ] Monitor free tier usage
- [ ] Backup important data

### Monthly Tasks
- [ ] Rotate IAM access keys (every 90 days)
- [ ] Review security group rules
- [ ] Update dependencies (npm, pip)
- [ ] Review CloudWatch costs (reduce retention if high)
- [ ] Optimize RDS performance
- [ ] Clean up old S3 files

### Quarterly Tasks
- [ ] Full security audit
- [ ] Disaster recovery drill
- [ ] Cost optimization review
- [ ] Performance benchmarking
- [ ] Update AWS service configurations

---

## 🆘 Emergency Contacts & Resources

### AWS Support
- **Account Issues**: AWS Support Center (Basic - Free)
- **Service Health**: https://status.aws.amazon.com/
- **Documentation**: https://docs.aws.amazon.com/

### Community Help
- **AWS Forums**: https://forums.aws.amazon.com/
- **Stack Overflow**: Tag [amazon-web-services]
- **Reddit**: r/aws

### Important URLs
- AWS Console: https://console.aws.amazon.com/
- AWS Free Tier: https://aws.amazon.com/free/
- Cost Calculator: https://calculator.aws/
- Skill Builder: https://skillbuilder.aws/

---

## 💡 Pro Tips

1. **Always use the same AWS region** for all services (avoid data transfer charges)
2. **Tag all resources** with Project: DermaSense, Environment: Production/Dev
3. **Use Parameter Store** for secrets (not environment variables) in production
4. **Keep a spreadsheet** of all AWS resource IDs and endpoints
5. **Set up a CI/CD pipeline** after initial setup (GitHub Actions + AWS)
6. **Use AWS Budgets** to get alerts before costs escalate
7. **Join AWS Free Tier webinars** to learn optimization techniques
8. **Enable MFA on everything** (root, IAM users, Cognito)
9. **Regular backups**: Automate RDS snapshots and S3 versioning
10. **Monitor free tier usage** weekly to avoid surprises

---

## 📊 Success Metrics

After migration, you should have:
- ✅ $0-2 monthly AWS bill (during free tier)
- ✅ 99%+ API uptime
- ✅ < 2 second ML prediction latency
- ✅ 0 security vulnerabilities
- ✅ All CloudWatch alarms green
- ✅ 100% test coverage for critical flows
- ✅ Happy users! 😊

---

## 🎯 Timeline Summary

| Week | Focus | Time Investment |
|------|-------|----------------|
| Week 1 | Account & Database | 2-3 hours |
| Week 2 | Auth & Storage | 1-2 hours |
| Week 3 | Backend APIs | 4-5 hours |
| Week 4 | Code Migration & Deploy | 6-8 hours |
| Week 5 | Testing & Security | 4-5 hours |
| Week 6 | Production Launch | 2-3 hours |
| **Total** | **Full Migration** | **20-25 hours** |

Spread over 6 weeks = ~1 hour per day!

---

**Remember**: You have AWS Free Tier until July 15, 2027 (12 months from July 15, 2026). Plan accordingly!

Good luck! 🚀
