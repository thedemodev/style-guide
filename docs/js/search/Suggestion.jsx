import React from 'react';
import classNames from 'classnames';

export default class Suggestion extends React.Component {
    render() {
        let classes = classNames('autocomplete__suggestions__item', {
            'autocomplete__suggestions__item--selected': this.props.isSelected,
        });

        return (
            <a href={this.props.href} className={classes} onMouseOver={this.props.onMouseOver}>
                {this.props.title}
                {this.props.tags ? (<span className="docs-search__tags">{this.props.tags}</span>) : null}
            </a>
        )
    }

}

Suggestion.propTypes = {
    title: React.PropTypes.string.isRequired,
    href: React.PropTypes.string.isRequired,
    isSelected: React.PropTypes.bool,
    tags: React.PropTypes.string,
    onMouseOver: React.PropTypes.func,
};
