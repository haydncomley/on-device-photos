import { MenuRowStyle } from '../../components/MenuRow/MenuRow';
import { MenuActionType } from '../../components/MenuRowAction/MenuRowAction';
import { resources } from '../../util/translations.util';

export type TranslationKey = keyof typeof resources['en']['translation'];

export interface IStudioSection {
    title: TranslationKey;
    style: MenuRowStyle;
    options: IStudioSectionOption[];
}

export interface IStudioSectionOption {
    label: TranslationKey;
    type: MenuActionType;
    key: string;
    default: unknown;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transform?: (value: any) => any;
    options?: { label: TranslationKey, value: unknown }[];
}

export interface SectionData {
	tag: string;
	items: { [key: string]: unknown };
}