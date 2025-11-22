# Projects Actions - Debugging Guide

## Fixed Issues

### Issue: "Error fetching projects" with empty object `{}`

**Root Cause:**
- Insufficient error handling
- Not checking auth errors separately
- Logging entire error object instead of message

**Solution Applied:**

### `getUserProjects()` - Robust Implementation

```typescript
export async function getUserProjects(): Promise<Project[]> {
  const supabase = await createClient();

  // Step 1: Get authenticated user with error handling
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError) {
    console.log("Auth error:", authError.message);
    return [];
  }

  if (!user) {
    console.log("No user found");
    return [];
  }

  // Step 2: Query projects
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.log("Error fetching projects:", error.message);
    return [];
  }

  return data || [];
}
```

## Key Improvements

### 1. Separate Auth Error Handling
```typescript
const { data: { user }, error: authError } = await supabase.auth.getUser();

if (authError) {
  console.log("Auth error:", authError.message);
  return [];
}
```

**Why:** Auth errors are different from query errors. Need to handle separately.

### 2. User Validation
```typescript
if (!user) {
  console.log("No user found");
  return [];
}
```

**Why:** Prevents querying database without authenticated user.

### 3. Specific Error Messages
```typescript
console.log("Error fetching projects:", error.message);
```

**Why:** `error.message` is more readable than entire error object.

### 4. Safe Return
```typescript
return data || [];
```

**Why:** Always returns array, never undefined or null.

## Common Errors & Solutions

### Error: "No user found"
**Cause:** User not authenticated
**Solution:** 
- Check if user is logged in
- Verify middleware is working
- Check session cookies

### Error: "Auth error: [message]"
**Cause:** Session expired or invalid
**Solution:**
- User needs to log in again
- Check Supabase connection
- Verify environment variables

### Error: "Error fetching projects: [message]"
**Possible Causes:**
1. **RLS Policy Issue**
   - Check if RLS policies are set up correctly
   - Verify user_id column exists
   
2. **Table Doesn't Exist**
   - Create `projects` table in Supabase
   - Run migration scripts

3. **Permission Denied**
   - Check RLS policies
   - Verify user has SELECT permission

## Debugging Steps

### 1. Check Console Logs
Look for these messages:
- "No user found" → Auth issue
- "Auth error: [message]" → Session issue
- "Error fetching projects: [message]" → Database issue

### 2. Verify Supabase Connection
```typescript
// Test in browser console
const supabase = createClient();
const { data, error } = await supabase.auth.getUser();
console.log({ data, error });
```

### 3. Check RLS Policies
In Supabase SQL Editor:
```sql
-- Check if policies exist
SELECT * FROM pg_policies WHERE tablename = 'projects';

-- Test query as user
SELECT * FROM projects WHERE user_id = auth.uid();
```

### 4. Verify Table Structure
```sql
-- Check table columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'projects';
```

## Required RLS Policies

```sql
-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own projects
CREATE POLICY "Users can view own projects"
ON projects FOR SELECT
USING (auth.uid() = user_id);

-- Allow users to insert their own projects
CREATE POLICY "Users can insert own projects"
ON projects FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own projects
CREATE POLICY "Users can update own projects"
ON projects FOR UPDATE
USING (auth.uid() = user_id);

-- Allow users to delete their own projects
CREATE POLICY "Users can delete own projects"
ON projects FOR DELETE
USING (auth.uid() = user_id);
```

## Testing Checklist

- [ ] User can log in successfully
- [ ] Console shows no errors
- [ ] Empty state appears when no projects
- [ ] Projects appear when they exist
- [ ] Can create new project
- [ ] Can view project in viewer
- [ ] RLS prevents viewing other users' projects

## Environment Variables Check

Verify `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
```

Both must be set correctly!

## Still Having Issues?

1. Check Supabase dashboard for errors
2. Verify table exists and has data
3. Test RLS policies in SQL editor
4. Check browser console for errors
5. Verify middleware is running
6. Clear cookies and log in again
