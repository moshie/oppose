'use strict'

const Crawler = require('./crawler')

function createWeb(url, concurrency = 2) {

    if (!url) {
        throw new Error('Provide a url to crawl')
    }

    return new Crawler({ url, concurrency })
}

module.exports = {
    createWeb
}