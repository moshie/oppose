'use strict'

const asyncForEach = async (array, cb) => {
    for (let i = 0; i < array.length; i++) {
        await cb(array[i], i, array)
    }
}

module.exports = asyncForEach
