'use strict'

const Capture = require('./capture')
const { Cluster } = require('puppeteer-cluster');

async function createImage(options) {

    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: options.concurrency || 2
    })

    cluster.on('taskerror', (err, data) => {
        console.log(`  Error crawling ${data}: ${err.message}`);
    });

    return new Capture(cluster, options)
}

module.exports = {
    createImage
}