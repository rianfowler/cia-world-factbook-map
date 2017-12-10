import _get from 'lodash/get';

export function countryReducer(countryState = {}, action) {
	switch(action.type) {
		case 'COUNTRY_SELECTION':
			return action.details ?
				{
					...countryState,
					displayedCountry: action.country,
					details: {
						...countryState.details,
						[action.country]: {
							background: action.details.background
						}
					}
				} :
				{
					...countryState,
					displayedCountry: action.country
				};
		default:
			return countryState;
	}
}

function getCountryState(state) {
	return state.country;
}

export function getDisplayedCountry(state) {
	const countryState = getCountryState(state);
	return _get(countryState, 'displayedCountry', '');
}

export function getCountryBackground(state, countryName) {
	const countryState = getCountryState(state);

	console.log(countryName);

	return _get(countryState, `details.${countryName}.background`, '');
}
