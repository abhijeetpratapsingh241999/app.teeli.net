'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  GitBranch, 
  GitCommit, 
  GitMerge, 
  Plus, 
  Clock, 
  User, 
  MessageSquare,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  FileText
} from 'lucide-react'
import { VersionEngine, type Branch, type Commit, type SceneState } from '@/lib/version-control/versionEngine'
import { useViewerStore } from '../store/useViewerStore'
import DiffViewer from './DiffViewer'

interface VersionControlProps {
  projectId: string
}

export default function VersionControl({ projectId }: VersionControlProps) {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'branches' | 'commits' | 'merges'>('branches')
  const [branches, setBranches] = useState<Branch[]>([])
  const [commits, setCommits] = useState<Commit[]>([])
  const [mergeRequests, setMergeRequests] = useState<any[]>([])
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null)
  const [newBranchName, setNewBranchName] = useState('')
  const [commitMessage, setCommitMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [diffViewerOpen, setDiffViewerOpen] = useState(false)
  const [selectedCommit, setSelectedCommit] = useState<Commit | null>(null)

  const versionEngine = new VersionEngine()
  const viewerState = useViewerStore()

  useEffect(() => {
    if (open) {
      loadData()
    }
  }, [open, projectId])

  const loadData = async () => {
    setLoading(true)
    try {
      const [branchesData, mergeData] = await Promise.all([
        versionEngine.getBranches(projectId),
        versionEngine.getMergeRequests(projectId)
      ])
      
      setBranches(branchesData)
      setMergeRequests(mergeData)
      
      // Set main branch as current if no branch selected
      if (!currentBranch && branchesData.length > 0) {
        const mainBranch = branchesData.find(b => b.isMain) || branchesData[0]
        setCurrentBranch(mainBranch)
        loadCommits(mainBranch.id)
      }
    } catch (error) {
      console.error('Failed to load version control data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadCommits = async (branchId: string) => {
    try {
      const commitsData = await versionEngine.getCommits(branchId)
      setCommits(commitsData)
    } catch (error) {
      console.error('Failed to load commits:', error)
    }
  }

  const createBranch = async () => {
    if (!newBranchName.trim()) return
    
    try {
      const branch = await versionEngine.createBranch(
        projectId,
        newBranchName.trim(),
        `Feature branch: ${newBranchName.trim()}`,
        currentBranch?.id
      )
      
      if (branch) {
        setBranches(prev => [branch, ...prev])
        setNewBranchName('')
      }
    } catch (error) {
      console.error('Failed to create branch:', error)
    }
  }

  const createCommit = async () => {
    if (!commitMessage.trim() || !currentBranch) return
    
    try {
      // Get current scene state
      const sceneState: SceneState = {
        camera: {
          position: [0, 0, 5], // Mock data
          rotation: [0, 0, 0],
          fov: viewerState.cameraFov,
          isOrthographic: viewerState.isOrthographic
        },
        environment: {
          preset: viewerState.environmentPreset,
          rotation: viewerState.environmentRotation,
          showBackground: viewerState.showBackground,
          backgroundColor: viewerState.backgroundColor
        },
        lighting: {
          intensity: viewerState.lightIntensity,
          ambientIntensity: 0.5
        },
        materials: {},
        objects: {},
        annotations: viewerState.annotations,
        measurements: viewerState.measurements,
        settings: {
          gridVisible: viewerState.gridVisible,
          autoRotate: viewerState.autoRotate,
          enableEffects: viewerState.enableEffects
        },
        timestamp: new Date().toISOString()
      }

      const lastCommitId = commits.length > 0 ? commits[0].id : undefined
      const commit = await versionEngine.createCommit(
        currentBranch.id,
        commitMessage.trim(),
        sceneState,
        lastCommitId
      )
      
      if (commit) {
        setCommits(prev => [commit, ...prev])
        setCommitMessage('')
      }
    } catch (error) {
      console.error('Failed to create commit:', error)
    }
  }

  const switchBranch = async (branch: Branch) => {
    setCurrentBranch(branch)
    await loadCommits(branch.id)
  }

  const restoreCommit = async (commit: Commit) => {
    try {
      // Apply scene state from commit
      const state = commit.sceneState
      
      // Update viewer store with commit state
      viewerState.setCameraFov(state.camera.fov)
      viewerState.setEnvironmentPreset(state.environment.preset as any)
      viewerState.setEnvironmentRotation(state.environment.rotation)
      if (state.environment.showBackground !== viewerState.showBackground) {
        viewerState.toggleBackground()
      }
      viewerState.setBackgroundColor(state.environment.backgroundColor)
      viewerState.setLightIntensity(state.lighting.intensity)
      
      // Restore annotations and measurements
      state.annotations.forEach(annotation => {
        viewerState.addAnnotation(annotation)
      })
      
      alert(`Restored to commit: ${commit.message}`)
    } catch (error) {
      console.error('Failed to restore commit:', error)
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-zinc-200 hover:text-white hover:bg-zinc-700/50"
          title="Version Control"
        >
          <GitBranch className="size-5" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitBranch className="size-5 text-purple-400" />
            Version Control
            {currentBranch && (
              <Badge variant="outline" className="ml-2">
                {currentBranch.name}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex border-b border-zinc-800">
          {[
            { id: 'branches', label: 'Branches', icon: GitBranch },
            { id: 'commits', label: 'Commits', icon: GitCommit },
            { id: 'merges', label: 'Merge Requests', icon: GitMerge }
          ].map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-white border-b-2 border-purple-500'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Icon className="size-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Branches Tab */}
          {activeTab === 'branches' && (
            <div className="space-y-4 p-4">
              {/* Create Branch */}
              <div className="flex gap-2">
                <Input
                  placeholder="New branch name..."
                  value={newBranchName}
                  onChange={(e) => setNewBranchName(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={createBranch} className="gap-2">
                  <Plus className="size-4" />
                  Create Branch
                </Button>
              </div>

              {/* Branch List */}
              <div className="space-y-2">
                {branches.map(branch => (
                  <div
                    key={branch.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      currentBranch?.id === branch.id
                        ? 'bg-purple-500/10 border-purple-500/30'
                        : 'bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800/50'
                    }`}
                    onClick={() => switchBranch(branch)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GitBranch className="size-4 text-purple-400" />
                        <span className="font-medium text-white">{branch.name}</span>
                        {branch.isMain && (
                          <Badge variant="outline" className="text-xs">
                            main
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-zinc-400">
                        {formatTimeAgo(branch.createdAt)}
                      </span>
                    </div>
                    {branch.description && (
                      <p className="text-sm text-zinc-400 mt-1">{branch.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Commits Tab */}
          {activeTab === 'commits' && (
            <div className="space-y-4 p-4">
              {/* Create Commit */}
              <div className="flex gap-2">
                <Input
                  placeholder="Commit message..."
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={createCommit} className="gap-2">
                  <GitCommit className="size-4" />
                  Commit
                </Button>
              </div>

              {/* Commit History */}
              <div className="space-y-2">
                {commits.map(commit => (
                  <div
                    key={commit.id}
                    className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <GitCommit className="size-4 text-green-400" />
                          <span className="font-medium text-white">{commit.message}</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-zinc-400">
                          <span className="flex items-center gap-1">
                            <User className="size-3" />
                            Author
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="size-3" />
                            {formatTimeAgo(commit.createdAt)}
                          </span>
                          <span className="font-mono">{commit.hash.slice(0, 8)}</span>
                        </div>
                        {commit.changesSummary && (
                          <div className="flex gap-2 mt-2">
                            {commit.changesSummary.added.map((item, i) => (
                              <Badge key={i} className="text-xs bg-green-500/10 text-green-400">
                                +{item}
                              </Badge>
                            ))}
                            {commit.changesSummary.modified.map((item, i) => (
                              <Badge key={i} className="text-xs bg-yellow-500/10 text-yellow-400">
                                ~{item}
                              </Badge>
                            ))}
                            {commit.changesSummary.removed.map((item, i) => (
                              <Badge key={i} className="text-xs bg-red-500/10 text-red-400">
                                -{item}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedCommit(commit)
                            setDiffViewerOpen(true)
                          }}
                          className="gap-1"
                        >
                          <FileText className="size-3" />
                          Diff
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => restoreCommit(commit)}
                          className="gap-1"
                        >
                          <ArrowRight className="size-3" />
                          Restore
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Merge Requests Tab */}
          {activeTab === 'merges' && (
            <div className="space-y-4 p-4">
              {/* Create Merge Request */}
              <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                <h3 className="font-medium text-white mb-3">Create Merge Request</h3>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <select className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white">
                      <option>Select source branch</option>
                      {branches.filter(b => !b.isMain).map(branch => (
                        <option key={branch.id} value={branch.id}>{branch.name}</option>
                      ))}
                    </select>
                    <ArrowRight className="size-5 text-zinc-400 mt-2" />
                    <select className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white">
                      <option>Select target branch</option>
                      {branches.map(branch => (
                        <option key={branch.id} value={branch.id}>{branch.name}</option>
                      ))}
                    </select>
                  </div>
                  <Input placeholder="Merge request title..." className="bg-zinc-800 border-zinc-700" />
                  <Button className="gap-2">
                    <GitMerge className="size-4" />
                    Create Merge Request
                  </Button>
                </div>
              </div>

              {/* Merge Request List */}
              <div className="space-y-2">
                {mergeRequests.length === 0 ? (
                  <div className="text-center py-8 text-zinc-400">
                    <GitMerge className="size-12 mx-auto mb-2 text-zinc-600" />
                    <p>No merge requests yet</p>
                    <p className="text-sm">Create your first merge request above</p>
                  </div>
                ) : (
                  mergeRequests.map(mr => (
                    <div key={mr.id} className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <GitMerge className="size-4 text-blue-400" />
                            <span className="font-medium text-white">{mr.title}</span>
                            <Badge className={`text-xs ${
                              mr.status === 'open' ? 'bg-green-500/10 text-green-400' :
                              mr.status === 'merged' ? 'bg-purple-500/10 text-purple-400' :
                              'bg-red-500/10 text-red-400'
                            }`}>
                              {mr.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-zinc-400">
                            <span>{mr.source_branch?.name} → {mr.target_branch?.name}</span>
                            <span className="flex items-center gap-1">
                              <Clock className="size-3" />
                              {formatTimeAgo(mr.created_at)}
                            </span>
                          </div>
                          {mr.description && (
                            <p className="text-sm text-zinc-400 mt-1">{mr.description}</p>
                          )}
                        </div>
                        {mr.status === 'open' && (
                          <Button size="sm" className="gap-1">
                            <CheckCircle className="size-3" />
                            Merge
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
      
      {/* Diff Viewer */}
      {selectedCommit && (
        <DiffViewer
          open={diffViewerOpen}
          onOpenChange={setDiffViewerOpen}
          oldState={commits.find(c => c.id === selectedCommit.parentCommitId)?.sceneState || null}
          newState={selectedCommit.sceneState}
          title={`Changes in: ${selectedCommit.message}`}
        />
      )}
    </Dialog>
  )
}