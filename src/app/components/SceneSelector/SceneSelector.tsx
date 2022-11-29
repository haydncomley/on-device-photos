import { classlist } from 'easy-class';
import React, { MutableRefObject, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { UnityWebLink } from 'unity-web-link';
import { IScene } from '../../definitions/interfaces/IScene';
import { useEventListener, useEventManager } from '../../hooks/useEventManager';
import { setCurrentScene, setScene } from '../../state/slices/Scenes.slice';
import { useTypedDispatch, useTypedSelector } from '../../state/state';
import ClickableBox from '../ClickableBox/ClickableBox';
import Icon from '../Icon/Icon';
import styles from './SceneSelector.module.scss';

export interface ISceneSelector {
	unity?: MutableRefObject<UnityWebLink | undefined>;
	unityReady?: boolean;
}

const SceneSelector = ({ unity, unityReady }: ISceneSelector) => {
	const dispatch = useTypedDispatch();
	const { t } = useTranslation();
	const saveSceneEvent = useEventManager('save-scene');
	const initialised = useTypedSelector(state => state.general.initialised);
	const scene = useTypedSelector((state) => state.scenes.current);
	const scenes = useTypedSelector((state) => state.scenes.saved);

	const sendUnityAction = useCallback((action: string, data?: unknown) => {
		if (!unity?.current || !unityReady) return;
		unity.current.Send(action, data);
	}, [unity, unityReady]);

	const reloadCurrentScene = useCallback(() => {
		const cameraRotation = scene?.camera_position;
		const deviceRotation = scene?.device_position;

		if (cameraRotation) sendUnityAction('setCameraRotation', cameraRotation);
		if (deviceRotation) sendUnityAction('setDeviceRotation', deviceRotation);
	}, [scene, sendUnityAction]);

	useEventListener('scene-reset', () => {
		reloadCurrentScene();
	}, [reloadCurrentScene, scene]);

	useEffect(() => {
		if (!unity?.current || !unityReady || !initialised) return;
		reloadCurrentScene();
	}, [initialised, unityReady, scene]);

	useEffect(() => {
		if (!unityReady || !unity?.current) return;
		const rotationSub = unity.current.Listen<string>('cameraRotation').subscribe((e) => {
			dispatch(setScene({
				camera_position: e.data,
				id: scene?.id,
			}));
		});

		const deviceSub = unity.current.Listen<string>('deviceRotation').subscribe((e) => {
			dispatch(setScene({
				device_position: e.data,
				id: scene?.id,
			}));
		});

		return () => {
			rotationSub.unsubscribe();
			deviceSub.unsubscribe();
		};
	}, [unityReady, scene]);


	const saveScene = () => {
		if (scene?.id) {
			if(!confirm(t('_sceneOverwrite'))) {
				return;
			}
		}

		const sceneDetails: IScene = scene || {
			id: String(Math.random()).slice(2),
			name: 'Untitled Scene',
		};

		if (!scene?.id) {
			sceneDetails.name = (prompt('Scene Name') || '').trim();
		}

		if (!sceneDetails.name) return;

		dispatch(setScene(sceneDetails));
		dispatch(setCurrentScene(sceneDetails));
		
		setTimeout(() => {
			saveSceneEvent.send();
			sendUnityAction('getCameraRotation');
			sendUnityAction('getDeviceRotation');
		}, 20);
	};

	return (
		<div className={classlist(
			styles.SceneSelector,
			!initialised && styles.SceneSelector_hide
		)}>
			<span className={styles.SceneSelector_Dropdown}>
				<p>{ scene?.name ||  t('_sceneNoneSelected') }</p>
				<Icon name='expand_more' />
				<select
					onChange={(e) => dispatch(setCurrentScene(scenes.find((x) => x.id === e.target.value)))}
					value={scene?.id}>
					<option value="">{ t('_sceneNoneSelected') }</option>
					{ scenes.map((x) => (
						<option
							key={x.id}
							value={x.id}>
							{x.name}
						</option>
					))}
				</select>
			</span>

			<ClickableBox
				accent
				onClick={saveScene}
				tooltip='Save Scene'
				tooltipPosition="bottom">
				<Icon name={scene ? 'save' : 'add'} />
			</ClickableBox>
		</div>
	);
};

export default SceneSelector;
