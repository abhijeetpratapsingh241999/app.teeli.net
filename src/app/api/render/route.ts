import { NextRequest, NextResponse } from 'next/server'
import { mockQueue } from '@/lib/queue/mockQueue'

export async function POST(request: NextRequest) {
  try {
    const { projectId, quality = 'preview' } = await request.json()
    
    if (!projectId) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 })
    }

    // Mock user ID (in real app, get from auth)
    const userId = 'user_demo'
    
    const jobId = mockQueue.addJob(projectId, userId, quality)
    
    return NextResponse.json({ 
      success: true, 
      jobId,
      message: 'Render job started successfully'
    })
  } catch (error) {
    console.error('Render API error:', error)
    return NextResponse.json({ error: 'Failed to start render' }, { status: 500 })
  }
}