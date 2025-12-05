import { useMessageContext } from '../contexts/MessageContext';
import { MessageType } from '../types/message';

export const useMessage = () => {
  const { showMessage } = useMessageContext();

  return {
    success: (content: string, duration?: number) => showMessage('success', content, duration),
    error: (content: string, duration?: number) => showMessage('error', content, duration),
    warning: (content: string, duration?: number) => showMessage('warning', content, duration),
    info: (content: string, duration?: number) => showMessage('info', content, duration),
  };
};

