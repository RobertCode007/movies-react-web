import React, { useState, useEffect } from 'react';
import Skeleton from '../Skeleton';
import styles from './index.module.scss';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  skeletonClassName?: string;
  aspectRatio?: string; // 例如 '2/3' 或 '16/9'
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  skeletonClassName = '',
  aspectRatio = '2/3',
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // 重置状态当 src 改变时
    setIsLoading(true);
    setIsLoaded(false);
    setHasError(false);

    const img = new Image();
    img.src = src;

    img.onload = () => {
      setIsLoading(false);
      // 延迟一点时间以确保图片已经渲染
      setTimeout(() => {
        setIsLoaded(true);
      }, 50);
    };

    img.onerror = () => {
      setIsLoading(false);
      setHasError(true);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return (
    <div 
      className={`${styles.image_container} ${className}`}
      style={{ aspectRatio }}
    >
      {isLoading && (
        <Skeleton 
          className={`${styles.skeleton} ${skeletonClassName}`}
          width="100%"
          height="100%"
          borderRadius="0"
        />
      )}
      {!hasError && (
        <img
          src={src}
          alt={alt}
          className={`${styles.image} ${isLoaded ? styles.fade_in : ''}`}
          style={{ opacity: isLoaded ? 1 : 0 }}
        />
      )}
      {hasError && (
        <div className={styles.error_placeholder}>
          <span>图片加载失败</span>
        </div>
      )}
    </div>
  );
};

export default LazyImage;

