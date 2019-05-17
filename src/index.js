'use strict'

const path = require('path')

const spider = require('./spider')
const camera = require('./camera')
// const compare = require('./src/compare')

try {
    (async () => {

        const crawler = spider.createWeb('https://www.beausynergy.co.uk/')

        const screenshot = await camera.createImage({
            environments: {
                live: 'https://www.beausynergy.co.uk/',
                master: 'http://beausynergy01.wpengine.com/'
            },
            path: path.join(process.cwd(), 'screenshots')
        })


        crawler.pipe(screenshot)

    })()
} catch(e) {
    console.log(e);
}




// const comparison = compare.createComparison() TODO
// crawler.pipe(screenshot).pipe(comparison)



// crawler.on('data', (chunk) => {
//     console.log(chunk.toString());
// })