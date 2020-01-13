class Room{
    constructor({ title, user }){
        this.id = Room.instances.length + 1;
        this.title = title;
        this.users = [user];
        this.messages = [];
        Room.instances.push(this);
    }
}
Room.instances = [];

module.exports = Room;
