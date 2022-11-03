document.addEventListener('DOMContentLoaded', function (event) {
  const socket = io.connect()

  var ID

  const form = document.querySelector('#messageForm')
  const textarea = document.querySelector('#message')
  const nameInput = document.querySelector('#name')
  const messages = document.querySelector('#messages')

  const roomOutDiv = document.querySelector('.room-out')
  const roomInDiv = document.querySelector('.room-in')
  const roomCreateDiv = document.querySelector('.room__create')
  const roomJoinDiv = document.querySelector('.room__join')

  const createButton = document.querySelector('#createButton')
  const joinButton = document.querySelector('#joinButton')

  const createRoomForm = document.querySelector('#createRoomForm')
  const joinRoomForm = document.querySelector('#joinRoomForm')

  const createIdInput = document.querySelector('#createId')
  const joinIdInput = document.querySelector('#joinId')

  const sendMessage = (event) => {
    event.preventDefault()
    if (textarea.value !== '' && nameInput.value !== '') {
      socket.emit('send-message', {
        name: nameInput.value,
        message: textarea.value,
        messageColor: alertColor,
        roomId: ID,
      })
      nameInput.disabled = true
      textarea.value = ''
    }
  }

  const room = (e, element, message) => {
    e.preventDefault()

    socket.on('joined', (data) => {
      if (data.joined === true) {
        roomOutDiv.classList.add('hide')
        roomInDiv.classList.remove('hide')
      } else {
        element.insertAdjacentHTML(
          'beforeend',
          `
            <div class="alert alert-danger">
                <span>${message}</span>
            </div>
        `
        )
      }
    })
  }

  // random color of message
  let random = Math.floor(Math.random() * 4) + 1
  let alertColor

  switch (random) {
    case 1:
      alertColor = 'secondary'
      break
    case 2:
      alertColor = 'danger'
      break
    case 3:
      alertColor = 'success'
      break
    // case 4:
    //   alertColor = 'light'
    //   break
    case 4:
      alertColor = 'warning'
      break
    case 5:
      alertColor = 'info'
      break
    default:
      break
  }

  // * Event listeners *

  form.addEventListener('submit', (e) => {
    sendMessage(e)
  })

  textarea.addEventListener('keydown', function (event) {
    if (event.code == 'Enter') {
      sendMessage(event)
    }
  })

  joinButton.addEventListener('click', (e) => {
    roomJoinDiv.classList.remove('hide')
  })

  createButton.addEventListener('click', (e) => {
    roomCreateDiv.classList.remove('hide')
  })

  createRoomForm.addEventListener('submit', (event) => {
    ID = createIdInput.value
    socket.emit('create-the-room', {
      message: 'Client attempt to create the room',
      roomId: ID,
    })
    room(event, roomCreateDiv, 'Room already exists')
  })
  joinRoomForm.addEventListener('submit', (event) => {
    ID = joinIdInput.value
    socket.emit('join-to-room', {
      message: 'Client attempt to join',
      roomId: ID,
    })
    room(event, roomJoinDiv, 'Room does not exist')
  })

  // * Event listeners *

  socket.on('add-message-to-div', (data) => {
    messages.insertAdjacentHTML(
      'beforeend',
      `
        <div class="alert alert-${data.messageColor}" id="message__alert" role="alert">
            <span>${data.name}:</span>
            <span>${data.message}</span>
        </div>
      `
    )
  })
})
