'use strict'

const Capture = require('./capture')
const { Cluster } = require('puppeteer-cluster')

const log = require('simple-node-logger').createSimpleFileLogger('project.log')

const isPlainObject = obj => Object.prototype.toString.call(obj) === '[object Object]'

async function createImage({
    environments = {},
    directory = '',
    concurrency = 2,
    type = 'png',
    quality = 80,
    fullPage = true,
    clip = {},
    omitBackground = false,
    retryLimit = 0
}) {
    if (!isPlainObject(environments) || !Object.keys(environments).length) {
        throw new Error('No Environments provided to screenshot')
    }

    if (typeof directory !== 'string' || !directory.length) {
        throw new Error('Directory must be provided to store the screenshots')
    }

    const screenshotOptions = {
        type,
        omitBackground
    }

    if (type === 'jpeg') {
        screenshotOptions.quality = quality
    }

    if (!fullPage) {
        screenshotOptions.clip = clip
    }

    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: concurrency || 2,
        skipDuplicateUrls: true,
        retryLimit: retryLimit || 0
    })

    cluster.on('taskerror', (err, data) => {
        log.error(`  Error crawling ${data}: ${err.message}`)
    })

    await cluster.task(async ({ page, data }) => {

        await page.goto(data.url)

        await page.screenshot(
            Object.assign(screenshotOptions, { path: data.file })
        )

        return data.file
    })

    return new Capture(cluster, {
        environments,
        directory,
        type
    })
}

module.exports = {
    createImage
}