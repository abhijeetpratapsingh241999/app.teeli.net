# ☁️ Cloud Rendering Interface

## Evolution: Viewer → Cloud Rendering Platform

TEELI has evolved from a simple 3D viewer to a **Cloud Rendering Interface** that prepares for AWS/GCP GPU processing.

---

## 🎯 Architecture Overview

```
Frontend Editor → Render Manager → Cloud API → AWS/GCP GPU → Result
```

### Components:
1. **RenderDialog.tsx** - User interface for render configuration
2. **useRenderStore.ts** - Job queue and status management
3. **submitRenderJob.ts** - Server action (mock cloud API)
4. **ViewerInspector** - Integration point

---

## 🎨 Step 1: Render Manager UI

### Component: `RenderDialog.tsx`
Location: `src/features/viewer/components/RenderDialog.tsx`

#### Features:

##### 1. Resolution Selection
```typescript
Options:
- 1080p (1920x1080) - Standard HD
- 4K (3840x2160) - Ultra HD
- 8K (7680x4320) - Cinema quality
```

##### 2. Render Engine Selection
```typescript
Options:
- Standard (WebGPU) - Real-time, browser-based
- Cloud Ray-Tracing (Cycles) - Beta (disabled)
- Cloud Ray-Tracing (Unreal) - Coming Soon (disabled)
```

##### 3. Output Format
```typescript
Options:
- PNG - Lossless, transparency support
- JPG - Compressed, smaller file size
```

##### 4. Submit Button
- "Start Cloud Render" with Sparkles icon
- Loading state during submission
- Success/error message display

#### Trigger:
- "Render Image" button in Inspector
- Camera icon for visual clarity

---

## 🗄️ Step 2: Render Store

### Store: `useRenderStore.ts`
Location: `src/features/viewer/store/useRenderStore.ts`

#### State Structure:
```typescript
interface RenderJob {
  id: string;                    // Unique job identifier
  status: "pending" | "processing" | "completed" | "failed";
  resolution: string;            // 1080p, 4K, 8K
  engine: string;                // standard, cloud-cycles, cloud-unreal
  format: string;                // png, jpg
  createdAt: string;             // ISO timestamp
  completedAt?: string;          // ISO timestamp (when done)
}
```

#### Actions:
```typescript
addToQueue(job) → jobId        // Add new render job
updateStatus(jobId, status)    // Update job progress
getJob(jobId) → RenderJob      // Retrieve job details
```

#### Job ID Format:
```
render_1234567890_abc123xyz
```

---

## 🚀 Step 3: Mock Cloud API

### Server Action: `submitRenderJob.ts`
Location: `src/features/viewer/actions/submitRenderJob.ts`

#### Input Parameters:
```typescript
interface RenderJobParams {
  resolution: string;
  engine: string;
  format: string;
  cameraPosition: { x, y, z };
  sceneSettings: {
    environment: string;
    gridVisible: boolean;
    autoRotate: boolean;
  };
}
```

#### Mock Behavior:
1. **Log submission** - Console output for debugging
2. **Simulate delay** - 3 seconds (network latency)
3. **Return success** - Mock AWS/GCP response

#### Response Format:
```typescript
{
  success: true,
  message: "Render job submitted to cloud successfully",
  jobId: "cloud_1234567890",
  estimatedTime: "5-10 minutes"
}
```

#### Future Integration:
```typescript
// Replace mock with real API
const response = await fetch('https://api.teeli.net/render', {
  method: 'POST',
  body: JSON.stringify(params),
  headers: { 'Authorization': `Bearer ${token}` }
});
```

---

## 🎛️ Step 4: Inspector Integration

### Location: `ViewerInspector.tsx`

#### New Section: "Cloud Render"
- Positioned above "Display Controls"
- Contains `<RenderDialog />` component
- Prominent placement for easy access

#### User Flow:
1. User clicks "Render Image" button
2. Dialog opens with configuration options
3. User selects resolution, engine, format
4. User clicks "Start Cloud Render"
5. Job added to queue (pending)
6. Server action submits to cloud (mock)
7. Status updates: pending → processing → completed
8. Success message with estimated time

---

## 📊 Job Status Flow

```
User Submit → Pending → Processing → Completed
                ↓
              Failed (on error)
```

### Status Meanings:
- **Pending:** Job queued, waiting for cloud resources
- **Processing:** GPU rendering in progress
- **Completed:** Render finished, ready for download
- **Failed:** Error occurred, retry available

---

## 🔮 Future Enhancements

### Phase 1: Real Cloud Integration
```typescript
// AWS Lambda + EC2 GPU instances
const renderOnAWS = async (job) => {
  const lambda = new AWS.Lambda();
  return lambda.invoke({
    FunctionName: 'teeli-render-job',
    Payload: JSON.stringify(job)
  });
};
```

### Phase 2: Progress Tracking
```typescript
// WebSocket for real-time updates
const ws = new WebSocket('wss://api.teeli.net/render/progress');
ws.onmessage = (event) => {
  const { jobId, progress } = JSON.parse(event.data);
  updateStatus(jobId, progress); // 0-100%
};
```

### Phase 3: Result Download
```typescript
// S3 signed URLs for secure download
const downloadUrl = await getSignedUrl(s3, {
  Bucket: 'teeli-renders',
  Key: `${jobId}.${format}`,
  Expires: 3600 // 1 hour
});
```

### Phase 4: Render Queue Dashboard
- View all jobs (pending, processing, completed)
- Cancel/retry failed jobs
- Download completed renders
- Usage statistics and billing

---

## 💰 Pricing Model (Future)

### Render Credits System:
| Resolution | Engine | Credits | Est. Time |
|------------|--------|---------|-----------|
| 1080p | Standard | Free | Instant |
| 1080p | Cloud RT | 1 credit | 2-5 min |
| 4K | Cloud RT | 3 credits | 5-10 min |
| 8K | Cloud RT | 10 credits | 15-30 min |

### Subscription Tiers:
- **Free:** 10 credits/month
- **Pro:** 100 credits/month ($29)
- **Studio:** Unlimited ($99)

---

## 🏗️ Technical Architecture

### Frontend (Current):
```
RenderDialog → useRenderStore → submitRenderJob (mock)
```

### Backend (Future):
```
API Gateway → Lambda → SQS Queue → EC2 GPU → S3 Storage
```

### Cloud Providers:
- **AWS:** EC2 G4/G5 instances (NVIDIA GPUs)
- **GCP:** Compute Engine with T4/A100 GPUs
- **Azure:** NC-series VMs (alternative)

### Render Engines:
- **Cycles:** Blender's ray-tracing engine
- **Unreal Engine:** Real-time ray-tracing
- **Custom:** Three.js with path tracing

---

## 🎯 Business Value

### Competitive Advantages:
1. **Hybrid Rendering:** Real-time + cloud ray-tracing
2. **Scalability:** Handle any resolution/complexity
3. **Cost Efficiency:** Pay-per-render model
4. **Professional Quality:** Cinema-grade output

### Use Cases:
- **Architects:** High-res client presentations
- **Product Designers:** Marketing materials
- **Game Developers:** Promotional screenshots
- **VFX Studios:** Pre-visualization

---

## 📈 Metrics to Track

### User Engagement:
- Render job submissions per day
- Average resolution selected
- Engine preference (standard vs cloud)
- Completion rate

### Technical Performance:
- Average render time by resolution
- Queue wait time
- Success/failure rate
- GPU utilization

### Business Metrics:
- Credit consumption
- Conversion rate (free → paid)
- Revenue per user
- Churn rate

---

## 🔐 Security Considerations

### Current (Mock):
- No authentication required
- No data persistence
- Client-side only

### Future (Production):
```typescript
// JWT authentication
const token = await getAuthToken();

// Encrypted scene data
const encrypted = await encrypt(sceneData, publicKey);

// Signed requests
const signature = await sign(payload, privateKey);
```

---

## 🎓 Developer Guide

### Adding a New Render Engine:
```typescript
// 1. Add to RenderDialog options
<SelectItem value="cloud-octane">
  Cloud Ray-Tracing (Octane) - Beta
</SelectItem>

// 2. Update server action
if (params.engine === 'cloud-octane') {
  return await renderWithOctane(params);
}

// 3. Update pricing
const credits = calculateCredits(resolution, 'octane');
```

### Testing the Flow:
```typescript
// 1. Open viewer
// 2. Click "Render Image"
// 3. Select 4K + Standard + PNG
// 4. Click "Start Cloud Render"
// 5. Check console for mock API call
// 6. Wait 3 seconds for success message
// 7. Job status updates automatically
```

---

## 🏆 Conclusion

### Transformation Complete:
**Viewer → Cloud Rendering Interface**

### Key Achievements:
- ✅ Render configuration UI
- ✅ Job queue management
- ✅ Mock cloud API integration
- ✅ Status tracking system
- ✅ Inspector integration

### Next Steps:
1. Implement real AWS/GCP integration
2. Add WebSocket progress tracking
3. Build render queue dashboard
4. Implement credit system
5. Add result download functionality

**Status:** Foundation complete, ready for cloud backend integration.

**Tagline:** *"Edit in real-time. Render in the cloud."*
