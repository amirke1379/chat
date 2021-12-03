
const chatbox = document.getElementById("chatbox")


const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const user = { username: username, room: room }

console.log(username, room);

//Setting title of page to room
document.title = room;



const socketEvent = io();


socketEvent.emit('join', user);




//Handling socket events from server

socketEvent.on('newChat', sent => {
    updateChatbox(sent);
    chatbox.scrollTop = chatbox.scrollHeight;
})



function send() {
    const message = document.getElementById("chatboxInput");

    const sentObject = {
        username: username,
        room: room,
        message: message.value
    }

    //Sends the input field to the server 
    socketEvent.emit('send', sentObject)

    //clears chat input
    message.value = "";

}

function updateChatbox(sent) {
    const messages = document.getElementById("messages");

    const message = document.createElement("li")
    console.log(sent);
    message.innerHTML = `${sent.username}: ${sent.message}`;

    messages.appendChild(message)
}

window.onbeforeunload = function () {
    socketEvent.emit('leave', user)
};