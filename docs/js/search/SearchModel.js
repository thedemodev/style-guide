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
        // baseUrl
        this.baseUrl = options.map((opts) => opts.baseUrl)
          .skipDuplicates()
          .toProperty();

        // search data url
        this._searchDataUrl = options.map((opts) => opts.searchDataUrl)
          .skipDuplicates()
          .toProperty();

        // search term
        this.searchTerm = new Bacon.Bus();

        // selectedSuggestion
        this._selectedSuggestionBus = new Bacon.Bus();
        this.selectedSuggestion = this._selectedSuggestionBus.toProperty(null);

        // search data
        this._searchData = this._searchDataUrl.flatMap((searchDataUrl) => this._loadSearchData(searchDataUrl));

        // search data error/loading
        this.loading = this._searchData.map((searchData) => !!searchData.loading).toProperty(true);
        this.error = this._searchData.map((searchData) => !!searchData.error).toProperty(false);

        // suggestions
        this.suggestions = new Bacon.Bus();

        this.suggestions.plug(this._searchData.combine(this.searchTerm, (searchData, searchTerm) => {
            if(searchData.loading || searchData.error) {
                return [];
            } else {
                return searchData.lunrIndex.search(searchTerm).slice(0,5).map((res) => ({
                  ref: res.ref,
                  link: searchData.pages[res.ref].link,
                  title: searchData.pages[res.ref].title,
                  tags: searchData.pages[res.ref].tags,
                }));
            }
        }));

        this.suggestions = this.suggestions.toProperty([]);

        // bind methods
        this.setSearchTerm = this.setSearchTerm.bind(this);
        this.setSelectedSuggestion = this.setSelectedSuggestion.bind(this);
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
        }).toProperty({
            error: false,
            loading: true,
        });
    }
}
