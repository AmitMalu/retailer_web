import { savePagination } from "@/Redux/Reducers/paginationSlice";
import { AppDispatch, RootState } from "@/Redux/Store";
import { fetchList } from "@/Services/api";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

type FilterType = Record<string, any> | null;

type PaginationType = {
  totalPages: number;
  totalElements: number;
  pageSize: number;
  currentPage: number;
};

interface UseListProps<T> {
  key: string;
  url?: string;
  transformDataFn?: (item: any) => T;
  filter?: FilterType;
  refreshKey?: number;
  method?: "GET" | "POST";
  defaultPageSize?: number;
  payload?: any;
  expectArray?: boolean;
  skipPagination?: boolean;
  returnFullData?: boolean;
  sendPaginationIn?: "params" | "body";
}

// Overload for array data
export function useFetchList<T>(
  props: UseListProps<T> & { expectArray?: true }
): {
  data: T[];
  loading: boolean;
  error: string | null;
  pagination: PaginationType;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
};

// Overload for single object data
export function useFetchList<T>(
  props: UseListProps<T> & { expectArray: false }
): {
  data: T | null;
  loading: boolean;
  error: string | null;
  pagination: PaginationType;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
};

export function useFetchList<T>({
  key,
  url,
  transformDataFn,
  filter = null,
  refreshKey,
  method = "GET",
  defaultPageSize,
  payload = null,
  expectArray = true,
  skipPagination = false,
  returnFullData = false,
  sendPaginationIn = "params",
}: UseListProps<T>) {
  const dispatch = useDispatch<AppDispatch>();

  const pagination = useSelector(
    (state: RootState) => state.pagination[key]
  ) ?? {
    pageSize: defaultPageSize || 10,
    currentPage: 1,
    totalPages: 0,
    totalElements: 0,
  };

  const currentPage = pagination.currentPage;

  const [data, setData] = useState<T[] | T | null>(expectArray ? [] : null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setPage = (page: number) => {
    if (page !== currentPage) {
      dispatch(
        savePagination({
          key: key,
          pagination: {
            ...pagination,
            currentPage: page,
          },
        })
      );
    }
  };

  const setPageSize = (size: number) => {
    dispatch(
      savePagination({
        key: key,
        pagination: { ...pagination, currentPage: 1, pageSize: size },
      })
    );
  };

  const fetchData = useCallback(async () => {
    if (!url) {
      //Skip fetch if URL is empty (e.g., on initial load)
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await dispatch(
        fetchList({
          key,
          url,
          page: pagination.currentPage,
          size: pagination.pageSize,
          filter,
          method,
          payload,
          skipPagination,
          returnFullData,
          sendPaginationIn,
        })
      ).unwrap();

      const transformed = transformDataFn
        ? Array.isArray(response)
          ? response.map(transformDataFn)
          : transformDataFn(response)
        : response;

      setData(transformed);
    } catch (err: any) {
      setData(expectArray ? [] : null);
      setError(err);
      toast.error(err);
    } finally {
      setLoading(false);
    }
  }, [
    key,
    url,
    pagination.currentPage,
    pagination.pageSize,
    JSON.stringify(filter),
    refreshKey,
    payload,
    sendPaginationIn,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    pagination,
    setPage,
    setPageSize,
  };
}
