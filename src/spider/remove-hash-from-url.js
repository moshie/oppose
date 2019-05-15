'use strict'

function removeHashFromUrl(link) {
    return link.slice(0, link.indexOf('#'))
}

module.exports = removeHashFromUrl
