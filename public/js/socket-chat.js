

var socket = io();

var params = new URLSearchParams( window.location.search );

if( !params.has('name') || !params.has('sala') ) {
    window.location = 'index.html';
    throw new Error('El nombre y sala son necesarios');
}

var user = {
    name: params.get('name'),
    sala: params.get('sala')
};

socket.on('connect', function() {
    console.log('Conectado al servidor');

    socket.emit('getInChat', user, function( resp ){
        console.log('Usuarios conectados', resp);
    });

});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');
    

});


// Enviar información
/* socket.emit('createMessage', {
    name: 'Fernando',
    message: 'Hola Mundo'
}, function(resp) {
    console.log('respuesta server: ', resp);
});  */

// Escuchar información
socket.on('createMessage', function(mensaje) {

    console.log('Servidor:', mensaje);

});

// Private Message
socket.on('private-message', function(message) {
    console.log('Mensaje privado', message);
});

//Escuchar cambios de usuarios cuando un usuario
//entra o sale del chat
socket.on('listPeople', function(people) {

    console.log(people);

});
