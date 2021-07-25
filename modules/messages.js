const mongoose = require('mongoose');

const msgSchema = new mongoose.Schema({
    studyNo:{
        type:'string',
        required:true
    },
    email:{
        type:'string',
    },
    message:{
        type:'string',
        required:true
    }  
});


// const studSchema = new mongoose.Schema({
//     studyNo:{
//         type:'string',
//         required:true
        
//     }
// });

const Msg = mongoose.model('Msg', msgSchema);
// const StudyList = mongoose.model('StudyList', studSchema);
module.exports = Msg;
// module.exports = StudyList;