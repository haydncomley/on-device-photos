import React, { lazy, Suspense } from 'react';
import { IStudioPage } from './StudioPage';

const StudioPage = lazy(() => import('./StudioPage'));

const LazyStudioPage = (props: IStudioPage & { children?: React.ReactNode; }) => (
	<Suspense fallback={null}>
		<StudioPage {...props} />
	</Suspense>
);

export default LazyStudioPage;
