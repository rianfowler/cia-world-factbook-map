import React, { Component } from 'react';
import { connect } from 'react-redux';
import MapView from './map-view';
import {
	countrySelectionAction,
	getCountryCoordinateBounds,
	getSelectedCountry,
	getWorldGeometry
} from '../countries/countries-reducer';

// max zoom is 20% map size
const maxZoom = 6;
const mapStateToProps = state => {
	const selectedCountry = getSelectedCountry(state);
	const {
		minLat,
		maxLat,
		minLong,
		maxLong
	} = getCountryCoordinateBounds(state, selectedCountry);

	const zoom = Math.min(180 / (maxLat - minLat), 360 / (maxLong - minLong));
	const center = [(maxLong - ((maxLong - minLong) /2)),(maxLat - ((maxLat - minLat) / 2))];

	const geometry = getWorldGeometry(state);
	return {
		center,
		geometry,
		selectedCountry,
		zoom: Math.min(zoom, maxZoom)
	};
}

const mapDispatchToProps = dispatch => {
	return {
		onClick: (countryName) => dispatch(countrySelectionAction(countryName))
	};
};

// need to get dimensions of window height and pass into view state

class MapContainer extends Component {
	render() {
		return (
			<div className="map-container">
				<MapView
					center={this.props.center}
					geometry={this.props.geometry}
					onClick={this.props.onClick}
					selectedCountry={this.props.selectedCountry}
					zoom={this.props.zoom}
				></MapView>
			</div>
		);
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(MapContainer);
