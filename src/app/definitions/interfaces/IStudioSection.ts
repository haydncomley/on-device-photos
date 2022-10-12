import { MenuRowStyle } from '../../components/MenuRow/MenuRow';
import { MenuActionType } from '../../components/MenuRowAction/MenuRowAction';
import { resources } from '../../util/translations.util';

type TranslationKey = keyof typeof resources['en']['translation'];

export interface IStudioSection {
    title: TranslationKey;
    style: MenuRowStyle;
    options: IStudioSectionOption[];
}

export interface IStudioSectionOption {
    label: TranslationKey;
    type: MenuActionType;
    key: string;
    default: any;
    options?: { label: TranslationKey, value: any }[];
}