let messagesElement = document.getElementById('messages'),
    lastMessageElement = null;
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
let socket = io.connect('http://localhost:4002');
socket.on('serverMessage', function (content) {
    addMessage(content);
});
socket.on('login', function () {
    let username = prompt('What username would you like to use?');
    socket.emit('login', username);
});
function sendCommand(command, args) {
    if (command === 'j') {
        socket.emit('join', args);
    } else {
        alert('unknown command: ' + command);
    }
}
function sendMessage(message) {
    let commandMatch = message.match(/^\/(\w*)(.*)/);
    if (commandMatch) {
        sendCommand(commandMatch[1], commandMatch[2].trim());
    } else {
        socket.emit('clientMessage', message);
    }
}
let inputElement = document.getElementById('input');
inputElement.onkeydown = function (keyboardEvent) {
    if (keyboardEvent.keyCode === 13) {
        sendMessage(inputElement.value);
        inputElement.value = '';
        return false;
    } else {
        return true;
    }
};

var roomsList = document.getElementById('roomsList');

document.getElementById('add-room-button').onclick = function (ev) {
    addRoom('dsadsa');
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

function onRoomClick() {
    alert('you clicked me');
}