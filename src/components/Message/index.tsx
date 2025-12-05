import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Message as MessageType } from '../../types/message';
import styles from './index.module.scss';

interface MessageProps {
  message: MessageType;
  onClose: (id: string) => void;
}

const Message: React.FC<MessageProps> = ({ message, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [progress, setProgress] = useState(100);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  const handleClose = useCallback(() => {
    setIsLeaving(true);
    // 清除倒计时
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setTimeout(() => {
      onClose(message.id);
    }, 400); // 等待退出动画完成
  }, [message.id, onClose]);

  useEffect(() => {
    // 触发进入动画
    setTimeout(() => setIsVisible(true), 10);

    // 倒计时逻辑
    if (message.duration && message.duration > 0) {
      startTimeRef.current = Date.now();
      const updateInterval = 16; // 约 60fps
      const totalDuration = message.duration;

      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        const remaining = Math.max(0, totalDuration - elapsed);
        const newProgress = (remaining / totalDuration) * 100;
        
        setProgress(newProgress);

        if (remaining <= 0) {
          handleClose();
        }
      }, updateInterval);

      // 自动关闭
      const timer = setTimeout(() => {
        handleClose();
      }, totalDuration);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        clearTimeout(timer);
      };
    } else {
      // 如果没有设置 duration，不显示倒计时
      setProgress(0);
    }
  }, [message.duration, handleClose]);

  const getIcon = () => {
    switch (message.type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '';
    }
  };

  return (
    <div
      className={`${styles.message} ${styles[`message_${message.type}`]} ${isVisible ? styles.message_enter : ''} ${isLeaving ? styles.message_leave : ''}`}
      onClick={handleClose}
    >
      <span className={styles.message_icon}>{getIcon()}</span>
      <span className={styles.message_content}>{message.content}</span>
      <button className={styles.message_close} onClick={handleClose}>
        ×
      </button>
      {message.duration && message.duration > 0 && (
        <div className={styles.message_progress_container}>
          <div 
            className={styles.message_progress_bar}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default Message;
