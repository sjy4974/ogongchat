class Users {
    constructor() {
      this.users = [];
    }
  
    addUser(socketId, email, name, profile, room) {
      let user = {socketId, email, name, profile, room};
      this.users.push(user);
      return user;
    }
  
    getUserList (room) {
      let users = this.users.filter((user) => user.room === room);
      return users;
    }
  
    getUser(id) {
      return this.users.filter((user) => user.socketId === id)[0];
    }
  
    removeUser(id) {
      let user = this.getUser(id);
  
      if(user){
        this.users = this.users.filter((user) => user.socketId !== id);
      }
  
      return user;
    }
  
  }
  
  module.exports = {Users};