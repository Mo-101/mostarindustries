import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const clientId = Deno.env.get("SPOTIFY_CLIENT_ID");
const clientSecret = Deno.env.get("SPOTIFY_CLIENT_SECRET");

let cachedToken: { token: string; expiresAt: number } | null = null;

const ensureCredentials = () => {
  if (!clientId || !clientSecret) {
    throw new Error("Spotify credentials are not configured.");
  }
};

const fetchToken = async () => {
  ensureCredentials();

  if (cachedToken && cachedToken.expiresAt > Date.now() + 30_000) {
    return cachedToken.token;
  }

  const authString = `${clientId}:${clientSecret}`;
  const encoded = btoa(authString);

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": `Basic ${encoded}`,
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Spotify token request failed: ${errorText}`);
  }

  const data = await response.json() as { access_token: string; expires_in: number };
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };

  return cachedToken.token;
};

const fetchTrack = async (token: string, trackId: string) => {
  const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Spotify track fetch failed: ${errorText}`);
  }

  return response.json();
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { trackId } = await req.json();

    if (!trackId) {
      return new Response(
        JSON.stringify({ error: "trackId is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const sanitizedId = trackId.includes(":") ? trackId.split(":").pop() : trackId;
    if (!sanitizedId) {
      return new Response(
        JSON.stringify({ error: "Invalid trackId format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const token = await fetchToken();
    const track = await fetchTrack(token, sanitizedId);

    const payload = {
      id: track.id,
      name: track.name,
      artists: (track.artists ?? []).map((artist: { name: string }) => artist.name),
      album: track.album?.name ?? "Unknown Album",
      previewUrl: track.preview_url,
      externalUrl: track.external_urls?.spotify ?? null,
      durationMs: track.duration_ms,
    };

    return new Response(
      JSON.stringify(payload),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("spotify-track error", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
