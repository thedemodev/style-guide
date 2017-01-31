import _ from 'lodash'

const navigation = () =>
  (files, metalsmith, done) => {
    let error

    setImmediate(() => done(error))

    const metadata = metalsmith.metadata()

    _.forEach(files, (page) => {
      page.isActive = (test) => {
        const check = (p) => {
          if (p === test) {
            return true
          }
          if (p.parent) {
            return check(p.parent)
          }
          return false
        }
        return check(page)
      }
    })

    const decorate = (pages, hierarchy = []) => {
      if (Array.isArray(pages) || typeof pages === 'object') {
        _.forEach(pages, (page) => {
          const h = hierarchy.slice()
          h.push(page)

          page.section = h[0]

          decorate(
            page.children,
            (page.children ? h : undefined),
          )
        })
      } else if (pages) {
        throw new PagesTypeException(pages)
      }
    }

    try {
      decorate(metadata.navigation)
    } catch (err) {
      error = err
    }
  }

function PagesTypeException(value) {
  this.name = 'PagesTypeException'
  this.value = value
  this.message = `Type of ${value} [${typeof value}] isn't iterable.`
}

export default navigation
