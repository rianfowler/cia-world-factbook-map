export const searchInputChangeAction = (newValue) => ({
	type: 'SEARCH_INPUT_CHANGE',
	newValue
});

export const countriesSuggestionsAction = ({value, countries}) => ({
	type: 'COUNTRIES_SUGGESTIONS',
	countries,
	value
});

export const countriesSuggestionsClearAction = () => ({
	type: 'COUNTRIES_SUGGESTIONS_CLEAR'
});

export function searchReducer(searchState = {}, action) {
	switch(action.type) {
		case 'COUNTRY_SELECTION_PENDING':
			return {
				...searchState,
				searchInputValue: action.country
			};
		case 'COUNTRIES_SUGGESTIONS':
			const inputValue = action.value.trim().toLowerCase();
			const inputLength = inputValue.length;
			const suggestions = inputLength === 0 ? [] : action.countries.filter(country =>
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
