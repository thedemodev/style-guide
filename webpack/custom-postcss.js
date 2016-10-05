var postcss = require('postcss')
var autoprefixer = require('autoprefixer')
var cssmqpacker = require('css-mqpacker')
var csswring = require('csswring')
var pseudoelements = require('postcss-pseudoelements')

var processor = postcss([
  pseudoelements,
  autoprefixer,
  cssmqpacker({ sort: true }),
  csswring,
])

module.exports = function (source) {
  return processor.process(source)
}
