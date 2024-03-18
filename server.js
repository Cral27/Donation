const express = require("express");
const app = express();
const session = require('express-session');
const server = app.listen(1337, function(){
    console.log('Listening on port 1337');
});

// more new code:
app.use(session({
    secret: 'keyboardkitteh',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
  }))


const io = require('socket.io')(server);
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/static"));

app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));

let value = 0; 
let counter = 0; 

app.get('/', function(req, res){
    res.render('index');
})

io.on('connection', function(socket){
    socket.on('beta', function(data){
        value += data.money;
        counter += data.count;
        console.log(data.money);
        io.emit('updateAllClients', {money: value, counter: counter});
    })
})

