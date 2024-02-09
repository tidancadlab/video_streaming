const express = require('express');
const http = require('http');
const cors = require('cors');
const api = require('./App');
const { infoLog } = require('./Models/Helper/console');
require('dotenv').config();

const { PORT = 8080 } = process.env;

//  <-------------------------------Variables - Start---------------------------------------------->
const app = express();
const server = http.createServer(app);

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
