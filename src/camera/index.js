'use strict'

const Capture = require('./capture')
const validate = require('./validate')
const createCluster = require('./create-cluster')

async function createImage(options) {

    validate(options)

    const cluster = await createCluster(options)

    await cluster.task(async ({ page, data }) => {

        await page.goto(data.url)

        await page.screenshot(
            Object.assign(options.screenshot || {}, { 
                path: data.file
            })
        )

        return data.file
    })

    return new Capture(cluster, options)
}

module.exports = { createImage }
