const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

var port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: true }))

var name2id = new Map();
var id2name = new Map();

require('./app/routes')(app, {});

var nmspc = io.of('/');
// NameSPace because I can't keep using socket socket socket as a name.

http.listen(port, function(){
  console.log('listening on *:'+port);
});

app.get('/*', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

nmspc.on('connection', function(socket){
  
  socket.on('variabledump', function(data){
    nmspc.testerino = data;
  });

  console.log(socket.id + ' connected from ' + nmspc.testerino);

  
  // Name generation ran everyime a socket connects.
  var name;
  do{
    name = 'anon' + Math.floor(Math.random() * 1001);
  } while (name2id.get(name) != undefined)
  name2id.set(name, socket.id);
  id2name.set(socket.id, name);
  nmspc.emit('server message', name + ' has joined the room!');
  
  socket.on('disconnect', function(){
    console.log('user disconnected');
    name2id.delete(name);
    id2name.delete(socket.id);
    nmspc.emit('server message', name + ' has left the room!');
  });

  socket.on('message confirm', function(msg){
    name = id2name.get(socket.id);
    console.log(name + ': ' + msg);
    nmspc.emit('chat message', name + ": " + msg);
    
    if (msg.substring(0,6) == "\\name="){
      maxnamelength = 6+14;
      new_name = msg.substring(6,Math.min(maxnamelength, msg.length));
      
      if (name2id.get(socket.id) == undefined && new_name.indexOf(":") == -1){
        nmspc.emit('server message', name + ' has changed name into ' + new_name);
        name2id.delete(socket.id)
        name2id.set(new_name, socket.id);
        id2name.set(socket.id, new_name);
      }
      else{
        nmspc.emit('server message', 'The name, ' + new_name + ', is currently being used.')
      }
    }
  });

  socket.on('update', function(msg){
    name = id2name.get(socket.id);
    nmspc.emit('update', name + ": " + msg);
  });

  socket.on('roomdeclare', function(room){
	 socket.join(room);
	 console.log(name + 'has joined the room from: ' + room);
	 nmspc.emit('server message', name + 'has joined the room from: ' + room);
  });
  
  
});



