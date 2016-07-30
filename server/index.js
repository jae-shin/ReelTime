// Requires
const express = require('express');
const socket = require('socket.io');
const http = require('http');

// Init
const app = express();
const server = http.createServer(app);
const io = socket.listen(server);

// Config
const EXPRESS_PORT = 3000;

// Routes
app.use(express.static(`${__dirname}/../client`));


const files = {
  video: [],
  audio: [],
  image: []
};

// Socket.io
io.on('connection', (socket) => {
  console.log('A user connected with socket id', socket.id);

  socket.on('disconnect', () => {
    console.log('A user disconnected with socket id', socket.id);
  });

  socket.on('room', function(room) {
    socket.join(room);
  });

  // Add filenames to files object
  socket.on('add media', (name, type, file) => {
    if (type === 'video') {
      files.video.push({name: name, file:file});
    } else if (type === 'audio') {
      files.audio.push({name: name, file:file});
    } else if (type === 'image') {
      files.image.push({name: name, file:file});
    }
    io.emit('add media', files);
  });

  // Chat messaging events
  socket.on('chat message', (msg, roomId) => {
    console.log('MSG: ', msg);
    console.log('RoomID: ', roomId);

    socket.to(roomId).broadcast.emit('chat message', msg);
  });

  // Video sync events
  socket.on('play', (time) => {
    console.log('Play command recieved');
    socket.broadcast.emit('play', time);
  });

  socket.on('pause', (time) => {
    console.log('Pause command recieved');
    socket.broadcast.emit('pause', time);
  });

  socket.on('newFile', (fileType) => {
    console.log('New file type command recieved');
    socket.broadcast.emit('newFile', fileType);
  });

  socket.on('switchFile', (fileType) => {
    console.log('switch file type command recieved');
    socket.broadcast.emit('switchFile', fileType);
  });

  socket.on('media update', (filler) => {
    console.log('media update command recieved');
    socket.broadcast.emit('media update', filler);
  });

  socket.on('media switch', (filler) => {
    console.log('media switch command recieved');
    socket.broadcast.emit('media switch', filler);
  });

  socket.on('test', (filler) => {
    console.log('this is a test');
  });
});


server.listen(process.env.PORT || EXPRESS_PORT);
console.log(`Listening on port ${EXPRESS_PORT}`);
