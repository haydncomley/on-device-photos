import React from 'react';
import styles from './Checkbox.module.scss';

export interface ICheckbox {
	label: string,
	value: boolean,
	onChange?: (value: boolean) => void
}

const Checkbox = ({ value, label, onChange }: ICheckbox) => {
	return (
		<div
			className={styles.Checkbox}
			onClick={() => { if (onChange) onChange(!value); }}>
			[{ value ? 'X' : '  ' }] { label }
		</div>
	);
};

export default Checkbox;
