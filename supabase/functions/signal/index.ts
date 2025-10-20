import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Set your deployed FastAPI Executor URL here
const EXECUTOR_URL = Deno.env.get('EXECUTOR_URL') || 'http://127.0.0.1:8082';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { location, symptoms, evidence } = await req.json();
    
    // Call FastAPI Executor (which orchestrates Assessor -> Judge)
    const response = await fetch(`${EXECUTOR_URL}/signal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ location, symptoms, evidence }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Executor error:', response.status, errorText);
      throw new Error(`Executor failed: ${response.statusText}`);
    }

    const result = await response.json();
    
    // Store result in Supabase grid_signals table
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
    
    const { error: insertError } = await supabase
      .from('grid_signals')
      .insert({
        location: result.location,
        symptoms: symptoms,
        odu: result.odu,
        ihash: result.assessor_hash,
        verdict: result.root_cause,
        action: result.recommended_action,
      });
    
    if (insertError) {
      console.error('Failed to insert signal:', insertError);
      // Don't fail the request, just log
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Signal proxy error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
