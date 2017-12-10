import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	getCountryBackground,
	getDisplayedCountry
} from './country-reducer';
// import MapView from './map-view';

const mapStateToProps = state => {
	return {
		background: getCountryBackground(state, getDisplayedCountry(state))
	}
}

const mapDispatchToProps = dispatch => {
	return {};
};

class CountryContainer extends Component {
	render() {
		return (
			<div className="country-container">
				<ul>
					<strong>Background:</strong> {this.props.background}
				</ul>
			</div>
		);
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(CountryContainer);
