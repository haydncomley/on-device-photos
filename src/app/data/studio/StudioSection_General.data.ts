/* eslint-disable sort-keys-fix/sort-keys-fix */
import { MenuRowStyle } from '../../components/MenuRow/MenuRow';
import { MenuActionType } from '../../components/MenuRowAction/MenuRowAction';
import { IStudioSection } from '../../definitions/interfaces/IStudioSection';

export const StudioSection_General: IStudioSection = {
	title: 'general_Header',
	style: MenuRowStyle.General,
	options: [
		{
			label: 'general_OptionQuality',
			key: 'renderQuality',
			default: 1,
			type: MenuActionType.Dropdown,
			options: [
				{ label: 'general_OptionQuality_Low', value: 0 },
				{ label: 'general_OptionQuality_Mid', value: 1 },
				{ label: 'general_OptionQuality_High', value: 2 },
			]
		},
	],
};