// Get environment variables with Next.js process.env
const getEnvVar = (key: string, defaultValue: string): string => {
  return process.env[`NEXT_PUBLIC_${key}`] || defaultValue;
};

export const environment = {
  apiBaseUrl: getEnvVar('API_URL', 'http://localhost:8000'),
  wsBaseUrl: getEnvVar('WS_URL', 'ws://localhost:8000'),
};
