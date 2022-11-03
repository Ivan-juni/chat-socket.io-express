users = []
connections = []

module.exports = (io) =>
  function (socket) {
    if (connections) {
      connections.push(socket)
      console.log(`Socket № ${connections.indexOf(socket) + 1} connected`)
    }

    socket.on('create-the-room', (data) => {
      if (!io.sockets.adapter.rooms.get(data.roomId)) {
        // if room does not exist
        console.log(data.message)
        socket.join(data.roomId)
        io.to(data.roomId).emit('joined', {
          joined: true,
        })
      } else {
        socket.emit('joined', {
          joined: false,
        })
        console.log('Room already exists')
      }
    })

    socket.on('join-to-room', (data) => {
      if (io.sockets.adapter.rooms.get(data.roomId)) {
        // if room exist
        console.log(data.message)
        socket.join(data.roomId)
        io.to(data.roomId).emit('joined', {
          joined: true,
        })
      } else {
        socket.emit('joined', {
          joined: false,
        })
        console.log('Room does not exist')
      }
    })

    socket.on('send-message', (data) => {
      io.to(data.roomId).emit('add-message-to-div', {
        name: data.name,
        message: data.message,
        messageColor: data.messageColor,
      })
    })

    socket.on('disconnect', () => {
      const index = connections.indexOf(socket)
      if (connections) {
        connections.splice(index, 1)
      }
      console.log(`Socket № ${index + 1} disconnected`)
    })
  }
