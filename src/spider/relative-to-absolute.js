'use strict'

const url = require('url')
const path = require('path')

function relativeToAbsolute(root, origin, link) {
    const rootObj = url.parse(root)
    const originObj = url.parse(origin)

    if (link.startsWith('/')) {
        return rootObj.protocol + '//' + rootObj.host + link
    }

    return originObj.protocol + '//' + originObj.host + path.join(originObj.pathname, link)
}

module.exports = relativeToAbsolute
