/**
 * Utility for merging Tailwind CSS class names
 * Uses clsx for better class merging
 */
import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs)
}
