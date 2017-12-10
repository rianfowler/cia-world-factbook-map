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
	countryReducer
} from './features/country/country-reducer';
import {
	displaySizeUpdateAction,
	countryLocationAction,
	mapReducer
} from './features/map/map-reducers';
import {
	countriesAction,
	searchReducer
} from './features/search/search-reducer';
import thunk from 'redux-thunk';

const reducer = combineReducers({country: countryReducer, map: mapReducer, search: searchReducer});

const store = createStore(reducer, applyMiddleware(thunk, promiseMiddleware()));
store.dispatch(countriesAction());

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>, document.getElementById('root'));
registerServiceWorker();
