import { Redis } from '@upstash/redis'
import type { RenderJob, RenderSettings } from '@/types/render'

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error('Missing Upstash Redis credentials')
}

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

export async function enqueueRenderJob(job: Omit<RenderJob, 'jobId' | 'createdAt'>): Promise<string> {
  const jobId = `render_${Date.now()}_${Math.random().toString(36).substring(7)}`
  
  const fullJob: RenderJob = {
    ...job,
    jobId,
    createdAt: new Date().toISOString(),
  }
  
  await redis.lpush('render_queue', JSON.stringify(fullJob))
  await redis.set(`job:${jobId}:status`, 'queued', { ex: 86400 })
  
  return jobId
}

export async function getJobStatus(jobId: string): Promise<string | null> {
  return await redis.get(`job:${jobId}:status`)
}

export async function updateJobStatus(jobId: string, status: string, data?: any): Promise<void> {
  await redis.set(`job:${jobId}:status`, status, { ex: 86400 })
  
  if (data) {
    await redis.set(`job:${jobId}:data`, JSON.stringify(data), { ex: 86400 })
  }
}

export async function getJobData(jobId: string): Promise<any> {
  const data = await redis.get(`job:${jobId}:data`)
  return data ? JSON.parse(data as string) : null
}
