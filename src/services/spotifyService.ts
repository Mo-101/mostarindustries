const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

type SpotifyTrackResponse = {
  id: string;
  name: string;
  artists: string[];
  album: string;
  previewUrl: string | null;
  externalUrl: string | null;
  durationMs: number;
};

export const fetchSpotifyTrack = async (trackId: string): Promise<SpotifyTrackResponse> => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("Supabase credentials are not configured.");
  }

  const endpoint = `${SUPABASE_URL}/functions/v1/spotify-track`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ trackId }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Spotify track request failed: ${message}`);
  }

  const data = await response.json();
  return data as SpotifyTrackResponse;
};
