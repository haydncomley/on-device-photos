import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IScene } from '../../definitions/interfaces/IScene';
// import { RootState, TypedDispatch } from '../state';

interface IScenesState {
	current: IScene | null | undefined;
	saved: IScene[];
}

const initialState: IScenesState = {
	current: null,
	saved: []
};

export const scenesSlice = createSlice({
	initialState,
	name: 'scenes',
	reducers: {
		setCurrentScene: (state, action: PayloadAction<IScene | null | undefined>) => {
			state.current = action.payload;
		},
		setScene: (state, action: PayloadAction<Partial<IScene>>) => {
			const all = [...state.saved];
			const existing = all.findIndex((x) => x.id === action.payload.id);

			const scene = {
				...( existing !== -1 ? all[existing] : {}),
				...action.payload
			} as IScene;

			if (existing !== -1) {
				all[existing] = scene;
			} else {
				all.push(scene);
			}

			state.saved = [...all];
		},
		setState: (state, action: PayloadAction<IScenesState>) => {
			state = action.payload;
		},
	}
});

export const { 
	setState,
	setCurrentScene,
	setScene
} = scenesSlice.actions;

// Async Thunk
// export const loadOrganisation = (someParam: string) => async (dispatch: TypedDispatch, getState: () => RootState) => {
// 	const state = getState();
// 	dispatch(setState({} as any));
// };

// Instant Get
// export const selectState = (state: RootState) => state;

export default scenesSlice.reducer;