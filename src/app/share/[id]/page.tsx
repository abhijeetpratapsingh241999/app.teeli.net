import Scene from '@/features/viewer/components/Scene'
import Loader from '@/features/viewer/components/Loader'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { FileQuestion } from 'lucide-react'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function SharePage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: project, error } = await supabase
    .from('projects')
    .select('id, name, file_url')
    .eq('id', id)
    .single()

  if (error || !project) {
    notFound()
  }

  return (
    <div className="relative h-screen w-full bg-zinc-950">
      <div className="absolute top-6 left-6 z-10">
        <div className="px-4 py-2 rounded-lg bg-zinc-900/80 backdrop-blur-lg border border-zinc-800">
          <h1 className="text-lg font-semibold text-white">{project.name}</h1>
          <p className="text-xs text-zinc-400">Shared View</p>
        </div>
      </div>

      {project.file_url ? (
        <>
          <Scene fileUrl={project.file_url} readOnly />
          <Loader />
        </>
      ) : (
        <div className="h-full w-full flex items-center justify-center">
          <div className="text-center">
            <div className="size-20 mx-auto mb-4 rounded-full bg-zinc-900 flex items-center justify-center">
              <FileQuestion className="size-10 text-zinc-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Model</h3>
            <p className="text-zinc-400">This project doesn't have a 3D model</p>
          </div>
        </div>
      )}
    </div>
  )
}
