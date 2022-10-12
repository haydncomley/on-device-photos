import { classlist } from 'easy-class';
import React from 'react';
import styles from './ClickableBox.module.scss';

export interface IClickableBox {
	onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
	disabled?: boolean,
	accent?: boolean
}

const ClickableBox = ({ children, onClick, disabled, accent }: IClickableBox & { children: React.ReactNode }) => {
	return (
		<div
			className={classlist(
				styles.ClickableBox,
				disabled && styles.ClickableBox__disabled,
				accent && styles.ClickableBox_Accented
			)}
			onClick={(e) => {
				if(onClick) onClick(e);
			}}>
			{ children }
		</div>
	);
};

export default ClickableBox;
