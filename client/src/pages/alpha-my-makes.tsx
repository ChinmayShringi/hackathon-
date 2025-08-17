import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Clock, CheckCircle, XCircle, Loader2, Eye, Download, RefreshCw, AlertCircle, X, Play, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { Generation } from "@shared/schema";
import AlphaHeader from "@/components/alpha-header";
import { VideoPlayer } from '@/components/ui/video-player';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ALPHA_CONFIG } from '@/config';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from "@/components/ui/select";
import { LucideIcon } from '@/components/ui/LucideIcon';
import { useTagIcons } from '@/hooks/useTagIcons';
import { getGenerationAspectRatioClass } from '@/lib/videoUtils';

export default function AlphaMyMakes() {
  const queryClient = useQueryClient();
  const [location, setLocation] = useLocation();
  const { enhanceTagDisplayData, isLoading: iconsLoading } = useTagIcons();

  // Parse page and filter from URL search params
  const urlParams = new URLSearchParams(window.location.search);
  const initialPage = parseInt(urlParams.get('page') || '1');
  const initialLimit = parseInt(urlParams.get('per_page') || '5');
  const initialFilter = urlParams.get('status') || 'all';

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialLimit);
  const [totalPages, setTotalPages] = useState(1);
  const [totalGenerations, setTotalGenerations] = useState(0);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed' | 'failed'>(initialFilter as any);

  // Page size options for pagination
  const pageSizeOptions = [5, 10, 20, 50];

  // Update URL when page or page size changes
  const updateUrl = (page: number, limit: number, status: string) => {
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('page', page.toString());
    newUrl.searchParams.set('per_page', limit.toString());
    if (status && status !== 'all') {
      newUrl.searchParams.set('status', status);
    } else {
      newUrl.searchParams.delete('status');
    }
    setLocation(newUrl.pathname + newUrl.search);
  };

  // Update URL when page or page size changes
  const updatePageInUrl = (page: number, limit?: number) => {
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('page', page.toString());
    if (limit) {
      newUrl.searchParams.set('per_page', limit.toString());
    }
    if (filterStatus && filterStatus !== 'all') {
      newUrl.searchParams.set('status', filterStatus);
    } else {
      newUrl.searchParams.delete('status');
    }
    setLocation(newUrl.pathname + newUrl.search);
  };

  // Get guest generations with pagination and filtering
  const { data: response, isLoading, refetch } = useQuery<{
    generations: Generation[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrevious: boolean;
    };
  }>({
    queryKey: ["/api/alpha/my-makes", currentPage, pageSize, filterStatus],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        per_page: pageSize.toString()
      });

      if (filterStatus !== 'all') {
        queryParams.set('status', filterStatus);
      }

      const response = await fetch(`/api/alpha/my-makes?${queryParams.toString()}`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch generations');
      }
      const data = await response.json();

      // Debug: Log thumbnail URLs for video generations
      const videoGenerations = data.generations?.filter((gen: any) => gen.videoUrl) || [];


      return data;
    },
    refetchInterval: 10000, // Poll every 10 seconds for updates (reduced from 2s)
    retry: 3, // FIXED: Add retry logic for database connection issues
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    staleTime: 1000, // Consider data stale after 1 second for real-time updates
  });

  // Fetch global stats for all guest generations
  const { data: globalStats } = useQuery<{ pending: number; completed: number; failed: number; total: number }>({
    queryKey: ["/api/alpha/my-makes-stats"],
    queryFn: async () => {
      const response = await fetch(`/api/alpha/my-makes-stats`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch global stats');
      }
      return response.json();
    },
    refetchInterval: 10000, // Poll every 10 seconds (reduced from 2s)
    retry: 3, // FIXED: Add retry logic for database connection issues
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    staleTime: 1000, // Consider data stale after 1 second for real-time updates
  });

  const generations = response?.generations || [];
  const pagination = response?.pagination;

  // Sort generations to prioritize pending/processing
  const sortedGenerations = generations.sort((a, b) => {
    // Priority order: pending > processing > completed > failed
    const statusPriority = {
      'pending': 0,
      'processing': 1,
      'completed': 2,
      'failed': 3
    };

    const aPriority = statusPriority[a.status as keyof typeof statusPriority] ?? 4;
    const bPriority = statusPriority[b.status as keyof typeof statusPriority] ?? 4;

    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }

    // If same status, sort by creation date (newest first)
    return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
  });

  // Update pagination state when response changes
  useEffect(() => {
    if (pagination) {
      setTotalPages(pagination.totalPages);
      setTotalGenerations(pagination.total);
    }
  }, [pagination]);

  // Cache warming - pre-fetch adjacent pages
  useEffect(() => {
    const prefetchAdjacentPages = async () => {
      if (totalPages <= 1) return;

      try {
        const buildQueryParams = (page: number) => {
          const queryParams = new URLSearchParams({
            page: page.toString(),
            per_page: pageSize.toString()
          });

          if (filterStatus !== 'all') {
            queryParams.set('status', filterStatus);
          }

          return queryParams.toString();
        };

        // Pre-fetch next page
        if (currentPage < totalPages) {
          await queryClient.prefetchQuery({
            queryKey: ["/api/alpha/my-makes", currentPage + 1, pageSize, filterStatus],
            queryFn: async () => {
              const response = await fetch(`/api/alpha/my-makes?${buildQueryParams(currentPage + 1)}`, {
                credentials: 'include'
              });
              if (!response.ok) {
                throw new Error('Failed to fetch generations');
              }
              return response.json();
            },
            staleTime: 5 * 60 * 1000, // 5 minutes
          });
        }

        // Pre-fetch previous page
        if (currentPage > 1) {
          await queryClient.prefetchQuery({
            queryKey: ["/api/alpha/my-makes", currentPage - 1, pageSize, filterStatus],
            queryFn: async () => {
              const response = await fetch(`/api/alpha/my-makes?${buildQueryParams(currentPage - 1)}`, {
                credentials: 'include'
              });
              if (!response.ok) {
                throw new Error('Failed to fetch generations');
              }
              return response.json();
            },
            staleTime: 5 * 60 * 1000, // 5 minutes
          });
        }
      } catch (error) {
        // Silently fail - this is just pre-fetching
        console.debug('Cache warming failed:', error);
      }
    };

    prefetchAdjacentPages();
  }, [currentPage, totalPages, pageSize, filterStatus, queryClient]);

  // Pre-fetch generation data on hover
  const prefetchGeneration = async (shortId: string) => {
    try {
      await queryClient.prefetchQuery({
        queryKey: ["/api/alpha/generation", shortId],
        queryFn: async () => {
          const response = await fetch(`/api/alpha/generation/${shortId}`, {
            credentials: 'include'
          });
          if (!response.ok) {
            throw new Error('Failed to fetch generation');
          }
          return response.json();
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
      });
    } catch (error) {
      // Silently fail - this is just pre-fetching
      console.debug('Pre-fetch failed for generation:', shortId, error);
    }
  };

  // Get queue stats
  const { data: queueStats } = useQuery({
    queryKey: ["/api/queue/stats"],
    refetchInterval: 1000,
  });

  // Get guest stats for the badge
  const { data: guestStats } = useQuery<{ used: number; remaining: number; refreshSecondsLeft?: number }>({
    queryKey: ["/api/alpha/guest-stats"],
    queryFn: async () => {
      const response = await fetch("/api/alpha/guest-stats");
      if (!response.ok) throw new Error("Failed to fetch guest stats");
      return response.json();
    },
    refetchInterval: 30000, // Poll every 30 seconds
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "processing":
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getQueuePosition = (generationId: number) => {
    if (!queueStats || typeof queueStats !== 'object' || !('queue' in queueStats) || !Array.isArray((queueStats as any).queue)) return null;
    const position = (queueStats as any).queue.findIndex((item: any) => item.generationId === generationId);
    return position >= 0 ? position + 1 : null;
  };

  const getEstimatedTime = (position: number) => {
    // Rough estimate: 2 minutes per generation
    const minutes = position * 2;
    if (minutes < 60) return `~${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `~${hours}h ${remainingMinutes}m`;
  };

  // Function to render Lucide icon dynamically
  const renderLucideIcon = (iconName: string) => {
    if (!iconName) return null;

    // Convert kebab-case to PascalCase for Lucide component names
    const pascalCaseName = iconName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');

    const IconComponent = (LucideIcons as any)[pascalCaseName];

    if (IconComponent) {
      return <IconComponent className="w-3 h-3" />;
    }

    // No fallback - just return null if icon not found
    return null;
  };


  // Filter handler
  const handleFilterChange = (status: 'all' | 'pending' | 'completed' | 'failed') => {
    setFilterStatus(status);
    setCurrentPage(1); // Reset to first page when changing filter
    updateUrl(1, pageSize, status);
  };

  // Pagination handlers
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      updateUrl(page, pageSize, filterStatus);
    }
  };

  const goToNextPage = () => {
    if (pagination?.hasNext) {
      setCurrentPage(currentPage + 1);
      updateUrl(currentPage + 1, pageSize, filterStatus);
    }
  };

  const goToPreviousPage = () => {
    if (pagination?.hasPrevious) {
      setCurrentPage(currentPage - 1);
      updateUrl(currentPage - 1, pageSize, filterStatus);
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
    updateUrl(1, newPageSize, filterStatus);
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Clean Alpha Header */}
      <AlphaHeader
        rightContent={
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setLocation("/")}
              className="text-white hover:bg-accent-blue/20"
            >
              My Makes
              {guestStats && guestStats.used > 0 && (
                <Badge className="ml-2 bg-accent-blue text-white text-xs px-1.5 py-0.5 animate-pulse">
                  {guestStats.used}
                </Badge>
              )}
            </Button>
          </div>
        }
      />

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Queue Status Banner */}
        {queueStats && typeof queueStats === 'object' && 'isProcessing' in queueStats && (queueStats as any).isProcessing && (
          <div className="mb-6 bg-blue-900/20 border border-blue-700 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
              <div className="flex-1">
                <h3 className="text-white font-medium">Generation Queue Active</h3>
                <p className="text-blue-300 text-sm">
                  Processing {(queueStats as any).currentlyProcessing?.recipeTitle || 'next item'} • {(queueStats as any).queueLength ?? 0} in queue
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Filter Tabs - Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {/* All Tab */}
          <button
            onClick={() => handleFilterChange('all')}
            className={`bg-card-bg p-4 rounded-lg border transition-all duration-200 text-left hover:scale-105 ${filterStatus === 'all'
                ? 'border-accent-blue bg-accent-blue/10 shadow-lg'
                : 'border-card-border hover:border-gray-500'
              }`}
          >
            <div className="text-2xl font-bold text-blue-400">{globalStats ? globalStats.total : '-'}</div>
            <div className={`text-sm ${filterStatus === 'all' ? 'text-blue-300' : 'text-gray-400'}`}>All</div>
          </button>

          {/* In Queue Tab */}
          <button
            onClick={() => handleFilterChange('pending')}
            className={`bg-card-bg p-4 rounded-lg border transition-all duration-200 text-left hover:scale-105 ${filterStatus === 'pending'
                ? 'border-yellow-500 bg-yellow-500/10 shadow-lg'
                : 'border-card-border hover:border-gray-500'
              }`}
          >
            <div className="text-2xl font-bold text-yellow-400">{globalStats ? globalStats.pending : '-'}</div>
            <div className={`text-sm ${filterStatus === 'pending' ? 'text-yellow-300' : 'text-gray-400'}`}>In Queue</div>
          </button>

          {/* Completed Tab */}
          <button
            onClick={() => handleFilterChange('completed')}
            className={`bg-card-bg p-4 rounded-lg border transition-all duration-200 text-left hover:scale-105 ${filterStatus === 'completed'
                ? 'border-green-500 bg-green-500/10 shadow-lg'
                : 'border-card-border hover:border-gray-500'
              }`}
          >
            <div className="text-2xl font-bold text-green-400">{globalStats ? globalStats.completed : '-'}</div>
            <div className={`text-sm ${filterStatus === 'completed' ? 'text-green-300' : 'text-gray-400'}`}>Completed</div>
          </button>

          {/* Failed Tab */}
          <button
            onClick={() => handleFilterChange('failed')}
            className={`bg-card-bg p-4 rounded-lg border transition-all duration-200 text-left hover:scale-105 ${filterStatus === 'failed'
                ? 'border-red-500 bg-red-500/10 shadow-lg'
                : 'border-card-border hover:border-gray-500'
              }`}
          >
            <div className="text-2xl font-bold text-red-400">{globalStats ? globalStats.failed : '-'}</div>
            <div className={`text-sm ${filterStatus === 'failed' ? 'text-red-300' : 'text-gray-400'}`}>Failed</div>
          </button>
        </div>

        {/* Active Filter Indicator */}
        {filterStatus !== 'all' && (
          <div className="mb-6 flex items-center gap-2">
            <span className="text-sm text-gray-400">Showing:</span>
            <Badge variant="outline" className={`
              ${filterStatus === 'pending' ? 'border-yellow-500 text-yellow-400' : ''}
              ${filterStatus === 'completed' ? 'border-green-500 text-green-400' : ''}
              ${filterStatus === 'failed' ? 'border-red-500 text-red-400' : ''}
            `}>
              {filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)} only
            </Badge>
            <button
              onClick={() => handleFilterChange('all')}
              className="text-xs text-gray-400 hover:text-white underline"
            >
              Clear filter
            </button>
          </div>
        )}

        {/* Generations List */}
        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-accent-blue" />
            <p className="text-gray-400">Loading your creations...</p>
          </div>
        ) : totalGenerations === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">
              {filterStatus === 'pending' ? '⏳' :
                filterStatus === 'completed' ? '✅' :
                  filterStatus === 'failed' ? '❌' : '🎨'}
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {filterStatus === 'all' ? 'No creations yet' :
                filterStatus === 'pending' ? 'No pending generations' :
                  filterStatus === 'completed' ? 'No completed creations' :
                    'No failed generations'}
            </h3>
            <p className="text-gray-400 mb-6">
              {filterStatus === 'all'
                ? 'Start creating amazing content with our AI recipes!'
                : `No ${filterStatus} generations found. Try a different filter or create something new!`}
            </p>
            {filterStatus === 'all' ? (
              <Link href="/">
                <Button className="bg-gradient-to-r from-accent-blue to-accent-purple">
                  Start Creating
                </Button>
              </Link>
            ) : (
              <div className="flex gap-2 justify-center">
                <Button
                  variant="outline"
                  onClick={() => handleFilterChange('all')}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Show All
                </Button>
                <Link href="/">
                  <Button className="bg-gradient-to-r from-accent-blue to-accent-purple">
                    Create New
                  </Button>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {sortedGenerations.map((generation) => {
                const metadata: any = generation.metadata || {};
                const queuePosition = getQueuePosition(generation.id);
                const isInQueue = generation.status === "pending" && queuePosition;

                return (
                  <Card key={generation.id} className="bg-card-bg border-card-border overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-6">
                        {/* Preview Section - Left Side */}
                        <div className="flex-shrink-0">
                          {generation.status === "completed" && (generation.videoUrl || generation.imageUrl || generation.thumbnailUrl || (generation as any).resultUrl) ? (
                            <div
                              className="w-32 h-32 bg-gray-800 rounded-lg overflow-hidden relative cursor-pointer"
                              onMouseEnter={() => {
                                // Pre-fetch generation data on hover for faster loading
                                if (generation.shortId) {
                                  prefetchGeneration(generation.shortId);
                                }
                              }}
                              onClick={() => {
                                // Navigate directly to Asset Viewer page
                                setLocation(`/alpha/m/${generation.shortId}`);
                              }}
                            >
                              {(() => {
                                // For videos, prioritize thumbnailUrl over videoUrl to prevent memory issues
                                const isVideo = Boolean(generation.videoUrl);
                                const previewUrl = isVideo
                                  ? (generation.thumbnailUrl || generation.videoUrl || '/default-preview.png')
                                  : (generation.thumbnailUrl || generation.imageUrl || (generation as any).resultUrl || '/default-preview.png');

                                // If we have a thumbnail URL for a video, show it as an auto-playing GIF without play button
                                const isGifThumbnail = isVideo && generation.thumbnailUrl;

                                return (
                                  <>
                                    <img
                                      src={previewUrl}
                                      alt={generation.recipeTitle || ''}
                                      className="w-full h-full object-cover"
                                    />
                                    {/* Only show play button if it's a video without a GIF thumbnail */}
                                    {isVideo && !isGifThumbnail && (
                                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                        <Play className="w-10 h-10 text-white/80" />
                                      </div>
                                    )}
                                  </>
                                );
                              })()}
                            </div>
                          ) : generation.status === "failed" ? (
                            <div className="w-32 h-32 bg-red-900/20 border-2 border-red-600 rounded-lg flex items-center justify-center">
                              <div className="text-center">
                                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-2">
                                  <X className="w-4 h-4 text-white" />
                                </div>
                                <p className="text-xs text-red-400 font-medium">Failed</p>
                              </div>
                            </div>
                          ) : (
                            <div className="w-32 h-32 bg-gray-800 rounded-lg overflow-hidden relative">
                              {/* TV Static Effect */}
                              <div className="absolute inset-0 bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800">
                                <div className="absolute inset-0 opacity-30">
                                  {[...Array(50)].map((_, i) => (
                                    <div
                                      key={i}
                                      className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                                      style={{
                                        left: `${Math.random() * 100}%`,
                                        top: `${Math.random() * 100}%`,
                                        animationDelay: `${Math.random() * 2}s`,
                                        animationDuration: `${0.5 + Math.random() * 1}s`
                                      }}
                                    />
                                  ))}
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-gray-600/20 to-transparent animate-pulse" />
                              </div>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                  <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                                  <p className="text-xs text-gray-400">Processing...</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* View Button for completed generations */}
                          {generation.status === "completed" && (generation.videoUrl || generation.imageUrl || generation.thumbnailUrl || (generation as any).resultUrl) && (
                            <div className="flex gap-2 mt-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 text-xs border-gray-600 text-gray-300 hover:bg-gray-700"
                                onClick={() => {
                                  if (generation.videoUrl) {
                                    setLocation(`/alpha/m/${generation.shortId}`);
                                  } else {
                                    // Use alpha asset viewer for images
                                    setLocation(`/alpha/m/${generation.shortId}`);
                                  }
                                }}
                                onMouseEnter={() => {
                                  // Pre-fetch generation data on hover for faster loading
                                  if (generation.shortId) {
                                    prefetchGeneration(generation.shortId);
                                  }
                                }}
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                View
                              </Button>
                            </div>
                          )}
                        </div>

                        {/* Content Section - Right Side */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {getStatusIcon(generation.status)}
                            <h3 className="text-lg font-semibold text-white">
                              {generation.recipeTitle}
                            </h3>
                            <Badge className={getStatusColor(generation.status)}>
                              {generation.status}
                            </Badge>
                            {isInQueue && (
                              <Badge variant="outline" className="border-yellow-500 text-yellow-400">
                                #{queuePosition} in queue
                              </Badge>
                            )}
                          </div>

                          {/* Display tagDisplayData for pretty UI badges with dynamic icons */}
                          {metadata?.tagDisplayData && Object.keys(metadata.tagDisplayData).length > 0 ? (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {Object.entries(enhanceTagDisplayData(metadata.tagDisplayData)).map(([key, tagData]) => {
                                const data = tagData as any;
                                const iconName = data.icon;
                                const color = data.color;
                                const value = data.value;
                                const tooltipText = `${key}: ${value}`;
                                // Debugging output
                                if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
                                  console.debug('[TagPill Debug]', {
                                    key,
                                    tagData: data,
                                    iconName,
                                    color,
                                    value,
                                  });
                                }
                                return (
                                  <Badge
                                    key={key}
                                    variant="outline"
                                    className={`text-xs border-blue-400 text-blue-300 flex items-center gap-1 cursor-help ${color ? `text-[${color}]` : ''
                                      }`}
                                    title={tooltipText}
                                  >
                                    {iconName && (
                                      <LucideIcon name={iconName} className="mr-1 w-3 h-3" />
                                    )}
                                    <span>{value}</span>
                                  </Badge>
                                );
                              })}
                            </div>
                          ) : metadata?.formData && Object.keys(metadata.formData).length > 0 ? (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {Object.entries(metadata.formData).map(([key, value]) => (
                                <Badge key={key} variant="outline" className="text-xs border-blue-400 text-blue-300">
                                  {key}: {value as string}
                                </Badge>
                              ))}
                            </div>
                          ) : null}

                          {/* Queue Progress */}
                          {isInQueue && (
                            <div className="mb-3">
                              <div className="flex justify-between text-xs text-gray-400 mb-1">
                                <span>Queue position: {queuePosition}</span>
                                <span>Est. time: {getEstimatedTime(queuePosition)}</span>
                              </div>
                              <Progress
                                value={Math.max(0, 100 - (queuePosition * 10))}
                                className="h-2 bg-gray-700"
                              />
                            </div>
                          )}

                          {/* Error Details */}
                          {generation.status === "failed" && generation.failureReason && (
                            <div className="mt-3 p-3 bg-red-900/20 border border-red-700 rounded text-sm">
                              <div className="flex items-center gap-2 text-red-400 mb-1">
                                <AlertCircle className="w-4 h-4" />
                                <span className="font-medium">Generation Failed</span>
                              </div>
                              <p className="text-red-300">{generation.failureReason}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl p-10 flex flex-col items-center gap-4 mt-8">
                {/* Page Size Selector */}
                <div className="flex items-center gap-2 text-sm text-white">
                  <span>Show</span>
                  <Select value={String(pageSize)} onValueChange={(value) => handlePageSizeChange(Number(value))}>
                    <SelectTrigger className="w-20 bg-card-bg border border-card-border text-white rounded px-2 py-1 text-sm focus:outline-none focus:border-accent-blue">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {pageSizeOptions.map(size => (
                        <SelectItem key={size} value={String(size)}>{size}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span>per page</span>
                </div>

                <div className="flex items-center justify-center gap-4">
                  {/* First Page Button */}
                  <Button
                    variant="outline"
                    onClick={() => goToPage(1)}
                    disabled={currentPage === 1}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 disabled:opacity-50"
                    size="sm"
                  >
                    First
                  </Button>

                  <Button
                    variant="outline"
                    onClick={goToPreviousPage}
                    disabled={!pagination?.hasPrevious}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          onClick={() => goToPage(pageNum)}
                          className={
                            currentPage === pageNum
                              ? "bg-accent-blue text-white"
                              : "border-gray-600 text-gray-300 hover:bg-gray-700"
                          }
                          size="sm"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    onClick={goToNextPage}
                    disabled={!pagination?.hasNext}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 disabled:opacity-50"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>

                  {/* Last Page Button */}
                  <Button
                    variant="outline"
                    onClick={() => goToPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 disabled:opacity-50"
                    size="sm"
                  >
                    Last
                  </Button>
                </div>

                {/* Page Info */}
                <div className="text-center text-sm text-white">
                  Page {currentPage} of {totalPages} • Showing {sortedGenerations.length} of {totalGenerations} creations
                </div>
              </div>
            )}
          </>
        )}

        {/* Footer CTA */}
        {totalGenerations > 0 && (
          <div className="text-center mt-12 py-8 bg-card-bg rounded-lg border border-card-border">
            <h3 className="text-xl font-semibold text-white mb-2">Ready to unleash your creativity?</h3>
            <p className="text-gray-400 mb-4">Join our waitlist for early access to the full platform!</p>
            <Button
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              onClick={() => window.open(ALPHA_CONFIG.typeformUrl, '_blank')}
            >
              Get Early Access
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}