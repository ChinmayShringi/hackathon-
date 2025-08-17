import { useState, useEffect } from "react";

export default function ThumbnailTest() {
  const [generations, setGenerations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGenerations() {
      try {
        const response = await fetch('/api/alpha/my-makes?page=1&limit=10&_t=' + Date.now(), {
          credentials: 'include',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        const data = await response.json();
        setGenerations(data.generations || []);
      } catch (error) {
        console.error('Failed to fetch generations:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchGenerations();
  }, []);

  const videoGenerations = generations.filter(gen => gen.videoUrl);

  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-2xl font-bold text-white mb-6">Thumbnail Test Page</h1>
      
      {loading ? (
        <div className="text-white">Loading...</div>
      ) : (
        <div className="space-y-6">
          <div className="text-white">
            <h2 className="text-xl font-semibold mb-4">Video Generations ({videoGenerations.length})</h2>
            
            {videoGenerations.map((gen) => (
              <div key={gen.id} className="bg-card-bg border border-card-border p-4 rounded-lg mb-4">
                <h3 className="text-lg font-medium text-white mb-2">Generation {gen.id}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Video URL:</h4>
                    <p className="text-xs text-gray-400 break-all">{gen.videoUrl}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Thumbnail URL:</h4>
                    <p className="text-xs text-gray-400 break-all">{gen.thumbnailUrl || 'NULL'}</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Preview Test:</h4>
                  <div className="flex gap-4">
                    {gen.thumbnailUrl && (
                      <div className="text-center">
                        <p className="text-xs text-gray-400 mb-1">Thumbnail (GIF)</p>
                        <img 
                          src={gen.thumbnailUrl} 
                          alt="Thumbnail"
                          className="w-32 h-32 object-cover rounded border"
                          onError={(e) => {
                            console.error('Thumbnail failed to load:', gen.thumbnailUrl);
                            e.currentTarget.style.border = '2px solid red';
                          }}
                          onLoad={() => {
                    
                          }}
                        />
                      </div>
                    )}
                    
                    <div className="text-center">
                      <p className="text-xs text-gray-400 mb-1">Video (MP4)</p>
                      <video 
                        src={gen.videoUrl}
                        className="w-32 h-32 object-cover rounded border"
                        onError={(e) => {
                          console.error('Video failed to load:', gen.videoUrl);
                          e.currentTarget.style.border = '2px solid red';
                        }}
                        onLoadStart={() => {
                  
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 