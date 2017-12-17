import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { connect } from 'react-redux';
import MapContainer from './features/map/map-container';
import SearchContainer from './features/search/search-container';
import DetailsContainer from './features/details/details-container';

const mapStateToProps = state => {
	return {}
}

const mapDispatchToProps = dispatch => {
	return {}
};

class App extends Component {
	render() {
		return (
			<div className="App">
				<MapContainer></MapContainer>
				<SearchContainer></SearchContainer>
				<DetailsContainer></DetailsContainer>
			</div>
		);
	}
}

const ConnectedApp = connect(
	mapStateToProps,
	mapDispatchToProps
)(App);
export default ConnectedApp;
