'use strict'

const Capture = require('./capture')
const { Cluster } = require('puppeteer-cluster')

const log = require('simple-node-logger').createSimpleFileLogger('project.log')

async function createImage(options) {

    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: options.concurrency || 2,
        skipDuplicateUrls: true
    })

    cluster.on('taskerror', (err, data) => {
        log.error(`  Error crawling ${data}: ${err.message}`)
    })

    await cluster.task(async ({ page, data }) => {

        await page.goto(data.url)

        await page.screenshot({
            path: data.file,
            fullPage: true
        })

        return data.file
    })

    return new Capture(cluster, options)
}

module.exports = {
    createImage
}