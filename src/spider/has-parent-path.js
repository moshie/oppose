'use strict'

const url = require('url')
const trimWww = require('./trim-www')

function hasParentPath(link, peusdoUrl) {
    const linkObj = url.parse(trimWww(link))
    const peusdoUrlObj = url.parse(trimWww(peusdoUrl))

    if (peusdoUrlObj.pathname === '/') {
        return true
    }

    return linkObj.pathname.startsWith(peusdoUrlObj.pathname)
}

module.exports = hasParentPath
