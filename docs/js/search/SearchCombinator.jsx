import React from 'react';
import { createBaconComponent } from 'react-bacon-component';
import Bacon from 'baconjs';

import Search from './Search';
import SearchModel from './SearchModel';

var SearchCombinator = createBaconComponent(SearchModel.combinator, Search);

SearchCombinator.propTypes = {
    searchDataUrl: React.PropTypes.string.isRequired,
};

export default SearchCombinator;
