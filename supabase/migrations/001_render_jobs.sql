-- Render jobs table for cloud GPU rendering
CREATE TABLE IF NOT EXISTS render_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'completed', 'failed')),
  quality TEXT NOT NULL CHECK (quality IN ('preview', 'hq')),
  
  model_url TEXT NOT NULL,
  output_url TEXT,
  settings JSONB DEFAULT '{}',
  
  runpod_id TEXT,
  error_message TEXT,
  render_time_seconds INTEGER,
  cost_usd DECIMAL(10, 4),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_render_jobs_user_id ON render_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_render_jobs_project_id ON render_jobs(project_id);
CREATE INDEX IF NOT EXISTS idx_render_jobs_status ON render_jobs(status);

ALTER TABLE render_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own render jobs" ON render_jobs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own render jobs" ON render_jobs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own render jobs" ON render_jobs FOR UPDATE USING (auth.uid() = user_id);
