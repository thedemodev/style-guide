import $ from 'jquery'

class Dropdown {
  constructor(element) {
    this.$element = $(element)

    this.$label = this.$element.find('[data-dropdown-label]')
    this.$text = this.$element.find('[data-dropdown-text]')
    this.$select = this.$element.find('[data-dropdown-select]')
    this.$dl = $

    this.options = [];

    this.init()
  }

  init() {

    var that = this

    //this.$element.attr('tabindex', '0')
    //this.$select.attr('tabindex', '-1')

    this.$element.addClass('is-enhanced').addClass('is-closed')
    this.$label.addClass('is-enhanced')
    this.$text.addClass('is-enhanced')
    this.$select.addClass('is-enhanced')

    // Add extra html for material inspired selects:

    this.$dl = $('<dl />').appendTo(this.$element)

    this.$select.find('option').each( function(){

      let $item = $(this)

      if ($item.val() == '') {

        if (that.$select.val() == ''){
          that.$text.text($item.text())
        }

      } else {

        if ($item.is(':selected')){
          that.$text.text($item.text())
        }

        let $dt = $('<dt />').html($item.html()).appendTo(that.$dl)

        setTimeout(function(){
          $dt.on('click', function(event){

            that.stopPropagation(event)

            that.$element.find('input').val($item.val())
            that.$text.text($item.text())

            that.hideOptions()
            
          })
        }, 10)

      }

    })

    // Replace the select with a hidden input:

    let $input = $('<input />')
      .val(this.$select.val())
      .attr('name', this.$select.attr('name'))
      .attr('type', 'hidden')

    this.$select.replaceWith($input);

    // Add the main events:

    //this.$element.on('keydown', (e) => this.handleKeyDown(e))

    setTimeout(function(){
      that.$element.on('click', function(event){

        that.stopPropagation(event)
        that.showOptions()

        // Bind click handler to body so we can manage outside clicks:

        $('body').on('click', function(){
          $(this).off('click')
          that.hideOptions()
        })

      })
    }, 10)

  }

  showOptions() {
    this.$dl.css('display', 'block')
    this.$element.removeClass('is-closed').addClass('is-open')
  }

  hideOptions() {
    this.$dl.css('display', 'none')
    this.$element.removeClass('is-open').addClass('is-closed')
  }

  handleKeyDown(e) {
    if (e.which == 32) {
      this.$select.focus()
    }
  }

  stopPropagation(e) {
    if (e.stopPropagation) {
      e.stopPropagation()
    } else {
      e.cancelBubble = true
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
