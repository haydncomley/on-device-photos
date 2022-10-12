/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TranslationKey } from '../../definitions/interfaces/IStudioSection';
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

	useEffect(() => {
		if (onChange) onChange(currentValue);
	}, [currentValue]);

	const renderActionType = useCallback(() => {
		switch(type) {
		default:
			return <span>Undefined</span>;
		case MenuActionType.Toggle:
			return <input
				checked={currentValue}
				onChange={(e) => setCurrentValue(e.target.checked)}
				type='checkbox' />;
		case MenuActionType.Dropdown:
			return <select
				onChange={(e) => setCurrentValue(e.target.value)}
				value={currentValue}>
				{ options?.map((x, i) => <option
					key={i}
					value={x.value}>
					{ t(x.label) }
				</option>) }
			</select>;
		}
	}, [type, currentValue, setCurrentValue, options]);

	return (
		<div className={styles.MenuRowAction}>
			{ renderActionType() }
		</div>
	);
};

export default MenuRowAction;
