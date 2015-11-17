import React, { Component } from 'react';

import Suggestion from './Suggestion';

const KEY_ENTER = 13
const KEY_UP = 38
const KEY_DOWN = 40

export default class Search extends Component {

    render() {
        return (
            <div className="search search--header autocomplete" >
                <input
                  className="autocomplete__input search__input search--header"
                  type="text"
                  defaultValue={this.props.searchTerm}
                  onChange={this._onSearchTermChange.bind(this)}
                  onKeyUp={this._onSearchInputKeyUp.bind(this)}
                   />
                <div className="autocomplete__suggestions" >
                    {this._renderError()}
                    {this._renderLoading()}
                    {this._renderSuggestions()}
                </div>
            </div>
        )
    }

    _onSearchInputKeyUp(e) {
      switch(e.which) {
        case KEY_UP:
          this._selectPrevSuggestion();
          break;
        case KEY_DOWN:
          this._selectNextSuggestion();
          break;
        case KEY_ENTER:
          this._openCurrentOrFirstSuggestion();
          break;
      }
    }

    _getCurrentSuggestion() {
      return this.props.suggestions.find((suggestion) => {
        return suggestion.ref == this.props.selectedSuggestion;
      })
    }

    _selectPrevSuggestion() {
      let current = this._getCurrentSuggestion();

      let prev = null;

      if (current) {
        let index = this.props.suggestions.indexOf(current);

        if(index != 0) {
          prev = this.props.suggestions[index-1];
        }

      }

      if (!prev) {
        prev = this.props.suggestions[this.props.suggestions.length - 1];
      }

      if (prev) {
        this.props.setSelectedSuggestion(prev.ref);
      }

    }

    _selectNextSuggestion() {
      let current = this._getCurrentSuggestion();

      let next = null;

      if (current) {
        let index = this.props.suggestions.indexOf(current);

        if(index+1 < this.props.suggestions.length) {
          next = this.props.suggestions[index+1];
        }

      }

      if (!next) {
        next = this.props.suggestions[0];
      }

      if (next) {
        this.props.setSelectedSuggestion(next.ref);
      }

    }

    _openCurrentOrFirstSuggestion() {
      let toOpen = this._getCurrentSuggestion();

      if(!toOpen) {
        toOpen = this.props.suggestions[0];
      }

      if(toOpen) {
        window.location.href = toOpen.link;
      }
    }

    _onSearchTermChange(e) {
        this.props.setSearchTerm(e.target.value);
    }

    _renderSuggestions() {
        if(this.props.suggestions) {
            return this.props.suggestions.map((suggestion) => {
                let isSelected = suggestion.ref == this.props.selectedSuggestion;

                return (
                    <Suggestion
                      key={suggestion.ref}
                      isSelected={isSelected}
                      title={suggestion.title}
                      href={this.props.baseUrl + suggestion.link}
                      tags={suggestion.tags}
                      onMouseOver={this._onSuggestionMouseOver.bind(this, suggestion)}
                      />
                )
            });
        }

        return null;
    }

    _onSuggestionMouseOver(suggestion) {
      this.props.setSelectedSuggestion(suggestion.ref);
    }

    _renderError() {
        if(this.props.searchTerm && this.props.error) {
            return (
                <div className="docs-search__error" >An error occurred :(</div>
            )
        }

        return null;
    }

    _renderLoading() {
        if(this.props.searchTerm && this.props.loading) {
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
    selectedSuggestion: React.PropTypes.string,
    setSelectedSuggestion: React.PropTypes.func.isRequired,
    setSearchTerm: React.PropTypes.func.isRequired,
};
