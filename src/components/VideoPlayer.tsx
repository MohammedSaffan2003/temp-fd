import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward } from 'lucide-react';

interface VideoPlayerProps {
  url: string;
  thumbnail: string;
  onEnded?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, thumbnail, onEnded }) => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const playerRef = useRef<ReactPlayer>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setPlaying(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleProgress = ({ played }: { played: number }) => {
    setProgress(played * 100);
  };

  const handleDuration = (duration: number) => {
    setDuration(duration);
    // Restrict video length to 40 seconds
    if (duration > 40) {
      console.warn('Video exceeds 40 seconds limit');
    }
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    setProgress(percent * 100);
    playerRef.current?.seekTo(percent);
  };

  const formatTime = (seconds: number) => {
    const pad = (num: number) => num.toString().padStart(2, '0');
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${pad(minutes)}:${pad(remainingSeconds)}`;
  };

  return (
    <div className="relative group bg-black rounded-lg overflow-hidden">
      <ReactPlayer
        ref={playerRef}
        url={url}
        width="100%"
        height="100%"
        playing={playing}
        volume={volume}
        muted={muted}
        onProgress={handleProgress}
        onDuration={handleDuration}
        onEnded={onEnded}
        light={thumbnail}
        controls={false}
        playIcon={
          <button className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center">
            <Play className="w-8 h-8 fill-white ml-1" />
          </button>
        }
      />

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <div
          ref={progressBarRef}
          className="w-full h-1 bg-gray-600 rounded cursor-pointer mb-4"
          onClick={handleProgressBarClick}
        >
          <div
            className="h-full bg-red-600 rounded relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-red-600 rounded-full opacity-0 group-hover:opacity-100" />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setPlaying(!playing)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              {playing ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6" />
              )}
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  if (playerRef.current) {
                    playerRef.current.seekTo(Math.max(0, playerRef.current.getCurrentTime() - 10));
                  }
                }}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <SkipBack className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  if (playerRef.current) {
                    playerRef.current.seekTo(Math.min(duration, playerRef.current.getCurrentTime() + 10));
                  }
                }}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={() => setMuted(!muted)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              {muted ? (
                <VolumeX className="w-6 h-6" />
              ) : (
                <Volume2 className="w-6 h-6" />
              )}
            </button>

            <div className="text-sm">
              {formatTime(playerRef.current?.getCurrentTime() || 0)} / {formatTime(duration)}
            </div>
          </div>

          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <Maximize className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;