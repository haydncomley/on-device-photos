import React, { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import MenuRow, { MenuRowStyle } from '../../components/MenuRow/MenuRow';
import MenuRowAction from '../../components/MenuRowAction/MenuRowAction';
import Toolbar from '../../components/Toolbar/Toolbar';
import { StudioSections } from '../../data/studio/StudioSections.data';
import { IStudioSection, IStudioSectionOption } from '../../definitions/interfaces/IStudioSection';
import { useUnityWebLink } from '../../hooks/useUnityWebLink';
import styles from './StudioPage.module.scss';

export interface IStudioPage {
}

// eslint-disable-next-line no-empty-pattern
const StudioPage = ({ }: IStudioPage) => {
	const { t } = useTranslation();
	const { unity, unityReady } = useUnityWebLink('unity');
	const canvasRef = useRef<HTMLCanvasElement>();

	const sections = StudioSections;
	const sectionData: any[] = [];

	useEffect(() => {
		if(!unityReady || !unity.current) return;
		const cnv = unity.current.getCanvas();
		canvasRef.current = cnv;

		document.querySelector('#studio')!.appendChild(cnv);
	}, [unityReady]);


	useEffect(() => {
		if (sectionData.length !== 0) return;

		sections.forEach((section) => {
			sectionData.push({
				items:  Object.fromEntries(section.options.map((item) => [item.key, item.default])),
				tag: section.style.toString()
			});
		});
	}, []);

	const updateSection = (section: MenuRowStyle, key: string, value: any) => {
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
				className={styles.StudioPage_Canvas}
				id="studio">
				<Toolbar unity={unity} />
			</div>
		</div>
	);
};

export default StudioPage;
