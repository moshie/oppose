'use strict'

const isPlainObject = require('../helpers/is-plain-object')

function validate(options) {

    if (!isPlainObject(options.environments) && !Object.keys(options.environments).length) {
        throw new Error('No Environments provided to screenshot')
    }

    if (typeof options.directory !== 'string' || !options.directory.length) {
        throw new Error('Directory must be provided to store the screenshots')
    }

}

module.exports = validate
