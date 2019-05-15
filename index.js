'use strict'

const spider = require('./src/spider')
const camera = require('./src/camera')
// const compare = require('./src/compare')

const crawler = spider.createWeb('http://indigotree.co.uk')

const screenshot = camera.createImage({
    environments: {
        live: 'https://indigotree.co.uk',
        master: 'https://test.indigotree.co.uk'
    },
    path: path.join(process.cwd(), 'screenshots')
})

// const comparison = compare.createComparison() TODO
// crawler.pipe(screenshot).pipe(comparison)

crawler.pipe(screenshot).pipe(process.stdout)