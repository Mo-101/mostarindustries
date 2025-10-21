import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const apiKey = Deno.env.get("GOOGLE_TTS_API_KEY") || Deno.env.get("GOOGLE_API_KEY");

const buildPayload = (text: string) => ({
  input: { text },
  voice: {
    languageCode: "en-US",
    name: "en-US-Neural2-C",
    ssmlGender: "FEMALE",
  },
  audioConfig: {
    audioEncoding: "MP3",
    speakingRate: 1.05,
    pitch: -2.0,
  },
});

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "Google TTS API key is not configured." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string") {
      return new Response(
        JSON.stringify({ error: "text is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildPayload(text)),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Google TTS request failed: ${errText}`);
    }

    const data = await response.json() as { audioContent?: string };

    if (!data.audioContent) {
      throw new Error("No audio content returned from Google TTS.");
    }

    return new Response(
      JSON.stringify({ audioContent: data.audioContent }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("text-to-speech error", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
