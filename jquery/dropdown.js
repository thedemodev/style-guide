import $ from 'jquery'

class Dropdown {
  constructor(element) {
    this.$element = $(element)

    this.$label = this.$element.find('[data-dropdown-label]')
    this.$text = this.$element.find('[data-dropdown-text]')
    this.$select = this.$element.find('[data-dropdown-select]')

    this.options = [];

    this.init()
  }

  init() {

    var that = this

    //this.$element.attr('tabindex', '0')
    //this.$select.attr('tabindex', '-1')

    this.$element.addClass('is-enhanced')
    this.$label.addClass('is-enhanced')
    this.$text.addClass('is-enhanced')
    this.$select.addClass('is-enhanced')

    // Add extra html for material inspired selects:

    let $dl = $('<dl />').appendTo(this.$element)

    this.$select.find('option').each( function(){

      let $item = $(this)
      let $dt = $('<dt />').html($item.html()).appendTo($dl)

      setTimeout(function(){
        $dt.on('click', function(event){

          if (event.stopPropagation) {
            event.stopPropagation()
          } else {
            event.cancelBubble = true
          }

          that.$element.find('input').val($item.val())
          that.$text.text($item.text())

          $dl.css('display', 'none')
          
        })
      }, 10)

    })

    let $input = $('<input />')
      .val(this.$select.val())
      .attr('name', this.$select.attr('name'))
      .attr('type', 'hidden')

    this.$select.replaceWith($input);

    // Add the main events:

    //this.$element.on('keydown', (e) => this.handleKeyDown(e))

    setTimeout(function(){
      that.$element.on('click', function(){
        $dl.css('display', 'block')
      })
    }, 10)

  }

  handleKeyDown(e) {
    if (e.which == 32) {
      this.$select.focus()
    }
  }

}

function Plugin() {
  let params = arguments

  return this.each(function () {
    let $this = $(this)
    let data = $this.data('axa.dropdown')

    if (!data) {
      data = new Dropdown(this)
      $this.data('axa.dropdown', data)
    }
  })
}

$.fn.dropdown = Plugin
$.fn.dropdown.Constructor = Dropdown

$(function () {
  $('[data-dropdown]').each(function () {
    let $dropdown = $(this)
    Plugin.call($dropdown)
  })
})

// Copyright AXA Versicherungen AG 2015
