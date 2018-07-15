const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

var port = process.env.PORT || 3000;
// port = 8000;

app.use(bodyParser.urlencoded({ extended: true }))

require('./app/routes')(app, {});
/*
app.listen(port, () => {
  console.log("We are live on " + port);
})
*/
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
  socket.on('update', function(msg){
    io.emit('update', msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:8000');
});

