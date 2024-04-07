const express = require('express');
const http = require('http');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const api = require('./App');
const { warnLog, infoLog } = require('./logger');
const initializeDatabase = require('./Database');
const videoConversion = require('./ffmpeg');
const { getMeteData } = require('./Middleware/video');
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
  // try {
  //   const data = await getMeteData('C:/Coding/storage/34d7799b-6635-425c-8df8-4f80ecb8cac4/original.mp4');
  //   console.log(data);
  // } catch (error) {
  //   console.log(error);
  // }
  server.listen(PORT, async () => {
    api(app);
    warnLog(`The server is Running on port ${PORT}`, 'server');
  });
  server.on('dropRequest', (e) => console.log(e));
  server.on('close', () => console.log('HTTP Server stopped'));
}

runServer();

module.exports = app;
