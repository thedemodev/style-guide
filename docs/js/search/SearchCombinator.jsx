import {PropTypes} from 'react';
import {createBaconComponent} from 'react-bacon-component';
import Bacon from 'baconjs';

import Search from './Search';
import SearchModel from './SearchModel';

let SearchCombinator = createBaconComponent(SearchModel.combinator, Search, true);

SearchCombinator.propTypes = {
  searchDataUrl: PropTypes.string.isRequired,
  baseUrl: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired
};

export default SearchCombinator;
