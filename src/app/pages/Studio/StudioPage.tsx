import { classlist } from 'easy-class';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '../../components/Icon/Icon';
import MenuRow, { MenuRowStyle } from '../../components/MenuRow/MenuRow';
import MenuRowAction from '../../components/MenuRowAction/MenuRowAction';
import Toolbar from '../../components/Toolbar/Toolbar';
import { StudioSections } from '../../data/studio/StudioSections.data';
import { IStudioSection, IStudioSectionOption } from '../../definitions/interfaces/IStudioSection';
import { useUnityWebLink } from '../../hooks/useUnityWebLink';
import { applicationLoader } from '../../state/slices/General.slice';
import { useTypedDispatch, useTypedSelector } from '../../state/state';
import styles from './StudioPage.module.scss';

interface SectionData {
	tag: string;
	items: { [key: string]: unknown };
}

export interface IStudioPage {
}

// eslint-disable-next-line no-empty-pattern
const StudioPage = ({ }: IStudioPage) => {
	const sections = StudioSections;

	const dispatch = useTypedDispatch();
	const { t } = useTranslation();
	const { unity, unityReady } = useUnityWebLink('unity');

	const canvasRef = useRef<HTMLCanvasElement>();
	const isLoading = useTypedSelector(state => state.general.loading);
	const [ initialised, setInitialised ] = useState(false);
	const [ sectionData, setSectionData ] = useState<SectionData[]>([]);

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
			setInitialised(true);
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

	const updateSection = (section: MenuRowStyle, key: string, value: unknown) => {
		if (sectionData.length === 0) return;
		const prev = sectionData[sections.findIndex((x) => x.style === section)].items[key];
		if (prev == value) return;
		sectionData[sections.findIndex((x) => x.style === section)].items[key] = value;
	
		if (!unity.current) return;
		const action = `set${section.toString()}`;
		unity.current.Send(action, sectionData[sections.findIndex((x) => x.style === section)].items);
	};

	const renderSectionItem = useCallback((item: IStudioSectionOption, style: MenuRowStyle, index: number) => {
		return <MenuRow
			key={index}
			label={t(item.label)}
			rowStyle={style}>
			<MenuRowAction
				onChange={(e) => updateSection(style, item.key, e)}
				options={item.options}
				type={item.type}
				value={item.default} />
		</MenuRow>;
	}, []);

	const renderSection = useCallback((section: IStudioSection, index: number) => {
		return <span key={index}>
			<MenuRow
				header
				label={t(section.title)}
				rowStyle={section.style} />
			{ section.options.map((item, i) => renderSectionItem(item, section.style, i)) }
		</span>;
	}, []);

	return (
		<div className={styles.StudioPage}>
			<div className={styles.StudioPage_Options}>
				{ sections.map((section, i) => renderSection(section, i))}
			</div>
			<div
				className={classlist(
					styles.StudioPage_Canvas,
					(isLoading && initialised) && styles.StudioPage_Canvas__loading
				)}
				id="studio">
				{ isLoading && <span className={styles.StudioPage_CanvasLoader}>
					<Icon name='cached' />
				</span> } 
				<Toolbar unity={unity} />
			</div>
		</div>
	);
};

export default StudioPage;
