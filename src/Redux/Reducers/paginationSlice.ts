// src/Redux/Reducers/paginationSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PaginationInfo {
  totalPages: number;
  totalElements: number;
  pageSize: number;
  currentPage: number;
}

interface PaginationState {
  [key: string]: PaginationInfo;
}

const initialState: PaginationState = {};

const paginationSlice = createSlice({
  name: "pagination",
  initialState,
  reducers: {
    savePagination: (
      state,
      action: PayloadAction<{ key: string; pagination: PaginationInfo }>
    ) => {
      const { key, pagination } = action.payload;
      state[key] = pagination;
    },

    clearPagination: (state, action: PayloadAction<{ key?: string }>) => {
      const { key } = action.payload;
      console.log(key,"key");
      
      if (key) {
        delete state[key];
      } else {
        Object.keys(state).forEach((k) => delete state[k]);
      }
    },
  },
});

export const { savePagination, clearPagination } = paginationSlice.actions;
export default paginationSlice.reducer;
