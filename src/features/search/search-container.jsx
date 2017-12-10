import React, { Component } from 'react';
import { connect } from 'react-redux';
import Autosuggest from 'react-autosuggest';
import {
	countrySelectionAction,
	countriesSuggestionsAction,
	countriesSuggestionsClearAction,
	getSelectedCountry,
	getSuggestedCountries,
	getSearchInputValue,
	searchInputChangeAction
} from './search-reducer';

const mapStateToProps = state => {
	const suggestedCountries = getSuggestedCountries(state);
	const searchInputValue = getSearchInputValue(state);
	const selectedCountry = getSelectedCountry(state);
	return {
		searchInputValue,
		selectedCountry,
		suggestedCountries
	};
}

const mapDispatchToProps = dispatch => {
	return {
		changeSearchInput: (event, { newValue }) => dispatch(searchInputChangeAction(newValue)),
		clearCountriesSuggestions: () => dispatch(countriesSuggestionsClearAction()),
		getCountriesSuggestions: (change) => dispatch(countriesSuggestionsAction(change.value)),
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
			onBlur: () => this.props.changeSearchInput(null, {newValue: this.props.selectedCountry}),
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
				onSuggestionsFetchRequested={this.props.getCountriesSuggestions}
				onSuggestionsClearRequested={this.props.clearCountriesSuggestions}
				focusInputOnSuggestionClick={false}
				getSuggestionValue={(value) => (this.props.selectCountry(value), value)}
				renderSuggestion={renderSuggestion}
				inputProps={inputProps}
			/>
		);
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SearchContainer);
