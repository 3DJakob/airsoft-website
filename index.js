
var ejs = require('ejs');
var http = require('http');
var express = require('express');
var socketio = require('socket.io');

var app = express();
var server = http.createServer(app);
var io = socketio(server);

app.set('views', __dirname + '/views');
app.engine('ejs', ejs.renderFile);
app.use(express.static('public'));

var messages = [];
var attendance = { jakob: true };

io.on('connection', function (socket) {

  socket.emit('chat log', messages);
  socket.emit('attendance log', attendance);

  socket.on('chat message', function (msg) {
    io.emit('chat message', msg);
    messages.push(msg);
  });

  socket.on('attendance update', function (msg) {
    io.emit('attendance update', msg);
    attendance[msg.name] = msg.attendance;
  });

});

app.get('/', function (req, res) {
  res.render('page_index.ejs');
});

app.get('/chat', function (req, res) {
  res.render('page_chat.ejs');
});

server.listen(3000, function () {
  console.log('http://localhost:3000');
});
