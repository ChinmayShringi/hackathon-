import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { VideoPlayer } from './video-player';

// Mock ReactPlayer to avoid actual video loading in tests
jest.mock('react-player', () => {
  return function MockReactPlayer({ onReady, onProgress, onDuration, ...props }: any) {
    React.useEffect(() => {
      // Simulate video ready
      if (onReady) onReady();
      // Simulate duration
      if (onDuration) onDuration(60); // 60 seconds
      // Simulate progress
      if (onProgress) {
        const interval = setInterval(() => {
          onProgress({ played: 0.1, loaded: 0.5 });
        }, 100);
        return () => clearInterval(interval);
      }
    }, [onReady, onProgress, onDuration]);
    
    return <div data-testid="react-player" {...props} />;
  };
});

describe('VideoPlayer', () => {
  const mockUrl = 'https://example.com/test-video.mp4';

  beforeEach(() => {
    // Mock fullscreen API
    Object.defineProperty(document, 'fullscreenElement', {
      value: null,
      writable: true,
    });
    document.exitFullscreen = jest.fn();
  });

  it('renders with default props', () => {
    render(<VideoPlayer url={mockUrl} />);
    expect(screen.getByTestId('react-player')).toBeInTheDocument();
  });

  it('starts with autoplay enabled by default', () => {
    render(<VideoPlayer url={mockUrl} />);
    const player = screen.getByTestId('react-player');
    expect(player).toHaveAttribute('playing', 'true');
  });

  it('starts with loop enabled by default', () => {
    render(<VideoPlayer url={mockUrl} />);
    const player = screen.getByTestId('react-player');
    expect(player).toHaveAttribute('loop', 'true');
  });

  it('starts with sound enabled by default', () => {
    render(<VideoPlayer url={mockUrl} />);
    const player = screen.getByTestId('react-player');
    expect(player).toHaveAttribute('muted', 'false');
  });

  it('can be configured with custom props', () => {
    render(
      <VideoPlayer 
        url={mockUrl} 
        autoPlay={false}
        loop={false}
        muted={false}
      />
    );
    const player = screen.getByTestId('react-player');
    expect(player).toHaveAttribute('playing', 'false');
    expect(player).toHaveAttribute('loop', 'false');
    expect(player).toHaveAttribute('muted', 'false');
  });

  it('shows play/pause button', () => {
    render(<VideoPlayer url={mockUrl} />);
    expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument();
  });

  it('shows stop button', () => {
    render(<VideoPlayer url={mockUrl} />);
    expect(screen.getByRole('button', { name: /stop/i })).toBeInTheDocument();
  });

  it('shows rewind button', () => {
    render(<VideoPlayer url={mockUrl} />);
    expect(screen.getByRole('button', { name: /rewind/i })).toBeInTheDocument();
  });

  it('shows restart button', () => {
    render(<VideoPlayer url={mockUrl} />);
    expect(screen.getByRole('button', { name: /restart/i })).toBeInTheDocument();
  });

  it('shows loop toggle button', () => {
    render(<VideoPlayer url={mockUrl} />);
    expect(screen.getByRole('button', { name: /loop/i })).toBeInTheDocument();
  });

  it('shows speed control button', () => {
    render(<VideoPlayer url={mockUrl} />);
    expect(screen.getByText('1x')).toBeInTheDocument();
  });

  it('shows volume control button', () => {
    render(<VideoPlayer url={mockUrl} />);
    expect(screen.getByRole('button', { name: /volume/i })).toBeInTheDocument();
  });

  it('shows fullscreen button', () => {
    render(<VideoPlayer url={mockUrl} />);
    expect(screen.getByRole('button', { name: /fullscreen/i })).toBeInTheDocument();
  });

  it('toggles play/pause when center button is clicked', async () => {
    render(<VideoPlayer url={mockUrl} />);
    const playButton = screen.getByRole('button', { name: /pause/i });
    
    fireEvent.click(playButton);
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument();
    });
  });

  it('shows speed menu when speed button is clicked', () => {
    render(<VideoPlayer url={mockUrl} />);
    const speedButton = screen.getByText('1x');
    
    fireEvent.click(speedButton);
    
    expect(screen.getByText('0.5x')).toBeInTheDocument();
    expect(screen.getByText('2x')).toBeInTheDocument();
  });

  it('toggles loop when loop button is clicked', () => {
    render(<VideoPlayer url={mockUrl} />);
    const loopButton = screen.getByRole('button', { name: /loop/i });
    
    // Should start with loop enabled (blue background)
    expect(loopButton).toHaveClass('bg-accent-blue');
    
    fireEvent.click(loopButton);
    
    // Should now have loop disabled (black background)
    expect(loopButton).toHaveClass('bg-black');
  });
}); 