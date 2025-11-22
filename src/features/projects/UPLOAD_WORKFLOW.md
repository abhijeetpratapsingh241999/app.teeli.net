# Create Project Upload Workflow

## Overview
Complete workflow for creating projects with optional 3D model file upload to Supabase Storage.

## Components

### CreateProjectModal.tsx
Modal dialog for creating new projects with file upload capability.

**Features:**
- Project name input (required)
- File upload input (optional, .glb/.gltf)
- Upload progress indicator
- Error handling
- Auto-refresh on success

## Workflow Steps

### 1. User Opens Modal
- Clicks "Create New Project" button
- Modal dialog appears
- Form fields ready for input

### 2. User Fills Form
- Enters project name (required)
- Optionally selects 3D model file
- Supported formats: `.glb`, `.gltf`

### 3. File Upload (If File Selected)
```typescript
// Upload to Supabase Storage
const filePath = `${user.id}/${Date.now()}-${file.name}`;

await supabase.storage
  .from("models")
  .upload(filePath, file);

// Get public URL
const { data: { publicUrl } } = supabase.storage
  .from("models")
  .getPublicUrl(filePath);
```

**Storage Structure:**
```
models/
  └── {user_id}/
      ├── 1234567890-model1.glb
      ├── 1234567891-model2.gltf
      └── ...
```

### 4. Create Database Record
```typescript
await createProject(name, fileUrl);
```

Inserts into `projects` table:
- `user_id` - Current user
- `title` - Project name
- `model_url` - Public URL from storage
- `thumbnail_url` - Optional (null for now)
- `updated_at` - Current timestamp

### 5. Success Actions
- Close modal
- Clear form fields
- Refresh dashboard (router.refresh())
- New project appears in grid

## UI States

### Idle State
- Form ready for input
- "Create Project" button enabled
- No loading indicators

### Uploading State
- Form fields disabled
- Button shows "Uploading..." with spinner
- User cannot close modal
- Progress feedback visible

### Error State
- Red alert box with error message
- Form re-enabled
- User can retry or cancel

### Success State
- Modal closes automatically
- Dashboard refreshes
- New project visible

## Error Handling

### Common Errors

**"Project name is required"**
- User didn't enter name
- Form validation

**"Not authenticated"**
- Session expired
- User needs to log in again

**"Upload failed: [message]"**
- File too large
- Invalid file type
- Storage quota exceeded
- Network error

**"Error creating project: [message]"**
- Database insert failed
- RLS policy issue
- Invalid data

### Error Recovery
All errors are non-fatal:
- Form stays open
- User can fix and retry
- No data loss

## Supabase Storage Setup

### Required Bucket
```sql
-- Create bucket (in Supabase Dashboard)
INSERT INTO storage.buckets (id, name, public)
VALUES ('models', 'models', true);
```

### Storage Policies
```sql
-- Allow authenticated users to upload
CREATE POLICY "Users can upload own models"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'models' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow public read access
CREATE POLICY "Public can view models"
ON storage.objects FOR SELECT
USING (bucket_id = 'models');

-- Allow users to delete own models
CREATE POLICY "Users can delete own models"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'models' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

## File Naming Convention

```typescript
const fileName = `${Date.now()}-${file.name}`;
```

**Format:** `{timestamp}-{original-filename}`

**Example:** `1703658916000-spaceship.glb`

**Benefits:**
- Unique filenames (no collisions)
- Preserves original name
- Sortable by upload time
- Easy to identify

## Security

### User Isolation
- Files stored in user-specific folders
- Path: `models/{user_id}/filename.glb`
- RLS prevents cross-user access

### File Validation
- Client-side: `accept=".glb,.gltf"`
- Server-side: Supabase validates MIME type
- Size limits enforced by Supabase

### Public URLs
- Files are publicly readable
- But organized by user ID
- No sensitive data in filenames

## Performance

### Optimizations
- Direct upload to Supabase (no server proxy)
- Streaming upload (no memory buffering)
- Public URLs (no signed URL overhead)
- Cache-Control: 3600 (1 hour)

### File Size Limits
- Supabase default: 50MB per file
- Can be increased in project settings
- Consider compression for large models

## Testing Checklist

- [ ] Create project without file
- [ ] Create project with .glb file
- [ ] Create project with .gltf file
- [ ] Try invalid file type (should reject)
- [ ] Try empty project name (should validate)
- [ ] Cancel modal (should clear form)
- [ ] Upload large file (should show progress)
- [ ] Network error (should show error)
- [ ] Success (should refresh dashboard)

## Integration with Viewer

Once project is created with `model_url`:
1. User clicks project card
2. Navigates to `/project/[id]`
3. Viewer loads model from `model_url`
4. Model renders in 3D canvas

## Future Enhancements

- [ ] Thumbnail generation
- [ ] Upload progress bar
- [ ] File size validation
- [ ] Drag & drop in modal
- [ ] Multiple file upload
- [ ] Model preview before upload
- [ ] Compression before upload
- [ ] Background upload (close modal early)
