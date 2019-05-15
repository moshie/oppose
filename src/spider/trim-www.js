'use strict'

function trimWww(link) {
    return link.indexOf('www.') !== -1 ? link.slice(4) : link
}

module.exports = trimWww
