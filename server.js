const express = require('express');
const app = express();

const MongoClient = require('mongodb').MongoClient;

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}))

app.get('/', function(req,res){
  res.sendFile(__dirname + '/public/redirect.html');
});

app.get('/r/*', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

// App.use public ought to be called at the end.
app.use(express.static('public'));

const http = require('http').Server(app);
const io = require('socket.io')(http);

var port = process.env.PORT || 3000;

var name2id = new Map();
var id2name = new Map();
var userlist = [];

var adjectives = ["abandoned", "abnormal", "able", "average", "absurd", "acceptable", "adorable", "alcoholic", "angry", "attractive", "bad", "beautiful", "bitter", "bizarre", "bored", "brave", "busy", "calm", "careful", "caring", "cheerful", "clever", "clumsy", "creepy", "curious", "cute", "damaged", "depressed", "diligent", "dirty", "drunk", "easy", "elderly", "entertaining", "eager", "fast", "flaky", "fluffy", "forgetful", "fragile", "funny", "gaudy", "glib", "good", "greedy", "grumpy", "groovy", "healthy", "hungry", "high", "happy", "harmonious", "helpful", "icky", "illegal", "imaginary", "incredible", "intelligent", "jealous", "jobless", "juvenile", "jumpy", "kind", "lazy", "lethal", "lewd", "lively", "lonely", "loud", "lovely", "lying", "magical", "magnificent", "materialistic", "meek", "mellow", "mysterious", "naive", "naughty", "needy", "nervous", "normal", "nutty", "obedient", "obscene", "outrageous", "organic", "open", "peaceful", "perfect", "plastic", "powerful", "polite", "pumped", "quick", "quaint", "quirky", "rare", "rebel", "reflective", "remarkable", "responsible", "robust", "rude", "sad", "salty", "scandalous", "sacred", "serious", "shallow", "simple", "squeamish", "smart", "special", "spooky", "strange", "tacky", "talented", "tedious", "tense", "terrific", "thirsty", "troubled", "unbiased", "unusual", "upbeat", "unique", "unknown", "ultra", "wholesome", "wild", "witty", "woozy", "xenophobic", "young",  "zesty", "zany"];
var animals = ["aardvark", "albatross", "alligator", "alpaca", "anteater", "antelope", "ape", "armadillo", "baboon", "badger", "barracuda", "bat", "bear", "beaver", "bee", "bison", "boar", "buffalo", "butterfly", "camel", "capybara", "caribou", "cat", "caterpillar", "cattle", "cheetah", "chicken", "chimpanzee", "chinchilla", "clam", "cobra", "coyote", "crab", "crane", "crocodile", "crow", "deer", "dinosaur", "dog", "dolphin", "donkey", "dove", "duck", "eagle", "eel", "elephant", "elk", "emu", "falcon", "ferret", "fish", "flamingo", "fly", "fox", "frog", "gazelle", "gerbil", "giraffe", "gnat", "gnu", "goat", "goose", "goldfish", "gorilla", "grasshopper", "guinea-pig", "gull", "hamster", "hare", "hawk", "hedgehog", "heron", "herring", "hippo", "hornet", "horse", "hummingbird", "hyena", "jackal", "jaguar", "jay", "jellyfish", "kangaroo", "kingfisher", "koala", "lemur", "leopard", "lion", "llama", "lobster", "locust", "magpie", "mallard", "manatee", "mantis", "meerkat", "mink", "mole", "mongoose", "monkey", "moose", "mouse", "mosquito", "mule", "narwhal", "newt", "octopus", "opossum", "oryx", "ostrich", "otter", "owl", "ox", "oyster", "panther", "parrot", "pelican", "penguin", "pheasant", "pig", "pigeon", "polar-bear", "pony", "porcupine", "porpoise", "prairie-dog", "quail", "rabbit", "raccoon", "rail", "ram", "rat", "raven", "reindeer", "rhinoceros", "salamander", "salmon", "sardine", "scorpion", "sea-lion", "sea-urchin", "seahorse", "seal", "shark", "sheep", "skunk", "snail", "snake", "sparrow", "spider", "squid", "squirrel", "starling", "stingray", "stork", "swallow", "swan", "tiger", "toad", "trout", "turkey", "turtle", "viper", "vulture", "wallaby", "walrus", "wasp", "water-buffalo", "weasel", "whale", "wolf", "wolverine", "wombat", "woodpecker", "worm", "yak", "zebra"];
var regexp = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i
// for link detection, eventually. 

require('./app/routes')(app, {});

http.listen(port, function() {
    console.log('listening on *:' + port);
});



// let us move to new html pages :)
app.post('/create_room', function(req, res) {
    var room_name = req.body.room_name;
    console.log('joining room: ' + room_name)
        //res.sendFile(__dirname + '/room.html')
})

function userclear(name) {
    userlist = userlist.filter(function(item) {
        return item !== name
    })
}

io.on('connection', function(socket) {

    var name;
    var socketroom;
    
    do {
        name = adjectives[Math.floor(Math.random() * adjectives.length)] +
               " " + animals[Math.floor(Math.random() * animals.length)];
    } while (name2id.get(name) != undefined)
    name2id.set(name, socket.id);
    id2name.set(socket.id, name);
    io.emit('server message', name + ' has joined the room!');
    console.log('server message', name + ' has joined the room!');

    // add name to the userlist, used in the "X in the room"
    userlist.push(name);
    io.emit('usercount', userlist);

    //TODO
    socket.on('connection', function(socket) {
        socket.join('');
    })

    socket.on('disconnect', function() {
        console.log('user disconnected');
        io.emit('close message', name);

        name2id.delete(name);
        id2name.delete(socket.id);
        io.emit('server message', name + ' has left the room!');

        // remove name from the userlist.
        userclear(name);

        io.emit('usercount', userlist);

    });

    // When you don't have to check for commands, and want to preset names.
    socket.on('nocheck confirm', function(msg, name) {
        io.emit('chat message', name + ": " + msg)
    });

    socket.on('message eval', function(msg, toggle=1) {
        msg = '' + msg; // using the evils of javascript for the power of good.
        msg = msg.trim(); // removing excess spaces from beggining and end
        var name = id2name.get(socket.id);

        // I don't want to deal with if elses. uwu
        switch (true) {
            default:
                if (msg !== ""){
                  if (toggle == 0){
                    io.emit('chat message', name + ": " + msg)
                  }
                  else{
                    io.emit('publish message', name);                    
                  }
                }
                break;
            case msg.substring(0, 5) == "/name":
              var maxnamelength = 6 + 24;
              var new_name = msg.substring(6, Math.min(maxnamelength, msg.length)).trim();
              
              if (name2id.get(socket.id) == undefined && new_name.indexOf(":") == -1 || new_name != "") {
                
                if(new_name == ""){
                  do {
                  new_name = adjectives[Math.floor(Math.random() * adjectives.length)] + " " + animals[Math.floor(Math.random() * animals.length)];
                  } while (name2id.get(new_name) != undefined)
                }
                
                io.emit('server message', name + ' has changed name into ' + new_name);
                name2id.delete(socket.id)
                name2id.set(new_name, socket.id);
                id2name.set(socket.id, new_name);
                userclear(name);
                userlist.push(new_name)
                io.emit('close message', name);

                } else {
                  io.emit('server message', 'The name, ' + new_name + ', is currently being used.')
                }
                io.emit('usercount', userlist);
                break;
        }
    });
    
    socket.on('update', function(msg) {
        name = id2name.get(socket.id);
        io.emit('update', name + ": " + msg);
    });

    socket.on('update message', function(msg) {
        name = id2name.get(socket.id);
        io.emit('update message', msg, name);
    });

    socket.on('open the message stop having it be closed', function() {
        name = id2name.get(socket.id);
        io.emit('new message', name);
    });

    socket.on('close message', function() {
        name = id2name.get(socket.id);
        io.emit('close message', name);
    });
    
    socket.on('is typing', function() {
        name = id2name.get(socket.id);
        io.emit('is typing', name);
    });
    
    socket.on('roomdeclare', function(room) {
        socketroom = room;
        socket.join(room);
        console.log(name + 'has joined the room from: ' + room);
        io.emit('server message', name + 'has joined the room from: ' + room);
    });
});