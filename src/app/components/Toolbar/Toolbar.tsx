import { classlist } from 'easy-class';
import React, { MutableRefObject, useEffect, useState } from 'react';
import { UnityWebLink } from 'unity-web-link';
import { applicationLoader } from '../../state/slices/General.slice';
import { useTypedDispatch, useTypedSelector } from '../../state/state';
import { fileToUrl, uploadFile } from '../../util/upload-file.util';
import ClickableBox from '../ClickableBox/ClickableBox';
import Icon from '../Icon/Icon';
import styles from './Toolbar.module.scss';

export interface IToolbar {
	unity?: MutableRefObject<UnityWebLink | undefined>;
	unityReady?: boolean;
}

// eslint-disable-next-line no-empty-pattern
const Toolbar = ({ unity, unityReady }: IToolbar) => {
	const isLoading = useTypedSelector(state => state.general.loading);
	const initialised = useTypedSelector(state => state.general.initialised);
	const zoomButtonDelta = .05;

	const dispatch = useTypedDispatch();

	const [ zoom, setZoom ] = useState(.8);

	const sendUnityAction = (action: string, data: unknown) => {
		if (!unity?.current || !unityReady) return;
		unity.current.Send(action, data);
	};

	useEffect(() => {
		sendUnityAction('setZoom', 2 - (2 * zoom));
	}, [zoom, unityReady]);

	const uploadScreenshot = async () => {
		const screenshot = await uploadFile({
			multiple: false,
			type: 'image/*'
		});
		if (screenshot.length != 1) return;
		dispatch(applicationLoader(true));
		const screenshotUrl = await fileToUrl(screenshot[0]);
		sendUnityAction('setImage', screenshotUrl);
		dispatch(applicationLoader(false));
	};

	const buttonZoom = (dir: number, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		const zoomDelta = zoomButtonDelta * dir * ((e.ctrlKey || e.metaKey) ? .25 : 1);
		setZoom((prev) => Math.max(0.05, Math.min(1, prev + zoomDelta)));
	};


	return (
		<div className={classlist(
			styles.Toolbar_Wrapper,
			!initialised && styles.Toolbar_WrapperHidden,
			isLoading && styles.Toolbar_WrapperLoading,
		)}>
			<div className={styles.Toolbar}>
				<span className={styles.ToolbarItem}>
					<ClickableBox
						onClick={uploadScreenshot}>
						<Icon name='screenshot' />
					</ClickableBox>
				</span>

				<ClickableBox
					onClick={(e) => buttonZoom(-1, e)}>
					<Icon name='zoom_out' />
				</ClickableBox>

				<span className={styles.ToolbarSlider}>
					<div>
						<span style={{
							width: `calc(${100 * zoom}% - ${1 * zoom}rem)`
						}} />
						<input
							max="1"
							min="0.05"
							onChange={(e) => setZoom(parseFloat(e.target.value))}
							step={.01}
							type="range"
							value={zoom} />
					</div>
				</span>

				<ClickableBox
					onClick={(e) => buttonZoom(1, e)}>
					<Icon name='zoom_in' />
				</ClickableBox>
			</div>

			<div className={styles.Toolbar}>
				<span className={styles.ToolbarItem}>
					<ClickableBox
						accent
						onClick={() => {
							dispatch(applicationLoader(true));
							requestAnimationFrame(() => sendUnityAction('getScreenshot', 4));
							setTimeout(() => {
								dispatch(applicationLoader(false));
							}, 2000);
						}}>
						<Icon name='photo_camera' />
					</ClickableBox>
				</span>
			</div>
		</div>
	);
};

export default Toolbar;
