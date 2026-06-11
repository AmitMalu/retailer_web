import {
  CLEAR_API_RESPONSE,
  SAVE_API_RESPONSE,
  SaveApiResponseAction,
} from "@/Common/interface";
import { encryptData } from "@/Utils/helper";

export const saveApiResponse = (
  key: string,
  data: string | object | boolean
): SaveApiResponseAction => {
  const encryptedData = encryptData(data);
  return {
    type: SAVE_API_RESPONSE,
    payload: {
      key,
      data: encryptedData,
    },
  };
};

export const clearApiResponse = (key: string) => {
  return {
    type: CLEAR_API_RESPONSE,
    payload: key,
  };
};
