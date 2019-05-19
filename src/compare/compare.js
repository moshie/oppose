'use strict'

const path = require('path')
const BlinkDiff = require('blink-diff')
const { Transform } = require('stream')

const log = require('simple-node-logger').createSimpleFileLogger('project.log')

class Compare extends Transform {

    constructor(options = {}) {
        options.objectMode = true
        super(options)

        this.path = options.path
    }

    _transform(chunk, enc, callback) {

        // Put this in a queue?
        // Better perf?

        const imageAPath = Object.values(chunk)[0]
        const imageBPath = Object.values(chunk)[1]

        const comparisonFolder = `${Object.keys(chunk)[0]}_${Object.keys(chunk)[1]}_comparisons`
        const output = path.join(this.path, comparisonFolder, path.basename(imageAPath))

        const diff = new BlinkDiff({
            imageAPath,
            imageBPath,
        
            thresholdType: BlinkDiff.THRESHOLD_PERCENT,
            threshold: 0.01,
            outputBackgroundBlue: 255,
            outputBackgroundGreen: 255,
            outputBackgroundRed: 255,
            outputBackgroundOpacity: 0.8,
            composition: false,
            outputMaskOpacity: 1,
            imageOutputPath: output
        })

        diff.run(function (error, result) {
            if (error) {
                return log.error(error)
            }

            log.info(result)

            // EMIT Failure with A, B & comparison

            log.info(diff.hasPassed(result.code) ? 'Passed' : 'Failed')
            log.info('Found ' + result.differences + ' differences.')

            this.push(
                Object.assign(chunk, { output })
            )

            callback()
        })

    }

}

module.exports = Compare