'use client';
import { useState, useEffect } from 'react';
import { login, getToken } from '../services/authService';
import { websocketManager } from '../services/websocketService';
import { getDefaultModel, ModelConfig } from '../services/modelService';

export function ChatComponent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [modelConfig, setModelConfig] = useState<ModelConfig | null>(null);
  const [modelError, setModelError] = useState<string | null>(null);

  // Effect to automatically log in and connect to WebSocket on component mount
  useEffect(() => {
    const autoLoginAndConnect = async () => {
      // Check if we already have a valid token
      let token = getToken();
      if (!token) {
        // If not, log in automatically with your static credentials
        console.log('No token found, logging in automatically...');
        token = await login('achen', '123A45b6c!');
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

          // Check if this is a final response with the actual answer
          if (newMessage.response && typeof newMessage.response === 'string') {
            // This is the final response we want to show - extract just the response text
            setMessages((prevMessages) => [
              ...prevMessages,
              {
                type: 'agent_response',
                response: { response: newMessage.response }, // Just the clean response text
              },
            ]);
          } else if (newMessage.agents_trace && newMessage.response) {
            // This is the complex response object - extract just the response text
            setMessages((prevMessages) => [
              ...prevMessages,
              {
                type: 'agent_response',
                response: { response: newMessage.response }, // Just the clean response text
              },
            ]);
          } else {
            // For other message types, show as before
            setMessages((prevMessages) => [...prevMessages, newMessage]);
          }
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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && modelConfig) {
      // Validate that we have the required fields
      if (!modelConfig.provider || !modelConfig.model) {
        console.error('Model configuration is incomplete:', modelConfig);
        return;
      }

      // Add user's message to UI immediately for better UX
      setMessages([
        ...messages,
        { type: 'user_message', response: { response: input } },
      ]);

      // Send message in the same format as ChatArea.tsx
      const messageToSend = {
        message: input,
        llm_name: modelConfig.name, // Use config name, not model field
        provider: modelConfig.provider,
      };

      console.log('Sending message with payload:', messageToSend);
      websocketManager.sendMessage(messageToSend);
      setInput('');
    } else {
      console.log(
        'Cannot send message - input:',
        input.trim(),
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
    <div>
      {/* output */}
      <div className='message-list'>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.type === 'user_message' ? 'You' : 'Agent'}:</strong>
            {/* Handle different message types */}
            {msg.type === 'raw_text' ? (
              <div>{msg.data}</div>
            ) : (
              <pre>
                {JSON.stringify(msg.response?.response || msg, null, 2)}
              </pre>
            )}
          </div>
        ))}
      </div>
      {/* input */}
      <form onSubmit={handleSendMessage}>
        <input
          type='text'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            modelConfig
              ? 'Ask the agent anything...'
              : 'Loading model configuration...'
          }
          disabled={!modelConfig}
        />
        <button type='submit' disabled={!modelConfig}>
          Send
        </button>
      </form>
    </div>
  );
}
