'use strict'

const axios = require('axios')
const parse = require('./parser')
const queue = require('async/queue')
const { Readable } = require('stream')

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
        if (this.queue !== null) {
            return
        }

        this.queue = queue(async task => {
            return axios.get(task.url)
                .then(response => {
                    return this.queueLinks(
                        response.data, 
                        task.url
                    )
                })
        }, this.concurrency)

        this.queue.push({ url: this.url })

        this.queue.drain = () => this.drain()
        this.queue.error = error => this.error(error)
    }

    /**
     * Handle Stream Errors
     * 
     * @param {Error} error 
     */
    error(error) {
        console.log(error)
    }

    /**
     * Handle Drained Queue
     */
    drain() {
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
            var links = parse(html, this.url, origin)

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
