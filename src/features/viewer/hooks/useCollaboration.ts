'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'

interface User {
  id: string
  email: string
  color: string
}

interface CursorPosition {
  x: number
  y: number
  z: number
}

interface CollaborationState {
  users: Map<string, User>
  cursors: Map<string, CursorPosition>
  channel: RealtimeChannel | null
}

export function useCollaboration(projectId: string) {
  const [state, setState] = useState<CollaborationState>({
    users: new Map(),
    cursors: new Map(),
    channel: null,
  })

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase.channel(`project:${projectId}`)

    // Mock user for demo
    const mockUser = {
      id: `user_${Math.random().toString(36).substr(2, 9)}`,
      email: `user${Math.floor(Math.random() * 1000)}@demo.com`
    }
    
    // Generate random color for user
    const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`

      // Subscribe to presence
      channel
        .on('presence', { event: 'sync' }, () => {
          const presenceState = channel.presenceState()
          const users = new Map<string, User>()

          Object.entries(presenceState).forEach(([key, value]) => {
            const presence = value[0] as any
            users.set(presence.user_id, {
              id: presence.user_id,
              email: presence.email,
              color: presence.color,
            })
          })

          setState((prev) => ({ ...prev, users }))
        })
        .on('broadcast', { event: 'cursor' }, ({ payload }) => {
          setState((prev) => {
            const cursors = new Map(prev.cursors)
            cursors.set(payload.user_id, {
              x: payload.x,
              y: payload.y,
              z: payload.z,
            })
            return { ...prev, cursors }
          })
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await channel.track({
              user_id: mockUser.id,
              email: mockUser.email,
              color,
              online_at: new Date().toISOString(),
            })
          }
        })

    setState((prev) => ({ ...prev, channel }))

    return () => {
      channel.unsubscribe()
    }
  }, [projectId])

  const sendCursor = useCallback((x: number, y: number, z: number) => {
    if (!state.channel) return

    const userId = Object.keys(state.channel.presenceState())[0]
    if (!userId) return

    state.channel.send({
      type: 'broadcast',
      event: 'cursor',
      payload: {
        user_id: userId,
        x,
        y,
        z,
      },
    })
  }, [state.channel])

  return {
    users: Array.from(state.users.values()),
    cursors: state.cursors,
    sendCursor,
  }
}
