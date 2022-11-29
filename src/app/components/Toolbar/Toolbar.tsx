import { classlist } from 'easy-class';
import React, { MutableRefObject, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UnityWebLink } from 'unity-web-link';
import { useEventListener, useEventManager } from '../../hooks/useEventManager';
import { applicationLoader } from '../../state/slices/General.slice';
import { setScene } from '../../state/slices/Scenes.slice';
import { useTypedDispatch, useTypedSelector } from '../../state/state';
import { fileToUrl, uploadFile } from '../../util/upload-file.util';
import ClickableBox from '../ClickableBox/ClickableBox';
import Icon from '../Icon/Icon';
import styles from './Toolbar.module.scss';

export interface IToolbar {
	unity?: MutableRefObject<UnityWebLink | undefined>;
	unityReady?: boolean;
}

const Toolbar = ({ unity, unityReady }: IToolbar) => {
	const zoomButtonDelta = .05;
	const dispatch = useTypedDispatch();
	const { t } = useTranslation();

	const isLoading = useTypedSelector(state => state.general.loading);
	const initialised = useTypedSelector(state => state.general.initialised);
	const scene = useTypedSelector((state) => state.scenes.current);
	
	const resetEvent = useEventManager('scene-reset');

	const [ zoom, setZoom ] = useState(scene?.camera_zoom || .8);

	const sendUnityAction = (action: string, data: unknown) => {
		if (!unity?.current || !unityReady) return;
		unity.current.Send(action, data);
	};

	useEffect(() => {
		sendUnityAction('setZoom', 2 - (2 * zoom));
	}, [zoom, unityReady]);

	const checkZoom = useCallback(() => {
		const cameraZoom = scene?.camera_zoom;
		if (cameraZoom) setZoom(cameraZoom);
	}, [scene]);

	useEffect(() => {
		checkZoom();
	}, [scene]);

	useEventListener('scene-reset', () => {
		checkZoom();
	}, [scene, checkZoom]);
	
	useEventListener('save-scene', () => {
		if (scene?.id) {
			dispatch(setScene({
				camera_zoom: zoom,
				id: scene?.id,
			}));
		}
	}, [zoom, scene]);

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
				<span
					className={styles.ToolbarItem}
					data-tooltip={t('_tooltipUpload')}>
					<ClickableBox
						onClick={uploadScreenshot}>
						<Icon name='screenshot' />
					</ClickableBox>
				</span>

				<span
					className={styles.ToolbarItem}
					data-tooltip={t('_tooltipReload')}>
					<ClickableBox
						onClick={() => resetEvent.send()}>
						<Icon name='replay' />
					</ClickableBox>
				</span>

				<ClickableBox
					onClick={(e) => buttonZoom(-1, e)}
					tooltip={t('_tooltipZoomOut')}>
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
					onClick={(e) => buttonZoom(1, e)}
					tooltip={t('_tooltipZoomIn')}>
					<Icon name='zoom_in' />
				</ClickableBox>
			</div>

			<div className={styles.Toolbar}>
				<span
					className={styles.ToolbarItem}
					data-tooltip={t('_tooltipCapture')}>
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
