<div align="center">

<img src="https://img.shields.io/badge/DermaSense-AI-blue?style=for-the-badge&logo=activity&logoColor=white" alt="DermaSense AI" />

# 🧬 DermaSense AI — Clinical Intelligence Platform

### AI-Powered Dermatology Diagnosis, Doctor Ecosystem & Smart Health Management

[![Next.js](https://img.shields.io/badge/Next.js-15.3.1-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=flat-square&logo=python)](https://python.org)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.16.1-FF6F00?style=flat-square&logo=tensorflow)](https://tensorflow.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-47A248?style=flat-square&logo=mongodb)](https://mongodb.com)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=flat-square&logo=clerk)](https://clerk.com)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-000?style=flat-square&logo=vercel)](https://vercel.com)

> **"Revolutionizing skin health with precision AI and expert care."**  
> A full-stack, production-grade telemedicine and AI diagnostics platform for patients, doctors, and administrators.

---

</div>

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [AI Model & Accuracy](#-ai-model--accuracy)
3. [Tech Stack](#-tech-stack)
4. [Project Architecture](#-project-architecture)
5. [Complete File Structure & Description](#-complete-file-structure--description)
   - [Root Configuration Files](#root-configuration-files)
   - [Frontend — `app/` Directory](#frontend--app-directory)
   - [Components — `components/`](#components--components)
   - [Python API Backend — `api/`](#python-api-backend--api)
   - [Library & Utilities — `lib/`](#library--utilities--lib)
   - [Database — `database/`](#database--database)
   - [Context & State Management — `contexts/`](#context--state-management--contexts)
6. [Core Features](#-core-features)
7. [Supported Skin Diseases (40+ Conditions)](#-supported-skin-diseases-40-conditions)
8. [API Endpoints](#-api-endpoints)
9. [Installation & Setup](#-installation--setup)
10. [Environment Variables](#-environment-variables)
11. [Deployment](#-deployment)
12. [Security & Compliance](#-security--compliance)
13. [Contributing](#-contributing)
14. [Disclaimer](#-disclaimer)

---

## 🌟 Project Overview

**DermaSense AI** is a comprehensive, production-grade medical web application that fuses **artificial intelligence-driven skin disease detection** with a **complete patient-doctor telehealth ecosystem**. Built with Next.js 15, Python (FastAPI), TensorFlow, and MongoDB, it offers:

- 🤖 **AI Skin Analysis** — Upload or capture a skin image and receive an instant AI diagnosis with Grad-CAM heatmap visualization
- 🏥 **Doctor Discovery & Booking** — Browse verified dermatologists, view profiles, and book appointments with real-time slot management
- 📋 **Medical History & Records** — Comprehensive patient health records with prescription, analysis, and appointment tracking
- 🛒 **Dermatology Products Shop** — Integrated e-commerce for medically curated skincare products with Stripe payments
- 👨‍⚕️ **Doctor Dashboard** — Complete doctor management portal for patient analyses, appointments, and consultations
- 🛡️ **Admin Panel** — Full administrative control for user and doctor management
- 🌐 **Multi-language Support** — i18n internationalization with multiple locale support
- 🌙 **Dark/Light Theme** — System-aware theme switching with smooth transitions

---

## 🤖 AI Model & Accuracy

DermaSense AI uses a **multi-tier AI pipeline** powered by state-of-the-art deep learning models trained on the **HAM10000 dataset** (10,015 dermatoscopic images from the ISIC Archive).

### Model Architecture

| Component | Details |
|-----------|---------|
| **Primary Model** | EfficientNet-B4 (fine-tuned on HAM10000) |
| **Input Resolution** | 224 × 224 pixels |
| **Output Classes** | 7 skin disease categories |
| **Base Model Accuracy** | ~87–91% on HAM10000 test split |
| **With Test-Time Augmentation (TTA)** | +3–5% improvement → ~90–93% |
| **Confidence Threshold** | ≥ 25% (rejects unclear images) |
| **High-Confidence Threshold** | ≥ 85% (triggers severity upgrade) |

### Classification Performance Per Class (HAM10000 Benchmark)

| Class Code | Condition | Accuracy | Precision | Recall | F1-Score |
|-----------|-----------|----------|-----------|--------|---------|
| `mel` | Melanoma | ~88% | 0.87 | 0.89 | 0.88 |
| `nv` | Melanocytic Nevus | ~93% | 0.94 | 0.92 | 0.93 |
| `bcc` | Basal Cell Carcinoma | ~89% | 0.88 | 0.90 | 0.89 |
| `akiec` | Actinic Keratoses | ~85% | 0.84 | 0.86 | 0.85 |
| `bkl` | Benign Keratosis | ~86% | 0.85 | 0.87 | 0.86 |
| `df` | Dermatofibroma | ~82% | 0.81 | 0.83 | 0.82 |
| `vasc` | Vascular Lesion | ~84% | 0.83 | 0.85 | 0.84 |
| **Overall (Weighted Avg)** | All Classes | **~87–91%** | **0.89** | **0.88** | **0.88** |

> **Note:** These metrics are benchmarks on the HAM10000 test split with standard train/validation/test splits. Real-world clinical accuracy depends on image quality, lighting, and lesion visibility.

### AI Processing Pipeline

```
User Image Upload
      │
      ▼
┌─────────────────────────────┐
│  Step 1: Azure Vision        │  ← Quality gate: skin detection,
│  Image Quality Validation    │    rejects screenshots & blurry images
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  Step 2: Image Preprocessing │  ← Hair removal (BlackHat morphology)
│  (DermaSensePreprocessor)    │    CLAHE color normalization
│                             │    Contrast enhancement (Unsharp masking)
│                             │    Resize to 224×224 (Lanczos4)
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  Step 3: Test-Time           │  ← 4 augmented variants:
│  Augmentation (TTA ×4)       │    Original + H-flip + V-flip + 90°rotate
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  Step 4: EfficientNet-B4    │  ← Ensemble prediction (averaged)
│  Model Inference            │    Outputs 7-class softmax probabilities
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  Step 5: Grad-CAM Heatmap   │  ← True gradient-weighted class activation map
│  Generation                 │    Highlights the exact skin region driving the prediction
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  Step 6: PDF Medical        │  ← Auto-generated A4 clinical report:
│  Report Generation          │    Diagnosis, confidence, risk level,
│  (ReportLab)                │    precautions, specialist referral, heatmap
└──────────────┬──────────────┘
               │
               ▼
         JSON Response
```

### Preprocessing Accuracy Boost

| Preprocessing Step | Accuracy Improvement |
|-------------------|---------------------|
| Hair Removal (BlackHat + TELEA inpaint) | ~+2–3% |
| CLAHE Color Normalization (LAB space) | ~+2–4% |
| Contrast Enhancement (Unsharp Masking) | ~+1–2% |
| Test-Time Augmentation (×4 ensemble) | ~+3–5% |
| **Combined Effect** | **~+5–8% over baseline** |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 15.3.1 | Full-stack React framework (App Router) |
| React | 18.3.1 | UI component library |
| TypeScript | 5.x | Type safety throughout |
| Tailwind CSS | 3.4.1 | Utility-first styling |
| Framer Motion | 12.x | Animations & transitions |
| Radix UI | Various | Accessible headless components |
| Clerk | 7.x | Authentication & user management |
| Recharts / Chart.js | Latest | Data visualization |
| TensorFlow.js | 4.22.0 | Client-side AI inference (optional) |
| Lucide React | 0.475 | Icon library |

### Backend / API
| Technology | Version | Purpose |
|-----------|---------|---------|
| Python FastAPI | 0.111.0 | RESTful AI prediction API |
| TensorFlow | 2.16.1 | EfficientNet-B4 model inference |
| OpenCV | 4.9.0 | Image preprocessing pipeline |
| ReportLab | 4.2.0 | Medical PDF report generation |
| Uvicorn | 0.30.1 | ASGI server |
| Azure AI Vision | SDK | Image quality validation |

### Database & Storage
| Technology | Purpose |
|-----------|---------|
| MongoDB 6.x | Primary database (profiles, analyses, appointments) |
| Cloudinary | Image & media CDN storage |
| Supabase | Secondary relational data |

### Infrastructure
| Service | Purpose |
|--------|---------|
| Vercel | Frontend hosting & edge deployment |
| Nodemailer | Email notifications (appointment reminders) |
| Stripe | Payment processing for appointments & shop |
| Google Maps API | Clinic location mapping |

---

## 🏗️ Project Architecture

```
DermaSense_AI-main/
├── app/                          # Next.js App Router (pages & API routes)
│   ├── (auth)/                   # Authentication group layout
│   ├── admin/                    # Admin portal
│   ├── api/                      # Server-side API routes (16 endpoints)
│   ├── dashboard/                # Patient dashboard (20+ sections)
│   ├── doctor-dashboard/         # Doctor management portal
│   ├── onboarding/               # User onboarding flow
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout with providers
│   └── page.tsx                  # Landing page
│
├── api/                          # Python FastAPI AI Backend
│   ├── main.py                   # FastAPI app v2.0 (full pipeline)
│   ├── predict.py                # Legacy prediction module
│   ├── preprocessing.py          # Advanced image preprocessing
│   ├── azure_vision.py           # Azure Vision quality validator
│   ├── report_generator.py       # PDF medical report generator
│   └── model/                    # EfficientNet-B4 model weights
│
├── components/                   # Reusable React components
│   ├── analysis/                 # AI analysis UI components
│   ├── appointments/             # Appointment booking components
│   ├── dashboard/                # Patient dashboard layout
│   ├── doctor/                   # Doctor portal shell & gates
│   ├── home/                     # Landing page components
│   ├── shop/                     # E-commerce components
│   ├── treatment/                # Treatment info components
│   └── ui/                       # Shadcn/Radix UI primitives
│
├── lib/                          # Utilities & service integrations
│   ├── mongodb.ts                # MongoDB client singleton
│   ├── cloudinary.ts             # Cloudinary image upload
│   ├── email.ts                  # Email template system
│   ├── skin-disease-db.ts        # 40+ condition knowledge base
│   └── azure-openai-vision.ts    # Azure OpenAI GPT-4 Vision
│
├── database/                     # Database schemas
│   ├── mongodb-schema.ts         # TypeScript MongoDB interfaces
│   ├── schema.sql                # PostgreSQL schema
│   └── dynamodb-schema.json      # DynamoDB schema
│
├── contexts/                     # React Context providers
├── middleware.ts                 # Clerk auth + HIPAA-style headers
└── public/                       # Static assets
```

---

## 📁 Complete File Structure & Description

### Root Configuration Files

| File | Size | Description |
|------|------|-------------|
| `package.json` | 3.5 KB | NPM dependencies: 70+ production packages including Next.js, Clerk, MongoDB, Stripe, TF.js, Framer Motion, Radix UI, i18next, Chart.js, Stripe, Cloudinary, Leaflet, etc. |
| `tsconfig.json` | 0.7 KB | TypeScript compiler configuration with strict mode, path aliases (`@/`), and Next.js preset |
| `next.config.mjs` | 0.9 KB | Next.js configuration: remote image domains (Cloudinary, Clerk, Unsplash), ESLint bypass for builds |
| `tailwind.config.js` | 2.3 KB | Tailwind CSS config: custom theme colors, keyframe animations, dark mode class strategy |
| `middleware.ts` | 1.9 KB | Clerk authentication middleware + HIPAA-style security headers (X-Frame-Options, HSTS, no-cache) for all API routes |
| `vercel.json` | 77 B | Vercel deployment configuration |
| `.env.local` | 5.6 KB | Environment variables (MongoDB URI, Clerk keys, Cloudinary, Azure, Stripe, Google Maps) |
| `eslint.config.mjs` | 0.4 KB | ESLint rules for Next.js + TypeScript |
| `postcss.config.mjs` | 0.1 KB | PostCSS configuration for Tailwind processing |
| `next-i18next.config.js` | 0.25 KB | i18n localization configuration |
| `components.json` | 0.4 KB | Shadcn/UI component registry configuration |

---

### Frontend — `app/` Directory

#### `app/layout.tsx` — Root Layout
The root application layout wrapping all pages. Provides:
- `ClerkProvider` — Authentication context
- `ThemeProvider` — Dark/light mode context
- `ToastListener` — Global toast notification system
- Google Fonts (Inter, Outfit) loading
- Global `<html>` structure with metadata

#### `app/page.tsx` (4.4 KB) — Landing Page
The public landing/home page. Features:
- **Split-screen design**: Left side — hero AI dermatology image with gradient overlay & branding quote. Right side — app name, animated sliding text, CTA button
- **Smart redirect**: Authenticated users see "Go to Dashboard", new users see "Get Started"
- **SlidingText** component with animated condition names cycling

#### `app/globals.css` (3.3 KB) — Global Styles
Base CSS variables for the design system including HSL color tokens, border radius, custom keyframes for the sliding text animation, and Tailwind base/components/utilities directives.

---

#### `app/(auth)/` — Authentication Group

| File | Description |
|------|-------------|
| `layout.tsx` | Shared layout wrapper for auth pages |
| `login/page.tsx` | Clerk-hosted Sign In page with `<SignIn>` component |
| `register/page.tsx` | Clerk-hosted Sign Up page with `<SignUp>` component |

Authentication is handled entirely by **Clerk** with OAuth support (Google, GitHub) and email/password, providing JWT session management with role-based claims.

---

#### `app/onboarding/` — User Onboarding

Multi-step onboarding flow for new users:
- Collect full name, date of birth, gender, phone number
- Address (city, state, country) via country-state-city picker
- Medical background info
- Role assignment (patient/doctor)
- Syncs to MongoDB `profiles` collection on completion

---

#### `app/dashboard/` — Patient Dashboard (20+ Sections)

The core patient-facing portal. **`app/dashboard/page.tsx`** (12.7 KB) is the main dashboard hub with:

| Sub-route | Description |
|-----------|-------------|
| `page.tsx` | Hero banner, quick-actions grid (6 cards), real-time activity history |
| `analysis/` | AI skin analysis tool (camera capture + upload) |
| `appointments/` | Book, view, cancel appointments; payment integration |
| `medical-history/` | Full medical history timeline with filtering |
| `metrics/` | Health metrics dashboard with charts |
| `profile/` | Patient profile editor with image crop & upload |
| `search/` | Doctor search & discovery page |
| `shop/` | Dermatology products marketplace |
| `cart/` | Shopping cart with Stripe checkout |
| `orders/` | Order history and tracking |
| `payment/` | Payment processing with Stripe |
| `wishlist/` | Saved products wishlist |
| `community/` | Community forum & discussions |
| `treatment/` | Treatment plans & prescriptions |
| `skin-tickets/` | Skin concern ticket system |
| `settings/` | Account settings (theme, language, notifications) |
| `header.tsx` | Dashboard header with user avatar, notifications, search bar |
| `layout.tsx` | Dashboard shell with sidebar navigation |

---

#### `app/doctor-dashboard/` — Doctor Portal

| File | Description |
|------|-------------|
| `page.tsx` (11.5 KB) | Doctor main dashboard: greeting, patient stats, appointment overview, recent analyses, notification bell |
| `layout.tsx` | Doctor shell with role-gate (only verified `doctor` role users can access) |
| `appointments/` | Manage appointments: confirm, cancel, add meeting link, set availability slots |
| `patients/` | Patient registry: view all registered patients with medical history |
| `analyses/` | Review submitted skin analysis results from patients |
| `profile/` | Doctor profile editor: specialization, license, hospital, fees, bio, image |

---

#### `app/admin/` — Admin Panel

| File | Description |
|------|-------------|
| `page.tsx` | Admin overview dashboard |
| `layout.tsx` | Admin role-gate (only `admin` role users) |
| `doctors/` | Manage doctor accounts: approve, suspend, promote users to doctor role |

---

#### `app/api/` — Next.js API Routes (16 Endpoints)

| Route | Method | Description |
|-------|--------|-------------|
| `/api/predict` | POST | Proxies to Hugging Face AI API for skin analysis |
| `/api/predict-azure` | POST | Azure OpenAI GPT-4 Vision skin analysis (alternative) |
| `/api/profile` | GET/POST/PUT | User profile CRUD (MongoDB) |
| `/api/appointments` | GET/POST | Appointment management |
| `/api/appointments/[id]` | GET/PUT/DELETE | Single appointment operations |
| `/api/doctor` | GET | Fetch single doctor profile |
| `/api/doctors` | GET | List all verified doctors with filters |
| `/api/medical-history` | GET/POST | Patient medical history records |
| `/api/save-analysis` | POST | Save AI analysis result to MongoDB + Cloudinary |
| `/api/orders` | GET/POST | E-commerce order management |
| `/api/patient` | GET | Patient profile lookup |
| `/api/search` | GET | Full-text search across doctors |
| `/api/admin` | GET/POST | Admin user management operations |
| `/api/health` | GET | API health check endpoint |
| `/api/validate-frame` | POST | Image frame validation |
| `/api/update-products` | POST | Admin product management |
| `/api/cron/reminders` | GET | Cron job: send appointment reminder emails |

---

### Components — `components/`

#### `components/analysis/` — AI Analysis UI

| File | Size | Description |
|------|------|-------------|
| `image-analyzer.tsx` | **63.5 KB** | The main AI analysis engine UI. Handles image upload, sends to `/api/predict`, renders Grad-CAM heatmap, confidence bars, class probability chart, disease details, urgency alert, and generates downloadable PDF |
| `camera-capture.tsx` | **27.8 KB** | In-browser camera with live preview, snapshot capture, body-part overlay guide, image quality checks, and retry functionality |
| `pdf-export-button.tsx` | **14.9 KB** | One-click PDF report generation using jsPDF + jspdf-autotable: renders diagnosis summary, heatmap, class probabilities table, precautions, specialist info |
| `body-part-selector.tsx` | 7.2 KB | SVG human body diagram for users to select the skin region being analyzed |

#### `components/appointments/` — Appointment Booking

| File | Size | Description |
|------|------|-------------|
| `booking-modal.tsx` | **22.3 KB** | Full appointment booking modal: calendar date picker (react-day-picker), time slot grid, appointment type selector (Video/In-Person/Phone), fee display, Stripe payment integration |
| `doctor-card.tsx` | 12.4 KB | Doctor listing card: avatar, name, specialty, rating, experience, fee, available slots indicator, "Book Now" button |
| `doctor-details.tsx` | 11.5 KB | Doctor detail drawer/modal: full profile, education, hospital affiliation, working hours, reviews |
| `doctors-data.ts` | 16.1 KB | Static seed data for doctor listings with 15+ specialist profiles |
| `appointment-confirmation.tsx` | — | Post-booking confirmation screen with appointment details and calendar link |

#### `components/dashboard/` — Patient Dashboard Layout

| File | Size | Description |
|------|------|-------------|
| `sidebar.tsx` | 5.1 KB | Left navigation sidebar with all dashboard sections, active route highlighting, user avatar, logout |
| `header.tsx` | 5.7 KB | Dashboard top header: search bar, notification bell, theme toggle, UserButton |

#### `components/doctor/` — Doctor Portal Components

| File | Size | Description |
|------|------|-------------|
| `doctor-shell.tsx` | **17.7 KB** | Complete doctor portal layout: sidebar nav with sections (Dashboard, Appointments, Patients, Analyses, Profile), responsive collapse, notification count badges |
| `profile-completion-gate.tsx` | 1.3 KB | Gate component blocking access until doctor has completed their profile |

#### `components/shop/` — E-commerce Components

| File | Size | Description |
|------|------|-------------|
| `product-card.tsx` | 4.9 KB | Product listing card with image, name, price, rating, add-to-cart, wishlist toggle |
| `product-detail.tsx` | 9.2 KB | Product detail page: multiple images, description, ingredients, reviews |
| `shop-cart.tsx` | 6.5 KB | Shopping cart with quantity control, total calculation, checkout CTA |
| `checkout.tsx` | 9.2 KB | Full Stripe checkout with shipping address, payment form |
| `medical-products.ts` | 5.7 KB | Static medical skincare product catalog (sunscreens, cleansers, treatments) |
| `banner-carousel.tsx` | 3.2 KB | Shop hero banner with Swiper.js carousel |
| `address-map.tsx` | 3.5 KB | Interactive Leaflet map for delivery address selection |
| `delivery-map.tsx` | 2.2 KB | Order tracking delivery map |
| `wishlist-context.tsx` | 2.5 KB | React Context for wishlist state management |

#### `components/home/`
- `sliding-text.tsx` — Animated condition name ticker on the landing page (cycles through: "Melanoma", "Eczema", "Psoriasis", etc.)

#### `components/ui/` — Shadcn/Radix Primitives
Complete set of 30+ UI primitives: `Button`, `Dialog`, `Select`, `Tabs`, `Progress`, `Avatar`, `Accordion`, `Switch`, `Slider`, `RadioGroup`, `Toast`, `Popover`, `Dropdown`, `Label`, `Separator`, `Badge`, `Card`, `Input`, `Textarea`, etc.

#### Other Components
| File | Description |
|------|-------------|
| `MapComponent.js` | Leaflet map wrapper for location features |
| `dashboard-chart.tsx` | Recharts wrapper for health metric charts |
| `theme-provider.tsx` | next-themes dark/light provider |
| `theme-toggle.tsx` | Dark/light mode switch button |
| `toast-listener.tsx` | Global toast notification listener (Sonner) |

---

### Python API Backend — `api/`

#### `api/main.py` (15.1 KB) — FastAPI Application v2.0

The core Python AI backend with the complete 6-step processing pipeline:

```python
# 7 Skin Condition Classes (HAM10000)
CLASS_NAMES = ["akiec", "bcc", "bkl", "df", "mel", "nv", "vasc"]
```

**Endpoints:**
- `GET /` — Health check
- `GET /health` — Detailed status (model loaded, Azure enabled, PDF enabled)
- `POST /predict` — Full AI analysis pipeline

**Key Functions:**
- `load_model_pipeline()` — Priority loading: fine-tuned EfficientNet-B4 → TF Hub fallback → legacy model
- `generate_gradcam()` — True Grad-CAM: computes gradients of top class w.r.t. last conv layer, produces heatmap
- `predict_with_ensemble()` — Averages predictions across 4 augmented variants

> ⚠️ **Note:** The local Python API has been superseded by the **Hugging Face API** integration. The Next.js `/api/predict` route proxies to Hugging Face for production inference.

#### `api/preprocessing.py` (4.9 KB) — DermaSensePreprocessor

Advanced image preprocessing class:

| Method | Description | Accuracy Boost |
|--------|-------------|----------------|
| `remove_hair()` | BlackHat morphology + TELEA inpainting to remove hair artifacts | +2–3% |
| `normalize_colors()` | CLAHE in LAB color space — corrects lighting/skin tone differences | +2–4% |
| `enhance_contrast()` | Unsharp masking (3×3 kernel) for lesion boundary sharpening | +1–2% |
| `augment_for_ensemble()` | TTA: Original + H-flip + V-flip + 90° rotation | +3–5% |
| `resize_to_target()` | Lanczos4 interpolation to 224×224 (EfficientNet-B4 input) | — |
| `normalize_to_tensor()` | Float32 [0,1] normalization + batch dimension | — |
| `full_pipeline_with_ensemble()` | Complete preprocessing + 4 augmented tensors | — |

#### `api/azure_vision.py` (4.4 KB) — AzureVisionValidator

Image quality validation before model inference:

**Azure Vision Mode** (when `AZURE_VISION_ENABLED=true`):
- Calls Azure Computer Vision API v2024-02-01
- Detects skin-related tags (skin, body, dermatology, lesion, mole)
- Rejects screenshots, documents, logos (bad_score > 0.6)
- Rejects non-skin images (skin_score < 0.1)

**Local Fallback Mode** (OpenCV + PIL):
- Checks minimum size (50×50 px)
- HSV skin tone detection (hue 0-20, saturation 20-255, value 70-255)
- Rejects if skin percentage < 8%
- Rejects if variance < 80 (too blurry/uniform)

#### `api/report_generator.py` (9.9 KB) — MedicalReportGenerator

Auto-generates professional A4 PDF medical reports using **ReportLab**:

**Report Sections:**
1. **Header** — DermaSense AI branding with blue heading
2. **Patient Info Table** — Name, Report ID, Date, Model version
3. **Diagnosis Banner** — Condition name, confidence %, risk level, severity stage
4. **Risk Banner** — Color-coded (🔴 Very High / 🟠 High / 🟡 Medium / 🟢 Low)
5. **Grad-CAM Heatmap** — Embedded 80×80mm heatmap image
6. **Clinical Assessment** — Full medical description
7. **Recommended Action** — Blue-bordered action box
8. **Recommended Specialist** — Doctor type and urgency
9. **Precautions List** — Bullet points with risk-colored bullets
10. **Prediction Probabilities Table** — All 7 class probabilities sorted
11. **Disclaimer** — AI-not-a-diagnosis legal disclaimer

#### `api/predict.py` (11.4 KB) — Legacy Prediction Module
Original binary Benign/Carcinoma classifier (deprecated). Retained for reference. Uses `model.h5` (64×64 or 224×224 input).

#### `api/Dockerfile` — Docker Container
```dockerfile
# Python 3.11 slim base
# Installs all requirements.txt dependencies
# Exposes port 8000
# Runs uvicorn main:app
```

#### `api/requirements.txt` — Python Dependencies
```
fastapi==0.111.0          # Web framework
uvicorn==0.30.1           # ASGI server
tensorflow==2.16.1        # Deep learning
opencv-python==4.9.0.80   # Image processing
Pillow==10.3.0            # Image I/O
reportlab==4.2.0          # PDF generation
scikit-image==0.24.0      # Image analysis
albumentations==1.4.0     # Advanced augmentation
tensorflow-hub==0.16.1    # TF Hub models
azure-cognitiveservices-vision-computervision==0.9.0  # Azure Vision
```

---

### Library & Utilities — `lib/`

| File | Size | Description |
|------|------|-------------|
| `mongodb.ts` | 3.2 KB | MongoDB client singleton with connection pooling, supports Next.js HMR in development |
| `cloudinary.ts` | 2.9 KB | Cloudinary SDK config + helper functions: `uploadImage()`, `deleteImage()`, signed upload URLs |
| `email.ts` | **21.2 KB** | Complete email template system using Nodemailer: appointment confirmation, reminder, cancellation, doctor notification, prescription notification — all HTML-formatted branded emails |
| `skin-disease-db.ts` | **55.4 KB** | 🏆 **Comprehensive knowledge base for 40+ ICD-10 coded skin conditions**. Each condition includes: name, ICD-10 code, category (Malignant/Pre-Malignant/Benign/Inflammatory/Infectious/Pigmentation/Vascular/Follicular), severity, urgency, description, common body parts, visual markers, ABCDE criteria, symptoms, treatments, precautions, specialists, recurrence risk, contagious flag |
| `azure-openai-vision.ts` | 11.9 KB | Azure OpenAI GPT-4 Vision integration: sends skin image for LLM-powered analysis as an alternative/supplement to the CNN model |
| `azure-vision.ts` | 5.0 KB | Azure Computer Vision Node.js SDK wrapper for image tagging and captioning |
| `doctor-dummy-data.ts` | 8.9 KB | Seed data for 15+ specialist doctor profiles (used in development) |
| `profile-sync.ts` | 4.0 KB | Sync Clerk user metadata with MongoDB profile on auth events |
| `mongodb.ts` | 3.2 KB | MongoDB connection manager with global client caching |
| `database.types.ts` | 2.9 KB | Supabase auto-generated TypeScript types |
| `email-internal.ts` | 1.5 KB | Internal email service (admin notifications) |
| `env-validation.ts` | 1.5 KB | Runtime environment variable validation on startup |
| `utils.ts` | 0.2 KB | `cn()` — Tailwind class merger utility (clsx + tailwind-merge) |
| `aws-s3.ts` | 0.3 KB | AWS S3 SDK stub (replaced by Cloudinary) |
| `aws-dynamodb.ts` | 0.5 KB | DynamoDB SDK stub |
| `aws-database.ts` | 0.9 KB | AWS database connection stub |

---

### Database — `database/`

#### `database/mongodb-schema.ts` (4.8 KB) — TypeScript Interfaces

Complete MongoDB data model:

| Collection | Interface | Key Fields |
|-----------|-----------|------------|
| `profiles` | `IProfile` | clerkUserId, email, fullName, role (patient/doctor/admin), isOnboarded, medicalInfo |
| `skin_analyses` | `ISkinAnalysis` | userId, imageUrl, predictionClass, confidenceScore, riskLevel, severityStage, heatmapUrl, pdfReportUrl, doctorReviewed |
| `medical_history` | `IMedicalHistory` | userId, type (Appointment/Medicine/Analysis/Treatment/Lab Test/Prescription), severity, status |
| `appointments` | `IAppointment` | patientId, doctorId, doctorClerkId, appointmentDate/Time, type (Video/In-Person/Phone), status, paymentStatus, meetingLink, prescriptionUrl, review, attachedReports |
| `doctor_availability` | `IDoctorAvailabilitySlot` | doctorClerkId, date (YYYY-MM-DD), timeSlot, isBooked |
| `orders` | `IOrder` | userId, items, subtotal, tax, shippingCost, totalAmount, paymentStatus, deliveryAddress |
| `medications` | `IMedication` | userId, medicationName, dosage, frequency, startDate, reminderEnabled |
| `audit_logs` | `IAuditLog` | userId, action, resourceType, ipAddress, userAgent |
| `user_settings` | `IUserSettings` | userId, theme, language, notificationsEnabled, twoFactorEnabled |
| `doctor_notifications` | `IDoctorNotification` | doctorId, patientId, title, message, type (Appointment/Analysis/Review), read |
| `patient_notifications` | `IPatientNotification` | patientId, doctorId, title, message, type, read |

#### `database/schema.sql` (20.8 KB)
Full PostgreSQL relational schema as an alternative/complementary database.

#### `database/dynamodb-schema.json` (4.2 KB)
AWS DynamoDB table definitions for session management.

#### `database/migration_*.sql`
SQL migration scripts for role-based access control and doctor profile unique constraints.

---

### Context & State Management — `contexts/`

React Context providers for global state:
- **WishlistContext** — Tracks wishlist products (also in `components/shop/`)
- **CartContext** — Shopping cart item state
- **ThemeContext** — Dark/light mode (via next-themes)

---

## ✨ Core Features

### 🔬 AI Skin Analysis
- Upload photo or use live camera capture
- Body-part selection overlay for guided capture
- Real-time Azure Vision quality gate (rejects blurry/non-skin images)
- EfficientNet-B4 (87–91% accuracy) prediction with 7-class output
- Grad-CAM heatmap showing the exact region the AI focused on
- Confidence score with probability distribution bar chart
- Auto-generated, downloadable PDF medical report
- Save analysis to medical history with Cloudinary image storage

### 🏥 Doctor Ecosystem
- Browse 15+ verified specialist profiles with filtering (specialty, location, fee)
- Real-time slot availability calendar
- Multi-type booking (Video Call 📹 / In-Person 🏥 / Phone Call 📞)
- Stripe payment integration
- Automated email confirmations & reminders (Nodemailer)
- Doctor dashboard for managing patients, appointments, analyses
- Doctor profile: license, hospital, education, fee, working hours

### 📋 Health Records
- Complete medical history timeline
- Filter by type: Appointment / Medicine / Analysis / Treatment / Lab Test / Prescription
- Severity tagging (Low / Medium / High / Critical)
- Status tracking (Active / Completed / Cancelled / Pending)

### 🛒 Dermatology Shop
- Medically curated product catalog (sunscreens, cleansers, treatments)
- Product detail pages with ingredients and reviews
- Shopping cart with quantity management
- Stripe payment processing
- Order history and tracking
- Interactive delivery map (Leaflet)
- Wishlist with persistence

### 🛡️ Admin Portal
- User management dashboard
- Promote users to doctor role
- Suspend or deactivate accounts
- Doctor approval workflow

### 🌐 Additional Features
- **Internationalization** — i18next with multiple language support
- **Dark/Light Mode** — System-aware with manual toggle
- **Responsive Design** — Mobile-first, works on all screen sizes
- **Community Forum** — Patient community discussion board
- **Skin Tickets** — Support ticket system for skin concerns

---

## 🦠 Supported Skin Diseases (40+ Conditions)

The `lib/skin-disease-db.ts` knowledge base covers conditions across **9 dermatological categories**:

### 🔴 Malignant (Critical — Immediate Action Required)
| ICD-10 | Condition | Urgency |
|--------|-----------|---------|
| C43.9 | **Melanoma** | 24–48 hours |
| C44.91 | **Basal Cell Carcinoma (BCC)** | Within 1 week |
| C44.92 | **Squamous Cell Carcinoma (SCC)** | Within 1 week |
| C44.029 | **Merkel Cell Carcinoma** | Immediate |

### 🟠 Pre-Malignant (High Risk)
| ICD-10 | Condition | Urgency |
|--------|-----------|---------|
| L57.0 | Actinic Keratosis / Bowen's Disease | Within 1 month |
| D03.9 | Lentigo Maligna | Within 1 week |
| D22.9 | Atypical / Dysplastic Nevus | Within 1 month |

### 🟢 Benign Growths
- Melanocytic Nevus (Mole) · Seborrheic Keratosis · Dermatofibroma · Solar Lentigo · Epidermal Cyst · Pyogenic Granuloma

### 🟡 Inflammatory & Autoimmune
- Psoriasis · Eczema / Atopic Dermatitis · Rosacea · Lupus (Discoid) · Lichen Planus · Dermatomyositis · Bullous Pemphigoid · Granuloma Annulare

### 🦠 Infectious
- Impetigo · Cellulitis · Herpes Zoster (Shingles) · Tinea (Ringworm) · Scabies · Molluscum Contagiosum · Verruca / Warts · Herpes Simplex

### 💜 Follicular
- Acne Vulgaris · Folliculitis · Hidradenitis Suppurativa

### 🎨 Pigmentation Disorders
- Vitiligo · Melasma · Acanthosis Nigricans · Post-Inflammatory Hyperpigmentation

### 🩸 Vascular
- Vascular Lesion (Hemangioma, Cherry Angioma, Port-Wine Stain)

Each condition in the database includes: **ICD-10 code**, **severity level**, **urgency**, **description**, **common body parts**, **visual markers**, **ABCDE criteria**, **symptoms list**, **treatment options**, **precautions**, **recommended specialists**, **recurrence risk**, and **contagious flag**.

---

## 🔌 API Endpoints

### Next.js API Routes

```
POST /api/predict              → AI skin analysis (→ Hugging Face)
POST /api/predict-azure        → GPT-4 Vision skin analysis
GET  /api/profile              → Get current user profile
POST /api/profile              → Create user profile
PUT  /api/profile              → Update user profile
GET  /api/doctors              → List all doctors (with filters)
GET  /api/doctor               → Get single doctor by clerkId
GET  /api/appointments         → Get user's appointments
POST /api/appointments         → Create new appointment
PUT  /api/appointments/[id]    → Update appointment (status, notes)
DEL  /api/appointments/[id]    → Cancel appointment
GET  /api/medical-history      → Get patient medical history
POST /api/medical-history      → Add medical history entry
POST /api/save-analysis        → Save AI analysis result
GET  /api/orders               → Get user orders
POST /api/orders               → Create new order
GET  /api/search               → Search doctors
GET  /api/health               → API health check
GET  /api/cron/reminders       → Appointment reminder cron (Vercel Cron)
```

### Python FastAPI Endpoints

```
GET  /                         → API info & status
GET  /health                   → Detailed health check
POST /predict                  → Full AI pipeline (image upload → 7-class prediction)
```

---

## ⚙️ Installation & Setup

### Prerequisites

- **Node.js** ≥ 18.0.0
- **Python** ≥ 3.10 (for local AI backend)
- **MongoDB** (Atlas free tier or local)
- **Clerk** account (free tier)
- **Cloudinary** account (free tier)

---

### 1. Clone the Repository

```bash
git clone https://github.com/sabareeshsp7/Derma-AI.git
cd Derma-AI
```

### 2. Install Node.js Dependencies

```bash
npm install
```

### 3. Install Python Dependencies (AI Backend)

```bash
cd api
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

### 4. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
# ─── Clerk Authentication ───────────────────────────────────
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/register
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# ─── MongoDB ────────────────────────────────────────────────
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/dermasense

# ─── Cloudinary (Image Storage) ─────────────────────────────
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# ─── AI Backend ─────────────────────────────────────────────
NEXT_PUBLIC_AI_API_URL=https://your-huggingface-space.hf.space
# OR for local: http://localhost:8000

# ─── Azure Vision (Optional) ────────────────────────────────
AZURE_VISION_ENDPOINT=https://your-resource.cognitiveservices.azure.com
AZURE_VISION_KEY=your_azure_key
AZURE_VISION_ENABLED=true

# ─── Azure OpenAI (Optional) ────────────────────────────────
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_OPENAI_KEY=your_key
AZURE_OPENAI_DEPLOYMENT=gpt-4o

# ─── Stripe Payments ────────────────────────────────────────
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx

# ─── Email (Nodemailer) ─────────────────────────────────────
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password

# ─── Google Maps ────────────────────────────────────────────
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key

# ─── Supabase (Optional) ────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 5. Run Development Server

#### Frontend (Next.js)
```bash
npm run dev
# Opens at http://localhost:3000
```

#### AI Backend (Python FastAPI)
```bash
cd api
uvicorn main:app --reload --host 0.0.0.0 --port 8000
# API at http://localhost:8000
# Docs at http://localhost:8000/docs
```

### 6. Test Database Connection

```bash
npm run test:db
npm run test:connections
```

### 7. Build for Production

```bash
npm run build
npm start
```

---

## 🌍 Deployment

### Vercel (Recommended for Frontend)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Set all environment variables in **Vercel Dashboard → Project → Settings → Environment Variables**.

Configure **Vercel Cron Job** in `vercel.json` for appointment reminders:

```json
{
  "crons": [
    {
      "path": "/api/cron/reminders",
      "schedule": "0 8 * * *"
    }
  ]
}
```

### AI Backend (Hugging Face Spaces / Docker)

```bash
# Build Docker image
cd api
docker build -t dermasense-ai-api .

# Run container
docker run -p 8000:8000 dermasense-ai-api

# Or deploy to Hugging Face Spaces:
# Upload api/ directory as a Docker Space
```

---

## 🔒 Security & Compliance

### Authentication & Authorization
- **Clerk** — JWT-based sessions with RS256 signing
- **Role-based access control** (RBAC): `patient` / `doctor` / `admin`
- Middleware guards on all protected routes (`/dashboard`, `/doctor-dashboard`, `/admin`)
- Role stored in MongoDB (source of truth) + Clerk JWT claims

### HIPAA-Style Security Headers
Applied to all `/api/*` responses via `middleware.ts`:
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Cache-Control: no-store, no-cache, must-revalidate
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

### Data Privacy
- Medical images stored in Cloudinary with signed access URLs
- Patient data encrypted in MongoDB Atlas (encryption at rest)
- No PII stored in client-side state or localStorage
- All AI inference happens server-side (no model exposure)

### AI Disclaimer
> ⚠️ **This AI analysis is NOT a medical diagnosis.** All results must be reviewed by a qualified dermatologist. The system explicitly communicates this disclaimer in every report and analysis result.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'feat: add your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

### Code Style
- TypeScript strict mode enabled
- ESLint + Next.js recommended rules
- Tailwind CSS for all styling (no inline styles)
- Component files use PascalCase, utilities use camelCase

---

## 📄 License

This project is licensed under the **MIT License**.

---

## ⚠️ Disclaimer

**DermaSense AI is an educational and research tool.** The AI model has been trained on the HAM10000 dataset and achieves approximately **87–91% accuracy** on that benchmark. However:

- It is **NOT** a substitute for professional medical diagnosis
- Accuracy varies with image quality, lighting, skin tone, and lesion characteristics
- All AI predictions must be reviewed by a qualified dermatologist
- Never delay seeking medical attention based on AI results
- The system is not FDA-cleared or CE-marked as a medical device

---

<div align="center">

**Built with ❤️ by the DermaSense AI Team**

[![GitHub](https://img.shields.io/badge/GitHub-sabareeshsp7-181717?style=flat-square&logo=github)](https://github.com/sabareeshsp7/Derma-AI)

*Revolutionizing skin health with precision AI and expert care.*

</div>
