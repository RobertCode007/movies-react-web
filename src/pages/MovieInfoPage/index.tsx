import React, { useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../hooks/useLanguage';
import { useRequest } from '../../hooks/useRequest';
import { useMessage } from '../../hooks/useMessage';
import { getMovieDetails } from '../../api/api';
import { MovieDetails } from '../../types/movie';
import LazyImage from '../../components/LazyImage';
import MovieInfoPageSkeleton from '../../components/MovieInfoPageSkeleton';
import styles from './index.module.scss';

// 将语言代码转换为 API 需要的格式
const getApiLanguage = (lang: string): string => {
  if (lang === 'en') return 'en-US';
  if (lang === 'zh-TW') return 'zh-TW';
  return 'en-US';
};

// 格式化时长（分钟转换为小时和分钟）
const formatRuntime = (minutes: number | null): string => {
  if (!minutes) return '';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
};

// 格式化货币
const formatCurrency = (amount: number): string => {
  if (amount === 0) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// 格式化日期
const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const MovieInfoPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const { error: showError } = useMessage();

  // 请求函数
  const requestFn = useCallback(
    (movieId: number) => {
      const language = getApiLanguage(currentLanguage);
      return getMovieDetails(movieId, { language });
    },
    [currentLanguage]
  );

  // 错误处理回调
  const handleError = useCallback((error: any) => {
    console.error('Failed to load movie details:', error);
    // 显示错误消息
    const errorMessage = error.response?.data?.message || error.message || t('common.loadFailed') || 'Failed to load movie details';
    showError(errorMessage);
  }, [showError, t]);

  // 使用 useRequest 处理请求
  const { data: movie, loading, error, run } = useRequest<MovieDetails>(requestFn, {
    manual: true,
    onError: handleError,
  });

  // 当 ID 或语言变化时加载数据
  useEffect(() => {
    if (id) {
      const movieId = parseInt(id, 10);
      if (!isNaN(movieId)) {
        run(movieId);
      }
    }
  }, [id, currentLanguage, run]);

  // 构建图片 URL
  const imageBaseUrl = 'https://image.tmdb.org/t/p';
  const getPosterUrl = (posterPath: string | null, size: string = 'w500') => {
    return posterPath ? `${imageBaseUrl}/${size}${posterPath}` : '/placeholder-movie.png';
  };

  const getBackdropUrl = (backdropPath: string | null, size: string = 'w1280') => {
    return backdropPath ? `${imageBaseUrl}/${size}${backdropPath}` : null;
  };

  // 加载中状态或错误状态 - 都显示骨架屏
  if (loading || error || !movie) {
    return <MovieInfoPageSkeleton />;
  }

  const backdropUrl = getBackdropUrl(movie.backdrop_path);

  return (
    <div className={styles.page}>
      {/* 背景图片 */}
      {backdropUrl && (
        <div className={styles.backdrop}>
          <LazyImage src={backdropUrl} alt={movie.title} className={styles.backdrop_image} />
          <div className={styles.backdrop_overlay}></div>
        </div>
      )}

      <div className={styles.container}>
        {/* 返回按钮 */}
        <button className={styles.back_button} onClick={() => navigate(-1)}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          {t('common.goBack') || 'Go Back'}
        </button>

        {/* 主要内容 */}
        <div className={styles.content}>
          {/* 左侧：海报 */}
          <div className={styles.poster_section}>
            <div className={styles.poster_wrapper}>
              <LazyImage
                src={getPosterUrl(movie.poster_path)}
                alt={movie.title}
                className={styles.poster}
                aspectRatio="2/3"
              />
            </div>
          </div>

          {/* 右侧：详细信息 */}
          <div className={styles.info_section}>
            {/* 标题和评分 */}
            <div className={styles.header}>
              <h1 className={styles.title}>{movie.title}</h1>
              {movie.original_title !== movie.title && (
                <p className={styles.original_title}>{movie.original_title}</p>
              )}
              {movie.tagline && <p className={styles.tagline}>{movie.tagline}</p>}
            </div>

            {/* 评分和基本信息 */}
            <div className={styles.meta}>
              <div className={styles.rating}>
                <span className={styles.rating_icon}>⭐</span>
                <span className={styles.rating_value}>{movie.vote_average.toFixed(1)}</span>
                <span className={styles.rating_count}>({movie.vote_count} votes)</span>
              </div>
            </div>

            {/* 类型标签 */}
            {movie.genres && movie.genres.length > 0 && (
              <div className={styles.genres}>
                {movie.genres.map((genre) => (
                  <span key={genre.id} className={styles.genre_tag}>
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {/* 简介 */}
            {movie.overview && (
              <div className={styles.overview_section}>
                <h2 className={styles.section_title}>{t('movie.overview') || 'Overview'}</h2>
                <p className={styles.overview}>{movie.overview}</p>
              </div>
            )}

            {/* 详细信息 */}
            <div className={styles.details_grid}>
              {movie.release_date && (
                <div className={styles.detail_item}>
                  <span className={styles.detail_label}>{t('movie.releaseDate') || 'Release Date'}</span>
                  <span className={styles.detail_value}>{formatDate(movie.release_date)}</span>
                </div>
              )}

              {movie.runtime && (
                <div className={styles.detail_item}>
                  <span className={styles.detail_label}>{t('movie.runtime') || 'Runtime'}</span>
                  <span className={styles.detail_value}>{formatRuntime(movie.runtime)}</span>
                </div>
              )}

              {movie.status && (
                <div className={styles.detail_item}>
                  <span className={styles.detail_label}>{t('movie.status') || 'Status'}</span>
                  <span className={styles.detail_value}>{movie.status}</span>
                </div>
              )}

              {movie.original_language && (
                <div className={styles.detail_item}>
                  <span className={styles.detail_label}>{t('movie.originalLanguage') || 'Original Language'}</span>
                  <span className={styles.detail_value}>{movie.original_language.toUpperCase()}</span>
                </div>
              )}

              {movie.budget && movie.budget > 0 && (
                <div className={styles.detail_item}>
                  <span className={styles.detail_label}>{t('movie.budget') || 'Budget'}</span>
                  <span className={styles.detail_value}>{formatCurrency(movie.budget)}</span>
                </div>
              )}

              {movie.revenue && movie.revenue > 0 && (
                <div className={styles.detail_item}>
                  <span className={styles.detail_label}>{t('movie.revenue') || 'Revenue'}</span>
                  <span className={styles.detail_value}>{formatCurrency(movie.revenue)}</span>
                </div>
              )}
            </div>

            {/* 制作信息 - 并行展示 */}
            {((movie.production_companies && movie.production_companies.length > 0) ||
              (movie.production_countries && movie.production_countries.length > 0) ||
              (movie.spoken_languages && movie.spoken_languages.length > 0)) && (
              <div className={styles.production_info_grid}>
                {/* 制作公司 */}
                {movie.production_companies && movie.production_companies.length > 0 && (
                  <div className={styles.production_section}>
                    <h2 className={styles.section_title}>
                      {t('movie.productionCompanies') || 'Production Companies'}
                    </h2>
                    <div className={styles.production_companies}>
                      {movie.production_companies.map((company) => (
                        <div key={company.id} className={styles.company_item}>
                          {company.logo_path ? (
                            <img
                              src={getPosterUrl(company.logo_path, 'w92')}
                              alt={company.name}
                              className={styles.company_logo}
                            />
                          ) : (
                            <span className={styles.company_name}>{company.name}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 制作国家 */}
                {movie.production_countries && movie.production_countries.length > 0 && (
                  <div className={styles.production_section}>
                    <h2 className={styles.section_title}>
                      {t('movie.productionCountries') || 'Production Countries'}
                    </h2>
                    <div className={styles.countries}>
                      {movie.production_countries.map((country, index, array) => (
                        <span key={country.iso_3166_1} className={styles.country_tag}>
                          {country.name}
                          {index < array.length - 1 && ', '}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 语言 */}
                {movie.spoken_languages && movie.spoken_languages.length > 0 && (
                  <div className={styles.production_section}>
                    <h2 className={styles.section_title}>
                      {t('movie.spokenLanguages') || 'Spoken Languages'}
                    </h2>
                    <div className={styles.languages}>
                      {movie.spoken_languages.map((lang, index, array) => (
                        <span key={lang.iso_639_1} className={styles.language_tag}>
                          {lang.english_name}
                          {index < array.length - 1 && ', '}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 外部链接 */}
            <div className={styles.external_links}>
              {movie.homepage && (
                <a
                  href={movie.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.external_link}
                >
                  {t('movie.homepage') || 'Homepage'}
                </a>
              )}
              {movie.imdb_id && (
                <a
                  href={`https://www.imdb.com/title/${movie.imdb_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.external_link}
                >
                  IMDb
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieInfoPage;
