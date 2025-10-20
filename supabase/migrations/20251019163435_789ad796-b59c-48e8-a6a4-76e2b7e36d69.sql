-- Add missing RLS policies for grid.ai_memory
CREATE POLICY "Anyone can read ai_memory" 
  ON grid.ai_memory FOR SELECT 
  USING (true);

-- Add INSERT policies for edge functions to write data
CREATE POLICY "Service role can insert grid_signals" 
  ON grid.grid_signals FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Service role can insert grid_decisions" 
  ON grid.grid_decisions FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Service role can insert ai_memory" 
  ON grid.ai_memory FOR INSERT 
  WITH CHECK (true);