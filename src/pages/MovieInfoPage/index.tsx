import React, { useEffect, useCallback, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../hooks/useLanguage';
import { useRequest } from '../../hooks/useRequest';
import { useMessage } from '../../hooks/useMessage';
import { getMovieDetails, getMovieReviews, getMovieCredits } from '../../api/api';
import { MovieDetails, Review, Cast } from '../../types/movie';
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

// 格式化评论日期
const formatReviewDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// 获取头像 URL
const getAvatarUrl = (avatarPath: string | null): string => {
  if (!avatarPath) return '/placeholder-avatar.png';
  // avatar_path 可能以 / 开头，如果包含 http，说明是完整的 URL
  if (avatarPath.startsWith('/https://') || avatarPath.startsWith('/http://')) {
    return avatarPath.substring(1); // 移除开头的 /
  }
  // 如果是相对路径，使用 TMDB 图片服务
  if (avatarPath.startsWith('/')) {
    return `https://image.tmdb.org/t/p/w45${avatarPath}`;
  }
  return avatarPath;
};

// 评论项组件
const ReviewItem: React.FC<{ review: Review }> = ({ review }) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const contentLength = review.content.length;
  const shouldTruncate = contentLength > 500;
  const displayContent = shouldTruncate && !expanded 
    ? review.content.substring(0, 500) + '...' 
    : review.content;

  return (
    <div className={styles.review_item}>
      <div className={styles.review_header}>
        <div className={styles.review_author}>
          {review.author_details.avatar_path && (
            <img
              src={getAvatarUrl(review.author_details.avatar_path)}
              alt={review.author}
              className={styles.review_avatar}
            />
          )}
          <div className={styles.review_author_info}>
            <span className={styles.review_author_name}>{review.author}</span>
            {review.author_details.rating && (
              <span className={styles.review_rating}>
                ⭐ {review.author_details.rating}/10
              </span>
            )}
          </div>
        </div>
        <span className={styles.review_date}>{formatReviewDate(review.created_at)}</span>
      </div>
      <div className={styles.review_content}>
        <p dangerouslySetInnerHTML={{ __html: displayContent.replace(/\r\n/g, '<br />').replace(/\n/g, '<br />') }} />
        {shouldTruncate && (
          <button
            className={styles.review_toggle}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? t('movie.readLess') : t('movie.readMore')}
          </button>
        )}
      </div>
    </div>
  );
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

  // 请求评论函数
  const reviewsRequestFn = useCallback(
    (movieId: number) => {
      const language = getApiLanguage(currentLanguage);
      return getMovieReviews(movieId, { language });
    },
    [currentLanguage]
  );

  // 使用 useRequest 处理评论请求
  const { data: reviewsData, loading: reviewsLoading, run: runReviews } = useRequest(
    reviewsRequestFn,
    {
      manual: true,
      onError: (error) => {
        console.error('Failed to load reviews:', error);
        // 评论加载失败不显示错误消息，因为这不是关键功能
      },
    }
  );

  // 请求演员阵容函数
  const creditsRequestFn = useCallback(
    (movieId: number) => {
      const language = getApiLanguage(currentLanguage);
      return getMovieCredits(movieId, { language });
    },
    [currentLanguage]
  );

  // 使用 useRequest 处理演员阵容请求
  const { data: creditsData, loading: creditsLoading, run: runCredits } = useRequest(
    creditsRequestFn,
    {
      manual: true,
      onError: (error) => {
        console.error('Failed to load credits:', error);
        // 演员阵容加载失败不显示错误消息，因为这不是关键功能
      },
    }
  );

  // 当 ID 或语言变化时加载数据
  useEffect(() => {
    if (id) {
      const movieId = parseInt(id, 10);
      if (!isNaN(movieId)) {
        run(movieId);
        runReviews(movieId);
        runCredits(movieId);
      }
    }
  }, [id, currentLanguage, run, runReviews, runCredits]);

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

            {/* 演员阵容 */}
            <div className={styles.cast_section}>
              <h2 className={styles.section_title}>{t('movie.cast') || 'Cast'}</h2>
              {creditsLoading ? (
                <div className={styles.cast_loading}>{t('common.loading') || 'Loading...'}</div>
              ) : creditsData && creditsData.cast && creditsData.cast.length > 0 ? (
                <div className={styles.cast_list}>
                  {creditsData.cast.slice(0, 12).map((actor) => (
                    <div key={actor.cast_id} className={styles.cast_item}>
                      <div className={styles.cast_image_wrapper}>
                        <LazyImage
                          src={getPosterUrl(actor.profile_path, 'w185')}
                          alt={actor.name}
                          className={styles.cast_image}
                          aspectRatio="2/3"
                        />
                        <div className={styles.cast_info}>
                          <p className={styles.cast_name}>{actor.name}</p>
                          <p className={styles.cast_character}>{actor.character}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.no_cast}>{t('movie.noCast') || 'No cast information available'}</div>
              )}
            </div>

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

        {/* 评论列表 */}
        <div className={styles.reviews_section}>
          <h2 className={styles.section_title}>{t('movie.reviews') || 'Reviews'}</h2>
          {reviewsLoading ? (
            <div className={styles.reviews_loading}>{t('common.loading') || 'Loading...'}</div>
          ) : reviewsData && reviewsData.results && reviewsData.results.length > 0 ? (
            <div className={styles.reviews_list}>
              {reviewsData.results.map((review) => (
                <ReviewItem key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <div className={styles.no_reviews}>{t('movie.noReviews') || 'No reviews yet'}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieInfoPage;
