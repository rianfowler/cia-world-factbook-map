const _get = require('lodash/get');

export function fetchReducer(fetchState = { queriesToDetails: {}}, action) {
	switch(action.type) {
			// map the query to the key returned by the API- this key is used to lookup the data during cache hit
		case 'COUNTRY_SELECTION':
			if (action.details) {
				return {
					...fetchState,
					queriesToDetails: {
						...fetchState.queriesToDetails,
						[action.country]: action.details.country
					}
				};
			}
			// remove this if why splitting the action types in the thunk
			return fetchState;
		default:
			return fetchState;
	}
}

function getFetchState(state) {
	return state.fetch;
}

export function getDetailsKey(state, query) {
	const fetchState = getFetchState(state);

	return _get(fetchState, `queriesToDetails.${query}`, null);
}
