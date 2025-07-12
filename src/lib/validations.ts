// File validation
export const validateFile = (
  file: File,
  maxSize: number,
  allowedTypes: string[]
): string | null => {
  if (file.size > maxSize) {
    return `File size exceeds ${formatFileSize(maxSize)}`;
  }

  const isValidType = allowedTypes.some((type) => {
    if (type.startsWith('.')) {
      return file.name.toLowerCase().endsWith(type.toLowerCase());
    }
    return file.type === type;
  });

  if (!isValidType) {
    return `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`;
  }

  return null;
};

// Message validation
export const validateMessage = (
  message: string,
  maxLength: number
): string | null => {
  if (!message.trim()) {
    return 'Message cannot be empty';
  }

  if (message.length > maxLength) {
    return `Message too long. Maximum ${maxLength} characters allowed`;
  }

  return null;
};

// Email validation
export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    return 'Email is required';
  }

  if (!emailRegex.test(email)) {
    return 'Invalid email format';
  }

  return null;
};

// Password validation
export const validatePassword = (password: string): string | null => {
  if (!password) {
    return 'Password is required';
  }

  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }

  if (!/(?=.*[a-z])/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }

  if (!/(?=.*\d)/.test(password)) {
    return 'Password must contain at least one number';
  }

  return null;
};

// URL validation
export const validateUrl = (url: string): string | null => {
  try {
    new URL(url);
    return null;
  } catch {
    return 'Invalid URL format';
  }
};

// Helper function for file size formatting
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
