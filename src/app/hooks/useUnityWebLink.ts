import { useEffect, useRef, useState } from 'react';
import { UnityWebLink } from 'unity-web-link';

export function useUnityWebLink(canvasId: string) {
	const webLink = useRef<UnityWebLink>();
	const [ ready, setReady ] = useState(false);
	const [ error, setError ] = useState(false);

	useEffect(() => {
		if (webLink.current) return;
		webLink.current = new UnityWebLink({
			canvasId: canvasId,
			codeUrl: '/assets/Build/assets.wasm',
			dataUrl: '/assets/Build/assets.data',
			frameworkUrl: '/assets/Build/assets.framework.js',
			loaderUrl: '/assets/Build/assets.loader.js',
			streamingAssetsUrl: '/assets/StreamingAssets'
		});

		webLink.current.onReady().then(() => {
			setReady(true);
			setError(false);
		});

		webLink.current.onError().then(() => {
			setReady(false);
			setError(true);
		});
	},  []);

	return {
		unity: webLink,
		unityError: error,
		unityReady: ready
	};
}
