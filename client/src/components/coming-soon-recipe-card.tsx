import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Clock, Palette, Zap, Video, Image, ExternalLink } from "lucide-react";

interface ComingSoonRecipeCardProps {
    name: string;
    description: string;
    category: string;
    generationType: 'video' | 'image';
    previewImageUrl?: string;
    videoDuration?: number;
    creditCost: number;
    estimatedRelease?: string;
}

const categoryIcons = {
    "Digital Art": Palette,
    "Social Media": Image,
    "Marketing": Palette,
    "Video": Video,
};

export function ComingSoonRecipeCard({
    name,
    description,
    category,
    generationType,
    previewImageUrl,
    videoDuration,
    creditCost,
    estimatedRelease = "Soon"
}: ComingSoonRecipeCardProps) {
    const CategoryIcon = categoryIcons[category as keyof typeof categoryIcons] || Palette;

    return (
        <div className="relative group h-full">
            {/* Rainbow Border Animation - Disabled state */}
            <div className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-300">
                <div
                    className="absolute inset-0 rounded-2xl bg-gradient-to-r from-gray-400 via-gray-500 to-gray-400 bg-[length:400%_400%] animate-rainbow-shimmer"
                    style={{
                        backgroundSize: '400% 400%',
                        animation: 'rainbow-shimmer 3s linear infinite',
                    }}
                />
            </div>

            {/* Main Card Content */}
            <div className="relative bg-card-bg rounded-xl overflow-hidden hover:bg-gray-800 transition-all h-full flex flex-col">
                {/* Media Preview Section - Non-clickable */}
                <div className="media-preview h-48 bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden flex-shrink-0">
                    {/* Coming Soon Badge - Top Left */}
                    <div className="absolute top-3 left-3 z-10">
                        <Badge className="bg-yellow-600/90 text-white text-xs border-0 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Coming Soon
                        </Badge>
                    </div>

                    {/* Duration Badge - Top Right */}
                    {generationType === 'video' && videoDuration && videoDuration > 0 && (
                        <div className="absolute top-3 right-12 z-10">
                            <Badge className="bg-black/70 text-white text-xs border-0 flex items-center gap-1">
                                <Video className="h-3 w-3" />
                                {videoDuration}s
                            </Badge>
                        </div>
                    )}

                    {/* Credit Cost Badge - Top Right */}
                    <div className="absolute top-3 right-3 z-10">
                        <div className="relative">
                            <div className="absolute inset-0 rounded-full bg-gray-600/90 backdrop-blur-md"></div>
                            <div className="relative px-3 py-1.5 rounded-full text-xs font-medium text-white border border-white/50 bg-white/5 backdrop-blur-md shadow-lg">
                                {creditCost} credits
                            </div>
                        </div>
                    </div>

                    {/* Media content based on recipe type */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        {previewImageUrl ? (
                            <img
                                src={previewImageUrl}
                                alt={`${name} preview`}
                                className="w-full h-full object-cover"
                            />
                        ) : generationType === 'video' ? (
                            <div className="text-center">
                                <Video className="h-16 w-16 text-gray-500 mx-auto mb-2" />
                                <p className="text-sm text-gray-500">Preview coming soon</p>
                            </div>
                        ) : (
                            <div className="text-center">
                                <Image className="h-16 w-16 text-gray-500 mx-auto mb-2" />
                                <p className="text-sm text-gray-500">Preview coming soon</p>
                            </div>
                        )}
                    </div>

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>

                {/* Content Section */}
                <div className="p-6 flex-1 flex flex-col">
                    <div className="mb-4 flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-semibold text-gray-400 transition-colors line-clamp-1">
                                {name}
                            </h3>
                            <ExternalLink className="h-4 w-4 text-gray-500 opacity-50 flex-shrink-0" />
                        </div>
                        <p className="text-gray-500 text-sm line-clamp-3 min-h-[4.5rem] mb-3">{description}</p>

                        {/* Estimated Release */}
                        <div className="mb-3">
                            <Badge variant="outline" className="text-gray-400 border-gray-600 text-xs px-2 py-1">
                                Estimated: {estimatedRelease}
                            </Badge>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-500">
                                In development
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        disabled
                                        className="px-3 py-2 rounded-lg font-medium opacity-50 cursor-not-allowed bg-gray-600 text-gray-400"
                                    >
                                        <Zap className="h-4 w-4 mr-1" />
                                        Instant
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>This feature is coming soon!</p>
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        disabled
                                        className="px-4 py-2 rounded-lg font-medium opacity-50 cursor-not-allowed bg-gray-600 text-gray-400"
                                    >
                                        <Palette className="h-4 w-4 mr-1" />
                                        Build
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>This feature is coming soon!</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ComingSoonRecipeCard; 