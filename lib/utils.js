import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function generateId(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).substr(2, 9)}_${Date.now().toString(36)}`;
}

export function formatDate(timestamp) {
  if (!timestamp) return 'N/A';
  if (timestamp.toDate && typeof timestamp.toDate === 'function') {
    return timestamp.toDate().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
  if (timestamp instanceof Date) {
    return timestamp.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export const COVERAGE_LEVELS = {
  NOT_COVERED: { label: 'Not Covered', percentage: 0, color: 'text-red-600 bg-red-50 dark:bg-red-950/40 dark:text-red-400 border-red-200 dark:border-red-800' },
  BEGINNER: { label: 'Beginner', percentage: 25, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800' },
  INTERMEDIATE: { label: 'Intermediate', percentage: 60, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200 dark:border-blue-800' },
  ADVANCED: { label: 'Advanced', percentage: 100, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' },
};

export function getCoverageMeta(percentage) {
  if (percentage >= 80) {
    return {
      status: 'Strongly Covered',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300',
      textColor: 'text-emerald-600 dark:text-emerald-400',
    };
  }
  if (percentage >= 40) {
    return {
      status: 'Partially Covered',
      badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300',
      textColor: 'text-blue-600 dark:text-blue-400',
    };
  }
  if (percentage > 0) {
    return {
      status: 'Minimal Coverage',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300',
      textColor: 'text-amber-600 dark:text-amber-400',
    };
  }
  return {
    status: 'Missing Skill',
    badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300',
    textColor: 'text-rose-600 dark:text-rose-400',
  };
}
