module.exports = function(io) {
    var sessions = {}



    io.on("connection", socket => {
        console.log(`a user connected, the corresponding socket: ...
        `)
        console.log(socket)
        io.to(socket.id).emit('connected', {message:"congrads"})
    })
}