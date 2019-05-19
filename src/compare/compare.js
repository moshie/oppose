'use strict'

const path = require('path')
const mkdirp = require('mkdirp')
const queue = require('async/queue')
const BlinkDiff = require('blink-diff')
const { Transform } = require('stream')

const log = require('simple-node-logger').createSimpleFileLogger('project.log')

class Compare extends Transform {

    /**
     * Comparison Stream Constructor
     * 
     * @param {Object} options 
     */
    constructor(options = {}) {
        options.objectMode = true
        super(options)

        this.concurrency = options.concurrency || 2
        this.path = options.path
        this.blinkOptions = Object.assign({
            thresholdType: BlinkDiff.THRESHOLD_PERCENT,
            threshold: 0.01,
            outputBackgroundBlue: 255,
            outputBackgroundGreen: 255,
            outputBackgroundRed: 255,
            outputBackgroundOpacity: 0.8,
            composition: false,
            outputMaskOpacity: 1,
        }, options.blinkOptions || {})
        this.queue = null
    }

    /**
     * Get the directory to put the comparisons
     * 
     * @param {Object} chunk 
     */
    getDirectory(chunk) {
        return path.join(this.path, `${Object.keys(chunk)[0]}_${Object.keys(chunk)[1]}_comparisons`)
    }

    /**
     * Make the directory
     * 
     * @param {Object} chunk
     */
    makeDirectory(chunk) {
        return new Promise((resolve, reject) => {
            mkdirp(this.getDirectory(chunk), error => {
                if (error) {
                    return reject(error)
                }

                resolve()
            })
        })
    }

    /**
     * Get Comparison paths
     *  
     * @param {Object} chunk 
     */
    getPaths(chunk) {
        const imageAPath = Object.values(chunk)[0]
        const imageBPath = Object.values(chunk)[1]

        const imageOutputPath = path.join(
            this.getDirectory(chunk), path.basename(imageAPath)
        )

        return { imageAPath, imageBPath, imageOutputPath }
    }

    /**
     * Compare Screenshots
     * 
     * @param {Object} task
     */
    compare({ chunk }) {
        return new Promise((resolve, reject) => {
            const paths = this.getPaths(chunk)
            const options = Object.assign(this.blinkOptions, paths)

            const diff = new BlinkDiff(options)

            diff.run((error, result) => {
                if (error) {
                    return reject(error)
                }

                // EMIT Failure with A, B & comparison

                log.info(diff.hasPassed(result.code) ? 'Passed' : 'Failed')
                log.info('Found ' + result.differences + ' differences.')

                this.push({
                    environments: chunk,
                    comparison: paths.imageOutputPath
                })

                resolve()
            })
        })
    }

    /**
     * Stream Transform implementation
     * 
     * @param {Object} chunk 
     * @param {String} enc 
     * @param {Function} callback 
     */
    _transform(chunk, enc, callback) {
        if (this.queue === null) {
            this.queue = queue(async task => {
                return this.makeDirectory(task.chunk)
                    .then(() => this.compare(task))
            }, this.concurrency)
            this.queue.error = error => this.error(error)
        }

        this.queue.push({ chunk }, callback)
    }

    /**
     * Handle Stream Errors
     * 
     * @param {Error} error 
     */
    error(error) {
        log.error(error.config)
        log.error(error.message)
    }

}

module.exports = Compare
