/* global window, document */

import $ from 'jquery'
import moment from 'moment'
import registerPlugin from './register-plugin'
import isMobile from './is-mobile'

import Emitter from './emitter'

const append = (html, $parent) => {
  const $el = $(html)
  $parent.append($el)
  return $el
}


class Picker extends Emitter {
  DEFAULTS = {
    date: moment().startOf('day'),
    style: {
      current: 'picker__day--today',
      active: 'is-active',
      next: 'picker__day--next-month',
      prev: 'picker__day--prev-month'
    },
    format: {
      month: 'M-YYYY',
    },
    level: {
      1: 'day',
      2: 'month',
      3: 'year'
    },
    increment: {
      1: {months: 1},
      2: {years: 1},
      3: {years: 12}
    },
    startLevel: 3,
  };

  constructor(moment1, displayWeek, level, icons, longDateFormat) {
    super();
    this.moment = moment1;
    this.displayWeek = displayWeek;
    this.icons = icons;
    this.date = this.moment();
    this.format = this.moment.localeData().longDateFormat(longDateFormat)
    this.today = this.moment().startOf('day');
    this.currentLevel = level ? level : this.DEFAULTS.startLevel;
    this.startLevel = this.currentLevel;
    this.selectedDate = this.today.clone();
    this.weekdays = moment.weekdaysMin();

    this.picker = $(`<div class="picker ${this.displayWeek ? 'picker--with-weeknumber' : ''}">
                       <div class="picker__header" >         
                          <div class="picker__prev">
                            <div class="picker__icon--prev"></div>
                          </div>
                          <div class="picker__headline"></div>
                          <div class="picker__next">
                            <div class="picker__icon--next"></div>
                          </div>
                      </div>
                      <div class="picker__content"></div>
                    </div>`);

    this.header = this.picker.children('div.picker__header');
    this.prev = this.header.children('div.picker__prev');
    this.headline = this.header.children('div.picker__headline');
    this.next = this.header.children('div.picker__next');
    this.content = this.picker.children('div.picker__content');

    this.headline.on('click', this.switchLevel.bind(this));
    this.prev.on('click', this.onPrevClick.bind(this));
    this.next.on('click', this.onNextClick.bind(this));

    this.content.on('click', '[data-datepicker-year]', this.yearClicked.bind(this));
    this.content.on('click', '[data-datepicker-month]', this.monthClicked.bind(this));
    this.content.on('click', '[data-datepicker-day]', this.dayClicked.bind(this));


    this.emit('render');
    this.render(this.currentLevel);
  }

  dayClicked(event) {
    event.preventDefault();
    let date = this.moment($(event.target).data('datepicker-day'), this.format);
    this.setSelectedDate(date);
    this.emit('select', date.format(this.format));
    this.toggle();
  }

  monthClicked(event) {
    event.preventDefault();
    let date = this.moment($(event.target).data('datepicker-month'), this.DEFAULTS.format.month);
    this.date.month(date.month()).year(date.year());
    this.render(--this.currentLevel)
  }

  yearClicked(event) {
    event.preventDefault();
    this.date.year($(event.target).data('datepicker-year'));
    this.render(--this.currentLevel)
  }

  render(level) {
    this.currentLevel = level;

    console.log(level);
    switch (this.currentLevel) {
      case 1:
        this.renderDaysContent();
        break;
      case 2:
        this.renderMonthsContent();
        break;
      case 3:
        this.renderYearsContent();
        break;
      default:
        console.error('Level not supported');
    }
  }


  switchLevel() {
    this.render(Math.min(3, (this.currentLevel + 1)));
  }

  renderYearsContent() {

    const dateClone = this.moment(this.date);
    let year = dateClone.clone().year();
    const lastYear = year + 12;

    this.headline.text(`${year} - ${lastYear - 1}`);

    let content = '<div class="picker__years">';

    while (year < lastYear) {
      const classes = [];

      if (year === this.today.year()) {
        classes.push(this.DEFAULTS.style.current);
      }

      if (year === this.selectedDate.year()) {
        classes.push(this.DEFAULTS.style.active);
      }

      content += `<div data-datepicker-year="${year}" class="picker__year ${classes.join(' ')}"> ${year}</div>`;
      year++;
    }

    this.content.html(content += '</div>');
    this.emit('renderYearsContent');
  }

  renderMonthsContent() {

    const dateClone = this.moment(this.date);
    let month = dateClone.clone().startOf('y');
    const lastMonth = month.clone().add(12, 'M');
    this.headline.text(dateClone.format('YYYY'));

    let content = '<div class="picker__months">';

    while (month < lastMonth) {
      const classes = [];

      if (month.format(this.DEFAULTS.format.month) === this.today.format(this.DEFAULTS.format.month)) {
        classes.push(this.DEFAULTS.style.current);
      }

      if (month.format(this.DEFAULTS.format.month) === this.selectedDate.format(this.DEFAULTS.format.month)) {
        classes.push(this.DEFAULTS.style.active);
      }

      content += `<div data-datepicker-month="${month.format(this.DEFAULTS.format.month)}" class="picker__month ${classes.join(' ')}"> ${month.format('MMM')}</div>`;
      month.add(1, 'M');
    }

    this.content.html(content += '</div>');
    this.emit('renderMonthsContent');
  }


  renderDaysContent() {
    const dateClone = this.moment(this.date);
    let day = dateClone.clone().startOf('M').startOf('isoweek');
    const lastDay = day.clone().add(42, 'd');
    let content = `<div class="picker__days">
                    <div class="picker__day picker__day--headline">${this.weekdays[1]}</div>
                    <div class="picker__day picker__day--headline">${this.weekdays[2]}</div>
                    <div class="picker__day picker__day--headline">${this.weekdays[3]}</div>
                    <div class="picker__day picker__day--headline">${this.weekdays[4]}</div>
                    <div class="picker__day picker__day--headline">${this.weekdays[5]}</div>
                    <div class="picker__day picker__day--headline">${this.weekdays[6]}</div>
                    <div class="picker__day picker__day--headline">${this.weekdays[0]}</div>`;
    let isNext = false;
    this.headline.text(dateClone.format('MMMM YYYY'));


    while (day < lastDay) {
      const classes = [];

      if (day.format(this.format) === this.today.format(this.format)) {
        classes.push(this.DEFAULTS.style.current);
      }

      if (day.format(this.format) === this.selectedDate.format(this.format)) {
        classes.push(this.DEFAULTS.style.active);
      }

      if (day.month() != dateClone.month()) {
        classes.push(isNext ? this.DEFAULTS.style.next : this.DEFAULTS.style.prev);
      } else {
        isNext = true;
      }

      content += `<div data-datepicker-day="${day.format(this.format)}" class="picker__day ${classes.join(' ')}"> ${day.date()}</div>`;
      day.add(1, 'd');
    }

    this.content.html(content += '</div>');
    this.emit('renderDaysContent');
  }

  getDOMNode() {
    return this.picker
  }

  toggle() {
    this.picker.toggleClass('is-active')
  }

  setSelectedDate(selectedDate) {
    console.log(selectedDate);
    this.selectedDate = selectedDate;
    this.date = this.selectedDate.clone();
    this.render(this.startLevel);
  }

  onPrevClick(e) {
    e.preventDefault()
    this.date.subtract(this.DEFAULTS.increment[this.currentLevel]);
    this.render(this.currentLevel);
  }

  onNextClick(e) {
    e.preventDefault()
    this.date.add(this.DEFAULTS.increment[this.currentLevel]);
    this.render(this.currentLevel);
  }
}

class Datepicker {
  static DEFAULTS = {
    moment: moment,
    locale: document.documentElement.lang || 'en',
    longDateFormat: 'L'
  };


  constructor(element, options) {
    this.onChange = this.onChange.bind(this)
    this.onChangeMobileTrigger = this.onChangeMobileTrigger.bind(this)
    this.options = options;
    this.moment = options.moment
    this.setLocale(options.locale)
    this.format = this.moment.localeData().longDateFormat(options.longDateFormat)
    this.$element = $(element);

    if (!this.moment) {
      $.error('Moment.js must either be passed as an option or be available globally')
    }

    if (isMobile) {
      this.$input = $(options.input)

      this.$input.prop('type', 'date')
      this.$input.on('change', this.onChange)

      this.$triggerMobile = this.$element.find('.datepicker__trigger__mobile')
      this.$triggerMobile.val(this.$input.val())
      this.$triggerMobile.on('change', this.onChangeMobileTrigger)
    } else {
      this.picker = new Picker(this.moment, options.displayWeek, options.level, options.icons, options.longDateFormat)

      if (options.input != null) {
        this.$input = $(options.input)

        this.$input.on('change', this.onChange)

        this.onChange()
      }

      this.picker.on('select', (date) => {
        this.$input.val(date);
      });

      this.$element.append(this.picker.getDOMNode())
    }
  }

  onChange() {
    if (isMobile) {
      this.$triggerMobile.val(this.$input.val())
    } else {
      const dat = this.moment(this.$input.val(), this.format)

      if (dat.isValid()) {
        this.picker.setSelectedDate(dat)
      }
    }
  }

  onChangeMobileTrigger() {
    this.$input.val(this.$triggerMobile.val())
  }

  setLocale(locale) {
    this.moment.locale(locale)

    if (this.moment.locale() === locale) return

    const domain = document.domain
    const tld = domain.split('.').pop()
    const tldLocale = `${locale}-${tld}`

    this.moment.locale(tldLocale)

    if (this.moment.locale() === tldLocale) return

    const locales = this.moment.locales()

    locales.filter((loc) => !!~loc.indexOf(locale))
      .some((loc) => {
        this.moment.locale(loc)

        return this.moment.locale() !== loc
      })
  }

  toggle() {
    if (!isMobile) {
      this.picker.toggle()
    }
  }
}

// Plugin definition
registerPlugin('datepicker', Datepicker, (PluginWrapper) => {
  if (isMobile) {
    $('.datepicker__trigger').each(function () {
      $(this).append($('<input type="date" class="datepicker__trigger__mobile">'))
    })
  }

  $(document).on('click.axa.datepicker.data-api', '[data-datepicker]', function (e) {
    if (!isMobile) {
      e.preventDefault()
    }

    const data = $(this).data()
    const $target = $(data.datepicker)
    const $input = $($target.data('datepicker-watch'))
    let displayWeek = $target.data('datepicker-display-week');
    const level = $target.data('datepicker-level');
    const icons = {
      prev: $target.data('datepicker-icon-prev'),
      next: $target.data('datepicker-icon-next'),
    }

    displayWeek = displayWeek && displayWeek !== 'false'

    PluginWrapper.call($target, {
      ...data,
      input: $input,
      __action__: 'toggle',
      displayWeek,
      level,
      icons,
    })
  })
})

//! Copyright AXA Versicherungen AG 2015
