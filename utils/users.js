class Users {
    constructor() {
      this.users = [];
    }
  
    addUser(email, name, profile, room) {
      let user = {email, name, profile, room};
      this.users.push(user);
      return user;
    }
  
    getUserList (room) {
      let users = this.users.filter((user) => user.room === room);
      // console.log("여기 users");
      // console.log(users);
      // let namesArray = users.map((user) => user.name);
      return users;
    }
  
    getUser(email) {
      return this.users.filter((user) => user.email === email)[0];
    }
  
    removeUser(email) {
      let user = this.getUser(email);
  
      if(user){
        this.users = this.users.filter((user) => user.email !== email);
      }
  
      return user;
    }
  
  }
  
  module.exports = {Users};