import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';
import {
	applyMiddleware,
	createStore,
	combineReducers
} from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import {
	countriesReducer,
	worldAction
} from './features/countries/countries-reducer';
import {
	displaySizeUpdateAction,
	countryLocationAction,
	mapReducer
} from './features/map/map-reducers';
import {
	searchReducer
} from './features/search/search-reducer';
import {
	detailsReducer
} from './features/details/details-reducer';
import thunk from 'redux-thunk';

const reducer = combineReducers({countries: countriesReducer, details: detailsReducer, map: mapReducer, search: searchReducer});

const store = createStore(reducer, applyMiddleware(thunk, promiseMiddleware()));
store.dispatch(worldAction());

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>, document.getElementById('root'));
registerServiceWorker();
