import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge classes, last wins on conflict.
 *
 * The incoming `class` always goes last, so a consumer's `rounded-full` beats
 * the component's own `rounded-sm`.
 */
export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));
