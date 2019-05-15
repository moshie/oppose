'use strict'

const url = require('url')
const path = require('path')
const mkdirp = require('mkdirp')
const { Transform } = require('stream')
const createPuppeteerPool = require('puppeteer-pool')

class Capture extends Transform {

    /**
     * Capture constructor
     * 
     * @param {Object} options 
     */
    constructor(options = {}) {
        super(options)
        this.environments = options.environments
        this.path = path

        this.pools = {}
        Object.keys(options.environments).forEach(env => {
            this.pools[env] = createPuppeteerPool()
        })
    }

    /**
     * Create the directory
     * 
     * @param {String} folderPath 
     */
    createDirectory(folderPath) {
        return new Promise((resolve, reject) => {
            mkdirp(folderPath, function (error) {
                if (error) {
                    return reject(error)
                }

                resolve();
            });
        })
    }

    /**
     * Merge the environment host with the link
     * 
     * @param {String} host 
     * @param {String} link 
     */
    mergeUrl(host, link) {
        const hostObj = url.parse(host)
        const linkObj = url.parse(link)

        return `${hostObj.protocol}//${hostObj.host}${linkObj.pathname}`
    }

    /**
     * Convert the link to a filename
     * 
     * @param {String} link 
     */
    urlToFilename(link) {
        var pathname = url.parse(link).pathname

        if (pathname == '/') {
            return 'home';
        }

        pathname = pathname.startsWith('/') ? pathname.slice(1) : pathname;

        pathname = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;

        return pathname.replace(/\//g, '_').replace(/\./g, '-')
    }

    /**
     * Transform Stream Method
     * 
     * @param {Buffer} chunk 
     * @param {String} enc 
     * @param {Function} callback 
     */
    _transform(chunk, enc, callback) {

        const browsers = Object.keys(this.environments).map(env => {
            return this.pools[env].use(async (browser) => {
                const page = await browser.newPage()

                var link = this.mergeUrl(this.environments[env], chunk.toString())

                const status = await page.goto(link)
    
                if (!status.ok) {
                    throw new Error(`cannot open ${chunk.toString()}`)
                }

                // Create folder for environment
                var folderPath = path.join(this.path, env)
                await this.createDirectory(folderPath)

                // Build filename from link
                const niceName = this.urlToFilename(link)
                const filename = `${niceName}.png`
                const file = path.join(folderPath, filename)
    
                // Screenshot the page
                await page.screenshot({
                    path: file
                });
    
                await page.close()
                return file
            })
        })

        Promise.all(browsers)
            .then(files => {
                callback(
                    null, 
                    Object.keys(this.environments).reduce((acc, current, index) => {
                        acc[current] = files[index]
                        return acc
                    }, {})
                )
            })
            .catch(error => callback(error))
    }

    /**
     * Stream Flush Method
     * 
     * @param {Function} callback 
     */
    _flush(callback) {
        const browser = Object.keys(this.environments).map(env => {
            return this.pools[env].drain()
                .then(() => this.pools[env].clear())
        })

        Promise.all(browser)
            .then(() => callback())
            .catch((error) => callback(error))
    }

}

module.exports = Capture
