const express = require('express');
const http = require('http');
const cors = require('cors');
const api = require('./App');
const { warnLog } = require('./logger');
const config = require('../config');
require('dotenv').config();

const { PORT = 8080 } = process.env;
const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors('*'));
app.use('/storage', express.static(config.PATH.VIDEO_STORAGE));

server.listen(PORT, async () => {
  api(app);
  warnLog(`The server is Running on port ${PORT}`, 'server');
});

module.exports = app;
