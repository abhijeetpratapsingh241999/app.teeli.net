'use client'

import { useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

interface AnalyticsEvent {
  type: string
  projectId?: string
  data?: Record<string, any>
}

export function useAnalytics() {
  const supabase = createClient()

  const track = useCallback(async (event: AnalyticsEvent) => {
    try {
      const sessionId = sessionStorage.getItem('session_id') || 
        (() => {
          const id = Math.random().toString(36).substr(2, 9)
          sessionStorage.setItem('session_id', id)
          return id
        })()

      await supabase.from('analytics_events').insert({
        event_type: event.type,
        project_id: event.projectId,
        event_data: event.data || {},
        session_id: sessionId,
        user_agent: navigator.userAgent
      })
    } catch (error) {
      console.error('Analytics tracking error:', error)
    }
  }, [supabase])

  const trackProjectView = useCallback((projectId: string) => {
    track({
      type: 'project_view',
      projectId,
      data: { timestamp: new Date().toISOString() }
    })
  }, [track])

  const trackRenderStart = useCallback((projectId: string, quality: string) => {
    track({
      type: 'render_start',
      projectId,
      data: { quality }
    })
  }, [track])

  const trackShare = useCallback((projectId: string, method: string) => {
    track({
      type: 'project_share',
      projectId,
      data: { method }
    })
  }, [track])

  const trackCollaboration = useCallback((projectId: string, action: string) => {
    track({
      type: 'collaboration',
      projectId,
      data: { action }
    })
  }, [track])

  return {
    track,
    trackProjectView,
    trackRenderStart,
    trackShare,
    trackCollaboration
  }
}