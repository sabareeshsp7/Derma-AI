# 🚀 Complete AWS Migration Plan for DermaSense AI
### From Supabase to AWS - Comprehensive Beginner's Guide

---

## 📋 Table of Contents
1. [Current Architecture Analysis](#current-architecture)
2. [AWS Services Mapping](#aws-services-mapping)
3. [AWS Account Setup (Step-by-Step)](#aws-account-setup)
4. [Phase 1: Database Migration](#phase-1-database)
5. [Phase 2: Authentication Migration](#phase-2-authentication)
6. [Phase 3: Storage Setup](#phase-3-storage)
7. [Phase 4: Backend API Deployment](#phase-4-backend-api)
8. [Phase 5: Frontend Deployment](#phase-5-frontend)
9. [Phase 6: Code Changes](#phase-6-code-changes)
10. [Free Tier Optimization](#free-tier-optimization)
11. [Cost Estimation](#cost-estimation)
12. [Security Best Practices](#security)
13. [Monitoring Setup](#monitoring)

---

## 🔍 Current Architecture Analysis

### What You're Currently Using (Supabase):
- **Database**: PostgreSQL (3 tables: profiles, user_settings, medical_history)
- **Authentication**: Supabase Auth (Email/Password)
- **Storage**: Not actively used yet
- **API**: FastAPI (Python) - Currently separate
- **Frontend**: Next.js 15.1.7 with TypeScript
- **ML Model**: TensorFlow model (carcinoma_model.h5)

### Database Tables Identified:
```typescript
1. profiles: user information (id, full_name, avatar_url, date_of_birth, gender, contact_number, address, bio)
2. user_settings: app preferences (theme, language, notifications, measurement_unit)
3. medical_history: health records (user_id, type, data, details, created_at)
```

---

## 🎯 AWS Services Mapping

| Current (Supabase) | AWS Service | Purpose | Free Tier |
|-------------------|-------------|---------|-----------|
| PostgreSQL Database | **Amazon RDS PostgreSQL** or **Aurora Serverless v2** | Database hosting | RDS: 750 hrs/month (12 months) |
| Supabase Auth | **Amazon Cognito** | User authentication | 50,000 MAUs free forever |
| Storage (future) | **Amazon S3** | File storage (images, reports) | 5GB free, 20,000 GET requests |
| FastAPI Backend | **AWS Lambda + API Gateway** | Serverless API | 1M requests/month free |
| Next.js Frontend | **AWS Amplify** or **Vercel** | Frontend hosting | Amplify: 1000 build mins/month |
| ML Model | **AWS Lambda** (with EFS) | ML inference | Included in Lambda free tier |
| Environment Variables | **AWS Systems Manager (Parameter Store)** | Secrets management | 10,000 API calls/month |

**Recommended Stack for Free Tier:**
- **Database**: Aurora Serverless v2 (Pay per use, cheaper for small apps)
- **Auth**: Amazon Cognito
- **Storage**: Amazon S3
- **Backend**: AWS Lambda + API Gateway
- **Frontend**: AWS Amplify (or keep Vercel)
- **CDN**: CloudFront (50GB free/month)

---

## 🆕 AWS Account Setup (Complete Beginner Guide)

### Step 1: Create AWS Account

#### 1.1 Sign Up Process
```
1. Go to: https://aws.amazon.com/
2. Click "Create an AWS Account" (top right)
3. Fill in:
   - Email address (use a real one you have access to)
   - AWS account name (e.g., "DermaSense-Production")
   - Password (strong password, save it!)
   
4. Choose Account Type: 
   - Select "Personal" (for individual/startup)
   - Enter full name, phone number, address
   
5. Payment Information:
   ⚠️ IMPORTANT: Credit/Debit card required (for identity verification)
   - You won't be charged if you stay within free tier
   - Set up billing alerts (covered in Step 2)
   
6. Identity Verification:
   - Phone verification (receive SMS/call)
   - Enter verification code
   
7. Select Support Plan:
   - Choose "Basic Support - Free" (sufficient for free tier)
   
8. Wait for account activation (usually 2-5 minutes)
9. Check email for confirmation
```

#### 1.2 Initial Security Setup (CRITICAL!)
```
After account creation, IMMEDIATELY:

1. Enable MFA (Multi-Factor Authentication):
   - Go to IAM Console: https://console.aws.amazon.com/iam/
   - Click "Add MFA" for root user
   - Use Google Authenticator or Authy app
   - Scan QR code and enter two consecutive codes
   
2. Create IAM Admin User (Never use root account):
   - IAM Console → Users → Add Users
   - Username: "admin" or your name
   - Access: "AWS Management Console access"
   - Password: Create strong password
   - Attach policy: "AdministratorAccess"
   - Download credentials
   - Sign out and sign in with new IAM user
```

### Step 2: Set Up Billing Alerts (Avoid Unexpected Charges!)

```
🚨 DO THIS FIRST - Protect yourself from unexpected bills!

1. Go to Billing Console:
   https://console.aws.amazon.com/billing/home

2. Enable Billing Alerts:
   - Click "Billing Preferences" (left menu)
   - Check "Receive Billing Alerts"
   - Check "Receive Free Tier Usage Alerts"
   - Enter your email
   - Save preferences

3. Create Budget Alert:
   - Go to "Budgets" → "Create budget"
   - Choose "Cost budget"
   - Set amount: $5 USD (or your comfort level)
   - Alert threshold: 80% ($4)
   - Email notification: your email
   - Create budget

4. Set up CloudWatch Billing Alarm:
   - Go to CloudWatch Console
   - Create Alarm → Billing → Total Estimated Charge
   - Threshold: > $5
   - Create SNS topic for notification
   - Confirm email subscription
```

### Step 3: Choose AWS Region

**Best Regions for Free Tier (Choose closest to your users):**
```
For India: ap-south-1 (Mumbai)
For US East Coast: us-east-1 (N. Virginia) - Most services, best for beginners
For US West Coast: us-west-2 (Oregon)
For Europe: eu-west-1 (Ireland)
For Southeast Asia: ap-southeast-1 (Singapore)

⚠️ Note: Always use the SAME region for all services to avoid data transfer charges!
```

**Set Default Region:**
- Top right of AWS Console → Select your region
- Remember this for all configurations!

---

## 📦 Phase 1: Database Migration to AWS RDS

### Option A: Amazon RDS PostgreSQL (Recommended for Beginners)

#### Step 1.1: Create RDS PostgreSQL Instance

```bash
🎯 Goal: Create a PostgreSQL database similar to Supabase

1. Open RDS Console:
   https://console.aws.amazon.com/rds/

2. Click "Create database"

3. Configuration:
   Engine type: PostgreSQL
   Version: PostgreSQL 15.x (latest stable)
   
4. Templates:
   ⚠️ SELECT: "Free tier" (This ensures you stay within free limits)
   
5. Settings:
   DB instance identifier: dermasense-db
   Master username: postgres
   Master password: [Create strong password, SAVE IT!]
   
6. Instance configuration:
   ✅ Should be auto-selected: db.t3.micro (Free tier eligible)
   
7. Storage:
   Storage type: General Purpose SSD (gp2)
   Allocated storage: 20 GiB (Free tier: up to 20GB)
   ❌ UNCHECK: "Enable storage autoscaling" (to avoid charges)
   
8. Connectivity:
   VPC: Default VPC
   Public access: YES (to access from your app)
   VPC security group: Create new
   Security group name: dermasense-db-sg
   
9. Database authentication:
   ✅ Password authentication (simplest)
   
10. Additional configuration:
    Initial database name: dermasense_db
    ❌ UNCHECK: "Enable automated backups" (saves storage for free tier)
    ❌ UNCHECK: "Enable Enhanced monitoring"
    
11. Encryption:
    ✅ Keep encryption enabled (free, secure)
    
12. Click "Create database"
    ⏱️ Wait 5-10 minutes for creation
```

#### Step 1.2: Configure Security Group

```bash
After DB is created:

1. Go to RDS Console → Databases → dermasense-db
2. Click on VPC security group (link under "Security")
3. Edit "Inbound rules":
   
   Rule 1 (For development):
   Type: PostgreSQL
   Port: 5432
   Source: My IP (auto-detects your current IP)
   Description: My development machine
   
   Rule 2 (For Lambda functions - add later):
   Type: PostgreSQL
   Port: 5432
   Source: [Lambda security group ID]
   Description: Lambda functions access
   
4. Click "Save rules"
```

#### Step 1.3: Get Database Connection Details

```bash
In RDS Console → Databases → dermasense-db:

📋 SAVE THESE DETAILS (you'll need them):

1. Endpoint: dermasense-db.xxxxxxxxx.ap-south-1.rds.amazonaws.com
2. Port: 5432
3. Database name: dermasense_db
4. Username: postgres
5. Password: [the one you created]

Connection String Format:
postgresql://postgres:[PASSWORD]@[ENDPOINT]:5432/dermasense_db
```

#### Step 1.4: Create Database Schema

**Option 1: Using pgAdmin (Recommended for beginners)**
```bash
1. Download pgAdmin: https://www.pgadmin.org/download/
2. Install and open pgAdmin
3. Right-click "Servers" → Register → Server
4. General tab:
   Name: DermaSense AWS
5. Connection tab:
   Host: [Your RDS Endpoint]
   Port: 5432
   Database: dermasense_db
   Username: postgres
   Password: [Your password]
   Save password: Yes
6. Click "Save"
7. Right-click on database → Query Tool
8. Copy and paste the schema SQL (below)
9. Click Execute (play button)
```

**Option 2: Using psql Command Line**
```bash
# Install PostgreSQL client (if not installed)
# Windows: Download from postgresql.org
# Mac: brew install postgresql
# Linux: sudo apt-get install postgresql-client

# Connect to database
psql -h dermasense-db.xxxxxxxxx.ap-south-1.rds.amazonaws.com \
     -U postgres \
     -d dermasense_db

# Enter password when prompted
```

**Database Schema SQL:**
```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255),
    avatar_url TEXT,
    date_of_birth DATE,
    gender VARCHAR(50),
    contact_number VARCHAR(20),
    address TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create user_settings table
CREATE TABLE user_settings (
    id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    theme VARCHAR(50) DEFAULT 'light',
    language VARCHAR(10) DEFAULT 'en',
    notifications_enabled BOOLEAN DEFAULT true,
    email_notifications BOOLEAN DEFAULT true,
    measurement_unit VARCHAR(20) DEFAULT 'metric',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create medical_history table
CREATE TABLE medical_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('Appointment', 'Medicine', 'Analysis')),
    data TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_medical_history_user_id ON medical_history(user_id);
CREATE INDEX idx_medical_history_created_at ON medical_history(created_at DESC);
CREATE INDEX idx_medical_history_type ON medical_history(type);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions (if needed for additional users)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
```

#### Step 1.5: Export Data from Supabase (If you have existing data)

```bash
If you have existing data in Supabase:

1. Go to Supabase Dashboard
2. Go to SQL Editor
3. Run this query for each table:

-- Export profiles
COPY profiles TO STDOUT WITH CSV HEADER;

-- Export user_settings
COPY user_settings TO STDOUT WITH CSV HEADER;

-- Export medical_history
COPY medical_history TO STDOUT WITH CSV HEADER;

4. Save each as CSV file
5. Use pgAdmin to import:
   - Right-click table → Import/Export
   - Select CSV file
   - Map columns
   - Click "OK"
```

### Option B: Aurora Serverless v2 (Cost-effective for variable load)

```bash
⚠️ Note: Aurora Serverless v2 is NOT in the free tier, but costs less for 
small/variable workloads. Start with RDS free tier first!

If you later want to migrate to Aurora:
- Same steps as RDS
- Choose "Amazon Aurora" as engine
- Select "Serverless v2" under capacity type
- Minimum ACUs: 0.5 (very low cost when idle)
```

---

## 🔐 Phase 2: Authentication Migration to AWS Cognito

### Step 2.1: Create Cognito User Pool

```bash
1. Open Cognito Console:
   https://console.aws.amazon.com/cognito/

2. Click "Create user pool"

3. Step 1: Configure sign-in experience
   - Cognito user pool sign-in options:
     ✅ Email
     ❌ Phone number (optional, costs extra)
     ❌ Username
   - User name requirements:
     ✅ Keep defaults
   - Click "Next"

4. Step 2: Configure security requirements
   - Password policy:
     Mode: Cognito defaults (or customize if needed)
   - Multi-factor authentication:
     ✅ Optional MFA (recommended)
     MFA methods: Authenticator apps
   - User account recovery:
     ✅ Enable self-service account recovery
     ✅ Email only
   - Click "Next"

5. Step 3: Configure sign-up experience
   - Self-service sign-up:
     ✅ Enable self-registration
   - Attribute verification:
     ✅ Allow Cognito to automatically send messages to verify
     ✅ Email (required)
   - Required attributes:
     ✅ email
     ✅ name (for full_name)
   - Custom attributes (click "Add custom attribute"):
     Name: date_of_birth, Type: String
     Name: gender, Type: String
     Name: contact_number, Type: String
   - Click "Next"

6. Step 4: Configure message delivery
   - Email provider:
     ✅ Send email with Cognito (Free tier: 50,000 emails/month)
     (Later upgrade to SES for more volume)
   - From email address: Keep default or use verified
   - Click "Next"

7. Step 5: Integrate your app
   - User pool name: dermasense-users
   - Hosted authentication pages:
     ✅ Use Cognito Hosted UI (optional, easier for testing)
   - Domain:
     Type: Cognito domain
     Domain prefix: dermasense-ai (must be unique)
   
   - Initial app client:
     App client name: dermasense-web
     Client secret: Don't generate (for public web apps)
   - Allowed callback URLs:
     http://localhost:3000/api/auth/callback/cognito
     https://yourdomain.com/api/auth/callback/cognito
   - Allowed sign-out URLs:
     http://localhost:3000
     https://yourdomain.com
   - Click "Next"

8. Step 6: Review and create
   - Review all settings
   - Click "Create user pool"

9. SAVE THESE DETAILS:
   📋 After creation, go to "App integration" tab:
   - User Pool ID: ap-south-1_xxxxxxxxx
   - Client ID: xxxxxxxxxxxxxxxxxxxx
   - Cognito Domain: https://dermasense-ai.auth.region.amazoncognito.com
```

### Step 2.2: Configure Cognito Triggers (Optional - for custom logic)

```bash
If you need to populate profiles table on user registration:

1. In Cognito User Pool → User pool properties → Lambda triggers
2. You can add triggers for:
   - Pre sign-up: Validation
   - Post confirmation: Create profile in RDS
   - (We'll create this Lambda in Phase 4)
```

---

## 📁 Phase 3: Storage Setup (Amazon S3)

### Step 3.1: Create S3 Bucket

```bash
1. Open S3 Console:
   https://console.aws.amazon.com/s3/

2. Click "Create bucket"

3. Bucket settings:
   Bucket name: dermasense-storage (must be globally unique)
   AWS Region: [Same as RDS - ap-south-1]
   
4. Object Ownership:
   ✅ ACLs disabled (recommended)
   
5. Block Public Access:
   ✅ Block all public access (we'll use signed URLs)
   
6. Bucket Versioning:
   ❌ Disable (to save storage)
   
7. Default encryption:
   ✅ Enable
   Encryption type: SSE-S3 (free)
   
8. Click "Create bucket"
```

### Step 3.2: Create Folder Structure

```bash
In your S3 bucket, create folders:

dermasense-storage/
├── avatars/           # User profile pictures
├── analysis-images/   # Skin lesion images for analysis
├── reports/           # Generated PDF reports
├── prescriptions/     # Prescription documents
└── medical-records/   # Other medical documents
```

### Step 3.3: Configure CORS

```bash
1. Click on bucket name → Permissions tab
2. Scroll to "Cross-origin resource sharing (CORS)"
3. Click "Edit"
4. Paste this JSON:
```

```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
        "AllowedOrigins": [
            "http://localhost:3000",
            "https://yourdomain.com"
        ],
        "ExposeHeaders": ["ETag"],
        "MaxAgeSeconds": 3000
    }
]
```

```bash
5. Click "Save changes"
```

### Step 3.4: Create IAM User for S3 Access

```bash
1. Go to IAM Console → Users → Create user
   User name: s3-upload-user
   
2. Permissions:
   Attach policies directly
   Create inline policy:
```

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:DeleteObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::dermasense-storage/*",
                "arn:aws:s3:::dermasense-storage"
            ]
        }
    ]
}
```

```bash
3. Create user
4. Security credentials → Create access key
5. Use case: Application running outside AWS
6. SAVE THESE (you can't see them again):
   📋 Access Key ID: AKIAXXXXXXXXXXXXXXXX
   📋 Secret Access Key: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## ⚙️ Phase 4: Backend API Deployment (FastAPI on AWS Lambda)

### Step 4.1: Prepare FastAPI for Lambda

Create new file: **`api/lambda_handler.py`**

```python
from mangum import Mangum
from main import app

# Lambda handler
handler = Mangum(app)
```

Update **`api/requirements.txt`**:

```txt
fastapi==0.115.12
uvicorn==0.34.2
python-multipart==0.0.20
tensorflow==2.13.0
numpy==1.24.3
opencv-python-headless==4.8.0.74
pillow==10.0.0
boto3==1.28.0
psycopg2-binary==2.9.9
mangum==0.17.0
pydantic==2.0.0
python-jose[cryptography]==3.3.0
```

### Step 4.2: Create Lambda Layer for Dependencies

```bash
# On your local machine:

1. Create directory structure:
mkdir lambda-layer
cd lambda-layer
mkdir python

2. Install dependencies:
pip install --platform manylinux2014_x86_64 \
    --target=./python \
    --implementation cp \
    --python-version 3.11 \
    --only-binary=:all: \
    fastapi uvicorn mangum boto3 psycopg2-binary pydantic python-jose

3. ⚠️ TensorFlow is too large for Lambda layer
   # We'll use a smaller model or Lambda with Container Image (covered in 4.3)

4. Create zip file:
zip -r lambda-layer.zip python/

5. This creates: lambda-layer.zip (upload to AWS)
```

### Step 4.3: Option A - Deploy with Lambda Function (Lighter APIs)

```bash
For non-ML endpoints (auth, database operations):

1. Go to Lambda Console:
   https://console.aws.amazon.com/lambda/

2. Create function:
   - Function name: dermasense-api
   - Runtime: Python 3.11
   - Architecture: x86_64
   - Permissions: Create new role with basic Lambda permissions
   - Click "Create function"

3. Upload code:
   - Package your api/ folder (without model):
     cd api
     zip -r function.zip . -x "model/*" -x "__pycache__/*"
   
   - In Lambda console:
     Code tab → Upload from → .zip file
     Upload function.zip

4. Add Layer:
   - Layers → Add a layer
   - Create a new layer (upload lambda-layer.zip)
   - Add to function

5. Configuration:
   - General: Timeout: 30 seconds, Memory: 512 MB
   - Environment variables:
     DATABASE_URL: postgresql://postgres:[pass]@[endpoint]:5432/dermasense_db
     COGNITO_USER_POOL_ID: [your pool ID]
     AWS_S3_BUCKET: dermasense-storage
   
6. VPC Configuration (to access RDS):
   - VPC: Same as RDS
   - Subnets: Select 2+ subnets
   - Security group: Create new or select existing
   - Ensure security group allows outbound to RDS security group

7. Test function
```

### Step 4.4: Option B - Deploy ML Model with Lambda Container (For prediction API)

```bash
For ML model (too large for standard Lambda):

1. Create Dockerfile in api/:
```

```dockerfile
FROM public.ecr.aws/lambda/python:3.11

# Copy requirements and install
COPY requirements.txt ${LAMBDA_TASK_ROOT}/
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code and model
COPY main.py predict.py ${LAMBDA_TASK_ROOT}/
COPY lambda_handler.py ${LAMBDA_TASK_ROOT}/
COPY model/ ${LAMBDA_TASK_ROOT}/model/

# Set the CMD to your handler
CMD ["lambda_handler.handler"]
```

```bash
2. Build and push to Amazon ECR:

# Install AWS CLI
pip install awscli

# Configure AWS credentials
aws configure
# Enter: Access Key, Secret Key, Region, Output format (json)

# Create ECR repository
aws ecr create-repository \
    --repository-name dermasense-ml-api \
    --region ap-south-1

# Authenticate Docker to ECR
aws ecr get-login-password --region ap-south-1 | \
    docker login --username AWS --password-stdin \
    [ACCOUNT_ID].dkr.ecr.ap-south-1.amazonaws.com

# Build Docker image
cd api
docker build -t dermasense-ml-api:latest .

# Tag image
docker tag dermasense-ml-api:latest \
    [ACCOUNT_ID].dkr.ecr.ap-south-1.amazonaws.com/dermasense-ml-api:latest

# Push to ECR
docker push [ACCOUNT_ID].dkr.ecr.ap-south-1.amazonaws.com/dermasense-ml-api:latest

3. Create Lambda from container:
   - Lambda Console → Create function
   - Container image
   - Browse ECR and select your image
   - Memory: 2048 MB (for TensorFlow)
   - Timeout: 60 seconds
   - Same environment variables as above
```

### Step 4.5: Create API Gateway

```bash
1. Open API Gateway Console:
   https://console.aws.amazon.com/apigateway/

2. Create API:
   - Choose "HTTP API" (cheaper, simpler)
   - Click "Build"

3. Add integration:
   - Integration type: Lambda
   - Lambda function: dermasense-api (or dermasense-ml-api)
   - API name: dermasense-api-gateway
   - Click "Next"

4. Configure routes:
   Method: ANY
   Resource path: /{proxy+}
   Integration: [your Lambda]
   Click "Next"

5. Define stages:
   Stage name: prod
   Auto-deploy: Yes
   Click "Next"

6. Review and create

7. Get your API URL:
   📋 Invoke URL: https://xxxxxxxxxx.execute-api.ap-south-1.amazonaws.com/prod
   
   Your API endpoints:
   POST /api/predict → for ML predictions
   POST /api/auth/login → authentication
   etc.
```

### Step 4.6: Add CORS to API Gateway

```bash
1. In API Gateway Console → Your API
2. CORS → Configure
3. Add:
   Access-Control-Allow-Origin: *
   (or specific: http://localhost:3000, https://yourdomain.com)
   Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
   Access-Control-Allow-Headers: *
4. Save
```

---

## 🌐 Phase 5: Frontend Deployment (AWS Amplify)

### Step 5.1: Set Up AWS Amplify

```bash
1. Open Amplify Console:
   https://console.aws.amazon.com/amplify/

2. Get Started → Deploy
   - Connect your repository (GitHub, GitLab, Bitbucket)
   - Authorize AWS Amplify
   - Select repository: Carcino_AI
   - Branch: main

3. Build settings:
   Amplify will auto-detect Next.js
   
   Build command: npm run build
   Output directory: .next
   
   If custom needed, edit amplify.yml:
```

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

```bash
4. Environment variables:
   Click "Add environment variables":
   
   NEXT_PUBLIC_AWS_REGION: ap-south-1
   NEXT_PUBLIC_COGNITO_USER_POOL_ID: [your pool ID]
   NEXT_PUBLIC_COGNITO_CLIENT_ID: [your client ID]
   NEXT_PUBLIC_API_GATEWAY_URL: https://xxx.execute-api.region.amazonaws.com/prod
   DATABASE_URL: postgresql://postgres:pass@endpoint:5432/dermasense_db
   AWS_ACCESS_KEY_ID: [S3 user access key]
   AWS_SECRET_ACCESS_KEY: [S3 user secret]
   AWS_S3_BUCKET: dermasense-storage
   
5. Save and deploy

6. Wait for build (5-10 minutes)

7. Get your URL:
   📋 https://main.xxxxxx.amplifyapp.com
```

### Step 5.2: Set Up Custom Domain (Optional)

```bash
1. In Amplify → App settings → Domain management
2. Add domain → Use a domain you own
3. Follow DNS configuration steps
4. Wait for SSL certificate provisioning (15-30 minutes)
```

### Alternative: Deploy to Vercel (Easier, Good Free Tier)

```bash
1. Go to vercel.com → Sign up with GitHub
2. Import repository
3. Configure:
   Framework: Next.js
   Root directory: ./
   Build command: npm run build
   
4. Add environment variables (same as above)
5. Deploy

✅ Vercel is simpler for Next.js and has generous free tier!
```

---

## 💻 Phase 6: Code Changes Required

### 6.1: Database Connection Library

Create **`lib/aws-database.ts`**:

```typescript
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

export async function query(text: string, params?: any[]) {
  const start = Date.now()
  try {
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    console.log('executed query', { text, duration, rows: res.rowCount })
    return res
  } catch (error) {
    console.error('database query error', error)
    throw error
  }
}

export async function getClient() {
  const client = await pool.connect()
  return client
}

export default pool
```

Install dependency:
```bash
npm install pg
npm install --save-dev @types/pg
```

### 6.2: Replace Supabase Client

Create **`lib/aws-cognito.ts`**:

```typescript
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute,
} from 'amazon-cognito-identity-js'

const userPool = new CognitoUserPool({
  UserPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
  ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
})

export async function signUp(email: string, password: string, fullName: string) {
  const attributeList = [
    new CognitoUserAttribute({ Name: 'email', Value: email }),
    new CognitoUserAttribute({ Name: 'name', Value: fullName }),
  ]

  return new Promise((resolve, reject) => {
    userPool.signUp(email, password, attributeList, [], (err, result) => {
      if (err) {
        reject(err)
        return
      }
      resolve(result?.user)
    })
  })
}

export async function signIn(email: string, password: string) {
  const authenticationData = {
    Username: email,
    Password: password,
  }
  const authenticationDetails = new AuthenticationDetails(authenticationData)
  
  const userData = {
    Username: email,
    Pool: userPool,
  }
  const cognitoUser = new CognitoUser(userData)

  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        resolve({
          accessToken: result.getAccessToken().getJwtToken(),
          idToken: result.getIdToken().getJwtToken(),
          refreshToken: result.getRefreshToken().getToken(),
        })
      },
      onFailure: (err) => {
        reject(err)
      },
    })
  })
}

export function getCurrentUser() {
  return userPool.getCurrentUser()
}

export async function signOut() {
  const cognitoUser = userPool.getCurrentUser()
  if (cognitoUser) {
    cognitoUser.signOut()
  }
}

export { userPool }
```

Install dependency:
```bash
npm install amazon-cognito-identity-js
```

### 6.3: S3 Upload Utility

Create **`lib/aws-s3.ts`**:

```typescript
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

const BUCKET_NAME = process.env.AWS_S3_BUCKET!

export async function uploadFile(
  file: Buffer,
  key: string,
  contentType: string
) {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: contentType,
  })

  await s3Client.send(command)
  return `https://${BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${key}`
}

export async function getSignedDownloadUrl(key: string, expiresIn = 3600) {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  })

  return await getSignedUrl(s3Client, command, { expiresIn })
}

export async function uploadAvatar(userId: string, file: Buffer, mimeType: string) {
  const extension = mimeType.split('/')[1]
  const key = `avatars/${userId}.${extension}`
  return await uploadFile(file, key, mimeType)
}

export async function uploadAnalysisImage(userId: string, file: Buffer, mimeType: string) {
  const timestamp = Date.now()
  const extension = mimeType.split('/')[1]
  const key = `analysis-images/${userId}/${timestamp}.${extension}`
  return await uploadFile(file, key, mimeType)
}
```

Install dependencies:
```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

### 6.4: Update Authentication Routes

Update **`app/api/auth/login/route.ts`**:

```typescript
import { NextResponse } from "next/server"
import { signIn } from "@/lib/aws-cognito"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    const result = await signIn(email, password)

    const response = NextResponse.json(
      {
        message: "Login successful",
        user: { email },
        tokens: result,
      },
      { status: 200 }
    )

    // Set cookies
    response.cookies.set('accessToken', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600
    })

    return response
  } catch (error: unknown) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    )
  }
}
```

Update **`app/api/auth/register/route.ts`**:

```typescript
import { NextResponse } from "next/server"
import { signUp } from "@/lib/aws-cognito"
import { query } from "@/lib/aws-database"

export async function POST(request: Request) {
  try {
    const { email, password, fullName } = await request.json()

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      )
    }

    // Register in Cognito
    const cognitoUser = await signUp(email, password, fullName)

    // Create profile in database
    const userId = (cognitoUser as any).username // Cognito generates UUID
    await query(
      `INSERT INTO profiles (id, full_name) VALUES ($1, $2)`,
      [userId, fullName]
    )

    // Create default settings
    await query(
      `INSERT INTO user_settings (id) VALUES ($1)`,
      [userId]
    )

    return NextResponse.json(
      {
        message: "Registration successful. Please verify your email.",
        user: { id: userId, email, fullName },
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: error.message || "Registration failed" },
      { status: 500 }
    )
  }
}
```

### 6.5: Update Database Queries in Components

Example: Update **`lib/utils.ts`**:

```typescript
import { query } from "./aws-database"
import { getCurrentUser } from "./aws-cognito"

export async function addToMedicalHistory(
  type: "Appointment" | "Medicine" | "Analysis",
  data: string,
  details: any
) {
  const user = getCurrentUser()
  if (!user) throw new Error("Not authenticated")

  const userId = user.getUsername()

  await query(
    `INSERT INTO medical_history (user_id, type, data, details) VALUES ($1, $2, $3, $4)`,
    [userId, type, data, JSON.stringify(details)]
  )
}

export async function getMedicalHistory() {
  const user = getCurrentUser()
  if (!user) throw new Error("Not authenticated")

  const userId = user.getUsername()

  const result = await query(
    `SELECT * FROM medical_history WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId]
  )

  return result.rows
}
```

### 6.6: Update Environment Variables

Create **`.env.local`**:

```bash
# AWS Configuration
NEXT_PUBLIC_AWS_REGION=ap-south-1

# Cognito
NEXT_PUBLIC_COGNITO_USER_POOL_ID=ap-south-1_xxxxxxxxx
NEXT_PUBLIC_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxx

# Database
DATABASE_URL=postgresql://postgres:password@dermasense-db.xxx.ap-south-1.rds.amazonaws.com:5432/dermasense_db

# S3
AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AWS_S3_BUCKET=dermasense-storage

# API Gateway
NEXT_PUBLIC_API_GATEWAY_URL=https://xxx.execute-api.ap-south-1.amazonaws.com/prod

# Other
NODE_ENV=development
```

### 6.7: Update Package.json

Remove Supabase, add AWS SDKs:

```bash
# Remove
npm uninstall @supabase/supabase-js @supabase/auth-helpers-nextjs

# Add
npm install pg @types/pg amazon-cognito-identity-js @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

---

## 💰 Free Tier Optimization & Limits

### What's Included in AWS Free Tier (12 months from sign-up):

#### Compute & API:
- **Lambda**: 1 million requests/month + 400,000 GB-seconds compute
- **API Gateway**: 1 million API calls/month (HTTP APIs free beyond 12 months)

#### Database:
- **RDS**: 750 hours/month of db.t3.micro (1 vCPU, 1GB RAM)
- **Storage**: 20 GB General Purpose SSD

#### Storage:
- **S3**: 5 GB standard storage, 20,000 GET requests, 2,000 PUT requests

#### Networking:
- **CloudFront**: 50 GB data transfer out, 2,000,000 HTTP/HTTPS requests
- **Data Transfer**: 100 GB out per month (across services)

#### Auth:
- **Cognito**: 50,000 monthly active users (FREE FOREVER)

#### Monitoring:
- **CloudWatch**: 10 custom metrics, 10 alarms, 1 million API requests

### Cost Estimates After Free Tier (for small app <1000 users):

```
Monthly Cost Breakdown:

RDS db.t3.micro (running 24/7): ~$15-20/month
  OR
Aurora Serverless v2 (0.5 ACU minimum): ~$40/month but scales to 0

Lambda: ~$0-5/month (within free tier usually)

S3: ~$0-2/month (a few GB of storage)

API Gateway: $0 (HTTP APIs are free for first 1M requests)

Cognito: $0 (always free for <50K MAU)

Data Transfer: ~$0-5/month

CloudWatch Logs: ~$1-3/month

Total: $15-30/month (after free tier expires)
```

**💡 Tip**: To minimize costs:
1. Use Aurora Serverless v2 with min 0.5 ACU (scales to near-zero when idle)
2. Use Lambda for APIs (auto-scales, pay per use)
3. Set up auto-stop for RDS during non-business hours (can reduce to ~$5-10/month)

---

## 🔒 Security Best Practices

### 1. IAM Security Checklist

```bash
✅ Enable MFA on root account
✅ Never use root account for daily operations
✅ Create IAM users with minimum necessary permissions
✅ Use IAM roles for Lambda/EC2 instead of access keys when possible
✅ Rotate access keys every 90 days
✅ Enable CloudTrail for audit logging
✅ Use AWS Secrets Manager for sensitive values (future upgrade)
```

### 2. Database Security

```bash
✅ Never expose RDS to public internet in production
✅ Use VPC and security groups properly
✅ Enable SSL/TLS for database connections
✅ Use strong passwords (20+ characters, random)
✅ Enable automated backups (after free tier)
✅ Regular security patches (enable auto minor version upgrade)
```

### 3. Application Security

```bash
✅ Use HTTPS only (enforce in CloudFront/API Gateway)
✅ Validate all user inputs
✅ Use parameterized queries (prevent SQL injection)
✅ Implement rate limiting
✅ Use signed URLs for S3 access (don't make bucket public)
✅ Enable CORS properly (specific origins, not *)
```

### 4. Environment Variables Security

```bash
# For sensitive values, use AWS Systems Manager Parameter Store:

# Store secret
aws ssm put-parameter \
    --name "/dermasense/prod/database-password" \
    --value "your-password" \
    --type "SecureString" \
    --region ap-south-1

# Retrieve in Lambda
import boto3

ssm = boto3.client('ssm', region_name='ap-south-1')
param = ssm.get_parameter(Name='/dermasense/prod/database-password', WithDecryption=True)
db_password = param['Parameter']['Value']
```

---

## 📊 Monitoring & Logging Setup

### Step 1: Enable CloudWatch Logs

```bash
1. Lambda automatically logs to CloudWatch
2. View logs:
   CloudWatch Console → Logs → Log groups → /aws/lambda/dermasense-api

3. Create metric filter for errors:
   - Select log group
   - Create metric filter
   - Pattern: [ERROR] or "error"
   - Create alarm when count > 10 in 5 minutes
```

### Step 2: Database Monitoring

```bash
1. RDS Console → Your database → Monitoring tab
2. Enable Performance Insights (optional, costs extra)
3. Watch:
   - CPU Utilization (alert if > 80%)
   - DatabaseConnections (alert if > 80 of max)
   - FreeStorageSpace (alert if < 2GB)
```

### Step 3: Set Up Alarms

```bash
CloudWatch → Alarms → Create alarm:

Alarm 1: Lambda Errors
  Metric: Errors
  Threshold: > 10 in 5 minutes
  Action: Send email notification

Alarm 2: API Gateway 5XX Errors
  Metric: 5XXError
  Threshold: > 10 in 5 minutes
  Action: Send email notification

Alarm 3: RDS CPU
  Metric: CPUUtilization
  Threshold: > 80% for 5 minutes
  Action: Send email notification
```

---

## 🚀 Deployment Checklist

### Pre-Deployment:
- [ ] AWS account created and verified
- [ ] Billing alerts configured
- [ ] IAM user created with MFA
- [ ] Region selected consistently
- [ ] All passwords saved securely

### Database:
- [ ] RDS PostgreSQL instance created
- [ ] Security group configured
- [ ] Database schema created
- [ ] Connection tested from local machine
- [ ] Data migrated (if existing)

### Authentication:
- [ ] Cognito User Pool created
- [ ] App client configured
- [ ] Callback URLs set
- [ ] Email verification enabled
- [ ] Tested sign up and sign in

### Storage:
- [ ] S3 bucket created
- [ ] Folder structure created
- [ ] CORS configured
- [ ] IAM user for access created
- [ ] Access keys saved

### Backend:
- [ ] Lambda functions created
- [ ] API Gateway configured
- [ ] Environment variables set
- [ ] VPC configuration done (for RDS access)
- [ ] CORS enabled
- [ ] Tested all endpoints

### Frontend:
- [ ] Code updated for AWS services
- [ ] Package.json updated
- [ ] Environment variables configured
- [ ] Amplify app created
- [ ] Build successful
- [ ] Domain configured (optional)

### Testing:
- [ ] User registration works
- [ ] User login works
- [ ] Image upload to S3 works
- [ ] ML prediction API works
- [ ] Database read/write works
- [ ] Medical history saves correctly

### Security:
- [ ] All secrets in environment variables
- [ ] No hardcoded credentials
- [ ] HTTPS enforced
- [ ] Security groups locked down
- [ ] MFA enabled

### Monitoring:
- [ ] CloudWatch Logs enabled
- [ ] Alarms created
- [ ] Email notifications configured
- [ ] Cost monitoring set up

---

## 📱 Testing Your Deployment

### 1. Test Database Connection

```bash
# From your local machine
psql -h dermasense-db.xxx.rds.amazonaws.com -U postgres -d dermasense_db

# Run test query
SELECT * FROM profiles LIMIT 5;
```

### 2. Test Lambda Function

```bash
# In Lambda Console → Test tab
# Create test event:
{
  "httpMethod": "GET",
  "path": "/",
  "headers": {},
  "body": ""
}

# Click "Test" and check response
```

### 3. Test API Gateway

```bash
# Using curl or Postman:
curl https://xxx.execute-api.ap-south-1.amazonaws.com/prod/

# Should return: {"message": "API is running", "status": "healthy"}
```

### 4. Test S3 Upload

```typescript
// In your Next.js app
import { uploadAvatar } from '@/lib/aws-s3'

// Test upload
const file = await fetch('/test-image.jpg').then(r => r.arrayBuffer())
const url = await uploadAvatar('test-user-id', Buffer.from(file), 'image/jpeg')
console.log('Uploaded to:', url)
```

### 5. Test Full User Flow

```bash
1. Open your Amplify URL or localhost:3000
2. Register new account → Check Cognito User Pool
3. Login → Check session cookies
4. Upload image → Check S3 bucket
5. Run prediction → Check CloudWatch Logs
6. Check medical history → Query RDS database
```

---

## 🆘 Troubleshooting Common Issues

### Issue 1: Can't Connect to RDS from Local Machine

```bash
Solution:
1. Check RDS security group inbound rules
2. Add your current IP address:
   - Get your IP: curl ifconfig.me
   - Add to security group: Type=PostgreSQL, Source=<your-ip>/32
3. Ensure "Publicly accessible" is "Yes"
4. Check VPC subnet has Internet Gateway attached
```

### Issue 2: Lambda Can't Connect to RDS

```bash
Solution:
1. Lambda must be in same VPC as RDS
2. Lambda security group must have outbound rule to RDS security group
3. RDS security group must allow inbound from Lambda security group
4. Lambda needs NAT Gateway for internet access (if also calling external APIs)
```

### Issue 3: Cognito Sign-Up Email Not Sending

```bash
Solution:
1. Check Cognito email settings (must be verified in SES if custom)
2. For testing, use Cognito default (limited to 50 emails/day)
3. To scale, verify domain in Amazon SES:
   - SES Console → Verified identities
   - Add domain and complete DNS verification
   - Request production access (move out of sandbox)
```

### Issue 4: CORS Errors from Frontend

```bash
Solution:
1. Add frontend URL to API Gateway CORS settings
2. Ensure Lambda returns CORS headers:
   
   response = {
       'statusCode': 200,
       'headers': {
           'Access-Control-Allow-Origin': 'https://yourdomain.com',
           'Access-Control-Allow-Headers': 'Content-Type,Authorization',
           'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
       },
       'body': json.dumps(data)
   }
```

### Issue 5: Lambda Timeout

```bash
Solution:
1. Increase timeout in Lambda configuration (max 15 minutes)
2. For ML model, use higher memory (more memory = more CPU)
3. Optimize model loading (load once in global scope)
4. Consider Lambda with EFS for large model files
```

### Issue 6: Exceeding Free Tier

```bash
Check usage:
1. Billing Console → Free Tier → Free Tier usage
2. Look for services close to limit
3. Common causes:
   - RDS running 24/7 (750 hrs = 1 instance)
   - Large S3 storage
   - High data transfer
   
Solutions:
- Use auto-stop for RDS during development
- Compress images before S3 upload
- Use CloudFront CDN to reduce data transfer costs
```

---

## 📚 Additional Resources

### Official AWS Documentation:
- RDS: https://docs.aws.amazon.com/rds/
- Cognito: https://docs.aws.amazon.com/cognito/
- Lambda: https://docs.aws.amazon.com/lambda/
- S3: https://docs.aws.amazon.com/s3/
- Amplify: https://docs.aws.amazon.com/amplify/

### Free Learning Resources:
- AWS Skill Builder (Free courses): https://skillbuilder.aws/
- AWS Free Tier Guide: https://aws.amazon.com/free/
- AWS Architecture Center: https://aws.amazon.com/architecture/

### Cost Calculator:
- AWS Pricing Calculator: https://calculator.aws/

### Community Support:
- AWS Forums: https://forums.aws.amazon.com/
- Stack Overflow: Tag with [amazon-web-services]
- r/aws on Reddit

---

## 🎉 Next Steps After Migration

1. **Enable Automated Backups**: After free tier, enable RDS automated backups
2. **Set Up CI/CD**: Use AWS CodePipeline or GitHub Actions for automated deployments
3. **Implement Caching**: Use CloudFront CDN for static assets, ElastiCache for API responses
4. **Scale Database**: When you grow, migrate to Aurora Serverless v2 or multi-AZ RDS
5. **Advanced Monitoring**: Implement X-Ray for distributed tracing
6. **Load Testing**: Use tools like Apache JMeter to test your infrastructure
7. **Disaster Recovery**: Set up cross-region replication for critical data

---

## ✅ Success Criteria

Your migration is complete when:
- ✅ Users can register and login via Cognito
- ✅ User profiles save to RDS PostgreSQL
- ✅ Images upload to S3 successfully
- ✅ ML predictions work via Lambda
- ✅ Medical history persists in database
- ✅ Frontend deploys on Amplify/Vercel
- ✅ All API endpoints respond correctly
- ✅ CloudWatch logs show no errors
- ✅ Free tier usage is under limits
- ✅ Billing alerts are configured

---

## 📞 Support

If you encounter issues:
1. Check AWS Service Health Dashboard: https://status.aws.amazon.com/
2. Review CloudWatch Logs for error messages
3. AWS Support (Basic - Free): For account and billing issues
4. Community forums for technical questions

---

**Last Updated**: March 2026  
**AWS Free Tier Valid**: 12 months from account creation (Cognito always free)  
**Estimated Setup Time**: 4-6 hours for complete migration

Good luck with your AWS migration! 🚀
