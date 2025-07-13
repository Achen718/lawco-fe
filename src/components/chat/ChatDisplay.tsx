interface ConversationDisplayProps {
  messages: any[];
}

export const ChatDisplay = ({ messages }: ConversationDisplayProps) => {
  return (
    <div className='flex-1 overflow-y-auto p-4 space-y-2'>
      {messages.length === 0 ? (
        <div className='text-center text-gray-500 mt-8'>
          Start a conversation by typing a message below.
        </div>
      ) : (
        messages.map((msg, index) => {
          const isUser = msg.type === 'user_message';

          return (
            <div
              key={index}
              className={`mb-4 ${isUser ? 'text-right' : 'text-left'}`}
            >
              <div
                className={`inline-block max-w-[70%] p-3 rounded-lg ${
                  isUser
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className='font-semibold mb-1'>
                  {isUser ? 'You' : 'Agent'}:
                </div>
                <div className='whitespace-pre-wrap'>
                  {/* Handle different message types */}
                  {msg.type === 'raw_text' ? (
                    <div>{msg.data}</div>
                  ) : (
                    <div>
                      {msg.response?.response?.response ||
                        JSON.stringify(msg, null, 2)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
