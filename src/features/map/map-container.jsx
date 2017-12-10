import React, { Component } from 'react';
import { connect } from 'react-redux';
import MapView from './map-view';
import {
	getMapCenter
} from './map-reducers';

const mapStateToProps = state => {
	const center = getMapCenter(state);
	return {
		center
	};
}

const mapDispatchToProps = dispatch => {
	return {};
};

// need to get dimensions of window height and pass into view state

class MapContainer extends Component {
	render() {
		return (
			<div classname="map-container">
				<MapView
					width={this.props.mapWidth}
					height={this.props.mapHeight}
					center={this.props.center}
					zoom={2}
				></MapView>
			</div>
		);
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(MapContainer);
