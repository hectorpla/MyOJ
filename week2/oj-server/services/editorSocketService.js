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

        
        if (!(sessionId in sessions)) {
            sessions[sessionId] = {
                participants: [],
                participantIDs: [],
                availableSlots: [1,2,3,4,5,6] // for simplicity
            }
        } else if (sessions[sessionId].availableSlots.length == 0) {
            socket.disconnect(true)
            return
        }

        const session = sessions[sessionId]
        const socketId = socket.id
        const userId = session.availableSlots.shift() // one-to-one correspondence to socketId
        session.participants.push(socketId)
        session.participantIDs.push(userId)
        console.log('current clients [' + session.participants + ']')

        broadcastCollabChange() // nofity every one including himself

        socket.on('edition change', (delta) => {
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
        })
    })
}