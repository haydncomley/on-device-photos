import { classlist } from 'easy-class';
import React from 'react';
import styles from './MenuRow.module.scss';

export enum MenuRowStyle {
	Environment = 'Environment',
	Device = 'Device',
}

export interface IMenuRow {
	label?: string,
	header?: boolean
	rowStyle: MenuRowStyle;
}

const MenuRow = ({ label, header, rowStyle, children }: IMenuRow & { children?: React.ReactNode }) => {
	return (
		<div className={classlist(
			styles.MenuRow,
			header && styles.MenuRow_header,
			styles[`MenuRow_style_${rowStyle}`]
		)}>
			{ label && <span className={styles.MenuRow_label}>{ label }</span> }
			{ children }
		</div>
	);
};

export default MenuRow;
