'use strict'

const path = require('path')

const spider = require('./spider')
const camera = require('./camera')
// const compare = require('./src/compare')

const log = require('simple-node-logger').createSimpleFileLogger('project.log')

const live = 'https://www.beausynergy.co.uk/'
const test = 'http://beausynergy01.wpengine.com/'


try {
    (async () => {

        const crawler = spider.createWeb(live)

        const screenshot = await camera.createImage({
            environments: { live, test },
            path: path.join(process.cwd(), 'screenshots')
        })


        crawler.pipe(screenshot)
        // crawler.pipe(process.stdout)

    })()
} catch(error) {
    log.error(error)
}




// const comparison = compare.createComparison() TODO
// crawler.pipe(screenshot).pipe(comparison)



// crawler.on('data', (chunk) => {
//     console.log(chunk.toString());
// })