import { request } from '../utils/request';
import { MovieListResponse, MovieDetails } from '../types/movie';

// API 请求参数类型
export interface MovieListParams {
  page?: number;
  language?: string;
  region?: string;
}

export interface SearchMoviesParams extends MovieListParams {
  query: string;
  include_adult?: boolean;
  year?: number;
  primary_release_year?: number;
  page?: number;
}

// 获取正在热映的电影
export const getNowPlayingMovies = (params?: MovieListParams) => {
  return request.get<MovieListResponse>('/movie/now_playing', { params });
};

// 获取最高评分的电影
export const getTopRatedMovies = (params?: MovieListParams) => {
  return request.get<MovieListResponse>('/movie/top_rated', { params });
};

// 搜索电影
export const searchMovies = (params: SearchMoviesParams) => {
  return request.get<MovieListResponse>('/search/movie', { params });
};

// 获取电影详情
export const getMovieDetails = (id: number, params?: { language?: string }) => {
  return request.get<MovieDetails>(`/movie/${id}`, { params });
};

