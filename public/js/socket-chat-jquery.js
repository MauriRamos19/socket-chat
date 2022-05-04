
var params = new URLSearchParams(window.location.search);
//Funcicones para renderizar usuarios


var socket = io();
var nombre = params.get('nombre');
var sala = params.get('sala');

const divUsuarios = document.querySelector('#divUsuarios');
const formSend = document.querySelector('#formSend');
const txtMessage = document.querySelector('#txtMessage');
const divChatbox = document.querySelector('#divChatbox');

const obtenerId = ( id ) => {
    console.log( id );
};

function renderizarUsuarios(users) {
    
    var html = '';

    html += '<li>';
    html +=     `<a href="javascript:void(0)" class="active"> Chat de <span>${params.get('sala')}</span></a>`;
    html += '</li>';

    for (let i = 0; i < users.length; i++) {
        html += '<li>';
        html +=     `<a name="${users[i].id}" onclick="obtenerId(this.name)"href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>${users[i].name}<small class="text-success">online</small></span></a>`;
        html += '</li>';
        
    }

    divUsuarios.innerHTML = html;
    
}

function renderizarMensajes( message, yo ) {

    var html = '';

    var date = new Date(message.date);
    var hour = date.getHours() + ':' + date.getMinutes();

    var adminClass = 'info';

    if(message.name === 'Administrador') {
        adminClass = 'danger';
    }


    if( yo ) {
        html = `<li class="reverse animated fadeIn"">
                <div class="chat-content">
                    <h5>${message.name}</h5>
                    <div class="box bg-light-inverse">${message.message}</div>
                </div>
                <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user"></div>
                <div class="chat-time"${hour}</div>
           </li>`;
        
    } else {    

        html += '<li class="animated fadeIn">';

        if( message.name !== 'Administrador') {
            html += '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user"></div>';
        }
        html += `<div class="chat-content">
                    <h5>${message.name}</h5>
                    <div class="box bg-light-${adminClass}">${message.message}</div>
                </div>
                <div class="chat-time">${hour}</div>
            </li>`;
                
    }
    


    divChatbox.innerHTML += html;
}


function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}






formSend.addEventListener('submit', (e) => {
    e.preventDefault();

    if(txtMessage.value.trim().length === 0 ){
        return;
    }


    socket.emit('createMessage', {
        name: nombre,
        message: txtMessage.value
    }, function(message) {
        txtMessage.value = '';
        txtMessage.focus();
        renderizarMensajes(message,true);
        scrollBottom();
    });
});

