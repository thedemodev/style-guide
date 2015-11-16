import Bacon from 'baconjs';

export default class SearchModel {
    constructor(searchDataUrl) {
        this._searchTermBus = new Bacon.Bus();
        this.searchTerm = this._searchTermBus.toProperty();

        this._selectedSuggestionBus = new Bacon.Bus();
        this.selectedSuggestion = this._selectedSuggestionBus.toProperty();

        let _searchData = this._loadSearchData(searchDataUrl);

        this.suggestions = this._suggestions(_searchData);

        this.loading = _searchData.map((searchData) => !!searchData.loading);
        this.error = _searchData.map((searchData) => !!searchData.error);
    }

    toProperty() {
        return Bacon.combineTemplate({
            loading: this.loading,
            error: this.error,
            suggestions: this.suggestions,
            selectedSuggestion: this.selectedSuggestion,
            setSearchTerm: this.setSearchTerm,
        });
    }

    setSearchTerm(val) {
        this._searchTermBus.push(val);
    }

    setSelectedSuggestion(suggestion) {
        this._selectedSuggestionBus.push(suggestion);
    }

    _suggestions(_searchData) {

        this.suggestions = _searchData.combine(this.searchTerm, (searchData, searchTerm) => {
            if(searchData.loading || searchData.error) {
                return null;
            } else {
                return searchData.lunrIndex.search(searchTerm);
            }
        })
    }

    _loadSearchData(searchDataUrl) {
        this.searchData = Bacon.fromPromise($.get(searchDataUrl), false, (dataOrError) => {
            let hasError= dataOrError.hasOwnProperty('error');

            if(hasError) {
                return [{
                    error: dataOrError.error,
                    loading: false,
                }];
            } else {
                let lunrIndex = lunr.Index.load(dataOrError);
                lunrIndex.pipeline.remove(lunr.stopWordFilter);

                return [{
                    error: false,
                    loading: false,
                    lunrIndex: lunrIndex,
                }];
            }
        }).toProperty({
            error: false,
            loading: true,
        });
    }
}