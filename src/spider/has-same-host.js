'use strict'

const url = require('url')

const trimWww = require('./trim-www')

function hasSameHost(link, peusdoUrl) {
    const linkObj = url.parse(trimWww(link))
    const peusdoUrlObj = url.parse(trimWww(peusdoUrl))

    return linkObj.host === peusdoUrlObj.host
}

module.exports = hasSameHost
