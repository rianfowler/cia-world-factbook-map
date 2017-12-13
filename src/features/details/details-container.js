import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	getCountryBackground,
	getSelectedCountry
} from '../countries/countries-reducer';
import DetailsView from './details-view';
import styles from './details.module.css';

const mapStateToProps = state => {
	const props = {
		background: getCountryBackground(state, getSelectedCountry(state))
	}

	props.showDetails = !!props.background;

	return props;
}

const mapDispatchToProps = dispatch => {
	return {};
};

class DetailsContainer extends Component {
	render() {
		return (
			<div className={styles.container}>
				{this.props.showDetails ? (
					<DetailsView
						background={this.props.background}
					></DetailsView>
				) : (<ul></ul>)}
			</div>
		);
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(DetailsContainer);
