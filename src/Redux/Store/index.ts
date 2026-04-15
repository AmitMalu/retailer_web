import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { settingsReducer } from "../Reducers/settingsReducer";
import { uiReducer } from "../Reducers/uiReducer";
import apiReducer from "../Reducers/apiReducer";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import navigationReducer from "../Reducers/navigationReducer";
import paginationSlice from "../Reducers/paginationSlice";
import locationReducer from "../Reducers/locationSlice";
import reportStateSlice from "../Reducers/reportStateSlice";
import chatSlice from "../Reducers/chatSlice";
import notificationReducer from "../Reducers/notificationSlice";

const appReducer = combineReducers({
  ui: uiReducer,
  settings: settingsReducer,
  apiResponse: apiReducer,
  navigation: navigationReducer,
  pagination: paginationSlice,
  location: locationReducer,
  reportState: reportStateSlice,
  chat: chatSlice,
  notifications: notificationReducer,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === "RESET_APP") {
    state = undefined; // resets everything safely
  }
  return appReducer(state, action);
};

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { persistor, store };
