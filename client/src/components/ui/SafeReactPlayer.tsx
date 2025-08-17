import React, { useCallback, useRef } from 'react';
import ReactPlayer from 'react-player';

// Use Omit to signal we are handling these props internally
type SafePlayerProps = Omit<any, 'onReady' | 'onDuration'> & {
  onReady?: (player: any) => void;
  onDuration?: (duration: number) => void;
};

const SafeReactPlayer = React.forwardRef<any, SafePlayerProps>((props, ref) => {
  // Destructure the user's callbacks and the rest of the props
  const { onReady, onDuration, url, ...rest } = props;

  // Add debugging for URL


  // A ref to store the ReactPlayer instance
  const playerRef = useRef<any | null>(null);

  // Expose the ref to the parent component
  React.useImperativeHandle(ref, () => playerRef.current!, []);

  // This is our internal handler that we will pass to ReactPlayer.
  // It's wrapped in useCallback for performance optimization.
  const handlePlayerReady = useCallback((player: any) => {
    // Store the ref internally
    playerRef.current = player;

    // 1. Call the user's onReady callback, if provided.
    if (onReady) {
      onReady(player);
    }

    // 2. Get the duration. This is the earliest reliable moment to do so.
    const duration = player.getDuration();
    if (onDuration && duration) {
      // Call the user's onDuration callback, if provided.
      onDuration(duration);
    }
  }, [onReady, onDuration]); // Dependencies for the callback

  return (
    <ReactPlayer
      ref={playerRef}
      {...rest}
      // This is the crucial part. We pass our robust handler to ReactPlayer.
      // This WILL cause the "Unknown event handler" warning, which is expected.
      onReady={handlePlayerReady as any}
      // We no longer pass onDuration here; it's handled inside onReady.
    />
  );
});

SafeReactPlayer.displayName = 'SafeReactPlayer';

export default SafeReactPlayer; 