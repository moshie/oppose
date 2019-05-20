'use strict'

function isPlainObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]'
}

module.exports = isPlainObject
