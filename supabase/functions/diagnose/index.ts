import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Set your deployed FastAPI Assessor URL here
const ASSESSOR_URL = Deno.env.get('ASSESSOR_URL') || 'http://127.0.0.1:8080';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    
    // Proxy request to FastAPI Assessor
    const response = await fetch(`${ASSESSOR_URL}/diagnose`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Assessor error:', response.status, errorText);
      throw new Error(`Assessor failed: ${response.statusText}`);
    }

    const result = await response.json();

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Diagnose proxy error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
