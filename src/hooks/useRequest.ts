import { useState, useEffect, useCallback } from 'react';
import { AxiosResponse } from 'axios';
import { request, ApiResponse, RequestConfig } from '../utils/request';

interface UseRequestOptions<T> extends RequestConfig {
  manual?: boolean; // 是否手动触发
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
}

interface UseRequestResult<T> {
  data: T | null;
  loading: boolean;
  error: any;
  run: (...args: any[]) => Promise<void>;
  refresh: () => Promise<void>;
}

/**
 * 自定义 Hook：用于处理 API 请求
 * @param requestFn 请求函数
 * @param options 配置选项
 */
export function useRequest<T = any>(
  requestFn: (...args: any[]) => Promise<AxiosResponse<ApiResponse<T>>>,
  options: UseRequestOptions<T> = {}
): UseRequestResult<T> {
  const {
    manual = false,
    onSuccess,
    onError,
    showError = true,
    ...requestConfig
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(!manual);
  const [error, setError] = useState<any>(null);
  const [params, setParams] = useState<any[]>([]);

  const executeRequest = useCallback(
    async (...args: any[]) => {
      setLoading(true);
      setError(null);

      try {
        const response = await requestFn(...args);
        // 提取实际数据：如果 response.data 有 data 属性，使用它；否则使用整个 response.data
        let responseData: T;
        const apiResponse = response.data as ApiResponse<T>;
        
        // 检查是否是 ApiResponse 格式（有 data 属性）
        if (apiResponse && typeof apiResponse === 'object' && 'data' in apiResponse) {
          responseData = apiResponse.data;
        } else {
          // 直接返回的数据
          responseData = response.data as T;
        }
        
        setData(responseData);

        if (onSuccess) {
          onSuccess(responseData);
        }
      } catch (err: any) {
        setError(err);
        
        if (showError && !requestConfig.skipErrorHandler) {
          const errorMessage = err.response?.data?.message || err.message || 'Request failed';
          // 错误提示可以通过 onError 回调处理，或者使用全局消息组件
          console.error('Request Error:', errorMessage);
        }

        if (onError) {
          onError(err);
        }
      } finally {
        setLoading(false);
      }
    },
    [requestFn, onSuccess, onError, showError, requestConfig.skipErrorHandler]
  );

  const run = useCallback(
    (...args: any[]) => {
      setParams(args);
      return executeRequest(...args);
    },
    [executeRequest]
  );

  const refresh = useCallback(() => {
    return executeRequest(...params);
  }, [executeRequest, params]);

  useEffect(() => {
    if (!manual) {
      executeRequest();
    }
  }, [manual, executeRequest]);

  return {
    data,
    loading,
    error,
    run,
    refresh,
  };
}

