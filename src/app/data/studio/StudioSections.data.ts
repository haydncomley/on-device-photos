/* eslint-disable sort-keys-fix/sort-keys-fix */
import { IStudioSection } from '../../definitions/interfaces/IStudioSection';
import { StudioSection_Device } from './StudioSection_Device.data';
import { StudioSection_Environment } from './StudioSection_Environment.data';

export const StudioSections: IStudioSection[] = [
	StudioSection_Environment,
	StudioSection_Device
];