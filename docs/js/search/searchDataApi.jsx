import React from 'react';
import ReactDOM from 'react-dom';
import SearchCombinator from './SearchCombinator';

export default function searchDataApi() {
  var elements = document.querySelectorAll('[data-search]');

  for (let i = 0; i < elements.length; i++) {
    let element = elements[i];

    let searchDataUrl = element.getAttribute('data-search-index-data');
    let baseUrl = element.getAttribute('data-search-base-url');
    let icon = element.getAttribute('data-search-icon');

    ReactDOM.render(
      <SearchCombinator searchDataUrl={searchDataUrl} baseUrl={baseUrl} icon={icon}/>, element);
  }
};
