'use strict'

const Capture = require('./capture')

function createImage(options) {
    return new Capture(options)
}

module.exports = {
    createImage
}