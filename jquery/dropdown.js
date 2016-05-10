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

    this.$element.addClass('is-enhanced').addClass('is-closed').attr('tabindex', 0)
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

        let $dt = $('<dt />').html($item.html()).attr('data-value', $item.val()).appendTo(that.$dl)

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

    setTimeout(function(){

      that.$element.on('keydown', (e) => that.handleKeys(e))

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

  handleKeys(e) {
    
    if (e.which == 40) { // Down arrow

      if (this.$element.hasClass('is-closed')){

        this.showOptions()

        this.$dl
          .children('dt')
          .removeClass('is-selected')
          .first()
          .addClass('is-selected')

      } else {

        this.$dl
          .children('dt.is-selected')
          .removeClass('is-selected')
          .next().addClass('is-selected')

        if (this.$dl.find('dt.is-selected').length == 0) {
          this.$dl.children('dt').last().addClass('is-selected')
        }

      }

    }

    if (e.which == 38) { // Up arrow

      this.$dl
        .children('dt.is-selected')
        .removeClass('is-selected')
        .prev().addClass('is-selected')

      if (this.$dl.find('dt.is-selected').length == 0) {
        this.$dl.children('dt').first().addClass('is-selected')
      }

    }

    if (e.which == 13) { // Enter key

      if (this.$dl.find('dt.is-selected').length > 0) {
        this.$element.find('input').val(this.$dl.find('dt.is-selected').attr('data-value'))
        this.$text.text(this.$dl.find('dt.is-selected').text())
        this.hideOptions()
      }

    }

    if (e.which == 27) { // Esc key
      this.hideOptions()
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
