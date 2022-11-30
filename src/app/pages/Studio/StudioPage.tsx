import { classlist } from 'easy-class';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '../../components/Icon/Icon';
import MenuRow, { MenuRowStyle } from '../../components/MenuRow/MenuRow';
import MenuRowAction from '../../components/MenuRowAction/MenuRowAction';
import Toolbar from '../../components/Toolbar/Toolbar';
import { StudioSections } from '../../data/studio/StudioSections.data';
import { IStudioSection, IStudioSectionOption, SectionData } from '../../definitions/interfaces/IStudioSection';
import { useUnityWebLink } from '../../hooks/useUnityWebLink';
import { applicationLoader, setInitialised } from '../../state/slices/General.slice';
import { useTypedDispatch, useTypedSelector } from '../../state/state';
import styles from './StudioPage.module.scss';
import appDetails from '../../../../package.json';
import { Helmet } from 'react-helmet-async';
import { useTrackPage } from '../../hooks/useTrackPage';
import SceneSelector from '../../components/SceneSelector/SceneSelector';
import { useEventListener } from '../../hooks/useEventManager';
import { setScene } from '../../state/slices/Scenes.slice';

export interface IStudioPage {
}

// eslint-disable-next-line no-empty-pattern
const StudioPage = ({ }: IStudioPage) => {
	const sections = StudioSections;
	const version = `${appDetails.version}${process.env.NODE_ENV === 'development' ? ' - DEV' : ''}`;
	useTrackPage();

	const dispatch = useTypedDispatch();
	const { t } = useTranslation();
	const { unity, unityReady } = useUnityWebLink('unity');

	const canvasRef = useRef<HTMLCanvasElement>();
	const isLoading = useTypedSelector(state => state.general.loading);
	const initialised = useTypedSelector(state => state.general.initialised);
	const scene = useTypedSelector((state) => state.scenes.current);
	
	const [ sectionData, setSectionData ] = useState<SectionData[]>([]);
	const [ sideOpen, setSideOpen ] = useState(true);
	const [ leftAmount, setLeftAmount ] = useState(0);

	useEffect(() => {
		const studio = document.querySelector<HTMLDivElement>('#studio');
		const bounds = studio?.getBoundingClientRect();
		if (!studio || !bounds) return;

		if (sideOpen) {
			studio.style.left = `${leftAmount}px`;
			
			setTimeout(() => {
				studio.style.position = '';
				studio.style.top = '';
				studio.style.bottom = '';
				studio.style.left = '';
				studio.style.right = '';
			}, 300);
			return;
		}

		setLeftAmount(bounds.left);

		studio.style.position = 'absolute';
		studio.style.top = '0';
		studio.style.bottom = '0';
		studio.style.left = `${bounds.left}px`;
		studio.style.right = '0';
		
		requestAnimationFrame(() => {
			studio.style.left = '0';
		});
	}, [sideOpen]);

	useEffect(() => {
		if(!unityReady || !unity.current) return;
		const cnv = unity.current.getCanvas();
		const cnvParent = document.querySelector('#studio');
		canvasRef.current = cnv;
		
		if (!cnvParent) return;
		cnvParent.appendChild(cnv);

		if (cnv.style.opacity == '1') return;
		cnv.style.opacity = '0';
		unity.current.SetVisible(true);
		
		setTimeout(() => {
			updateAllSections();
			dispatch(applicationLoader(false));
			dispatch(setInitialised(true));
			cnv.style.opacity = '1';
		}, 2000);
	}, [unityReady]);

	useEffect(() => {
		if (sectionData.length !== 0) return;
		dispatch(applicationLoader(true));
		const data = sectionData;

		sections.forEach((section) => {
			data.push({
				items:  Object.fromEntries(section.options.map((item) => [item.key, item.default])),
				tag: section.style.toString()
			});
		});

		setSectionData(data);
	}, []);

	const updateAllSections = () => {
		sectionData.forEach(section => {
			const action = `set${section.tag}`;
			if (!unity.current) return;
			unity.current.Send(action, section.items);
		});
	};

	const updateSection = useCallback((section: MenuRowStyle, key: string, value: unknown) => {
		if (sectionData.length === 0) return;
		const dataTransformer = sections.find((x) => x.style === section)?.options.find((x) => x.key === key)?.transform;
		const newValue = dataTransformer ? dataTransformer(value) : value;

		const prev = sectionData[sections.findIndex((x) => x.style === section)].items[key];
		if (prev == newValue) return;

		setSectionData((last) => {
			const data = JSON.parse(JSON.stringify(last));
			data[sections.findIndex((x) => x.style === section)].items[key] = newValue;

			if (!unity.current) return data;
			const action = `set${section.toString()}`;
			unity.current.Send(action, data[sections.findIndex((x) => x.style === section)].items);

			return data;
		});

	}, [setSectionData, sectionData, unity]);

	const reloadCurrentScene = useCallback(() => {
		if (scene?.sections) {
			scene.sections.forEach((section) => {
				if (!unity.current) return;
				const action = `set${section.tag}`;
				unity.current.Send(action, section.items);
			});
			setSectionData(scene.sections);
		}
	}, [scene, setSectionData, unity]);

	useEventListener('scene-reset', () => {
		reloadCurrentScene();
	}, [reloadCurrentScene, scene]);

	useEffect(() => {
		if (!unity?.current || !unityReady || !initialised) return;
		reloadCurrentScene();
	}, [initialised, unityReady, scene]);

	useEventListener('save-scene', () => {
		if (scene?.id) {
			dispatch(setScene({
				id: scene?.id,
				sections: sectionData
			}));
		}
	}, [scene, sectionData]);

	const renderSectionItem = useCallback((item: IStudioSectionOption, style: MenuRowStyle, index: number) => {
		const hasValue = sectionData.map((x) => x.items[item.key]).filter((x) => x !== undefined) || [];
		let value = item.default;
		if (hasValue.length === 1) value = hasValue[0];

		return <MenuRow
			key={index}
			label={t(item.label)}
			rowStyle={style}>
			<MenuRowAction
				onChange={(e) => updateSection(style, item.key, e)}
				options={item.options}
				type={item.type}
				value={value} />
		</MenuRow>;
	}, [sectionData]);

	const renderSection = useCallback((section: IStudioSection, index: number) => {
		return <span key={index}>
			<MenuRow
				header
				label={t(section.title)}
				rowStyle={section.style} />
			{ section.options.map((item, i) => renderSectionItem(item, section.style, i)) }
		</span>;
	}, [sectionData]);

	return (
		<div className={styles.StudioPage}>
			<Helmet>
				<title>OnDevice.Photos - { t('_pageStudio') }</title>
			</Helmet>
			<div
				className={classlist(
					styles.StudioPage_Options,
					isLoading && styles.StudioPage_Options__loading,
					!sideOpen && styles.StudioPage_Options__hidden
				)}>
				{ sections.map((section, i) => renderSection(section, i))}
				
				<button
					className={classlist(
						styles.StudioPage_OptionsTag,
						!sideOpen && styles.StudioPage_OptionsTag__hidden
					)}
					data-tooltip={sideOpen ? t('_studioDrawerHide') : t('_studioDrawerOpen')}
					data-tooltip-position={ sideOpen ? 'top' : 'right' }
					onClick={() => setSideOpen(!sideOpen)}>
					<Icon name='chevron_left' />
				</button>

				<a
					className={styles.ShamelessBranding}
					href='https://HaydnComley.com'
					rel="noreferrer"
					target='_blank'>{t('_madeBy')} Haydn Comley</a>
			</div>
			<div
				className={classlist(
					styles.StudioPage_Canvas,
					(isLoading && initialised) && styles.StudioPage_Canvas__loading,
					!sideOpen && styles.StudioPage_Canvas__fullscreen
				)}
				id="studio">
				{ isLoading && <span className={styles.StudioPage_CanvasLoader}>
					<Icon name='cached' />
				</span> }

				<Toolbar
					unity={unity}
					unityReady={unityReady} />
				<SceneSelector
					unity={unity}
					unityReady={unityReady}/>
			</div>

			<span className={styles.StudioPage_Version}>{ version }</span>
		</div>
	);
};

export default StudioPage;
