'use client'

import { memo } from 'react'
import { useCollaboration } from '../hooks/useCollaboration'
import { Users } from 'lucide-react'

interface CollaborationPanelProps {
  projectId: string
}

function CollaborationPanel({ projectId }: CollaborationPanelProps) {
  const { users } = useCollaboration(projectId)

  if (users.length === 0) return null

  return (
    <div className="absolute top-6 left-72 z-10">
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/80 backdrop-blur-lg border border-zinc-800">
        <Users className="size-4 text-zinc-400" />
        <div className="flex -space-x-2">
          {users.map((user) => (
            <div
              key={user.id}
              className="size-8 rounded-full border-2 border-zinc-900 flex items-center justify-center text-xs font-medium text-white"
              style={{ backgroundColor: user.color }}
              title={user.email}
            >
              {user.email.charAt(0).toUpperCase()}
            </div>
          ))}
        </div>
        <span className="text-sm text-zinc-400">{users.length} online</span>
      </div>
    </div>
  )
}

export default memo(CollaborationPanel)
