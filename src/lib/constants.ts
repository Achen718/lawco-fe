// API Configuration
export const API_ENDPOINTS = {
  UPLOAD: '/upload',
  AUTH: '/auth',
  CHAT: '/chat',
} as const;

// WebSocket Configuration
export const WEBSOCKET_CONFIG = {
  RECONNECT_ATTEMPTS: 5,
  RECONNECT_DELAY: 1000,
  HEARTBEAT_INTERVAL: 30000,
} as const;

// File Upload Configuration
export const FILE_UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['.pdf', '.txt', '.doc', '.docx'],
  MAX_FILES: 5,
} as const;

// Chat Configuration
export const CHAT_CONFIG = {
  MAX_MESSAGE_LENGTH: 1000,
  TYPING_INDICATOR_DELAY: 1000,
  MESSAGE_DEBOUNCE: 300,
} as const;

// UI Configuration
export const UI_CONFIG = {
  SIDEBAR_MIN_WIDTH: 200,
  SIDEBAR_MAX_WIDTH: 500,
  SIDEBAR_DEFAULT_WIDTH: 300,
  ANIMATION_DURATION: 200,
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  CHAT_HISTORY: 'chat_history',
  USER_PREFERENCES: 'user_preferences',
  DOCUMENTS: 'documents',
} as const;

export const USER_STORAGE_KEY = 'user';
export const TOKEN_KEY = 'auth_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';
export const ACTIVE_MODEL_KEY = 'active_model';
export const SIDEBAR_COLLAPSED = 'sidebar_collapsed';

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UPLOAD_FAILED: 'File upload failed. Please try again.',
  INVALID_FILE_TYPE: 'Invalid file type. Please select a supported file.',
  FILE_TOO_LARGE: 'File is too large. Please select a smaller file.',
  WEBSOCKET_ERROR: 'Connection error. Please refresh the page.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  FILE_UPLOADED: 'File uploaded successfully.',
  MESSAGE_SENT: 'Message sent successfully.',
} as const;
