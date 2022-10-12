import React, { MutableRefObject, useEffect, useState } from 'react';
import { UnityWebLink } from 'unity-web-link';
import { applicationLoader } from '../../state/slices/General.slice';
import { useTypedDispatch } from '../../state/state';
import { fileToUrl, uploadFile } from '../../util/upload-file.util';
import ClickableBox from '../ClickableBox/ClickableBox';
import Icon from '../Icon/Icon';
import styles from './Toolbar.module.scss';

export interface IToolbar {
	unity?: MutableRefObject<UnityWebLink | undefined>;
}

// eslint-disable-next-line no-empty-pattern
const Toolbar = ({ unity }: IToolbar) => {
	const dispatch = useTypedDispatch();

	const [ zoom, setZoom ] = useState(.5);

	const sendUnityAction = (action: string, data: unknown) => {
		if (!unity?.current) return;
		unity.current.Send(action, data);
	};

	useEffect(() => {
		sendUnityAction('setZoom', 2 - (2 * zoom));
	}, [zoom]);

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


	return (
		<div className={styles.Toolbar_Wrapper}>
			{/* <div className={styles.Toolbar}>
				<span className={styles.ToolbarItem}>
					<ClickableBox
						accent
						onClick={() => sendUnityAction('getScreenshot', 4)}>
						<Icon name='screenshot' />
					</ClickableBox>
				</span>
			</div> */}

			<div className={styles.Toolbar}>
				<span className={styles.ToolbarItem}>
					<ClickableBox
						onClick={uploadScreenshot}>
						<Icon name='screenshot' />
					</ClickableBox>
				</span>
				{/* <span className={styles.ToolbarItem}>
					<ClickableBox onClick={() => {
						console.log('Click');
					}}>
						<Icon name='360' />
					</ClickableBox>
				</span>

				<span className={styles.ToolbarItem}>
					<ClickableBox
						disabled
						onClick={() => {
							console.log('Click');
						}}>
						<Icon name='control_camera' />
					</ClickableBox>
				</span> */}

				<span className={styles.ToolbarSlider}>
					<Icon name='zoom_out' />
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
					<Icon name='zoom_in' />
				</span>
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
