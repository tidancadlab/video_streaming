const http = require('http');
const cors = require('cors');
const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const api = require('./App');
const { infoLog } = require('./logger');
const videoConversion = require('./ffmpeg');
const initializeDatabase = require('./Database');

const app = express();
const server = http.createServer(app);
const { PORT = 8080 } = process.env;

app.use(express.json());
app.use(cors('*'));
app.use(cookieParser());

async function runServer() {
  await initializeDatabase();
  videoConversion.init();
  server.listen(PORT, async () => {
    api(app);
    infoLog(`Server is Running on port ${PORT}`, 'server');
  });
}

runServer();

module.exports = app;
