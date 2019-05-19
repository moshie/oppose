'use strict'

const spider = require('./spider')
const camera = require('./camera')
const compare = require('./compare')

const log = require('simple-node-logger').createSimpleFileLogger('project.log')

const live = 'https://www.beausynergy.co.uk/'
const test = 'http://beausynergy01.wpengine.com/'

/*

TODO:

- Options for the capture / puppeteer
- Options for Crawler
- Compare Stream
- Use async / await
- Tests
- Performance improvements
- add debug logging
- Handle errors better than just logging
- Documentation
- CLI Wrapper
- 
*/

const { Readable } = require('stream')
const fs = require('fs')
const path = require('path')

const filesStream = new Readable({

    objectMode: true,

    read() {
        const stream = this
        const p = path.join(process.cwd(), 'screenshots', 'live')

        fs.readdir(p, function (err, f) {
            if (err) {
                return log.error(err)
            }

            f.forEach(file => {
                if (file === '.' || file === '..') {
                    return true
                }
                stream.push({
                    live: path.join(process.cwd(), 'screenshots', 'live', file),
                    test: path.join(process.cwd(), 'screenshots', 'test', file)
                })
            })

            stream.push(null)

        })
    }

})







try {
    (async () => {

        // const crawler = spider.createWeb(live)

        // const screenshot = await camera.createImage({
        //     environments: { live, test },
        //     path: path.join(process.cwd(), 'screenshots')
        // })

        const comparison = await compare.createComparison({
            path: path.join(process.cwd(), 'screenshots')
        })


        // crawler.pipe(screenshot).pipe(comparison)

        filesStream.pipe(comparison)


    })()
} catch(error) {
    log.error(error)
}
