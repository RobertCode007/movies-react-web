import React from 'react';
import Skeleton from '../Skeleton';
import styles from './index.module.scss';

const MovieCardSkeleton: React.FC = () => {
  return (
    <div className={styles.movie_card_skeleton}>
      <div className={styles.poster_skeleton}>
        <Skeleton 
          width="100%" 
          height="100%" 
          borderRadius="12px"
        />
      </div>
      <div className={styles.info_skeleton}>
        <Skeleton width="80%" height="20px" borderRadius="6px" />
        <Skeleton width="40%" height="16px" borderRadius="6px" className={styles.date_skeleton} />
      </div>
    </div>
  );
};

export default MovieCardSkeleton;

