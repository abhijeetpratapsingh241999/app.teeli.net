import { createClient } from '@/lib/supabase/client'

export interface SceneState {
  camera: {
    position: [number, number, number]
    rotation: [number, number, number]
    fov: number
    isOrthographic: boolean
  }
  environment: {
    preset: string
    rotation: number
    showBackground: boolean
    backgroundColor: string
  }
  lighting: {
    intensity: number
    ambientIntensity: number
  }
  materials: Record<string, any>
  objects: Record<string, any>
  annotations: any[]
  measurements: any[]
  settings: Record<string, any>
  timestamp: string
}

export interface Branch {
  id: string
  name: string
  description?: string
  parentBranchId?: string
  isMain: boolean
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface Commit {
  id: string
  branchId: string
  parentCommitId?: string
  hash: string
  message: string
  authorId: string
  sceneState: SceneState
  changesSummary: {
    modified: string[]
    added: string[]
    removed: string[]
  }
  createdAt: string
}

export class VersionEngine {
  private supabase = createClient()

  // Generate unique commit hash
  private generateCommitHash(): string {
    return `commit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Calculate changes between two scene states
  private calculateChanges(oldState: SceneState | null, newState: SceneState) {
    const changes = {
      modified: [] as string[],
      added: [] as string[],
      removed: [] as string[]
    }

    if (!oldState) {
      changes.added.push('Initial scene setup')
      return changes
    }

    // Check camera changes
    if (JSON.stringify(oldState.camera) !== JSON.stringify(newState.camera)) {
      changes.modified.push('Camera settings')
    }

    // Check environment changes
    if (JSON.stringify(oldState.environment) !== JSON.stringify(newState.environment)) {
      changes.modified.push('Environment settings')
    }

    // Check lighting changes
    if (JSON.stringify(oldState.lighting) !== JSON.stringify(newState.lighting)) {
      changes.modified.push('Lighting configuration')
    }

    // Check annotations
    if (oldState.annotations.length !== newState.annotations.length) {
      if (newState.annotations.length > oldState.annotations.length) {
        changes.added.push('Annotations')
      } else {
        changes.removed.push('Annotations')
      }
    }

    // Check measurements
    if (oldState.measurements.length !== newState.measurements.length) {
      if (newState.measurements.length > oldState.measurements.length) {
        changes.added.push('Measurements')
      } else {
        changes.removed.push('Measurements')
      }
    }

    return changes
  }

  // Create a new branch
  async createBranch(projectId: string, name: string, description?: string, parentBranchId?: string): Promise<Branch | null> {
    // Mock implementation - always use mock for now
    const branch: Branch = {
      id: `branch_${Date.now()}`,
      name,
      description,
      parentBranchId,
      isMain: name === 'main',
      createdBy: 'demo_user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    return branch
  }

  // Get all branches for a project
  async getBranches(projectId: string): Promise<Branch[]> {
    // Mock implementation
    return [
      {
        id: 'main_branch',
        name: 'main',
        description: 'Main development branch',
        parentBranchId: undefined,
        isMain: true,
        createdBy: 'demo_user',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  }

  // Create a commit
  async createCommit(branchId: string, message: string, sceneState: SceneState, parentCommitId?: string): Promise<Commit | null> {
    // Mock implementation
    const changes = this.calculateChanges(null, sceneState)
    const commitHash = this.generateCommitHash()

    const commit: Commit = {
      id: `commit_${Date.now()}`,
      branchId,
      parentCommitId,
      hash: commitHash,
      message,
      authorId: 'demo_user',
      sceneState,
      changesSummary: changes,
      createdAt: new Date().toISOString()
    }
    return commit
  }

  // Get commits for a branch
  async getCommits(branchId: string, limit = 20): Promise<Commit[]> {
    // Mock implementation
    return [
      {
        id: 'commit_1',
        branchId,
        parentCommitId: undefined,
        hash: 'abc123def',
        message: 'Initial scene setup',
        authorId: 'demo_user',
        sceneState: {
          camera: { position: [0, 0, 5], rotation: [0, 0, 0], fov: 50, isOrthographic: false },
          environment: { preset: 'city', rotation: 0, showBackground: true, backgroundColor: '#000000' },
          lighting: { intensity: 1, ambientIntensity: 0.5 },
          materials: {},
          objects: {},
          annotations: [],
          measurements: [],
          settings: {},
          timestamp: new Date().toISOString()
        },
        changesSummary: { modified: [], added: ['Initial scene setup'], removed: [] },
        createdAt: new Date(Date.now() - 3600000).toISOString()
      }
    ]
  }

  // Get commit by hash
  async getCommitByHash(hash: string): Promise<Commit | null> {
    try {
      const { data, error } = await this.supabase
        .from('project_commits')
        .select('*')
        .eq('commit_hash', hash)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Failed to get commit:', error)
      return null
    }
  }

  // Create merge request
  async createMergeRequest(
    projectId: string,
    sourceBranchId: string,
    targetBranchId: string,
    title: string,
    description?: string
  ) {
    try {
      const { data, error } = await this.supabase
        .from('merge_requests')
        .insert({
          project_id: projectId,
          source_branch_id: sourceBranchId,
          target_branch_id: targetBranchId,
          title,
          description,
          created_by: 'demo_user' // Replace with actual user ID
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Failed to create merge request:', error)
      return null
    }
  }

  // Get merge requests for a project
  async getMergeRequests(projectId: string) {
    // Mock implementation
    return []
  }

  // Start editing session
  async startEditingSession(projectId: string, branchId: string, sessionData: any = {}) {
    try {
      const { data, error } = await this.supabase
        .from('editing_sessions')
        .insert({
          project_id: projectId,
          branch_id: branchId,
          user_id: 'demo_user', // Replace with actual user ID
          session_data: sessionData
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Failed to start editing session:', error)
      return null
    }
  }

  // Get active editing sessions
  async getActiveEditingSessions(projectId: string) {
    try {
      const { data, error } = await this.supabase
        .from('editing_sessions')
        .select('*')
        .eq('project_id', projectId)
        .eq('is_active', true)
        .order('started_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Failed to get editing sessions:', error)
      return []
    }
  }
}