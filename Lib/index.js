const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
// const auth = require('./auth');
const { PORT = 8080 } = process.env;

//  <-------------------------------Variables - Start---------------------------------------------->
const app = express();
const server = http.createServer(app);
const io = new WebSocket.Server({ server });

io.on('connection', (socket) => {
  socket.send('connect');
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use(express.json());
app.use(cors('*'));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// <------------------------------Routes - Start---------------------------------------------->
app.use('/api/upload', require('./Routes/Upload'));
app.use('/api/auth/register', require('./Routes/Register'));
app.use('/api/auth/login', require('./Routes/Login'));

app.use('/test/', require('../Test'));

app.use('/', express.static('./Bin'));

// <-----------------------------------PORT------------------------------------->
server.listen(PORT, () => {
  console.info(`-----> The server is Running on : ${PORT} Port`);
});

module.exports = { app, io };
