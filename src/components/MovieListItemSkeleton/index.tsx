import React from 'react';
import Skeleton from '../Skeleton';
import styles from './index.module.scss';

const MovieListItemSkeleton: React.FC = () => {
  return (
    <div className={styles.movie_list_item_skeleton}>
      <div className={styles.poster_skeleton}>
        <Skeleton 
          width="100%" 
          height="100%" 
          borderRadius="8px"
        />
      </div>
      <div className={styles.content_skeleton}>
        <div className={styles.header_skeleton}>
          <Skeleton width="60%" height="24px" borderRadius="6px" />
          <Skeleton width="80px" height="28px" borderRadius="6px" />
        </div>
        <Skeleton width="100%" height="16px" borderRadius="6px" />
        <Skeleton width="90%" height="16px" borderRadius="6px" />
        <Skeleton width="70%" height="16px" borderRadius="6px" />
        <div className={styles.footer_skeleton}>
          <Skeleton width="60px" height="16px" borderRadius="6px" />
        </div>
      </div>
    </div>
  );
};

export default MovieListItemSkeleton;

