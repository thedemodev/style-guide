import React from 'react';
import { createBaconComponent } from 'react-bacon-component';
import Bacon from 'baconjs';

import Search from './Search';
import SearchModel from './SearchModel';

var SearchCombinator = createBaconComponent((propsP, contextP) => {
  var model = new SearchModel(propsP);

  var prop = Bacon.combineTemplate({
      loading: model.loading,
      error: model.error,
      suggestions: model.suggestions,
      selectedSuggestion: model.selectedSuggestion,
      setSearchTerm: model.setSearchTerm,
      setSelectedSuggestion: model.setSelectedSuggestion,
      baseUrl: model.baseUrl,
  }).toProperty();

  return prop;
}, Search);

SearchCombinator.propTypes = {
    searchDataUrl: React.PropTypes.string.isRequired,
};

export default SearchCombinator;
