import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Movie } from '../../types/movie';
import LazyImage from '../LazyImage';
import styles from './index.module.scss';

interface MovieCardProps {
  movie: Movie;
  onClick?: (movie: Movie) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingIntervalRef = useRef<number | null>(null);

  const handleClick = () => {
    onClick?.(movie);
  };

  // 构建图片 URL（假设使用 TMDB API）
  const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
  const posterUrl = movie.poster_path 
    ? `${imageBaseUrl}${movie.poster_path}` 
    : '/placeholder-movie.png';

  // 打字效果
  useEffect(() => {
    if (isHovered && movie.overview) {
      setIsTyping(true);
      setDisplayedText('');
      let currentIndex = 0;
      const overview = movie.overview;

      // 清除之前的定时器
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }

      typingIntervalRef.current = window.setInterval(() => {
        if (currentIndex < overview.length) {
          setDisplayedText(overview.substring(0, currentIndex + 1));
          currentIndex++;
        } else {
          setIsTyping(false);
          if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current);
          }
        }
      }, 30); // 每个字符间隔30ms

      return () => {
        if (typingIntervalRef.current) {
          clearInterval(typingIntervalRef.current);
        }
      };
    } else {
      // 鼠标移出时重置
      setDisplayedText('');
      setIsTyping(false);
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    }
  }, [isHovered, movie.overview]);

  return (
    <div 
      className={styles.movie_card} 
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
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
        <div className={styles.info}>
          <h3 className={styles.title} title={movie.title}>
            {movie.title}
          </h3>
          {movie.release_date && (
            <p className={styles.release_date}>
              {new Date(movie.release_date).getFullYear()}
            </p>
          )}
          {isHovered && movie.overview && (
            <>
              <p className={styles.overview}>
                {displayedText}
                {isTyping && <span className={styles.cursor}>|</span>}
              </p>
              <button 
                className={styles.more_button}
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
              >
                {t('movie.viewMore')}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;

