const { io } = require('../server');
const { Users } = require('../models/users');
const { createMessage } = require('../utilities/utilities');

const users = new Users();

io.on('connection', (client) => {

    client.on('getInChat', (data, callback) => {


        if (!data.nombre || !data.sala) {
            return callback({
                error: true,
                mensaje: 'El nombre/sala es necesario'
            });
        }

        client.join(data.sala);

        users.addPerson(client.id, data.nombre, data.sala);

        client.broadcast.to(data.sala).emit('listPeople', users.getPersonByRoom(data.sala));
        client.broadcast.to(data.sala).emit('createMessage', createMessage('Administrador', `${ data.nombre } se unió`));

        callback(users.getPersonByRoom(data.sala));

    });

    client.on('createMessage', (data, callback) => {

        let person = users.getPerson(client.id);

        let message = createMessage(person.name, data.message);
        client.broadcast.to(person.sala).emit('createMessage', message);
        

        callback(message);
    });


    client.on('disconnect', () => {

        let deletedPerson = users.removePerson(client.id);

        client.broadcast.to(deletedPerson.sala).emit('createMessage', createMessage('Administrador', `${ deletedPerson.name } salió`));
        client.broadcast.to(deletedPerson.sala).emit('listPeople', users.getPersonByRoom(deletedPerson.sala));
    });



    // Mensajes privados
    client.on('private-message', data => {

        let persona = users.getPerson(client.id);
        client.broadcast.to(data.para).emit('private-message', createMessage(persona.nombre, data.mensaje));

    });

});