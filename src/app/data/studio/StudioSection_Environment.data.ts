/* eslint-disable sort-keys-fix/sort-keys-fix */
import { MenuRowStyle } from '../../components/MenuRow/MenuRow';
import { MenuActionType } from '../../components/MenuRowAction/MenuRowAction';
import { IStudioSection } from '../../definitions/interfaces/IStudioSection';

export const StudioSection_Environment: IStudioSection = {
	title: 'environment_Header',
	style: MenuRowStyle.Environment,
	options: [
		{
			label: 'environment_OptionShadows',
			key: 'softShadows',
			default: true,
			type: MenuActionType.Dropdown,
			options: [
				{ label: 'environment_OptionShadows_Soft', value: true },
				{ label: 'environment_OptionShadows_Hard', value: false },
			]
		},
		{
			label: 'environment_OptionFloor',
			key: 'showFloor',
			default: false,
			type: MenuActionType.Toggle
		},
		{
			label: 'environment_OptionBackground',
			key: 'showSky',
			default: false,
			type: MenuActionType.Toggle
		},
	],
};