module.exports = function(io) {
    var sessions = {}

    io.on("connection", socket => {
        const sessionId = socket.handshake.query.sessionId
        function broadcastCollabChange() {
            console.log('current session ' + sessionId, sessions[sessionId])
            sessions[sessionId].participants.forEach(sid => {
                // if (sid === socketId) { return }
                io.to(sid).emit('collaborators change', 
                                sessions[sessionId].participantNums)
            })
        }

        // console.log(socket.handshake.query)
        console.log(`a user connected (in session/problem ${sessionId}), the corresponding socket: id is ${socket.id}`)
        io.to(socket.id).emit('connected', {message:"congrads"})

        const socketId = socket.id
        if (!(sessionId in sessions)) {
            sessions[sessionId] = {
                participants: [],
                participantNums: [],
                availableSlots: [1,2,3,4,5,6] // for simplicity
            }
        } else if (sessions[sessionId].availableSlots.length == 0) {
            socket.disconnect(true)
            return
        }        
        var session = sessions[sessionId]
        session.participants.push(socketId)
        session.participantNums.push(session.availableSlots.shift())
        console.log('current clients [' + session.participants + ']')

        broadcastCollabChange()

        socket.on('edition change', (delta) => {
            session.participants.forEach(sid => {
                // console.log(sid, socketId)
                if (sid === socketId) { return }
                console.log('to change content in ' + sid)
                io.to(sid).emit("change from collaborators", delta)
            })
        })
        socket.on('disconnect', () => {
            // remove socket from the session
            index = session.participants.indexOf(socketId)
            if (index >= 0) {
                session.participants.splice(index, 1)
                session.availableSlots.push(session.participantNums[index])
                session.participantNums.splice(index, 1)
                broadcastCollabChange()
            } else {
                console.log(`WARNING: expected ${socketId} in ${sessionId}`)
            }
            console.log(`sockect with id ${socketId} is disconnected from session ${sessionId}`)
        })
    })
}