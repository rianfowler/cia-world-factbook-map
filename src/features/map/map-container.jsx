import React, { Component } from 'react';
import { connect } from 'react-redux';
import MapView from './map-view';
import {
	countrySelectionAction,
	getSelectedCountry,
	getWorldGeometry
} from '../countries/countries-reducer';
import {
	centerChange,
	getMapCenterLat,
	getMapCenterLong,
	getMapZoom,
	zoomInAction,
	zoomOutAction
} from './map-reducers';
import ZingTouch from 'zingtouch';

// max zoom is 20% map size
const mapStateToProps = state => {
	const selectedCountry = getSelectedCountry(state);

	const center = [getMapCenterLong(state), getMapCenterLat(state)];
	const zoom = getMapZoom(state);

	const geometry = getWorldGeometry(state);
	return {
		center,
		geometry,
		selectedCountry,
		zoom
	};
}

const mapDispatchToProps = dispatch => {
	return {
		onCenterChange: (center) => dispatch(centerChange({long: center[0], lat: center[1]})),
		onClick: (countryName) => dispatch(countrySelectionAction(countryName)),
		zoomIn: () => dispatch(zoomInAction()),
		zoomOut: () => dispatch(zoomOutAction())
	};
};

class MapContainer extends Component {
	componentDidMount() {
		/*
		this.gestureDetection = new ZingTouch.Region(this.containerElement, true, false);

		this.gestureDetection.bind(this.containerElement, 'pinch', (event) => {
			this.props.zoomOut();
		}, false);

		this.gestureDetection.bind(this.containerElement, 'expand', (event) => {
			this.props.zoomIn();
		}, false);
		*/
	}

	componentWillUnmount() {

	}

	render() {
		return (
			<div
				className="map-container"
				ref={ (containerElement) => this.containerElement = containerElement }
			>
				<MapView
					center={this.props.center}
					geometry={this.props.geometry}
					onCenterChange={this.props.onCenterChange}
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
