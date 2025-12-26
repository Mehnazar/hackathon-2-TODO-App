/**
 * Utility for merging Tailwind CSS class names
 * Filters out falsy values and joins classes with spaces
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
