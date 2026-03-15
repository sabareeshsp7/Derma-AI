# AWS Cost Analysis for DermaSense AI
## Complete Free Tier & Post-Free Tier Cost Breakdown

---

## 📅 Free Tier Timeline

**Important Dates:**
- **Free Tier Start**: July 15, 2026 (your AWS account creation)
- **Free Tier Expires**: July 14, 2027 (12 months later)
- **Always Free Services**: Cognito, Lambda (limited), API Gateway

---

## 💰 Detailed Cost Analysis

### 1. Amazon RDS PostgreSQL (Database)

#### During Free Tier (First 12 Months)
```
✅ FREE: 750 hours/month of db.t3.micro
   - 1 vCPU, 1 GB RAM
   - Running 24/7 = 720 hours/month ✅ WITHIN FREE TIER
   - Can run 1 instance continuously OR 2 instances for 15 days each

✅ FREE: 20 GB General Purpose (SSD) storage
   - Your database: ~500 MB estimated (very small)
   - Plenty of room to grow

✅ FREE: 20 GB backup storage

🚫 Charged: Data transfer out > 1 GB/month (unlikely for your app)
```

#### After Free Tier (Month 13+)
```
💰 COST PER MONTH:
   Instance cost (db.t3.micro): $0.018/hour × 730 hours = $13.14/month
   Storage (20 GB): $0.115/GB × 20 = $2.30/month
   Backup (20 GB): $0.095/GB × 20 = $1.90/month
   
   TOTAL: ~$17-20/month
```

**Cost Optimization Options:**
```
Option 1: Auto-Stop RDS during night hours (8 PM - 8 AM)
   - Saves 12 hours/day = 50% savings
   - Cost: ~$8-10/month

Option 2: Switch to Aurora Serverless v2
   - Min: 0.5 ACU = $0.12/hour × 730 = $87.60/month (expensive for 24/7)
   - But scales to 0 when idle
   - Best for: Variable/unpredictable traffic
   - Your case: RDS db.t3.micro is cheaper for 24/7 operation

Option 3: Use Amazon RDS Proxy + Lambda
   - Lambda connects via RDS Proxy (connection pooling)
   - Stop RDS when no traffic
   - Best for: Very low traffic apps
   - Cost: $3/month + usage

Recommended: Option 1 (Auto-stop at night for dev/low-traffic apps)
```

---

### 2. Amazon Cognito (Authentication)

#### Cost: $0 FOREVER! 🎉
```
✅ Always Free: Up to 50,000 Monthly Active Users (MAU)
   - Perfect for startups and small-to-medium apps
   - No credit card charges for authentication

🎯 Definition of MAU: Unique users who sign in during the month
```

#### After 50,000 MAU (only if you get VERY popular)
```
💰 Tiered Pricing (if you exceed 50K MAU):
   - Next 50,000 MAU: $0.0055 per MAU
   - Next 900,000 MAU: $0.0046 per MAU
   - Next 9,000,000 MAU: $0.00325 per MAU
   
   Example: 100,000 MAU/month
   - First 50,000: Free
   - Next 50,000: $0.0055 × 50,000 = $275/month
   
   (This is a "good problem to have" - means you're successful!)
```

---

### 3. Amazon S3 (Storage)

#### During Free Tier (First 12 Months)
```
✅ FREE: 5 GB standard storage
✅ FREE: 20,000 GET requests
✅ FREE: 2,000 PUT requests

Estimated Usage (per month):
- User avatars: ~100 images × 500 KB = 50 MB
- Analysis images: ~500 images × 2 MB = 1 GB
- Reports: ~100 PDFs × 500 KB = 50 MB
- Total: ~1.1 GB ✅ WELL WITHIN FREE TIER

Requests:
- Image uploads: ~600 PUT requests ✅ WITHIN FREE TIER
- Image views: ~5,000 GET requests ✅ WITHIN FREE TIER
```

#### After Free Tier
```
💰 COST PER MONTH (for 5 GB):
   Storage: $0.023/GB × 5 GB = $0.115/month
   PUT requests: $0.005 per 1,000 × (2,000/1000) = $0.01/month
   GET requests: $0.0004 per 1,000 × (20,000/1000) = $0.008/month
   
   TOTAL: ~$0.15-0.50/month (essentially free!)
```

**Growth Scenario:**
```
At 10,000 users (high growth):
- Storage: 50 GB
- Cost: $0.023 × 50 = $1.15/month
- Still incredibly cheap!
```

---

### 4. AWS Lambda (Serverless Functions)

#### Cost: Mostly FREE FOREVER! 🎉
```
✅ Always Free (every month, forever):
   - 1 million requests
   - 400,000 GB-seconds of compute time

What's a GB-second?
   - 1 GB memory × 1 second = 1 GB-second
   - 512 MB memory × 2 seconds = 1 GB-second
   
Example Calculation:
   Your Lambda: 512 MB memory, 200ms average execution
   GB-seconds per request: 0.512 GB × 0.2 seconds = 0.1024 GB-seconds
   
   Free tier allows: 400,000 GB-seconds
   = 3,906,250 requests/month ✅ MORE THAN ENOUGH!
```

#### Realistic Usage (1000 active users):
```
Estimated requests per month:
- Login/auth: 3,000 requests
- API calls: 10,000 requests
- ML predictions: 500 requests (slower, more memory)
- Total: ~13,500 requests

Compute time:
- Simple APIs: 13,000 × 0.1 GB-seconds = 1,300 GB-seconds
- ML predictions: 500 × 2.5 GB-seconds = 1,250 GB-seconds
- Total: ~2,550 GB-seconds

✅ Both WELL WITHIN FREE TIER! Cost: $0
```

#### After Free Tier (if you exceed limits)
```
💰 Cost per million requests: $0.20
💰 Cost per GB-second: $0.0000166667

Example: 2 million requests/month
   Requests: ($0.20 × 2) = $0.40
   Compute (assuming same pattern): ~5,000 GB-seconds
   - Free: 400,000 GB-seconds
   - Extra: 0 GB-seconds
   
   TOTAL: $0.40/month
   
Even at 10 million requests: ~$2/month!
```

---

### 5. Amazon API Gateway

#### HTTP APIs (Recommended)
```
✅ Always Free: First 1 million requests/month
💰 After 1M: $1.00 per million requests

Your usage (1000 users): ~15,000 requests/month
Cost: $0 (within free tier forever!)

Even at 100,000 users: ~1.5M requests
Cost: $0.50/month (incredibly cheap!)
```

#### REST APIs (More expensive, use only if needed)
```
💰 Cost: $3.50 per million requests (no free tier after 12 months)
   
Not recommended unless you need specific REST API features
```

---

### 6. AWS Amplify (Frontend Hosting)

#### During Free Tier (12 Months)
```
✅ FREE:
   - 1,000 build minutes/month
   - 15 GB data transfer out/month
   - 5 GB storage

Your Next.js app:
- Build time: ~5-10 minutes per deployment
- Deployments: ~20 per month
- Total: ~200 build minutes ✅ WITHIN FREE TIER
- Storage: ~100 MB ✅ WITHIN FREE TIER
```

#### After Free Tier
```
💰 COST PER MONTH:
   Build minutes: $0.01/minute
   - 200 minutes × $0.01 = $2.00/month
   
   Data transfer: $0.15/GB
   - 5 GB × $0.15 = $0.75/month
   
   Hosting: Free for custom domains
   
   TOTAL: ~$3-5/month
```

**Alternative: Vercel (Highly Recommended!)**
```
✅ Vercel Free Tier (generous, permanent):
   - 100 GB bandwidth/month
   - Unlimited sites
   - Automatic deployments
   - Free SSL, CDN
   - Perfect for Next.js
   
   Cost: $0/month (hobby tier)
   
   Pro tier (if needed): $20/month per user
   - For commercial projects
   - More bandwidth, analytics
```

---

### 7. CloudFront (CDN - Optional but Recommended)

#### Free Tier (12 Months)
```
✅ FREE:
   - 50 GB data transfer out
   - 2 million HTTP/HTTPS requests

Your usage: ~10 GB/month ✅ WITHIN FREE TIER
```

#### After Free Tier
```
💰 COST (for 50 GB):
   Data transfer: $0.085/GB × 50 = $4.25/month
   Requests: $0.0075 per 10,000 × (2M/10K) = $1.50/month
   
   TOTAL: ~$5-7/month
   
Benefit: 40-60% faster load times, better user experience
```

---

### 8. CloudWatch (Monitoring & Logs)

#### Free Tier (Permanent)
```
✅ Always Free:
   - 5 GB log ingestion
   - 5 GB log storage
   - 10 custom metrics
   - 10 alarms
   - 1 million API requests

Your usage: ~1 GB logs/month ✅ WITHIN FREE TIER
```

#### After Free Limits
```
💰 COST (if you exceed):
   Log ingestion: $0.50/GB
   Log storage: $0.03/GB per month
   Custom metrics: $0.30 per metric per month
   
Typical overage: $1-3/month
```

**Optimization:**
- Set log retention to 7 days (instead of "never expire")
- Filter out verbose logs
- Use sampling for high-volume APIs

---

## 📊 Total Cost Summary

### Scenario 1: During First 12 Months (Free Tier)
```
┌─────────────────────┬──────────┬────────────┐
│ Service             │ Status   │ Cost/Month │
├─────────────────────┼──────────┼────────────┤
│ RDS PostgreSQL      │ Free     │ $0.00      │
│ Cognito             │ Free     │ $0.00      │
│ S3 Storage          │ Free     │ $0.00      │
│ Lambda              │ Free     │ $0.00      │
│ API Gateway         │ Free     │ $0.00      │
│ Amplify Hosting     │ Free     │ $0.00      │
│ CloudFront CDN      │ Free     │ $0.00      │
│ CloudWatch          │ Free     │ $0.00      │
├─────────────────────┼──────────┼────────────┤
│ TOTAL               │          │ $0.00      │
└─────────────────────┴──────────┴────────────┘

✅ COMPLETELY FREE for the first year!
```

### Scenario 2: After Free Tier (Small Scale - 1000 users)
```
┌─────────────────────┬──────────────┬────────────┐
│ Service             │ Usage        │ Cost/Month │
├─────────────────────┼──────────────┼────────────┤
│ RDS PostgreSQL      │ 24/7         │ $17.00     │
│ Cognito             │ <50K MAU     │ $0.00      │
│ S3 Storage          │ 5 GB         │ $0.50      │
│ Lambda              │ <1M req      │ $0.00      │
│ API Gateway         │ <1M req      │ $0.00      │
│ Amplify/Vercel      │ Hosting      │ $0-5.00    │
│ CloudFront CDN      │ 50 GB        │ $6.00      │
│ CloudWatch          │ <5GB logs    │ $0.00      │
├─────────────────────┼──────────────┼────────────┤
│ TOTAL               │              │ $23-28/mo  │
└─────────────────────┴──────────────┴────────────┘

Optimized (with RDS auto-stop at night):
TOTAL: $12-15/month
```

### Scenario 3: Growth Stage (10,000 users, 1 year after launch)
```
┌─────────────────────┬──────────────┬────────────┐
│ Service             │ Usage        │ Cost/Month │
├─────────────────────┼──────────────┼────────────┤
│ RDS PostgreSQL      │ 24/7, larger │ $50.00     │
│ Cognito             │ <50K MAU     │ $0.00      │
│ S3 Storage          │ 50 GB        │ $2.00      │
│ Lambda              │ 3M req       │ $1.00      │
│ API Gateway         │ 3M req       │ $2.00      │
│ Amplify/Vercel      │ Hosting      │ $5.00      │
│ CloudFront CDN      │ 200 GB       │ $20.00     │
│ CloudWatch          │ Logs         │ $3.00      │
├─────────────────────┼──────────────┼────────────┤
│ TOTAL               │              │ $83/mo     │
└─────────────────────┴──────────────┴────────────┘

Still very affordable for 10K users!
Revenue potential: 10K users × $10/user = $100K/month
Infrastructure: $83/month = 0.08% of revenue 🎯
```

### Scenario 4: Success! (100,000 users)
```
┌─────────────────────┬──────────────┬────────────┐
│ Service             │ Usage        │ Cost/Month │
├─────────────────────┼──────────────┼────────────┤
│ RDS PostgreSQL      │ Multi-AZ     │ $200.00    │
│ Cognito             │ 100K MAU     │ $275.00    │
│ S3 Storage          │ 500 GB       │ $12.00     │
│ Lambda              │ 30M req      │ $10.00     │
│ API Gateway         │ 30M req      │ $29.00     │
│ Amplify/Vercel Pro  │ Hosting      │ $20.00     │
│ CloudFront CDN      │ 2 TB         │ $150.00    │
│ CloudWatch          │ Logs         │ $20.00     │
├─────────────────────┼──────────────┼────────────┤
│ TOTAL               │              │ $716/mo    │
└─────────────────────┴──────────────┴────────────┘

Revenue potential: 100K users × $10/user = $1M/month
Infrastructure: $716/month = 0.07% of revenue 🚀
(At this scale, you can easily afford it!)
```

---

## 💡 Cost Optimization Strategies

### 1. For Development/Testing
```
✅ Use separate AWS account with free tier
✅ Auto-stop RDS during non-working hours
✅ Use Lambda for backend (stays in free tier)
✅ Set CloudWatch log retention to 3-7 days
✅ Delete old test data and S3 files regularly
```

### 2. For Production (Low Budget)
```
✅ Use Vercel instead of Amplify (better free tier)
✅ Use Aurora Serverless v2 if traffic is sporadic
✅ Enable S3 Intelligent-Tiering (auto-moves old files to cheaper storage)
✅ Use CloudFront CDN (caching reduces Lambda calls)
✅ Implement API caching (reduces database queries)
✅ Use CloudWatch Logs Insights sparingly (charged per query)
```

### 3. For Scaling
```
✅ Use ElastiCache (Redis) for session management
✅ Enable RDS Read Replicas for read-heavy workloads
✅ Use Lambda with Provisioned Concurrency for critical APIs
✅ Implement multi-region deployment for global users
✅ Use AWS Savings Plans (commit 1-3 years, save 50-70%)
```

---

## 🚨 Cost Alerts & Monitoring

### Set Up These Alerts (Critical!)

```
1. Billing Alert: Total estimated charges > $5
   → Get notified before costs escalate

2. Budget Alert: Monthly budget 80% consumed
   → Know when approaching limit

3. Free Tier Alert: Service usage > 75% of free tier
   → Avoid surprise charges

4. Service-Specific Alerts:
   - RDS CPU > 80% (may need to upgrade)
   - S3 storage > 4 GB (approaching free tier limit)
   - Lambda invocations > 750K (75% of free tier)
```

### How to Set Up (in CloudWatch)

```bash
1. Go to AWS CloudWatch Console
2. Billing → Create Budget
3. Cost budget, Monthly
4. Amount: $10 (or your comfort level)
5. Alert at 80%, 100%, 120%
6. Email notification: your-email@example.com
7. Create budget

Now you're protected! 🛡️
```

---

## 📈 ROI Analysis

### Investment vs Returns

```
Year 1 (Free Tier):
   Cost: $0/month × 12 = $0
   Savings vs Supabase Pro: $25/month × 12 = $300 saved!
   
Year 2 (1000 users):
   Cost: ~$25/month × 12 = $300/year
   Revenue (if monetized at $5/user): $5,000/month = $60,000/year
   Profit margin: 99.5% 🎯
   
Year 3 (10,000 users):
   Cost: ~$85/month × 12 = $1,020/year
   Revenue: $50,000/month = $600,000/year
   Profit margin: 99.8% 🚀
```

**Conclusion**: AWS infrastructure costs are NEGLIGIBLE compared to revenue potential!

---

## 🎓 Key Takeaways

1. **First 12 Months**: Completely FREE ✅
2. **After Free Tier**: $12-28/month for small scale (very affordable!)
3. **Cognito**: Free forever for <50K users 🎉
4. **Lambda & API Gateway**: Essentially free for most small-to-medium apps
5. **Biggest cost**: RDS database ($17/mo), but can be optimized
6. **Scalability**: Costs grow proportionally with users (good economics)
7. **No Vendor Lock-in**: Can always migrate to another provider
8. **Free Tier Abuse Protection**: Billing alerts keep you safe

---

## 🔗 Useful Resources

- **AWS Pricing Calculator**: https://calculator.aws/
- **Free Tier Usage Dashboard**: AWS Console → Billing → Free Tier
- **Cost Explorer**: AWS Console → Cost Management → Cost Explorer
- **AWS Free Tier FAQ**: https://aws.amazon.com/free/free-tier-faqs/

---

**Last Updated**: March 2026  
**Prices**: Based on AWS US East (Ohio) region - may vary slightly by region  
**Currency**: USD

**Disclaimer**: Prices are estimates and subject to change. Always check current AWS pricing.

---

Good luck with cost optimization! 💰✨
