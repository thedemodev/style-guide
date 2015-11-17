import React from 'react';
import ReactDOM from 'react-dom';
import Search from './Search';

export default function searchDataApi() {
    var elements = document.querySelectorAll('[data-search]');

    for(let i = 0; i < elements.length; i++) {
        let element = elements[i];

        let searchDataUrl = element.getAttribute('data-search-index-data');
        let baseUrl = element.getAttribute('data-search-base-url');

        ReactDOM.render(<Search searchDataUrl={searchDataUrl} baseUrl={baseUrl} />, element);
    }
};
