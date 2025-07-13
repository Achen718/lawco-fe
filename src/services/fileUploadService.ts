import { getToken } from './authService';

const API_URL = 'http://localhost:8000/api';

export interface FileUploadResult {
  id: string;
  original_name: string;
  mimetype: string;
  size: number;
  internal_id: string;
  internal_name: string;
}

export async function uploadFile(file: File): Promise<FileUploadResult> {
  const token = getToken();
  if (!token) {
    throw new Error('No authentication token found');
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_URL}/files/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || `Upload failed: ${response.statusText}`
      );
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('File upload error:', error);
    throw error;
  }
}

export async function uploadMultipleFiles(
  files: File[]
): Promise<FileUploadResult[]> {
  const uploadPromises = files.map((file) => uploadFile(file));
  return Promise.all(uploadPromises);
}

export function getFileIcon(file: File): string {
  if (file.type.startsWith('image/')) return '🖼️';
  if (file.type === 'application/pdf') return '📄';
  if (file.type === 'text/plain') return '📝';
  if (file.type.includes('word')) return '📄';
  return '📎';
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const ACCEPTED_FILE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export function isValidFileType(file: File): boolean {
  return ACCEPTED_FILE_TYPES.includes(file.type);
}

export function isValidFileSize(file: File): boolean {
  return file.size <= MAX_FILE_SIZE;
}
