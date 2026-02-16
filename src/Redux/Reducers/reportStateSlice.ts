import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ReportStateType = {
  [key: string]: {
    formValues: any;
    submittedFilter: any;
  };
};

const initialState: ReportStateType = {};

const reportStateSlice = createSlice({
  name: "reportState",
  initialState,
  reducers: {
    saveReportState: (
      state,
      action: PayloadAction<{
        key: string;
        data: { formValues: any; submittedFilter: any };
      }>,
    ) => {
      state[action.payload.key] = action.payload.data;
    },

    clearReportState: (state, action: PayloadAction<{ key: string }>) => {
      delete state[action.payload.key];
    },
  },
});

export const { saveReportState, clearReportState } = reportStateSlice.actions;

export default reportStateSlice.reducer;
