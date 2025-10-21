'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Volume2, Volume1, VolumeX, Play, Pause, Music, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { fetchSpotifyTrack } from '@/services/spotifyService';

interface MusicPlayerProps {
  defaultVolume?: number;
  systemState?: 'overlord' | 'assessor' | 'oracle' | 'judge' | 'executor' | 'network';
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  defaultVolume = 0.3,
  systemState = 'overlord',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(defaultVolume);
  const [isMuted, setIsMuted] = useState(false);
  const [trackName, setTrackName] = useState('Initializing Grid Audio');
  const [artistLine, setArtistLine] = useState<string | null>(null);
  const [audioReady, setAudioReady] = useState(false);
  const [loading, setLoading] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const spotifyTrackMap: Record<string, string> = {
    overlord: 'spotify:track:5jUQgikDAR8VdRidW1058F',
    assessor: 'spotify:track:6I3xxBk9bTRFqzVur1RZW0',
    oracle: 'spotify:track:0KLy8FhoIWjPwfcjQSJSZ9',
    judge: 'spotify:track:57cV6k2cWGacKcaAinpgFk',
    executor: 'spotify:track:4p2lyaJDrMW83XxAyHkcHE',
    network: 'spotify:track:5jUQgikDAR8VdRidW1058F',
  };

  const selectedSpotifyTrack = spotifyTrackMap[systemState] || spotifyTrackMap.overlord;

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = false;
    }

    const player = audioRef.current;
    player.volume = isMuted ? 0 : volume;
    player.onended = () => setIsPlaying(false);

    return () => {
      player.pause();
      player.src = '';
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  useEffect(() => {
    const loadTrack = async () => {
      setLoading(true);
      setAudioReady(false);
      setIsPlaying(false);

      try {
        const track = await fetchSpotifyTrack(selectedSpotifyTrack);
        if (!track.previewUrl) {
          throw new Error('This track does not provide a preview stream.');
        }

        setTrackName(track.name);
        setArtistLine(track.artists.join(', '));

        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.src = track.previewUrl;
          audioRef.current.load();
          audioRef.current.currentTime = 0;
          audioRef.current.volume = isMuted ? 0 : volume;
          setAudioReady(true);
        }

        toast(`Spotify synced: ${track.name}`, {
          icon: <Music className="text-green-400" />,
        });
      } catch (error) {
        console.error('Spotify track load error', error);
        setAudioReady(false);
        toast.error(
          error instanceof Error ? error.message : 'Unable to load Spotify preview.',
          { icon: <AlertTriangle className="text-yellow-400" /> },
        );
      } finally {
        setLoading(false);
      }
    };

    loadTrack();
  }, [selectedSpotifyTrack, isMuted, volume]);

  const playTrack = async () => {
    if (!audioRef.current || !audioReady) {
      toast.error('Audio stream not ready yet.');
      return;
    }

    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (error) {
      console.error('Audio play failed', error);
      toast.error('Playback blocked by browser. Interact with the page and try again.');
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    playTrack();
  };

  const toggleMute = () => setIsMuted((prev) => !prev);

  const inc = () => setVolume((value) => Math.min(value + 0.1, 1));
  const dec = () => setVolume((value) => Math.max(value - 0.1, 0));

  return (
    <div className="fixed z-40 bottom-5 right-5 flex items-center bg-black/80 border border-cyan-700 p-3 rounded-full shadow-lg">
      <button
        onClick={togglePlay}
        className="text-cyan-300 hover:text-cyan-100 mx-2 disabled:text-cyan-800"
        disabled={!audioReady || loading}
        aria-label={isPlaying ? 'Pause soundtrack' : 'Play soundtrack'}
      >
        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
      </button>

      <button
        onClick={toggleMute}
        className="text-cyan-300 hover:text-cyan-100 mx-2"
        aria-label="Toggle mute"
      >
        {isMuted ? (
          <VolumeX className="h-5 w-5" />
        ) : volume < 0.5 ? (
          <Volume1 className="h-5 w-5" />
        ) : (
          <Volume2 className="h-5 w-5" />
        )}
      </button>
      <div
        className="flex ml-2 border border-cyan-800 rounded overflow-hidden"
        role="group"
        aria-label="Volume controls"
      >
        <button onClick={dec} className="px-2 text-cyan-300 hover:bg-cyan-900">
          -
        </button>
        <button onClick={inc} className="px-2 text-cyan-300 hover:bg-cyan-900">
          +
        </button>
      </div>

      <div className="ml-3 text-xs text-cyan-400 font-mono truncate max-w-[140px]">
        {loading ? 'Syncing Spotify...' : trackName}
      </div>

      {artistLine && (
        <div className="ml-2 text-[10px] text-cyan-700 font-mono truncate max-w-[120px] hidden sm:block">
          {artistLine}
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;
