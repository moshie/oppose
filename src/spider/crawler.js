'use strict'

const axios = require('axios')
const queue = require('async/queue')
const { Readable } = require('stream')
const parseHtml = require('./parse-html')

const log = require('simple-node-logger').createSimpleFileLogger('project.log')

class Crawler extends Readable {

    /**
     * Crawler Stream Constructor
     * 
     * @param {Object} options 
     */
    constructor(options) {
        super(options)

        this.visited = []
        this.url = options.url
        this.concurrency = options.concurrency || 2
        this.queue = null
    }

    /**
     * Crawler Read Method
     */
    _read() {
        log.debug('Crawler Started')
        log.debug(`Crawling: ${this.url}`)
        log.debug(`Concurrency: ${this.concurrency}`)

        if (this.queue === null) {
            this.queue = queue(async task => {
                return axios.get(task.url)
                    .then(response => this.queueLinks(response.data, task.url))
            }, this.concurrency)

            this.queue.push({ url: this.url })

            this.queue.drain = () => this.drain()
            this.queue.error = error => this.error(error)
        }
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

    /**
     * Handle Drained Queue
     */
    drain() {
        log.debug('Crawler Ended')
        this.push(null)
    }

    /**
     * Queue Links from html
     * 
     * @param {String} html 
     * @param {String} origin 
     */
    queueLinks(html, origin) {
        return new Promise(resolve => {
            var links = parseHtml(html, this.url, origin)

            const unVisitedLinks = links.filter(link => !this.visited.includes(link))

            this.visited = [...this.visited, ...unVisitedLinks]
    
            unVisitedLinks.forEach(url => {
                this.push(url)
                this.queue.push({ url })
            })
    
            resolve(unVisitedLinks)
        })
    }

}

module.exports = Crawler
