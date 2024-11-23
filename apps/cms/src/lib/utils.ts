import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isRecordOfString(
  value: any | null | undefined,
): value is { [key: string]: string } {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return Object.values(value).every((val) => typeof val === 'string');
  }
  return false;
}
