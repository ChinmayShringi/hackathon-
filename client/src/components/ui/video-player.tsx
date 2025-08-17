import React, { useState, useRef, useEffect, useCallback } from 'react';
import SafeReactPlayer from './SafeReactPlayer';
import { Button } from './button';
import { Slider } from './slider';
import {
    Play,
    Pause,
    Volume2,
    VolumeX,
    Maximize,
    RotateCcw,
    RotateCw,
    Square,
    Settings,
    Repeat,
    Repeat1,
    Zap,
    ZapOff
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getAspectRatioClassFromMetadata, VideoMetadata } from '@/lib/videoUtils';

interface VideoPlayerProps {
    url: string;
    poster?: string;
    className?: string;
    onReady?: () => void;
    onError?: (error: any) => void;
    autoPlay?: boolean;
    loop?: boolean;
    muted?: boolean;
    metadata?: VideoMetadata;
    aspectRatioClass?: string;
}

export function VideoPlayer({
    url,
    poster,
    className,
    onReady,
    onError,
    autoPlay = true,
    loop = true,
    muted = false,
    metadata,
    aspectRatioClass
}: VideoPlayerProps) {
    // Add debugging
    
    
    const [playing, setPlaying] = useState(autoPlay);
    const [volume, setVolume] = useState(0.8);
    const [mutedState, setMutedState] = useState(muted);
    const [played, setPlayed] = useState(0);
    const [loaded, setLoaded] = useState(0);
    const [duration, setDuration] = useState(0);
    const [seeking, setSeeking] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [fullscreen, setFullscreen] = useState(false);
    const [loopEnabled, setLoopEnabled] = useState(loop);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [showSpeedMenu, setShowSpeedMenu] = useState(false);
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [dynamicAspectClass, setDynamicAspectClass] = useState<string | null>(null);

    const playerRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const controlsTimeoutRef = useRef<NodeJS.Timeout>();

    const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2];

    // Determine aspect ratio class
    const getAspectRatioClass = () => {
        if (dynamicAspectClass) return dynamicAspectClass;
        if (aspectRatioClass) return aspectRatioClass;
        if (metadata) return getAspectRatioClassFromMetadata(metadata);
        return 'aspect-video';
    };

    const containerAspectClass = getAspectRatioClass();



    // Reset error state when URL changes
    useEffect(() => {
        setHasError(false);
    
        
        // Additional debugging for URL validation
        if (url && url.includes('/api/stream-video/')) {
            const shortId = url.split('/api/stream-video/')[1];
    
            if (!shortId || shortId === 'undefined' || shortId === 'null' || shortId === 'NaN') {
                console.error('VideoPlayer received invalid shortId:', shortId);
                setHasError(true);
            }
        }
    }, [url]);

    // Don't render if URL is invalid
    if (!url || url.includes('undefined') || url.includes('null') || url.includes('NaN')) {
        console.error('VideoPlayer received invalid URL:', url);
        return (
            <div className={cn("relative bg-black rounded-lg overflow-hidden group mt-2 mb-2", containerAspectClass, className)}>
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="text-white text-center p-4">
                        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                            <Play className="h-8 w-8 text-red-500" />
                        </div>
                        <p className="text-sm font-medium mb-2">Invalid Video URL</p>
                        <p className="text-xs text-gray-400 mb-4">Unable to load video</p>
                    </div>
                </div>
            </div>
        );
    }

    // Auto-hide controls after 3 seconds
    useEffect(() => {
        if (playing && showControls) {
            controlsTimeoutRef.current = setTimeout(() => {
                setShowControls(false);
            }, 3000);
        }
        return () => {
            if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current);
            }
        };
    }, [playing, showControls]);

    const handlePlayPause = useCallback(() => {
        if (playerRef.current) {
            const video = playerRef.current as HTMLVideoElement;
            if (playing) {
                video.pause();
            } else {
                video.play();
            }
        }
        setPlaying(!playing);
    }, [playing]);

    const handleStop = useCallback(() => {
        setPlaying(false);
        if (playerRef.current) {
            const video = playerRef.current as HTMLVideoElement;
            video.currentTime = 0;
            setPlayed(0);
        }
    }, []);

    const handleRewind = useCallback(() => {
        if (playerRef.current) {
            const video = playerRef.current as HTMLVideoElement;
            const newTime = Math.max(0, video.currentTime - 10);
            video.currentTime = newTime;
            setPlayed(newTime / video.duration);
        }
    }, [played, duration]);

    const handleVolumeChange = useCallback((value: number[]) => {
        setVolume(value[0]);
        setMutedState(value[0] === 0);
    }, []);

    const handleSeek = useCallback((value: number[]) => {
        setSeeking(true);
        setPlayed(value[0]);
    }, []);

    const handleSeekMouseDown = useCallback(() => {
        setSeeking(true);
    }, []);

    const handleSeekMouseUp = useCallback((value: number[]) => {
        setSeeking(false);
        if (playerRef.current) {
            const video = playerRef.current as HTMLVideoElement;
            video.currentTime = value[0] * video.duration;
        }
    }, []);

    const handleProgress = useCallback((state: { played: number; loaded: number }) => {
        if (!seeking) {
            setPlayed(state.played);
        }
        setLoaded(state.loaded);
    }, [seeking]);

    const handleDuration = useCallback((duration: number) => {
        setDuration(duration);
    }, []);

    const handleReady = useCallback(() => {

        if (onReady) {
            onReady();
        }
    }, [onReady]);

    const handleError = useCallback((error: any) => {
        console.error('VideoPlayer error:', error);
        setHasError(true);
        if (onError) {
            onError(error);
        }
    }, [onError]);

    const handleToggleMuted = useCallback(() => {
        setMutedState(!mutedState);
    }, [mutedState]);

    const handleToggleFullscreen = useCallback(() => {
        if (containerRef.current) {
            if (!fullscreen) {
                if (containerRef.current.requestFullscreen) {
                    containerRef.current.requestFullscreen();
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
            }
            setFullscreen(!fullscreen);
        }
    }, [fullscreen]);

    const handleRestart = useCallback(() => {
        if (playerRef.current) {
            const video = playerRef.current as HTMLVideoElement;
            video.currentTime = 0;
            setPlayed(0);
        }
    }, []);

    const handleToggleLoop = useCallback(() => {
        setLoopEnabled(!loopEnabled);
    }, [loopEnabled]);

    const handleSpeedChange = useCallback((rate: number) => {
        setPlaybackRate(rate);
        setShowSpeedMenu(false);
    }, []);

    const formatTime = useCallback((seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }, []);

    const handleMouseMove = useCallback(() => {
        setShowControls(true);
        if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
        }
    }, []);

    return (
        <div
            ref={containerRef}
            className={cn(
                "relative bg-black rounded-lg overflow-hidden group mt-2 mb-2",
                containerAspectClass,
                className
            )}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => {
                if (playing) {
                    setShowControls(false);
                }
            }}
        >
            <video
                    ref={playerRef}
                    src={url}
                    poster={poster}
                    autoPlay={autoPlay}
                    loop={loopEnabled}
                    muted={mutedState}
                    controls={true}
                    className="w-full h-full object-contain"
                    onLoadedMetadata={(e) => {
                        const video = e.target as HTMLVideoElement;
                        setDuration(video.duration);
                        // Runtime orientation detection
                        if (!aspectRatioClass && !metadata) {
                            if (video.videoWidth && video.videoHeight) {
                                if (video.videoWidth === video.videoHeight) {
                                    setDynamicAspectClass('aspect-square');
                                } else if (video.videoWidth > video.videoHeight) {
                                    setDynamicAspectClass('aspect-video');
                                } else {
                                    setDynamicAspectClass('aspect-[9/16]');
                                }
                            }
                        }
                        handleReady();
                    }}
                    onError={handleError}
                    onTimeUpdate={(e) => {
                        const video = e.target as HTMLVideoElement;
                        if (!seeking) {
                            setPlayed(video.currentTime / video.duration);
                        }
                        setLoaded(video.buffered.length > 0 ? video.buffered.end(video.buffered.length - 1) / video.duration : 0);
                    }}
                    onCanPlay={(e) => {
                        const video = e.target as HTMLVideoElement;
                        setDuration(video.duration);
                    }}
                    crossOrigin="anonymous"
                    preload="metadata"
                />
            
            {/* COMMENTED OUT: SafeReactPlayer for testing
            <SafeReactPlayer
                ref={playerRef}
                url={url}
                playing={playing}
                volume={mutedState ? 0 : volume}
                playbackRate={playbackRate}
                loop={loopEnabled}
                width="100%"
                height="100%"
                onReady={handleReady}
                onError={handleError}
                onProgress={handleProgress}
                onDuration={handleDuration}
                controls={false}
                light={poster}
                muted={mutedState}
                config={{
                    file: {
                        attributes: {
                            crossOrigin: "anonymous",
                            preload: "metadata"
                        },
                        forceVideo: true
                    }
                }}
            />
            */}

            {/* HIDDEN: Custom Controls Overlay - Using native HTML5 controls instead */}
            {/* 
            <div className={cn(
                "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-all duration-300",
                showControls ? "opacity-100" : "opacity-0"
            )}>
                ... custom controls removed for now ...
            </div>
            */}

            {/* Loading Indicator */}
            {loaded < 1 && !hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="text-white text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-blue mx-auto mb-2"></div>
                        <p className="text-sm">Loading...</p>
                    </div>
                </div>
            )}

            {/* Error Display */}
            {hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="text-white text-center p-4">
                        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                            <Play className="h-8 w-8 text-red-500" />
                        </div>
                        <p className="text-sm font-medium mb-2">Video Failed to Load</p>
                        <p className="text-xs text-gray-400 mb-4">Unable to play this video</p>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setHasError(false);
                                setPlaying(true);
                            }}
                            className="text-white border-white/20 hover:bg-white/10"
                        >
                            Try Again
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
} 