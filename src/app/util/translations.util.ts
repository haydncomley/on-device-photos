import i18n from 'i18next';
import detector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import translationEN from '../data/locales/en.json';

export const resources = {
	en: {
		translation: translationEN
	}
};

i18n
	.use(detector)
	.use(initReactI18next)
	.init({
		fallbackLng: 'en',
		interpolation: {
			escapeValue: false
		}, 
		resources
	});