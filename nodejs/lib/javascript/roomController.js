class Room{
    constructor(title, user){
        this.id = Room.instances.length;
        this.title = title;
        this.users = [];
        this.messages = [];
        Room.instances.push(this);
    }
}
Room.instances = [];

class Message{
    constructor(message, user, date){
        this.message = message;
        this.user = user;
        this.date = date;
    }
}

module.exports = {Message:Message, Room:Room,}
