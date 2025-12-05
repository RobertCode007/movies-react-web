import React from 'react';
import { Movie } from '../../types/movie';
import LazyImage from '../LazyImage';
import styles from './index.module.scss';

interface MovieListItemProps {
  movie: Movie;
  onClick?: (movie: Movie) => void;
}

const MovieListItem: React.FC<MovieListItemProps> = ({ movie, onClick }) => {
  const handleClick = () => {
    onClick?.(movie);
  };

  // 构建图片 URL（假设使用 TMDB API）
  const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
  const posterUrl = movie.poster_path 
    ? `${imageBaseUrl}${movie.poster_path}` 
    : '/placeholder-movie.png';

  return (
    <div className={styles.movie_list_item} onClick={handleClick}>
      <div className={styles.poster_wrapper}>
        <LazyImage 
          src={posterUrl} 
          alt={movie.title}
          className={styles.poster}
          aspectRatio="2/3"
        />
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title} title={movie.title}>
            {movie.title}
          </h3>
          <div className={styles.rating}>
            ⭐ {movie.vote_average.toFixed(1)}
          </div>
        </div>
        {movie.overview && (
          <p className={styles.overview}>
            {movie.overview.length > 200 
              ? `${movie.overview.substring(0, 200)}...` 
              : movie.overview}
          </p>
        )}
        <div className={styles.footer}>
          {movie.release_date && (
            <span className={styles.release_date}>
              {new Date(movie.release_date).getFullYear()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieListItem;

