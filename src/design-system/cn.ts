import { clsx, type ClassValue } from "clsx";

/**
 * Joins class names. Components own their visual styling; a `className`
 * passed from outside is for layout only (margin, width, grid placement),
 * so no merge/override resolution is needed or wanted.
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
