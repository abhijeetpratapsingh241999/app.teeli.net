-- Version control system for 3D projects
CREATE TABLE IF NOT EXISTS project_branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  parent_branch_id UUID REFERENCES project_branches(id),
  is_main BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, name)
);

-- Commits for each branch
CREATE TABLE IF NOT EXISTS project_commits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID NOT NULL REFERENCES project_branches(id) ON DELETE CASCADE,
  parent_commit_id UUID REFERENCES project_commits(id),
  commit_hash TEXT NOT NULL UNIQUE,
  message TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES auth.users(id),
  scene_state JSONB NOT NULL,
  changes_summary JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Merge requests between branches
CREATE TABLE IF NOT EXISTS merge_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  source_branch_id UUID NOT NULL REFERENCES project_branches(id),
  target_branch_id UUID NOT NULL REFERENCES project_branches(id),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'merged', 'closed')),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  merged_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  merged_at TIMESTAMPTZ
);

-- Collaborative editing sessions
CREATE TABLE IF NOT EXISTS editing_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES project_branches(id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  session_data JSONB DEFAULT '{}',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_project_branches_project_id ON project_branches(project_id);
CREATE INDEX IF NOT EXISTS idx_project_commits_branch_id ON project_commits(branch_id);
CREATE INDEX IF NOT EXISTS idx_project_commits_hash ON project_commits(commit_hash);
CREATE INDEX IF NOT EXISTS idx_merge_requests_project_id ON merge_requests(project_id);
CREATE INDEX IF NOT EXISTS idx_editing_sessions_project_id ON editing_sessions(project_id);

-- RLS policies
ALTER TABLE project_branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_commits ENABLE ROW LEVEL SECURITY;
ALTER TABLE merge_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE editing_sessions ENABLE ROW LEVEL SECURITY;

-- Branch policies
CREATE POLICY "Users can view project branches" ON project_branches FOR SELECT 
USING (
  project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
);

CREATE POLICY "Users can create project branches" ON project_branches FOR INSERT 
WITH CHECK (
  project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
);

-- Commit policies
CREATE POLICY "Users can view project commits" ON project_commits FOR SELECT 
USING (
  branch_id IN (
    SELECT id FROM project_branches 
    WHERE project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
  )
);

CREATE POLICY "Users can create commits" ON project_commits FOR INSERT 
WITH CHECK (
  branch_id IN (
    SELECT id FROM project_branches 
    WHERE project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
  )
);

-- Merge request policies
CREATE POLICY "Users can view merge requests" ON merge_requests FOR SELECT 
USING (
  project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
);

CREATE POLICY "Users can create merge requests" ON merge_requests FOR INSERT 
WITH CHECK (
  project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
);

-- Session policies
CREATE POLICY "Users can view editing sessions" ON editing_sessions FOR SELECT 
USING (
  project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
);

CREATE POLICY "Users can create editing sessions" ON editing_sessions FOR INSERT 
WITH CHECK (
  project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
);