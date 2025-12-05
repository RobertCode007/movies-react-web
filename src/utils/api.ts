import { request } from './request';

// API 接口示例
// 可以根据实际项目需求添加具体的 API 接口

// 示例：获取电影列表
export const getMovies = (params?: any) => {
  return request.get('/movies', { params });
};

// 示例：获取正在热映的电影
export const getNowPlayingMovies = (params?: any) => {
  return request.get('/movie/now_playing', { params });
};

// 示例：获取最高评分的电影
export const getTopRatedMovies = (params?: any) => {
  return request.get('/movie/top_rated', { params });
};

// 示例：搜索电影
export const searchMovies = (query: string, params?: any) => {
  return request.get('/search/movie', { params: { query, ...params } });
};

// 示例：获取电影详情
export const getMovieDetails = (id: number) => {
  return request.get(`/movie/${id}`);
};

