import React from 'react';
import { Movie } from '../../types/movie';
import LazyImage from '../LazyImage';
import styles from './index.module.scss';

interface MovieCardProps {
  movie: Movie;
  onClick?: (movie: Movie) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
  const handleClick = () => {
    onClick?.(movie);
  };

  // 构建图片 URL（假设使用 TMDB API）
  const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
  const posterUrl = movie.poster_path 
    ? `${imageBaseUrl}${movie.poster_path}` 
    : '/placeholder-movie.png';

  return (
    <div className={styles.movie_card} onClick={handleClick}>
      <div className={styles.poster_wrapper}>
        <LazyImage 
          src={posterUrl} 
          alt={movie.title}
          className={styles.poster}
          aspectRatio="2/3"
        />
        <div className={styles.overlay}>
          <div className={styles.rating}>
            ⭐ {movie.vote_average.toFixed(1)}
          </div>
        </div>
      </div>
      <div className={styles.info}>
        <h3 className={styles.title} title={movie.title}>
          {movie.title}
        </h3>
        {movie.release_date && (
          <p className={styles.release_date}>
            {new Date(movie.release_date).getFullYear()}
          </p>
        )}
      </div>
    </div>
  );
};

export default MovieCard;

