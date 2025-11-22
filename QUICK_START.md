# TEELI - Quick Setup Reference

## ⚡ Immediate Next Steps

### Step 1: Create Supabase Project (5 minutes)
1. Visit: **https://supabase.com**
2. Click "New Project"
3. Save these credentials:
   - Project URL: `https://xxxxx.supabase.co`
   - Anon Key: `eyJhbGci...`

### Step 2: Add to Vercel (2 minutes)
1. Go to: **https://vercel.com/dashboard**
2. Select project: `app.teeli.net`
3. **Settings** → **Environment Variables**
4. Add these 3 variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL = [Your Project URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY = [Your Anon Key]
   NEXT_PUBLIC_SITE_URL = https://app.teeli.net
   ```
5. Select: ✅ Production ✅ Preview ✅ Development

### Step 3: Redeploy (1 minute)
1. **Deployments** tab
2. Click ••• on latest deployment
3. Click **Redeploy**
4. ✅ Done! Authentication will work

---

## 📋 What I Fixed

### ✅ Error Handling
- App won't crash if Supabase is not configured
- Clear error messages shown to users
- Graceful fallbacks in all auth functions

### ✅ User Experience
- Login/signup forms show proper error messages
- OAuth buttons redirect with error if not configured
- Loading states work correctly

### ✅ Code Quality
- Environment variable validation in all Supabase clients
- Type-safe error handling
- Consistent error messaging

### ✅ Documentation
- Created `SUPABASE_SETUP.md` with step-by-step guide
- OAuth provider setup instructions
- Troubleshooting section
- Local development setup

---

## 🎯 Current Status

| Feature | Status | Notes |
|---------|--------|-------|
| UI/UX | ✅ Working | Landing page, pricing, auth pages |
| Build | ✅ Passing | No TypeScript errors |
| Deployment | ✅ Live | app.teeli.net deployed |
| OAuth UI | ✅ Ready | Google, Microsoft, Apple buttons |
| Error Handling | ✅ Added | Graceful fallbacks |
| Supabase | ⏳ Pending | Needs configuration (5 min) |
| Authentication | ⏳ Pending | Works after Supabase setup |

---

## 🔑 Required Environment Variables

### Vercel Production
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SITE_URL=https://app.teeli.net
```

### Local Development (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 🚀 Test After Setup

1. Visit: `https://app.teeli.net/signup`
2. Create account with email/password
3. Should redirect to: `https://app.teeli.net/dashboard`
4. Test OAuth (if configured): Google/Microsoft/Apple buttons

---

## 📚 Full Documentation
- **Supabase Setup**: `SUPABASE_SETUP.md`
- **GitHub Repo**: https://github.com/abhijeetpratapsingh241999/app.teeli.net
- **Vercel Dashboard**: https://vercel.com/dashboard

---

## 🐛 Troubleshooting

### "Authentication is not configured"
→ Follow Step 1 & 2 above

### "Invalid login credentials"
→ User doesn't exist - try signup first

### OAuth not working
→ Need to configure providers in Supabase (see SUPABASE_SETUP.md)

### Still stuck?
→ Check Vercel deployment logs in Functions tab
→ Check Supabase Auth Logs in dashboard
