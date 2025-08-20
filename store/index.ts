import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import storage from "redux-persist/es/storage"
import { persistReducer, persistStore } from "redux-persist"
import authReducer from "./slices/auth-slice"
import cartReducer from "./slices/cart-slice"
import uiReducer from "./slices/ui-slice"
import { api } from "./services/api"

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  ui: uiReducer,
  [api.reducerPath]: api.reducer,
})

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart", "auth"],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefault) => getDefault({ serializableCheck: false }).concat(api.middleware),
})

setupListeners(store.dispatch)

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
