const cache = {}
const key = '__CACHE__CLOSURE__INDEX__'
let index = 0

export default function cacheClosure(func, ...args) {
  if (!(key in func)) {
    func[key] = index++
  }

  const cacheKey = func[key]

  if (!cache[cacheKey]) {
    cache[cacheKey] = function cachedClosure() {
      func.apply(this, args)
    }
  }

  return cache[cacheKey]
}

export function flush(func) {
  if (!(key in func)) return

  const cacheKey = func[key]

  if (cache[cacheKey]) {
    delete cache[cacheKey]

    if (cacheKey === index - 1) {
      --index
    }
  }
}
