// 电影数据类型定义
export interface Movie {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string; // 可能是空字符串
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

// 电影列表响应数据
export interface MovieListResponse {
  dates?: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

// 电影集合信息
export interface MovieCollection {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
}

// 电影详情（完整版）
export interface MovieDetails {
  adult: boolean;
  backdrop_path: string | null;
  belongs_to_collection: MovieCollection | null;
  budget: number;
  genres: Array<{
    id: number;
    name: string;
  }>;
  homepage: string | null;
  id: number;
  imdb_id: string | null;
  origin_country: string[];
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  production_companies: Array<{
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }>;
  production_countries: Array<{
    iso_3166_1: string;
    name: string;
  }>;
  release_date: string;
  revenue: number;
  runtime: number | null;
  spoken_languages: Array<{
    english_name: string;
    iso_639_1: string;
    name: string;
  }>;
  status: string;
  tagline: string | null;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

