module.exports = function(io) {
    var sessions = {}

    var socketIdToSessionId = {}

    io.on("connection", socket => {
        console.log(`a user connected, the corresponding socket: id is ${socket.id}`)
        io.to(socket.id).emit('connected', {message:"congrads"})

        var socketId = socket.id
        if (!(1 in sessions)) {
            sessions[1] = {
                participants: []
            }
        }
        sessions[1].participants.push(socketId)
        console.log('current clients' + sessions[1].participants)

        socket.on('edition change', (delta) => {
            sessions[1].participants.forEach(sid => {
                // console.log(sid, socketId)
                if (sid === socketId) { return }
                console.log('to change content in ' + sid)
                io.to(sid).emit("change from collaborators", delta)
            })
        })
        socket.on('disconnect', () => {
            // remove socket from the session
            index = sessions[1].participants.indexOf(socketId)
            if (index >= 0) {
                sessions[1].participants.splice(index, 1)
            }
            console.log(`sockect with id ${socketId} is disconnected`)
        })
    })
}