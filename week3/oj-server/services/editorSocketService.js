var redisClient = require('../modules/redisClient')
const sessionPath = 'problems' // for extendability

function warningLog(tag, msg) {
    console.log(tag + ": " + msg)
}

module.exports = function(io) {
    var sessions = {}

    io.on("connection", socket => {
        const sessionId = socket.handshake.query.sessionId
        function broadcastCollabChange() {
            console.log('current session ' + sessionId, sessions[sessionId])
            sessions[sessionId].participants.forEach(sid => {
                io.to(sid).emit('participants change', 
                                sessions[sessionId].participantIDs)
            })
        }

        // console.log(socket.handshake.query)
        console.log(`a user connected (in session/problem ${sessionId}), the corresponding socket: id is ${socket.id}`)
        io.to(socket.id).emit('connected', {message:"congrads"})

        // disconnect the overflowed user
        if (sessionId in sessions && sessions[sessionId].availableSlots.length == 0) {
            socket.disconnect(true)
            return
        }

        function checkRestore() {
            if (sessions[sessionId].restoreInstructions.length > 0) {
                socket.emit('buffer ready')
            } else {
                console.log('nothing to restore')
            }
        }
        // set-up session corresponding to a problem
        if (!(sessionId in sessions)) {
            sessions[sessionId] = {
                participants: [],
                participantIDs: [],
                availableSlots: [1,2,3,4,5,6], // for simplicity
                restoreInstructions: null
            }
            redisClient.get(`${sessionPath}/${sessionId}`, reply => {
                if (reply) {
                    sessions[sessionId].restoreInstructions = JSON.parse(reply)
                } else {
                    sessions[sessionId].restoreInstructions = []
                }
                checkRestore()
            })
        }
        else { checkRestore() }

        // add the connected user to the session
        const session = sessions[sessionId]
        const socketId = socket.id
        const userId = session.availableSlots.shift() // one-to-one correspondence to socketId
        session.participants.push(socketId)
        session.participantIDs.push(userId)
        console.log('current clients [' + session.participants + ']')

        broadcastCollabChange() // nofity every one including himself

        // restore buffer from redis if there is
        socket.on('restore buffer', () => {
            let instructions = session.restoreInstructions;
            if (instructions === null) {
                console.log("WARNING(restore buffer): expecting restore instructor not to be null")
            }
            console.log(`restoring buffer for user ${userId}`)
            instructions.forEach(instruction => {
                let [event, data, meta] = instruction
                // console.log(event, data)
                socket.emit(event, data)
            })
        })

        socket.on('edition change', (delta) => {
            let instructions = session.restoreInstructions;
            if (instructions === null) {
                console.log("WARNING(edition change): expecting restore instructor not to be null")
            }
            session.restoreInstructions.push(["edition change", delta, Date.now()])

            session.participants.forEach((sid, index) => {
                // console.log(sid, socketId)
                if (sid === socketId) { return }
                console.log('to change content in user ' + session.participantIDs[index])
                io.to(sid).emit('edition change', delta)
            })
        })

        socket.on('cursor change', (position) => {
            console.log('cursor changed in user' + userId)
            session.participants.forEach(sid => {
                if (sid == socketId) { return } // code repeat
                io.to(sid).emit('cursor change', userId, position)
            })
        })

        socket.on('disconnect', () => {
            // remove socket from the session
            index = session.participants.indexOf(socketId)
            if (index >= 0) {
                session.participants.splice(index, 1)
                session.availableSlots.push(session.participantIDs[index])
                session.participantIDs.splice(index, 1)
                broadcastCollabChange()
            } else {
                console.log(`WARNING: expected ${socketId} in ${sessionId}`)
            }
            console.log(`sockect with id ${socketId} is disconnected from session ${sessionId}`)
            // cancel the corresponding session
            if (session.participants.length == 0) {
                let key = `${sessionPath}/${sessionId}`
                let value = JSON.stringify(session.restoreInstructions)
                redisClient.set(key, value, redisClient.print)
                redisClient.expire(key, 10)
                delete sessions[sessionId]
            }
        })
    })
}