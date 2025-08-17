import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { UploadImage } from './upload-image';
import { Upload, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Asset, getCdnUrl, RecipeFormData } from '@/lib/types';

// Use a subset of Asset for the demo component
type AssetData = Pick<Asset, 'assetId' | 'cdnUrl' | 's3Key' | 'displayName' | 'originalFilename' | 'fileSize' | 'mimeType'>;

export function UploadDemo() {
  const [formData, setFormData] = useState<RecipeFormData>({
    prompt: ''
  });

  const [assets, setAssets] = useState<Record<string, AssetData>>({});
  const [loadingAssets, setLoadingAssets] = useState<Record<string, boolean>>({});
  const [userLibrary, setUserLibrary] = useState<AssetData[]>([]);
  const [loadingLibrary, setLoadingLibrary] = useState(false);
  const [showAssetSelector, setShowAssetSelector] = useState<string | null>(null);

  const handleUploadComplete = (assetId: string, recipeVariable: string) => {
    setFormData(prev => ({
      ...prev,
      [recipeVariable]: assetId
    }));

    // Fetch asset data to get CDN URL and metadata
    fetchAssetData(assetId, recipeVariable);
    
    // Refresh the user library to show the new upload
    fetchUserLibrary();
  };

  const fetchAssetData = async (assetId: string, recipeVariable: string) => {
    setLoadingAssets(prev => ({ ...prev, [recipeVariable]: true }));
    
    try {
      // Use the authenticated apiRequest function instead of direct fetch
      const response = await fetch(`/api/media-library/assets?search=${assetId}`, {
        credentials: 'include' // Ensure cookies are sent
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch asset: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.assets && data.assets.length > 0) {
        const asset = data.assets[0];
        setAssets(prev => ({
          ...prev,
          [recipeVariable]: {
            assetId: asset.assetId,
            cdnUrl: asset.cdnUrl,
            s3Key: asset.s3Key,
            displayName: asset.displayName,
            originalFilename: asset.originalFilename,
            fileSize: asset.fileSize,
            mimeType: asset.mimeType
          }
        }));
      }
    } catch (error) {
      console.error('Failed to fetch asset data:', error);
    } finally {
      setLoadingAssets(prev => ({ ...prev, [recipeVariable]: false }));
    }
  };

  const fetchUserLibrary = async () => {
    setLoadingLibrary(true);
    try {
      const response = await fetch('/api/media-library/assets?limit=20', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch library: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.assets) {
        console.log('Raw assets from API:', data.assets);
        const libraryAssets = data.assets.map((asset: any) => ({
          assetId: asset.assetId,
          cdnUrl: asset.cdnUrl,
          s3Key: asset.s3Key,
          displayName: asset.displayName,
          originalFilename: asset.originalFilename,
          fileSize: asset.fileSize,
          mimeType: asset.mimeType
        }));
        console.log('Processed library assets:', libraryAssets);
        setUserLibrary(libraryAssets);
      }
    } catch (error) {
      console.error('Failed to fetch user library:', error);
    } finally {
      setLoadingLibrary(false);
    }
  };

  // Fetch user library on component mount
  useEffect(() => {
    fetchUserLibrary();
  }, []);

  const handleSelectExistingAsset = (asset: AssetData, recipeVariable: string) => {
    setFormData(prev => ({
      ...prev,
      [recipeVariable]: asset.assetId
    }));
    
    setAssets(prev => ({
      ...prev,
      [recipeVariable]: asset
    }));
    
    setShowAssetSelector(null);
  };

  const handleGenerate = () => {
    console.log('Recipe form data:', formData);
    // Here you would call your recipe generation API
    alert(`Generating with:\nPrompt: ${formData.prompt}\nInput Image: ${formData.inputImage || 'None'}\nStyle Image: ${formData.styleImage || 'None'}\nReference Image: ${formData.referenceImage || 'None'}`);
  };

  const canGenerate = formData.prompt.trim().length > 0;

  const renderAssetDisplay = (recipeVariable: string, label: string, description: string) => {
    const asset = assets[recipeVariable];
    const assetId = formData[recipeVariable];

    if (!assetId) {
      return (
        <div className="space-y-2">
          <Label>{label}</Label>
          <UploadImage
            recipeId={1} // Example recipe ID
            recipeVariable={recipeVariable}
            variant="default"
            placeholder={description}
            onUploadComplete={(assetId) => handleUploadComplete(assetId, recipeVariable)}
            onUploadError={(file, error) => console.error('Upload error:', error)}
            showPreview={true}
            previewSize="md"
          />
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        <div className="relative group">
          {/* Asset Display */}
          <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50 dark:bg-gray-900/50 transition-all duration-200 group-hover:border-blue-300 group-hover:bg-blue-50/50 dark:group-hover:bg-blue-950/20">
            <div className="flex items-center space-x-4">
              {/* Image Preview */}
              <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                {loadingAssets[recipeVariable] ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  </div>
                ) : asset ? (
                  <img
                    src={asset.cdnUrl}
                    alt={asset.displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                )}
              </div>
              
              {/* Asset Info */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">
                  {loadingAssets[recipeVariable] ? 'Loading...' : asset ? asset.displayName : 'Unknown'}
                </div>
                <div className="text-xs text-gray-500">
                  {loadingAssets[recipeVariable] ? '...' : asset ? `${(asset.fileSize / 1024 / 1024).toFixed(1)} MB` : '...'}
                </div>
                <div className="text-xs text-gray-400">
                  ID: {assetId.slice(0, 8)}...
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAssetSelector(recipeVariable)}
                >
                  Select Existing
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Clear the current asset from form data
                    setFormData(prev => ({ ...prev, [recipeVariable]: undefined }));
                    // Remove from assets display
                    setAssets(prev => {
                      const newAssets = { ...prev };
                      delete newAssets[recipeVariable];
                      return newAssets;
                    });
                  }}
                >
                  Replace
                </Button>
              </div>
            </div>
          </div>

          {/* Hover Overlay - Shows upload area when hovering over existing asset */}
          <div className="absolute inset-0 bg-blue-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none border-2 border-blue-300 border-dashed" />
          
          {/* Hover Upload Indicator */}
          <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none">
            <div className="bg-white/95 dark:bg-gray-800/95 rounded-full p-4 shadow-xl border border-blue-200 mb-2">
              <Upload className="h-8 w-8 text-blue-600" />
            </div>
            <div className="bg-white/95 dark:bg-gray-800/95 px-3 py-1 rounded-full shadow-lg border border-blue-200">
              <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Drop to replace</span>
            </div>
          </div>

          {/* Hidden Upload Widget for Replace */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <UploadImage
              recipeId={1}
              recipeVariable={recipeVariable}
              variant="default"
              placeholder="Drop new image to replace"
              onUploadComplete={(newAssetId) => handleUploadComplete(newAssetId, recipeVariable)}
              onUploadError={(file, error) => console.error('Upload error:', error)}
              showPreview={false}
              replaceMode={true}
              existingImageUrl={asset ? getCdnUrl(asset.cdnUrl, asset.s3Key) : undefined}
              existingImageName={asset?.displayName}
              className="h-full"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Recipe Upload Widget Demo</h1>
        <p className="text-gray-600 dark:text-gray-400">
          This demonstrates how to integrate file upload widgets into recipe forms
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Style Transfer Recipe</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Text Prompt */}
          <div className="space-y-2">
            <Label htmlFor="prompt">Describe what you want to create</Label>
            <textarea
              id="prompt"
              value={formData.prompt}
              onChange={(e) => setFormData(prev => ({ ...prev, prompt: e.target.value }))}
              placeholder="A beautiful landscape with mountains and a lake..."
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>

          {/* Input Image Upload */}
          {renderAssetDisplay(
            'inputImage',
            'Input Image (Content to Style)',
            'Upload the image you want to style'
          )}

          {/* Style Image Upload */}
          {renderAssetDisplay(
            'styleImage',
            'Style Reference Image',
            'Upload a style reference image'
          )}

          {/* Reference Image Upload (Optional) */}
          {renderAssetDisplay(
            'referenceImage',
            'Reference Image (Optional)',
            'Upload a reference image for composition'
          )}

          {/* Generate Button */}
          <div className="pt-4">
            <Button
              onClick={handleGenerate}
              disabled={!canGenerate}
              className="w-full"
              size="lg"
            >
              Generate Styled Image
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Form Data Display */}
      <Card>
        <CardHeader>
          <CardTitle>Current Form Data</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md overflow-auto text-sm">
            {JSON.stringify(formData, null, 2)}
          </pre>
        </CardContent>
      </Card>

      {/* Assets Display */}
      <Card>
        <CardHeader>
          <CardTitle>Uploaded Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(assets).map(([variable, asset]) => (
              <div key={variable} className="border rounded-lg p-3">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {variable}
                </div>
                <img
                  src={getCdnUrl(asset.cdnUrl, asset.s3Key)}
                  alt={asset.displayName}
                  className="w-full h-32 object-cover rounded mb-2"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="hidden flex items-center justify-center w-full h-32 bg-gray-100 dark:bg-gray-800 rounded mb-2">
                  <ImageIcon className="h-12 w-12 text-gray-400" />
                </div>
                <div className="text-xs text-gray-500">
                  {asset.displayName}
                </div>
                <div className="text-xs text-gray-400">
                  {(asset.fileSize / 1024 / 1024).toFixed(1)} MB
                </div>
              </div>
            ))}
          </div>
          {Object.keys(assets).length === 0 && (
            <div className="text-center text-gray-500 py-8">
              No assets uploaded yet
            </div>
          )}
        </CardContent>
      </Card>

      {/* User's Media Library */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Your Media Library</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchUserLibrary}
              disabled={loadingLibrary}
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", loadingLibrary && "animate-spin")} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loadingLibrary ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <div className="text-gray-500">Loading your media library...</div>
            </div>
          ) : userLibrary.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {userLibrary.map((asset) => (
                <div key={asset.assetId} className="border rounded-lg p-2 hover:border-blue-300 transition-colors">
                  <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded mb-2 overflow-hidden">
                    {asset.mimeType.startsWith('image/') ? (
                      <>
                        <img
                          src={getCdnUrl(asset.cdnUrl, asset.s3Key)}
                          alt={asset.displayName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                        <div className="hidden flex items-center justify-center w-full h-full">
                          <ImageIcon className="h-8 w-8 text-gray-400" />
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="text-xs font-medium truncate mb-1" title={asset.displayName}>
                    {asset.displayName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {(asset.fileSize / 1024 / 1024).toFixed(1)} MB
                  </div>
                  <div className="text-xs text-gray-400 truncate" title={asset.assetId}>
                    ID: {asset.assetId.slice(0, 8)}...
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <div>Your media library is empty</div>
              <div className="text-sm">Upload some images to get started!</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Examples</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Basic Image Upload</h4>
            <code className="text-sm bg-gray-100 dark:bg-gray-900 p-2 rounded block">
              {`<UploadImage
  recipeId={recipe.id}
  recipeVariable="inputImage"
  onUploadComplete={handleUploadComplete}
/>`}
            </code>
          </div>

          <div>
            <h4 className="font-medium mb-2">Compact Variant</h4>
            <code className="text-sm bg-gray-100 dark:bg-gray-900 p-2 rounded block">
              {`<UploadImage
  variant="compact"
  recipeId={recipe.id}
  recipeVariable="styleImage"
  onUploadComplete={handleUploadComplete}
/>`}
            </code>
          </div>

          <div>
            <h4 className="font-medium mb-2">With Custom Validation</h4>
            <code className="text-sm bg-gray-100 dark:bg-gray-900 p-2 rounded block">
              {`<UploadImage
  recipeId={recipe.id}
  recipeVariable="inputImage"
  maxDimensions={{ width: 1024, height: 1024 }}
  validator={(file) => {
    if (file.size > 10 * 1024 * 1024) {
      return 'File must be smaller than 10MB';
    }
    return null;
  }}
  onUploadComplete={handleUploadComplete}
/>`}
            </code>
          </div>
        </CardContent>
      </Card>

      {/* Asset Selector Modal */}
      {showAssetSelector && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-4xl max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Select from Your Library</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAssetSelector(null)}
              >
                ✕
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-h-[60vh] overflow-y-auto">
              {userLibrary.map((asset) => (
                <div
                  key={asset.assetId}
                  className="border rounded-lg p-2 hover:border-blue-300 transition-colors cursor-pointer"
                  onClick={() => handleSelectExistingAsset(asset, showAssetSelector)}
                >
                  <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded mb-2 overflow-hidden">
                    {asset.mimeType.startsWith('image/') ? (
                      <>
                        <img
                          src={getCdnUrl(asset.cdnUrl, asset.s3Key)}
                          alt={asset.displayName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                        <div className="hidden flex items-center justify-center w-full h-full">
                          <ImageIcon className="h-8 w-8 text-gray-400" />
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="text-xs font-medium truncate mb-1" title={asset.displayName}>
                    {asset.displayName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {(asset.fileSize / 1024 / 1024).toFixed(1)} MB
                  </div>
                </div>
              ))}
            </div>
            
            {userLibrary.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <div>No assets in your library</div>
                <div className="text-sm">Upload some images first!</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadDemo;
