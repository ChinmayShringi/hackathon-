import * as React from "react"
import { cn } from "@/lib/utils"

interface EmojiButtonProps {
  emoji: string
  subtitle: string
  value: string
  isSelected: boolean
  onSelect: (value: string) => void
  className?: string
}

const EmojiButton = React.forwardRef<HTMLButtonElement, EmojiButtonProps>(
  ({ emoji, subtitle, value, isSelected, onSelect, className }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        onClick={() => onSelect(value)}
        className={cn(
          "flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105",
          "min-w-[80px] min-h-[80px]",
          isSelected
            ? "border-accent-blue bg-accent-blue/10 shadow-lg shadow-accent-blue/20"
            : "border-gray-600 bg-gray-800/50 hover:border-gray-500 hover:bg-gray-700/50",
          className
        )}
        aria-pressed={isSelected}
      >
        <span className="text-2xl mb-2" role="img" aria-label={subtitle}>
          {emoji}
        </span>
        <span className={cn(
          "text-xs text-center font-medium",
          isSelected ? "text-accent-blue" : "text-gray-300"
        )}>
          {subtitle}
        </span>
      </button>
    )
  }
)

EmojiButton.displayName = "EmojiButton"

export { EmojiButton } 