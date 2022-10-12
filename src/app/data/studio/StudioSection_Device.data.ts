/* eslint-disable sort-keys-fix/sort-keys-fix */
import { MenuRowStyle } from '../../components/MenuRow/MenuRow';
import { MenuActionType } from '../../components/MenuRowAction/MenuRowAction';
import { IStudioSection } from '../../definitions/interfaces/IStudioSection';

export const StudioSection_Device: IStudioSection = {
	title: 'device_Header',
	style: MenuRowStyle.Device,
	options: [
		{
			label: 'device_OptionOrientation',
			key: 'isPhoneUpright',
			default: true,
			type: MenuActionType.Dropdown,
			options: [
				{ label: 'device_OptionOrientation_Up', value: true },
				{ label: 'device_OptionOrientation_Down', value: false },
			]
		},
		{
			label: 'device_OptionBranding',
			key: 'showDeviceMeta',
			default: true,
			type: MenuActionType.Toggle
		},
	],
};