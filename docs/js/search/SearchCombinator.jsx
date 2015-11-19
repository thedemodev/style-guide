import React from 'react';
import { createBaconComponent } from 'react-bacon-component';
import Bacon from 'baconjs';

import Search from './Search';
import SearchModel from './SearchModel';

var SearchCombinator = createBaconComponent(SearchModel.combinator, Search, true);

SearchCombinator.propTypes = {
    searchDataUrl: React.PropTypes.string.isRequired,
    baseUrl: React.PropTypes.string.isRequired,
    icon: React.PropTypes.string.isRequired,
};

export default SearchCombinator;
