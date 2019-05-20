'use strict'

const Crawler = require('./crawler')

function createWeb({ url, concurrency = 2 }) {
    if (!url) {
        throw new Error('Provide a url to crawl')
    }

    if (typeof concurrency !== 'number' && concurrency <= 50 && concurrency >= 1) {
        throw new Error('Concurrency must be a number between 1 - 50')
    }

    return new Crawler({ url, concurrency })
}

module.exports = {
    createWeb
}