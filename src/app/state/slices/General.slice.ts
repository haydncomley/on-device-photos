import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TypedDispatch } from '../state';

interface IGeneralState {
	loading: boolean,
	loadingCount: number,
	initialised: boolean
}

const initialState: IGeneralState = {
	initialised: false,
	loading: false,
	loadingCount: 0
};

export const generalSlice = createSlice({
	initialState,
	name: 'general',
	reducers: {
		setInitialised: (state, action: PayloadAction<boolean>) => {
			state.initialised = action.payload;
		},
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.loadingCount =  Math.max(state.loadingCount + (action.payload ? 1 : -1), 0);
			state.loading = state.loadingCount > 0;
		},
		setState: (state, action: PayloadAction<IGeneralState>) => {
			state = action.payload;
		},
	}
});

export const { 
	setState,
	setLoading,
	setInitialised
} = generalSlice.actions;

// Async Thunk
export const applicationLoader = (loading: boolean) => async (dispatch: TypedDispatch) => {
	dispatch(setLoading(loading));
};
// export const loadOrganisation = (someParam: string) => async (dispatch: TypedDispatch, getState: () => RootState) => {
// 	const state = getState();
// 	dispatch(setState({} as any));
// };

// Instant Get
// export const selectState = (state: RootState) => state;

export default generalSlice.reducer;