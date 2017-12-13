import React, { Component } from 'react';
import { connect } from 'react-redux';
import Autosuggest from 'react-autosuggest';
import {
	countriesSuggestionsAction,
	countriesSuggestionsClearAction,
	getSuggestedCountries,
	getSearchInputValue,
	searchInputChangeAction
} from './search-reducer';
import {
	getCountries,
	countrySelectionAction,
	getSelectedCountry
} from '../countries/countries-reducer';
import styles from './search.module.css';

const mapStateToProps = state => {
	const countries = getCountries(state);
	const suggestedCountries = getSuggestedCountries(state);
	const searchInputValue = getSearchInputValue(state);
	const selectedCountry = getSelectedCountry(state);
	return {
		countries,
		searchInputValue,
		selectedCountry,
		suggestedCountries
	};
}

const mapDispatchToProps = dispatch => {
	return {
		changeSearchInput: (event, { newValue }) => dispatch(searchInputChangeAction(newValue)),
		clearCountriesSuggestions: () => dispatch(countriesSuggestionsClearAction()),
		getCountriesSuggestions: (value, countries) => dispatch(countriesSuggestionsAction({value, countries})),
		selectCountry: (country) => dispatch(countrySelectionAction(country))
	};
};

function renderSuggestion(suggestion) {
	return (<div>{suggestion}</div>);
}

class SearchContainer extends Component {
	render() {
		// Autosuggest will pass through all these props to the input.
		const inputProps = {
			placeholder: 'Country',
			value: this.props.searchInputValue,
			onChange: this.props.changeSearchInput,
			onFocus: () => this.props.changeSearchInput(null, {newValue: ''}),
			onKeyPress: (event) => {
				if (event.key === "Enter") {
					this.props.selectCountry(this.props.suggestedCountries[0])
					event.target.blur();
				}
			}
		};

		//		Finally, render it!
		return (
			<Autosuggest
				suggestions={this.props.suggestedCountries}
				onSuggestionsFetchRequested={(change) => this.props.getCountriesSuggestions(change.value, this.props.countries)}
				onSuggestionsClearRequested={this.props.clearCountriesSuggestions}
				focusInputOnSuggestionClick={false}
				getSuggestionValue={(value) => (this.props.selectCountry(value), value)}
				renderSuggestion={renderSuggestion}
				inputProps={inputProps}
				theme={styles}
			/>
		);
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SearchContainer);
