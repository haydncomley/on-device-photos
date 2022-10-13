import { classlist } from 'easy-class';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './CookieConsent.module.scss';

export interface ICookieConsent {
}

// eslint-disable-next-line no-empty-pattern
const CookieConsent = ({ }: ICookieConsent) => {
	const { t } = useTranslation();
	const [ accepted, setAccepted ] = useState(true);

	useEffect(() => {
		setAccepted(!!localStorage.getItem('cookie-consent'));
	}, []);

	const accept = () => {
		localStorage.setItem('cookie-consent', 'true');
		setAccepted(true);
	};

	return (
		<div className={classlist(
			styles.CookieConsent,
			accepted && styles.CookieConsent__accepted
		)}>
			<strong>{t('_cookieHeader')}</strong>
			<span>{t('_cookieSubHeader')}</span>
			<button onClick={accept}>{t('_cookieAccept')}</button>
		</div>
	);
};

export default CookieConsent;
