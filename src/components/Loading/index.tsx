import React from 'react';
import styles from './index.module.scss';

interface LoadingProps {
  size?: 'xs' | 'small' | 'medium' | 'large';
  text?: string;
  fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ 
  size = 'medium', 
  text,
  fullScreen = false 
}) => {
  return (
    <div className={`${styles.loading_wrapper} ${fullScreen ? styles.full_screen : ''}`}>
      <div className={`${styles.loading_spinner} ${styles[size]}`}>
        <div className={styles.spinner_circle}>
          <div className={styles.spinner_path}></div>
        </div>
      </div>
      {text && <div className={styles.loading_text}>{text}</div>}
    </div>
  );
};

export default Loading;

