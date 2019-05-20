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


/*

Crawler
{
    url: 'http...',
    concurrency: 2
}


Screenshot
{
    environments: { live: '', test: '' },
    path: folder
    concurrency: 2,
    type: 'jpeg' | 'png',
    quality: 80,
    fullPage: true|false,
    clip: {
        x: 0,
        y: 0,
        width: 1000,
        height: 1000
    },
    omitBackground: false
}

Comparison
{
    path: folder,
    verbose: false,
    thresholdType: 'pixel' / 'percent',
    threshold: 0.2, // 20%
    delta: 20,

    mask: {
        r: 255,
        g: 255'
        b: 255,
        a: 255,
        o: 0.7
    },

    shift: {
        r: 255,
        g: 255'
        b: 255,
        a: 255,
        o: 0.7
    }

    background: {
        r: 255,
        g: 255'
        b: 255,
        a: 255,
        o: 0.7
    }

    filter: 'blur',
    composition: true,
    composeLeftToRight: true,
    composeTopToBottom: false,
    perceptual: false
    gamma: {
        r: 255,
        g: 255'
        b: 255
    }
}

*/

try {
    (async () => {

        const crawler = spider.createWeb({
            url: live,
            concurrency: 2
        })

        const screenshot = await camera.createImage({
            environments: { live, test },
            directory: folder
        })

        const comparison = compare.createComparison({
            path: folder
        })

        crawler.pipe(screenshot).pipe(comparison)
    })()
} catch(error) {
    log.error(error)
}
