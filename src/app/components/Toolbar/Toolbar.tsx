import React, { MutableRefObject, useEffect, useState } from 'react';
import { UnityWebLink } from 'unity-web-link';
import ClickableBox from '../ClickableBox/ClickableBox';
import Icon from '../Icon/Icon';
import styles from './Toolbar.module.scss';

export interface IToolbar {
	unity?: MutableRefObject<UnityWebLink | undefined>;
}

// eslint-disable-next-line no-empty-pattern
const Toolbar = ({ unity }: IToolbar) => {
	const [ zoom, setZoom ] = useState(.5);

	useEffect(() => {
		if (!unity?.current) return;
		unity.current.Send('setZoom', 2 - (2 * zoom));
	}, [zoom]);

	return (
		<div className={styles.Toolbar_Wrapper}>
			<div className={styles.Toolbar}>
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
						onClick={() => { console.log(); }}>
						<Icon name='photo_camera' />
					</ClickableBox>
				</span>
			</div>
		</div>
	);
};

export default Toolbar;
