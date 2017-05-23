let messagesElement = document.getElementById('messages'),
    lastMessageElement = null,
    roomsList = document.getElementById('roomsList'),
    inputElement = document.getElementById('input');
    socket = io.connect('http://localhost:4000');

socket.on('serverMessage', function (content,isMe) {
    addMessage(content, isMe);
});

socket.on('login', function () {
    let username = prompt('What username would you like to use?');
    socket.emit('login', username);
});

socket.on('newRoom', function () {
    socket.emit('getRooms')
});

socket.on('rooms',function (rooms) {
    roomsList.innerHTML = "";
    rooms.forEach((room) => addRoom(room));
});

function joinRoom(room) {
    socket.emit('join', room);
}

function sendMessage(message) {
    socket.emit('clientMessage', message);
}

inputElement.onkeydown = function (keyboardEvent) {
    if (keyboardEvent.keyCode === 13) {
        sendMessage(inputElement.value);
        inputElement.value = '';
        return false;
    } else {
        return true;
    }
};

document.getElementById('add-room-button').onclick = function (ev) {
    let newRoomName = prompt('Please enter room name:');
    addRoom(newRoomName);
    joinRoom(newRoomName);
};

function addRoom(roomName) {
    let roomContainer = document.createElement('div');
    let roomButton = document.createElement('button'),
        roomText = document.createTextNode(roomName);

    roomButton.classList += ' button btn';
    roomContainer.classList += ' room-node';

    roomButton.appendChild(roomText);
    roomContainer.appendChild(roomButton);

    roomButton.onclick = onRoomClick;

    roomsList.appendChild(roomContainer);
}

function onRoomClick(event) {
    joinRoom(event.target.textContent)
}

function addMessage(message, isMe) {
    let userImage = document.createElement('img');
    userImage.src = "./images/user.png";
    userImage.classList += ' user-image';
    let newMessageElement = document.createElement('div'),
        newMessageText = document.createTextNode(message);
    newMessageElement.classList += ' user-message-node';

    if (isMe) {
        newMessageElement.style.direction = 'ltr';
    } else {
        newMessageElement.style.direction = 'rtl';
    }

    newMessageElement.appendChild(userImage);
    newMessageElement.appendChild(newMessageText);

    messagesElement.insertBefore(newMessageElement,
        lastMessageElement);
    lastMessageElement = newMessageElement;
}