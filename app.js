/*********************
     Init web server
**********************/
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => {
    res.send(`<h1>Hello world</h1><script src="/socket.io/socket.io.js"></script>
    <script>
      var socket = io();
      socket.on('serial data', (data) => console.log(data));
    </script>`);
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

http.listen(3001, () => {
    console.log('listening on *:3001');
});

/********************
 *  Init SERIAL PORT
 *******************/
const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const port = new SerialPort("COM3", { baudRate: 115200 })

const parser = new Readline()
port.pipe(parser)

// Read serial data when available
parser.on('data', line => { 
    console.log(`> ${line}`);
    io.emit('serial data', line);
})
// port.write('ROBOT POWER ON\n')
//> ROBOT ONLINE