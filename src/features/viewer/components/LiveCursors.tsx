'use client'

import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import { useCollaboration } from '../hooks/useCollaboration'
import * as THREE from 'three'

interface LiveCursorsProps {
  projectId: string
}

export default function LiveCursors({ projectId }: LiveCursorsProps) {
  const { camera } = useThree()
  const { users, cursors, sendCursor } = useCollaboration(projectId)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    
    intervalRef.current = setInterval(() => {
      sendCursor(camera.position.x, camera.position.y, camera.position.z)
    }, 100)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [camera.position, sendCursor])

  return (
    <>
      {Array.from(cursors.entries()).map(([userId, position]) => {
        const user = users.find((u) => u.id === userId)
        if (!user) return null

        return (
          <group key={userId} position={[position.x, position.y, position.z]}>
            <mesh>
              <sphereGeometry args={[0.1]} />
              <meshBasicMaterial color={user.color} />
            </mesh>
            <sprite scale={[1, 0.3, 1]} position={[0, 0.3, 0]}>
              <spriteMaterial color={user.color} />
            </sprite>
          </group>
        )
      })}
    </>
  )
}
