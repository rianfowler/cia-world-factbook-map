import _get from 'lodash/get';

export function zoomOutAction() {
	return { type: 'ZOOM_OUT' };
}

export function zoomInAction() {
	return { type: 'ZOOM_IN' };
}

export function centerChange({long, lat}) {
	return { type: 'CENTER_CHANGE', lat, long };
}

export function mapReducer(mapState = {maxZoom: 6}, action) {
	switch(action.type) {
		case 'CENTER_CHANGE':
			console.log(action);
			return {
				...mapState,
				centerLong: action.long,
				centerLat: action.lat
			};
		case 'WORLD_FULFILLED':
			return {
				...mapState,
				geometry: action.world.geometry,
				countries: action.world.countries,
				zoom: 1,
				centerLong: 0,
				centerLat: 0
			};
		case 'COUNTRY_SELECTION_PENDING': {
			const minLat = action.coordinateBounds.minLat;
			const maxLat = action.coordinateBounds.maxLat;
			const minLong = action.coordinateBounds.minLong;
			const maxLong = action.coordinateBounds.maxLong;

			const zoom = Math.min(180 / (maxLat - minLat), 360 / (maxLong - minLong));
			const centerLong = maxLong - ((maxLong - minLong) /2);
			const centerLat = maxLat - ((maxLat - minLat) / 2);

			return {
				...mapState,
				zoom: Math.min(mapState.maxZoom, zoom),
				centerLong,
				centerLat
			};
		}
		case 'ZOOM_IN':
			const newZoomIn = mapState.zoom * 1.01;
			return {
				...mapState,
				zoom: newZoomIn < 1 ? 1 : newZoomIn > mapState.maxZoom ? mapState.maxZoom : newZoomIn
			}
		case 'ZOOM_OUT':
			const newZoomOut = mapState.zoom * 0.99;
			return {
				...mapState,
				zoom: newZoomOut < 1 ? 1 : newZoomOut > mapState.maxZoom ? mapState.maxZoom : newZoomOut
			}
		default:
			return mapState;
	}
}

function getMapState (state) {
	return state.map;
}

export function getMapZoom(state) {
	const mapState = getMapState(state);

	return _get(mapState, 'zoom', 1);
}

export function getMapCenterLong(state) {
	const mapState = getMapState(state);

	return _get(mapState, 'centerLong', 0);
}

export function getMapCenterLat(state) {
	const mapState = getMapState(state);

	return _get(mapState, 'centerLat', 0);
}
