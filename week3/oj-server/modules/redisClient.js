var redis = require('redis')
const client = redis.createClient()

client.on("error", err => {
    console.log("Redis Connection: " + err)
})

function set(key, value, callback) {
    client.set(key, value, (err, reply) => {
        if (err) { 
            console.log(err)
            return
        }
        if (callback) {
            callback(reply)
        }
    })
}

function get(key, callback) {
    client.get(key, (err, reply) => {
        if (err) {
            console.log(err)
            return
        }
        if (callback) {
            callback(reply)
        }
    })
}

function expire(key, second, callback) {
    client.expire(key, second, (err, reply) => {
        if (err) {
            console.log(err)
            return
        }
        if (callback) {
            callback(reply)
        }
    })
}

const quit = client.quit
const print = redis.print

module.exports = {
    set,
    get,
    expire,
    quit,
    print
}