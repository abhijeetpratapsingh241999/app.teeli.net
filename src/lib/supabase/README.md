# Supabase Connection Setup

## Files

### `client.ts` - Browser Client
Used in Client Components (`"use client"`)
```typescript
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();
```

### `server.ts` - Server Client
Used in Server Components, Server Actions, Route Handlers
```typescript
import { createClient } from "@/lib/supabase/server";

const supabase = await createClient();
```

## Middleware (`middleware.ts`)

Automatically refreshes Supabase session on every request.

### What it does:
- Intercepts all requests
- Refreshes auth session
- Updates cookies
- Excludes static files (images, fonts, etc.)

### Matcher Pattern:
Excludes:
- `_next/static/*` - Next.js static files
- `_next/image/*` - Next.js image optimization
- `favicon.ico` - Favicon
- `*.svg, *.png, *.jpg, *.jpeg, *.gif, *.webp` - Images

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Usage Examples

### Client Component
```typescript
"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export default function Profile() {
  const [user, setUser] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  return <div>{user?.email}</div>;
}
```

### Server Component
```typescript
import { createClient } from "@/lib/supabase/server";

export default async function Dashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return <div>{user?.email}</div>;
}
```

### Server Action
```typescript
"use server";

import { createClient } from "@/lib/supabase/server";

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}
```

## Security

- ✅ Anon key is safe to expose (public)
- ✅ Row Level Security (RLS) enforced on database
- ✅ Session automatically refreshed
- ✅ Cookies handled securely
- ✅ Server-side validation

## Next Steps

1. Set up authentication flows
2. Create protected routes
3. Implement RLS policies in Supabase
4. Add user management
