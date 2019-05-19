'use strict'

const Compare = require('./compare')

async function createComparison(options = {}) {

    return new Compare(options)
}

module.exports = {
    createComparison
}