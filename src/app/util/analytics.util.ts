import { GA4React } from 'ga-4-react';

const ga4react = new GA4React('G-Y4L42QLMWC').initialize();

export interface AnalyticsData {
    path: string;
    location?: string;
    title: string;
}

export const trackAnalytics = (data: AnalyticsData) => {
	const { path, location, title } = data;

	ga4react
		.then((ga) => {
			ga.pageview(path, location, title);
		})
		.catch((err) => console.error('Analytics Error', err));
};