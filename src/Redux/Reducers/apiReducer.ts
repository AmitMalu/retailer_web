import { AnyAction } from "redux";
import { ApiState, SAVE_API_RESPONSE } from "@/Common/interface";

const initialState: ApiState = {
  responses: {},
};
const apiReducer = (state = initialState, action: AnyAction) => {
  if (action.type === SAVE_API_RESPONSE) {
    return {
      ...state,
      responses: {
        ...state.responses,
        [action.payload.key]: action.payload.data,
      },
    };
  }
  return state;
};
export default apiReducer;
