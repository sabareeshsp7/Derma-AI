# 🚀 Supabase Setup Guide for DermaSense AI

## Quick Setup (5 minutes)

### **Step 1: Create Supabase Project**

1. Go to [supabase.com](https://supabase.com)
2. Click **"Start your project"**
3. Sign up / Log in with GitHub
4. Click **"New Project"**
5. Fill in:
   - **Name:** DermaSense-AI
   - **Database Password:** (create strong password)
   - **Region:** Select closest to your users
6. Click **"Create new project"**
7. Wait 2-3 minutes for setup

---

### **Step 2: Get API Credentials**

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy these values:

```bash
Project URL:
https://xxxxxxxxxxxxx.supabase.co

Project API Key (anon, public):
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey...

Service Role Key (secret):
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey...
```

3. Update your `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey...
```

---

### **Step 3: Configure Authentication**

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider (should be enabled by default)
3. Configure email settings:
   - Go to **Authentication** → **Email Templates**
   - Customize templates (optional)
   - Enable/disable email confirmation

#### **For Development (No Email Verification):**
```bash
Authentication → Providers → Email
- Enable email provider: ✓
- Confirm email: ✗ (disable for dev)
```

#### **For Production (With Email Verification):**
```bash
Authentication → Providers → Email
- Enable email provider: ✓
- Confirm email: ✓ (enable)
- Set up SMTP (or use Supabase's built-in)
```

---

### **Step 4: Test Authentication**

```bash
# Start your app
npm run dev

# Visit registration
http://localhost:3000/register

# Create test account
Name: Test User
Email: test@example.com
Password: Test@1234

# Login
http://localhost:3000/login
Email: test@example.com
Password: Test@1234

# Should redirect to dashboard!
```

---

## 📊 Database Setup (Optional)

If you want to store additional user data beyond authentication:

### **Create Profile Table:**

1. Go to **Table Editor** → **New Table**
2. Create `profiles` table:

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  avatar_url TEXT,
  date_of_birth DATE,
  phone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## 🔐 Security Settings

### **Row Level Security (RLS):**

Enable RLS for all tables:

```sql
-- Enable RLS on your tables
ALTER TABLE your_table ENABLE ROW LEVEL SECURITY;

-- Example: Users can only access their own data
CREATE POLICY "Users can access own data"
  ON your_table
  FOR ALL
  USING (auth.uid() = user_id);
```

### **Auth Settings:**

1. Go to **Authentication** → **Settings**
2. Configure:
   - **JWT Expiry:** 3600 (1 hour)
   - **Refresh Token Rotation:** Enabled
   - **Session Timeout:** 604800 (7 days)
   - **Enable Manual Linking:** Disabled

---

## 📧 Email Configuration (Production)

### **Option 1: Use Supabase Email (Limited)**
- Included in free tier
- 3 emails per hour
- Good for testing

### **Option 2: Custom SMTP (Recommended)**

1. Go to **Authentication** → **Settings**
2. Scroll to **SMTP Settings**
3. Configure your SMTP:

```
SMTP Host: smtp.gmail.com
SMTP Port: 587
SMTP User: your-email@gmail.com
SMTP Password: your-app-password
Sender Email: noreply@yourdomain.com
Sender Name: DermaSense AI
```

Popular SMTP providers:
- **SendGrid** (100 emails/day free)
- **Mailgun** (5,000 emails/month free)
- **AWS SES** (62,000 emails/month free)
- **Gmail** (500 emails/day)

---

## 🎯 Verification Email Templates

Customize email templates:

1. Go to **Authentication** → **Email Templates**
2. Edit templates:
   - **Confirm signup**
   - **Invite user**
   - **Magic Link**
   - **Change Email Address**
   - **Reset Password**

Example template:
```html
<h2>Welcome to DermaSense AI!</h2>
<p>Click the link below to verify your email:</p>
<a href="{{ .ConfirmationURL }}">Verify Email</a>
```

---

## 🔧 Environment Variables Summary

### **Development:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiI...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiI... (optional)
```

### **Production:**
```bash
# Same as development, but with production Supabase project
NEXT_PUBLIC_SUPABASE_URL=https://prod-xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiI...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiI...
```

---

## 🎨 Supabase Dashboard Features

Access these in your dashboard:

### **Table Editor:**
- View/edit database tables
- Create new tables
- Manage relationships

### **SQL Editor:**
- Run custom SQL queries
- Create functions/triggers
- Manage policies

### **Authentication:**
- View all users
- Edit user metadata
- Reset passwords
- Delete users

### **Storage:**
- Upload files (alternative to AWS S3)
- Create buckets
- Set access policies

### **API Documentation:**
- Auto-generated REST API
- Auto-generated GraphQL API
- Real-time subscriptions

---

## 🐛 Troubleshooting

### **Error: "Invalid API key"**
- Check `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
- Make sure it's the anon key, not service role key
- Restart dev server after changing .env

### **Error: "Email not confirmed"**
- Disable email confirmation in dev:
  - Authentication → Providers → Email → Confirm email: OFF
- Or check spam folder for verification email

### **Error: "Invalid login credentials"**
- Password must be 8+ characters
- Check email is correct
- Verify user exists in Dashboard → Authentication → Users

### **Error: "Failed to fetch"**
- Check `NEXT_PUBLIC_SUPABASE_URL` is correct
- Verify internet connection
- Check Supabase project is not paused

---

## 📚 Useful Links

- **Supabase Dashboard:** https://app.supabase.com
- **Documentation:** https://supabase.com/docs
- **Auth Helpers:** https://supabase.com/docs/guides/auth/auth-helpers/nextjs
- **RLS Guide:** https://supabase.com/docs/guides/auth/row-level-security
- **API Reference:** https://supabase.com/docs/reference/javascript/auth-api

---

## ✅ Setup Complete!

Once you've completed these steps:

1. ✅ Supabase project created
2. ✅ API credentials added to .env
3. ✅ Email provider configured
4. ✅ Test registration working
5. ✅ Test login working

**You're ready to deploy!** 🚀

---

**Pro Tips:**
- Use separate Supabase projects for dev/staging/prod
- Enable 2FA for your Supabase account
- Regularly backup your database
- Monitor usage in Dashboard → Settings → Usage
- Set up budget alerts to avoid surprises

---

**Last Updated:** 2026-03-15
**Setup Time:** ~5 minutes
**Difficulty:** Easy ⭐⭐☆☆☆
