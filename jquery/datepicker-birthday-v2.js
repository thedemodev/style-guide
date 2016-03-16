import $ from 'jquery'

class BirthdayDatepickerV2 {
  constructor(element, options) {

    this.$element = $(element)

    this.defaults = {
      "maxAge"        : 120,
      "minAge"        : 18
    };

    this.$day = $(element).find('.birthday--day')
    this.$month = $(element).find('.birthday--month')
    this.$year = $(element).find('.birthday--year')
    this.$input = $(element).find('.control--birthday')

    this.options = $.extend({}, this.defaults, options)

    this.day = ''
    this.month = ''
    this.year = ''

    this.init()

  }

  init() {

    this.$day.on('keyup', (e) => this.handleChange(e, 'day') )
    this.$month.on('keyup', (e) => this.handleChange(e, 'month') )
    this.$year.on('keyup', (e) => this.handleChange(e, 'year') )

  }

  handleChange(e, type) {

    var currentYear = new Date().getFullYear()

    this.day = this.$day.val().trim().replace(/\D/g,'')
    this.month = this.$month.val().trim().replace(/\D/g,'')
    this.year = this.$year.val().trim().replace(/\D/g,'')

    if (e.keyCode == 8) {
      if (type == 'month' && this.month.length == 0) this.$day.focus()
      if (type == 'year' && this.year.length == 0) this.$month.focus()
    }

    if (this.day !== '' && this.day > 31) this.day = '';
    if (this.day !== '' && this.day < 0) this.day = '';

    if (this.month !== '' && this.month > 12) this.month = '';
    if (this.month !== '' && this.month < 0) this.month = '';

    if (this.year.length == 4 && this.year > currentYear - this.options.minAge) this.year = '';
    if (this.year.length == 4 && this.year < currentYear - this.options.maxAge) this.year = '';

    this.$day.val(this.day)
    this.$month.val(this.month)
    this.$year.val(this.year)

    if (type == 'day' && this.day.length == 2) this.$month.focus()
    if (type == 'month' && this.month.length == 2) this.$year.focus()

    if (this.day !== '' && this.month !== '' && this.year !== ''){
      this.$input.val(`${this.year}-${this.addLeadingZero(this.month)}-${this.addLeadingZero(this.day)}`)
    }

  }

  daysInMonth(month, year) {
    return new Date(year, month, 0).getDate()
  }

  addLeadingZero(num) {
    if (num < 10) num = '0' + num;
    return num;
  }

}

let Plugin = function (options) {
  let params = arguments

  return this.each(function () {
    let $this = $(this)
    let data = $this.data('axa.datepicker-birthday-v2')

    if (!data) {
      data = new BirthdayDatepickerV2(this, options)
      $this.data('axa.datepicker-birthday-v2', data)
    }
  })
}

$.fn.birthdayDatepickerV2 = Plugin
$.fn.birthdayDatepickerV2.Constructor = BirthdayDatepickerV2

$(function () {
  $('[data-datepicker-birthday-v2]').each(function () {
    let $birthdayDatepickerV2 = $(this)
    let data = $birthdayDatepickerV2.data()
    Plugin.call($birthdayDatepickerV2, data)
  })
})

// Copyright AXA Versicherungen AG 2015