# 🏗️ AWS Architecture Diagram for DermaSense AI

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                    🌐 USER DEVICES (Web Browser)                        │
│                                                                         │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                │ HTTPS
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                  ☁️ AWS CLOUDFRONT (CDN) - Optional                     │
│                  • Global edge locations                                │
│                  • SSL/TLS termination                                  │
│                  • DDoS protection                                      │
│                  • Cache static assets                                  │
│                                                                         │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                    ┌───────────┴───────────┐
                    │                       │
                    ▼                       ▼
┌───────────────────────────────┐  ┌─────────────────────────────────────┐
│                               │  │                                     │
│   🎨 AWS AMPLIFY / VERCEL     │  │   🔌 AWS API GATEWAY (HTTP API)     │
│   Frontend Hosting            │  │   • /api/*                          │
│   • Next.js 15                │  │   • CORS enabled                    │
│   • SSR/SSG                   │  │   • Rate limiting                   │
│   • Auto deployments          │  │   • Request validation              │
│   • Environment variables     │  │                                     │
│                               │  │                                     │
└───────────────────────────────┘  └────────────┬────────────────────────┘
                                                 │
                                    ┌────────────┼────────────┐
                                    │            │            │
                                    ▼            ▼            ▼
                    ┌─────────────────────┐  ┌──────────┐  ┌──────────────┐
                    │                     │  │          │  │              │
                    │  ⚡ AWS LAMBDA      │  │  ⚡ AWS  │  │  ⚡ AWS      │
                    │  Backend API        │  │  LAMBDA │  │  LAMBDA      │
                    │  • Authentication   │  │  ML API │  │  (Other)     │
                    │  • CRUD operations  │  │  • CNN   │  │  • Cron jobs │
                    │  • Business logic   │  │  • TF    │  │  • Workers   │
                    │  Python/FastAPI     │  │  • OCR   │  │              │
                    │                     │  │          │  │              │
                    └──────┬──────────────┘  └────┬─────┘  └──────┬───────┘
                           │                      │               │
                           │                      │               │
            ┌──────────────┼──────────────────────┼───────────────┼──────┐
            │              │                      │               │      │
            ▼              ▼                      ▼               ▼      ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐  ┌─────────────┐
│                  │  │                  │  │              │  │             │
│  🔐 AMAZON      │  │  🗄️ AMAZON RDS   │  │  📦 AMAZON  │  │  📧 AMAZON │
│  COGNITO        │  │  PostgreSQL      │  │  S3         │  │  SES (Email)│
│  User Pool       │  │  • profiles      │  │  Storage    │  │  • Send     │
│                  │  │  • settings      │  │  • Images   │  │    emails   │
│  • Sign up       │  │  • history       │  │  • Reports  │  │  • Verify   │
│  • Sign in       │  │  • analyses      │  │  • PDFs     │  │  • Notify   │
│  • MFA           │  │  • appointments  │  │  • Assets   │  │             │
│  • Password      │  │  • medications   │  │             │  │             │
│    reset         │  │  • orders        │  │  Buckets:   │  │             │
│  • Email verify  │  │                  │  │  dermasense-│  │             │
│  • Social login  │  │  Multi-AZ        │  │   storage   │  │             │
│                  │  │  Encrypted       │  │             │  │             │
│  50K MAU FREE!   │  │  Automated       │  │  Encryption │  │             │
│                  │  │   backups        │  │  Versioning │  │             │
│                  │  │                  │  │             │  │             │
└──────────────────┘  └──────────────────┘  └──────────────┘  └─────────────┘
                                │
                                │
                                ▼
                    ┌──────────────────────┐
                    │                      │
                    │  📊 AMAZON          │
                    │  CLOUDWATCH          │
                    │  Monitoring          │
                    │  • Logs             │
                    │  • Metrics          │
                    │  • Alarms           │
                    │  • Dashboards       │
                    │                      │
                    └──────────────────────┘
                                │
                                │
                                ▼
                    ┌──────────────────────┐
                    │                      │
                    │  🔔 AMAZON SNS      │
                    │  Notifications       │
                    │  • Email alerts     │
                    │  • SMS alerts       │
                    │  • Push notifications│
                    │                      │
                    └──────────────────────┘
```

---

## Detailed Component Breakdown

### 1. Frontend Layer

```
┌─────────────────────────────────────────┐
│         FRONTEND (Next.js 15)           │
├─────────────────────────────────────────┤
│  Pages:                                 │
│  • /                  → Landing page    │
│  • /login             → Authentication  │
│  • /register          → Sign up         │
│  • /dashboard         → Main dashboard  │
│  • /dashboard/analysis → ML predictions │
│  • /dashboard/appointments → Bookings   │
│  • /dashboard/shop    → E-commerce      │
│  • /dashboard/profile → User settings   │
│                                         │
│  Hosted on:                             │
│  • AWS Amplify (Option 1)               │
│  • Vercel (Option 2 - Recommended)      │
│                                         │
│  Features:                              │
│  • SSR (Server-Side Rendering)          │
│  • SSG (Static Site Generation)         │
│  • ISR (Incremental Static Regeneration)│
│  • Image Optimization                   │
│  • Automatic HTTPS                      │
│  • CI/CD from GitHub                    │
└─────────────────────────────────────────┘
```

### 2. Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                          │
└─────────────────────────────────────────────────────────────────┘

User Registration:
1. User fills form → POST /api/auth/register
2. Lambda validates data
3. Cognito creates user (with temp password)
4. Cognito sends verification email
5. User clicks link → Email verified
6. Lambda creates profile in RDS
7. Return success to frontend

User Login:
1. User enters email/password → POST /api/auth/login
2. Lambda calls Cognito authenticate
3. Cognito validates credentials
4. Returns JWT tokens (access, ID, refresh)
5. Lambda stores session
6. Frontend stores tokens in cookies
7. Redirect to dashboard

Protected Routes:
1. Frontend checks for access token
2. If expired, use refresh token
3. If no token, redirect to login
4. API calls include token in Authorization header
5. Lambda validates JWT with Cognito
6. If valid, proceed; else return 401

Password Reset:
1. User clicks "Forgot password"
2. POST /api/auth/forgot-password
3. Cognito sends reset code via email
4. User enters code + new password
5. Cognito updates password
6. User can login with new password
```

### 3. Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    DATA FLOW FOR SKIN ANALYSIS                  │
└─────────────────────────────────────────────────────────────────┘

1. USER UPLOADS IMAGE
   Frontend → Browser
   │
   ▼
2. UPLOAD TO S3
   Lambda receives image → Validates → Uploads to S3
   Location: s3://dermasense-storage/analysis-images/{userId}/{timestamp}.jpg
   │
   ▼
3. ML PREDICTION
   Lambda triggers ML Lambda with S3 URL
   │
   ▼
4. TENSORFLOW MODEL PROCESSING
   • Download image from S3
   • Preprocess (resize, normalize)
   • Run CNN model prediction
   • Generate heatmap
   • Upload heatmap to S3
   │
   ▼
5. SAVE RESULTS
   • Insert into RDS: skin_analyses table
   • Insert into RDS: medical_history table
   • Create analysis record with:
     - prediction_class (mel, bcc, etc.)
     - confidence_score (85.5%)
     - risk_level (High, Medium, Low)
     - image_url (S3)
     - heatmap_url (S3)
   │
   ▼
6. RETURN TO FRONTEND
   Response: {
     id: "uuid",
     prediction: "Melanoma",
     confidence: 85.5,
     risk: "High",
     recommendations: [...],
     imageUrl: "https://s3.../image.jpg",
     heatmapUrl: "https://s3.../heatmap.jpg"
   }
   │
   ▼
7. DISPLAY RESULTS
   Frontend shows:
   • Prediction with emoji
   • Confidence score
   • Risk level (color-coded)
   • Recommendations
   • Option to book appointment
```

### 4. Database Schema Visual

```
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE RELATIONSHIPS                       │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│   COGNITO        │
│   User Pool      │
└────────┬─────────┘
         │ 1:1
         ▼
┌──────────────────┐         ┌──────────────────┐
│   profiles       │ 1:1     │  user_settings   │
│  ──────────────  │◄────────│  ──────────────  │
│  id (PK)         │         │  id (FK,PK)      │
│  cognito_user_id │         │  theme           │
│  email           │         │  language        │
│  full_name       │         │  notifications   │
│  date_of_birth   │         │  ...             │
│  gender          │         └──────────────────┘
│  contact_number  │
│  address         │
│  avatar_url (S3) │
│  ...             │
└────────┬─────────┘
         │ 1:N
         ├─────────────────────┬──────────────┬──────────────┐
         │                     │              │              │
         ▼                     ▼              ▼              ▼
┌─────────────────┐   ┌────────────────┐ ┌──────────┐ ┌──────────┐
│medical_history  │   │ skin_analyses  │ │appointments│ │medications│
│  ─────────────  │   │  ────────────  │ │ ────────  │ │ ──────── │
│  id (PK)        │   │  id (PK)       │ │ id (PK)  │ │ id (PK)  │
│  user_id (FK)   │   │  user_id (FK)  │ │user_id(FK)│ │user_id(FK)│
│  type           │   │  image_url(S3) │ │doctor_id │ │medication│
│  data           │   │  prediction    │ │date      │ │dosage    │
│  details (JSON) │   │  confidence    │ │time      │ │frequency │
│  created_at     │   │  risk_level    │ │status    │ │start_date│
└─────────────────┘   │  heatmap(S3)   │ │meeting_  │ │end_date  │
                       │  created_at    │ │  link    │ │reminders │
                       └────────────────┘ │amount    │ └──────────┘
                                          │payment   │
         │                                └──────────┘      │
         │ 1:N                                              │ 1:N
         ▼                                                  ▼
┌─────────────────┐                              ┌──────────────────┐
│     orders      │                              │   audit_logs     │
│  ─────────────  │                              │  ──────────────  │
│  id (PK)        │                              │  id (PK)         │
│  order_number   │                              │  user_id (FK)    │
│  user_id (FK)   │                              │  action          │
│  items (JSON)   │                              │  resource_type   │
│  total_amount   │                              │  resource_id     │
│  payment_status │                              │  details (JSON)  │
│  order_status   │                              │  ip_address      │
│  delivery_addr  │                              │  created_at      │
│  tracking_no    │                              └──────────────────┘
└─────────────────┘
```

### 5. Security Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                              │
└─────────────────────────────────────────────────────────────────┘

Layer 1: Network Security
├─ VPC (Virtual Private Cloud)
│  ├─ Public Subnets (Lambda, API Gateway)
│  └─ Private Subnets (RDS)
├─ Security Groups
│  ├─ Lambda SG: Outbound to RDS, S3, Internet
│  ├─ RDS SG: Inbound from Lambda SG only (port 5432)
│  └─ No direct internet access to RDS

Layer 2: Authentication & Authorization
├─ Cognito User Pool
│  ├─ Password policy (min 8 chars, complexity)
│  ├─ MFA (optional, SMS or authenticator app)
│  ├─ Account lockout after failed attempts
│  └─ Email verification required
├─ JWT Tokens
│  ├─ Access token (1 hour expiry)
│  ├─ ID token (user info)
│  └─ Refresh token (7 days)

Layer 3: Data Security
├─ Encryption at Rest
│  ├─ RDS: AES-256 encryption
│  ├─ S3: SSE-S3 encryption
│  └─ Lambda: environment variables encrypted with KMS
├─ Encryption in Transit
│  ├─ HTTPS only (TLS 1.2+)
│  ├─ RDS connections use SSL
│  └─ S3 signed URLs with expiry

Layer 4: Access Control
├─ IAM Roles & Policies
│  ├─ Principle of least privilege
│  ├─ Lambda execution role (minimal permissions)
│  ├─ S3 bucket policy (private by default)
│  └─ RDS: Database user with limited grants
├─ API Gateway
│  ├─ Rate limiting (1000 req/sec)
│  ├─ Request validation
│  └─ CORS restrictions

Layer 5: Monitoring & Compliance
├─ CloudWatch Logs
│  ├─ All Lambda invocations logged
│  ├─ API Gateway access logs
│  └─ RDS slow query logs
├─ CloudTrail
│  ├─ Audit all API calls
│  └─ Compliance reporting
├─ GuardDuty (optional)
│  └─ Threat detection

Layer 6: Application Security
├─ Input Validation
│  ├─ Zod schemas in frontend
│  ├─ Pydantic models in backend
│  └─ Database constraints
├─ SQL Injection Prevention
│  ├─ Parameterized queries only
│  └─ No string concatenation
├─ XSS Prevention
│  ├─ React auto-escaping
│  └─ Content Security Policy headers
```

---

## Cost Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    COST ATTRIBUTION                             │
└─────────────────────────────────────────────────────────────────┘

Monthly Costs (After Free Tier):

┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  RDS PostgreSQL              $17.00  ████████████████████ 65%  │
│  CloudFront CDN              $6.00   ███████ 23%               │
│  Amplify Hosting             $3.00   ███ 12%                   │
│  S3 Storage                  $0.50   ▌1%                       │
│  Lambda                      $0.00   FREE                      │
│  API Gateway                 $0.00   FREE                      │
│  Cognito                     $0.00   FREE FOREVER              │
│                                                                 │
│  TOTAL:                     $26.50                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Cost Optimization:
- Use auto-stop for RDS (saves 50%) → $13/month total
- Use Vercel instead of Amplify (free) → $20/month total
- Skip CloudFront (use Vercel CDN) → $14/month total

Optimized Total: $12-15/month
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    CI/CD PIPELINE                               │
└─────────────────────────────────────────────────────────────────┘

GitHub Repository
       │
       │ Git push to main branch
       │
       ▼
┌─────────────────────┐
│  GitHub Actions     │  OR  ┌──────────────────┐
│  (Optional)         │      │ AWS CodePipeline │
│  • Run tests        │      │  (Optional)      │
│  • Build app        │      └──────────────────┘
│  • Deploy Lambda    │
└──────────┬──────────┘
           │
           ├────────────────────────────┬───────────────────┐
           │                            │                   │
           ▼                            ▼                   ▼
  ┌────────────────┐        ┌──────────────────┐  ┌─────────────┐
  │ AWS Lambda     │        │  AWS Amplify     │  │   Vercel    │
  │ • Auto deploy  │        │  • Auto build    │  │ • Auto build│
  │ • Version      │        │  • Auto deploy   │  │ • Auto deploy│
  │ • Aliases      │        │  • Previews      │  │ • Previews  │
  └────────────────┘        └──────────────────┘  └─────────────┘

Deployment Stages:
1. Development → dev branch → dev.dermasense.com
2. Staging → staging branch → staging.dermasense.com
3. Production → main branch → dermasense.com
```

---

## Monitoring Dashboard Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                 CLOUDWATCH DASHBOARD                            │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────┬──────────────────────────┐
│    Lambda Invocations    │    API Gateway Requests  │
│    ▄▄▄▄▄▄▄▄▄▄▄▄         │    ▄▄▄▄▄▄▄▄▄▄▄▄         │
│   ▐██████████████▌       │   ▐██████████████▌       │
│    1,234 req/min         │    2,345 req/min         │
└──────────────────────────┴──────────────────────────┘

┌──────────────────────────┬──────────────────────────┐
│    RDS CPU Utilization   │    RDS Connections       │
│    ▄▄▄▄▄▄▄▄▄▄▄▄         │    ▄▄▄▄▄▄▄▄▄▄▄▄         │
│   ▐██████░░░░░░░▌ 35%   │   ▐████░░░░░░░░▌ 12/100  │
└──────────────────────────┴──────────────────────────┘

┌──────────────────────────┬──────────────────────────┐
│    Lambda Errors         │    Cognito Sign-ups      │
│    ▄▄▄▄▄▄▄▄▄▄▄▄         │    ▄▄▄▄▄▄▄▄▄▄▄▄         │
│   ▐██░░░░░░░░░░▌ 2 err  │   ▐██████████████▌ 45/day│
└──────────────────────────┴──────────────────────────┘

┌──────────────────────────────────────────────────────┐
│    Alarms Status                                     │
│    ✅ Lambda Duration < 30s                          │
│    ✅ RDS Storage > 2GB                              │
│    ✅ API Gateway 5XX < 1%                           │
│    ⚠️  Billing Alert: $18/month (threshold: $25)    │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│    Recent Logs (Last 10 minutes)                     │
│    [INFO] User login successful                      │
│    [INFO] Image uploaded to S3                       │
│    [INFO] ML prediction: Melanoma (85% confidence)   │
│    [WARN] Database connection slow (2.5s)            │
│    [INFO] Appointment booked                         │
└──────────────────────────────────────────────────────┘
```

---

## Disaster Recovery Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                 BACKUP & RECOVERY STRATEGY                      │
└─────────────────────────────────────────────────────────────────┘

RDS Database:
├─ Automated backups (daily)
│  ├─ Retention: 7 days
│  └─ Restore point: any time within retention
├─ Manual snapshots (weekly)
│  ├─ Retention: 90 days
│  └─ Before major deployments
└─ Point-in-time recovery
   └─ Rollback to any second within last 7 days

S3 Storage:
├─ Versioning enabled
│  └─ Recover deleted/overwritten files
├─ Cross-region replication (optional)
│  └─ Replicate to different AWS region
└─ Lifecycle policies
   └─ Archive old files to Glacier (cheaper)

Lambda Functions:
├─ Version control in GitHub
├─ Lambda versions and aliases
└─ Rollback with one click

Recovery Time Objectives (RTO):
├─ Frontend (Amplify/Vercel): < 5 minutes
├─ Lambda functions: < 10 minutes
├─ RDS Database: < 30 minutes
└─ Complete system: < 1 hour

Recovery Point Objectives (RPO):
├─ Database: < 5 minutes (point-in-time)
├─ Files (S3): 0 (versioning)
└─ Code: 0 (git)
```

---

## Scaling Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                    SCALING ROADMAP                              │
└─────────────────────────────────────────────────────────────────┘

Phase 1: 0 - 1,000 users (Current)
├─ Single RDS instance (db.t3.micro)
├─ Lambda (auto-scales)
├─ Single region
└─ Cost: $0 (free tier) → $25/month

Phase 2: 1,000 - 10,000 users
├─ RDS: db.t3.small (2 vCPU, 2GB RAM)
├─ ElastiCache Redis (session management)
├─ CloudFront CDN (global delivery)
├─ Lambda: Provisioned concurrency
└─ Cost: ~$85/month

Phase 3: 10,000 - 100,000 users
├─ RDS: db.t3.medium + Read Replica
├─ Aurora Serverless v2 (migration)
├─ Multiple Lambda functions (microservices)
├─ SQS for async processing
├─ SNS for notifications
└─ Cost: ~$300-500/month

Phase 4: 100,000+ users
├─ Aurora Global Database
├─ Multi-region deployment
├─ DynamoDB for sessions
├─ Step Functions for workflows
├─ SageMaker for ML inference
└─ Cost: $1,000-2,000/month

Auto-Scaling Triggers:
├─ Lambda: Concurrent requests
├─ RDS: CPU > 70% → upgrade instance
├─ ElastiCache: Memory > 80%
└─ API Gateway: Automatic
```

---

## Technology Stack Summary

```
┌─────────────────────────────────────────────────────────────────┐
│                 COMPLETE TECH STACK                             │
└─────────────────────────────────────────────────────────────────┘

Frontend:
├─ Framework: Next.js 15.1.7
├─ Language: TypeScript 5.0+
├─ Styling: Tailwind CSS 3.4
├─ UI Library: Shadcn/ui
├─ State: React Context API
├─ Forms: React Hook Form + Zod
├─ HTTP Client: Fetch API
└─ Hosting: AWS Amplify / Vercel

Backend:
├─ API Framework: FastAPI 0.115
├─ Language: Python 3.11
├─ Runtime: AWS Lambda (Python 3.11)
├─ API: AWS API Gateway (HTTP API)
└─ Authentication: AWS Cognito

Database:
├─ Database: PostgreSQL 15.x
├─ Hosting: AWS RDS
├─ ORM: Raw SQL / psycopg2
└─ Schema: See database/schema.sql

Machine Learning:
├─ Framework: TensorFlow 2.13
├─ Model: CNN (Convolutional Neural Network)
├─ Image Processing: OpenCV, PIL
├─ Runtime: AWS Lambda (Container)
└─ Model Format: .h5 (Keras)

Storage:
├─ Object Storage: AWS S3
├─ CDN: AWS CloudFront
└─ Buckets: dermasense-storage

DevOps:
├─ Version Control: Git / GitHub
├─ CI/CD: GitHub Actions / AWS CodePipeline
├─ Monitoring: AWS CloudWatch
├─ Logging: CloudWatch Logs
├─ Alerting: CloudWatch Alarms + SNS
└─ IaC: AWS Console (manual) → Terraform (future)

Security:
├─ Auth: AWS Cognito + JWT
├─ Encryption: AES-256 (RDS, S3)
├─ SSL/TLS: AWS Certificate Manager
├─ Secrets: Environment Variables / Parameter Store
└─ Audit: AWS CloudTrail
```

---

## Quick Reference

```
┌─────────────────────────────────────────────────────────────────┐
│                 SERVICE ENDPOINTS                               │
└─────────────────────────────────────────────────────────────────┘

Production:
├─ Frontend: https://dermasense.com
├─ API: https://xxx.execute-api.region.amazonaws.com/prod
├─ Cognito: https://dermasense-ai.auth.region.amazoncognito.com
├─ RDS: dermasense-db.xxx.region.rds.amazonaws.com:5432
└─ S3: https://dermasense-storage.s3.region.amazonaws.com

Development:
├─ Frontend: http://localhost:3000
├─ API: http://localhost:8000
└─ RDS: localhost:5432 (port forward) or dev RDS endpoint

AWS Console Links:
├─ Cognito: console.aws.amazon.com/cognito
├─ RDS: console.aws.amazon.com/rds
├─ S3: console.aws.amazon.com/s3
├─ Lambda: console.aws.amazon.com/lambda
├─ API Gateway: console.aws.amazon.com/apigateway
├─ CloudWatch: console.aws.amazon.com/cloudwatch
└─ Billing: console.aws.amazon.com/billing
```

---

**This architecture is designed for**:
- ✅ High availability (99.9%+ uptime)
- ✅ Scalability (0 to 100K+ users)
- ✅ Security (enterprise-grade)
- ✅ Cost-effectiveness (free tier → $25/month)
- ✅ Global reach (CloudFront CDN)
- ✅ Easy maintenance (serverless)

**Last Updated**: March 2026  
**Version**: 1.0
