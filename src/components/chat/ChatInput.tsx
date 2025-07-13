'use client';
import { useState, useRef } from 'react';
import Image from 'next/image';
import { Paperclip, X, Send } from 'lucide-react';
import {
  getFileIcon,
  formatFileSize,
  isValidFileType,
  isValidFileSize,
} from '@/services/fileUploadService';

interface UploadResult {
  id: string;
  name: string;
}

interface ChatInputProps {
  onSendMessage: (message: string, fileIds?: string[]) => void;
  onFileUpload?: (file: File) => Promise<UploadResult>;
  disabled?: boolean;
  placeholder?: string;
  isUploading?: boolean;
}

interface AttachedFile {
  clientId: string;
  file: File;
  preview?: string;
  id?: string;
  loading: boolean;
  error?: string;
}

export const ChatInput = ({
  onSendMessage,
  onFileUpload,
  disabled = false,
  placeholder = 'Type your message...',
  isUploading = false,
}: ChatInputProps) => {
  const [input, setInput] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Get successfully uploaded file IDs
    const fileIds = attachedFiles
      .filter((file) => !file.loading && file.id && !file.error)
      .map((file) => file.id!);

    if ((input.trim() || fileIds.length > 0) && !disabled) {
      onSendMessage(input.trim(), fileIds);
      setInput('');

      // Remove successfully sent files, keep failed ones for retry
      setAttachedFiles((prev) =>
        prev.filter((file) => file.loading || file.error)
      );
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (!onFileUpload) {
      console.warn('No file upload handler provided');
      return;
    }

    // Filter valid files
    const validFiles = files.filter((file) => {
      if (!isValidFileType(file)) {
        console.warn(`Invalid file type: ${file.type}`);
        return false;
      }
      if (!isValidFileSize(file)) {
        console.warn(`File too large: ${file.size} bytes`);
        return false;
      }
      return true;
    });

    // Create placeholders immediately for UI feedback
    const newAttachedFiles: AttachedFile[] = validFiles.map((file) => {
      const clientId = `${Date.now()}-${file.name}`;
      const attachedFile: AttachedFile = {
        clientId,
        file,
        loading: true,
      };

      // Create preview for images
      if (file.type.startsWith('image/')) {
        attachedFile.preview = URL.createObjectURL(file);
      }

      return attachedFile;
    });

    setAttachedFiles((prev) => [...prev, ...newAttachedFiles]);

    // Upload files using the provided callback
    for (const attachedFile of newAttachedFiles) {
      try {
        const uploadResult = await onFileUpload(attachedFile.file);

        // Update with real file ID from backend
        setAttachedFiles((prev) =>
          prev.map((file) =>
            file.clientId === attachedFile.clientId
              ? { ...file, id: uploadResult.id, loading: false }
              : file
          )
        );
      } catch (error) {
        // Mark file as failed
        setAttachedFiles((prev) =>
          prev.map((file) =>
            file.clientId === attachedFile.clientId
              ? {
                  ...file,
                  loading: false,
                  error:
                    error instanceof Error ? error.message : 'Upload failed',
                }
              : file
          )
        );
        console.error('File upload failed:', error);
      }
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (clientId: string) => {
    setAttachedFiles((prev) => {
      const fileToRemove = prev.find((file) => file.clientId === clientId);
      // Revoke object URL to prevent memory leaks
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter((file) => file.clientId !== clientId);
    });
  };

  const retryUpload = async (clientId: string) => {
    if (!onFileUpload) return;

    const fileToRetry = attachedFiles.find(
      (file) => file.clientId === clientId
    );
    if (!fileToRetry || fileToRetry.loading || fileToRetry.id) return;

    // Set loading state
    setAttachedFiles((prev) =>
      prev.map((file) =>
        file.clientId === clientId
          ? { ...file, loading: true, error: undefined }
          : file
      )
    );

    try {
      const uploadResult = await onFileUpload(fileToRetry.file);

      // Update with real file ID
      setAttachedFiles((prev) =>
        prev.map((file) =>
          file.clientId === clientId
            ? { ...file, id: uploadResult.id, loading: false }
            : file
        )
      );
    } catch (error) {
      // Mark as failed again
      setAttachedFiles((prev) =>
        prev.map((file) =>
          file.clientId === clientId
            ? {
                ...file,
                loading: false,
                error: error instanceof Error ? error.message : 'Upload failed',
              }
            : file
        )
      );
      console.error('File upload retry failed:', error);
    }
  };

  const isAnyFileUploading = attachedFiles.some((file) => file.loading);
  const hasContent =
    input.trim() || attachedFiles.some((file) => file.id && !file.error);

  return (
    <div className='border-t bg-white p-4'>
      {/* File previews */}
      {attachedFiles.length > 0 && (
        <div className='mb-3 flex flex-wrap gap-2'>
          {attachedFiles.map((attachedFile) => (
            <div
              key={attachedFile.clientId}
              className={`relative inline-flex items-center rounded-lg p-2 max-w-xs ${
                attachedFile.loading
                  ? 'bg-blue-100 border-2 border-blue-300'
                  : attachedFile.error
                  ? 'bg-red-100 border-2 border-red-300'
                  : 'bg-gray-100'
              }`}
            >
              {attachedFile.preview ? (
                <Image
                  src={attachedFile.preview}
                  alt={attachedFile.file.name}
                  className='w-12 h-12 object-cover rounded mr-2'
                />
              ) : (
                <div className='w-12 h-12 flex items-center justify-center text-2xl mr-2'>
                  {getFileIcon(attachedFile.file)}
                </div>
              )}
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium text-gray-900 truncate'>
                  {attachedFile.file.name}
                </p>
                <p className='text-xs text-gray-500'>
                  {formatFileSize(attachedFile.file.size)}
                </p>
                {attachedFile.loading && (
                  <p className='text-xs text-blue-600'>Uploading...</p>
                )}
                {attachedFile.error && (
                  <div className='flex items-center gap-1'>
                    <p className='text-xs text-red-600'>{attachedFile.error}</p>
                    <button
                      onClick={() => retryUpload(attachedFile.clientId)}
                      className='text-xs text-blue-600 hover:text-blue-800 underline'
                    >
                      Retry
                    </button>
                  </div>
                )}
                {attachedFile.id &&
                  !attachedFile.loading &&
                  !attachedFile.error && (
                    <p className='text-xs text-green-600'>✓ Uploaded</p>
                  )}
              </div>
              <button
                type='button'
                onClick={() => removeFile(attachedFile.clientId)}
                className='ml-2 text-gray-400 hover:text-gray-600'
                disabled={attachedFile.loading}
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input form */}
      <form onSubmit={handleSubmit} className='flex items-center space-x-2'>
        <input
          ref={fileInputRef}
          type='file'
          multiple
          accept='image/*,.pdf,.txt,.doc,.docx'
          onChange={handleFileSelect}
          className='hidden'
        />

        <button
          type='button'
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isUploading || isAnyFileUploading}
          className='p-2 text-gray-500 hover:text-gray-700 disabled:text-gray-300'
          title='Attach files'
        >
          <Paperclip size={20} />
        </button>

        <input
          type='text'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          disabled={disabled || isUploading}
          className='flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed'
        />

        <button
          type='submit'
          disabled={
            disabled || isUploading || isAnyFileUploading || !hasContent
          }
          className='p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors'
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};
