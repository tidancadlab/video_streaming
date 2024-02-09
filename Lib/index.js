const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const cors = require('cors');
const api = require('./App');
const { infoLog, errorLog } = require('./Models/Helper/console');
require('dotenv').config();

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
app.use('/app', express.static('./app'));
app.use('/video', express.static('Bin'));
// <-----------------------------------PORT------------------------------------->
server.listen(PORT, () => {
  api(app);
  infoLog(`The server is Running on port ${PORT}`, 'server');
});

module.exports = app;
