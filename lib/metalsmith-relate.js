import minimatch from 'minimatch'
import _ from 'lodash'

const relate = () =>
  (files, metalsmith, done) => {
    setImmediate(done)

    _.forEach(files, (file, key) => {
      if (!file.children) {
        // console.log('no children: ' + key)
        return
      }

      const children = resolve(file.children, files)

      if (key.match(/(?:components|fundamentals|inspiration|patterns)\.html$/)) {
        const links = []
        _.forEach(children, (child) => {
          links.push(child.link)
        })
      }

      file.children = children

      _.forEach(children, child => {
        child.parent = file
      })
    })
  }

function resolve(pattern, files) {
  return _.chain(files)
    .filter((file, name) => minimatch(name, pattern))
    .sortBy('order')
    .value()
}

export default relate

