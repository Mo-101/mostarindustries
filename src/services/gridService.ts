import { supabase } from '../integrations/supabase/client';

export interface Signal {
  location: string;
  symptoms: string[];
  evidence: Array<Record<string, any>>;
}

export interface FinalDecision {
  status: string;
  layer: string;
  location: string;
  root_cause: string;
  odu: number;
  confidence: number;
  recommended_action: string;
  policy: string;
  assessor_hash: string;
  decision_hash: string;
  assessor_timestamp: string;
  decision_timestamp: string;
  orchestrated_at: string;
}

/**
 * Send a signal to the MoGrid for diagnosis and evaluation
 * This calls the Supabase Edge Function which proxies to FastAPI Executor
 */
export const sendSignal = async (signal: Signal): Promise<FinalDecision> => {
  const { data, error } = await supabase.functions.invoke('signal', {
    body: signal,
  });
  
  if (error) throw error;
  return data as FinalDecision;
};

/**
 * Fetch recent grid signals from the database
 */
export const fetchGridSignals = async () => {
  const { data, error } = await (supabase as any)
    .from('grid_signals')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(50);
  
  if (error) throw error;
  return data;
};

/**
 * Fetch recent grid decisions from the database
 */
export const fetchGridDecisions = async () => {
  const { data, error } = await (supabase as any)
    .from('grid_decisions')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(50);
  
  if (error) throw error;
  return data;
};
