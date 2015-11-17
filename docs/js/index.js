import $ from 'jquery'

import searchDataApi from './search/searchDataApi'

require('../..')
require('./cheat')
require('./example')
require('./iframe-resizer')
require('./left-navigation')
require('./octocat')
require('./tab')

import moment from 'moment'

searchDataApi()

moment.locale('en_GB')

$('#showNotification').on('click', function () {
  let content = $('#notification_content').val()
  let modifier = $('[name="notification__modifier"]:checked').val()
  let isHtml = $('#notification_html').is(':checked')

  $('#notification').notification({
    content: content,
    modifier: modifier,
    html: isHtml
  })
})
