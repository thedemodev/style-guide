import React from 'react';
import { createBaconComponent } from 'react-bacon-component';

import Suggestion from './Suggestion';

import SearchModel from './SearchModel';

class Search extends React.Component {
    render() {
        return (
            <div class="search search--header" >
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
                    <Suggestion title={suggestion.title} href={this.props.baseUrl + suggestion.link} tags={suggestion.tags} />
                )
            });
        }

        return null;
    }

    _renderError() {
        if(this.props.error) {
            return (
                <div class="docs-search__error" >An error occurred :(</div>
            )
        }

        return null;
    }

    _renderLoading() {
        if(this.props.loading) {
            return (
                '<div class="docs-search__loading" >Loading...</div>'
            )
        }

        return null;
    }
}

Search.propTypes = {
    loading: React.PropTypes.bool,
    error: React.PropTypes.obj,
    suggestions: React.PropTypes.array,
    selectedSuggestion: React.PropTypes.obj,
    setSearchTerm: React.PropTypes.func.isRequired,
};

var SearchCombinator = createBaconComponent((propsP, contextP) => {
    return propsP.map((props) => {
        return new SearchModel(props.searchDataUrl).toProperty();
    });
}, Search);

SearchCombinator.propTypes = {
    searchDataUrl: React.PropTypes.string.isRequired,
};

export default SearchCombinator;
