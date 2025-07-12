const API_URL = 'http://localhost:8000/api'; // The router's address
const TOKEN_KEY = 'user_token'; // Storage key for the auth token

// Function to log in and get a token
export async function login(
  username: string,
  password: string
): Promise<string | null> {
  const params = new URLSearchParams();
  params.append('grant_type', 'password');
  params.append('username', username);
  params.append('password', password);

  try {
    const response = await fetch(`${API_URL}/login/access-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    const token = data.access_token;

    // Store the token in localStorage
    localStorage.setItem(TOKEN_KEY, token);
    return token;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Function to get the stored token
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

// Function to log out
export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
}
