import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Zap, Sparkles, CheckCircle, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InstantMakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  generationData?: {
    generationId: number;
    shortId?: string;
    videoUrl?: string;
    thumbnailUrl?: string;
  };
}

export default function InstantMakeModal({ isOpen, onClose, generationData }: InstantMakeModalProps) {
  console.log('🎭 InstantMakeModal render:', { isOpen, generationData });
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showPing, setShowPing] = useState(false);

  useEffect(() => {
    if (isOpen && !isComplete) {
      // Reset state
      setProgress(0);
      setIsComplete(false);
      setShowPing(false);

      // Start progress animation
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsComplete(true);
            setShowPing(true);
            return 100;
          }
          return prev + Math.random() * 15 + 5; // Random increments for excitement
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setIsComplete(false);
      setShowPing(false);
    }
  }, [isOpen]);

  const handleViewGeneration = () => {
    if (generationData?.shortId) {
      const isAlphaSite = import.meta.env.VITE_SITE_DEPLOYMENT_TYPE === 'alpha';
      const route = isAlphaSite ? `/alpha/m/${generationData.shortId}` : `/asset-viewer/${generationData.generationId}`;
      window.open(route, '_blank');
    }
    onClose();
  };

  const handleClose = () => {
    if (isComplete) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-purple-900/90 to-blue-900/90 border-purple-500/50 backdrop-blur-xl">
        <DialogHeader className="text-center">
          <DialogTitle className="flex items-center justify-center gap-2 text-2xl font-bold text-white">
            <Zap className="h-8 w-8 text-yellow-400 animate-pulse" />
            Instant Make
            <Zap className="h-8 w-8 text-yellow-400 animate-pulse" />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {!isComplete ? (
            // Progress Phase
            <div className="space-y-4">
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center animate-pulse">
                    <Zap className="h-12 w-12 text-white animate-bounce" />
                  </div>
                  <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full opacity-75 animate-spin"></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-300">
                  <span>⚡ Lightning Processing</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress 
                  value={progress} 
                  className="h-3 bg-gray-700"
                  style={{
                    background: 'linear-gradient(90deg, #8b5cf6, #3b82f6, #f59e0b, #ef4444)',
                    backgroundSize: '400% 400%',
                    animation: 'gradient-shift 2s ease infinite'
                  }}
                />
              </div>

              <div className="text-center space-y-2">
                <p className="text-white font-medium">Creating your masterpiece...</p>
                <div className="flex justify-center gap-1">
                  {[...Array(3)].map((_, i) => (
                    <Sparkles 
                      key={i} 
                      className={cn(
                        "h-4 w-4 text-yellow-400",
                        i === Math.floor(progress / 33) && "animate-ping"
                      )} 
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Complete Phase
            <div className="space-y-6 text-center">
              <div className="relative">
                {showPing && (
                  <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
                )}
                <div className="relative w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-12 w-12 text-white" />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Ready to Rock! 🎉</h3>
                <p className="text-gray-300">Your instant creation is ready to dazzle!</p>

                {generationData?.thumbnailUrl && (
                  <div className="relative group cursor-pointer" onClick={handleViewGeneration}>
                    <img 
                      src={generationData.thumbnailUrl} 
                      alt="Generated content preview"
                      className="w-full h-48 object-cover rounded-lg border-2 border-purple-500/50 group-hover:border-purple-400 transition-colors"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <Play className="h-12 w-12 text-white" />
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button 
                    onClick={handleViewGeneration}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    View Creation
                  </Button>
                  <Button 
                    onClick={onClose}
                    variant="outline"
                    className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes gradient-shift {
              0%, 100% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
            }
          `
        }} />
      </DialogContent>
    </Dialog>
  );
} 