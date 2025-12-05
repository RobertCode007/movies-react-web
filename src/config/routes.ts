import { ComponentType } from 'react';
import NowPlayingPage from '../pages/NowPlayingPage';
import TopRatedPage from '../pages/TopRatedPage';
import SearchResultPage from '../pages/SearchResultPage';
import MovieInfoPage from "../pages/MovieInfoPage";

export type RouteName = string;

export type NavRouteName = string;

// 路由配置接口
export interface RouteConfig {
  name: RouteName;
  path: string;
  component: ComponentType;
  // 是否在导航栏显示
  showInNav?: boolean;
}

// 路由配置映射
export const routes: Record<RouteName, RouteConfig> = {
  nowPlaying: {
    name: 'nowPlaying',
    path: '/',
    component: NowPlayingPage,
    showInNav: true,
  },
  topRated: {
    name: 'topRated',
    path: '/topRated',
    component: TopRatedPage,
    showInNav: true,
  },
  search: {
    name: 'search',
    path: '/search',
    component: SearchResultPage,
    showInNav: false,
  },
  movie: {
    name: 'movie',
    path: '/movie/:id',
    component: MovieInfoPage,
    showInNav: false,
  },
};

// 根据路径获取路由配置（支持动态路由参数）
export const getRouteByPath = (pathname: string): RouteConfig | null => {
  // 先尝试精确匹配
  const exactMatch = Object.values(routes).find((r) => r.path === pathname);
  if (exactMatch) return exactMatch;
  
  // 尝试匹配动态路由（如 /movie/:id）
  const dynamicRoute = Object.values(routes).find((r) => {
    if (r.path.includes(':')) {
      const pattern = r.path.replace(/:[^/]+/g, '[^/]+');
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(pathname);
    }
    return false;
  });
  
  return dynamicRoute || null;
};

// 根据路由名称获取路由配置
export const getRouteByName = (name: RouteName): RouteConfig | null => {
  return routes[name] || null;
};

// 获取所有导航栏路由
export const getNavRoutes = (): RouteConfig[] => {
  return Object.values(routes).filter((route) => route.showInNav);
};

// 路由路径常量（用于类型安全的导航）
export const ROUTE_PATHS = {
  NOW_PLAYING: '/',
  TOP_RATED: '/topRated',
  SEARCH: '/search',
} as const;

// 路由名称常量
export const ROUTE_NAMES = {
  NOW_PLAYING: 'nowPlaying',
  TOP_RATED: 'topRated',
  SEARCH: 'search',
  MOVIE: 'movie',
} as const;

// 生成电影详情页路径的辅助函数
export const getMoviePath = (movieId: number | string): string => {
  const movieRoute = routes[ROUTE_NAMES.MOVIE];
  return movieRoute.path.replace(':id', String(movieId));
};

