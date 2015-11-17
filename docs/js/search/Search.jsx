import React from 'react';
import { createBaconComponent } from 'react-bacon-component';
import Bacon from 'baconjs';

import Suggestion from './Suggestion';

import SearchModel from './SearchModel';

class Search extends React.Component {

    render() {
        return (
            <div className="search search--header" >
                <input type="text" defaultValue={this.props.searchTerm} onChange={this._onSearchTermChange.bind(this)} />
                <div className="autocomplete__suggestions" >
                    {this._renderError()}
                    {this._renderLoading()}
                    {this._renderSuggestions()}
                </div>
            </div>
        )
    }

    _onSearchTermChange(e) {
        this.props.setSearchTerm(e.target.value);
    }

    _renderSuggestions() {
        if(this.props.suggestions) {
            return this.props.suggestions.map((suggestion) => {
                return (
                    <Suggestion key={suggestion.ref} title={suggestion.title} href={this.props.baseUrl + suggestion.link} tags={suggestion.tags} />
                )
            });
        }

        return null;
    }

    _renderError() {
        if(this.props.error) {
            return (
                <div className="docs-search__error" >An error occurred :(</div>
            )
        }

        return null;
    }

    _renderLoading() {
        if(this.props.loading) {
            return (
                <div className="docs-search__loading" >Loading...</div>
            )
        }

        return null;
    }
}

Search.propTypes = {
    loading: React.PropTypes.bool,
    error: React.PropTypes.oneOfType([
      React.PropTypes.object,
      React.PropTypes.bool,
    ]),
    suggestions: React.PropTypes.array,
    selectedSuggestion: React.PropTypes.object,
    setSearchTerm: React.PropTypes.func.isRequired,
};

var SearchCombinator = createBaconComponent((propsP, contextP) => {
  var model = new SearchModel(propsP);

  var prop = Bacon.combineTemplate({
      loading: model.loading,
      error: model.error,
      suggestions: model.suggestions,
      //selectedSuggestion: model.selectedSuggestion,
      setSearchTerm: model.setSearchTerm,
      baseUrl: model.baseUrl,
  }).toProperty();

  return prop;
}, Search);

SearchCombinator.propTypes = {
    searchDataUrl: React.PropTypes.string.isRequired,
};

export default SearchCombinator;
