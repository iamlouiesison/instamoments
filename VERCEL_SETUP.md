# 🚀 Vercel Setup Guide for InstaMoments

This guide will help you deploy your InstaMoments project to Vercel with automatic deployments from GitHub.

## 📋 Prerequisites

- ✅ GitHub repository connected (completed)
- ✅ Supabase project configured (completed)
- ✅ Next.js project ready (completed)
- ✅ Vercel account (free tier)

## 🔗 Step 1: Connect Vercel to GitHub

### 1.1 Sign Up/Login to Vercel

1. Go to [vercel.com](https://vercel.com)
2. **Click "Continue with GitHub"** (recommended)
3. **Authorize Vercel** to access your GitHub repositories

### 1.2 Import Your Repository

1. **Click "New Project"**
2. **Select "Import Git Repository"**
3. **Find and select** `iamlouiesison/instamoments`
4. **Click "Import"**

## ⚙️ Step 2: Configure Project Settings

### 2.1 Project Configuration

- **Project Name**: `instamoments` (or keep default)
- **Framework Preset**: Should auto-detect as **Next.js**
- **Root Directory**: `/` (root of repository)
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

### 2.2 Environment Variables

Add these environment variables in Vercel:

#### **Public Variables (NEXT*PUBLIC*)**

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_APP_URL=https://your-vercel-app.vercel.app
NEXT_PUBLIC_APP_NAME=InstaMoments
```

#### **Private Variables (Server-side only)**

```
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 2.3 Advanced Settings

- **Node.js Version**: 18.x (auto-detected)
- **Build Cache**: Enabled (recommended)
- **Function Regions**: `iad1` (US East)

## 🚀 Step 3: Deploy

### 3.1 Initial Deployment

1. **Click "Deploy"**
2. **Wait for build to complete** (usually 2-5 minutes)
3. **Your app will be live** at `https://your-app.vercel.app`

### 3.2 Verify Deployment

- ✅ **Homepage loads** without errors
- ✅ **Supabase connection works** (test the API endpoint)
- ✅ **All pages render correctly**

## 🔄 Step 4: Automatic Deployments

### 4.1 How It Works

- **Every push to main** triggers automatic deployment
- **Pull requests** get preview deployments
- **Branch deployments** for feature testing

### 4.2 Preview URLs

- **Production**: `https://your-app.vercel.app`
- **Preview**: `https://your-app-git-feature-branch.vercel.app`

## 🔧 Step 5: Update Supabase Configuration

### 5.1 Add Vercel Domain to Supabase

1. Go to your **Supabase project dashboard**
2. **Settings → Auth → URL Configuration**
3. **Add your Vercel domain** to:
   - Site URL: `https://your-app.vercel.app`
   - Redirect URLs: `https://your-app.vercel.app/**`

### 5.2 Update Environment Variables

After getting your Vercel URL, update:

```
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

## 🧪 Step 6: Test Everything

### 6.1 Basic Functionality

- ✅ **Homepage loads**
- ✅ **Supabase connection works**
- ✅ **API routes respond**

### 6.2 Authentication Flow

- ✅ **Sign up works**
- ✅ **Sign in works**
- ✅ **Protected routes work**

## 📊 Step 7: Monitor and Optimize

### 7.1 Vercel Analytics

- **Performance metrics**
- **Core Web Vitals**
- **User analytics**

### 7.2 Function Logs

- **API route performance**
- **Error monitoring**
- **Response times**

## 🎯 Next Steps After Vercel Setup

1. **Test the live deployment**
2. **Verify Supabase integration**
3. **Set up custom domain** (optional)
4. **Configure monitoring and alerts**
5. **Set up staging environment**

## 🔗 Useful Links

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/functions/serverless-functions/runtimes/nodejs)
- [Environment Variables](https://vercel.com/docs/projects/environment-variables)

## 🚨 Troubleshooting

### Common Issues

- **Build failures**: Check Node.js version and dependencies
- **Environment variables**: Ensure all required vars are set
- **Supabase connection**: Verify URLs and keys
- **API routes**: Check function timeout settings

### Support

- **Vercel Support**: Available in dashboard
- **GitHub Issues**: For code-related problems
- **Community**: Vercel Discord and forums

---

Your InstaMoments project will be live on Vercel with automatic deployments from GitHub! 🎉
