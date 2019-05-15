'use strict'

const url = require('url')

const whiteList = [
    'html',
    'htm',
    'xhtml',
    'jhtml',

    'php',
    'php3',
    'php4',
    'phtml',

    'asp',
    'aspx',
    'axd',
    'asmx',
    'ashx',

    'rhtml',
    'shtml',
    'xml'
]

function hasInvalidExtension(link) {
    const matches = /\.([a-z]+)$/.exec(url.parse(link).pathname)

    return matches !== null && !whiteList.includes(matches[1])
}

module.exports = hasInvalidExtension
