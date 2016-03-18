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

    // Handle arrow navigation:

    if (e.keyCode == 37 || e.keyCode == 39) {

      if (e.keyCode == 37 && this.cursorPosition(this.$month) == 0) {
        this.$day.focus()
        return
      }
      if (e.keyCode == 37 && this.cursorPosition(this.$year) == 0) {
        this.$month.focus()
        return
      }
      if (e.keyCode == 39 && this.cursorPosition(this.$month) == 2) {
        this.$year.focus()
        return
      }
      if (e.keyCode == 39 && this.cursorPosition(this.$day) == 2) {
        this.$month.focus()
      }
      return
    }

    // Trim values (only digits are allowed):

    this.day = this.$day.val().replace(/\D/g,'')
    this.month = this.$month.val().replace(/\D/g,'')
    this.year = this.$year.val().replace(/\D/g,'')

    // Handle backspace (removing characters):

    if (e.keyCode == 8) {
      if (type == 'month' && this.month.length == 0) this.$day.focus()
      if (type == 'year' && this.year.length == 0) this.$month.focus()
    }

    // Limit possible numbers to valid ones:

    if (this.day !== '' && this.day > 31) this.day = '';
    if (this.day !== '' && this.day < 0) this.day = '';

    if (this.month !== '' && this.month > 12) this.month = '';
    if (this.month !== '' && this.month < 0) this.month = '';

    if (this.year.length == 4 && this.year > currentYear - this.options.minAge) this.year = '';
    if (this.year.length == 4 && this.year < currentYear - this.options.maxAge) this.year = '';

    // Add the new values to the global variables:

    this.$day.val(this.day)
    this.$month.val(this.month)
    this.$year.val(this.year)

    // Jump automatically to the next field if enough numbers were filled in:

    if (type == 'day' && this.day.length == 2) this.$month.focus()
    if (type == 'month' && this.month.length == 2) this.$year.focus()

    // Craete full date string in hidden field:

    if (this.day !== '' && this.month !== '' && this.year !== ''){
      this.$input.val(`${this.year}-${this.addLeadingZero(this.month)}-${this.addLeadingZero(this.day)}`)
    }

    // As soon as we have year and month, check if day value is possible:

    if (this.month.length == 2 && this.year.length == 4 && this.daysInMonth(this.month, this.year) < this.day) {
      this.day = '';
      this.$day.val('').focus()
    }

  }

  cursorPosition(el) {
    var input = el.get(0);
    if (!input) return; // No (input) element found
    if ('selectionStart' in input) {
      // Standard-compliant browsers
      return input.selectionStart;
    } else if (document.selection) {
      // IE
      input.focus();
      var sel = document.selection.createRange();
      var selLen = document.selection.createRange().text.length;
      sel.moveStart('character', -input.value.length);
      return sel.text.length - selLen;
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
