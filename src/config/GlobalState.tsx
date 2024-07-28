import {
  Provider,
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from "react-redux";
import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { PropsWithChildren } from "react";

export const store = configureStore({
  reducer: {},
});
export function GlobalStateConfig({ children }: PropsWithChildren) {
  return <Provider store={store}>{children}</Provider>;
}

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
