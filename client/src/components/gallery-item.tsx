import { Button } from "@/components/ui/button";

interface GalleryItemProps {
  title: string;
  usageCount: string;
  imageUrl: string;
  color: string;
  onUseRecipe: () => void;
}

export default function GalleryItem({ title, usageCount, imageUrl, color, onUseRecipe }: GalleryItemProps) {
  const colorClasses = {
    blue: 'bg-accent-blue/20 text-accent-blue hover:bg-accent-blue/30',
    purple: 'bg-accent-purple/20 text-accent-purple hover:bg-accent-purple/30',
    pink: 'bg-pink-500/20 text-pink-400 hover:bg-pink-500/30',
    green: 'bg-green-500/20 text-green-400 hover:bg-green-500/30',
    yellow: 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30',
    indigo: 'bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30',
  };

  return (
    <div className="group cursor-pointer">
      <div className="gradient-border mb-4">
        <div className="gradient-border-content p-1">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-64 object-cover rounded-lg"
          />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold mb-1">{title}</h3>
          <p className="text-sm text-gray-400">{usageCount} generations</p>
        </div>
        <Button
          onClick={onUseRecipe}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${colorClasses[color as keyof typeof colorClasses] || colorClasses.blue}`}
          variant="ghost"
        >
          Use Recipe
        </Button>
      </div>
    </div>
  );
}
