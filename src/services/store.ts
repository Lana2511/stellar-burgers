import { combineReducers, configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { ingredientReducer } from './slices/IngredientsSlice';
import { constructorReducer } from './slices/ConstructorSlice';
import { authReducer } from './slices/UserSlice';
import { orderReducer } from './slices/OrderSlice';
import { feedReducer } from './slices/FeedSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientReducer,
  auth: authReducer,
  burgerConstructor: constructorReducer,
  order: orderReducer,
  feed: feedReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
