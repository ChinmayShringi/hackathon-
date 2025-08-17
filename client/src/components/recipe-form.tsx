import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { EmojiButton } from "@/components/ui/emoji-button";
import { Smartphone, Monitor, Square, Palette, Zap, Clock } from "lucide-react";
import type { Recipe } from "@shared/schema";

interface RecipeFormProps {
  recipe: Recipe;
  onGenerate: (formData: Record<string, string>) => void;
  isGenerating: boolean;
}

interface RecipeStep {
  id: string;
  type: 'text_prompt' | 'radio' | 'dropdown' | 'text' | 'slider' | 'emoji_button';
  label: string;
  required?: boolean;
  defaultValue?: string;
  placeholder?: string;
  options?: Array<{ label: string; value: string; emoji?: string; subtitle?: string }>;
  config?: {
    min?: number;
    max?: number;
    step?: number;
    showValue?: boolean;
    ticks?: Array<{ value: number; label: string }>;
  };
}

// Label transformation function for Cat Olympic Diving recipe
function transformLabel(recipeSlug: string, originalLabel: string): string {
  if (recipeSlug === 'cat-olympic-diving') {
    const labelMap: Record<string, string> = {
      'Attitude': 'Cattitude',
    };

    return labelMap[originalLabel] || originalLabel;
  }

  return originalLabel;
}

// Tick label transformation for Cat Olympic Diving recipe
function transformTickLabels(recipeSlug: string, originalTicks: Array<{ value: number; label: string }>): Array<{ value: number; label: string }> {
  if (recipeSlug === 'cat-olympic-diving') {
    return originalTicks.map(tick => {
      // Transform weight labels to meme terms
      if (tick.label === 'Athletic Build') return { ...tick, label: 'SMOL' };
      if (tick.label === 'Average Weight') return { ...tick, label: 'Buff' };
      if (tick.label === 'Overweight') return { ...tick, label: 'Chonk' };
      if (tick.label === 'Obese') return { ...tick, label: 'Heck \'n Chonk' };
      if (tick.label === 'Senior Citizen Cat') return { ...tick, label: 'Senior Cat' };
      return tick;
    });
  }

  return originalTicks;
}

export default function RecipeForm({ recipe, onGenerate, isGenerating }: RecipeFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [steps, setSteps] = useState<RecipeStep[]>([]);
  const [availability, setAvailability] = useState<any>(null);

  useEffect(() => {
    try {
      const recipeSteps = Array.isArray(recipe.recipeSteps) ? recipe.recipeSteps : [];
      setSteps(recipeSteps as RecipeStep[]);

      // Initialize form data with default values
      const initialData: Record<string, string> = {};
      recipeSteps.forEach((step: any) => {
        if (step.defaultValue) {
          initialData[step.id] = step.defaultValue;
        }
      });
      setFormData(initialData);
    } catch (error) {
      console.error('Error parsing recipe steps:', error);
      setSteps([]);
    }
  }, [recipe]);

  // Check availability for current form data
  const availabilityQuery = useQuery({
    queryKey: ['generate-availability', recipe.id, formData],
    queryFn: async () => {
      const params = new URLSearchParams({
        recipeId: recipe.id.toString(),
        formData: JSON.stringify(formData)
      });
      const response = await fetch(`/api/generate/availability?${params}`);
      return response.json();
    },
    enabled: Object.keys(formData).length > 0,
    refetchInterval: false
  });

  // Update availability when query data changes
  useEffect(() => {
    if (availabilityQuery.data) {
      setAvailability(availabilityQuery.data);
    }
  }, [availabilityQuery.data]);

  const handleFieldChange = (fieldId: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleSubmit = () => {
    onGenerate(formData);
  };

  const isFormValid = () => {
    return steps.every(step => {
      if (step.required) {
        return formData[step.id] && formData[step.id].trim() !== '';
      }
      return true;
    });
  };

  const getOrientationIcon = (orientation: string) => {
    switch (orientation) {
      case 'portrait': return <Smartphone className="h-4 w-4" />;
      case 'landscape': return <Monitor className="h-4 w-4" />;
      case 'square': return <Square className="h-4 w-4" />;
      default: return <Smartphone className="h-4 w-4" />;
    }
  };

  const renderField = (step: RecipeStep) => {
    const displayLabel = transformLabel(recipe.slug, step.label);
    switch (step.type) {
      case 'text_prompt':
        return (
          <div className="space-y-3">
            <Label className="text-sm font-medium text-white">{displayLabel}</Label>
            <textarea
              value={formData[step.id] || step.defaultValue || ''}
              onChange={(e) => handleFieldChange(step.id, e.target.value)}
              placeholder={step.placeholder || `Enter ${displayLabel.toLowerCase()}...`}
              className="w-full p-3 bg-bg-primary border border-gray-600 rounded-lg text-white placeholder-gray-400 resize-none"
              rows={4}
            />
          </div>
        );

      case 'text':
        return (
          <div className="space-y-3">
            <Label className="text-sm font-medium text-white">{displayLabel}</Label>
            <input
              type="text"
              value={formData[step.id] || step.defaultValue || ''}
              onChange={(e) => handleFieldChange(step.id, e.target.value)}
              placeholder={step.placeholder || `Enter ${displayLabel.toLowerCase()}...`}
              className="w-full p-3 bg-bg-primary border border-gray-600 rounded-lg text-white placeholder-gray-400"
            />
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-3">
            <Label className="text-sm font-medium text-white">{displayLabel}</Label>
            <RadioGroup
              value={formData[step.id] || step.defaultValue}
              onValueChange={(value) => handleFieldChange(step.id, value)}
              className="space-y-2"
            >
              {step.options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={option.value}
                    id={`${step.id}-${option.value}`}
                    className="text-accent-blue border-gray-600"
                  />
                  <Label
                    htmlFor={`${step.id}-${option.value}`}
                    className="text-sm text-gray-300 cursor-pointer flex items-center gap-2"
                  >
                    {step.label === "Image Orientation" && getOrientationIcon(option.value)}
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 'dropdown':
        return (
          <div className="space-y-3">
            <Label className="text-sm font-medium text-white">{displayLabel}</Label>
            <Select
              value={formData[step.id] || step.defaultValue}
              onValueChange={(value) => handleFieldChange(step.id, value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={`Select ${displayLabel.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {step.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'slider': {
        const ticks = step.config?.ticks || [];
        const transformedTicks = transformTickLabels(recipe.slug, ticks);

        const min = step.config?.min ?? transformedTicks[0]?.value ?? 0;
        const max = step.config?.max ?? transformedTicks[transformedTicks.length - 1]?.value ?? 100;

        const sliderValue = parseInt(
          formData[step.id] ??
          step.defaultValue ??
          min.toString()
        );

        return (
          <div className="w-full flex justify-center">
            <div className="w-full max-w-[440px] space-y-3 relative">

              {/* Label and Value Display */}
              <div className="flex justify-between items-center">
                <Label className="text-sm font-medium text-white">{displayLabel}</Label>
                {step.config?.showValue && (
                  <span className="text-sm text-gray-300 font-medium whitespace-nowrap">
                    {transformedTicks.find(t => t.value === sliderValue)?.label || sliderValue}
                  </span>
                )}
              </div>

              {/* Slider */}
              <Slider
                value={[sliderValue]}
                onValueChange={(values) => handleFieldChange(step.id, values[0].toString())}
                min={min}
                max={max}
                step={1}
                className="w-full"
              />

              {/* Ticks & Labels */}
              <div className="relative w-[calc(100%-20px)] mx-auto h-[48px] mt-2">

                {transformedTicks.map((tick, i) => {
                  const percent = ((tick.value - min) / (max - min)) * 100;
                  return (
                    <div
                      key={i}
                      className="absolute flex flex-col items-center text-center cursor-pointer"
                      style={{ left: `${percent}%`, transform: 'translateX(-50%) translateY(-2px)' }}
                      onClick={() => handleFieldChange(step.id, tick.value.toString())}
                    >
                      <div
                        className={`w-3 h-3 rounded-full mb-[2px] ${sliderValue === tick.value ? 'bg-primary' : 'bg-gray-400'
                          }`}
                      />
                      <span className="text-xs text-gray-400 leading-tight break-words text-center">
                        {tick.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      }






      case 'emoji_button':
        return (
          <div className="space-y-3">
            <Label className="text-sm font-medium text-white">{step.label}</Label>
            <div className="grid grid-cols-3 gap-3">
              {step.options?.map((option) => (
                <EmojiButton
                  key={option.value}
                  emoji={option.emoji || '😀'}
                  subtitle={option.subtitle || option.label}
                  value={option.value}
                  isSelected={formData[step.id] === option.value}
                  onSelect={(value) => handleFieldChange(step.id, value)}
                />
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="bg-card-bg border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Palette className="h-5 w-5 text-accent-blue" />
          Configure Generation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {steps.map((step) => (
          <div key={step.id}>
            {renderField(step)}
          </div>
        ))}

        <div className="pt-4 border-t border-gray-700">
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid() || isGenerating}
            className="w-full bg-gradient-to-r from-accent-blue to-accent-purple hover:shadow-lg transition-all"
          >
            {isGenerating ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                {availability?.canFlash ? (
                  <Zap className="h-4 w-4 mr-2" />
                ) : (
                  <Palette className="h-4 w-4 mr-2" />
                )}
                Generate ({recipe.creditCost} credits)
                {availability?.canFlash && (
                  <span className="ml-2 text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">
                    Flash Available
                  </span>
                )}
              </>
            )}
          </Button>

          {/* Availability Status */}
          {availability && (
            <div className="mt-3 text-xs text-gray-400 text-center">
              {availability.canFlash ? (
                <span className="text-green-400">
                  ⚡ This combination has a backlog video - will generate instantly!
                </span>
              ) : (
                <span className="text-yellow-400">
                  ⏱️ This combination will generate new content
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}