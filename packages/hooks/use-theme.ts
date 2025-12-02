/**
 * useTheme Hook
 * 
 * Shared theme management hook using next-themes.
 * Provides dark/light mode toggle with system detection.
 */

import { useTheme as useNextTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export interface ThemeConfig {
  theme: string | undefined;
  setTheme: (theme: string) => void;
  themes: string[];
  resolvedTheme: string | undefined;
  systemTheme: 'light' | 'dark' | undefined;
  isDark: boolean;
  isLight: boolean;
  toggleTheme: () => void;
}

/**
 * Enhanced theme hook with additional utilities
 */
export function useTheme(): ThemeConfig {
  const {
    theme,
    setTheme,
    themes,
    resolvedTheme,
    systemTheme
  } = useNextTheme();
  
  const [mounted, setMounted] = useState(false);
  
  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const isDark = mounted && resolvedTheme === 'dark';
  const isLight = mounted && resolvedTheme === 'light';
  
  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };
  
  return {
    theme,
    setTheme,
    themes,
    resolvedTheme,
    systemTheme,
    isDark,
    isLight,
    toggleTheme
  };
}

/**
 * Simple theme toggle component hook
 */
export function useThemeToggle() {
  const { isDark, toggleTheme } = useTheme();
  return { isDark, toggle: toggleTheme };
}
