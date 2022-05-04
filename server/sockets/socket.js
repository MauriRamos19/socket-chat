const { io } = require('../server');
const { Users } = require('../models/users');
const { createMessage } = require('../utilities/utilities');

const users = new Users();


io.on('connection', (client) => {

    client.on('getInChat', (data, callback) => {
        
        if( !data.name || !data.sala) {
            return callback({
                error: true,
                message: 'El nombre es necesario'
            });
        }


        client.join(data.name);

        users.addPerson( client.id, data.name, data.sala );

        

        client.broadcast.to(data.sala).emit('listPeople', users.getPersonByRoom(data.sala));
        callback(users.getPersonByRoom(data.sala));
    });

    client.on('createMessage', (data) => {

        let person = users.getPerson(client.id);
        let message = createMessage(person.name, data.message);
        client.broadcast.to(person.sala).emit('createMessage',message);
    });



    client.on('disconnect', () => {


        let deletedPerson = users.removePerson( client.id );


        client.broadcast.to(deletedPerson.sala).emit('createMessage', createMessage('Administrador',`${deletedPerson.name} salio`));
        client.broadcast.to(deletedPerson.sala).emit('listPeople', users.getPersonByRoom(deletedPerson.sala));
    });



    //Mensaje privado 
    client.on('private-message', data => {

        let person = users.getPerson(client.id);
        client.broadcast.to(data.para).emit('private-message', createMessage(person.name.trim(),data.message));
    });
});