

class Users {
    
    constructor () {
        
        this.people = [];

    }

    addPerson(id, name, sala) {
        let person = {id, name, sala};

        this.people.push(person);

        return this.people;
    }


    getPerson(id) {

        let person = this.people.filter( person =>  person.id === id )[0];

        return person;
    }

 
    getPeople() {
        return this.people;
    }

    getPersonByRoom( room ) {
        let personInRoom = this.people.filter( person => person.sala === room);

        return personInRoom;
    }

    removePerson(id) {

        let deletedPerson = this.getPerson(id);

        this.people = this.people.filter( person => person.id != id);

        return deletedPerson;
    }


}




module.exports = {
    Users
};