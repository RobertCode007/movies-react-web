import React from 'react';
import styles from './index.module.scss';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ 
  width = '100%', 
  height = '20px',
  borderRadius = '8px',
  className 
}) => {
  return (
    <div 
      className={`${styles.skeleton} ${className || ''}`}
      style={{ width, height, borderRadius }}
    />
  );
};

export default Skeleton;

