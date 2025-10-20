
import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Volume1, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface MusicPlayerProps {
  audioUrl?: string;
  defaultVolume?: number;
  systemState?: 'overlord' | 'assessor' | 'oracle' | 'judge' | 'executor' | 'network';
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ 
  audioUrl, 
  defaultVolume = 0.25,
  systemState = 'overlord',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(defaultVolume);
  const [isMuted, setIsMuted] = useState(false);
  const [trackName, setTrackName] = useState('Initializing Grid Audio…');
  const [showStartOverlay, setShowStartOverlay] = useState(true);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // === Contextual Tracks for Each System Layer ===
  const soundMap: Record<string, { name: string; url: string }> = {
    overlord: {
      name: 'Overlord Ambient (System Core)',
      url: 'https://cdn.pixabay.com/download/audio/2023/05/07/audio_73b9bb77e1.mp3',
    },
    assessor: {
      name: 'Assessor Pulse (Signal Analysis)',
      url: 'https://cdn.pixabay.com/download/audio/2023/05/17/audio_9e7d2d47e7.mp3',
    },
    oracle: {
      name: 'Oracle Ether (Doctrine Layer)',
      url: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_0cfc4c1ab1.mp3',
    },
    judge: {
      name: 'Judge Drone (Verdict Engine)',
      url: 'https://cdn.pixabay.com/download/audio/2023/02/18/audio_6b8c4b2c23.mp3',
    },
    executor: {
      name: 'Executor March (Action Layer)',
      url: 'https://cdn.pixabay.com/download/audio/2022/03/22/audio_255b8a3cc5.mp3',
    },
    network: {
      name: 'Neural Net Sync (Global Grid)',
      url: 'https://cdn.pixabay.com/download/audio/2022/02/17/audio_5a1711eb31.mp3',
    },
  };

  // Choose track by systemState
  const selectedTrack = soundMap[systemState] || soundMap['overlord'];

  // Check localStorage for audio preference
  useEffect(() => {
    const audioEnabled = localStorage.getItem('mostar-audio-enabled');
    if (audioEnabled === 'true') {
      setShowStartOverlay(false);
    }
  }, []);

  // Initialize audio only when user permits
  useEffect(() => {
    if (!audioInitialized || !audioRef.current) return;

    setTrackName(selectedTrack.name);
    audioRef.current.src = selectedTrack.url;
    audioRef.current.loop = true;
    audioRef.current.volume = volume;

    if (isPlaying) {
      audioRef.current.play().catch(error => {
        console.error('Audio play error:', error);
        setIsPlaying(false);
      });
    }
  }, [systemState, audioInitialized]);

  // Initialize AudioContext and Audio element with user gesture
  const initializeAudio = async () => {
    try {
      // Create AudioContext (requires user gesture)
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      // Resume AudioContext if suspended
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      // Create Audio element
      if (!audioRef.current) {
        audioRef.current = new Audio(selectedTrack.url);
        audioRef.current.loop = true;
        audioRef.current.volume = volume;
      }

      setAudioInitialized(true);
      setShowStartOverlay(false);
      localStorage.setItem('mostar-audio-enabled', 'true');

      // Start playing
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            toast(`🎵 Now playing: ${selectedTrack.name}`, {
              icon: <Zap className="h-5 w-5 text-mostar-cyan" />,
              style: { background: 'rgba(10,14,23,0.9)', border: '1px solid rgba(0,255,255,0.3)', color: '#00ffff' },
            });
          })
          .catch(error => {
            console.error('Play error:', error);
            setIsPlaying(false);
            toast('Failed to start audio. Please try again.');
          });
      }
    } catch (error) {
      console.error('Audio initialization error:', error);
      toast('Could not initialize audio system.');
    }
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

  // Smooth volume transitions
  useEffect(() => {
    if (audioRef.current) {
      const targetVolume = isMuted ? 0 : volume;
      const step = (targetVolume - audioRef.current.volume) / 10;
      let frame = 0;
      const smoothAdjust = setInterval(() => {
        if (!audioRef.current) return;
        if (frame >= 10) return clearInterval(smoothAdjust);
        audioRef.current.volume += step;
        frame++;
      }, 30);
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!audioInitialized) {
      initializeAudio();
      return;
    }
    
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      toast('⏸️ Audio paused');
    } else {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          toast('▶️ Audio resumed');
        })
        .catch(error => {
          console.error('Play error:', error);
          toast('Failed to play audio');
        });
    }
  };

  const toggleMute = () => setIsMuted(!isMuted);
  const increaseVolume = () => setVolume(v => Math.min(v + 0.1, 1));
  const decreaseVolume = () => setVolume(v => Math.max(v - 0.1, 0));

  return (
    <>
      {/* Start Audio Overlay */}
      {showStartOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-mostar-dark border-2 border-mostar-light-blue/50 rounded-lg p-8 max-w-md text-center shadow-2xl shadow-mostar-cyan/30">
            <Zap className="h-16 w-16 text-mostar-cyan mx-auto mb-4 animate-pulse" />
            <h2 className="text-2xl font-bold text-white mb-2">MoStar Grid Audio</h2>
            <p className="text-mostar-light-blue mb-6">
              Enable ambient system audio for enhanced grid monitoring experience
            </p>
            <button
              onClick={initializeAudio}
              className="px-6 py-3 bg-mostar-blue hover:bg-mostar-cyan text-white font-bold rounded-lg transition-colors shadow-lg shadow-mostar-blue/50 hover:shadow-mostar-cyan/50"
            >
              ▶ Activate Audio System
            </button>
            <button
              onClick={() => {
                setShowStartOverlay(false);
                localStorage.setItem('mostar-audio-enabled', 'false');
              }}
              className="ml-3 px-6 py-3 bg-transparent hover:bg-white/10 text-mostar-light-blue font-bold rounded-lg transition-colors border border-mostar-light-blue/30"
            >
              Skip
            </button>
          </div>
        </div>
      )}

      {/* Music Player Controls */}
      <div className="fixed flex items-center justify-center z-40 bottom-5 right-5 p-2 bg-mostar-dark/80 backdrop-blur-md border border-mostar-light-blue/30 rounded-full shadow-lg shadow-mostar-blue/20 transition-all hover:shadow-mostar-cyan/30">
        <div className="flex items-center space-x-2">
        <button 
          onClick={togglePlay}
          className="p-2 rounded-full hover:bg-mostar-blue/20 text-mostar-light-blue transition-colors"
          aria-label={isPlaying ? "Pause music" : "Play music"}
        >
          {isPlaying ? <span className="text-xs font-mono">◼</span> : <span className="text-xs font-mono">▶</span>}
        </button>

        <button 
          onClick={toggleMute}
          className="p-2 rounded-full hover:bg-mostar-blue/20 text-mostar-light-blue transition-colors"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
            <VolumeX className="h-4 w-4" />
          ) : volume < 0.4 ? (
            <Volume1 className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </button>

        <div className="flex ml-1 border border-mostar-light-blue/30 rounded overflow-hidden">
          <button 
            onClick={decreaseVolume}
            className="p-1 text-mostar-light-blue text-xs transition-colors hover:bg-mostar-blue/20 border-r border-mostar-light-blue/20"
            aria-label="Decrease volume"
          >
            -
          </button>
          <button 
            onClick={increaseVolume}
            className="p-1 text-mostar-light-blue text-xs transition-colors hover:bg-mostar-blue/20"
            aria-label="Increase volume"
          >
            +
          </button>
        </div>
      </div>

        <div className="ml-3 text-[10px] font-mono text-white/60 hidden sm:block">
          {trackName}
        </div>
      </div>
    </>
  );
};

export default MusicPlayer;
