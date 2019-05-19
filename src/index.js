'use strict'

const spider = require('./spider')
const camera = require('./camera')
const compare = require('./compare')

const log = require('simple-node-logger').createSimpleFileLogger('project.log')
const path = require('path')


const live = 'https://www.beausynergy.co.uk/'
const test = 'http://beausynergy01.wpengine.com/'
const folder = path.join(process.cwd(), 'screenshots')
/*

TODO:

- Options for the capture / puppeteer
- Options for Crawler
- Options for blink diff
- Use async / await
- Tests
- Performance improvements
- add debug logging
- Handle errors better than just logging
- Documentation
- CLI Wrapper
- Emit event when a comparison fails
*/

try {
    (async () => {

        const crawler = spider.createWeb(live)

        const screenshot = await camera.createImage({
            environments: { live, test },
            path: folder
        })

        const comparison = compare.createComparison({
            path: folder
        })

        crawler.pipe(screenshot).pipe(comparison)
    })()
} catch(error) {
    log.error(error)
}
