import { Action, AnyAction, combineReducers, configureStore, PayloadAction, ThunkAction, ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch, TypedUseSelectorHook, useSelector } from 'react-redux';
import generalReducer from './slices/General.slice';
import scenesReducer from './slices/Scenes.slice';

const appReducer = combineReducers({
	general: generalReducer,
	scenes: scenesReducer
});
  
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rootReducer = (state: any, action: PayloadAction<any>) => {
	return appReducer(state, action);
};

export const store = configureStore({
	reducer: rootReducer
});
  
export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch;
export type TypedDispatch = ThunkDispatch<RootState, void, Action>;
export type AppThunk<RT = void> = ThunkAction<Promise<RT>, RootState, unknown, AnyAction>;

export const useTypedDispatch = () => useDispatch<TypedDispatch>();
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;