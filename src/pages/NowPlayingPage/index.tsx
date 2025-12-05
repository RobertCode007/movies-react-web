import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { MovieListResponse, Movie } from '../../types/movie';
import MovieCard from '../../components/MovieCard';
import MovieListItem from '../../components/MovieListItem';
import MovieCardSkeleton from '../../components/MovieCardSkeleton';
import MovieListItemSkeleton from '../../components/MovieListItemSkeleton';
import Loading from '../../components/Loading';
import { useRequest } from '../../hooks/useRequest';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { useLanguage } from '../../hooks/useLanguage';
import { useMessage } from '../../hooks/useMessage';
import { getMoviePath } from '../../config/routes';
import styles from './index.module.scss';
import {getNowPlayingMovies} from "../../api/api";

type ViewMode = 'card' | 'list';

// 将语言代码转换为 API 需要的格式
const getApiLanguage = (lang: string): string => {
  if (lang === 'en') return 'en-US';
  if (lang === 'zh-TW') return 'zh-TW';
  return 'en-US'; // 默认值
};

const NowPlayingPage: React.FC = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const navigate = useNavigate();
  const { error: showError } = useMessage();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const saved = localStorage.getItem('playingMovieViewMode') as ViewMode | null;
    return saved || 'card';
  });
  const currentPageRef = React.useRef<number>(1);
  const hasInitializedRef = React.useRef<boolean>(false);

  // 使用 useCallback 稳定回调函数
  const handleSuccess = useCallback((data: MovieListResponse) => {
    const currentPage = currentPageRef.current;

    if (currentPage === 1) {
      // 首次加载
      setMovies(data.results);
      setIsInitialLoad(false);
    } else {
      // 加载更多
      setMovies((prev) => [...prev, ...data.results]);
    }
    setHasMore(currentPage < data.total_pages);
  }, []);

  const handleError = useCallback((error: any) => {
    console.error('Failed to load movies:', error);
    setHasMore(false);
    // 错误时不设置 isInitialLoad 为 false，继续显示骨架屏
    // setIsInitialLoad(false);
    
    // 显示错误消息
    const errorMessage = error.response?.data?.message || error.message || t('common.loadFailed') || 'Failed to load movies';
    showError(errorMessage);
  }, [showError, t]);

  // 稳定的请求函数
  const requestFn = useCallback((pageNum: number) => {
    currentPageRef.current = pageNum;
    const language = getApiLanguage(currentLanguage);
    return getNowPlayingMovies({ page: pageNum, language });
  }, [currentLanguage]);

  // 使用 useRequest 处理请求
  const { loading, run } = useRequest<MovieListResponse>(
    requestFn,
    {
      manual: true,
      onSuccess: handleSuccess,
      onError: handleError,
    }
  );

  // 初始加载和语言变化时重新加载
  useEffect(() => {
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      run(1);
    } else {
      // 语言变化时重新加载第一页
      setMovies([]);
      setPage(1);
      setHasMore(true);
      setIsInitialLoad(true);
      currentPageRef.current = 1;
      run(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLanguage]);

  // 加载更多
  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      run(nextPage);
    }
  }, [page, loading, hasMore, run]);

  // 无限滚动
  const observerTarget = useInfiniteScroll({
    hasMore,
    loading,
    onLoadMore: handleLoadMore,
  });

  const handleMovieClick = (movie: Movie) => {
    navigate(getMoviePath(movie.id));
  };

  const handleViewModeToggle = () => {
    const newMode: ViewMode = viewMode === 'card' ? 'list' : 'card';
    setViewMode(newMode);
    localStorage.setItem('playingMovieViewMode', newMode);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.page_header}>
        <h2 className={styles.page_title}>{t('navigation.nowPlaying')}</h2>
          <button
            className={styles.view_toggle}
            onClick={handleViewModeToggle}
            title={viewMode === 'card' ? '切换到列表视图' : '切换到卡片视图'}
            aria-label={viewMode === 'card' ? '切换到列表视图' : '切换到卡片视图'}
          >
            {viewMode === 'card' ? (
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
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
            ) : (
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
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            )}
          </button>
        </div>

        {(isInitialLoad && (loading || movies.length === 0)) ? (
          <div className={viewMode === 'card' ? styles.movie_grid : styles.movie_list}>
            {Array.from({ length: 10 }).map((_, index) =>
              viewMode === 'card' ? (
              <MovieCardSkeleton key={index} />
              ) : (
                <MovieListItemSkeleton key={index} />
              )
            )}
          </div>
        ) : movies.length > 0 ? (
          <>
            <div className={viewMode === 'card' ? styles.movie_grid : styles.movie_list}>
              {movies.map((movie) =>
                viewMode === 'card' ? (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onClick={handleMovieClick}
                />
                ) : (
                  <MovieListItem
                    key={movie.id}
                    movie={movie}
                    onClick={handleMovieClick}
                  />
                )
              )}
            </div>

            {/* 无限滚动触发器 */}
            <div ref={observerTarget} className={styles.loader_container}>
              {loading && (
                <div className={styles.loading_wrapper}>
                  <Loading size="small" />
                </div>
              )}
              {!hasMore && movies.length > 0 && (
                <div className={styles.no_more}>{t('common.noData')}</div>
              )}
            </div>
          </>
        ) : (
          <div className={styles.empty}>{t('common.noData')}</div>
        )}
      </div>
    </div>
  );
};

export default NowPlayingPage;
