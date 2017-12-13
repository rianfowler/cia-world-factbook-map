import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	getCountryBackground,
	getSelectedCountry
} from '../countries/countries-reducer';

const mapStateToProps = state => {
	return {
		background: getCountryBackground(state, getSelectedCountry(state))
	}
}

const mapDispatchToProps = dispatch => {
	return {};
};

class DetailsContainer extends Component {
	render() {
		return (
			<div className="details-container">
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
)(DetailsContainer);
