import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Movie } from '../../types/movie';
import { searchMovies, SearchMoviesParams } from '../../api/api';
import { useRequest } from '../../hooks/useRequest';
import { useDebounce } from '../../hooks/useDebounce';
import { useLanguage } from '../../hooks/useLanguage';
import { useMessage } from '../../hooks/useMessage';
import { MovieListResponse } from '../../types/movie';
import { getRouteByName, ROUTE_NAMES, getMoviePath } from '../../config/routes';
import LazyImage from '../LazyImage';
import Loading from '../Loading';
import styles from './index.module.scss';

interface SearchBoxProps {
  isOpen: boolean;
  onClose: () => void;
}

// 将语言代码转换为 API 需要的格式
const getApiLanguage = (lang: string): string => {
  if (lang === 'en') return 'en-US';
  if (lang === 'zh-TW') return 'zh-TW';
  return 'en-US';
};

const SearchBox: React.FC<SearchBoxProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const { error: showError } = useMessage();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const searchBoxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 防抖处理搜索关键词
  const debouncedQuery = useDebounce(searchQuery, 500);

  // 搜索请求函数
  const requestFn = useCallback(
    (query: string) => {
      if (!query.trim()) {
        return Promise.resolve({ data: { page: 1, results: [], total_pages: 0, total_results: 0 } } as any);
      }
      const language = getApiLanguage(currentLanguage);
      const params: SearchMoviesParams = {
        query: query.trim(),
        language,
        page: 1,
      };
      return searchMovies(params);
    },
    [currentLanguage]
  );

  // 处理搜索成功
  const handleSuccess = useCallback((data: MovieListResponse) => {
    setSearchResults(data.results.slice(0, 5)); // 只显示前5个结果
    setShowDropdown(data.results.length > 0);
  }, []);

  // 处理搜索错误
  const handleError = useCallback((error: any) => {
    console.error('Search failed:', error);
    setSearchResults([]);
    setShowDropdown(false);
    // 显示错误消息
    const errorMessage = error.response?.data?.message || error.message || t('search.searchFailed') || 'Search failed';
    showError(errorMessage);
  }, [showError, t]);

  // 使用 useRequest 处理搜索请求
  const { loading, run } = useRequest<MovieListResponse>(requestFn, {
    manual: true,
    onSuccess: handleSuccess,
    onError: handleError,
  });

  // 当防抖后的查询变化时执行搜索
  useEffect(() => {
    if (debouncedQuery.trim()) {
      run(debouncedQuery);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  }, [debouncedQuery, run]);

  // 点击外部关闭下拉框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // 聚焦输入框
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // 处理回车键
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      const searchRoute = getRouteByName(ROUTE_NAMES.SEARCH);
      if (searchRoute) {
        navigate(`${searchRoute.path}?q=${encodeURIComponent(searchQuery.trim())}`);
      }
      setSearchQuery('');
      setShowDropdown(false);
      onClose();
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
      onClose();
    }
  };

  // 处理点击搜索结果项（跳转到电影详情页）
  const handleResultClick = (movie: Movie) => {
    navigate(getMoviePath(movie.id));
    setSearchQuery('');
    setShowDropdown(false);
    onClose();
  };

  // 处理查看全部结果（跳转到搜索结果页）
  const handleViewAllResults = () => {
    const searchRoute = getRouteByName(ROUTE_NAMES.SEARCH);
    if (searchRoute) {
      navigate(`${searchRoute.path}?q=${encodeURIComponent(searchQuery.trim())}`);
    }
    setSearchQuery('');
    setShowDropdown(false);
    onClose();
  };

  // 构建图片 URL
  const imageBaseUrl = 'https://image.tmdb.org/t/p/w200';
  const getPosterUrl = (posterPath: string | null) => {
    return posterPath ? `${imageBaseUrl}${posterPath}` : '/placeholder-movie.png';
  };

  return (
    <div className={`${styles.search_box} ${isOpen ? styles.search_box_open : ''}`} ref={searchBoxRef}>
      <div className={styles.search_input_wrapper}>
        <svg
          className={styles.search_icon}
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <input
          ref={inputRef}
          type="text"
          className={styles.search_input}
          placeholder={t('search.placeholder')}
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          style={{ display: isOpen ? 'block' : 'none' }}
        />
        {loading && isOpen && (
          <div className={styles.loading_wrapper}>
            <Loading size="xs" />
          </div>
        )}
        {isOpen && (
          <button
            className={styles.close_button}
            onClick={onClose}
            aria-label={t('common.close')}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>

      {isOpen && showDropdown && searchResults.length > 0 && (
        <div className={styles.dropdown}>
          {searchResults.map((movie) => (
            <div
              key={movie.id}
              className={styles.dropdown_item}
              onClick={() => handleResultClick(movie)}
            >
              <div className={styles.poster_wrapper}>
                <LazyImage
                  src={getPosterUrl(movie.poster_path)}
                  alt={movie.title}
                  className={styles.poster}
                  aspectRatio="2/3"
                />
              </div>
              <div className={styles.movie_info}>
                <h4 className={styles.movie_title}>{movie.title}</h4>
                {movie.release_date && (
                  <p className={styles.movie_year}>
                    {new Date(movie.release_date).getFullYear()}
                  </p>
                )}
                {movie.overview && (
                  <p className={styles.movie_overview} title={movie.overview}>
                    {movie.overview.length > 60
                      ? `${movie.overview.substring(0, 60)}...`
                      : movie.overview}
                  </p>
                )}
              </div>
            </div>
          ))}
          {searchQuery.trim() && (
            <div
              className={styles.view_all}
              onClick={handleViewAllResults}
            >
              {t('search.viewAllResults')} "{searchQuery}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBox;

