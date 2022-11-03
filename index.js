const express = require('express')
const app = express()
const path = require('path')
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const socketLogic = require('./chat')

const port = process.env.PORT || 8000

app.use(express.static(path.join(__dirname + '/public')))

io.on('connection', socketLogic(io))

server.listen(port, () => {
  console.log(`Server running at port ${port}`)
})
