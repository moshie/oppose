'use strict'

function validate({ url, concurrency = 2 }) {

    concurrency = parseInt(concurrency)

    if (!url) {
        throw new Error('Please Provide a url to crawl')
    }

    if (typeof concurrency !== 'number' && concurrency <= 50 && concurrency >= 1) {
        throw new Error('Concurrency must be a number between 1 - 50')
    }

    return { url, concurrency }
}

module.exports = validate
