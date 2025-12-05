import React, { createContext, useContext, useState, useCallback } from 'react';
import { Message, MessageType } from '../types/message';

interface MessageContextType {
  messages: Message[];
  showMessage: (type: MessageType, content: string, duration?: number) => void;
  removeMessage: (id: string) => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const showMessage = useCallback((type: MessageType, content: string, duration: number = 3000) => {
    const id = `message-${Date.now()}-${Math.random()}`;
    const newMessage: Message = { id, type, content, duration };

    setMessages((prev) => [...prev, newMessage]);

    // 自动移除消息
    if (duration > 0) {
      setTimeout(() => {
        removeMessage(id);
      }, duration);
    }
  }, []);

  const removeMessage = useCallback((id: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  }, []);

  return (
    <MessageContext.Provider value={{ messages, showMessage, removeMessage }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessageContext = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessageContext must be used within MessageProvider');
  }
  return context;
};

