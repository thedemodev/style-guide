import Bacon from 'baconjs';
import lunr from 'lunr';

export default class SearchModel {

    static combinator(props, context) {
      let model = new SearchModel(props);

      return Bacon.combineTemplate({
          loading: model.loading,
          error: model.error,
          suggestions: model.suggestions,
          selectedSuggestion: model.selectedSuggestion,
          setSearchTerm: model.setSearchTerm,
          setSelectedSuggestion: model.setSelectedSuggestion,
          baseUrl: model.baseUrl,
      }).toProperty();
    }

    constructor(options) {
        // get the options as properties to react to changes
        this.baseUrl = this._getOptionAsProperty(options, 'baseUrl');
        this._searchDataUrl = this._getOptionAsProperty(options, 'searchDataUrl');

        // create a bus to handle searchTerm changes
        this.searchTerm = new Bacon.Bus();

        // create a bus and a derived property to handle selection of a
        // suggestion (either by keyboard up/down or by mouse over)
        this._selectedSuggestionBus = new Bacon.Bus();
        this.selectedSuggestion = this._selectedSuggestionBus.toProperty(null);

        // create a property containing the search data loaded from the
        // searchDataUrl
        this._searchData = this._searchDataUrl.flatMap((searchDataUrl) => this._loadSearchData(searchDataUrl));

        // handle the loading and error state for searchData loading
        this.loading = this._searchData.map((searchData) => !!searchData.loading).toProperty(true);
        this.error = this._searchData.map((searchData) => !!searchData.error).toProperty(false);

        // combine the latest seatchData and searchTerm to find
        // suggestions
        this.suggestions = this._searchData.combine(this.searchTerm, (searchData, searchTerm) => {
          if(searchData.loading || searchData.error) {
            return [];
          }

          return searchData.lunrIndex.search(searchTerm).slice(0,5).map((res) => ({
            ref: res.ref,
            link: searchData.pages[res.ref].link,
            title: searchData.pages[res.ref].title,
            tags: searchData.pages[res.ref].tags,
          }));

        }).changes().toProperty([]);

        // bind methods
        this.setSearchTerm = this.setSearchTerm.bind(this);
        this.setSelectedSuggestion = this.setSelectedSuggestion.bind(this);
    }

    _getOptionAsProperty(options, name) {
      return options.map((opts) => opts[name])
        .skipDuplicates()
        .toProperty();
    }

    toProperty() {
        return Bacon.combineTemplate({
            loading: this.loading,
            error: this.error,
            suggestions: this.suggestions,
            selectedSuggestion: this.selectedSuggestion,
            setSearchTerm: this.setSearchTerm,
            baseUrl: this.baseUrl,
        });
    }

    setSearchTerm(val) {
        this.searchTerm.push(val);
    }

    setSelectedSuggestion(suggestion) {
        this._selectedSuggestionBus.push(suggestion);
    }

    _loadSearchData(searchDataUrl) {
        return Bacon.fromPromise($.get(searchDataUrl), false, (dataOrError) => {
            let hasError = dataOrError.hasOwnProperty('error');

            if(hasError) {
                return {
                    error: dataOrError.error,
                    loading: false,
                };
            } else {
                let lunrIndex = lunr.Index.load(dataOrError.lunr);
                lunrIndex.pipeline.remove(lunr.stopWordFilter);

                return {
                    error: false,
                    loading: false,
                    lunrIndex: lunrIndex,
                    pages: dataOrError.pages,
                };
            }
        });
    }
}
