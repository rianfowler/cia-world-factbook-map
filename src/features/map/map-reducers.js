import _get from 'lodash/get';

export function mapReducer(mapState = {locations: {}}, action) {
	switch(action.type) {
		case 'COUNTRY_SELECTION':
			if (action.details)
				return {
					...mapState,
					countryFocused: action.country,
					locations: {
						...mapState.locations,
						[action.country]: action.details.location
					}
				};

			return {
				...mapState,
				countryFocused: action.country
			};
		default:
			return mapState;
	}
}

function getMapState (state) {
	return state.map;
}

export function getMapCenter(state) {
	const mapState = getMapState(state);
	return _get(mapState, `locations.${mapState.countryFocused}`, [0, 0]);
}
