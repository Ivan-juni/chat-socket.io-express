document.addEventListener('DOMContentLoaded', function (event) {
  const socket = io.connect()

  var createdRooms = []

  socket.on('init', (data) => {
    createdRooms = data
  })

  var ID

  const form = document.querySelector('#messageForm')
  const textarea = document.querySelector('#message')
  const nameInput = document.querySelector('#name')
  const messages = document.querySelector('#messages')

  const roomOutDiv = document.querySelector('.room-out')
  const roomInDiv = document.querySelector('.room-in')
  const roomCreateDiv = document.querySelector('.room__create')
  const roomJoinDiv = document.querySelector('.room__join')
  const roomIdTitle = document.querySelector('#roomId')

  const createButton = document.querySelector('#createButton')
  const joinButton = document.querySelector('#joinButton')

  const createRoomForm = document.querySelector('#createRoomForm')
  const joinRoomForm = document.querySelector('#joinRoomForm')

  const createIdInput = document.querySelector('#createId')
  const joinIdInput = document.querySelector('#joinId')
  const joinIdSelect = document.querySelector('#selectRoom')

  const randomIdButton = document.querySelector('#random')
  const leaveButton = document.querySelector('#leave__button')

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

  const room = (event, element, message) => {
    event.preventDefault()

    roomIdTitle.innerText = `Message form (${ID})`

    socket.on('joined', (data) => {
      createdRooms = data.createdRooms
      if (data.joined === true) {
        roomOutDiv.classList.add('hide')
        roomInDiv.classList.remove('hide')
      } else {
        element.insertAdjacentHTML(
          'beforeend',
          `
            <div class="alert alert-danger" id="exist">
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

  joinIdSelect.addEventListener('change', (event) => {
    if (joinIdSelect.options[joinIdSelect.selectedIndex].text == 'Enter id') {
      document.querySelector('#joinIdInputDiv').classList.remove('hide')
      ID = joinIdInput.value
    } else {
      ID = joinIdSelect.value
    }
  })

  joinButton.addEventListener('click', (e) => {
    for (let index = 0; index < createdRooms.length; index++) {
      const room = createdRooms[index]
      const option = document.createElement('option')
      option.value = index + 2
      option.innerHTML = room
      joinIdSelect.appendChild(option)
    }

    roomJoinDiv.classList.toggle('hide')
  })

  createButton.addEventListener('click', (e) => {
    roomCreateDiv.classList.toggle('hide')
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
    if (joinIdInput && joinIdInput.value !== '') {
      ID = joinIdInput.value
    } else {
      ID = selectRoom.options[selectRoom.selectedIndex].text
    }
    socket.emit('join-to-room', {
      message: 'Client attempt to join',
      roomId: ID,
    })
    room(event, roomJoinDiv, 'Room does not exist')
  })

  randomIdButton.addEventListener('click', (event) => {
    createIdInput.value = `${Math.trunc(Math.random() * 999)}-${Math.trunc(
      Math.random() * 999
    )}-${Math.trunc(Math.random() * 999)}`
  })

  leaveButton.addEventListener('click', (event) => {
    socket.emit('leave-the-room', {
      message: 'Client left the room',
      name: nameInput.value,
      roomId: ID,
    })
    window.location.reload()
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

  socket.on('user-left', (data) => {
    messages.insertAdjacentHTML(
      'beforeend',
      `
        <div class="alert alert-danger" id="message__alert" role="alert">
            <span>User ${data} left the room</span>
        </div>
      `
    )
  })
})
