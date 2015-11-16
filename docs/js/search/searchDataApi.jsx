import ReactDOM from 'react-dom';
import Search from './Search';

export default function searchDataApi() {
    for(element of document.querySelectorAll('[data-search]')) {
        let searchDataUrl = element.getAttribute('data-search-index-data');
        let baseUrl = element.getAttribute('data-search-base-url');

        ReactDOM.render(<Search searchDataUrl={searchDataUrl} baseUrl={baseUrl} />, element);
    }
};

