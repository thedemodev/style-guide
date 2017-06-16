require('babel-register')
var postcss = require('postcss')
var autoprefixer = require('autoprefixer')
var cssmqpacker = require('css-mqpacker')
var csswring = require('csswring')
var pseudoelements = require('postcss-pseudoelements')
var fixIeTargetOrder = require('../lib/postcss-fix-ie-target-order').default

var processor = postcss([
  pseudoelements,
  autoprefixer,
  cssmqpacker({ sort: true }),
  fixIeTargetOrder(),
  csswring,
])

module.exports = function (source) {
  return processor.process(source)
}
