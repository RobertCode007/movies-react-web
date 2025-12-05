import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// API 响应数据结构
export interface ApiResponse<T = any> {
  code?: number;
  data: T;
  message?: string;
  [key: string]: any;
}

// 扩展 AxiosRequestConfig
export interface RequestConfig extends AxiosRequestConfig {
  skipErrorHandler?: boolean; // 是否跳过错误处理
  showLoading?: boolean; // 是否显示加载提示
  showError?: boolean; // 是否显示错误提示
}

// 创建 axios 实例
const instance: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE || '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNDdhMWVlNTBkZWIwMjcwNWY5YmM0NDNkZTZlMTI2YyIsIm5iZiI6MTc2NDg3MDg0My45MzkwMDAxLCJzdWIiOiI2OTMxY2FiYjU0ZjBmNzZiZDg0MWU2YzciLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.mGaZ0r7JVPEOd5egQLzX7TTRe76B2xO5V5-hJ5OwzIs'
  },
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 可以在这里添加 token 等认证信息
    // const token = localStorage.getItem('token');
    // if (token && config.headers) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    // 可以在这里显示加载提示
    // if ((config as RequestConfig).showLoading) {
    //   // 显示加载提示
    // }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse<any>) => {
    const { status } = response;

    // status 为 200 表示访问正常
    if (status === 200) {
      return response;
    }

    // 如果状态码不是 200，抛出错误
    return Promise.reject(new Error(`Request failed with status code ${status}`));
  },
  (error: AxiosError) => {
    // 处理错误响应
    const { response, request, message } = error;

    // 网络错误
    if (!response) {
      if (request) {
        console.error('Network Error: Please check your network connection');
      } else {
        console.error('Request Error:', message);
      }
      return Promise.reject(error);
    }

    // HTTP 状态码错误
    const { status, data } = response;
    let errorMessage = 'Request failed';

    switch (status) {
      case 400:
        errorMessage = 'Bad Request';
        break;
      case 401:
        errorMessage = 'Unauthorized';
        // 可以在这里处理 token 过期，跳转到登录页
        // localStorage.removeItem('token');
        // window.location.href = '/login';
        break;
      case 403:
        errorMessage = 'Forbidden';
        break;
      case 404:
        errorMessage = 'Not Found';
        break;
      case 500:
        errorMessage = 'Internal Server Error';
        break;
      case 502:
        errorMessage = 'Bad Gateway';
        break;
      case 503:
        errorMessage = 'Service Unavailable';
        break;
      default:
        errorMessage = (data as any)?.message || `Request failed with status code ${status}`;
    }

    console.error('Response Error:', errorMessage);

    return Promise.reject(error);
  }
);

// 封装请求方法
export const request = {
  get<T = any>(url: string, config?: RequestConfig): Promise<AxiosResponse<T | ApiResponse<T>>> {
    return instance.get<T | ApiResponse<T>>(url, config);
  },

  post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<AxiosResponse<T | ApiResponse<T>>> {
    return instance.post<T | ApiResponse<T>>(url, data, config);
  },

  put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<AxiosResponse<T | ApiResponse<T>>> {
    return instance.put<T | ApiResponse<T>>(url, data, config);
  },

  patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<AxiosResponse<T | ApiResponse<T>>> {
    return instance.patch<T | ApiResponse<T>>(url, data, config);
  },

  delete<T = any>(url: string, config?: RequestConfig): Promise<AxiosResponse<T | ApiResponse<T>>> {
    return instance.delete<T | ApiResponse<T>>(url, config);
  },
};

export default instance;

