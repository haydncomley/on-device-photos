import { useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackAnalytics } from '../util/analytics.util';

export const useTrackPage = () => {
	const { pathname, search } = useLocation();

	const analytics = useCallback(() => {
		if (process.env.NODE_ENV === 'development') return;
		trackAnalytics({ location: search, path: pathname, title: document.title });
	}, [pathname, search]);

	useEffect(() => {
		analytics();
	}, [analytics]);
};