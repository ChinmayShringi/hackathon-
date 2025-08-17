import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Audio type helper function
export function getAudioTypeText(audioType: number): string {
  switch (audioType) {
    case 1:
      return " w/ Sound";
    case 2:
      return " w/ Speech";
    default:
      return "";
  }
}
