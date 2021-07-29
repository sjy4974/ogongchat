//const moment = require('moment');

let generateMessage = (email, nickname, text) => {
    return {
      email,
      nickname,
      text
    };
  };

  module.exports = {generateMessage};