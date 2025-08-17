import * as React from "react";
import { HexColorPicker, HexColorInput } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { Input } from "./input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  value?: string;
  onChange?: (color: string) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

export function ColorPicker({
  value = "#000000",
  onChange,
  disabled = false,
  className,
  placeholder = "Select color..."
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Material Design Color Palette (Google's official colors)
  const materialColors = {
    red: ["#FFEBEE", "#FFCDD2", "#EF9A9A", "#E57373", "#EF5350", "#F44336", "#E53935", "#D32F2F", "#C62828", "#B71C1C"],
    pink: ["#FCE4EC", "#F8BBD9", "#F48FB1", "#F06292", "#EC407A", "#E91E63", "#D81B60", "#C2185B", "#AD1457", "#880E4F"],
    purple: ["#F3E5F5", "#E1BEE7", "#CE93D8", "#BA68C8", "#AB47BC", "#9C27B0", "#8E24AA", "#7B1FA2", "#6A1B9A", "#4A148C"],
    deepPurple: ["#EDE7F6", "#D1C4E9", "#B39DDB", "#9575CD", "#7E57C2", "#673AB7", "#5E35B1", "#512DA8", "#4527A0", "#311B92"],
    indigo: ["#E8EAF6", "#C5CAE9", "#9FA8DA", "#7986CB", "#5C6BC0", "#3F51B5", "#3949AB", "#303F9F", "#283593", "#1A237E"],
    blue: ["#E3F2FD", "#BBDEFB", "#90CAF9", "#64B5F6", "#42A5F5", "#2196F3", "#1E88E5", "#1976D2", "#1565C0", "#0D47A1"],
    lightBlue: ["#E1F5FE", "#B3E5FC", "#81D4FA", "#4FC3F7", "#29B6F6", "#03A9F4", "#039BE5", "#0288D1", "#0277BD", "#01579B"],
    cyan: ["#E0F7FA", "#B2EBF2", "#80DEEA", "#4DD0E1", "#26C6DA", "#00BCD4", "#00ACC1", "#0097A7", "#00838F", "#006064"],
    teal: ["#E0F2F1", "#B2DFDB", "#80CBC4", "#4DB6AC", "#26A69A", "#009688", "#00897B", "#00796B", "#00695C", "#004D40"],
    green: ["#E8F5E8", "#C8E6C9", "#A5D6A7", "#81C784", "#66BB6A", "#4CAF50", "#43A047", "#388E3C", "#2E7D32", "#1B5E20"],
    lightGreen: ["#F1F8E9", "#DCEDC8", "#C5E1A5", "#AED581", "#9CCC65", "#8BC34A", "#7CB342", "#689F38", "#558B2F", "#33691E"],
    lime: ["#F9FBE7", "#F0F4C3", "#E6EE9C", "#DCE775", "#D4E157", "#CDDC39", "#C0CA33", "#AFB42B", "#9E9D24", "#827717"],
    yellow: ["#FFFDE7", "#FFF9C4", "#FFF59D", "#FFF176", "#FFEE58", "#FFEB3B", "#FDD835", "#FBC02D", "#F9A825", "#F57F17"],
    amber: ["#FFF8E1", "#FFECB3", "#FFE082", "#FFD54F", "#FFCA28", "#FFC107", "#FFB300", "#FFA000", "#FF8F00", "#FF6F00"],
    orange: ["#FFF3E0", "#FFE0B2", "#FFCC80", "#FFB74D", "#FFA726", "#FF9800", "#FB8C00", "#F57C00", "#EF6C00", "#E65100"],
    deepOrange: ["#FBE9E7", "#FFCCBC", "#FFAB91", "#FF8A65", "#FF7043", "#FF5722", "#F4511E", "#E64A19", "#D84315", "#BF360C"],
    brown: ["#EFEBE9", "#D7CCC8", "#BCAAA4", "#A1887F", "#8D6E63", "#795548", "#6D4C41", "#5D4037", "#4E342E", "#3E2723"],
    grey: ["#FAFAFA", "#F5F5F5", "#EEEEEE", "#E0E0E0", "#BDBDBD", "#9E9E9E", "#757575", "#616161", "#424242", "#212121"],
    blueGrey: ["#ECEFF1", "#CFD8DC", "#B0BEC5", "#90A4AE", "#78909C", "#607D8B", "#546E7A", "#455A64", "#37474F", "#263238"]
  };

  // Convert hex to RGBA for internal processing
  const hexToRgba = (hex: string): { r: number; g: number; b: number; a: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
      a: result[4] ? parseInt(result[4], 16) / 255 : 1
    } : { r: 0, g: 0, b: 0, a: 1 };
  };

  // Convert RGBA to 8-digit hex
  const rgbaToHex = (r: number, g: number, b: number, a: number = 1): string => {
    const toHex = (n: number) => {
      const hex = Math.round(n).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    const alphaHex = Math.round(a * 255).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}${alphaHex}`;
  };

  // Ensure value is always 8-digit hex
  const normalizeHex = (hex: string): string => {
    if (!hex.startsWith('#')) return '#000000FF';
    if (hex.length === 7) return hex + 'FF'; // Add full alpha
    if (hex.length === 9) return hex; // Already 8-digit
    return '#000000FF'; // Default fallback
  };

  const normalizedValue = normalizeHex(value);

  const handleColorChange = (color: string) => {
    const normalizedColor = normalizeHex(color);
    onChange?.(normalizedColor);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    // Support both 6-digit and 8-digit hex codes (with alpha)
    if (/^#[0-9A-F]{6}$/i.test(color) || /^#[0-9A-F]{8}$/i.test(color)) {
      handleColorChange(color);
    }
  };

  const handleMaterialColorClick = (color: string) => {
    handleColorChange(color);
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-[60px] h-[40px] border-2 border-gray-600 hover:border-gray-500 transition-colors",
              "bg-gray-700 hover:bg-gray-600"
            )}
            style={{ backgroundColor: normalizedValue }}
            aria-label="Pick a color"
          >
            <div className="w-full h-full rounded-sm" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4 bg-gray-800 border-gray-700">
          <Tabs defaultValue="picker" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-700">
              <TabsTrigger value="picker" className="text-xs">Picker</TabsTrigger>
              <TabsTrigger value="palette" className="text-xs">Palette</TabsTrigger>
              <TabsTrigger value="input" className="text-xs">Input</TabsTrigger>
            </TabsList>
            
            <TabsContent value="picker" className="space-y-4 mt-4">
              <HexColorPicker
                color={normalizedValue}
                onChange={handleColorChange}
                className="w-full"
              />
            </TabsContent>
            
            <TabsContent value="palette" className="space-y-3 mt-4">
              <span className="text-sm text-gray-300 font-medium">Material Design Colors:</span>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {Object.entries(materialColors).map(([colorName, colors]) => (
                  <div key={colorName} className="space-y-1">
                    <span className="text-xs text-gray-400 capitalize">{colorName}</span>
                    <div className="grid grid-cols-10 gap-1">
                      {colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => handleMaterialColorClick(color)}
                          className={cn(
                            "w-5 h-5 rounded border transition-all hover:scale-110",
                            normalizedValue === normalizeHex(color)
                              ? "border-white ring-2 ring-blue-500" 
                              : "border-gray-600 hover:border-gray-400"
                          )}
                          style={{ backgroundColor: color }}
                          aria-label={`Select ${colorName} color ${color}`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="input" className="space-y-4 mt-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-300 font-medium">Hex (8-digit):</span>
                <HexColorInput
                  color={normalizedValue}
                  onChange={handleColorChange}
                  className="flex-1 px-3 py-2 text-sm bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="#000000FF"
                />
              </div>
              <div className="text-xs text-gray-400">
                Format: #RRGGBBAA (32-bit hex with alpha channel)
              </div>
            </TabsContent>
          </Tabs>
        </PopoverContent>
      </Popover>
      
      <Input
        value={normalizedValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
        disabled={disabled}
      />
    </div>
  );
} 