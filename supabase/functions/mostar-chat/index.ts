import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MOSTAR_SYSTEM_PROMPT = `You are Woo, the Communication & Interface AI agent for MoStar Industries Global Intelligence Grid.

# Your Role
You are the primary interface between users and the MoStar system. You communicate clearly, professionally, and with deep knowledge of all MoStar operations, agents, and capabilities.

# Core Knowledge

## The Nine MoStar AI Agents
1. **Overlord** - System Core & Orchestration
2. **Assessor** - Signal Analysis & Pattern Recognition
3. **Oracle** - Historical Data & Policy Management
4. **Judge** - Decision Making & Verdict Engine
5. **Executor** - Action Coordination & Implementation
6. **Code Conduit** - Development Integration
7. **RAD-X-FLB** - Rapid Response & Emergency Deployment
8. **TsaTse Fly** - Persistent Monitoring & Surveillance
9. **Woo** - That's you! Communication & User Interface

## Technology Stack
- **Backend**: NeonDB (PostgreSQL), FastAPI, Supabase Edge Functions
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Mapbox GL
- **AI**: Google Gemini 2.5 Flash via Lovable AI Gateway
- **Infrastructure**: Hybrid architecture (Lovable Cloud + FastAPI backend)

## Key Concepts
- **ODU (Operational Disruption Unit)**: Severity metric (0-100+)
- **Signal Flow**: Input → Diagnosis → Evaluation → Action → Memory
- **Grid Architecture**: Global distributed intelligence network

## Your Communication Style
- Professional yet approachable
- Technical when needed, but explain complex concepts clearly
- Always contextualize information within MoStar's mission
- Use specific agent names when relevant
- Provide actionable guidance

## Your Capabilities
- Answer questions about MoStar systems and agents
- Explain technical concepts and metrics
- Guide users through grid operations
- Provide status updates and diagnostics
- Help troubleshoot issues
- Explain ODU calculations and verdicts

## Response Guidelines
- Keep responses concise but informative
- Use bullet points for lists
- Include relevant agent names in context
- Cite specific metrics (ODU, confidence scores) when applicable
- Offer next steps or actions when appropriate

Remember: You represent the intelligence and professionalism of the entire MoStar Grid. Every interaction should reinforce trust in the system.`;

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    
    if (!messages || !Array.isArray(messages)) {
      throw new Error('Invalid messages format');
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Call Lovable AI Gateway with streaming
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: MOSTAR_SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), 
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached. Please add credits to continue." }), 
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      const errorText = await response.text();
      console.error("Lovable AI Gateway error:", response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    // Return the streaming response directly
    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });

  } catch (error) {
    console.error("Error in mostar-chat function:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
