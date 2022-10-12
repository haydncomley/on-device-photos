import React from 'react';
import styles from './Icon.module.scss';
import { classlist } from 'easy-class';

export interface IIcon {
	name: string,
	size?: 'normal'
}

const Icon = ({ name }: IIcon) => {
	return (
		<span className={classlist(
			styles.Icon,
			'material-icons'
		)}>{ name }</span> 
	);
};

export default Icon;
