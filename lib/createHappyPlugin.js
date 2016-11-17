import os from 'os'
import HappyPack from 'happypack'

const threadPool = HappyPack.ThreadPool({ size: Math.ceil(os.cpus().length / 2) })
const env = process.env
const tempDir = `.happypack/${env.NODE_ENV}`

const createHappyPlugin = (id, loaders) => new HappyPack({
  id,
  tempDir,
  loaders,
  threadPool,

  // disable happy caching with HAPPY_CACHE=0
  cache: env.HAPPY_CACHE !== '0',

  // make happy more verbose with HAPPY_VERBOSE=1
  verbose: env.HAPPY_VERBOSE === '1',
})

export default createHappyPlugin
