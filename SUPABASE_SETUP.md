# Supabase Configuration Guide

## Current Status
⚠️ **Authentication is not working** because Supabase environment variables are missing in your Vercel deployment.

## Quick Setup Steps

### 1. Create Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Name**: TEELI (or any name)
   - **Database Password**: (create a strong password - save this!)
   - **Region**: Choose closest to your users
5. Wait for project to be created (~2 minutes)

### 2. Get API Credentials
1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **Anon/Public Key** (starts with `eyJhbGciOiJI...`)

### 3. Configure Vercel Environment Variables
1. Go to your Vercel dashboard: [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project: `app.teeli.net`
3. Go to **Settings** → **Environment Variables**
4. Add the following variables:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Project URL from step 2 | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Anon key from step 2 | Production, Preview, Development |
| `NEXT_PUBLIC_SITE_URL` | `https://app.teeli.net` | Production |
| `NEXT_PUBLIC_SITE_URL` | Your preview URL | Preview |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Development |

5. Click **Save**

### 4. Redeploy Your Application
1. Go to **Deployments** tab in Vercel
2. Click the three dots (•••) on your latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete

### 5. Configure OAuth Providers (Optional)
If you want Google/Microsoft/Apple login to work:

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Add authorized redirect URI: `https://xxxxx.supabase.co/auth/v1/callback`
6. Copy Client ID and Client Secret
7. In Supabase dashboard:
   - Go to **Authentication** → **Providers**
   - Enable Google
   - Paste Client ID and Client Secret
   - Save

#### Microsoft OAuth
1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to **Azure Active Directory** → **App registrations**
3. Click **New registration**
4. Add redirect URI: `https://xxxxx.supabase.co/auth/v1/callback`
5. Create a client secret under **Certificates & secrets**
6. Copy Application (client) ID and secret value
7. In Supabase dashboard:
   - Go to **Authentication** → **Providers**
   - Enable Azure (Microsoft)
   - Paste Client ID and Client Secret
   - Save

#### Apple OAuth
1. Go to [Apple Developer](https://developer.apple.com/)
2. Create a new App ID
3. Enable "Sign in with Apple" capability
4. Create a Service ID
5. Configure redirect URI: `https://xxxxx.supabase.co/auth/v1/callback`
6. Generate a private key
7. In Supabase dashboard:
   - Go to **Authentication** → **Providers**
   - Enable Apple
   - Enter Service ID, Team ID, Key ID, and Private Key
   - Save

## Verify Setup
1. Visit `https://app.teeli.net/login`
2. Try signing up with email/password
3. Check if you're redirected to dashboard
4. Try OAuth buttons (if configured)

## Troubleshooting

### "Authentication is not configured" error
- Environment variables are missing in Vercel
- Follow steps 2-4 above

### "Invalid login credentials" error
- User doesn't exist - try signing up first
- Check Supabase dashboard → Authentication → Users

### OAuth buttons not working
- OAuth providers not configured in Supabase
- Follow step 5 above for each provider
- Make sure redirect URIs match exactly

### Still having issues?
1. Check Vercel deployment logs: **Deployments** → Click deployment → **Functions** tab
2. Check Supabase logs: Supabase dashboard → **Logs** → **Auth Logs**
3. Make sure environment variables are set for all environments (Production, Preview, Development)
4. Try redeploying after adding environment variables

## Local Development Setup
If you want to run the app locally:

1. Create a `.env.local` file in project root:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJI...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

2. Install dependencies:
```bash
pnpm install
```

3. Run development server:
```bash
pnpm dev
```

4. Visit `http://localhost:3000`

## Database Setup (Optional)
The app includes migrations in `supabase/migrations/`. To apply them:

1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Link to your project:
```bash
supabase link --project-ref xxxxx
```

3. Push migrations:
```bash
supabase db push
```

## Need Help?
- Supabase Docs: [https://supabase.com/docs](https://supabase.com/docs)
- Vercel Docs: [https://vercel.com/docs](https://vercel.com/docs)
- TEELI GitHub Issues: [https://github.com/abhijeetpratapsingh241999/app.teeli.net/issues](https://github.com/abhijeetpratapsingh241999/app.teeli.net/issues)
