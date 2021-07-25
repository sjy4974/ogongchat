//const moment = require('moment');

let generateMessage = (id,from, text) => {
    return {
      id,
      from,
      text
    };
  };

  module.exports = {generateMessage};