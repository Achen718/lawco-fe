const API_URL = 'http://localhost:8000/api'; // Use router port

export interface ModelConfig {
  id: string;
  name: string;
  provider: string;
  model: string;
  temperature: number;
  system_prompt: string;
  is_active: boolean;
}

export interface ModelProviderDTO {
  provider: string;
  api_key?: string;
  configs: ModelConfigDTO[];
  metadata?: any;
}

export interface ModelConfigDTO {
  id: string;
  name: string;
  model: string;
  system_prompt: string;
  temperature: number;
  credentials: any;
  user_prompt?: string;
  max_last_messages: number;
}

export async function getAvailableModels(): Promise<ModelProviderDTO[]> {
  const token = localStorage.getItem('user_token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  try {
    const response = await fetch(`${API_URL}/llm/model/configs`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Raw API response:', data);
    return data;
  } catch (error) {
    console.error('Error fetching available models:', error);
    throw error;
  }
}

export async function getDefaultModel(): Promise<ModelConfig | null> {
  try {
    const providers = await getAvailableModels();
    console.log('Available providers:', providers);

    // Find the first provider with configs
    for (const provider of providers) {
      if (provider.configs && provider.configs.length > 0) {
        const config = provider.configs[0]; // Take the first config
        return {
          id: config.id,
          name: config.name,
          provider: provider.provider,
          model: config.model,
          temperature: config.temperature,
          system_prompt: config.system_prompt,
          is_active: true, // Assume active if it exists
        };
      }
    }

    console.warn('No model configurations found');
    return null;
  } catch (error) {
    console.error('Error getting default model:', error);
    return null;
  }
}
