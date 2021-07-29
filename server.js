let siofu = require("socketio-file-upload");
let ss = require("socket.io-stream");
let express = require('express');
let path = require("path");
let http = require('http');
let static = require('serve-static');
let fs = require('fs');
let mime = require("mime/lite");
let app = express();

app.use(express.urlencoded({ extended: true }))
app.use(express.json());

app.set('view engine','ejs');
app.use(express.static('public'));
app.use('/public', static(__dirname));
app.use(express.static(path.join(__dirname, "/files")));
var PORT = process.env.PORT||82;  

 var httpServer = http.createServer(app).listen(PORT, function() {
   console.log('listening on *:82');
})
const io = require('socket.io')(httpServer, { cors: { origin: "*" } });

const {Users} = require('./utils/users');
const {generateMessage} = require('./utils/message');
let users = new Users();

//mongoose//
const mongoose = require('mongoose');
const Msg = require('./modules/messages');
const mongoDB = 'mongodb+srv://sjy4974:qwe123@cluster0.w7ej2.mongodb.net/message-database?retryWrites=true&w=majority'
////////////
 mongoose.connect(mongoDB, {useNewUrlParser: true,
 useUnifiedTopology: true,
 useCreateIndex: true}).then(() => {
     console.log('connected');
}).catch(err => console.log(err));

//전달 데이터 생성//



app.get('/', (req,res) => {
    var query = req.query;
    console.log(query);
    res.render('chat', query);
});

app.get('/1', (req,res) => {
  res.render('index');
});


io.on('connection', (socket) => {
    console.log(" user connect");

    socket.on('join', (data, callback) => {
      
      // 전달할 데이터 생성하기.
      //??
      socket.join(data.studyNo);
      users.removeUser(data.email);
      users.addUser(data.email, data.nickname, data.profile, data.studyNo);

      io.to(data.studyNo).emit('updateUsersList', users.getUserList(data.studyNo));

      console.log("user : "+users.getUserList(data.studyNo));
      socket.broadcast.to(data.studyNo).emit('newMessage', generateMessage('SERVER','Admin', data.nickname+" 님이 접속 하셨 습니다."));
    
      callback();
    });


    ss(socket).on('upload', (stream,data) =>{
      
      var fn = path.basename(data.name);
      console.log(fn);
      stream.pipe(fs.createWriteStream("public/files/"+fn));

      // io.to(data.studyNo).emit('newMessage',{
      //   id: data.id,
      //     from: data.email,
      //     name: data.name,
      //     type: data.type   
      // });
    });

    socket.on("done", (data) => {
      io.to(data.studyNo).emit('newMessage',{
          email: data.email,
          name: data.name,
          filename: data.filename,
          type: data.type   
      });
    })

/*
    socket.on('buffering',(message) =>{
        
      var writer = fs.createWriteStream(path.resolve('public/files', message.name), {
        encoding: 'base64'
      });

      writer.write(message.data);
      writer.end();

      writer.on('finish', ()=>{
        
        io.to(message.studyNo).emit('newMessage', {
          id: message.id,
          from: message.email,
          name: 'files/'+message.name,
          type: message.type   
        });
      });


    });

*/



/*
    //여기 이미지전송받는 부분
    socket.on('upload-image', (message) => {
      console.log("blob :"+message.blob);

      
      //fileMime = mime.getType(message.name);

      var writer = fs.createWriteStream(path.resolve('public/images', message.name), {
        encoding: 'base64'
      });

      writer.write(message.data);
      writer.end();

      writer.on('finish', ()=>{
        
        io.to(message.studyNo).emit('newMessage', {
          id: message.id,
          from: message.email,
          name: 'images/'+message.name     
        });
      });
    });
  */



    socket.on('createMessage', (data, callback) => {
      console.log("createmessage data값");
      console.log(data);
      
      let user = users.getUser(data.email);
      const msg = new Msg({studyNo:user.room, email:data.email, message:data.text});

      msg.save().then(()=>{
      io.to(user.room).emit('newMessage', generateMessage(user.email, user.name, data.text));
      });
      callback('This is the server:');
    });

  
    socket.on('disconnect', () => {
      let user = users.removeUser(socket.id);
  
      if(user){

        io.to(user.room).emit('updateUsersList', users.getUserList(user.room));
        io.to(user.room).emit('newMessage', generateMessage('SERVER','Admin', `${user.name} 님이 채팅 접속종료 .`));

      }
    });


    //파일업로드 //

    // let uploader = new siofu();

    // uploader.dir="upload";

    // uploader.listen(socket);


    // uploader.on("saved", (event) =>{
    //   console.log(event.file);
    // });

    // uploader.on("error", (event) =>{
    //   console.log("Error from uploader", event);
    // });

    

  });
 


