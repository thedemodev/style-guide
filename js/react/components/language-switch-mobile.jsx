import React, { PropTypes } from 'react'
import classNames from 'classnames'

const LanguageSwitchMobile = ({
  current,
  languages,
  onLanguageSelect,
}) => (
  <ul className="mobile-languages">
    {languages.map((lang) => (
      <li className="mobile-languages__items" key={lang}>
        <a
          className={classNames('mobile-languages__items', { 'is-active': lang === current })}
          onClick={() => onLanguageSelect(lang)}>
          {lang}
        </a>
      </li>
    ))}
  </ul>
)

LanguageSwitchMobile.propTypes = {
  current: PropTypes.string,
  languages: PropTypes.array,
  onLanguageSelect: PropTypes.func,
}

export default LanguageSwitchMobile
