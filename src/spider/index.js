'use strict'

const Crawler = require('./crawler')
const validate = require('./validate')

function createWeb(options) {

    options.concurrency = parseInt(options.concurrency)

    validate(options)

    return new Crawler(options)
}

module.exports = {
    createWeb
}
