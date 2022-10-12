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
    options?: { label: TranslationKey, value: unknown }[];
}