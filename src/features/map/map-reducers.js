import _get from 'lodash/get';

export function mapReducer(mapState = {locations: {}}, action) {
	return mapState;
}

function getMapState (state) {
	return state.map;
}
