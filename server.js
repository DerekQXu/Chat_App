const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

var port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: true }))

require('./app/routes')(app, {});

var nsp = io.of('/my-namespace')
var name2id = new Map();
var id2name = new Map();

nsp.on('connection', function(socket){
  console.log('someone connected');
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

nsp.on('connection', function(socket){
  console.log(socket.id + ' connected');
  var name;
  do{
    name = 'anon' + Math.floor(Math.random() * 1001);
  } while (name2id.get(name) != undefined)
  name2id.set(name, socket.id);
  id2name.set(socket.id, name);
  nsp.emit('server message', name + ' has joined the room!');

  socket.on('disconnect', function(){
    console.log('user disconnected');
    name2id.delete(name);
    id2name.delete(socket.id);
    nsp.emit('server message', name + ' has left the room!');
  });

  socket.on('chat message', function(msg){
    name = id2name.get(socket.id);
    console.log(name + ': ' + msg);

    nsp.emit('chat message', name + ": " + msg);
    if (msg.substring(0,6) == "\\name="){
      new_name = msg.substring(6,msg.length);

      if (name2id.get(socket.id) == undefined && new_name.indexOf(":") == -1){
        nsp.emit('server message', name + ' has changed name into ' + new_name);
        name2id.delete(socket.id)
        name2id.set(new_name, socket.id);
        id2name.set(socket.id, new_name);
      }
      else{
        nsp.emit('server message', 'The name, ' + new_name + ', is currently being used.')
      }
    }
  });

  socket.on('update', function(msg){
    name = id2name.get(socket.id);
    nsp.emit('update', name + ": " + msg);
  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

