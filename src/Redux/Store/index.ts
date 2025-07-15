import { combineReducers, configureStore } from "@reduxjs/toolkit";
import uiReducer from "../../store/slices/uiSlice";
import productReducer from "../../store/slices/productSlice";
import settingsReducer from "../../store/slices/settingsSlice";
import apiReducer from "../Reducers/apiReducer";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import navigationReducer from "../Reducers/navigationReducer";

const rootReducer = combineReducers({
  ui: uiReducer,
  products: productReducer,
  settings: settingsReducer,
  apiResponse: apiReducer,
  navigation: navigationReducer,
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  devTools: true,
});

const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { persistor, store };
