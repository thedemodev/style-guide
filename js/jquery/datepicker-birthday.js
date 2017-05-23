import $ from 'jquery'
import registerPlugin from './register-plugin'

class BirthdayDatepicker {
  constructor(element, options) {
    this.$element = $(element)

    this.defaults = {
      maxAge: 120,
      minAge: 18,
    }

    this.$day = $(element).find('.birthday--day select')
    this.$month = $(element).find('.birthday--month select')
    this.$year = $(element).find('.birthday--year select')
    this.$input = $(element).find('input')

    this.day = ''
    this.month = ''
    this.year = ''

    this.options = $.extend({}, this.defaults, options)

    this.init()
  }

  init() {
    this.generateOptions()

    this.$day.on('change', () => this.handleChange('day'))
    this.$month.on('change', () => this.handleChange('month'))
    this.$year.on('change', () => this.handleChange('year'))
  }

  generateOptions() {
    // Days:
    // eslint-disable-next-line no-plusplus
    for (let x = 1; x <= 31; x++) {
      $('<option />').text(x).appendTo(this.$day)
    }

    // Years:
    const currentYear = new Date().getFullYear()

    for (let x = (currentYear - this.options.minAge); x >= (currentYear - this.options.minAge - this.options.maxAge); x--) {
      $('<option />').text(x).appendTo(this.$year)
    }
  }

  // eslint-disable-next-line class-methods-use-this
  daysInMonth(month, year) {
    // if year is unspecified expect leap year
    if (year === '' || year == null) {
      // eslint-disable-next-line no-param-reassign
      year = 4
    }
    return new Date(year, month, 0).getDate()
  }

  handleChange(type) {
    this.day = this.$day.val()
    this.month = this.$month.val()
    this.year = this.$year.val()

    if (this.day !== '' && this.month !== '' && this.year !== '') {
      this.$input.val(`${this.year}-${this.addLeadingZero(this.month)}-${this.addLeadingZero(this.day)}`)
    }

    if ((type === 'month' || type === 'year') && this.month !== '') {
      const days = this.daysInMonth(this.month, this.year)

      this.$day.html('')

      // eslint-disable-next-line no-plusplus
      for (let x = 1; x <= days; x++) {
        $('<option />').text(x).appendTo(this.$day)
      }

      this.day = Math.min(this.day, days)

      this.$day
        .val(this.day)
        .change() // important, in case select has no focus, change needs to be triggered manually
    }
  }

  // eslint-disable-next-line class-methods-use-this
  addLeadingZero(num) {
    return (num < 10) ? `0${num}` : num
  }

}

// Plugin definition
registerPlugin('datepicker-birthday', BirthdayDatepicker)

// Copyright AXA Versicherungen AG 2015
