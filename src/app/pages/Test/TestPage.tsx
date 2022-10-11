import React, { BaseSyntheticEvent, useEffect, useRef, useState } from 'react';
import Checkbox from '../../components/Checkbox/Checkbox';
import { useUnityWebLink } from '../../hooks/useUnityWebLink';
import styles from './TestPage.module.scss';

export interface ITestPage {
}

// eslint-disable-next-line no-empty-pattern
const TestPage = ({ }: ITestPage) => {
	const [showFloor, setShowFloor] = useState(true);
	const [showSky, setShowSky] = useState(true);
	const [isUpright, setIsUpright] = useState(true);
	const [showMeta, setShowMeta] = useState(true);
	const [softShadows, setSoftShadows] = useState(true);

	const { unity, unityReady } = useUnityWebLink('test');
	const canvasRef = useRef<HTMLCanvasElement>();

	useEffect(() => {
		if(!unityReady || !unity.current) return;
		console.log('😀 - Unity Ready!', unityReady);
		const cnv = unity.current.getCanvas();
		canvasRef.current = cnv;

		document.querySelector('#canvas_parent')!.appendChild(cnv);
	}, [unityReady]);

	useEffect(() => {
		if (!unity.current) return;
		unity.current.Send('setStage', {
			isPhoneUpright: isUpright,
			showDeviceMeta: showMeta,
			showFloor: showFloor,
			showSky: showSky,
			softShadows: softShadows,
		});
	}, [isUpright, showFloor, showSky, showMeta, softShadows]);
	
	const onFileChange = async (e: BaseSyntheticEvent) => {
		const files = e.target.files as FileList;
		if (files.length === 0 || !unity.current) return;
		const url = await fileToUrl(files[0]);
		unity.current.Send('setImage', url);
	};

	const fileToUrl = (file: File) => {
		return new Promise<string>((res) => {
			const img = document.createElement('img');
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');
			canvas.width = 1024;
			canvas.height = 1024;
	
			img.src = URL.createObjectURL(file);
			img.onload = () => {
				console.log('Image Loaded');
				ctx!.drawImage(img, 0, 0, img.width,  img.height, 0, 0, 1024, 1024);
	
				canvas.toBlob((blob) => {
					const url = URL.createObjectURL(blob!);
					res(url);
				});
			};
		});
	};

	return (
		<div className={styles.TestPage}>
			<div className={styles.TestPage_Sidebar}>
				<Checkbox
					label='Is Upright'
					onChange={setIsUpright}
					value={isUpright} />
				<Checkbox
					label='Show Floor'
					onChange={setShowFloor}
					value={showFloor} />
				<Checkbox
					label='Show Sky'
					onChange={setShowSky}
					value={showSky} />
				<Checkbox
					label='Show Meta / Branding'
					onChange={setShowMeta}
					value={showMeta} />
				<Checkbox
					label='Soft Shadows?'
					onChange={setSoftShadows}
					value={softShadows} />
				<input
					multiple={false}
					onChange={onFileChange}
					type='file' />
				<button onClick={() => {
					unity.current!.Send('getScreenshot', 4);
				}}>Screenshot</button>
			</div>
			<div
				className={styles.TestPage_Canvas}
				id="canvas_parent" />
		</div>
	);
};

export default TestPage;
