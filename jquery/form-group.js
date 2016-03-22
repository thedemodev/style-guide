import $ from 'jquery'

class FormGroup {

  constructor(element, options) {
    this.$element = $(element)

    this.defaults = {}

    this.options = $.extend({}, this.defaults, options)
    
    this.init()
  }

  init() {

    var that = this

    that.$element.find('.form__group__info').hide()

    this.$element.find('input, textarea')
      .on('focus', function(){
        that.$element.addClass('focused')
        that.$element.find('.form__group__info').slideDown('fast')
      })
      .on('blur', function(){
        that.$element.removeClass('focused')
        that.$element.find('.form__group__info').slideUp('fast')
      })

  }

}

function Plugin() {
  let params = arguments

  return this.each(function () {
    let $this = $(this)
    let data = $this.data('axa.form-group')

    if (!data) {
      data = new FormGroup(this)
      $this.data('axa.form-group', data)
    }

    let method = params[0]
    if (typeof(method) === 'string') {
      data[method](...params.slice(1))
    }
  })
}

$.fn.formGroup = Plugin
$.fn.formGroup.Constructor = FormGroup

$(function () {
  $('[data-form-group]').each(function () {
    let $formGroup = $(this)
    let data = $formGroup.data()
    Plugin.call($formGroup, data)
  })
})

// Copyright AXA Versicherungen AG 2015
