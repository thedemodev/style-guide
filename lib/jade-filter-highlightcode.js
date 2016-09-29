import hljs from 'highlight.js'
import pug from 'pug'
import fm from 'front-matter'

const highlightCode = (text, options)  => {
  text = text.replace(/^\n/g, '')

  // console.log(text)
  // if (options.fm) {
  // }
  const relative = to => to

  // console.log(text) 
  // console.log(options)
  if (options.pug) {
    text = fm(text).body
    text = pug.render(text, {
      relative: relative,
      filename: options.filename,
    })
  }

  // console.log('-----------')
  // console.log('-----------')
  // console.log('-----------')

  return hljs.highlightAuto(text).value
}

export default highlightCode

//! Copyright AXA 2016
