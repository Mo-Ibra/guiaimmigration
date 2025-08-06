import React, { useState, useCallback } from 'react';
import { Upload, FileText, Loader2, CheckCircle, AlertCircle, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import * as pako from 'pako';

interface EnhancedFileUploadProps {
  guideId: number;
  onUploadSuccess: () => void;
  onUploadError?: (error: string) => void;
  maxFileSize?: number; // in MB
  acceptedTypes?: string[];
  showCompression?: boolean;
  attachmentNumber?: 1 | 2; // Which attachment slot (1 or 2)
  attachmentLabel?: string; // Custom label for the attachment
}

interface UploadProgress {
  stage: 'idle' | 'compressing' | 'uploading' | 'processing' | 'complete' | 'error';
  progress: number;
  message: string;
  retryCount?: number;
  canRetry?: boolean;
}

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks
const COMPRESSION_THRESHOLD = 10 * 1024 * 1024; // 10MB - compress files larger than this
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000; // 1 second

export const EnhancedFileUpload: React.FC<EnhancedFileUploadProps> = ({
  guideId,
  onUploadSuccess,
  onUploadError,
  maxFileSize = 100, // 100MB default
  acceptedTypes = ['.pdf', '.doc', '.docx'],
  showCompression = true,
  attachmentNumber = 1,
  attachmentLabel
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    stage: 'idle',
    progress: 0,
    message: ''
  });
  const [compressionEnabled, setCompressionEnabled] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [currentUploadId, setCurrentUploadId] = useState<string | null>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const retryWithBackoff = async <T,>(
    operation: () => Promise<T>,
    maxRetries: number = MAX_RETRY_ATTEMPTS,
    baseDelay: number = RETRY_DELAY
  ): Promise<T> => {
    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;

        if (attempt === maxRetries) {
          throw lastError;
        }

        const delay = baseDelay * Math.pow(2, attempt); // Exponential backoff
        setUploadProgress(prev => ({
          ...prev,
          message: `Upload failed, retrying in ${delay / 1000}s... (Attempt ${attempt + 1}/${maxRetries + 1})`,
          retryCount: attempt + 1
        }));

        await sleep(delay);
      }
    }

    throw lastError!;
  };

  const compressFile = async (file: File): Promise<{ compressedData: Uint8Array; compressionRatio: number }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const uint8Array = new Uint8Array(arrayBuffer);
          const compressed = pako.gzip(uint8Array);
          const compressionRatio = compressed.length / uint8Array.length;
          resolve({ compressedData: compressed, compressionRatio });
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  };

  const uploadChunked = async (file: File, compressed: boolean = false): Promise<void> => {
    let fileData: Uint8Array;
    let finalFileSize: number;

    if (compressed && file.size > COMPRESSION_THRESHOLD && compressionEnabled) {
      setUploadProgress({
        stage: 'compressing',
        progress: 0,
        message: 'Compressing file...'
      });

      const { compressedData, compressionRatio } = await compressFile(file);
      fileData = compressedData;
      finalFileSize = compressedData.length;

      toast({
        title: "Compression Complete",
        description: `File compressed to ${(compressionRatio * 100).toFixed(1)}% of original size`,
      });
    } else {
      const arrayBuffer = await file.arrayBuffer();
      fileData = new Uint8Array(arrayBuffer);
      finalFileSize = file.size;
    }

    const totalChunks = Math.ceil(finalFileSize / CHUNK_SIZE);
    
    // Initialize upload session
    setUploadProgress({
      stage: 'uploading',
      progress: 0,
      message: 'Initializing upload...'
    });

    const initResponse = await fetch(`/api/admin/guides/${guideId}/upload-large-file/init`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        fileName: file.name,
        fileSize: finalFileSize,
        totalChunks,
        fileType: file.type,
        compressed: compressed && file.size > COMPRESSION_THRESHOLD && compressionEnabled,
        attachmentNumber
      })
    });

    if (!initResponse.ok) {
      throw new Error('Failed to initialize upload');
    }

    const { uploadId } = await initResponse.json();
    setCurrentUploadId(uploadId);

    // Upload chunks with retry logic
    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      const start = chunkIndex * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, finalFileSize);
      const chunk = fileData.slice(start, end);

      await retryWithBackoff(async () => {
        const formData = new FormData();
        formData.append('chunk', new Blob([chunk]));
        formData.append('uploadId', uploadId);
        formData.append('chunkIndex', chunkIndex.toString());

        const chunkResponse = await fetch(`/api/admin/guides/${guideId}/upload-large-file/chunk`, {
          method: 'POST',
          body: formData,
          credentials: 'include'
        });

        if (!chunkResponse.ok) {
          const errorText = await chunkResponse.text();
          throw new Error(`Failed to upload chunk ${chunkIndex + 1}: ${errorText}`);
        }

        const chunkResult = await chunkResponse.json();
        setUploadProgress({
          stage: 'uploading',
          progress: chunkResult.progress,
          message: `Uploading chunk ${chunkIndex + 1} of ${totalChunks}...`,
          retryCount: 0
        });

        return chunkResult;
      });
    }

    // Complete upload
    setUploadProgress({
      stage: 'processing',
      progress: 100,
      message: 'Processing file...'
    });

    const completeResponse = await fetch(`/api/admin/guides/${guideId}/upload-large-file/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ uploadId, attachmentNumber })
    });

    if (!completeResponse.ok) {
      throw new Error('Failed to complete upload');
    }

    setUploadProgress({
      stage: 'complete',
      progress: 100,
      message: 'Upload complete!'
    });
  };

  const uploadDirect = async (file: File): Promise<void> => {
    let fileToUpload: File | Blob = file;
    let compressed = false;

    if (file.size > COMPRESSION_THRESHOLD && compressionEnabled) {
      setUploadProgress({
        stage: 'compressing',
        progress: 50,
        message: 'Compressing file...'
      });

      const { compressedData, compressionRatio } = await compressFile(file);
      fileToUpload = new Blob([compressedData], { type: file.type });
      compressed = true;

      toast({
        title: "Compression Complete",
        description: `File compressed to ${(compressionRatio * 100).toFixed(1)}% of original size`,
      });
    }

    setUploadProgress({
      stage: 'uploading',
      progress: 0,
      message: 'Uploading file...'
    });

    await retryWithBackoff(async () => {
      const formData = new FormData();
      formData.append('file', fileToUpload, file.name);
      formData.append('compressed', compressed.toString());
      formData.append('attachmentNumber', attachmentNumber.toString());

      const response = await fetch(`/api/admin/guides/${guideId}/upload-large-file-direct`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${errorText}`);
      }

      setUploadProgress({
        stage: 'uploading',
        progress: 90,
        message: 'Upload successful, processing...',
        retryCount: 0
      });

      return response;
    });

    setUploadProgress({
      stage: 'complete',
      progress: 100,
      message: 'Upload complete!'
    });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxFileSize * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: `File size must be less than ${maxFileSize}MB`,
        variant: "destructive"
      });
      return;
    }

    // Validate file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedTypes.includes(fileExtension)) {
      toast({
        title: "Invalid File Type",
        description: `Only ${acceptedTypes.join(', ')} files are allowed`,
        variant: "destructive"
      });
      return;
    }

    setSelectedFile(file);
    setUploadProgress({
      stage: 'idle',
      progress: 0,
      message: ''
    });
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      // Use chunked upload for files larger than 50MB or if compression is enabled for large files
      const shouldUseChunked = selectedFile.size > 50 * 1024 * 1024 || 
        (selectedFile.size > COMPRESSION_THRESHOLD && compressionEnabled);

      if (shouldUseChunked) {
        await uploadChunked(selectedFile, true);
      } else {
        await uploadDirect(selectedFile);
      }

      toast({
        title: "Upload Successful",
        description: "File has been uploaded successfully.",
      });

      onUploadSuccess();
      setSelectedFile(null);
    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadProgress({
        stage: 'error',
        progress: 0,
        message: error.message || 'Upload failed',
        canRetry: true
      });

      toast({
        title: "Upload Failed",
        description: error.message || 'An error occurred during upload. You can retry the upload.',
        variant: "destructive"
      });

      if (onUploadError) {
        onUploadError(error.message || 'Upload failed');
      }
    } finally {
      setIsUploading(false);
      setCurrentUploadId(null);
    }
  };

  const getStageIcon = () => {
    switch (uploadProgress.stage) {
      case 'compressing':
        return <Zap className="h-4 w-4 animate-pulse text-blue-500" />;
      case 'uploading':
      case 'processing':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'complete':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Upload className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {attachmentLabel || `Upload Guide File ${attachmentNumber} (PDF, DOC, DOCX)`}
        </label>
        <input
          type="file"
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          disabled={isUploading}
          className="w-full p-2 border border-gray-300 rounded-md disabled:opacity-50"
        />
      </div>

      {selectedFile && (
        <div className="p-3 bg-gray-50 rounded-md border">
          <div className="flex items-center space-x-2 mb-2">
            <FileText className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">{selectedFile.name}</span>
          </div>
          <p className="text-xs text-gray-600">
            Size: {formatFileSize(selectedFile.size)}
          </p>
          
          {showCompression && selectedFile.size > COMPRESSION_THRESHOLD && (
            <div className="mt-2 flex items-center space-x-2">
              <input
                type="checkbox"
                id="compression"
                checked={compressionEnabled}
                onChange={(e) => setCompressionEnabled(e.target.checked)}
                disabled={isUploading}
                className="rounded"
              />
              <label htmlFor="compression" className="text-xs text-gray-600">
                Enable compression (recommended for large files)
              </label>
            </div>
          )}
        </div>
      )}

      {uploadProgress.stage !== 'idle' && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            {getStageIcon()}
            <span className="text-sm text-gray-600">{uploadProgress.message}</span>
            {uploadProgress.retryCount && uploadProgress.retryCount > 0 && (
              <span className="text-xs text-orange-500">
                (Retry {uploadProgress.retryCount}/{MAX_RETRY_ATTEMPTS})
              </span>
            )}
          </div>
          {uploadProgress.progress > 0 && (
            <Progress value={uploadProgress.progress} className="w-full" />
          )}
        </div>
      )}

      {uploadProgress.stage === 'error' && uploadProgress.canRetry ? (
        <div className="flex space-x-2">
          <Button
            onClick={handleUpload}
            disabled={isUploading}
            className="flex-1"
            variant="outline"
          >
            <Upload className="h-4 w-4 mr-2" />
            Retry Upload
          </Button>
          <Button
            onClick={() => {
              setSelectedFile(null);
              setUploadProgress({ stage: 'idle', progress: 0, message: '' });
            }}
            variant="ghost"
            className="px-3"
          >
            Cancel
          </Button>
        </div>
      ) : (
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          className="w-full"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {uploadProgress.message || 'Uploading...'}
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload File
            </>
          )}
        </Button>
      )}
    </div>
  );
};
