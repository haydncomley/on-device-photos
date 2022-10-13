/* eslint-disable sort-keys-fix/sort-keys-fix */
import { IStudioSection } from '../../definitions/interfaces/IStudioSection';
import { StudioSection_Camera } from './StudioSection_Camera.data';
import { StudioSection_Device } from './StudioSection_Device.data';
import { StudioSection_Environment } from './StudioSection_Environment.data';
import { StudioSection_General } from './StudioSection_General.data';

export const StudioSections: IStudioSection[] = [
	StudioSection_General,
	StudioSection_Camera,
	StudioSection_Environment,
	StudioSection_Device
];