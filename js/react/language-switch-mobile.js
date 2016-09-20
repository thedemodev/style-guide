/* global window */

import $ from 'jquery'
import React from 'react'
import ReactDOM from 'react-dom'
import LanguageSwitchMobile from './components/language-switch-mobile'

$(() => {
  $('[data-language-switch-mobile]').each(function initLanguageSwitchMobile() {
    const $element = $(this)

    ReactDOM.render(
      <LanguageSwitchMobile
        current={$element.data('current')}
        languages={['de', 'en', 'fr', 'it']}
        onLanguageSelect={(lang) => {
          window.location.href = $element.data(`link-${lang}`)
        }} />,
      this
    )
  })
})
