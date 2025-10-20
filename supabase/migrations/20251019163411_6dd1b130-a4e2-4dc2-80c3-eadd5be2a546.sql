-- Create grid schema for MoGrid integration
CREATE SCHEMA IF NOT EXISTS grid;

-- Assessor logs (internal FastAPI logging)
CREATE TABLE IF NOT EXISTS grid.assess_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  signal_hash TEXT NOT NULL,
  verdict TEXT,
  notes TEXT,
  model_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Judge decision logs (internal FastAPI logging)
CREATE TABLE IF NOT EXISTS grid.decisions_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  signal_hash TEXT NOT NULL,
  decision_hash TEXT NOT NULL,
  policy TEXT,
  confidence FLOAT,
  action TEXT,
  issued_at TIMESTAMPTZ DEFAULT NOW()
);

-- Frontend-facing grid signals table
CREATE TABLE IF NOT EXISTS grid.grid_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location TEXT NOT NULL,
  symptoms JSONB NOT NULL,
  odu SMALLINT CHECK (odu BETWEEN 0 AND 255),
  ihash TEXT NOT NULL,
  verdict TEXT,
  action TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Frontend-facing grid decisions table
CREATE TABLE IF NOT EXISTS grid.grid_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  signal_id UUID REFERENCES grid.grid_signals(id),
  decision_hash TEXT NOT NULL,
  policy TEXT,
  confidence FLOAT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- AI Memory for ChatBot context
CREATE TABLE IF NOT EXISTS grid.ai_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role TEXT CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  sentiment TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Audit validation events
CREATE TABLE IF NOT EXISTS grid.audit_validation_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ihash TEXT NOT NULL,
  signal_hash TEXT,
  decision_hash TEXT,
  validator TEXT DEFAULT 'system',
  result TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (public read for now, adjust as needed)
ALTER TABLE grid.grid_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE grid.grid_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE grid.ai_memory ENABLE ROW LEVEL SECURITY;

-- Public read policies (anyone can view grid data)
CREATE POLICY "Anyone can read grid_signals" 
  ON grid.grid_signals FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can read grid_decisions" 
  ON grid.grid_decisions FOR SELECT 
  USING (true);

-- Performance indexes
CREATE INDEX idx_signals_timestamp ON grid.grid_signals(timestamp DESC);
CREATE INDEX idx_decisions_signal_id ON grid.grid_decisions(signal_id);
CREATE INDEX idx_assess_created ON grid.assess_log(created_at DESC);