'use strict'

const axios = require('axios')
const queue = require('async/queue')
const { Readable } = require('stream')
const parseHtml = require('./parse-html')

const log = require('simple-node-logger').createSimpleFileLogger('project.log')

class Crawler {

    constructor({ url = '', concurrency = 2}) {
        this.url = url
        this.concurrency = concurrency
        this.stream = new Readable({
            read() { }
        })
    }

    crawl() {
        var crawler = this

        this.queue = queue(function (task, cb) {
            crawler.worker(task)
                .then(() => cb())
                .catch(err => cb(err))
        }, this.concurrency)

        this.queue.drain = this.drain
        crawler.error = this.error

        this.queue.push({ url: this.url })
        this.stream.push(this.url)

        return this.stream
    }

    worker(task) {
        return axios({ method: 'GET', url: task.url })
            .then(response => crawler.scrape(response.data, task.url))
    }

    scrape(html, origin) {
        return new Promise((resolve, reject) => {
            var links = parseHtml(html, this.url, origin)
    
            // Filter out links which have already been visited
            links = links.filter(link => !this.visited.includes(link))
    
            // Append the new links with the visited ones
            this.visited = [...this.visited, ...links]
    
            // Queue up new links
            links.forEach(url => {
                this.stream.push(`${url}`)
                this.queue.push({ url })
            })
    
            resolve(links)
        });
    }

    drain() {
        log.info('Drained')
    }

    error(error) {
        log.error(error.config)
        log.error(error.message)
    }

}

module.exports = Crawler
