'use client'

interface QueueJob {
  id: string
  projectId: string
  userId: string
  status: 'queued' | 'processing' | 'completed' | 'failed'
  quality: 'preview' | 'hq'
  progress: number
  createdAt: Date
  completedAt?: Date
  resultUrl?: string
}

class MockQueue {
  private jobs: Map<string, QueueJob> = new Map()
  private listeners: Map<string, (job: QueueJob) => void> = new Map()

  addJob(projectId: string, userId: string, quality: 'preview' | 'hq'): string {
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const job: QueueJob = {
      id: jobId,
      projectId,
      userId,
      status: 'queued',
      quality,
      progress: 0,
      createdAt: new Date()
    }

    this.jobs.set(jobId, job)
    this.processJob(jobId)
    return jobId
  }

  private async processJob(jobId: string) {
    const job = this.jobs.get(jobId)
    if (!job) return

    // Simulate processing
    job.status = 'processing'
    this.notifyListeners(jobId, job)

    // Simulate progress updates
    for (let progress = 10; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 500))
      job.progress = progress
      this.notifyListeners(jobId, job)
    }

    // Complete job
    job.status = 'completed'
    job.completedAt = new Date()
    job.resultUrl = `https://example.com/renders/${jobId}.jpg`
    this.notifyListeners(jobId, job)
  }

  getJob(jobId: string): QueueJob | undefined {
    return this.jobs.get(jobId)
  }

  onJobUpdate(jobId: string, callback: (job: QueueJob) => void) {
    this.listeners.set(jobId, callback)
  }

  private notifyListeners(jobId: string, job: QueueJob) {
    const listener = this.listeners.get(jobId)
    if (listener) listener(job)
  }
}

export const mockQueue = new MockQueue()
export type { QueueJob }