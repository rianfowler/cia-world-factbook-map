export const countriesAction = () => ({
	type: 'COUNTRIES',
	payload: fetch('/data/countries.json').then((res) => res.json())
});

export const searchInputChangeAction = (newValue) => ({
	type: 'SEARCH_INPUT_CHANGE',
	newValue
});

export const countriesSuggestionsAction = (value) => ({
	type: 'COUNTRIES_SUGGESTIONS',
	value
});

export const countriesSuggestionsClearAction = () => ({
	type: 'COUNTRIES_SUGGESTIONS_CLEAR'
});

export const countrySelectionAction = (country) => (dispatch, getState) => {
	const mapState = getState().map;

	if (!country)
		return;

	if (!mapState.locations || !mapState.locations[country]) {
		fetch(`/data/country/${country}/details.json`)
			.then((res) => res.json())
			.then((details) => dispatch({type: 'COUNTRY_SELECTION', country, details}));
	} else {
		dispatch({type: 'COUNTRY_SELECTION', country});
	}
};

export function searchReducer(searchState = {countries: []}, action) {
	switch(action.type) {
		case 'COUNTRIES_PENDING':
			return searchState;
		case 'COUNTRIES_REJECTED':
			return searchState;
		case 'COUNTRIES_FULFILLED':
			return {
				...searchState,
				countries: action.payload
			};
		case 'COUNTRY_SELECTION':
			return {
				...searchState,
				selectedCountry: action.country,
				searchInputValue: action.country
			};
		case 'COUNTRIES_SUGGESTIONS':
			const inputValue = action.value.trim().toLowerCase();
			const inputLength = inputValue.length;
			const suggestions = inputLength === 0 ? [] : searchState.countries.filter(country =>
				country.toLowerCase().slice(0, inputLength) === inputValue
			);
			return {
				...searchState,
				suggestedCountries: suggestions
			};
		case 'SEARCH_INPUT_CHANGE':
			return {
				...searchState,
				searchInputValue: action.newValue
			};
		default:
			return searchState;
	}
}

function getSearchState (state) {
	return state.search;
}

export function getSuggestedCountries(state) {
	const searchState = getSearchState(state);

	return searchState.suggestedCountries ? searchState.suggestedCountries : [];
}

export function getSearchInputValue(state) {
	const searchState = getSearchState(state);

	return searchState.searchInputValue ? searchState.searchInputValue : '';
}

export function getSelectedCountry(state) {
	const searchState = getSearchState(state);

	return searchState.selectedCountry ? searchState.selectedCountry : '';
}
