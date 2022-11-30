import React from 'react';
import {
	BrowserRouter,
	Routes,
	Route,
	Navigate
} from 'react-router-dom';
import './App.scss';
import 'material-icons/iconfont/material-icons.css';
import CookieConsent from './app/components/CookieConsent/CookieConsent';
import LazyStudioPage from './app/pages/Studio/StudioPage.lazy';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route
					element={<Navigate to="/studio" />}
					path='/' />
				<Route
					element={<LazyStudioPage />}
					path='/studio' />
			</Routes>

			<CookieConsent />
		</BrowserRouter>
	);
}

export default App;
