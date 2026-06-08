/**
 * 🔒 COMPLETE ENVIRONMENT SETUP GUIDE
 * =====================================
 * 
 * This guide explains every environment variable you need and where to get it.
 * Follow this carefully to ensure security and proper functionality.
 */

// ============================================
// 1️⃣ DATABASE CONFIGURATION (NEON PostgreSQL)
// ============================================

/*
STEP 1: Get your Neon Database URL

1. Go to https://console.neon.tech
2. Login with your account
3. Click on your project
4. Go to "Connection string" 
5. Copy the connection string that looks like:
   postgresql://user:password@ep-xxxxx.xxxxx.sql.neon.tech/database?sslmode=require

STEP 2: Use different URLs for development and production

FOR DEVELOPMENT (.env.local):
  DATABASE_URL=postgresql://user:password@ep-xxxxx.xxxxx.sql.neon.tech/caffeine_dev?sslmode=require

FOR PRODUCTION (Environment variable in Vercel/Render):
  DATABASE_URL=postgresql://user:password@ep-xxxxx.xxxxx.sql.neon.tech/caffeine_prod?sslmode=require

💡 NOTE: Neon automatically handles SSL, so sslmode=require is included
*/

// ============================================
// 2️⃣ AUTHENTICATION & SECURITY
// ============================================

/*
AUTH_SECRET:
- Used for signing sessions and tokens
- Must be at least 32 characters
- Generate using: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
- Keep this SECRET! Never share or commit it
- Use the same secret in development and production

Example generation:
$ node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
8f9a4c2e1d5b7c3f9a2e8d1c4f7b3e6a9c2d5f8e

Then add to .env.local:
  AUTH_SECRET=8f9a4c2e1d5b7c3f9a2e8d1c4f7b3e6a9c2d5f8e
*/

// ============================================
// 3️⃣ EMAIL CONFIGURATION (Gmail SMTP)
// ============================================

/*
We use Gmail SMTP for sending emails (verification, password reset, etc.)

STEP 1: Enable 2-Factor Authentication on your Gmail account
  - Go to https://myaccount.google.com/security
  - Click "2-Step Verification"
  - Follow the prompts

STEP 2: Generate Gmail App Password
  - Go to https://myaccount.google.com/apppasswords
  - Select "Mail" and "Windows Computer" (or your OS)
  - Click "Generate"
  - Google will give you a 16-character password
  - Copy this password (you won't see it again)

STEP 3: Configure Environment Variables
  GMAIL_USER=your.email@gmail.com  (Your actual Gmail address)
  GMAIL_PASSWORD=xxxx xxxx xxxx xxxx  (The app password from Step 2, keep the spaces)

Example:
  GMAIL_USER=caffeine.tracker.app@gmail.com
  GMAIL_PASSWORD=abcd efgh ijkl mnop

⚠️ IMPORTANT:
- Use the app password, NOT your regular Gmail password
- The app password works only with "Less secure app access" enabled
- Gmail will automatically manage this when you use app passwords
- Never share these credentials
*/

// ============================================
// 4️⃣ APPLICATION CONFIGURATION
// ============================================

/*
VITE_APP_URL:
- The URL where your app is hosted
- Used for email verification links, password reset links, etc.

DEVELOPMENT:
  VITE_APP_URL=http://localhost:5173

PRODUCTION (Vercel example):
  VITE_APP_URL=https://caffeine-tracker.vercel.app

PRODUCTION (Render example):
  VITE_APP_URL=https://caffeine-tracker.onrender.com
*/

/*
NODE_ENV:
- Set to "development" for local development
- Set to "production" for deployed versions
- Controls security features and optimizations

  NODE_ENV=development  (for .env.local)
  NODE_ENV=production   (for Vercel/Render)
*/

// ============================================
// 5️⃣ OPTIONAL: ADMIN CONFIGURATION
// ============================================

/*
ADMIN_SECRET_KEY:
- Used for admin dashboard access
- Generate similarly to AUTH_SECRET
- $ node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

Example:
  ADMIN_SECRET_KEY=7f8e9d2c1b4a5f6e3c9d2b1a7e4f3c9d2b1a5f6e
*/

// ============================================
// 📋 COMPLETE .env.local TEMPLATE
// ============================================

/*
# Copy this entire block to .env.local and fill in your values
# NEVER commit .env.local to Git

# DATABASE
DATABASE_URL=postgresql://user:password@ep-xxxxx.sql.neon.tech/caffeine_dev?sslmode=require

# AUTHENTICATION
AUTH_SECRET=8f9a4c2e1d5b7c3f9a2e8d1c4f7b3e6a9c2d5f8e

# EMAIL (Gmail SMTP)
GMAIL_USER=your.email@gmail.com
GMAIL_PASSWORD=abcd efgh ijkl mnop

# APPLICATION
VITE_APP_URL=http://localhost:5173
NODE_ENV=development

# ADMIN (Optional)
ADMIN_SECRET_KEY=7f8e9d2c1b4a5f6e3c9d2b1a7e4f3c9d2b1a5f6e
*/

// ============================================
// 🚀 DEPLOYMENT SETUP (VERCEL)
// ============================================

/*
1. Push your code to GitHub
2. Go to https://vercel.com
3. Click "New Project"
4. Connect your GitHub repository
5. In "Environment Variables" section, add:

   DATABASE_URL: [Your Neon production URL]
   AUTH_SECRET: [Your generated secret]
   GMAIL_USER: [Your Gmail]
   GMAIL_PASSWORD: [Your app password]
   VITE_APP_URL: https://your-domain.vercel.app
   NODE_ENV: production

6. Click "Deploy"
7. Vercel will automatically build and deploy
*/

// ============================================
// 🚀 DEPLOYMENT SETUP (RENDER)
// ============================================

/*
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - Name: caffeine-tracker
   - Environment: Node
   - Build Command: npm install && npm run build
   - Start Command: node build/index.js
5. Click "Advanced" and add Environment Variables:

   DATABASE_URL: [Your Neon production URL]
   AUTH_SECRET: [Your generated secret]
   GMAIL_USER: [Your Gmail]
   GMAIL_PASSWORD: [Your app password]
   VITE_APP_URL: https://caffeine-tracker.onrender.com
   NODE_ENV: production

6. Click "Create Web Service"
7. Render will build and deploy automatically
*/

// ============================================
// ⚠️ SECURITY CHECKLIST
// ============================================

/*
✅ Before deploying to production:

1. [ ] Never commit .env.local to Git (it's in .gitignore)
2. [ ] Use strong, randomly generated AUTH_SECRET
3. [ ] Use Gmail app password, not your actual password
4. [ ] Use different DATABASE_URL for dev and production
5. [ ] Set NODE_ENV=production in production environment
6. [ ] Set AUTH_COOKIE_SECURE=true in production
7. [ ] Verify email configuration is working
8. [ ] Test password hashing (bcrypt)
9. [ ] Enable HTTPS (automatic on Vercel/Render)
10. [ ] Review Lucia auth sessions configuration
*/

export {};
