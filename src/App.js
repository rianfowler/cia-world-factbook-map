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

(function () {
	var old = console.log;
	var logger = document.getElementById('log');
	console.log = function () {
		for (var i = 0; i < arguments.length; i++) {
			if (typeof arguments[i] == 'object') {
				logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(arguments[i], undefined, 2) : arguments[i]) + '<br />';
			} else {
				logger.innerHTML += arguments[i] + '<br />';
			}
		}
	}
})();

const ConnectedApp = connect(
	mapStateToProps,
	mapDispatchToProps
)(App);
export default ConnectedApp;
