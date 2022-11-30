/* eslint-disable sort-keys-fix/sort-keys-fix */
import { MenuRowStyle } from '../../components/MenuRow/MenuRow';
import { MenuActionType } from '../../components/MenuRowAction/MenuRowAction';
import { IStudioSection } from '../../definitions/interfaces/IStudioSection';

export const StudioSection_Camera: IStudioSection = {
	title: 'camera_Header',
	style: MenuRowStyle.Camera,
	options: [
		{
			label: 'camera_OptionPerspective',
			key: 'isPerspective',
			default: true,
			type: MenuActionType.Dropdown,
			options: [
				{ label: 'camera_OptionPerspective_Perspective', value: true },
				{ label: 'camera_OptionPerspective_Orthographic', value: false },
			]
		},
	],
};