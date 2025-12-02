/**
 * useUpload Hook
 * 
 * Shared file upload hook using Uppy.
 * Supports resumable uploads with TUS protocol.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import Uppy, { type UppyFile } from '@uppy/core';
import Tus from '@uppy/tus';

export interface UploadConfig {
  endpoint: string;
  maxFileSize?: number; // in MB
  allowedTypes?: string[];
  maxFiles?: number;
}

export interface UploadState {
  files: UppyFile[];
  progress: number;
  isUploading: boolean;
  error: string | null;
  uploadedFiles: string[];
}

export interface UploadControls {
  addFile: (file: File) => void;
  removeFile: (fileId: string) => void;
  startUpload: () => Promise<void>;
  cancelUpload: () => void;
  resetUpload: () => void;
}

/**
 * Main upload hook with Uppy integration
 */
export function useUpload(config: UploadConfig): [UploadState, UploadControls] {
  const uppyRef = useRef<Uppy | null>(null);
  
  const [state, setState] = useState<UploadState>({
    files: [],
    progress: 0,
    isUploading: false,
    error: null,
    uploadedFiles: []
  });
  
  // Initialize Uppy
  useEffect(() => {
    const uppy = new Uppy({
      restrictions: {
        maxFileSize: (config.maxFileSize || 500) * 1024 * 1024, // Convert MB to bytes
        maxNumberOfFiles: config.maxFiles || 10,
        allowedFileTypes: config.allowedTypes || ['.glb', '.gltf', '.obj', '.fbx', '.stl']
      },
      autoProceed: false
    });
    
    // Add TUS plugin for resumable uploads
    uppy.use(Tus, {
      endpoint: config.endpoint,
      resume: true,
      autoRetry: true,
      retryDelays: [0, 1000, 3000, 5000]
    });
    
    // File added
    uppy.on('file-added', (file) => {
      setState(prev => ({
        ...prev,
        files: [...prev.files, file],
        error: null
      }));
    });
    
    // File removed
    uppy.on('file-removed', (file) => {
      setState(prev => ({
        ...prev,
        files: prev.files.filter(f => f.id !== file.id)
      }));
    });
    
    // Upload progress
    uppy.on('progress', (progress) => {
      setState(prev => ({
        ...prev,
        progress,
        isUploading: progress < 100
      }));
    });
    
    // Upload complete
    uppy.on('complete', (result) => {
      const successfulUrls = result.successful.map(file => file.uploadURL || '');
      setState(prev => ({
        ...prev,
        isUploading: false,
        progress: 100,
        uploadedFiles: [...prev.uploadedFiles, ...successfulUrls]
      }));
    });
    
    // Upload error
    uppy.on('error', (error) => {
      setState(prev => ({
        ...prev,
        isUploading: false,
        error: error.message
      }));
    });
    
    uppyRef.current = uppy;
    
    // Cleanup
    return () => {
      uppy.close();
    };
  }, [config.endpoint, config.maxFileSize, config.maxFiles]);
  
  // Controls
  const addFile = useCallback((file: File) => {
    try {
      uppyRef.current?.addFile({
        name: file.name,
        type: file.type,
        data: file
      });
    } catch (error: any) {
      setState(prev => ({ ...prev, error: error.message }));
    }
  }, []);
  
  const removeFile = useCallback((fileId: string) => {
    uppyRef.current?.removeFile(fileId);
  }, []);
  
  const startUpload = useCallback(async () => {
    if (!uppyRef.current) return;
    
    try {
      setState(prev => ({ ...prev, isUploading: true, error: null }));
      await uppyRef.current.upload();
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isUploading: false,
        error: error.message
      }));
    }
  }, []);
  
  const cancelUpload = useCallback(() => {
    uppyRef.current?.cancelAll();
    setState(prev => ({
      ...prev,
      isUploading: false,
      progress: 0
    }));
  }, []);
  
  const resetUpload = useCallback(() => {
    uppyRef.current?.cancelAll();
    setState({
      files: [],
      progress: 0,
      isUploading: false,
      error: null,
      uploadedFiles: []
    });
  }, []);
  
  return [
    state,
    {
      addFile,
      removeFile,
      startUpload,
      cancelUpload,
      resetUpload
    }
  ];
}
