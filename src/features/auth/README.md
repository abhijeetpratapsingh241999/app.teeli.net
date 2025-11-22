# Authentication System

## Overview
Complete authentication flow using Supabase Auth with Next.js Server Actions.

## Files

### `actions.ts` - Server Actions
Server-side authentication logic.

**Functions:**
- `login(formData)` - Sign in with email/password
- `signup(formData)` - Create new account
- `signOut()` - Sign out current user

**Flow:**
1. Receive form data
2. Call Supabase auth method
3. On success → Redirect to `/dashboard`
4. On error → Return error message

### Login Page (`/login`)
Full-screen centered login form with dark zinc theme.

**Features:**
- Email & password inputs
- Sign In button (primary action)
- Sign Up button (secondary action)
- Error message display
- Loading states
- Form validation

**UI Components:**
- Shadcn Card (glassmorphism)
- Shadcn Input (dark zinc)
- Shadcn Button
- Shadcn Label

## Protected Routes

### Middleware Protection
`src/middleware.ts` handles route protection:

**Protected Routes:**
- `/dashboard/*` - Requires authentication
- `/project/*` - Requires authentication
- `/settings/*` - Requires authentication

**Public Routes:**
- `/` - Marketing page
- `/login` - Auth page

**Redirect Logic:**
- Unauthenticated user → `/dashboard` → Redirect to `/login`
- Authenticated user → `/login` → Redirect to `/dashboard`

## User Flow

### Sign Up Flow
1. User visits `/login`
2. Enters email & password
3. Clicks "Sign Up"
4. Account created in Supabase
5. Automatically signed in
6. Redirected to `/dashboard`

### Sign In Flow
1. User visits `/login`
2. Enters email & password
3. Clicks "Sign In"
4. Credentials verified
5. Session created
6. Redirected to `/dashboard`

### Sign Out Flow
1. User clicks logout button in dashboard header
2. `signOut()` action called
3. Session destroyed
4. Redirected to `/login`

## Session Management

### Automatic Refresh
Middleware refreshes session on every request:
- Checks auth status
- Updates cookies
- Maintains session

### Cookie Handling
- Server-side: `createClient()` from `server.ts`
- Client-side: `createClient()` from `client.ts`
- Middleware: Automatic cookie sync

## Security

### Row Level Security (RLS)
Set up in Supabase:
```sql
-- Example: Projects table
CREATE POLICY "Users can view own projects"
ON projects FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects"
ON projects FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
```

## Error Handling

### Common Errors
- Invalid credentials → "Invalid login credentials"
- Email already exists → "User already registered"
- Weak password → "Password should be at least 6 characters"
- Network error → "Unable to connect to server"

### Display
Errors shown in red alert box above form buttons.

## UI Theme

### Dark Zinc Palette
- Background: `bg-zinc-950`
- Cards: `bg-zinc-900`
- Borders: `border-zinc-800`
- Text: `text-zinc-50`
- Muted: `text-zinc-400`

### Components
All components match dashboard theme for consistency.

## Testing

### Manual Test Cases
1. ✅ Sign up with new email
2. ✅ Sign in with existing account
3. ✅ Try invalid credentials
4. ✅ Access `/dashboard` without auth → Redirect to `/login`
5. ✅ Access `/login` while authenticated → Redirect to `/dashboard`
6. ✅ Sign out → Redirect to `/login`
7. ✅ Session persists across page refreshes

## Next Steps

1. Add password reset flow
2. Add email verification
3. Add OAuth providers (Google, GitHub)
4. Add user profile management
5. Add role-based access control
