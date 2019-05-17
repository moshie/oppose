'use strict'

const url = require('url')
const path = require('path')
const mkdirp = require('mkdirp')
const { Transform } = require('stream')

const log = require('simple-node-logger').createSimpleFileLogger('project.log')

// https://github.com/thomasdondorf/puppeteer-cluster

class Capture extends Transform {

    /**
     * Capture constructor
     * 
     * @param {Object} options 
     */
    constructor(cluster, options = {}) {
        options.objectMode = true
        super(options)
        this.environments = options.environments
        this.path = options.path
        this.cluster = cluster
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

                resolve()
            })
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
            return 'home'
        }

        pathname = pathname.startsWith('/') ? pathname.slice(1) : pathname

        pathname = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname

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

        async function asyncForEach(array, callback) {
            for (let index = 0; index < array.length; index++) {
                await callback(array[index], index, array);
            }
        }

        (async () => {
            const envs = Object.keys(this.environments)
            const files = Object.assign({}, this.environments)

            // Screenshot task
            const takeScreenshot = async ({ page, data }) => {

                await page.goto(data.link);

                await page.screenshot({
                    path: data.file,
                    fullPage: true
                });

                return data.file
            };

            await asyncForEach(envs, async env => {
                const root = this.environments[env];

                // Create Screenshots Directory
                await this.createDirectory(
                    path.join(this.path, env)
                )

                const link = this.mergeUrl(root, chunk.toString())
                const file = path.join(this.path, env, `${this.urlToFilename(link)}.png`)

                // log.info(link)
                // log.info(file)

                // Queue the screenshot task
                await this.cluster.queue({ link, file }, takeScreenshot)

                files[env] = file
            })


            return files;
        })()
            .then(files => {
                log.info(files);
                callback(null, files)
            })
            .catch(error => {
                log.error(error);
                callback(error)
            })
    }

    /**
     * Stream Flush Method
     * 
     * @param {Function} callback 
     */
    _flush(callback) {
        (async () => {
            await this.cluster.idle()
            await this.cluster.close()
        })()
            .then(() => callback())
            .catch(error => callback(error))
    }

}

module.exports = Capture
