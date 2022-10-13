/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TranslationKey } from '../../definitions/interfaces/IStudioSection';
import Icon from '../Icon/Icon';
import styles from './MenuRowAction.module.scss';

export enum MenuActionType {
	Toggle = 'Toggle',
	Dropdown = 'Dropdown'
}

export interface IMenuRowAction {
	type?: MenuActionType,
	value?: unknown,
	onChange?: <T>(value: T) => void,
	options?: { label: TranslationKey, value: any }[]
}

const MenuRowAction = ({ type, value, onChange, options }: IMenuRowAction) => {
	const { t } = useTranslation();
	const [ currentValue, setCurrentValue ] = useState<any>(value);

	const [ label, setLabel ] = useState<TranslationKey>('_undefined');

	useEffect(() => {
		if (onChange) onChange(currentValue);
	}, [currentValue]);

	useEffect(() => {
		if (options) {
			setLabel(options.find((x) => x.value.toString() == currentValue.toString())?.label as TranslationKey);
		}
	}, [currentValue, value, options]);

	const renderActionType = useCallback(() => {
		switch(type) {
		default:
			return <span>Undefined</span>;
		case MenuActionType.Toggle:
			return <span className={styles.Action_Toggle}>
				<input
					checked={currentValue}
					onChange={(e) => setCurrentValue(e.target.checked)}
					tabIndex={0}
					type='checkbox' />
				<Icon name={currentValue ? 'check_box' : 'check_box_outline_blank'} />
			</span>;
		case MenuActionType.Dropdown:
			return <span className={styles.Action_Dropdown}>
				<p>{ t(label) }</p>
				<Icon name='expand_more' />
				<select
					onChange={(e) => setCurrentValue(e.target.value)}
					value={currentValue}>
					{ options?.map((x, i) => <option
						key={i}
						value={x.value}>
						{ t(x.label) }
					</option>) }
				</select>
			</span>;
		}
	}, [type, currentValue, setCurrentValue, options, label]);

	return (
		<div className={styles.MenuRowAction}>
			{ renderActionType() }
		</div>
	);
};

export default MenuRowAction;
