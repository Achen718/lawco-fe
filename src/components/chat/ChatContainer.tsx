'use client';
import { useState, useEffect } from 'react';
import { login, getToken } from '@/services/authService';
import { websocketManager } from '@/services/websocketService';
import { getDefaultModel, ModelConfig } from '@/services/modelService';
import { uploadFile, FileUploadResult } from '@/services/fileUploadService';
import { ChatDisplay } from './ChatDisplay';
import { ChatInput } from './ChatInput';
import { Message } from '@/types/chat';

interface UploadResult {
  id: string;
  name: string;
}

interface FileMetadata {
  name: string;
  type: string;
  size: number;
}

export function ChatContainer() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [modelConfig, setModelConfig] = useState<ModelConfig | null>(null);
  const [modelError, setModelError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<
    Record<string, FileMetadata>
  >({});

  // Effect to automatically log in and connect to WebSocket on component mount
  useEffect(() => {
    const autoLoginAndConnect = async () => {
      let token = getToken();
      if (!token) {
        console.log('No token found, logging in automatically...');
        // Input your credentials for AgentOS - change to your own credentials
        token = await login('username', 'password');
      }

      // If we have a token (either from storage or after auto-login), connect
      if (token) {
        setIsAuthenticated(true);
        websocketManager.connect();
        websocketManager.onMessage((newMessage) => {
          // Update the messages state when a new message arrives
          console.log('Received message:', newMessage);

          // Filter out agent logs, only show actual responses
          if (newMessage.type === 'agent_log') {
            // Skip log messages
            return;
          }

          // Add all messages to the array - let the display component handle the rendering
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        });

        const fetchModel = async () => {
          try {
            const model = await getDefaultModel();
            console.log('Fetched model configuration:', model);
            if (model) {
              console.log('Default model loaded:', model);
              console.log('Provider:', model.provider, 'Model:', model.model);
              setModelConfig(model);
              setModelError(null);
            } else {
              const errorMsg =
                'No model configurations found. Please set up a model configuration first.';
              console.error(errorMsg);
              setModelError(errorMsg);
            }
          } catch (error) {
            const errorMsg =
              'Failed to fetch model configuration: ' +
              (error as Error).message;
            console.error(errorMsg);
            setModelError(errorMsg);
          }
        };

        fetchModel();
      } else {
        console.error(
          'Automatic authentication failed. Please check credentials.'
        );
      }
    };

    autoLoginAndConnect();
  }, []); // The empty dependency array ensures this runs only once on mount

  const handleFileUpload = async (file: File): Promise<UploadResult> => {
    setIsUploading(true);
    try {
      const uploadResult: FileUploadResult = await uploadFile(file);

      // Store file metadata
      setUploadedFiles((prev) => ({
        ...prev,
        [uploadResult.id]: {
          name: file.name,
          type: file.type,
          size: file.size,
        },
      }));

      // Return object with id and name
      return { id: uploadResult.id, name: file.name };
    } catch (error) {
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendMessage = async (input: string, fileIds?: string[]) => {
    if ((input.trim() || fileIds?.length) && modelConfig) {
      // Validate that we have the required fields
      if (!modelConfig.provider || !modelConfig.model) {
        console.error('Model configuration is incomplete:', modelConfig);
        return;
      }

      // Add user's message to UI immediately for better UX
      const userMessage = {
        type: 'user_message',
        response: { response: { response: input } },
        files: fileIds?.map((fileId) => ({
          id: fileId,
          name: uploadedFiles[fileId]?.name || fileId,
          size: uploadedFiles[fileId]?.size || 0,
        })),
      };

      setMessages((prevMessages) => [...prevMessages, userMessage]);

      // Send message with file IDs (matching genai-agentos format)
      const messageToSend = {
        message: input,
        llm_name: modelConfig.name,
        provider: modelConfig.provider,
        ...(fileIds && fileIds.length > 0 && { files: fileIds }),
      };

      console.log('Sending message with payload:', messageToSend);
      websocketManager.sendMessage(messageToSend);
    } else {
      console.log(
        'Cannot send message - input:',
        input.trim(),
        'fileIds:',
        fileIds?.length,
        'modelConfig:',
        modelConfig
      );
    }
  };

  if (!isAuthenticated) {
    return <div>Connecting and authenticating...</div>;
  }

  if (modelError) {
    return (
      <div>
        <h1>Chat</h1>
        <div
          style={{
            color: 'red',
            padding: '20px',
            border: '1px solid red',
            borderRadius: '5px',
          }}
        >
          <p>
            <strong>Configuration Error:</strong>
          </p>
          <p>{modelError}</p>
          <p>
            Please set up a model configuration through the settings page or
            contact your administrator.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col h-full'>
      <ChatDisplay messages={messages} />
      <ChatInput
        onSendMessage={handleSendMessage}
        onFileUpload={handleFileUpload}
        disabled={!modelConfig}
        isUploading={isUploading}
        placeholder={
          modelConfig
            ? 'Ask the agent anything...'
            : 'Loading model configuration...'
        }
      />
    </div>
  );
}
