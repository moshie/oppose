'use strict'

const { Cluster } = require('puppeteer-cluster')

async function createCluster(options) {
    const cluster = await Cluster.launch(
        Object.assign({
            concurrency: Cluster.CONCURRENCY_CONTEXT,
            maxConcurrency: 2,
            skipDuplicateUrls: true,
            puppeteerOptions: options.browser
        }, options.cluster)
    )

    cluster.on('taskerror', (err, data) => {
        console.error(`  Error crawling ${data}: ${err.message}`)
    })

    return cluster
}

module.exports = createCluster
