# Projects Feature

## Overview
Manages user 3D rendering projects with Supabase integration.

## Database Schema

### `projects` Table
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  model_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own projects"
ON projects FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects"
ON projects FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
ON projects FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
ON projects FOR DELETE
USING (auth.uid() = user_id);

-- Index for performance
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_updated_at ON projects(updated_at DESC);
```

## Files

### `actions.ts` - Server Actions
**`getUserProjects()`**
- Fetches all projects for logged-in user
- Orders by `updated_at` (newest first)
- Returns empty array if no user or error
- Type: `Promise<Project[]>`

### `components/ProjectCard.tsx`
Displays individual project card with:
- Thumbnail placeholder
- Project title
- Last edited timestamp
- Click to open in viewer (`/project/[id]`)

### Types (`src/types/database.ts`)
```typescript
interface Project {
  id: string;              // UUID
  user_id: string;         // UUID
  title: string;
  description?: string;
  thumbnail_url?: string;
  model_url?: string;
  created_at: string;      // ISO timestamp
  updated_at: string;      // ISO timestamp
}
```

## Dashboard Integration

### Data Flow
1. User visits `/dashboard`
2. Server Component calls `getUserProjects()`
3. Supabase fetches projects where `user_id = auth.uid()`
4. Projects sorted by `updated_at` DESC
5. Data passed to ProjectCard components
6. Rendered in responsive grid

### Empty State
When `projects.length === 0`:
- Shows folder icon
- "No projects yet" message
- "Create Your First Project" button
- Centered layout

### Populated State
When projects exist:
- 3-column grid (responsive)
- Each project as ProjectCard
- Relative timestamps ("2 hours ago")
- Click to open in viewer

## Relative Time Function
```typescript
getRelativeTime(date: string)
```
Converts ISO timestamp to human-readable:
- < 1 min: "just now"
- < 1 hour: "X minutes ago"
- < 1 day: "X hours ago"
- < 1 week: "X days ago"
- Older: Full date

## Security

### Row Level Security (RLS)
- Users can only see their own projects
- Enforced at database level
- No additional checks needed in code

### Authentication
- `getUserProjects()` checks for authenticated user
- Returns empty array if not logged in
- Middleware protects dashboard route

## Performance

### Optimizations
- Database indexes on `user_id` and `updated_at`
- Server-side rendering (no client fetch)
- Ordered query (no client-side sorting)
- Single query (no N+1 problem)

### Caching
Next.js automatically caches:
- Server Component output
- Supabase query results
- Revalidates on navigation

## Usage Example

```typescript
// In any Server Component
import { getUserProjects } from "@/features/projects/actions";

export default async function MyPage() {
  const projects = await getUserProjects();
  
  return (
    <div>
      {projects.map(project => (
        <div key={project.id}>{project.title}</div>
      ))}
    </div>
  );
}
```

## Next Steps

1. ✅ Fetch projects from database
2. ✅ Display in dashboard
3. ✅ Empty state handling
4. ✅ Relative timestamps
5. TODO: Create new project action
6. TODO: Update project action
7. TODO: Delete project action
8. TODO: Upload thumbnail images
9. TODO: Store 3D model files
