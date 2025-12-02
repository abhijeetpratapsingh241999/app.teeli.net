/**
 * Feature Flags System
 * 
 * Manage feature toggles across the application.
 * Supports local storage persistence and remote configuration.
 */

import { useEffect, useState } from 'react';

// Feature flag definitions
export interface FeatureFlags {
  // UI Features
  darkMode: boolean;
  glassUI: boolean;
  animations: boolean;
  
  // 3D Features
  advancedCamera: boolean;
  realtimeShadows: boolean;
  postProcessing: boolean;
  
  // Upload Features
  resumableUpload: boolean;
  multiFileUpload: boolean;
  dragDropUpload: boolean;
  
  // Processing Features
  autoRepair: boolean;
  aiOptimization: boolean;
  formatConversion: boolean;
  
  // Collaboration (Future)
  realtimeCollaboration: boolean;
  comments: boolean;
  sharing: boolean;
  
  // Enterprise (Future)
  customBranding: boolean;
  apiAccess: boolean;
  priorityRendering: boolean;
}

// Default flags
const defaultFlags: FeatureFlags = {
  // UI
  darkMode: true,
  glassUI: true,
  animations: true,
  
  // 3D
  advancedCamera: true,
  realtimeShadows: true,
  postProcessing: false, // Heavy performance
  
  // Upload
  resumableUpload: true,
  multiFileUpload: true,
  dragDropUpload: true,
  
  // Processing
  autoRepair: false, // MVP: Manual trigger
  aiOptimization: false, // Future
  formatConversion: false, // Requires Blender
  
  // Collaboration
  realtimeCollaboration: false, // Future
  comments: false, // Future
  sharing: false, // Future
  
  // Enterprise
  customBranding: false, // Enterprise only
  apiAccess: false, // Enterprise only
  priorityRendering: false // Enterprise only
};

// Storage key
const STORAGE_KEY = 'teeli_feature_flags';

/**
 * Feature flag manager (singleton)
 */
class FeatureFlagManager {
  private flags: FeatureFlags;
  private listeners: Set<(flags: FeatureFlags) => void> = new Set();
  
  constructor() {
    this.flags = this.loadFlags();
  }
  
  private loadFlags(): FeatureFlags {
    if (typeof window === 'undefined') return defaultFlags;
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...defaultFlags, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Failed to load feature flags:', error);
    }
    
    return defaultFlags;
  }
  
  private saveFlags() {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.flags));
    } catch (error) {
      console.error('Failed to save feature flags:', error);
    }
  }
  
  getFlags(): FeatureFlags {
    return { ...this.flags };
  }
  
  isEnabled(flag: keyof FeatureFlags): boolean {
    return this.flags[flag];
  }
  
  setFlag(flag: keyof FeatureFlags, enabled: boolean) {
    this.flags[flag] = enabled;
    this.saveFlags();
    this.notifyListeners();
  }
  
  setFlags(updates: Partial<FeatureFlags>) {
    this.flags = { ...this.flags, ...updates };
    this.saveFlags();
    this.notifyListeners();
  }
  
  resetToDefaults() {
    this.flags = { ...defaultFlags };
    this.saveFlags();
    this.notifyListeners();
  }
  
  subscribe(listener: (flags: FeatureFlags) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  
  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.getFlags()));
  }
}

// Singleton instance
const manager = new FeatureFlagManager();

/**
 * Get all feature flags
 */
export function getFlags(): FeatureFlags {
  return manager.getFlags();
}

/**
 * Check if a feature is enabled
 */
export function isEnabled(flag: keyof FeatureFlags): boolean {
  return manager.isEnabled(flag);
}

/**
 * Set a feature flag
 */
export function setFlag(flag: keyof FeatureFlags, enabled: boolean) {
  manager.setFlag(flag, enabled);
}

/**
 * Set multiple feature flags
 */
export function setFlags(updates: Partial<FeatureFlags>) {
  manager.setFlags(updates);
}

/**
 * Reset to default flags
 */
export function resetFlags() {
  manager.resetToDefaults();
}

/**
 * React hook for feature flags
 */
export function useFeatureFlags(): FeatureFlags {
  const [flags, setFlagsState] = useState<FeatureFlags>(manager.getFlags());
  
  useEffect(() => {
    return manager.subscribe(setFlagsState);
  }, []);
  
  return flags;
}

/**
 * React hook for single feature flag
 */
export function useFeatureFlag(flag: keyof FeatureFlags): boolean {
  const flags = useFeatureFlags();
  return flags[flag];
}

/**
 * HOC to conditionally render based on feature flag
 */
export function withFeatureFlag<P extends object>(
  Component: React.ComponentType<P>,
  flag: keyof FeatureFlags,
  Fallback?: React.ComponentType<P>
) {
  return (props: P) => {
    const enabled = useFeatureFlag(flag);
    
    if (!enabled) {
      return Fallback ? <Fallback {...props} /> : null;
    }
    
    return <Component {...props} />;
  };
}

// Export types
export type { FeatureFlags };
