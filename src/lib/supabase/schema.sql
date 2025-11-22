-- Version Control Tables

-- Projects table (if not exists)
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Branches table
CREATE TABLE IF NOT EXISTS project_branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  parent_branch_id UUID REFERENCES project_branches(id),
  is_main BOOLEAN DEFAULT FALSE,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, name)
);

-- Commits table
CREATE TABLE IF NOT EXISTS project_commits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID REFERENCES project_branches(id) ON DELETE CASCADE,
  parent_commit_id UUID REFERENCES project_commits(id),
  commit_hash TEXT UNIQUE NOT NULL,
  message TEXT NOT NULL,
  author_id UUID,
  scene_state JSONB NOT NULL,
  changes_summary JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Merge requests table
CREATE TABLE IF NOT EXISTS merge_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  source_branch_id UUID REFERENCES project_branches(id),
  target_branch_id UUID REFERENCES project_branches(id),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'merged', 'closed')),
  created_by UUID,
  merged_by UUID,
  merged_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Editing sessions table
CREATE TABLE IF NOT EXISTS editing_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES project_branches(id),
  user_id UUID,
  session_data JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_project_branches_project_id ON project_branches(project_id);
CREATE INDEX IF NOT EXISTS idx_project_commits_branch_id ON project_commits(branch_id);
CREATE INDEX IF NOT EXISTS idx_merge_requests_project_id ON merge_requests(project_id);
CREATE INDEX IF NOT EXISTS idx_editing_sessions_project_id ON editing_sessions(project_id);