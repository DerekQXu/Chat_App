// Express, body parser.
const express = require('express'),
  app = express(),
  bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/redirect.html');
});
app.get('/r/*', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});
app.get('/users/register', function (req, res) {
  res.sendFile(__dirname + '/public/register.html');
});
app.use(express.static('public'));

// mongodb part
const MongoClient = require('mongodb').MongoClient,
  mongoose = require('mongoose');
mongo_username = encodeURIComponent('realsyncchat');
mongo_password = process.env.PASSWORD;
url = "mongodb://" + mongo_username + ":" + mongo_password + "@cluster0-shard-00-00-rkcea.mongodb.net:27017,cluster0-shard-00-01-rkcea.mongodb.net:27017,cluster0-shard-00-02-rkcea.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true";

mongoose.connect(url, {useNewUrlParser: true});
var fs = require('fs'); // required for file serving TODO: change once database integrated
var stickerSchema = mongoose.Schema({
  name: String,
  image: String,
  created: {
    type: Date,
    default:
    Date.now
  }
});
var Sticker = mongoose.model('Sticker', stickerSchema);

function save_sticker(raw_img){
  var newSticker = new Sticker({
    name: "hawawa",
    image: raw_img
  });
  newSticker.save(function (err, newSticker) {
    if (err) {throw err;}
    console.log("Saved sticker image: " + newSticker.name);
  });
}

fs.readFile(__dirname + '/public/stickers/hawawa.png', function (err, buf){
  if (err) {throw err;}
  var cur_sticker = buf.toString('base64');
  save_sticker(cur_sticker);
})

const http = require('http').Server(app);
const io = require('socket.io')(http);

var port = process.env.PORT || 3000;
var _ = require('lodash');
// less worrying about iterating through arrays / objects.

var regexp = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i
// for link detection, eventually.

http.listen(port, function () {
  console.log('listening on *:' + port);
});

var adjectives = ["abandoned", "abnormal", "able", "average", "absurd", "acceptable", "adorable", "alcoholic", "angry", "attractive", "bad", "beautiful", "bitter", "bizarre", "bored", "brave", "busy", "calm", "careful", "caring", "cheerful", "clever", "clumsy", "creepy", "curious", "cute", "damaged", "depressed", "diligent", "dirty", "drunk", "easy", "elderly", "entertaining", "eager", "fast", "flaky", "fluffy", "forgetful", "fragile", "funny", "gaudy", "glib", "good", "greedy", "grumpy", "groovy", "healthy", "hungry", "high", "happy", "harmonious", "helpful", "icky", "illegal", "imaginary", "incredible", "intelligent", "jealous", "jobless", "juvenile", "jumpy", "kind", "lazy", "lethal", "lewd", "lively", "lonely", "loud", "lovely", "lying", "magical", "magnificent", "materialistic", "meek", "mellow", "mysterious", "naive", "naughty", "needy", "nervous", "normal", "nutty", "obedient", "obscene", "outrageous", "organic", "open", "peaceful", "perfect", "plastic", "powerful", "polite", "pumped", "quick", "quaint", "quirky", "rare", "rebel", "reflective", "remarkable", "responsible", "robust", "rude", "sad", "salty", "scandalous", "sacred", "serious", "shallow", "simple", "squeamish", "smart", "special", "spooky", "strange", "tacky", "talented", "tedious", "tense", "terrific", "thirsty", "troubled", "unbiased", "unusual", "upbeat", "unique", "unknown", "ultra", "wholesome", "wild", "witty", "woozy", "xenophobic", "young", "zesty", "zany"];
var animals = ["aardvark", "albatross", "alligator", "alpaca", "anteater", "antelope", "ape", "armadillo", "baboon", "badger", "barracuda", "bat", "bear", "beaver", "bee", "bison", "boar", "buffalo", "butterfly", "camel", "capybara", "caribou", "cat", "caterpillar", "cattle", "cheetah", "chicken", "chimpanzee", "chinchilla", "clam", "cobra", "coyote", "crab", "crane", "crocodile", "crow", "deer", "dinosaur", "dog", "dolphin", "donkey", "dove", "duck", "eagle", "eel", "elephant", "elk", "emu", "falcon", "ferret", "fish", "flamingo", "fly", "fox", "frog", "gazelle", "gerbil", "giraffe", "gnat", "gnu", "goat", "goose", "goldfish", "gorilla", "grasshopper", "guinea-pig", "gull", "hamster", "hare", "hawk", "hedgehog", "heron", "herring", "hippo", "hornet", "horse", "hummingbird", "hyena", "jackal", "jaguar", "jay", "jellyfish", "kangaroo", "kingfisher", "koala", "lemur", "leopard", "lion", "llama", "lobster", "locust", "magpie", "mallard", "manatee", "mantis", "meerkat", "mink", "mole", "mongoose", "monkey", "moose", "mouse", "mosquito", "mule", "narwhal", "newt", "octopus", "opossum", "oryx", "ostrich", "otter", "owl", "ox", "oyster", "panther", "parrot", "pelican", "penguin", "pheasant", "pig", "pigeon", "polar-bear", "pony", "porcupine", "porpoise", "prairie-dog", "quail", "rabbit", "raccoon", "rail", "ram", "rat", "raven", "reindeer", "rhinoceros", "salamander", "salmon", "sardine", "scorpion", "sea-lion", "sea-urchin", "seahorse", "seal", "shark", "sheep", "skunk", "snail", "snake", "sparrow", "spider", "squid", "squirrel", "starling", "stingray", "stork", "swallow", "swan", "tiger", "toad", "trout", "turkey", "turtle", "viper", "wallaby", "walrus", "wasp", "water-buffalo", "weasel", "whale", "wolf", "wolverine", "wombat", "woodpecker", "worm", "yak", "zebra"];

function generate_name() {
  do {
    adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    ani = animals[Math.floor(Math.random() * animals.length)];
    new_name = adj + " " + ani;
  } while (_.findIndex(users, {
    name: new_name
  }) != -1);
  return new_name;
}
// Creates a random pair of adjectives / animals that isn't currently used.

var seedrandom = require('seedrandom');

function generate_color(name){
  var rng = seedrandom(name);

  var r = (Math.round(rng()* 127) + 127).toString(16);
  var g = (Math.round(rng()* 127) + 127).toString(16);
  var b = (Math.round(rng()* 127) + 127).toString(16);
  return '#' + r + g + b;
}

function names_in_room(in_room) {
  usersinroom = _.filter(users, ['room', in_room]);
  // returns all objects in users in the same room as
  namelist = _.map(usersinroom, 'name');
  // returns a list of names
  output = "";
  for (i = 0; i < namelist.length - 1; i++) {
    output += namelist[i] + ", ";
  }
  output += namelist[namelist.length - 1];
  return output;
}
// Returns a (string) list of names of all same-room clients.

users = [];
// Array will be filled with clients, one created per socket.

var createDiceCup = require('dicecup');
var cup = createDiceCup({
  numberOfFacesOnLargestDie: 2000,
  numberOfRollsLimit: 40
});
var mexp = require('math-expression-evaluator');

io.on('connection', function (socket) {

  var client = {
    'id': socket.id,
    'name': generate_name(),
    'room': "",
    'color': "",
  }

  client.color = generate_color(client.name);
  users.push(client);

  socket.on('client entry', function (room) {
    client.room = room;
    socket.join(room);
    console.log(client.name + 'has joined the room: ' + client.room);
    io.in(client.room).emit('server message', client.name + ' has joined the room.');
    io.in(client.room).emit('usercount', names_in_room(client.room));
  });

  socket.on('disconnect', function () {
    console.log(client.name + ' has disconnected');
    io.in(client.room).emit('close message', client.name);
    io.in(client.room).emit('server message', client.name + ' has left the room!');
    users.pop(client);
    io.in(client.room).emit('usercount', names_in_room(client.room));
  });

  socket.on('message eval', function (msg, toggle = 1) {
    msg = '' + msg; // using the evils of javascript for the power of good.
    msg = msg.trim(); // removing excess spaces
    maxmsglength = 200;
    msg = msg.substring(0, Math.min(maxmsglength, msg.length));

    function send_message(msg_type) {
      if (msg !== "") {
        if (msg_type == "txt"){
          if (toggle == 0) {
            io.in(client.room).emit('chat message', msg, client.name, client.color);
          } else {
            io.in(client.room).emit('update message', msg, client.name, 1);
            io.in(client.room).emit('publish message', client.name);
          }
        }
        else if (msg_type == "img"){
          io.in(client.room).emit('image', msg, client.name, client.color);
        }
      }
    }

    switch (true) {

      default:
        send_message("txt");
        break;

      case msg.substring(0, 1) === ":":
        switch (true) {
          case msg.substring(0, 7) === ":hawawa":
            Sticker.findOne({ 'name':'hawawa' }, 'image', function(err, sticker) {
              if (err) {throw err}
              msg = sticker.image;
              send_message("img");
              console.log("sending hawawa");
            });
            break;
        }

      case msg.substring(0, 1) === "/":
        switch (true) {
          case msg.substring(0, 5) === "/flip":
            msg = "(╯°□°）╯︵ ┻━┻";
            send_message("txt");
            break;

          case msg.substring(0, 7) === "/unflip":
            msg = "┬─┬ ノ( ゜-゜ノ)";
            send_message("txt");
            break;

          case msg.substring(0, 6) === "/shrug":
            msg = "¯\\_(ツ)_/¯ ";
            send_message("txt");
            break;

          case msg.substring(0, 5) === "/spam":
            for(i=0; i<50; i++){
              io.in(client.room).emit('server message', "traps aren't gay");
            }
            break;

          case msg.substring(0, 3) == "/r ":
            rollstring = msg.substring(3, msg.length);
          case msg.substring(0, 6) == "/roll ":
            if (typeof rollstring === 'undefined')
              rollstring = msg.substring(6, msg.length);

            try {
              rollresult = cup.roll(rollstring);

              var newstring = '';
              for (i = 0; i < rollresult.length; i++) {
                if (i > 0)
                  newstring += '|  '
                newstring += '[' + rollresult[i]['rolls'] + '] '
                if (rollresult[i]['rolls'].length > 1)
                  newstring += 'Sum: ' + rollresult[i]['total'] + '  ';
              }

              if (newstring.length > 160) {
                newstring = newstring.substring(0, 160);
                newstring += " ..."
              }

              io.in(client.room).emit('server message', newstring);
              msg = rollstring;
              send_message("txt");

            } catch (error) {
              break;
            }
            break;

          case msg.substring(0, 2) === "/?":
          case msg.substring(0, 5) == "/help":
            if (msg.substring(0, 10) === "/help math" || msg.substring(0, 7) === "/? math") {
              io.in(client.room).emit('server message', "We all need help with math. See here: https://www.npmjs.com/package/math-expression-evaluator")
              break;
            }

            io.in(client.room).emit('server message', "/roll <dice notation> for nerds and conflict resolution. Start messages with '=' to do math.")
            io.in(client.room).emit('server message', "Really " + client.name + "? You really need help? /name for changing names. /help for help. Enter to open the chat bar.")

            break;

          case msg.substring(0, 5) == "/nick":
          case msg.substring(0, 5) == "/name":
            var maxnamelength = 6 + 24;
            var name = client.name;
            var new_name = msg.substring(6, Math.min(maxnamelength, msg.length)).trim();
            if (_.findIndex(users, {
              name: new_name
            }) == -1 && new_name != "") {
              client.name = new_name;
              client.color = generate_color(client.name)
            } else {
              client.name = generate_name();
              client.color = generate_color(client.name)
            }
            io.in(client.room).emit('server message', name + ' has changed name into ' + client.name);
            io.in(client.room).emit('close message', name);
            io.in(client.room).emit('usercount', names_in_room(client.room));
            break;

        }
        break;

      case msg.substring(0, 1) == "=":
        try {
          var value = mexp.eval(msg.substring(1, msg.length));
          msg = msg.substring(1, msg.length) + " = " + value;
          send_message("txt");
        } catch (error) {}
        break;

    }
  });

  socket.on('update message', function (msg, live_type) {
    msg = msg.substring(0, Math.min(120, msg.length)).trim();
    io.in(client.room).emit('update message', msg, client.name, live_type);
  });

  socket.on('open message', function (live_type) {
    if (live_type == 1)
      io.in(client.room).emit('new message', client.name, client.color);
    else
      io.in(client.room).emit('is typing', client.name);
  });

  socket.on('close message', function (animation=0) {
    io.in(client.room).emit('close message', client.name,animation);
  });

});

process.on('SIGINT', function(){
  Sticker.remove({}, function(err) {
    console.log('database cleared');
    process.exit();
  });
});

process.on('SIGUSR2', function(){
  Sticker.remove({}, function(err) {
    console.log('database cleared');
    process.exit();
  });
});

/*
//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));
//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
*/
