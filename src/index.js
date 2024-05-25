const express = require('express');
const http = require('http');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const api = require('./App');
const { warnLog } = require('./logger');
const initializeDatabase = require('./Database');
const videoConversion = require('./ffmpeg');
require('dotenv').config();

const { PORT = 8080 } = process.env;
const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors('*'));
app.use(cookieParser());

async function runServer() {
  await initializeDatabase();
  videoConversion.init();
  server.listen(PORT, async () => {
    api(app);
    warnLog(`The server is Running on port ${PORT}`, 'server');
  });
  server.on('dropRequest', (e) => console.log(e));
  server.on('close', () => console.log('HTTP Server stopped'));
}

runServer();

module.exports = app;
