'use strict'

const Compare = require('./compare')

function createComparison(options = {}) {
    return new Compare(options)
}

module.exports = {
    createComparison
}