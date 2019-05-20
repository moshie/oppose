'use strict'

const cheerio = require('cheerio')

const hasSameHost = require('./has-same-host')
const hasParentPath = require('./has-parent-path')
const relativeToAbsolute = require('./relative-to-absolute')
const removeHashFromUrl = require('./remove-hash-from-url')
const hasInvalidExtension = require('./has-invalid-extension')

function parse(html, peusdoUrl, origin) {

    const $ = cheerio.load(html)

    const links = $('a[href]').map(function () { 
        return $(this).attr('href')
    })
        .get()
        .filter((link, i, arr) => arr.indexOf(link) === i)

    const urls = []

    for (var i = 0; i < links.length; i++) {
        var link = removeHashFromUrl(links[i])

        // Validate
        if (
            !link || // Url is Empty
            hasInvalidExtension(link) || // Ends with an invalid web extension
            (!/^https?:\/\//.test(link) && link.includes(':')) // starts with an invalid protocol i.e mailto: tel: javascript:
        ) {
            continue
        }

        // Coerce Relative Url into absolute url
        if (!/^https?:\/\//.test(link)) {
            link = relativeToAbsolute(peusdoUrl, origin, link)
        }

        // Absolute check
        if (/^https?:\/\//.test(link) && hasSameHost(link, peusdoUrl) && hasParentPath(link, peusdoUrl)) {
            urls.push(link)
        }

    }

    return urls
}

module.exports = parse
