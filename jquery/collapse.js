(function ($, Bacon) {
  class Collapse {
    constructor(element, options) {
      this.$element = $(element)
      this.$triggers = this.$element.find('[data-trigger]')
      this.$panels = this.$element.find('[data-panel]')
      this.options = $.extend({}, { single: false, open: '' }, options)
      this.options.open = this.options.open.split(' ')
      this.init()
    }

    init() {
      let clicks = this.$triggers
        .asEventStream('click')
        .doAction('.preventDefault')
        .map((event) => this.mapEventToCommand(event))

      this.commands = new Bacon.Bus()
      this.commands.plug(clicks)

      this.opened = this.commands
        .scan(this.options.open, (opened, command) => this.scanCommands(opened, command))

      this.opened.onValue((opened) => this.toggleTriggers(opened))
      this.opened.onValue((opened) => this.togglePanels(opened))
    }

    mapEventToCommand(event) {
      let $e = $(event.target)

      return {
        type: $e.hasClass('is-active') ? 'close' : 'open',
        target: $e.data('trigger')
      }
    }

    scanCommands(opened, command) {
      if (command.type === 'close') {
        opened = opened.filter((target) => target !== command.target)
      }

      if (command.type === 'open') {
        if (this.options.single) opened = [command.target]
        if (opened.indexOf(command.target) < 0) opened.push(command.target)
      }

      return opened
    }

    toggleTriggers(opened) {
      this.$triggers.each((i, e) => {
        let $e = $(e)
        let name = $e.data('trigger')
        e.classList.toggle('is-active', opened.indexOf(name) > -1)
      })
    }

    togglePanels(opened) {
      this.$panels.each((i, e) => {
        let $e = $(e)
        let name = $e.data('panel')
        e.classList.toggle('is-open', opened.indexOf(name) > -1)
      })
    }
  }

  let Plugin = function (options) {
    let params = arguments

    return this.each(function () {
      let $this = $(this)
      let data = $this.data('aem.collapse')

      if (!data) {
        data = new Collapse(this, options)
        $this.data('aem.collapse', data)
      }
    })
  }

  $.fn.collapse = Plugin
  $.fn.collapse.Constructor = Collapse

  $(window).on('load', function () {
    $('[data-collapse]').each(function () {
      let $collapse = $(this)
      let data = $collapse.data()
      Plugin.call($collapse, data)
    })
  })

})(jQuery, Bacon)

// Copyright AXA Versicherungen AG 2015
