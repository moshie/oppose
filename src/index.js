'use strict'

const path = require('path')

const spider = require('./spider')
const camera = require('./camera')
// const compare = require('./src/compare')

const crawler = spider.createWeb('https://www.beausynergy.co.uk/')

const screenshot = camera.createImage({
    environments: {
        live: 'https://www.beausynergy.co.uk/',
        master: 'http://beausynergy01.wpengine.com/'
    },
    path: path.join(process.cwd(), 'screenshots')
})

// const comparison = compare.createComparison() TODO
// crawler.pipe(screenshot).pipe(comparison)

crawler.pipe(screenshot).pipe(process.stdout)