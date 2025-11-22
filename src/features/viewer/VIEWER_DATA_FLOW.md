# Viewer Data Flow

## Overview
Complete data flow from clicking a project card to rendering the 3D model in the viewer.

## Architecture

### Server Component → Client Component Pattern
```
ProjectViewerPage (Server)
  ↓ fetches data
  ↓ passes initialFileUrl
ViewerWrapper (Client)
  ↓ sets store
  ↓ renders
Scene (Client)
  ↓ reads store
  ↓ renders model
```

## Step-by-Step Flow

### 1. User Clicks Project Card
**Location:** Dashboard (`/dashboard`)
```typescript
<ProjectCard id={project.id} ... />
```

**Action:** Navigates to `/project/[id]`

### 2. Server Component Loads
**File:** `src/app/(dashboard)/project/[id]/page.tsx`

```typescript
export default async function ProjectViewerPage({ params }) {
  // Fetch project from Supabase
  const project = await getProjectById(params.id);
  
  if (!project) {
    notFound(); // 404 if not found
  }
  
  // Pass file_url to client component
  return <ViewerWrapper initialFileUrl={project.file_url} />;
}
```

**What Happens:**
- Extracts `id` from URL params
- Calls `getProjectById(id)` server action
- Fetches project from Supabase
- Validates user owns the project (RLS)
- Returns 404 if not found
- Passes `file_url` to ViewerWrapper

### 3. Data Fetching (Server Action)
**File:** `src/features/projects/actions.ts`

```typescript
export async function getProjectById(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id) // RLS enforcement
    .single();
    
  return data;
}
```

**Security:**
- Checks authentication
- Filters by `user_id` (RLS)
- Returns null if not found or unauthorized

### 4. Client Component Receives Data
**File:** `src/features/viewer/components/ViewerWrapper.tsx`

```typescript
export default function ViewerWrapper({ initialFileUrl }) {
  const setFileUrl = useViewerStore((state) => state.setFileUrl);
  
  useEffect(() => {
    if (initialFileUrl) {
      setFileUrl(initialFileUrl); // Set in Zustand store
    }
  }, [initialFileUrl, setFileUrl]);
  
  return (
    <>
      <ViewerHeader />
      <Scene />
      {!fileUrl && <UploadOverlay />}
      <ViewerToolbar />
    </>
  );
}
```

**What Happens:**
- Receives `initialFileUrl` from server
- Sets it in Zustand store via `useEffect`
- Renders viewer components
- Hides upload overlay if file exists

### 5. Scene Reads Store and Renders
**File:** `src/features/viewer/components/Scene.tsx`

```typescript
export default function Scene() {
  const fileUrl = useViewerStore((state) => state.fileUrl);
  
  return (
    <Canvas>
      <Suspense fallback={<LoadingState />}>
        {fileUrl ? (
          <ModelRenderer fileUrl={fileUrl} />
        ) : (
          <TestCube />
        )}
      </Suspense>
    </Canvas>
  );
}
```

**What Happens:**
- Reads `fileUrl` from Zustand store
- If exists → Renders ModelRenderer
- If not → Shows TestCube (fallback)

### 6. Model Loads and Renders
**File:** `src/features/viewer/components/ModelRenderer.tsx`

```typescript
export default function ModelRenderer({ fileUrl }) {
  const { scene } = useGLTF(fileUrl); // Load from URL
  
  return (
    <Center>
      <primitive object={scene} />
    </Center>
  );
}
```

**What Happens:**
- `useGLTF` fetches model from `file_url`
- Model loads asynchronously
- Suspense shows loading state
- Model renders when ready

## Data Flow Diagram

```
User Click
    ↓
Navigate to /project/[id]
    ↓
Server Component (async)
    ↓
getProjectById(id) → Supabase
    ↓
Project Data (with file_url)
    ↓
ViewerWrapper (client)
    ↓
useEffect → setFileUrl(initialFileUrl)
    ↓
Zustand Store Updated
    ↓
Scene Re-renders
    ↓
ModelRenderer Reads fileUrl
    ↓
useGLTF Fetches Model
    ↓
3D Model Renders
```

## State Management

### Zustand Store
```typescript
{
  fileUrl: string | null,
  setFileUrl: (url) => void,
  autoRotate: boolean,
  gridVisible: boolean,
  environment: 'city' | 'sunset' | 'studio'
}
```

### Why Zustand?
- Persists across component re-renders
- Shared between Scene, Toolbar, Upload
- Simple API
- No prop drilling

## Error Handling

### Project Not Found
```typescript
if (!project) {
  notFound(); // Next.js 404 page
}
```

### No File URL
```typescript
{!fileUrl && <UploadOverlay />}
```
Shows upload overlay if no file

### Model Load Error
```typescript
<Suspense fallback={<LoadingState />}>
  <ModelRenderer fileUrl={fileUrl} />
</Suspense>
```
Suspense catches loading errors

## Security

### Row Level Security (RLS)
```sql
-- Only fetch projects owned by user
.eq("user_id", user.id)
```

### Authentication Check
```typescript
const { data: { user } } = await supabase.auth.getUser();
if (!user) return null;
```

### URL Validation
- File URLs are public (Supabase Storage)
- But organized by user ID
- RLS prevents unauthorized access to project metadata

## Performance

### Server-Side Rendering
- Project data fetched on server
- No client-side loading state for metadata
- Faster initial page load

### Suspense Boundaries
- Model loads asynchronously
- UI remains responsive
- Loading state only for 3D model

### Caching
- Next.js caches server component output
- Supabase queries cached
- Model files cached by browser

## Testing Flow

1. ✅ Create project with file
2. ✅ Click project card
3. ✅ Navigate to `/project/[id]`
4. ✅ Server fetches project
5. ✅ ViewerWrapper receives file_url
6. ✅ Store updates
7. ✅ Scene renders
8. ✅ Model loads
9. ✅ 3D model visible

## Troubleshooting

### Model Not Loading
- Check `file_url` in database
- Verify Supabase Storage URL
- Check browser console for errors
- Verify file format (.glb/.gltf)

### 404 Error
- Project doesn't exist
- User doesn't own project
- Invalid project ID

### Upload Overlay Shows
- `file_url` is null in database
- Store not updating
- Check useEffect dependencies

## Future Enhancements

- [ ] Preload model on hover
- [ ] Thumbnail preview
- [ ] Model metadata display
- [ ] Share project (public URLs)
- [ ] Version history
- [ ] Collaborative viewing
