import _get from 'lodash/get';
import { feature } from 'topojson-client';

export const worldAction = () => (dispatch) => {
	dispatch({type: 'WORLD_PENDING'});
	fetch('/data/world.json')
		.then((res) => res.json())
		.then((world) => dispatch({type: 'WORLD_FULFILLED', world}))
		.catch((error) => dispatch({type: 'WORLD_FAILED', error}));
};

export const countrySelectionAction = (country) => (dispatch, getState) => {
	if (!country) {
		dispatch({type: 'COUNTRY_SELECTION_FAILED', error: 'No country provided'});
		return;
	}

	const cachedCountry = getCountry(getState(), country);
	let coordinateBounds = cachedCountry.coordinateBounds;
	if (!coordinateBounds) {

		const topology = getWorldGeometry(getState());
		const featureCollectionObject = topology.objects[Object.keys(topology.objects)[0]];

		const geometryFeatures = feature(topology, featureCollectionObject).features;
		const countryGeometry = geometryFeatures.filter((feature) => feature.properties.NAME_LONG === country)[0].geometry;

		coordinateBounds = countryGeometry.coordinates.reduce((accumulator, next) => {
			if (next.length !== 2) {
				const { minLat, maxLat, minLong, maxLong } = getMinMaxLatLong(next);
				return {
					minLat: Math.min(minLat, accumulator.minLat),
					maxLat: Math.max(maxLat, accumulator.maxLat),
					minLong: Math.min(minLong, accumulator.minLong),
					maxLong: Math.max(maxLong, accumulator.maxLong)
				}
			}
			return {
				minLat: Math.min(next[1], accumulator.minLat),
				maxLat: Math.max(next[1], accumulator.maxLat),
				minLong: Math.min(next[0], accumulator.minLong),
				maxLong: Math.max(next[0], accumulator.maxLong)
			}
		}, {minLat: 90, maxLat: -90, minLong: 180, maxLong: -180});
	}

	if (cachedCountry) {
		dispatch({type: 'COUNTRY_SELECTION_FULFILLED', country: cachedCountry.name, coordinateBounds});
	} else {
		dispatch({type: 'COUNTRY_SELECTION_PENDING', country, coordinateBounds});
		fetch(`/data/country/${country}/details.json`)
			.then((res) => res.json())
			.then((details) => dispatch({type: 'COUNTRY_SELECTION_FULFILLED', country, details, coordinateBounds}))
			.catch((error) => dispatch({type: 'COUNTRY_SELECTION_FAILED', error}));
	}
};

function getMinMaxLatLong(coordinates) {
	return coordinates.reduce((accumulator, next) => {
		if (next.length !== 2) {
			const { minLat, maxLat, minLong, maxLong } = getMinMaxLatLong(next);
			return {
				minLat: Math.min(minLat, accumulator.minLat),
				maxLat: Math.max(maxLat, accumulator.maxLat),
				minLong: Math.min(minLong, accumulator.minLong),
				maxLong: Math.max(maxLong, accumulator.maxLong)
			}
		}
		return {
			minLat: Math.min(next[1], accumulator.minLat),
			maxLat: Math.max(next[1], accumulator.maxLat),
			minLong: Math.min(next[0], accumulator.minLong),
			maxLong: Math.max(next[0], accumulator.maxLong)
		}
	}, {minLat: 90, maxLat: -90, minLong: 180, maxLong: -180});
}

export function countriesReducer(countriesState = { details: {}}, action) {
	switch(action.type) {
		case 'WORLD_FULFILLED':
			return {
				geometry: action.world.geometry,
				countries: action.world.countries
			}
		case 'COUNTRY_SELECTION_PENDING': {
			const cachedCountry = _get(countriesState, `details.${action.country}`, {});
			return {
				...countriesState,
				selectedCountry: action.country,
				details: {
					...countriesState.details,
					[action.country]: {
						...cachedCountry,
						coordinateBounds: action.coordinateBounds
					}
				}
			};
		}
		case 'COUNTRY_SELECTION_FULFILLED': {
			const cachedCountry = _get(countriesState, `details.${action.country}`, {});
			if (action.details) {
				return {
					...countriesState,
					details: {
						...countriesState.details,
						[action.country]: {
							...cachedCountry,
							background: action.details.background
						}
					}
				}
			}
			return {
				...countriesState,
				selectedCountry: action.country
			};
		}
		default:
			return countriesState;
	}
}

function getCountriesState(state) {
	return state.countries;
}

export function getSelectedCountry(state) {
	const countriesState = getCountriesState(state);

	return _get(countriesState, 'selectedCountry', '');
}

function getCountry(countryState, countryName) {
	return _get(countryState, `details.${countryName}`, '');
}

export function getCountryCoordinateBounds(state, countryName) {
	const country = getCountry(getCountriesState(state), countryName);

	return _get(country, 'coordinateBounds', {minLat: -90, maxLat: 90, minLong: -180, maxLong: 180});
}

export function getCountryBackground(state, countryName) {
	const countriesState = getCountriesState(state);

	return _get(getCountry(countriesState, countryName), 'background', '');
}

export function getCountries(state) {
	const countriesState = getCountriesState(state);

	return _get(countriesState, 'countries', []);
}

export function getWorldGeometry(state) {
	const countriesState = getCountriesState(state);

	return _get(countriesState, 'geometry', []);
};
