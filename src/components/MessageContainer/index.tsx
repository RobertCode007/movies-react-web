import React from 'react';
import { useMessageContext } from '../../contexts/MessageContext';
import Message from '../Message';
import styles from './index.module.scss';

const MessageContainer: React.FC = () => {
  const { messages, removeMessage } = useMessageContext();

  if (messages.length === 0) {
    return null;
  }

  return (
    <div className={styles.message_container}>
      {messages.map((message) => (
        <Message key={message.id} message={message} onClose={removeMessage} />
      ))}
    </div>
  );
};

export default MessageContainer;

